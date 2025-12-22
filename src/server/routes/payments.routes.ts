import express from 'express';
import { auth } from '../middleware/auth';
import db from '../db';
import { asyncHandler, Errors } from '../middleware/errorHandler';
import { log } from '../utils/logger';

const router = express.Router();

// Get all payments with filters
router.get('/', auth, asyncHandler(async (req, res) => {
    const { patient_id, status, date_from, date_to, payment_method } = req.query;

    let query = db('payments')
        .join('patients', 'payments.patient_id', 'patients.id')
        .leftJoin('users as cashier', 'payments.cashier_id', 'cashier.id')
        .leftJoin('invoices', 'payments.invoice_id', 'invoices.id')
        .select(
            'payments.*',
            'patients.first_name as patient_first_name',
            'patients.last_name as patient_last_name',
            'patients.mrn as patient_mrn',
            'cashier.first_name as cashier_first_name',
            'cashier.last_name as cashier_last_name',
            'invoices.invoice_number'
        );

    if (patient_id) {
        query = query.where('payments.patient_id', patient_id as string);
    }

    if (status) {
        query = query.where('payments.status', status as string);
    }

    if (payment_method) {
        query = query.where('payments.payment_method', payment_method as string);
    }

    if (date_from) {
        query = query.where('payments.payment_date', '>=', date_from as string);
    }

    if (date_to) {
        query = query.where('payments.payment_date', '<=', date_to as string);
    }

    const payments = await query.orderBy('payments.payment_date', 'desc');
    res.json(payments);
}));

// Get single payment
router.get('/:id', auth, asyncHandler(async (req, res) => {
    const payment = await db('payments')
        .join('patients', 'payments.patient_id', 'patients.id')
        .leftJoin('users as cashier', 'payments.cashier_id', 'cashier.id')
        .leftJoin('invoices', 'payments.invoice_id', 'invoices.id')
        .where('payments.id', req.params.id)
        .select(
            'payments.*',
            'patients.first_name as patient_first_name',
            'patients.last_name as patient_last_name',
            'patients.mrn as patient_mrn',
            'cashier.first_name as cashier_first_name',
            'cashier.last_name as cashier_last_name',
            'invoices.invoice_number'
        )
        .first();

    if (!payment) {
        throw Errors.notFound('Payment');
    }

    res.json(payment);
}));

// Create new payment
router.post('/', auth, asyncHandler(async (req, res) => {
    const paymentData = {
        ...req.body,
        cashier_id: req.user.id,
        payment_date: new Date(),
        created_at: new Date()
    };

    // Use a transaction to ensure both payment and transaction records are created
    await db.transaction(async (trx) => {
        const [id] = await trx('payments').insert(paymentData);
        // Note: We need to refetch the payment effectively if we want the ID, but here we just need ID for logging/response
        // SQLite/Knex insert returns [id]

        // 1. Activate patient if registration fee
        if (paymentData.invoice_id) {
            // Case-insensitive check
            const registrationItem = await trx('invoice_items')
                .where('invoice_id', paymentData.invoice_id)
                .whereRaw('LOWER(description) LIKE ?', ['%registration%'])
                .first();

            log.info('Checking for registration item', {
                invoiceId: paymentData.invoice_id,
                found: !!registrationItem,
                description: registrationItem?.description
            });

            if (registrationItem) {
                const updateCount = await trx('patients')
                    .where('id', paymentData.patient_id)
                    .where('status', 'pending_payment')
                    .update({
                        status: 'active',
                        updated_at: new Date()
                    });

                log.info('Patient activation result', {
                    patientId: paymentData.patient_id,
                    updatedRows: updateCount
                });
            }
        }

        // 2. Create Transaction Record (Required for Reports)
        // Need invoice number
        let invoiceNumber = 'INV-UNKNOWN';
        if (paymentData.invoice_id) {
            const invoice = await trx('invoices').where('id', paymentData.invoice_id).first();
            if (invoice) invoiceNumber = invoice.invoice_number;
        }

        try {
            await trx('transactions').insert({
                transaction_date: new Date().toISOString(),
                total_amount: paymentData.amount,
                payment_method: paymentData.payment_method,
                cashier_id: req.user.id,
                patient_id: paymentData.patient_id,
                invoice_number: invoiceNumber,
                reference_number: invoiceNumber, // Keep for backward compatibility
                payment_status: 'completed',     // Was 'status'
                voided: 0,
                created_at: new Date(),
                updated_at: new Date()
            });
        } catch (insertError: any) {
            console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            console.error("PAYMENTS INSERT ERROR:", insertError.message);
            console.error("PAYMENTS INSERT STACK:", insertError.stack);
            console.error("DATA:", {
                reference_number: invoiceNumber,
                payment_status: 'completed',
                cashier_id: req.user.id
            });
            console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            throw insertError;
        }

        log.info('Payment and Transaction created', { paymentId: id, amount: paymentData.amount, cashierId: req.user.id });

        // Return the created payment
        const newPayment = await trx('payments').where({ id }).first();
        res.status(201).json(newPayment);
    });
}));

// Update payment
router.put('/:id', auth, asyncHandler(async (req, res) => {
    const updates = req.body;
    delete updates.id;
    delete updates.created_at;

    updates.updated_at = new Date();

    await db('payments').where('id', req.params.id).update(updates);
    const updatedPayment = await db('payments').where('id', req.params.id).first();

    log.info('Payment updated', { paymentId: req.params.id });
    res.json(updatedPayment);
}));

// Get payment statistics
router.get('/stats/overview', auth, asyncHandler(async (req, res) => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];

    // Use transactions table for accurate reporting if available
    const [
        todayRevenue,
        monthRevenue,
        pendingPayments,
        totalTransactions
    ] = await Promise.all([
        db('transactions')
            .where('transaction_date', '>=', todayStr)
            .where('transaction_date', '<', tomorrowStr)
            .where('voided', 0)
            .sum('total_amount as total')
            .first(),
        db('transactions')
            .where('transaction_date', '>=', monthStart)
            .where('voided', 0)
            .sum('total_amount as total')
            .first(),
        db('invoices')
            .where('status', 'pending')
            .count('* as count')
            .first(),
        db('transactions')
            .where('transaction_date', '>=', todayStr)
            .where('transaction_date', '<', tomorrowStr)
            .count('* as count')
            .first()
    ]);

    res.json({
        todayRevenue: todayRevenue?.total || 0,
        monthRevenue: monthRevenue?.total || 0,
        pendingPayments: pendingPayments?.count || 0,
        totalTransactions: totalTransactions?.count || 0
    });
}));

// Get daily summary
router.get('/stats/daily-summary', auth, asyncHandler(async (req, res) => {
    const { date } = req.query;
    const targetDateStr = date ? (date as string) : new Date().toISOString().split('T')[0];

    const targetDate = new Date(targetDateStr);
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);
    const nextDayStr = nextDay.toISOString().split('T')[0];

    const summary = await db('transactions')
        .where('transaction_date', '>=', targetDateStr)
        .where('transaction_date', '<', nextDayStr)
        .where('voided', 0)
        .select('payment_method')
        .sum('total_amount as total')
        .count('* as count')
        .groupBy('payment_method');

    const totalRevenue = await db('transactions')
        .where('transaction_date', '>=', targetDateStr)
        .where('transaction_date', '<', nextDayStr)
        .where('voided', 0)
        .sum('total_amount as total')
        .first();

    res.json({
        date: targetDateStr,
        totalRevenue: totalRevenue?.total || 0,
        breakdown: summary
    });
}));

export default router;
