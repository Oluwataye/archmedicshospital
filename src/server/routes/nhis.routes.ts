import express from 'express';
import type { Request, Response } from 'express';
import knex from '../db.ts';
import { auth, authorize } from '../middleware/auth.ts';

const router = express.Router();

// GET /api/nhis/service-codes - List all service codes
router.get('/service-codes', auth, async (req: Request, res: Response) => {
    try {
        const { category, search, is_active, min_tariff, max_tariff } = req.query;

        let query = knex('nhis_service_codes').select('*');

        if (category) {
            query = query.where('category', category);
        }

        if (search) {
            query = query.where(function () {
                this.where('code', 'like', `%${search}%`)
                    .orWhere('description', 'like', `%${search}%`);
            });
        }

        if (is_active !== undefined) {
            query = query.where('is_active', is_active === 'true');
        }

        if (min_tariff) {
            query = query.where('base_tariff', '>=', parseFloat(min_tariff as string));
        }

        if (max_tariff) {
            query = query.where('base_tariff', '<=', parseFloat(max_tariff as string));
        }

        const serviceCodes = await query.orderBy('category', 'asc').orderBy('code', 'asc');

        res.json(serviceCodes);
    } catch (error) {
        console.error('Error fetching service codes:', error);
        res.status(500).json({ error: 'Failed to fetch service codes' });
    }
});

// GET /api/nhis/service-codes/search - Search service codes
router.get('/service-codes/search', auth, async (req: Request, res: Response) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        const serviceCodes = await knex('nhis_service_codes')
            .where('code', 'like', `%${q}%`)
            .orWhere('description', 'like', `%${q}%`)
            .where('is_active', true)
            .limit(20)
            .orderBy('code', 'asc');

        res.json(serviceCodes);
    } catch (error) {
        console.error('Error searching service codes:', error);
        res.status(500).json({ error: 'Failed to search service codes' });
    }
});

// GET /api/nhis/service-codes/:id - Get single service code
router.get('/service-codes/:id', auth, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const serviceCode = await knex('nhis_service_codes')
            .where('id', id)
            .first();

        if (!serviceCode) {
            return res.status(404).json({ error: 'Service code not found' });
        }

        res.json(serviceCode);
    } catch (error) {
        console.error('Error fetching service code:', error);
        res.status(500).json({ error: 'Failed to fetch service code' });
    }
});

// GET /api/nhis/service-codes/code/:code - Get service code by code
router.get('/service-codes/code/:code', auth, async (req: Request, res: Response) => {
    try {
        const { code } = req.params;

        const serviceCode = await knex('nhis_service_codes')
            .where('code', code)
            .first();

        if (!serviceCode) {
            return res.status(404).json({ error: 'Service code not found' });
        }

        res.json(serviceCode);
    } catch (error) {
        console.error('Error fetching service code:', error);
        res.status(500).json({ error: 'Failed to fetch service code' });
    }
});

// POST /api/nhis/service-codes - Create service code (Admin only)
router.post('/service-codes', auth, authorize(['admin']), async (req: Request, res: Response) => {
    try {
        const { code, description, category, base_tariff, is_active = true } = req.body;

        if (!code || !description || !category || base_tariff === undefined) {
            return res.status(400).json({ error: 'Code, description, category, and base_tariff are required' });
        }

        // Check if code already exists
        const existing = await knex('nhis_service_codes').where('code', code).first();
        if (existing) {
            return res.status(409).json({ error: 'Service code already exists' });
        }

        const [serviceCode] = await knex('nhis_service_codes')
            .insert({ code, description, category, base_tariff, is_active })
            .returning('*');

        res.status(201).json(serviceCode);
    } catch (error) {
        console.error('Error creating service code:', error);
        res.status(500).json({ error: 'Failed to create service code' });
    }
});

// PUT /api/nhis/service-codes/:id - Update service code (Admin only)
router.put('/service-codes/:id', auth, authorize(['admin']), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        delete updateData.id;
        delete updateData.created_at;
        updateData.updated_at = new Date().toISOString();

        const [serviceCode] = await knex('nhis_service_codes')
            .where('id', id)
            .update(updateData)
            .returning('*');

        if (!serviceCode) {
            return res.status(404).json({ error: 'Service code not found' });
        }

        res.json(serviceCode);
    } catch (error) {
        console.error('Error updating service code:', error);
        res.status(500).json({ error: 'Failed to update service code' });
    }
});

// GET /api/nhis/service-codes/:id/tariffs - Get tariffs for service
router.get('/service-codes/:id/tariffs', auth, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { hmo_provider_id } = req.query;

        let query = knex('hmo_tariffs')
            .select('hmo_tariffs.*', 'hmo_providers.name as hmo_name', 'hmo_providers.code as hmo_code')
            .join('hmo_providers', 'hmo_tariffs.hmo_provider_id', 'hmo_providers.id')
            .where('hmo_tariffs.service_code_id', id)
            .where('hmo_tariffs.effective_from', '<=', new Date().toISOString().split('T')[0])
            .where(function () {
                this.whereNull('hmo_tariffs.effective_to')
                    .orWhere('hmo_tariffs.effective_to', '>=', new Date().toISOString().split('T')[0]);
            });

        if (hmo_provider_id) {
            query = query.where('hmo_tariffs.hmo_provider_id', hmo_provider_id);
        }

        const tariffs = await query;

        res.json(tariffs);
    } catch (error) {
        console.error('Error fetching tariffs:', error);
        res.status(500).json({ error: 'Failed to fetch tariffs' });
    }
});

// GET /api/nhis/tariff - Get specific tariff
router.get('/tariff', auth, async (req: Request, res: Response) => {
    try {
        const { service_code_id, hmo_provider_id } = req.query;

        if (!service_code_id || !hmo_provider_id) {
            return res.status(400).json({ error: 'Service code ID and HMO provider ID are required' });
        }

        const tariff = await knex('hmo_tariffs')
            .where('service_code_id', service_code_id)
            .where('hmo_provider_id', hmo_provider_id)
            .where('effective_from', '<=', new Date().toISOString().split('T')[0])
            .where(function () {
                this.whereNull('effective_to')
                    .orWhere('effective_to', '>=', new Date().toISOString().split('T')[0]);
            })
            .first();

        res.json(tariff || null);
    } catch (error) {
        console.error('Error fetching tariff:', error);
        res.status(500).json({ error: 'Failed to fetch tariff' });
    }
});

// GET /api/nhis/service-codes/categories - Get all categories
router.get('/service-codes/categories', auth, async (req: Request, res: Response) => {
    try {
        const categories = await knex('nhis_service_codes')
            .distinct('category')
            .whereNotNull('category')
            .orderBy('category', 'asc');

        res.json(categories.map(c => c.category));
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

export default router;
