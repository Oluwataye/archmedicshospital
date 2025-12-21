import express from 'express';
import type { Request, Response } from 'express';
import knex from '../db';
import { auth, authorize } from '../middleware/auth';
import { asyncHandler, Errors } from '../middleware/errorHandler';
import { log } from '../utils/logger';

const router = express.Router();

// Generate unique authorization code
const generateAuthCode = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 9);
    return `AUTH-${timestamp}-${random}`.toUpperCase();
};

// ============================================
// NEW AUTHORIZATION VERIFICATION ENDPOINTS
// ============================================

// POST /api/preauth/verify/search-patient - Search patient for verification (Admin/EHR only)
router.post('/verify/search-patient', auth, authorize(['admin', 'ehr']), asyncHandler(async (req: Request, res: Response) => {
    const { search } = req.body;

    if (!search) {
        throw Errors.badRequest('Search query is required');
    }

    // Search by MRN, first name, last name, or phone
    const patients = await knex('patients')
        .select(
            'patients.id',
            'patients.mrn',
            'patients.first_name',
            'patients.last_name',
            'patients.date_of_birth',
            'patients.gender',
            'patients.phone',
            'patients.hmo_provider_id',
            'hmo_providers.name as hmo_provider_name',
            'hmo_providers.coverage_type as hmo_package'
        )
        .leftJoin('hmo_providers', 'patients.hmo_provider_id', 'hmo_providers.id')
        .where('patients.mrn', 'like', `%${search}%`)
        .orWhere('patients.first_name', 'like', `%${search}%`)
        .orWhere('patients.last_name', 'like', `%${search}%`)
        .orWhere('patients.phone', 'like', `%${search}%`)
        .limit(10);

    res.json(patients);
}));

// POST /api/preauth/verify/validate-code - Validate authorization code without using it (Admin/EHR only)
router.post('/verify/validate-code', auth, authorize(['admin', 'ehr']), asyncHandler(async (req: Request, res: Response) => {
    const { authorization_code, patient_id } = req.body;

    if (!authorization_code) {
        throw Errors.badRequest('Authorization code is required');
    }

    const preauth = await knex('hmo_preauthorizations')
        .select(
            'hmo_preauthorizations.*',
            'patients.first_name',
            'patients.last_name',
            'patients.mrn',
            'hmo_providers.name as hmo_provider_name'
        )
        .join('patients', 'hmo_preauthorizations.patient_id', 'patients.id')
        .join('hmo_providers', 'hmo_preauthorizations.hmo_provider_id', 'hmo_providers.id')
        .where('hmo_preauthorizations.authorization_code', authorization_code)
        .first();

    if (!preauth) {
        return res.json({
            valid: false,
            message: 'Authorization code not found',
            status: 'invalid'
        });
    }

    // Check if patient matches
    if (patient_id && preauth.patient_id !== patient_id) {
        return res.json({
            valid: false,
            message: 'Authorization code does not belong to this patient',
            status: 'invalid',
            preauth
        });
    }

    // Check if already used
    if (preauth.is_used) {
        return res.json({
            valid: false,
            message: 'Authorization code has already been used',
            status: 'used',
            preauth
        });
    }

    // Check if expired
    const today = new Date();
    const expiryDate = new Date(preauth.expiry_date);

    if (expiryDate < today) {
        return res.json({
            valid: false,
            message: 'Authorization code has expired',
            status: 'expired',
            preauth
        });
    }

    // Check status
    if (preauth.status !== 'approved') {
        return res.json({
            valid: false,
            message: `Authorization is ${preauth.status}`,
            status: preauth.status,
            preauth
        });
    }

    res.json({
        valid: true,
        message: 'Authorization code is valid',
        status: 'valid',
        preauth
    });
}));

// Delete pre-authorization
router.delete('/:id', auth, asyncHandler(async (req, res) => {
    try {
        const preauth = await knex('hmo_preauthorizations').where('id', req.params.id).first();

        if (!preauth) {
            throw Errors.notFound('Pre-authorization request');
        }

        if (preauth.status !== 'pending') {
            throw Errors.badRequest('Only pending requests can be deleted');
        }

        await knex('hmo_preauthorizations').where('id', req.params.id).delete();

        log.info('Pre-authorization deleted', { preauthId: req.params.id, userId: (req as any).user.id });

        res.json({ message: 'Pre-authorization request deleted successfully' });
    } catch (error) {
        throw error;
    }
}));

// POST /api/preauth/verify/submit - Verify and use authorization code (Admin/EHR only)
router.post('/verify/submit', auth, authorize(['admin', 'ehr']), asyncHandler(async (req: Request, res: Response) => {
    const { authorization_code, patient_id, service_category, notes } = req.body;
    const user = (req as any).user;

    if (!authorization_code || !patient_id) {
        throw Errors.badRequest('Authorization code and patient ID are required');
    }

    // Get authorization details
    const preauth = await knex('hmo_preauthorizations')
        .select(
            'hmo_preauthorizations.*',
            'patients.first_name',
            'patients.last_name',
            'patients.mrn'
        )
        .join('patients', 'hmo_preauthorizations.patient_id', 'patients.id')
        .where('hmo_preauthorizations.authorization_code', authorization_code)
        .where('hmo_preauthorizations.patient_id', patient_id)
        .first();

    if (!preauth) {
        // Log failed verification
        await knex('authorization_verification_logs').insert({
            id: knex.raw('(lower(hex(randomblob(16))))'),
            authorization_code,
            patient_id,
            verified_by: user.id,
            verification_status: 'invalid',
            verification_date: new Date().toISOString(),
            service_category: service_category || null,
            notes: notes || 'Authorization code not found',
            verified_by_name: `${user.first_name} ${user.last_name}`,
            patient_name: null
        });

        throw Errors.notFound('Authorization code not found or does not match patient');
    }

    // Check if already used
    if (preauth.is_used) {
        // Log rejected verification
        await knex('authorization_verification_logs').insert({
            id: knex.raw('(lower(hex(randomblob(16))))'),
            authorization_id: preauth.id,
            authorization_code,
            patient_id,
            verified_by: user.id,
            verification_status: 'rejected',
            verification_date: new Date().toISOString(),
            service_category: service_category || preauth.service_category,
            notes: notes || 'Authorization code already used',
            verified_by_name: `${user.first_name} ${user.last_name}`,
            patient_name: `${preauth.first_name} ${preauth.last_name}`
        });

        throw Errors.badRequest('Authorization code has already been used');
    }

    // Check if expired
    const today = new Date();
    const expiryDate = new Date(preauth.expiry_date);

    if (expiryDate < today) {
        // Log expired verification
        await knex('authorization_verification_logs').insert({
            id: knex.raw('(lower(hex(randomblob(16))))'),
            authorization_id: preauth.id,
            authorization_code,
            patient_id,
            verified_by: user.id,
            verification_status: 'expired',
            verification_date: new Date().toISOString(),
            service_category: service_category || preauth.service_category,
            notes: notes || 'Authorization code expired',
            verified_by_name: `${user.first_name} ${user.last_name}`,
            patient_name: `${preauth.first_name} ${preauth.last_name}`
        });

        throw Errors.badRequest('Authorization code has expired');
    }

    // Check status
    if (preauth.status !== 'approved') {
        // Log rejected verification
        await knex('authorization_verification_logs').insert({
            id: knex.raw('(lower(hex(randomblob(16))))'),
            authorization_id: preauth.id,
            authorization_code,
            patient_id,
            verified_by: user.id,
            verification_status: 'rejected',
            verification_date: new Date().toISOString(),
            service_category: service_category || preauth.service_category,
            notes: notes || `Authorization is ${preauth.status}`,
            verified_by_name: `${user.first_name} ${user.last_name}`,
            patient_name: `${preauth.first_name} ${preauth.last_name}`
        });

        throw Errors.badRequest(`Authorization is ${preauth.status}`);
    }

    // Mark as used and verified
    await knex('hmo_preauthorizations')
        .where('id', preauth.id)
        .update({
            is_used: true,
            verified_at: new Date().toISOString(),
            verified_by: user.id,
            service_category: service_category || preauth.service_category,
            verification_notes: notes,
            patient_mrn: preauth.mrn,
            updated_at: new Date().toISOString()
        });

    // Log successful verification
    await knex('authorization_verification_logs').insert({
        id: knex.raw('(lower(hex(randomblob(16))))'),
        authorization_id: preauth.id,
        authorization_code,
        patient_id,
        verified_by: user.id,
        verification_status: 'verified',
        verification_date: new Date().toISOString(),
        service_category: service_category || preauth.service_category,
        notes: notes || 'Authorization verified successfully',
        verified_by_name: `${user.first_name} ${user.last_name}`,
        patient_name: `${preauth.first_name} ${preauth.last_name}`
    });

    log.info('Authorization verified and used', { authorizationId: preauth.id, authorizationCode: authorization_code, patientId: patient_id });

    res.json({
        success: true,
        message: 'Authorization verified successfully',
        authorization: {
            ...preauth,
            is_used: true,
            verified_at: new Date().toISOString(),
            verified_by: user.id,
            service_category: service_category || preauth.service_category
        }
    });
}));

// GET /api/preauth/verify/logs - Get verification audit logs (Admin only)
router.get('/verify/logs', auth, authorize(['admin']), asyncHandler(async (req: Request, res: Response) => {
    const { from_date, to_date, verified_by, status, patient_id } = req.query;

    let query = knex('authorization_verification_logs')
        .select('*')
        .orderBy('verification_date', 'desc');

    if (from_date) {
        query = query.where('verification_date', '>=', from_date);
    }
    if (to_date) {
        query = query.where('verification_date', '<=', to_date);
    }
    if (verified_by) {
        query = query.where('verified_by', verified_by);
    }
    if (status) {
        query = query.where('verification_status', status);
    }
    if (patient_id) {
        query = query.where('patient_id', patient_id);
    }

    const logs = await query;

    res.json(logs);
}));

// GET /api/preauth/patient/:patientId/active - Get active authorization for patient
router.get('/patient/:patientId/active', auth, asyncHandler(async (req: Request, res: Response) => {
    const { patientId } = req.params;

    const activeAuth = await knex('hmo_preauthorizations')
        .select(
            'hmo_preauthorizations.*',
            'hmo_providers.name as hmo_provider_name'
        )
        .join('hmo_providers', 'hmo_preauthorizations.hmo_provider_id', 'hmo_providers.id')
        .where('hmo_preauthorizations.patient_id', patientId)
        .where('hmo_preauthorizations.status', 'approved')
        .where('hmo_preauthorizations.expiry_date', '>=', new Date().toISOString().split('T')[0])
        .andWhere((qb) => {
            qb.where('hmo_preauthorizations.is_used', false)
                .orWhere('hmo_preauthorizations.verified_at', '>=', new Date().toISOString().split('T')[0]);
        })
        .orderBy('hmo_preauthorizations.created_at', 'desc')
        .first();

    if (!activeAuth) {
        return res.json({
            has_active_authorization: false,
            message: 'No active authorization found for this patient'
        });
    }

    res.json({
        has_active_authorization: true,
        authorization: activeAuth
    });
}));

// ============================================
// EXISTING ENDPOINTS
// ============================================

// GET /api/preauth - List pre-authorizations
// GET /api/preauth - List pre-authorizations
router.get('/', auth, asyncHandler(async (req: Request, res: Response) => {
    const { patient_id, hmo_provider_id, status, from_date, to_date, requested_by } = req.query;
    const user = (req as any).user;

    let query = knex('hmo_preauthorizations as pa')
        .select(
            'pa.*',
            'patients.first_name',
            'patients.last_name',
            'hmo_providers.name as hmo_name',
            'nhis_service_codes.code as service_code',
            'nhis_service_codes.description as service_description'
        )
        .join('patients', 'pa.patient_id', 'patients.id')
        .join('hmo_providers', 'pa.hmo_provider_id', 'hmo_providers.id')
        .leftJoin('nhis_service_codes', 'pa.requested_service_code_id', 'nhis_service_codes.id');

    // Role-based filtering
    if (user.role !== 'admin') {
        query = query.where('pa.requested_by', user.id);
    }

    if (patient_id) query = query.where('pa.patient_id', patient_id);
    if (hmo_provider_id) query = query.where('pa.hmo_provider_id', hmo_provider_id);
    if (status) query = query.where('pa.status', status);
    if (requested_by) query = query.where('pa.requested_by', requested_by);

    if (from_date) {
        query = query.where('pa.created_at', '>=', from_date);
    }

    if (to_date) {
        query = query.where('pa.created_at', '<=', to_date);
    }

    const preauths = await query.orderBy('pa.created_at', 'desc');
    res.json(preauths);
}));

// Create pre-authorization request
router.post('/', auth, asyncHandler(async (req, res) => {
    const {
        patient_id,
        hmo_provider_id,
        service_code_id,
        diagnosis_code,
        clinical_notes,
        requested_amount,
        priority
    } = req.body;

    // Generate authorization code
    const authorization_code = `AUTH-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

    const [id] = await knex('hmo_preauthorizations').insert({
        patient_id,
        hmo_provider_id,
        requested_service_code_id: service_code_id, // Map input to correct column
        diagnosis_code,
        clinical_notes,
        requested_amount,
        priority: priority || 'routine',
        authorization_code,
        status: 'pending',
        requested_by: (req as any).user.id,
        created_at: new Date(),
        updated_at: new Date()
    });

    const newPreauth = await knex('hmo_preauthorizations').where({ id }).first();

    log.info('Pre-authorization request created', {
        preauthId: id,
        authCode: authorization_code,
        patientId: patient_id
    });

    res.status(201).json(newPreauth);
}));

// GET /api/preauth/patient/:patientId - Get patient pre-authorizations
router.get('/patient/:patientId', auth, asyncHandler(async (req: Request, res: Response) => {
    const { patientId } = req.params;

    const preauths = await knex('hmo_preauthorizations')
        .select('hmo_preauthorizations.*', 'hmo_providers.name as hmo_name')
        .join('hmo_providers', 'hmo_preauthorizations.hmo_provider_id', 'hmo_providers.id')
        .where('hmo_preauthorizations.patient_id', patientId)
        .orderBy('hmo_preauthorizations.created_at', 'desc');

    res.json(preauths);
}));

// POST /api/preauth/check-required - Check if pre-auth required
router.post('/check-required', auth, asyncHandler(async (req: Request, res: Response) => {
    const { hmo_provider_id, service_code_id } = req.body;

    if (!hmo_provider_id || !service_code_id) {
        throw Errors.badRequest('HMO provider and service code are required');
    }

    // Get service details
    const service = await knex('nhis_service_codes')
        .where('id', service_code_id)
        .first();

    if (!service) {
        throw Errors.notFound('Service');
    }

    // Simple logic: require pre-auth for high-cost services (> 50,000)
    const requiresPreAuth = service.base_tariff > 50000;

    res.json({
        required: requiresPreAuth,
        reason: requiresPreAuth ? 'High-cost service requires pre-authorization' : 'Pre-authorization not required',
        service_tariff: service.base_tariff,
    });
}));

export default router;
