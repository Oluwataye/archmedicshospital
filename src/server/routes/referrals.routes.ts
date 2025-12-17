import express from 'express';
import type { Request, Response } from 'express';
import knex from '../db';
import { auth, authorize } from '../middleware/auth';
import { asyncHandler, Errors } from '../middleware/errorHandler';
import { log } from '../utils/logger';

const router = express.Router();

// Generate unique referral code
const generateReferralCode = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    return `REF-${timestamp}-${random}`.toUpperCase();
};

// GET /api/referrals - List referrals
router.get('/', auth, asyncHandler(async (req: Request, res: Response) => {
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
}));

// GET /api/referrals/:id - Get referral details
router.get('/:id', auth, asyncHandler(async (req: Request, res: Response) => {
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
        throw Errors.notFound('Referral');
    }

    // Get pre-auth if linked
    if (referral.preauth_id) {
        const preauth = await knex('hmo_preauthorizations')
            .where('id', referral.preauth_id)
            .first();
        referral.preauthorization = preauth;
    }

    res.json(referral);
}));

// GET /api/referrals/code/:referralCode - Get by referral code
router.get('/code/:referralCode', auth, asyncHandler(async (req: Request, res: Response) => {
    const { referralCode } = req.params;

    const referral = await knex('referrals')
        .where('referral_code', referralCode)
        .first();

    if (!referral) {
        throw Errors.notFound('Referral');
    }

    res.json(referral);
}));

// POST /api/referrals - Create referral
router.post('/', auth, authorize(['doctor', 'admin']), asyncHandler(async (req: Request, res: Response) => {
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
        throw Errors.badRequest('Patient and reason for referral are required');
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

    log.info('Referral created', { referralId: referral.id, referralCode: referral.referral_code, patientId: patient_id });
    res.status(201).json(referral);
}));

// PUT /api/referrals/:id - Update referral
router.put('/:id', auth, asyncHandler(async (req: Request, res: Response) => {
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
        throw Errors.notFound('Referral');
    }

    log.info('Referral updated', { referralId: id });
    res.json(referral);
}));

// PUT /api/referrals/:id/accept - Accept referral
router.put('/:id/accept', auth, asyncHandler(async (req: Request, res: Response) => {
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
        throw Errors.notFound('Referral');
    }

    log.info('Referral accepted', { referralId: id });
    res.json(referral);
}));

// PUT /api/referrals/:id/complete - Complete referral
router.put('/:id/complete', auth, asyncHandler(async (req: Request, res: Response) => {
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
        throw Errors.notFound('Referral');
    }

    log.info('Referral completed', { referralId: id });
    res.json(referral);
}));

// PUT /api/referrals/:id/cancel - Cancel referral
router.put('/:id/cancel', auth, asyncHandler(async (req: Request, res: Response) => {
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
        throw Errors.notFound('Referral');
    }

    log.info('Referral cancelled', { referralId: id });
    res.json(referral);
}));

// GET /api/referrals/patient/:patientId - Get patient referrals
router.get('/patient/:patientId', auth, asyncHandler(async (req: Request, res: Response) => {
    const { patientId } = req.params;

    const referrals = await knex('referrals')
        .select('referrals.*', 'users.first_name as doctor_first_name', 'users.last_name as doctor_last_name')
        .join('users', 'referrals.referring_provider_id', 'users.id')
        .where('referrals.patient_id', patientId)
        .orderBy('referrals.created_at', 'desc');

    res.json(referrals);
}));

// GET /api/referrals/provider/:providerId - Get provider referrals
router.get('/provider/:providerId', auth, asyncHandler(async (req: Request, res: Response) => {
    const { providerId } = req.params;

    const referrals = await knex('referrals')
        .select('referrals.*', 'patients.first_name', 'patients.last_name')
        .join('patients', 'referrals.patient_id', 'patients.id')
        .where('referrals.referring_provider_id', providerId)
        .orderBy('referrals.created_at', 'desc');

    res.json(referrals);
}));

// GET /api/referrals/verify/:referralCode - Verify referral code
router.get('/verify/:referralCode', auth, asyncHandler(async (req: Request, res: Response) => {
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
}));

export default router;
