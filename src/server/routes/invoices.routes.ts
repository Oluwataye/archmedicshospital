import express from 'express';
import { auth } from '../middleware/auth';
import db from '../db';
import { asyncHandler, Errors } from '../middleware/errorHandler';
import { log } from '../utils/logger';

const router = express.Router();

// Get all invoices with filters
router.get('/', auth, asyncHandler(async (req, res) => {
    const { patient_id, status, date_from, date_to } = req.query;

    let query = db('invoices')
        .join('patients', 'invoices.patient_id', 'patients.id')
        .leftJoin('users as creator', 'invoices.created_by', 'creator.id')
        .select(
            'invoices.*',
            'patients.first_name as patient_first_name',
            'patients.last_name as patient_last_name',
            'patients.mrn as patient_mrn',
            'creator.first_name as creator_first_name',
            'creator.last_name as creator_last_name'
        );

    if (patient_id) {
        query = query.where('invoices.patient_id', patient_id as string);
    }

    if (status) {
        query = query.where('invoices.status', status as string);
    }

    if (date_from) {
        query = query.where('invoices.created_at', '>=', date_from as string);
    }

    if (date_to) {
        query = query.where('invoices.created_at', '<=', date_to as string);
    }

    const invoices = await query.orderBy('invoices.created_at', 'desc');
    res.json(invoices);
}));

// Get single invoice with items
router.get('/:id', auth, asyncHandler(async (req, res) => {
    const invoice = await db('invoices')
        .join('patients', 'invoices.patient_id', 'patients.id')
        .leftJoin('users as creator', 'invoices.created_by', 'creator.id')
        .where('invoices.id', req.params.id)
        .select(
            'invoices.*',
            'patients.first_name as patient_first_name',
            'patients.last_name as patient_last_name',
            'patients.mrn as patient_mrn',
            'patients.phone as patient_phone',
            'patients.email as patient_email',
            'creator.first_name as creator_first_name',
            'creator.last_name as creator_last_name'
        )
        .first();

    if (!invoice) {
        throw Errors.notFound('Invoice');
    }

    const items = await db('invoice_items')
        .where('invoice_id', req.params.id)
        .select('*');

    res.json({ ...invoice, items });
}));

// Create new invoice with items
router.post('/', auth, asyncHandler(async (req, res) => {
    const trx = await db.transaction();

    try {
        const { items, ...invoiceData } = req.body;

        // Generate invoice number
        const lastInvoice = await trx('invoices')
            .orderBy('id', 'desc')
            .first();

        const invoiceNumber = `INV-${String((lastInvoice?.id || 0) + 1).padStart(6, '0')}`;

        const invoice = {
            ...invoiceData,
            invoice_number: invoiceNumber,
            created_by: (req as any).user.id,
            created_at: new Date()
        };

        const [invoiceId] = await trx('invoices').insert(invoice);

        // Insert invoice items
        if (items && items.length > 0) {
            const invoiceItems = items.map((item: any) => ({
                ...item,
                invoice_id: invoiceId,
                created_at: new Date()
            }));

            await trx('invoice_items').insert(invoiceItems);
        }

        await trx.commit();

        const newInvoice = await db('invoices')
            .where('id', invoiceId)
            .first();

        const invoiceItems = await db('invoice_items')
            .where('invoice_id', invoiceId)
            .select('*');

        log.info('Invoice created', { invoiceId, invoiceNumber, patientId: invoiceData.patient_id });
        res.status(201).json({ ...newInvoice, items: invoiceItems });
    } catch (error) {
        await trx.rollback();
        throw error;
    }
}));

// Update invoice
router.put('/:id', auth, asyncHandler(async (req, res) => {
    const updates = req.body;
    delete updates.id;
    delete updates.created_at;
    delete updates.invoice_number;

    updates.updated_at = new Date();

    await db('invoices').where('id', req.params.id).update(updates);
    const updatedInvoice = await db('invoices').where('id', req.params.id).first();

    log.info('Invoice updated', { invoiceId: req.params.id });
    res.json(updatedInvoice);
}));

// Delete invoice
router.delete('/:id', auth, asyncHandler(async (req, res) => {
    await db('invoices').where('id', req.params.id).delete();
    log.info('Invoice deleted', { invoiceId: req.params.id });
    res.json({ message: 'Invoice deleted successfully' });
}));

export default router;
