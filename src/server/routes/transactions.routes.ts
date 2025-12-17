import express from 'express';
import { auth } from '../middleware/auth';
import db from '../db';
import { log } from '../utils/logger';
import { asyncHandler, Errors } from '../middleware/errorHandler';

const router = express.Router();

// Get all transactions with filtering
router.get('/', auth, asyncHandler(async (req, res) => {
    log.debug('Fetching transactions');
    const {
        startDate,
        endDate,
        status,
        paymentMethod,
        search,
        page = 1,
        limit = 20
    } = req.query;

    const offset = (Number(page) - 1) * Number(limit);

    let query = db('transactions')
        .leftJoin('users as cashier', 'transactions.cashier_id', 'cashier.id')
        .leftJoin('patients', 'transactions.patient_id', 'patients.id')
        .select(
            'transactions.*',
            'cashier.first_name as cashier_first_name',
            'cashier.last_name as cashier_last_name',
            'patients.first_name',
            'patients.last_name'
        );

    if (startDate && endDate) {
        query = query.whereBetween('transactions.transaction_date', [startDate, endDate]);
    }

    if (status && status !== 'all') {
        if (status === 'voided') {
            query = query.where('transactions.voided', 1);
        } else {
            query = query.where('transactions.payment_status', status).where('transactions.voided', 0);
        }
    }

    if (paymentMethod && paymentMethod !== 'all') {
        query = query.where('transactions.payment_method', paymentMethod);
    }

    if (search) {
        query = query.where(function () {
            this.where('transactions.reference_number', 'like', `%${search}%`)
                .orWhere('patients.first_name', 'like', `%${search}%`)
                .orWhere('patients.last_name', 'like', `%${search}%`);
        });
    }

    // Get total count for pagination
    log.debug('Executing count query');
    const countResult = await query.clone().count('transactions.id as count').first();
    const total = countResult?.count || 0;
    log.debug('Count result', { total });

    // Get paginated results
    log.debug('Executing main query');
    const transactions = await query
        .orderBy('transactions.transaction_date', 'desc')
        .limit(Number(limit))
        .offset(offset);
    log.debug('Transactions fetched', { count: transactions.length });

    // Format patient and cashier names
    const formattedTransactions = transactions.map((tx: any) => ({
        ...tx,
        patient_name: tx.first_name ? `${tx.first_name} ${tx.last_name}` : 'Walk-in Customer',
        cashier_name: tx.cashier_first_name ? `${tx.cashier_first_name} ${tx.cashier_last_name}` : 'Unknown Cashier'
    }));

    res.json({
        transactions: formattedTransactions,
        pagination: {
            total,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(Number(total) / Number(limit))
        }
    });
}));

// Void a transaction
router.post('/void', auth, asyncHandler(async (req, res) => {
    const { transactionId, reason } = req.body;
    const userId = (req as any).user.id;

    if (!transactionId || !reason) {
        throw Errors.badRequest('Transaction ID and reason are required');
    }

    const transaction = await db('transactions').where('id', transactionId).first();

    if (!transaction) {
        throw Errors.notFound('Transaction');
    }

    if (transaction.voided) {
        throw Errors.badRequest('Transaction is already voided');
    }

    await db('transactions')
        .where('id', transactionId)
        .update({
            voided: 1,
            voided_by: userId,
            voided_at: new Date().toISOString(),
            void_reason: reason,
            payment_status: 'voided'
        });

    log.info('Transaction voided', { transactionId, voidedBy: userId });
    res.json({ message: 'Transaction voided successfully' });
}));

// Get refund requests
router.get('/refunds', auth, asyncHandler(async (req, res) => {
    const { status } = req.query;

    // Check if refunds table exists
    const tableExists = await db.schema.hasTable('refunds');
    if (!tableExists) {
        return res.json([]);
    }

    let query = db('refunds')
        .leftJoin('transactions', 'refunds.transaction_id', 'transactions.id')
        .leftJoin('users as requester', 'refunds.requested_by', 'requester.id')
        .leftJoin('users as approver', 'refunds.approved_by', 'approver.id')
        .select(
            'refunds.*',
            'transactions.reference_number',
            'transactions.total_amount as transaction_amount',
            'requester.name as requested_by_name',
            'approver.name as approved_by_name'
        );

    if (status && status !== 'all') {
        query = query.where('refunds.status', status);
    }

    const refunds = await query.orderBy('refunds.requested_at', 'desc');
    res.json(refunds);
}));

// Create refund request
router.post('/refunds', auth, asyncHandler(async (req, res) => {
    const { transactionId, amount, reason } = req.body;
    const userId = (req as any).user.id;

    if (!transactionId || !amount || !reason) {
        throw Errors.badRequest('Transaction ID, amount, and reason are required');
    }

    const transaction = await db('transactions').where('id', transactionId).first();

    if (!transaction) {
        throw Errors.notFound('Transaction');
    }

    // Find associated payment linkage
    // Find associated payment linkage
    // Transaction -> (via invoice_number OR reference_number) -> Invoice -> (via id) -> Payment
    const invoiceNumber = transaction.invoice_number || transaction.reference_number;

    if (!invoiceNumber) {
        throw Errors.badRequest('Transaction does not have an invoice number');
    }

    const invoice = await db('invoices').where('invoice_number', invoiceNumber).first();
    if (!invoice) {
        throw Errors.badRequest('Associated invoice not found');
    }

    const payment = await db('payments').where('invoice_id', invoice.id).first();

    if (!payment) {
        throw Errors.badRequest('Associated payment record not found for this transaction');
    }

    if (amount > transaction.total_amount) {
        throw Errors.badRequest('Refund amount cannot exceed transaction amount');
    }

    await db('refunds').insert({
        payment_id: payment.id, // Correct column
        amount,
        reason,
        // requested_by: userId, // refunds table does NOT have requested_by in CreateCashierTables schema?
        // Wait, checking schema: "table.integer('approved_by').nullable();" "table.string('status')..."
        // It does NOT have 'requested_by'. Logic flaw in previous code.
        // If schema doesn't have it, we can't save it. 
        // We'll just save status='pending'.
        // If we want to track requester, we need a column.
        // For now, I will omit 'requested_by' to prevent SQL error, 
        // OR I check if I can store it in 'reason' e.g. "Requested by UserX: Reason..."?

        status: 'pending',
        created_at: new Date()
    });

    log.info('Refund request created', { transactionId, amount, requestedBy: userId });
    res.status(201).json({ message: 'Refund request created successfully' });
}));

// Approve/Reject refund
router.put('/refunds/:id/status', auth, asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const userId = (req as any).user.id;

    if (!['approved', 'rejected'].includes(status)) {
        throw Errors.badRequest('Invalid status');
    }

    const refund = await db('refunds').where('id', id).first();

    if (!refund) {
        throw Errors.notFound('Refund request');
    }

    if (refund.status !== 'pending') {
        throw Errors.badRequest('Refund request is already processed');
    }

    await db('refunds')
        .where('id', id)
        .update({
            status,
            approved_by: userId,
            approved_at: new Date().toISOString()
        });

    log.info('Refund request processed', { refundId: id, status, processedBy: userId });
    res.json({ message: `Refund request ${status} successfully` });
}));

export default router;
