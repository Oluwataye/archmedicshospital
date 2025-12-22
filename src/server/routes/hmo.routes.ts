import express from 'express';
import type { Request, Response } from 'express';
import knex from '../db';
import { auth, authorize } from '../middleware/auth';
import { asyncHandler, Errors } from '../middleware/errorHandler';
import { log } from '../utils/logger';

const router = express.Router();

// GET /api/hmo/providers - List all HMO providers
router.get('/providers', auth, asyncHandler(async (req: Request, res: Response) => {
    const { active } = req.query;

    let query = knex('hmo_providers').select('*');

    if (active !== undefined) {
        query = query.where('is_active', active === 'true');
    }

    const providers = await query.orderBy('name', 'asc');

    return res.json(providers);
}));

// GET /api/hmo/providers/:id - Get single HMO provider
router.get('/providers/:id', auth, asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const provider = await knex('hmo_providers')
        .where('id', id)
        .first();

    if (!provider) {
        throw Errors.notFound('HMO provider');
    }

    return res.json(provider);
}));

// POST /api/hmo/providers - Create HMO provider (Admin only)
router.post('/providers', auth, authorize(['admin']), asyncHandler(async (req: Request, res: Response) => {
    const {
        name,
        code,
        nhia_accreditation_number,
        contact_email,
        contact_phone,
        address,
        coverage_type,
        is_active = true,
    } = req.body;

    // Validation
    if (!name || !code) {
        throw Errors.badRequest('Name and code are required');
    }

    // Check if code already exists
    const existing = await knex('hmo_providers').where('code', code).first();
    if (existing) {
        throw Errors.conflict('HMO provider with this code already exists');
    }

    const [provider] = await knex('hmo_providers')
        .insert({
            name,
            code,
            nhia_accreditation_number,
            contact_email,
            contact_phone,
            address,
            coverage_type,
            is_active,
        })
        .returning('*');

    log.info('HMO provider created', { providerId: provider.id, code });
    return res.status(201).json(provider);
}));

// PUT /api/hmo/providers/:id - Update HMO provider (Admin only)
router.put('/providers/:id', auth, authorize(['admin']), asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    delete updateData.id;
    delete updateData.created_at;

    updateData.updated_at = new Date().toISOString();

    const [provider] = await knex('hmo_providers')
        .where('id', id)
        .update(updateData)
        .returning('*');

    if (!provider) {
        throw Errors.notFound('HMO provider');
    }

    log.info('HMO provider updated', { providerId: id });
    return res.json(provider);
}));

// DELETE /api/hmo/providers/:id - Deactivate HMO provider (Admin only)
router.delete('/providers/:id', auth, authorize(['admin']), asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const [provider] = await knex('hmo_providers')
        .where('id', id)
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .returning('*');

    if (!provider) {
        throw Errors.notFound('HMO provider');
    }

    log.info('HMO provider deactivated', { providerId: id });
    return res.json({ message: 'HMO provider deactivated successfully', provider });
}));

// GET /api/hmo/providers/:id/packages - Get packages for HMO
router.get('/providers/:id/packages', auth, asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const packages = await knex('hmo_service_packages')
        .where('hmo_provider_id', id)
        .where('is_active', true)
        .orderBy('package_name', 'asc');

    const parsedPackages = packages.map(pkg => ({
        ...pkg,
        services_covered: pkg.services_covered ? JSON.parse(pkg.services_covered) : [],
        exclusions: pkg.exclusions ? JSON.parse(pkg.exclusions) : [],
    }));

    return res.json(parsedPackages);
}));

// GET /api/hmo/packages/:id - Get single package
router.get('/packages/:id', auth, asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const pkg = await knex('hmo_service_packages')
        .where('id', id)
        .first();

    if (!pkg) {
        throw Errors.notFound('Package');
    }

    const parsedPackage = {
        ...pkg,
        services_covered: pkg.services_covered ? JSON.parse(pkg.services_covered) : [],
        exclusions: pkg.exclusions ? JSON.parse(pkg.exclusions) : [],
    };

    return res.json(parsedPackage);
}));

// POST /api/hmo/packages - Create package (Admin only)
router.post('/packages', auth, authorize(['admin']), asyncHandler(async (req: Request, res: Response) => {
    const {
        hmo_provider_id,
        package_name,
        package_code,
        annual_limit,
        services_covered,
        exclusions,
        copay_percentage,
        is_active = true
    } = req.body;

    if (!hmo_provider_id || !package_name || !package_code) {
        throw Errors.badRequest('Provider ID, name and code are required');
    }

    const [pkg] = await knex('hmo_service_packages')
        .insert({
            hmo_provider_id,
            package_name,
            package_code,
            annual_limit,
            services_covered: JSON.stringify(services_covered || []),
            exclusions: JSON.stringify(exclusions || []),
            copay_percentage,
            is_active
        })
        .returning('*');

    log.info('HMO package created', { packageId: pkg.id, packageCode: package_code });
    return res.status(201).json(pkg);
}));

// PUT /api/hmo/packages/:id - Update package (Admin only)
router.put('/packages/:id', auth, authorize(['admin']), asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.services_covered) {
        updateData.services_covered = JSON.stringify(updateData.services_covered);
    }
    if (updateData.exclusions) {
        updateData.exclusions = JSON.stringify(updateData.exclusions);
    }

    delete updateData.id;
    delete updateData.created_at;
    updateData.updated_at = new Date().toISOString();

    const [pkg] = await knex('hmo_service_packages')
        .where('id', id)
        .update(updateData)
        .returning('*');

    if (!pkg) {
        throw Errors.notFound('Package');
    }

    log.info('HMO package updated', { packageId: id });
    return res.json(pkg);
}));

// DELETE /api/hmo/packages/:id - Delete package (Admin only)
router.delete('/packages/:id', auth, authorize(['admin']), asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const deleted = await knex('hmo_service_packages')
        .where('id', id)
        .del();

    if (!deleted) {
        throw Errors.notFound('Package');
    }

    log.info('HMO package deleted', { packageId: id });
    return res.json({ message: 'Package deleted successfully' });
}));

// GET /api/hmo/providers/:id/tariffs - Get tariffs for HMO
router.get('/providers/:id/tariffs', auth, asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const tariffs = await knex('hmo_tariffs')
        .where('hmo_provider_id', id)
        .orderBy('created_at', 'desc');

    return res.json(tariffs);
}));

// POST /api/hmo/tariffs - Create tariff (Admin only)
router.post('/tariffs', auth, authorize(['admin']), asyncHandler(async (req: Request, res: Response) => {
    const {
        hmo_provider_id,
        service_code_id,
        tariff_amount,
        copay_amount,
        copay_percentage,
        effective_from,
        effective_to
    } = req.body;

    if (!hmo_provider_id || !service_code_id || tariff_amount === undefined) {
        throw Errors.badRequest('Provider ID, service code and tariff amount are required');
    }

    const [tariff] = await knex('hmo_tariffs')
        .insert({
            hmo_provider_id,
            service_code_id,
            tariff_amount,
            copay_amount,
            copay_percentage,
            effective_from,
            effective_to
        })
        .returning('*');

    log.info('HMO tariff created', { tariffId: tariff.id, hmoProviderId: hmo_provider_id });
    return res.status(201).json(tariff);
}));

// PUT /api/hmo/tariffs/:id - Update tariff (Admin only)
router.put('/tariffs/:id', auth, authorize(['admin']), asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    delete updateData.id;
    delete updateData.created_at;
    updateData.updated_at = new Date().toISOString();

    const [tariff] = await knex('hmo_tariffs')
        .where('id', id)
        .update(updateData)
        .returning('*');

    if (!tariff) {
        throw Errors.notFound('Tariff');
    }

    log.info('HMO tariff updated', { tariffId: id });
    return res.json(tariff);
}));

// DELETE /api/hmo/tariffs/:id - Delete tariff (Admin only)
router.delete('/tariffs/:id', auth, authorize(['admin']), asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const deleted = await knex('hmo_tariffs')
        .where('id', id)
        .del();

    if (!deleted) {
        throw Errors.notFound('Tariff');
    }

    log.info('HMO tariff deleted', { tariffId: id });
    return res.json({ message: 'Tariff deleted successfully' });
}));

// GET /api/hmo/eligibility/:patientId - Check patient eligibility
router.get('/eligibility/:patientId', auth, asyncHandler(async (req: Request, res: Response) => {
    const { patientId } = req.params;

    const patient = await knex('patients')
        .where('id', patientId)
        .first();

    if (!patient) {
        throw Errors.notFound('Patient');
    }

    // Check if patient has HMO
    if (!patient.hmo_provider_id) {
        return res.json({
            is_eligible: false,
            patient_id: patientId,
            policy_status: 'not_enrolled',
            message: 'Patient is not enrolled in any HMO',
        });
    }

    // Get HMO provider and package details
    const hmoProvider = await knex('hmo_providers')
        .where('id', patient.hmo_provider_id)
        .first();

    const hmoPackage = patient.hmo_package_id
        ? await knex('hmo_service_packages')
            .where('id', patient.hmo_package_id)
            .first()
        : null;

    // Check policy validity
    const today = new Date();
    const policyStart = patient.policy_start_date ? new Date(patient.policy_start_date) : null;
    const policyEnd = patient.policy_end_date ? new Date(patient.policy_end_date) : null;

    let policyStatus = 'active';
    let isEligible = true;
    let message = 'Patient is eligible for HMO services';

    if (policyEnd && policyEnd < today) {
        policyStatus = 'expired';
        isEligible = false;
        message = 'Patient policy has expired';
    } else if (policyStart && policyStart > today) {
        policyStatus = 'not_active';
        isEligible = false;
        message = 'Patient policy has not started yet';
    }

    return res.json({
        is_eligible: isEligible,
        patient_id: patientId,
        hmo_provider: hmoProvider,
        package: hmoPackage ? {
            ...hmoPackage,
            services_covered: hmoPackage.services_covered ? JSON.parse(hmoPackage.services_covered) : [],
            exclusions: hmoPackage.exclusions ? JSON.parse(hmoPackage.exclusions) : [],
        } : null,
        policy_status: policyStatus,
        coverage_remaining: hmoPackage?.annual_limit || 0,
        message,
    });
}));

// POST /api/hmo/check-coverage - Check if service is covered
router.post('/check-coverage', auth, asyncHandler(async (req: Request, res: Response) => {
    const { patient_id, service_code_id } = req.body;

    if (!patient_id || !service_code_id) {
        throw Errors.badRequest('Patient ID and service code ID are required');
    }

    const patient = await knex('patients').where('id', patient_id).first();

    if (!patient || !patient.hmo_provider_id) {
        return res.json({ covered: false, message: 'Patient not enrolled in HMO' });
    }

    // Get tariff for this service and HMO
    const tariff = await knex('hmo_tariffs')
        .where('hmo_provider_id', patient.hmo_provider_id)
        .where('service_code_id', service_code_id)
        .where('effective_from', '<=', new Date().toISOString().split('T')[0])
        .where((qb) => {
            qb.whereNull('effective_to')
                .orWhere('effective_to', '>=', new Date().toISOString().split('T')[0]);
        })
        .first();

    if (!tariff) {
        return res.json({ covered: false, message: 'Service not covered by HMO' });
    }

    return res.json({
        covered: true,
        copay_amount: tariff.copay_amount,
        copay_percentage: tariff.copay_percentage,
        tariff_amount: tariff.tariff_amount,
    });
}));

// GET /api/hmo/reports/monthly-billing - Get monthly billing report
router.get('/reports/monthly-billing', auth, asyncHandler(async (req: Request, res: Response) => {
    const { month, year, hmo_provider_id } = req.query;

    if (!month || !year) {
        throw Errors.badRequest('Month and year are required');
    }

    let query = knex('hmo_claims')
        .join('patients', 'hmo_claims.patient_id', 'patients.id')
        .join('hmo_providers', 'hmo_claims.hmo_provider_id', 'hmo_providers.id')
        .select(
            'hmo_providers.name as hmo_name',
            'patients.first_name',
            'patients.last_name',
            'patients.nhis_enrollment_number',
            knex.raw('COUNT(hmo_claims.id) as claim_count'),
            knex.raw('SUM(hmo_claims.total_amount) as total_billed'),
            knex.raw('SUM(hmo_claims.claim_amount) as total_approved'),
            knex.raw('SUM(hmo_claims.copay_amount) as patient_copay'),
            knex.raw(`(
                SELECT string_agg(authorization_code, ', ')
                FROM hmo_preauthorizations
                WHERE hmo_preauthorizations.patient_id = patients.id
                AND hmo_preauthorizations.hmo_provider_id = hmo_providers.id
                AND to_char(hmo_preauthorizations.created_at, 'MM') = ?
                AND to_char(hmo_preauthorizations.created_at, 'YYYY') = ?
                AND hmo_preauthorizations.status = 'approved'
            ) as authorization_codes`, [month.toString().padStart(2, '0'), year.toString()])
        )
        .whereRaw('to_char(hmo_claims.claim_date, \'MM\') = ?', [month.toString().padStart(2, '0')])
        .whereRaw('to_char(hmo_claims.claim_date, \'YYYY\') = ?', [year.toString()])
        .groupBy('hmo_providers.id', 'patients.id', 'hmo_providers.name', 'patients.first_name', 'patients.last_name', 'patients.nhis_enrollment_number');

    if (hmo_provider_id && hmo_provider_id !== 'all') {
        query = query.where('hmo_claims.hmo_provider_id', hmo_provider_id);
    }

    const report = await query;

    const formattedReport = report.map((row: any) => ({
        hmo_name: row.hmo_name,
        patient_name: `${row.first_name} ${row.last_name}`,
        enrollee_id: row.nhis_enrollment_number || 'N/A',
        authorization_codes: row.authorization_codes || 'N/A',
        claim_count: row.claim_count,
        total_billed: row.total_billed,
        patient_copay: row.patient_copay,
        hmo_liability: row.total_approved
    }));

    return res.json(formattedReport);
}));

export default router;
