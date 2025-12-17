import express from 'express';
import type { Request, Response } from 'express';
import db from '../db';
import { auth, authorize } from '../middleware/auth';
import { asyncHandler, Errors } from '../middleware/errorHandler';
import { log } from '../utils/logger';

const router = express.Router();

// Generate unique claim number
const generateClaimNumber = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    return `CLM-${timestamp}-${random}`.toUpperCase();
};

// GET /api/claims - List claims (filtered by role)
router.get('/', auth, asyncHandler(async (req: Request, res: Response) => {
    const { patient_id, hmo_provider_id, status, from_date, to_date, created_by } = req.query;
    const user = (req as any).user;

    let query = db('hmo_claims')
        .select('hmo_claims.*', 'patients.first_name', 'patients.last_name', 'hmo_providers.name as hmo_name')
        .join('patients', 'hmo_claims.patient_id', 'patients.id')
        .join('hmo_providers', 'hmo_claims.hmo_provider_id', 'hmo_providers.id');

    // Role-based filtering
    if (user.role !== 'admin') {
        query = query.where('hmo_claims.created_by', user.id);
    }

    if (patient_id) query = query.where('hmo_claims.patient_id', patient_id);
    if (hmo_provider_id) query = query.where('hmo_claims.hmo_provider_id', hmo_provider_id);
    if (status) query = query.where('hmo_claims.status', status);
    if (created_by) query = query.where('hmo_claims.created_by', created_by);

    if (from_date) {
        query = query.where('hmo_claims.claim_date', '>=', from_date);
    }
    if (to_date) {
        query = query.where('hmo_claims.claim_date', '<=', to_date);
    }

    const claims = await query.orderBy('hmo_claims.created_at', 'desc');

    return res.json(claims);
}));

// GET /api/claims/statistics - Claims statistics (alias for compatibility)
router.get('/statistics', auth, asyncHandler(async (req: Request, res: Response) => {
    const stats = await db('hmo_claims')
        .select(
            db.raw('COUNT(*) as total_claims'),
            db.raw("SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_claims"),
            db.raw("SUM(CASE WHEN status = 'submitted' THEN 1 ELSE 0 END) as submitted_claims"),
            db.raw("SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_claims")
        ).first();

    return res.json(stats);
}));

// Get claim by ID
router.get('/:id', auth, asyncHandler(async (req, res) => {
    const claim = await db('hmo_claims as c')
        .select(
            'c.*',
            'p.first_name as patient_first_name',
            'p.last_name as patient_last_name',
            'p.mrn as patient_mrn',
            'h.name as hmo_name'
        )
        .leftJoin('patients as p', 'c.patient_id', 'p.id')
        .leftJoin('hmo_providers as h', 'c.hmo_provider_id', 'h.id')
        .where('c.id', req.params.id)
        .first();

    if (!claim) {
        throw Errors.notFound('Claim');
    }

    // Get claim items
    const items = await db('hmo_claim_items as ci')
        .select(
            'ci.*',
            's.name as service_name',
            's.code as service_code'
        )
        .leftJoin('services as s', 'ci.service_code_id', 's.id')
        .where('ci.claim_id', req.params.id);

    res.json({ ...claim, items });
}));

// Create new claim
router.post('/', auth, asyncHandler(async (req, res) => {
    const {
        patient_id,
        hmo_provider_id,
        claim_date,
        service_date,
        authorization_code,
        diagnosis_code,
        items,
        total_amount,
        copay_amount,
        claim_amount,
        notes
    } = req.body;

    if (!patient_id || !hmo_provider_id || !items || !items.length) {
        throw Errors.badRequest('Missing required fields');
    }

    const trx = await db.transaction();

    try {
        // Generate claim number (simple implementation)
        const timestamp = Date.now().toString().slice(-8);
        const claim_number = `CLM-${timestamp}`;

        const [claimId] = await trx('hmo_claims').insert({
            claim_number,
            patient_id,
            hmo_provider_id,
            status: 'pending',
            claim_date,
            service_date,
            authorization_code,
            diagnosis_code,
            claim_amount, // Assuming this variable exists or logic calculates it
            created_by: (req as any).user.id,
            created_at: new Date(),
            updated_at: new Date()
        });

        const newClaim = await trx('hmo_claims').where({ id: claimId }).first();
        await trx.commit();

        log.info('Claim created', { claimId, claimNumber: claim_number });
        res.status(201).json(newClaim);
    } catch (error) {
        await trx.rollback();
        throw error;
    }
}));

// Mark claim as paid
router.put('/:id/pay', auth, asyncHandler(async (req, res) => {
    const { id } = req.params;

    const [claim] = await db('hmo_claims')
        .where('id', id)
        .update({
            status: 'paid',
            payment_date: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .returning('*');

    if (!claim) {
        // Fallback for DBs not supporting returning
        const updated = await db('hmo_claims').where('id', id).first();
        if (!updated) throw Errors.notFound('Claim');

        log.info('Claim marked as paid', { claimId: id });
        return res.json(updated);
    }

    log.info('Claim marked as paid', { claimId: id });
    return res.json(claim);
}));

// GET /api/claims/patient/:patientId - Get patient claims
router.get('/patient/:patientId', auth, asyncHandler(async (req: Request, res: Response) => {
    const { patientId } = req.params;

    const claims = await db('hmo_claims')
        .select('hmo_claims.*', 'hmo_providers.name as hmo_name')
        .join('hmo_providers', 'hmo_claims.hmo_provider_id', 'hmo_providers.id')
        .where('hmo_claims.patient_id', patientId)
        .orderBy('hmo_claims.created_at', 'desc');

    res.json(claims);
}));

export default router;
