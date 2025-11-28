import express from 'express';
import type { Request, Response } from 'express';
import knex from '../db.ts';
import { auth, authorize } from '../middleware/auth.ts';

const router = express.Router();

// GET /api/hmo/providers - List all HMO providers
router.get('/providers', auth, async (req: Request, res: Response) => {
    try {
        const { active } = req.query;

        let query = knex('hmo_providers').select('*');

        if (active !== undefined) {
            query = query.where('is_active', active === 'true');
        }

        const providers = await query.orderBy('name', 'asc');

        return res.json(providers);
    } catch (error) {
        console.error('Error fetching HMO providers:', error);
        res.status(500).json({ error: 'Failed to fetch HMO providers' });
    }
});

// GET /api/hmo/providers/:id - Get single HMO provider
router.get('/providers/:id', auth, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const provider = await knex('hmo_providers')
            .where('id', id)
            .first();

        if (!provider) {
            return res.status(404).json({ error: 'HMO provider not found' });
        }

        return res.json(provider);
    } catch (error) {
        console.error('Error fetching HMO provider:', error);
        res.status(500).json({ error: 'Failed to fetch HMO provider' });
    }
});

// POST /api/hmo/providers - Create HMO provider (Admin only)
router.post('/providers', auth, authorize(['admin']), async (req: Request, res: Response) => {
    try {
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
            return res.status(400).json({ error: 'Name and code are required' });
        }

        // Check if code already exists
        const existing = await knex('hmo_providers').where('code', code).first();
        if (existing) {
            return res.status(409).json({ error: 'HMO provider with this code already exists' });
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

        return res.status(201).json(provider);
    } catch (error) {
        console.error('Error creating HMO provider:', error);
        res.status(500).json({ error: 'Failed to create HMO provider' });
    }
});

// PUT /api/hmo/providers/:id - Update HMO provider (Admin only)
router.put('/providers/:id', auth, authorize(['admin']), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Remove id from update data if present
        delete updateData.id;
        delete updateData.created_at;

        updateData.updated_at = new Date().toISOString();

        const [provider] = await knex('hmo_providers')
            .where('id', id)
            .update(updateData)
            .returning('*');

        if (!provider) {
            return res.status(404).json({ error: 'HMO provider not found' });
        }

        return res.json(provider);
    } catch (error) {
        console.error('Error updating HMO provider:', error);
        res.status(500).json({ error: 'Failed to update HMO provider' });
    }
});

// DELETE /api/hmo/providers/:id - Deactivate HMO provider (Admin only)
router.delete('/providers/:id', auth, authorize(['admin']), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const [provider] = await knex('hmo_providers')
            .where('id', id)
            .update({ is_active: false, updated_at: new Date().toISOString() })
            .returning('*');

        if (!provider) {
            return res.status(404).json({ error: 'HMO provider not found' });
        }

        return res.json({ message: 'HMO provider deactivated successfully', provider });
    } catch (error) {
        console.error('Error deactivating HMO provider:', error);
        res.status(500).json({ error: 'Failed to deactivate HMO provider' });
    }
});

// GET /api/hmo/providers/:id/packages - Get packages for HMO
router.get('/providers/:id/packages', auth, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const packages = await knex('hmo_service_packages')
            .where('hmo_provider_id', id)
            .where('is_active', true)
            .orderBy('package_name', 'asc');

        // Parse JSON fields
        const parsedPackages = packages.map(pkg => ({
            ...pkg,
            services_covered: pkg.services_covered ? JSON.parse(pkg.services_covered) : [],
            exclusions: pkg.exclusions ? JSON.parse(pkg.exclusions) : [],
        }));

        return res.json(parsedPackages);
    } catch (error) {
        console.error('Error fetching HMO packages:', error);
        res.status(500).json({ error: 'Failed to fetch HMO packages' });
    }
});

// GET /api/hmo/packages/:id - Get single package
router.get('/packages/:id', auth, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const pkg = await knex('hmo_service_packages')
            .where('id', id)
            .first();

        if (!pkg) {
            return res.status(404).json({ error: 'Package not found' });
        }

        // Parse JSON fields
        const parsedPackage = {
            ...pkg,
            services_covered: pkg.services_covered ? JSON.parse(pkg.services_covered) : [],
            exclusions: pkg.exclusions ? JSON.parse(pkg.exclusions) : [],
        };

        return res.json(parsedPackage);
    } catch (error) {
        console.error('Error fetching package:', error);
        res.status(500).json({ error: 'Failed to fetch package' });
    }
});

// POST /api/hmo/packages - Create package (Admin only)
router.post('/packages', auth, authorize(['admin']), async (req: Request, res: Response) => {
    try {
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
            return res.status(400).json({ error: 'Provider ID, name and code are required' });
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

        return res.status(201).json(pkg);
    } catch (error) {
        console.error('Error creating package:', error);
        res.status(500).json({ error: 'Failed to create package' });
    }
});

// PUT /api/hmo/packages/:id - Update package (Admin only)
router.put('/packages/:id', auth, authorize(['admin']), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Handle JSON fields
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
            return res.status(404).json({ error: 'Package not found' });
        }

        return res.json(pkg);
    } catch (error) {
        console.error('Error updating package:', error);
        res.status(500).json({ error: 'Failed to update package' });
    }
});

// DELETE /api/hmo/packages/:id - Delete package (Admin only)
router.delete('/packages/:id', auth, authorize(['admin']), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deleted = await knex('hmo_service_packages')
            .where('id', id)
            .del();

        if (!deleted) {
            return res.status(404).json({ error: 'Package not found' });
        }

        return res.json({ message: 'Package deleted successfully' });
    } catch (error) {
        console.error('Error deleting package:', error);
        res.status(500).json({ error: 'Failed to delete package' });
    }
});

// GET /api/hmo/providers/:id/tariffs - Get tariffs for HMO
router.get('/providers/:id/tariffs', auth, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const tariffs = await knex('hmo_tariffs')
            .where('hmo_provider_id', id)
            .orderBy('created_at', 'desc');

        return res.json(tariffs);
    } catch (error) {
        console.error('Error fetching tariffs:', error);
        res.status(500).json({ error: 'Failed to fetch tariffs' });
    }
});

// POST /api/hmo/tariffs - Create tariff (Admin only)
router.post('/tariffs', auth, authorize(['admin']), async (req: Request, res: Response) => {
    try {
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
            return res.status(400).json({ error: 'Provider ID, service code and tariff amount are required' });
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

        return res.status(201).json(tariff);
    } catch (error) {
        console.error('Error creating tariff:', error);
        res.status(500).json({ error: 'Failed to create tariff' });
    }
});

// PUT /api/hmo/tariffs/:id - Update tariff (Admin only)
router.put('/tariffs/:id', auth, authorize(['admin']), async (req: Request, res: Response) => {
    try {
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
            return res.status(404).json({ error: 'Tariff not found' });
        }

        return res.json(tariff);
    } catch (error) {
        console.error('Error updating tariff:', error);
        res.status(500).json({ error: 'Failed to update tariff' });
    }
});

// DELETE /api/hmo/tariffs/:id - Delete tariff (Admin only)
router.delete('/tariffs/:id', auth, authorize(['admin']), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deleted = await knex('hmo_tariffs')
            .where('id', id)
            .del();

        if (!deleted) {
            return res.status(404).json({ error: 'Tariff not found' });
        }

        return res.json({ message: 'Tariff deleted successfully' });
    } catch (error) {
        console.error('Error deleting tariff:', error);
        res.status(500).json({ error: 'Failed to delete tariff' });
    }
});

// GET /api/hmo/eligibility/:patientId - Check patient eligibility
router.get('/eligibility/:patientId', auth, async (req: Request, res: Response) => {
    try {
        const { patientId } = req.params;

        const patient = await knex('patients')
            .where('id', patientId)
            .first();

        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
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
    } catch (error) {
        console.error('Error checking eligibility:', error);
        res.status(500).json({ error: 'Failed to check eligibility' });
    }
});

// POST /api/hmo/check-coverage - Check if service is covered
router.post('/check-coverage', auth, async (req: Request, res: Response) => {
    try {
        const { patient_id, service_code_id } = req.body;

        if (!patient_id || !service_code_id) {
            return res.status(400).json({ error: 'Patient ID and service code ID are required' });
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
            .where(function () {
                this.whereNull('effective_to')
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
    } catch (error) {
        console.error('Error checking coverage:', error);
        res.status(500).json({ error: 'Failed to check coverage' });
    }
});

export default router;
