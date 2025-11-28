import express from 'express';
import type { Request, Response } from 'express';
import knex from '../db';
import { auth, authorize } from '../middleware/auth';

const router = express.Router();

// Generate unique referral code
const generateReferralCode = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    return `REF-${timestamp}-${random}`.toUpperCase();
};

// GET /api/referrals - List referrals
router.get('/', auth, async (req: Request, res: Response) => {
    try {
        const { patient_id, referring_provider_id, status, urgency, from_date, to_date } = req.query;
        const user = (req as any).user;

        let query = knex('referrals')
            .select(
                'referrals.*',
                'patients.first_name',
                'patients.last_name',
                'users.first_name as doctor_first_name',
                'users.last_name as doctor_last_name',
                'hmo_providers.name as hmo_name'
            )
            .join('patients', 'referrals.patient_id', 'patients.id')
            .join('users', 'referrals.referring_provider_id', 'users.id')
            .leftJoin('hmo_providers', 'referrals.hmo_provider_id', 'hmo_providers.id');

        // Role-based filtering
        if (user.role === 'doctor') {
            query = query.where('referrals.referring_provider_id', user.id);
        }

        if (patient_id) query = query.where('referrals.patient_id', patient_id);
        if (referring_provider_id) query = query.where('referrals.referring_provider_id', referring_provider_id);
        if (status) query = query.where('referrals.status', status);
        if (urgency) query = query.where('referrals.urgency', urgency);

        if (from_date) {
            query = query.where('referrals.referral_date', '>=', from_date);
        }
        if (to_date) {
            query = query.where('referrals.referral_date', '<=', to_date);
        }

        const referrals = await query.orderBy('referrals.created_at', 'desc');

        res.json(referrals);
    } catch (error) {
        console.error('Error fetching referrals:', error);
        res.status(500).json({ error: 'Failed to fetch referrals' });
    }
});

// GET /api/referrals/:id - Get referral details
router.get('/:id', auth, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const referral = await knex('referrals')
            .select(
                'referrals.*',
                'patients.first_name',
                'patients.last_name',
                'patients.date_of_birth',
                'users.first_name as doctor_first_name',
                'users.last_name as doctor_last_name',
                'hmo_providers.name as hmo_name'
            )
            .join('patients', 'referrals.patient_id', 'patients.id')
            .join('users', 'referrals.referring_provider_id', 'users.id')
            .leftJoin('hmo_providers', 'referrals.hmo_provider_id', 'hmo_providers.id')
            .where('referrals.id', id)
            .first();

        if (!referral) {
            return res.status(404).json({ error: 'Referral not found' });
        }

        // Get pre-auth if linked
        if (referral.preauth_id) {
            const preauth = await knex('hmo_preauthorizations')
                .where('id', referral.preauth_id)
                .first();
            referral.preauthorization = preauth;
        }

        res.json(referral);
    } catch (error) {
        console.error('Error fetching referral:', error);
        res.status(500).json({ error: 'Failed to fetch referral' });
    }
});

// GET /api/referrals/code/:referralCode - Get by referral code
router.get('/code/:referralCode', auth, async (req: Request, res: Response) => {
    try {
        const { referralCode } = req.params;

        const referral = await knex('referrals')
            .where('referral_code', referralCode)
            .first();

        if (!referral) {
            return res.status(404).json({ error: 'Referral not found' });
        }

        res.json(referral);
    } catch (error) {
        console.error('Error fetching referral:', error);
        res.status(500).json({ error: 'Failed to fetch referral' });
    }
});

// POST /api/referrals - Create referral
router.post('/', auth, authorize(['doctor', 'admin']), async (req: Request, res: Response) => {
    try {
        const {
            patient_id,
            referring_facility,
            referred_to_facility,
            referred_to_specialist,
            specialty_required,
            reason_for_referral,
            diagnosis,
            urgency = 'routine',
            hmo_provider_id,
            preauth_required = false,
            preauth_id,
            referral_date,
            appointment_date,
        } = req.body;
        const user = (req as any).user;

        if (!patient_id || !reason_for_referral) {
            return res.status(400).json({ error: 'Patient and reason for referral are required' });
        }

        const [referral] = await knex('referrals')
            .insert({
                referral_code: generateReferralCode(),
                patient_id,
                referring_provider_id: user.id,
                referring_facility,
                referred_to_facility,
                referred_to_specialist,
                specialty_required,
                reason_for_referral,
                diagnosis,
                urgency,
                hmo_provider_id,
                preauth_required,
                preauth_id,
                status: 'pending',
                referral_date: referral_date || new Date().toISOString().split('T')[0],
                appointment_date,
            })
            .returning('*');

        res.status(201).json(referral);
    } catch (error) {
        console.error('Error creating referral:', error);
        res.status(500).json({ error: 'Failed to create referral' });
    }
});

// PUT /api/referrals/:id - Update referral
router.put('/:id', auth, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        delete updateData.id;
        delete updateData.referral_code;
        delete updateData.created_at;
        updateData.updated_at = new Date().toISOString();

        const [referral] = await knex('referrals')
            .where('id', id)
            .update(updateData)
            .returning('*');

        if (!referral) {
            return res.status(404).json({ error: 'Referral not found' });
        }

        res.json(referral);
    } catch (error) {
        console.error('Error updating referral:', error);
        res.status(500).json({ error: 'Failed to update referral' });
    }
});

// PUT /api/referrals/:id/accept - Accept referral
router.put('/:id/accept', auth, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { appointment_date } = req.body;

        const updateData: any = {
            status: 'accepted',
            updated_at: new Date().toISOString(),
        };

        if (appointment_date) {
            updateData.appointment_date = appointment_date;
        }

        const [referral] = await knex('referrals')
            .where('id', id)
            .update(updateData)
            .returning('*');

        if (!referral) {
            return res.status(404).json({ error: 'Referral not found' });
        }

        res.json(referral);
    } catch (error) {
        console.error('Error accepting referral:', error);
        res.status(500).json({ error: 'Failed to accept referral' });
    }
});

// PUT /api/referrals/:id/complete - Complete referral
router.put('/:id/complete', auth, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { feedback } = req.body;

        const [referral] = await knex('referrals')
            .where('id', id)
            .update({
                status: 'completed',
                feedback: feedback || knex.raw('feedback'),
                updated_at: new Date().toISOString(),
            })
            .returning('*');

        if (!referral) {
            return res.status(404).json({ error: 'Referral not found' });
        }

        res.json(referral);
    } catch (error) {
        console.error('Error completing referral:', error);
        res.status(500).json({ error: 'Failed to complete referral' });
    }
});

// PUT /api/referrals/:id/cancel - Cancel referral
router.put('/:id/cancel', auth, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { feedback } = req.body;

        const [referral] = await knex('referrals')
            .where('id', id)
            .update({
                status: 'cancelled',
                feedback: feedback || knex.raw('feedback'),
                updated_at: new Date().toISOString(),
            })
            .returning('*');

        if (!referral) {
            return res.status(404).json({ error: 'Referral not found' });
        }

        res.json(referral);
    } catch (error) {
        console.error('Error cancelling referral:', error);
        res.status(500).json({ error: 'Failed to cancel referral' });
    }
});

// GET /api/referrals/patient/:patientId - Get patient referrals
router.get('/patient/:patientId', auth, async (req: Request, res: Response) => {
    try {
        const { patientId } = req.params;

        const referrals = await knex('referrals')
            .select('referrals.*', 'users.first_name as doctor_first_name', 'users.last_name as doctor_last_name')
            .join('users', 'referrals.referring_provider_id', 'users.id')
            .where('referrals.patient_id', patientId)
            .orderBy('referrals.created_at', 'desc');

        res.json(referrals);
    } catch (error) {
        console.error('Error fetching patient referrals:', error);
        res.status(500).json({ error: 'Failed to fetch patient referrals' });
    }
});

// GET /api/referrals/provider/:providerId - Get provider referrals
router.get('/provider/:providerId', auth, async (req: Request, res: Response) => {
    try {
        const { providerId } = req.params;

        const referrals = await knex('referrals')
            .select('referrals.*', 'patients.first_name', 'patients.last_name')
            .join('patients', 'referrals.patient_id', 'patients.id')
            .where('referrals.referring_provider_id', providerId)
            .orderBy('referrals.created_at', 'desc');

        res.json(referrals);
    } catch (error) {
        console.error('Error fetching provider referrals:', error);
        res.status(500).json({ error: 'Failed to fetch provider referrals' });
    }
});

// GET /api/referrals/verify/:referralCode - Verify referral code
router.get('/verify/:referralCode', auth, async (req: Request, res: Response) => {
    try {
        const { referralCode } = req.params;

        const referral = await knex('referrals')
            .select('referrals.*', 'patients.first_name', 'patients.last_name')
            .join('patients', 'referrals.patient_id', 'patients.id')
            .where('referrals.referral_code', referralCode)
            .first();

        if (!referral) {
            return res.json({
                valid: false,
                message: 'Referral code not found',
            });
        }

        if (referral.status === 'cancelled') {
            return res.json({
                valid: false,
                referral,
                message: 'Referral has been cancelled',
            });
        }

        if (referral.status === 'completed') {
            return res.json({
                valid: false,
                referral,
                message: 'Referral has already been completed',
            });
        }

        res.json({
            valid: true,
            referral,
            message: 'Referral is valid',
        });
    } catch (error) {
        console.error('Error verifying referral:', error);
        res.status(500).json({ error: 'Failed to verify referral' });
    }
});

export default router;
