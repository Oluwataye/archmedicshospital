import express from 'express';
import { auth } from '../middleware/auth';
import db from '../db';
import { asyncHandler, Errors } from '../middleware/errorHandler';
import { log } from '../utils/logger';

const router = express.Router();

// Get all refunds
router.get('/', auth, asyncHandler(async (req, res) => {
    const { status } = req.query;

    let query = db('refunds')
        .join('payments', 'refunds.payment_id', 'payments.id')
        .join('patients', 'payments.patient_id', 'patients.id')
        .leftJoin('users as approver', 'refunds.approved_by', 'approver.id')
        .select(
            'refunds.*',
            'payments.amount as payment_amount',
            'payments.payment_method',
            'payments.reference_number',
            'patients.first_name as patient_first_name',
            'patients.last_name as patient_last_name',
            'patients.mrn as patient_mrn',
            'approver.first_name as approver_first_name',
            'approver.last_name as approver_last_name'
        );

    if (status) {
        query = query.where('refunds.status', status as string);
    }

    const refunds = await query.orderBy('refunds.created_at', 'desc');
    res.json(refunds);
}));

// Get single refund
router.get('/:id', auth, asyncHandler(async (req, res) => {
    const refund = await db('refunds')
        .join('payments', 'refunds.payment_id', 'payments.id')
        .join('patients', 'payments.patient_id', 'patients.id')
        .leftJoin('users as approver', 'refunds.approved_by', 'approver.id')
        .where('refunds.id', req.params.id)
        .select(
            'refunds.*',
            'payments.amount as payment_amount',
            'payments.payment_method',
            'payments.reference_number',
            'patients.first_name as patient_first_name',
            'patients.last_name as patient_last_name',
            'patients.mrn as patient_mrn',
            'approver.first_name as approver_first_name',
            'approver.last_name as approver_last_name'
        )
        .first();

    if (!refund) {
        throw Errors.notFound('Refund');
    }

    res.json(refund);
}));

// Create refund request
router.post('/', auth, asyncHandler(async (req, res) => {
    const refundData = {
        ...req.body,
        status: 'pending',
        created_at: new Date()
    };

    const [id] = await db('refunds').insert(refundData);
    const newRefund = await db('refunds').where({ id }).first();

    log.info('Refund request created', { refundId: id, paymentId: req.body.payment_id });
    res.status(201).json(newRefund);
}));

// Approve refund
router.put('/:id/approve', auth, asyncHandler(async (req, res) => {
    const updates = {
        status: 'approved',
        approved_by: (req as any).user.id,
        refund_date: new Date(),
        updated_at: new Date()
    };

    await db('refunds').where('id', req.params.id).update(updates);
    const approvedRefund = await db('refunds').where('id', req.params.id).first();

    log.info('Refund approved', { refundId: req.params.id, approvedBy: (req as any).user.id });
    res.json(approvedRefund);
}));

// Reject refund
router.put('/:id/reject', auth, asyncHandler(async (req, res) => {
    const updates = {
        status: 'rejected',
        approved_by: (req as any).user.id,
        updated_at: new Date()
    };

    await db('refunds').where('id', req.params.id).update(updates);
    const rejectedRefund = await db('refunds').where('id', req.params.id).first();

    log.info('Refund rejected', { refundId: req.params.id, rejectedBy: (req as any).user.id });
    res.json(rejectedRefund);
}));

export default router;
