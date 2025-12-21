import express from 'express';
import { auth } from '../middleware/auth';
import db from '../db';

const router = express.Router();

// Helper function to calculate status
const calculateStatus = (currentStock: number, minLevel: number) => {
    let status = 'In Stock';
    let statusColor = 'bg-green-100 text-green-800';

    if (currentStock === 0) {
        status = 'Out of Stock';
        statusColor = 'bg-red-100 text-red-800';
    } else if (currentStock < minLevel) {
        status = 'Critical Low';
        statusColor = 'bg-red-100 text-red-800';
    } else if (currentStock <= minLevel * 1.2) {
        status = 'Low Stock';
        statusColor = 'bg-yellow-100 text-yellow-800';
    }

    return { status, statusColor };
};

// Get all inventory items
router.get('/', auth, async (req, res) => {
    try {
        const { category, status, search } = req.query;

        let query = db('lab_inventory').select('*');

        if (category && category !== 'all') {
            query = query.where('category', category as string);
        }

        if (status && status !== 'all') {
            query = query.where('status', status as string);
        }

        if (search) {
            query = query.where((qb) => {
                qb.where('name', 'like', `%${search}%`)
                    .orWhere('id', 'like', `%${search}%`)
                    .orWhere('location', 'like', `%${search}%`);
            });
        }

        const items = await query.orderBy('created_at', 'desc');
        return res.json(items);
    } catch (error) {
        console.error('Error fetching lab inventory:', error);
        res.status(500).json({ error: 'Failed to fetch lab inventory' });
    }
});

// Get single inventory item
router.get('/:id', auth, async (req, res) => {
    try {
        const item = await db('lab_inventory')
            .where('id', req.params.id)
            .first();

        if (!item) {
            return res.status(404).json({ error: 'Inventory item not found' });
        }

        return res.json(item);
    } catch (error) {
        console.error('Error fetching inventory item:', error);
        res.status(500).json({ error: 'Failed to fetch inventory item' });
    }
});

// Create new inventory item
router.post('/', auth, async (req, res) => {
    try {
        const {
            name,
            category,
            currentStock,
            minLevel,
            maxLevel,
            location,
            expiryDate,
            unitCost,
            supplier
        } = req.body;

        // Validate required fields
        if (!name || !category || currentStock === undefined || !minLevel || !maxLevel || !location) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Calculate status
        const { status, statusColor } = calculateStatus(currentStock, minLevel);

        // Generate ID
        const id = `INV-${Date.now()}`;

        const newItem = {
            id,
            name,
            category,
            current_stock: currentStock,
            min_level: minLevel,
            max_level: maxLevel,
            location,
            expiry_date: expiryDate || null,
            status,
            status_color: statusColor,
            last_restock: new Date().toISOString(),
            unit_cost: unitCost || 0,
            supplier: supplier || null,
            created_by: req.user.id,
            updated_by: req.user.id
        };

        await db('lab_inventory').insert(newItem);

        // Log history
        await db('lab_inventory_history').insert({
            inventory_id: id,
            action: 'created',
            new_stock: currentStock,
            changed_by: req.user.id,
            change_reason: 'Initial creation'
        });

        const createdItem = await db('lab_inventory').where('id', id).first();

        // Convert snake_case to camelCase for frontend
        const formattedItem = {
            id: createdItem.id,
            name: createdItem.name,
            category: createdItem.category,
            currentStock: createdItem.current_stock,
            minLevel: createdItem.min_level,
            maxLevel: createdItem.max_level,
            location: createdItem.location,
            expiryDate: createdItem.expiry_date,
            status: createdItem.status,
            statusColor: createdItem.status_color,
            lastRestock: createdItem.last_restock,
            unitCost: createdItem.unit_cost,
            supplier: createdItem.supplier
        };

        return res.status(201).json(formattedItem);
    } catch (error) {
        console.error('Error creating inventory item:', error);
        res.status(500).json({ error: 'Failed to create inventory item' });
    }
});

// Update inventory item
router.put('/:id', auth, async (req, res) => {
    try {
        const {
            name,
            category,
            currentStock,
            minLevel,
            maxLevel,
            location,
            expiryDate,
            unitCost,
            supplier
        } = req.body;

        // Check if item exists
        const existingItem = await db('lab_inventory').where('id', req.params.id).first();

        if (!existingItem) {
            return res.status(404).json({ error: 'Inventory item not found' });
        }

        // Calculate new status
        const { status, statusColor } = calculateStatus(currentStock, minLevel);

        const updates = {
            name,
            category,
            current_stock: currentStock,
            min_level: minLevel,
            max_level: maxLevel,
            location,
            expiry_date: expiryDate || null,
            status,
            status_color: statusColor,
            unit_cost: unitCost || 0,
            supplier: supplier || null,
            updated_by: req.user.id,
            updated_at: db.fn.now()
        };

        await db('lab_inventory').where('id', req.params.id).update(updates);

        // Log history if stock changed
        if (existingItem.current_stock !== currentStock) {
            await db('lab_inventory_history').insert({
                inventory_id: req.params.id,
                action: 'updated',
                previous_stock: existingItem.current_stock,
                new_stock: currentStock,
                changed_by: req.user.id,
                change_reason: 'Manual update'
            });
        }

        const updatedItem = await db('lab_inventory').where('id', req.params.id).first();

        // Convert snake_case to camelCase
        const formattedItem = {
            id: updatedItem.id,
            name: updatedItem.name,
            category: updatedItem.category,
            currentStock: updatedItem.current_stock,
            minLevel: updatedItem.min_level,
            maxLevel: updatedItem.max_level,
            location: updatedItem.location,
            expiryDate: updatedItem.expiry_date,
            status: updatedItem.status,
            statusColor: updatedItem.status_color,
            lastRestock: updatedItem.last_restock,
            unitCost: updatedItem.unit_cost,
            supplier: updatedItem.supplier
        };

        return res.json(formattedItem);
    } catch (error) {
        console.error('Error updating inventory item:', error);
        res.status(500).json({ error: 'Failed to update inventory item' });
    }
});

// Delete inventory item
router.delete('/:id', auth, async (req, res) => {
    try {
        const item = await db('lab_inventory').where('id', req.params.id).first();

        if (!item) {
            return res.status(404).json({ error: 'Inventory item not found' });
        }

        // Log deletion in history
        await db('lab_inventory_history').insert({
            inventory_id: req.params.id,
            action: 'deleted',
            previous_stock: item.current_stock,
            changed_by: req.user.id,
            change_reason: 'Item deleted'
        });

        await db('lab_inventory').where('id', req.params.id).delete();

        return res.json({ message: 'Inventory item deleted successfully' });
    } catch (error) {
        console.error('Error deleting inventory item:', error);
        res.status(500).json({ error: 'Failed to delete inventory item' });
    }
});

// Get inventory statistics
router.get('/stats/overview', auth, async (req, res) => {
    try {
        const [
            totalItems,
            inStock,
            lowStock,
            criticalLow,
            outOfStock
        ] = await Promise.all([
            db('lab_inventory').count('* as count').first(),
            db('lab_inventory').where('status', 'In Stock').count('* as count').first(),
            db('lab_inventory').where('status', 'Low Stock').count('* as count').first(),
            db('lab_inventory').where('status', 'Critical Low').count('* as count').first(),
            db('lab_inventory').where('status', 'Out of Stock').count('* as count').first()
        ]);

        res.json({
            totalItems: totalItems?.count || 0,
            inStock: inStock?.count || 0,
            lowStock: lowStock?.count || 0,
            criticalLow: criticalLow?.count || 0,
            outOfStock: outOfStock?.count || 0
        });
    } catch (error) {
        console.error('Error fetching inventory statistics:', error);
        res.status(500).json({ error: 'Failed to fetch inventory statistics' });
    }
});

// Get inventory history for an item
router.get('/:id/history', auth, async (req, res) => {
    try {
        const history = await db('lab_inventory_history')
            .join('users', 'lab_inventory_history.changed_by', 'users.id')
            .where('inventory_id', req.params.id)
            .select(
                'lab_inventory_history.*',
                'users.first_name',
                'users.last_name'
            )
            .orderBy('lab_inventory_history.created_at', 'desc');

        res.json(history);
    } catch (error) {
        console.error('Error fetching inventory history:', error);
        res.status(500).json({ error: 'Failed to fetch inventory history' });
    }
});

// Restock item
router.post('/:id/restock', auth, async (req, res) => {
    try {
        const { quantity, reason } = req.body;

        if (!quantity || quantity <= 0) {
            return res.status(400).json({ error: 'Invalid quantity' });
        }

        const item = await db('lab_inventory').where('id', req.params.id).first();

        if (!item) {
            return res.status(404).json({ error: 'Inventory item not found' });
        }

        const newStock = item.current_stock + quantity;
        const { status, statusColor } = calculateStatus(newStock, item.min_level);

        await db('lab_inventory').where('id', req.params.id).update({
            current_stock: newStock,
            status,
            status_color: statusColor,
            last_restock: new Date().toISOString(),
            updated_at: db.fn.now()
        });

        // Log history
        await db('lab_inventory_history').insert({
            inventory_id: req.params.id,
            action: 'restocked',
            previous_stock: item.current_stock,
            new_stock: newStock,
            changed_by: req.user.id,
            change_reason: reason || `Restocked +${quantity} units`
        });

        const updatedItem = await db('lab_inventory').where('id', req.params.id).first();

        return res.json({
            id: updatedItem.id,
            name: updatedItem.name,
            currentStock: updatedItem.current_stock,
            status: updatedItem.status,
            statusColor: updatedItem.status_color
        });
    } catch (error) {
        console.error('Error restocking item:', error);
        res.status(500).json({ error: 'Failed to restock item' });
    }
});

export default router;
