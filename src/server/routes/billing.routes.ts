
// src/server/routes/billing.routes.ts

import express from 'express';
import { auth } from '../middleware/auth';
import db from '../db';
import { asyncHandler, Errors } from '../middleware/errorHandler';
import { log } from '../utils/logger';

const router = express.Router();

// Get pending billable items for a patient
router.get('/pending-items/:patientId', auth, asyncHandler(async (req, res) => {
    const { patientId } = req.params;
    console.log("---------------------------------------------------");
    console.log(`[BILLING API] HIT pending-items for ${patientId}`);
    console.log("---------------------------------------------------");

    // DEBUG: Fake item to verify connectivity
    const debugItem = {
        id: 'DEBUG-1',
        name: 'DEBUG SYSTEM TEST ITEM',
        description: 'Verify API Connection',
        price: 999,
        quantity: 1,
        type: 'Admin',
        source_id: '000',
        date: new Date()
    };
    // We will push this at the end


    // 0. Check Patient Status for Registration Fee
    const patient = await db('patients').where('id', patientId).first();
    const pendingItems: any[] = [];

    if (patient && patient.status === 'pending_payment') {
        pendingItems.push({
            id: `REG-${patient.id}`,
            source_id: patient.id,
            type: 'Registration',
            name: 'Registration Fee',
            description: 'New Patient Registration Fee',
            price: 1000.00, // Fixed registration fee amount - could be from settings
            quantity: 1,
            doctor: 'System',
            date: patient.created_at
        });
    }

    // 1. Get Pending Prescriptions (Status: 'pending_payment')
    const prescriptions = await db('prescriptions')
        .join('users', 'prescriptions.prescribed_by', 'users.id')
        .where({
            'prescriptions.patient_id': patientId,
            'prescriptions.status': 'pending_payment'
        })
        .select(
            'prescriptions.id',
            'prescriptions.medications',
            'prescriptions.prescription_date as date',
            'users.first_name as doctor_first_name',
            'users.last_name as doctor_last_name'
        );

    // Process prescriptions into line items
    const prescriptionItems = prescriptions.flatMap((rx: any) => {
        let medications = [];
        try {
            medications = typeof rx.medications === 'string'
                ? JSON.parse(rx.medications)
                : rx.medications;
        } catch (e) {
            log.error('Error parsing medications', e);
        }

        // If medications is an array of objects with price
        if (Array.isArray(medications)) {
            return medications.map((med: any, index: number) => ({
                id: `RX-${rx.id}-${index}`,
                source_id: rx.id,
                type: 'Prescription',
                name: med.name,
                description: `Rx: ${med.name} (${med.dosage})`,
                price: parseFloat(med.price || 0),
                quantity: parseInt(med.quantity || 1),
                doctor: `Dr. ${rx.doctor_first_name} ${rx.doctor_last_name}`,
                date: rx.date
            }));
        }
        return [];
    });

    // 2. Get Pending Lab Orders (Status: 'ordered')
    const labOrders = await db('lab_results')
        .join('users', 'lab_results.ordered_by', 'users.id')
        .leftJoin('lab_test_definitions', 'lab_results.test_name', 'lab_test_definitions.name')
        .where({
            'lab_results.patient_id': patientId,
            'lab_results.status': 'ordered'
        })
        .select(
            'lab_results.id',
            'lab_results.test_name',
            'lab_test_definitions.price',
            'lab_results.order_date as date',
            'users.first_name as doctor_first_name',
            'users.last_name as doctor_last_name'
        );

    const labItems = labOrders.map((lab: any) => ({
        id: `LAB-${lab.id}`,
        source_id: lab.id,
        type: 'Laboratory',
        name: lab.test_name,
        description: `Lab: ${lab.test_name}`,
        price: parseFloat(lab.price || 0),
        quantity: 1,
        doctor: `Dr. ${lab.doctor_first_name} ${lab.doctor_last_name}`,
        date: lab.date
    }));

    // 3. Get Pending Invoice Items (Status: 'pending')
    const pendingInvoices = await db('invoices')
        .join('invoice_items', 'invoices.id', 'invoice_items.invoice_id')
        .leftJoin('users', 'invoices.created_by', 'users.id')
        .where({
            'invoices.patient_id': patientId,
            'invoices.status': 'pending'
        })
        .select(
            'invoice_items.id',
            'invoice_items.invoice_id',
            'invoice_items.description',
            'invoice_items.unit_price as price',
            'invoice_items.quantity',
            'invoice_items.service_type',
            'invoices.created_at as date',
            'users.first_name as doctor_first_name',
            'users.last_name as doctor_last_name'
        );

    log.info(`Found ${pendingInvoices.length} pending invoice items for patient ${patientId}`);

    const invoiceItems = pendingInvoices.map((item: any) => ({
        id: `INV-ITEM-${item.id}`,
        source_id: item.id, // This is invoice_item.id
        parent_id: item.invoice_id, // Link to parent invoice
        type: 'InvoiceItem',
        name: item.description,
        description: item.description,
        price: parseFloat(item.price || 0),
        quantity: parseInt(item.quantity || 1),
        doctor: item.doctor_first_name ? `Dr. ${item.doctor_first_name} ${item.doctor_last_name}` : 'System',
        date: item.date
    }));

    // console.log(`[BILLING API] Returning ${invoiceItems.length} invoice items + others.`);
    res.json([...pendingItems, ...prescriptionItems, ...labItems, ...invoiceItems]);
}));

// Process Payment for specific items
router.post('/process-payment', auth, asyncHandler(async (req, res) => {
    const { patient_id, items, payment_method, amount_paid, discount } = req.body;
    const cashier_id = (req as any).user.id;

    await db.transaction(async (trx) => {
        // 1. Create Invoice (for the payment transaction itself - linking paid items)
        // Note: Use a different name if needed to avoid confusion with existing "invoices" table if we are creating a RECEIPT invoice
        // But for now, we just record the transaction.

        // 2. Create Transaction/Payment Record
        await trx('transactions').insert({
            patient_id,
            cashier_id,
            total_amount: amount_paid,
            payment_method,
            transaction_date: new Date(),
            status: 'completed',
            items: JSON.stringify(items)
        });

        // 3. Update Status of Source Items
        const processedInvoiceIds = new Set<number>();

        for (const item of items) {
            if (item.type === 'Prescription') {
                await trx('prescriptions')
                    .where({ id: item.source_id, status: 'pending_payment' })
                    .update({ status: 'paid' });
            } else if (item.type === 'Laboratory') {
                await trx('lab_results')
                    .where({ id: item.source_id, status: 'ordered' })
                    .update({ status: 'paid' });
            } else if (item.type === 'Registration') {
                await trx('patients')
                    .where({ id: item.source_id })
                    .update({ status: 'active' });
            } else if (item.type === 'InvoiceItem') {
                // For InvoiceItem, we need to update the PARENT INVOICE status.
                // We assume paying for an item contributes to paying the invoice.
                // For simplicity, we'll collect invoice IDs and mark them as paid after the loop
                // (Assuming the user pays for the items, effectively clearing the invoice)
                if (item.parent_id) {
                    processedInvoiceIds.add(item.parent_id);
                }
            }
        }

        // Mark processed invoices as paid
        if (processedInvoiceIds.size > 0) {
            await trx('invoices')
                .whereIn('id', Array.from(processedInvoiceIds))
                .update({ status: 'paid' });
        }
    });

    log.info('Payment processed', { patientId: patient_id, amount: amount_paid, cashierId: cashier_id });
    res.json({ success: true, message: 'Payment processed successfully' });
}));

export default router;
