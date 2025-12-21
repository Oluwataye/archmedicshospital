import express from 'express';
import { auth, authorize } from '../middleware/auth';
import db from '../db';
import { asyncHandler, Errors } from '../middleware/errorHandler';
import { log } from '../utils/logger';

const router = express.Router();

// --- Inventory Items ---

// Get all inventory items with filters
router.get('/items', auth, asyncHandler(async (req, res) => {
    const { search, category, low_stock, active } = req.query;

    let query = db('inventory_items')
        .select('inventory_items.*', 'suppliers.name as supplier_name')
        .leftJoin('suppliers', 'inventory_items.preferred_supplier_id', 'suppliers.id');

    if (search) {
        query = query.where((qb) => {
            qb.where('inventory_items.name', 'like', `%${search}%`)
                .orWhere('inventory_items.generic_name', 'like', `%${search}%`)
                .orWhere('inventory_items.sku', 'like', `%${search}%`);
        });
    }

    if (category) {
        query = query.where('inventory_items.category', category);
    }

    if (low_stock === 'true') {
        query = query.whereRaw('inventory_items.current_stock <= inventory_items.reorder_level');
    }

    if (active) {
        query = query.where('inventory_items.is_active', active === 'true');
    }

    const items = await query.orderBy('inventory_items.name');
    res.json(items);
}));

// Get single item details
router.get('/items/:id', auth, asyncHandler(async (req, res) => {
    const { id } = req.params;
    const item = await db('inventory_items')
        .select('inventory_items.*', 'suppliers.name as supplier_name')
        .leftJoin('suppliers', 'inventory_items.preferred_supplier_id', 'suppliers.id')
        .where('inventory_items.id', id)
        .first();

    if (!item) {
        throw Errors.notFound('Item');
    }

    // Get batches
    const batches = await db('inventory_batches')
        .where('item_id', id)
        .where('remaining_quantity', '>', 0)
        .orderBy('expiry_date', 'asc');

    // Get recent movements
    const movements = await db('stock_movements')
        .select('stock_movements.*', 'users.first_name', 'users.last_name')
        .leftJoin('users', 'stock_movements.performed_by', 'users.id')
        .where('item_id', id)
        .orderBy('created_at', 'desc')
        .limit(10);

    res.json({ ...item, batches, movements });
}));

// Create new item
router.post('/items', auth, authorize(['admin', 'pharmacist']), asyncHandler(async (req, res) => {
    const itemData = req.body;
    const [id] = await db('inventory_items').insert(itemData);
    const newItem = await db('inventory_items').where({ id }).first();

    log.info('Inventory item created', { itemId: id, name: itemData.name });
    res.status(201).json(newItem);
}));

// Update item
router.put('/items/:id', auth, authorize(['admin', 'pharmacist']), asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    await db('inventory_items').where({ id }).update({
        ...updateData,
        updated_at: db.fn.now()
    });
    const updated = await db('inventory_items').where({ id }).first();

    log.info('Inventory item updated', { itemId: id });
    res.json(updated);
}));

// --- Stock Movements ---

// Get stock movements
router.get('/movements', auth, asyncHandler(async (req, res) => {
    const { item_id, limit } = req.query;

    let query = db('stock_movements')
        .select(
            'stock_movements.*',
            'inventory_items.name as item_name',
            'users.first_name as performed_by_first_name',
            'users.last_name as performed_by_last_name'
        )
        .leftJoin('inventory_items', 'stock_movements.item_id', 'inventory_items.id')
        .leftJoin('users', 'stock_movements.performed_by', 'users.id')
        .orderBy('stock_movements.created_at', 'desc');

    if (item_id) {
        query = query.where('stock_movements.item_id', item_id as string);
    }

    if (limit) {
        query = query.limit(parseInt(limit as string));
    } else {
        query = query.limit(100);
    }

    const movements = await query;

    const formattedMovements = movements.map(m => ({
        ...m,
        performed_by_name: m.performed_by_first_name && m.performed_by_last_name
            ? `${m.performed_by_first_name} ${m.performed_by_last_name}`
            : 'System'
    }));

    res.json(formattedMovements);
}));

// Record stock movement (IN, OUT, ADJUSTMENT)
router.post('/movements', auth, authorize(['admin', 'pharmacist']), asyncHandler(async (req, res) => {
    const { item_id, type, quantity, notes, batch_id, reference_type, reference_id } = req.body;
    const performed_by = (req as any).user.id;

    await db.transaction(async (trx) => {
        const item = await trx('inventory_items').where('id', item_id).first();
        if (!item) throw Errors.notFound('Item');

        let newStock = item.current_stock;
        if (type === 'IN') {
            newStock += quantity;
        } else if (type === 'OUT' || type === 'EXPIRED' || type === 'DAMAGED') {
            if (item.current_stock < quantity) throw Errors.badRequest('Insufficient stock');
            newStock -= quantity;
        } else if (type === 'ADJUSTMENT') {
            newStock += quantity;
        }

        // Update item stock
        await trx('inventory_items').where('id', item_id).update({
            current_stock: newStock,
            updated_at: trx.fn.now()
        });

        // Update batch if provided
        if (batch_id) {
            const batch = await trx('inventory_batches').where('id', batch_id).first();
            if (batch) {
                let newBatchQty = batch.remaining_quantity;
                if (type === 'IN') newBatchQty += quantity;
                else if (type === 'OUT' || type === 'EXPIRED' || type === 'DAMAGED') newBatchQty -= quantity;
                else if (type === 'ADJUSTMENT') newBatchQty += quantity;

                await trx('inventory_batches').where('id', batch_id).update({
                    remaining_quantity: newBatchQty,
                    updated_at: trx.fn.now()
                });
            }
        }

        // Record movement
        await trx('stock_movements').insert({
            item_id,
            batch_id,
            type,
            quantity: Math.abs(quantity),
            previous_stock: item.current_stock,
            new_stock: newStock,
            reference_type,
            reference_id,
            performed_by,
            notes
        });
    });

    log.info('Stock movement recorded', { itemId: item_id, type, quantity });
    res.json({ message: 'Stock movement recorded successfully' });
}));

// --- Suppliers ---

router.get('/suppliers', auth, asyncHandler(async (req, res) => {
    const suppliers = await db('suppliers').where('is_active', true).orderBy('name');
    res.json(suppliers);
}));

router.post('/suppliers', auth, authorize(['admin', 'pharmacist']), asyncHandler(async (req, res) => {
    const supplierData = req.body;
    const [id] = await db('suppliers').insert(supplierData);
    const newSupplier = await db('suppliers').where({ id }).first();

    log.info('Supplier created', { supplierId: id, name: supplierData.name });
    res.status(201).json(newSupplier);
}));

// --- Alerts ---

router.get('/alerts', auth, asyncHandler(async (req, res) => {
    // Low Stock Alerts
    const lowStock = await db('inventory_items')
        .whereRaw('current_stock <= reorder_level')
        .where('is_active', true)
        .select('id', 'name', 'current_stock', 'reorder_level', 'unit_measure');

    // Expiring Soon Alerts (next 90 days)
    const ninetyDaysFromNow = new Date();
    ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);

    const expiringBatches = await db('inventory_batches')
        .join('inventory_items', 'inventory_batches.item_id', 'inventory_items.id')
        .where('inventory_batches.remaining_quantity', '>', 0)
        .where('inventory_batches.expiry_date', '<=', ninetyDaysFromNow)
        .select(
            'inventory_batches.id',
            'inventory_batches.batch_number',
            'inventory_batches.expiry_date',
            'inventory_batches.remaining_quantity',
            'inventory_items.name as item_name',
            'inventory_items.id as item_id'
        )
        .orderBy('inventory_batches.expiry_date', 'asc');

    res.json({
        lowStock,
        expiringBatches
    });
}));

export default router;
