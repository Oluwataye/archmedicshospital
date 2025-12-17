import express from 'express';
import { auth } from '../middleware/auth';
import db from '../db';
import { asyncHandler, Errors } from '../middleware/errorHandler';
import { log } from '../utils/logger';

const router = express.Router();

// Get all services
router.get('/', auth, asyncHandler(async (req, res) => {
    const { category, department, active, search, exclude_categories } = req.query;

    let query = db('services').select('*');

    if (category && category !== 'all') {
        query = query.where('category', category);
    }

    if (department && department !== 'all') {
        query = query.where('department', department);
    }

    if (active !== undefined) {
        query = query.where('is_active', active === 'true' ? 1 : 0);
    }

    // Handle category exclusion for Cashier
    if (exclude_categories) {
        const categoriesToExclude = (exclude_categories as string).split(',');
        query = query.whereNotIn('category', categoriesToExclude);
        query = query.whereNotIn('department', categoriesToExclude);
    }

    if (search) {
        const term = `%${search}%`;
        query = query.whereRaw('(name LIKE ? OR description LIKE ?)', [term, term]);
    }

    const services = await query.orderBy('name', 'asc');

    res.json({
        services,
        total: services.length
    });
}));

// Get service by ID
router.get('/:id', auth, asyncHandler(async (req, res) => {
    const service = await db('services')
        .where('id', req.params.id)
        .first();

    if (!service) {
        throw Errors.notFound('Service');
    }

    res.json(service);
}));

// Create new service
router.post('/', auth, asyncHandler(async (req, res) => {
    const {
        name,
        description,
        category,
        department,
        base_price,
        tax_rate,
        hmo_covered,
        hmo_price,
        duration_minutes,
        is_active
    } = req.body;

    // Validation
    if (!name || !category || base_price === undefined) {
        throw Errors.badRequest('Name, category, and base price are required');
    }

    const [id] = await db('services').insert({
        name,
        description,
        category,
        department,
        base_price: parseFloat(base_price),
        tax_rate: tax_rate ? parseFloat(tax_rate) : 0,
        hmo_covered: hmo_covered ? 1 : 0,
        hmo_price: hmo_price ? parseFloat(hmo_price) : null,
        duration_minutes: duration_minutes ? parseInt(duration_minutes) : null,
        is_active: is_active !== undefined ? (is_active ? 1 : 0) : 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    });

    const newService = await db('services').where('id', id).first();

    log.info('Service created', { serviceId: id, name, category });
    res.status(201).json({
        message: 'Service created successfully',
        service: newService
    });
}));

// Update service
router.put('/:id', auth, asyncHandler(async (req, res) => {
    const {
        name,
        description,
        category,
        department,
        base_price,
        tax_rate,
        hmo_covered,
        hmo_price,
        duration_minutes,
        is_active
    } = req.body;

    const service = await db('services').where('id', req.params.id).first();

    if (!service) {
        throw Errors.notFound('Service');
    }

    await db('services')
        .where('id', req.params.id)
        .update({
            name: name || service.name,
            description: description !== undefined ? description : service.description,
            category: category || service.category,
            department: department !== undefined ? department : service.department,
            base_price: base_price !== undefined ? parseFloat(base_price) : service.base_price,
            tax_rate: tax_rate !== undefined ? parseFloat(tax_rate) : service.tax_rate,
            hmo_covered: hmo_covered !== undefined ? (hmo_covered ? 1 : 0) : service.hmo_covered,
            hmo_price: hmo_price !== undefined ? (hmo_price ? parseFloat(hmo_price) : null) : service.hmo_price,
            duration_minutes: duration_minutes !== undefined ? (duration_minutes ? parseInt(duration_minutes) : null) : service.duration_minutes,
            is_active: is_active !== undefined ? (is_active ? 1 : 0) : service.is_active,
            updated_at: new Date().toISOString()
        });

    const updatedService = await db('services').where('id', req.params.id).first();

    log.info('Service updated', { serviceId: req.params.id });
    res.json({
        message: 'Service updated successfully',
        service: updatedService
    });
}));

// Delete service
router.delete('/:id', auth, asyncHandler(async (req, res) => {
    const service = await db('services').where('id', req.params.id).first();

    if (!service) {
        throw Errors.notFound('Service');
    }

    await db('services').where('id', req.params.id).delete();

    log.info('Service deleted', { serviceId: req.params.id });
    res.json({ message: 'Service deleted successfully' });
}));

// Get service categories
router.get('/meta/categories', auth, asyncHandler(async (req, res) => {
    const categories = await db('service_categories')
        .select('*')
        .orderBy('name', 'asc');

    res.json(categories);
}));

// Get departments (distinct from services)
router.get('/meta/departments', auth, asyncHandler(async (req, res) => {
    const departments = await db('services')
        .distinct('department')
        .whereNotNull('department')
        .orderBy('department', 'asc');

    res.json(departments.map(d => d.department));
}));

// Bulk import services (CSV)
router.post('/bulk-import', auth, asyncHandler(async (req, res) => {
    const { services } = req.body;

    if (!Array.isArray(services) || services.length === 0) {
        throw Errors.badRequest('Services array is required');
    }

    const results = {
        success: 0,
        failed: 0,
        errors: [] as any[]
    };

    for (const service of services) {
        try {
            await db('services').insert({
                name: service.name,
                description: service.description || null,
                category: service.category,
                department: service.department || null,
                base_price: parseFloat(service.base_price),
                tax_rate: service.tax_rate ? parseFloat(service.tax_rate) : 0,
                hmo_covered: service.hmo_covered ? 1 : 0,
                hmo_price: service.hmo_price ? parseFloat(service.hmo_price) : null,
                duration_minutes: service.duration_minutes ? parseInt(service.duration_minutes) : null,
                is_active: 1,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            });
            results.success++;
        } catch (error: any) {
            results.failed++;
            results.errors.push({
                service: service.name,
                error: error.message
            });
        }
    }

    log.info('Bulk import completed', { success: results.success, failed: results.failed });
    res.json({
        message: `Import completed: ${results.success} successful, ${results.failed} failed`,
        results
    });
}));

export default router;
