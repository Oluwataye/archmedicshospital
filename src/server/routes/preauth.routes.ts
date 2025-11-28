import express from 'express';
import type { Request, Response } from 'express';
import knex from '../db';
import { auth, authorize } from '../middleware/auth';

const router = express.Router();

// Generate unique authorization code
const generateAuthCode = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 9);
    return `AUTH-${timestamp}-${random}`.toUpperCase();
};

// GET /api/preauth - List pre-authorizations
router.get('/', auth, async (req: Request, res: Response) => {
    try {
        const { patient_id, hmo_provider_id, status, from_date, to_date, requested_by } = req.query;
        const user = (req as any).user;

        let query = knex('hmo_preauthorizations')
            .select(
                'hmo_preauthorizations.*',
                'patients.first_name',
                'patients.last_name',
                'hmo_providers.name as hmo_name',
                'nhis_service_codes.code as service_code',
                'nhis_service_codes.description as service_description'
            )
            .join('patients', 'hmo_preauthorizations.patient_id', 'patients.id')
            .join('hmo_providers', 'hmo_preauthorizations.hmo_provider_id', 'hmo_providers.id')
            .leftJoin('nhis_service_codes', 'hmo_preauthorizations.requested_service_code_id', 'nhis_service_codes.id');

        // Role-based filtering
        if (user.role !== 'admin') {
            query = query.where('hmo_preauthorizations.requested_by', user.id);
        }

        if (patient_id) query = query.where('hmo_preauthorizations.patient_id', patient_id);
        if (hmo_provider_id) query = query.where('hmo_preauthorizations.hmo_provider_id', hmo_provider_id);
        if (status) query = query.where('hmo_preauthorizations.status', status);
        if (requested_by) query = query.where('hmo_preauthorizations.requested_by', requested_by);

        if (from_date) {
            query = query.where('hmo_preauthorizations.request_date', '>=', from_date);
        }
        if (to_date) {
            query = query.where('hmo_preauthorizations.request_date', '<=', to_date);
        }

        const preauths = await query.orderBy('hmo_preauthorizations.created_at', 'desc');

        res.json(preauths);
    } catch (error) {
        console.error('Error fetching pre-authorizations:', error);
        res.status(500).json({ error: 'Failed to fetch pre-authorizations' });
    }
});

// GET /api/preauth/:id - Get pre-authorization details
router.get('/:id', auth, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const preauth = await knex('hmo_preauthorizations')
            .select(
                'hmo_preauthorizations.*',
                'patients.first_name',
                'patients.last_name',
                'hmo_providers.name as hmo_name',
                'nhis_service_codes.code as service_code',
                'nhis_service_codes.description as service_description'
            )
            .join('patients', 'hmo_preauthorizations.patient_id', 'patients.id')
            .join('hmo_providers', 'hmo_preauthorizations.hmo_provider_id', 'hmo_providers.id')
            .leftJoin('nhis_service_codes', 'hmo_preauthorizations.requested_service_code_id', 'nhis_service_codes.id')
            .where('hmo_preauthorizations.id', id)
            .first();

        if (!preauth) {
            return res.status(404).json({ error: 'Pre-authorization not found' });
        }

        res.json(preauth);
    } catch (error) {
        console.error('Error fetching pre-authorization:', error);
        res.status(500).json({ error: 'Failed to fetch pre-authorization' });
    }
});

// GET /api/preauth/code/:authCode - Get by authorization code
router.get('/code/:authCode', auth, async (req: Request, res: Response) => {
    try {
        const { authCode } = req.params;

        const preauth = await knex('hmo_preauthorizations')
            .where('authorization_code', authCode)
            .first();

        if (!preauth) {
            return res.status(404).json({ error: 'Pre-authorization not found' });
        }

        res.json(preauth);
    } catch (error) {
        console.error('Error fetching pre-authorization:', error);
        res.status(500).json({ error: 'Failed to fetch pre-authorization' });
    }
});

// POST /api/preauth - Create pre-authorization request
router.post('/', auth, async (req: Request, res: Response) => {
    try {
        const {
            patient_id,
            hmo_provider_id,
            requested_service_code_id,
            diagnosis,
            expiry_date,
            notes,
        } = req.body;
        const user = (req as any).user;

        if (!patient_id || !hmo_provider_id) {
            return res.status(400).json({ error: 'Patient and HMO provider are required' });
        }

        // Calculate expiry date if not provided (default 30 days)
        const expiryDate = expiry_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const [preauth] = await knex('hmo_preauthorizations')
            .insert({
                authorization_code: generateAuthCode(),
                patient_id,
                hmo_provider_id,
                requested_service_code_id,
                diagnosis,
                requested_by: user.id,
                request_date: new Date().toISOString(),
                expiry_date: expiryDate,
                status: 'pending',
                notes,
            })
            .returning('*');

        res.status(201).json(preauth);
    } catch (error) {
        console.error('Error creating pre-authorization:', error);
        res.status(500).json({ error: 'Failed to create pre-authorization' });
    }
});

// PUT /api/preauth/:id - Update pre-authorization
router.put('/:id', auth, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        delete updateData.id;
        delete updateData.authorization_code;
        delete updateData.created_at;
        updateData.updated_at = new Date().toISOString();

        const [preauth] = await knex('hmo_preauthorizations')
            .where('id', id)
            .update(updateData)
            .returning('*');

        if (!preauth) {
            return res.status(404).json({ error: 'Pre-authorization not found' });
        }

        res.json(preauth);
    } catch (error) {
        console.error('Error updating pre-authorization:', error);
        res.status(500).json({ error: 'Failed to update pre-authorization' });
    }
});

// PUT /api/preauth/:id/approve - Approve pre-authorization
router.put('/:id/approve', auth, authorize(['admin', 'doctor']), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { approved_amount, expiry_date } = req.body;

        if (!approved_amount) {
            return res.status(400).json({ error: 'Approved amount is required' });
        }

        const updateData: any = {
            status: 'approved',
            approval_date: new Date().toISOString(),
            approved_amount,
            updated_at: new Date().toISOString(),
        };

        if (expiry_date) {
            updateData.expiry_date = expiry_date;
        }

        const [preauth] = await knex('hmo_preauthorizations')
            .where('id', id)
            .update(updateData)
            .returning('*');

        if (!preauth) {
            return res.status(404).json({ error: 'Pre-authorization not found' });
        }

        res.json(preauth);
    } catch (error) {
        console.error('Error approving pre-authorization:', error);
        res.status(500).json({ error: 'Failed to approve pre-authorization' });
    }
});

// PUT /api/preauth/:id/reject - Reject pre-authorization
router.put('/:id/reject', auth, authorize(['admin', 'doctor']), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { notes } = req.body;

        const [preauth] = await knex('hmo_preauthorizations')
            .where('id', id)
            .update({
                status: 'rejected',
                notes: notes || knex.raw('notes'),
                updated_at: new Date().toISOString(),
            })
            .returning('*');

        if (!preauth) {
            return res.status(404).json({ error: 'Pre-authorization not found' });
        }

        res.json(preauth);
    } catch (error) {
        console.error('Error rejecting pre-authorization:', error);
        res.status(500).json({ error: 'Failed to reject pre-authorization' });
    }
});

// GET /api/preauth/verify/:authCode - Verify authorization code
router.get('/verify/:authCode', auth, async (req: Request, res: Response) => {
    try {
        const { authCode } = req.params;

        const preauth = await knex('hmo_preauthorizations')
            .where('authorization_code', authCode)
            .first();

        if (!preauth) {
            return res.json({
                valid: false,
                message: 'Authorization code not found',
            });
        }

        // Check if expired
        const today = new Date();
        const expiryDate = new Date(preauth.expiry_date);

        if (preauth.status !== 'approved') {
            return res.json({
                valid: false,
                preauth,
                message: `Authorization is ${preauth.status}`,
            });
        }

        if (expiryDate < today) {
            // Update status to expired
            await knex('hmo_preauthorizations')
                .where('id', preauth.id)
                .update({ status: 'expired', updated_at: new Date().toISOString() });

            return res.json({
                valid: false,
                preauth: { ...preauth, status: 'expired' },
                message: 'Authorization has expired',
            });
        }

        res.json({
            valid: true,
            preauth,
            message: 'Authorization is valid',
        });
    } catch (error) {
        console.error('Error verifying authorization:', error);
        res.status(500).json({ error: 'Failed to verify authorization' });
    }
});

// GET /api/preauth/patient/:patientId - Get patient pre-authorizations
router.get('/patient/:patientId', auth, async (req: Request, res: Response) => {
    try {
        const { patientId } = req.params;

        const preauths = await knex('hmo_preauthorizations')
            .select('hmo_preauthorizations.*', 'hmo_providers.name as hmo_name')
            .join('hmo_providers', 'hmo_preauthorizations.hmo_provider_id', 'hmo_providers.id')
            .where('hmo_preauthorizations.patient_id', patientId)
            .orderBy('hmo_preauthorizations.created_at', 'desc');

        res.json(preauths);
    } catch (error) {
        console.error('Error fetching patient pre-authorizations:', error);
        res.status(500).json({ error: 'Failed to fetch patient pre-authorizations' });
    }
});

// POST /api/preauth/check-required - Check if pre-auth required
router.post('/check-required', auth, async (req: Request, res: Response) => {
    try {
        const { hmo_provider_id, service_code_id } = req.body;

        if (!hmo_provider_id || !service_code_id) {
            return res.status(400).json({ error: 'HMO provider and service code are required' });
        }

        // Get service details
        const service = await knex('nhis_service_codes')
            .where('id', service_code_id)
            .first();

        if (!service) {
            return res.status(404).json({ error: 'Service not found' });
        }

        // Simple logic: require pre-auth for high-cost services (> 50,000)
        const requiresPreAuth = service.base_tariff > 50000;

        res.json({
            required: requiresPreAuth,
            reason: requiresPreAuth ? 'High-cost service requires pre-authorization' : 'Pre-authorization not required',
            service_tariff: service.base_tariff,
        });
    } catch (error) {
        console.error('Error checking pre-auth requirement:', error);
        res.status(500).json({ error: 'Failed to check pre-auth requirement' });
    }
});

export default router;
