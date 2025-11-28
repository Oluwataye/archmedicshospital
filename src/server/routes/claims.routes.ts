import express from 'express';
import type { Request, Response } from 'express';
import knex from '../db.ts';
import { auth, authorize } from '../middleware/auth.ts';

const router = express.Router();

// Generate unique claim number
const generateClaimNumber = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    return `CLM-${timestamp}-${random}`.toUpperCase();
};

// GET /api/claims - List claims (filtered by role)
router.get('/', auth, async (req: Request, res: Response) => {
    try {
        const { patient_id, hmo_provider_id, status, from_date, to_date, created_by } = req.query;
        const user = (req as any).user;

        let query = knex('hmo_claims')
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

        res.json(claims);
    } catch (error) {
        console.error('Error fetching claims:', error);
        res.status(500).json({ error: 'Failed to fetch claims' });
    }
});

// GET /api/claims/:id - Get claim details with items
router.get('/:id', auth, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const claim = await knex('hmo_claims')
            .select('hmo_claims.*', 'patients.first_name', 'patients.last_name', 'hmo_providers.name as hmo_name')
            .join('patients', 'hmo_claims.patient_id', 'patients.id')
            .join('hmo_providers', 'hmo_claims.hmo_provider_id', 'hmo_providers.id')
            .where('hmo_claims.id', id)
            .first();

        if (!claim) {
            return res.status(404).json({ error: 'Claim not found' });
        }

        // Get claim items
        const items = await knex('hmo_claim_items')
            .select('hmo_claim_items.*', 'nhis_service_codes.code', 'nhis_service_codes.description')
            .join('nhis_service_codes', 'hmo_claim_items.service_code_id', 'nhis_service_codes.id')
            .where('hmo_claim_items.claim_id', id);

        res.json({ ...claim, items });
    } catch (error) {
        console.error('Error fetching claim:', error);
        res.status(500).json({ error: 'Failed to fetch claim' });
    }
});

// GET /api/claims/number/:claimNumber - Get claim by number
router.get('/number/:claimNumber', auth, async (req: Request, res: Response) => {
    try {
        const { claimNumber } = req.params;

        const claim = await knex('hmo_claims')
            .where('claim_number', claimNumber)
            .first();

        if (!claim) {
            return res.status(404).json({ error: 'Claim not found' });
        }

        res.json(claim);
    } catch (error) {
        console.error('Error fetching claim:', error);
        res.status(500).json({ error: 'Failed to fetch claim' });
    }
});

// POST /api/claims - Create new claim
router.post('/', auth, async (req: Request, res: Response) => {
    try {
        const { patient_id, hmo_provider_id, claim_date, service_date, items } = req.body;
        const user = (req as any).user;

        if (!patient_id || !hmo_provider_id || !items || items.length === 0) {
            return res.status(400).json({ error: 'Patient, HMO provider, and items are required' });
        }

        // Calculate totals
        const total_amount = items.reduce((sum: number, item: any) => sum + item.total_price, 0);
        const copay_amount = items.reduce((sum: number, item: any) => sum + (item.copay || 0), 0);
        const claim_amount = total_amount - copay_amount;

        // Create claim
        const [claim] = await knex('hmo_claims')
            .insert({
                claim_number: generateClaimNumber(),
                patient_id,
                hmo_provider_id,
                claim_date: claim_date || new Date().toISOString().split('T')[0],
                service_date: service_date || new Date().toISOString().split('T')[0],
                total_amount,
                copay_amount,
                claim_amount,
                status: 'pending',
                created_by: user.id,
            })
            .returning('*');

        // Create claim items
        const claimItems = items.map((item: any) => ({
            claim_id: claim.id,
            service_code_id: item.service_code_id,
            quantity: item.quantity || 1,
            unit_price: item.unit_price,
            total_price: item.total_price,
            diagnosis_code: item.diagnosis_code,
            provider_id: item.provider_id || user.id,
        }));

        await knex('hmo_claim_items').insert(claimItems);

        res.status(201).json(claim);
    } catch (error) {
        console.error('Error creating claim:', error);
        res.status(500).json({ error: 'Failed to create claim' });
    }
});

// PUT /api/claims/:id/submit - Submit claim to HMO
router.put('/:id/submit', auth, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const [claim] = await knex('hmo_claims')
            .where('id', id)
            .update({
                status: 'submitted',
                submission_date: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .returning('*');

        if (!claim) {
            return res.status(404).json({ error: 'Claim not found' });
        }

        res.json(claim);
    } catch (error) {
        console.error('Error submitting claim:', error);
        res.status(500).json({ error: 'Failed to submit claim' });
    }
});

// PUT /api/claims/:id/approve - Approve claim (Admin only)
router.put('/:id/approve', auth, authorize(['admin']), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { approved_amount } = req.body;

        const [claim] = await knex('hmo_claims')
            .where('id', id)
            .update({
                status: 'approved',
                approval_date: new Date().toISOString(),
                claim_amount: approved_amount || knex.raw('claim_amount'),
                updated_at: new Date().toISOString(),
            })
            .returning('*');

        if (!claim) {
            return res.status(404).json({ error: 'Claim not found' });
        }

        res.json(claim);
    } catch (error) {
        console.error('Error approving claim:', error);
        res.status(500).json({ error: 'Failed to approve claim' });
    }
});

// PUT /api/claims/:id/reject - Reject claim (Admin only)
router.put('/:id/reject', auth, authorize(['admin']), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { rejection_reason } = req.body;

        if (!rejection_reason) {
            return res.status(400).json({ error: 'Rejection reason is required' });
        }

        const [claim] = await knex('hmo_claims')
            .where('id', id)
            .update({
                status: 'rejected',
                rejection_reason,
                updated_at: new Date().toISOString(),
            })
            .returning('*');

        if (!claim) {
            return res.status(404).json({ error: 'Claim not found' });
        }

        res.json(claim);
    } catch (error) {
        console.error('Error rejecting claim:', error);
        res.status(500).json({ error: 'Failed to reject claim' });
    }
});

// PUT /api/claims/:id/paid - Mark claim as paid
router.put('/:id/paid', auth, authorize(['admin', 'cashier']), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const [claim] = await knex('hmo_claims')
            .where('id', id)
            .update({
                status: 'paid',
                payment_date: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .returning('*');

        if (!claim) {
            return res.status(404).json({ error: 'Claim not found' });
        }

        res.json(claim);
    } catch (error) {
        console.error('Error marking claim as paid:', error);
        res.status(500).json({ error: 'Failed to mark claim as paid' });
    }
});

// GET /api/claims/stats - Claims statistics
router.get('/stats/overview', auth, async (req: Request, res: Response) => {
    try {
        const stats = await knex('hmo_claims')
            .select(
                knex.raw('COUNT(*) as total_claims'),
                knex.raw("SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_claims"),
                knex.raw("SUM(CASE WHEN status = 'submitted' THEN 1 ELSE 0 END) as submitted_claims"),
                knex.raw("SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_claims"),
                knex.raw("SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected_claims"),
                knex.raw("SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as paid_claims"),
                knex.raw('SUM(claim_amount) as total_claim_amount'),
                knex.raw("SUM(CASE WHEN status = 'approved' THEN claim_amount ELSE 0 END) as total_approved_amount"),
                knex.raw("SUM(CASE WHEN status = 'paid' THEN claim_amount ELSE 0 END) as total_paid_amount")
            )
            .first();

        res.json(stats);
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// GET /api/claims/patient/:patientId - Get patient claims
router.get('/patient/:patientId', auth, async (req: Request, res: Response) => {
    try {
        const { patientId } = req.params;

        const claims = await knex('hmo_claims')
            .select('hmo_claims.*', 'hmo_providers.name as hmo_name')
            .join('hmo_providers', 'hmo_claims.hmo_provider_id', 'hmo_providers.id')
            .where('hmo_claims.patient_id', patientId)
            .orderBy('hmo_claims.created_at', 'desc');

        res.json(claims);
    } catch (error) {
        console.error('Error fetching patient claims:', error);
        res.status(500).json({ error: 'Failed to fetch patient claims' });
    }
});

export default router;
