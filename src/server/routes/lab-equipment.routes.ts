import express from 'express';
import db from '../db';
import { auth } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get all equipment with filters
router.get('/', auth, async (req, res) => {
    try {
        const { status, type, search } = req.query;

        let query = db('lab_equipment').select('*');

        if (status && status !== 'all') {
            query = query.where('status', status as string);
        }

        if (type && type !== 'all') {
            query = query.where('equipment_type', type as string);
        }

        if (search) {
            query = query.where(builder => {
                builder.where('name', 'like', `%${search}%`)
                    .orWhere('model', 'like', `%${search}%`)
                    .orWhere('serial_number', 'like', `%${search}%`)
                    .orWhere('manufacturer', 'like', `%${search}%`);
            });
        }

        const equipment = await query.orderBy('name');
        res.json(equipment);
    } catch (error) {
        console.error('Error fetching equipment:', error);
        res.status(500).json({ error: 'Failed to fetch equipment' });
    }
});

// Get single equipment details
router.get('/:id', auth, async (req, res) => {
    try {
        const equipment = await db('lab_equipment').where('id', req.params.id).first();
        if (!equipment) {
            return res.status(404).json({ error: 'Equipment not found' });
        }
        res.json(equipment);
    } catch (error) {
        console.error('Error fetching equipment details:', error);
        res.status(500).json({ error: 'Failed to fetch equipment details' });
    }
});

// Create new equipment
router.post('/', auth, async (req, res) => {
    try {
        const {
            name, model, manufacturer, serial_number, location,
            equipment_type, purchase_date, next_maintenance, next_calibration
        } = req.body;

        // Check if serial number exists
        const existing = await db('lab_equipment').where('serial_number', serial_number).first();
        if (existing) {
            return res.status(400).json({ error: 'Serial number already exists' });
        }

        const newEquipment = {
            id: uuidv4(),
            name,
            model,
            manufacturer,
            serial_number,
            location,
            equipment_type,
            purchase_date,
            next_maintenance,
            next_calibration, // Ensure this is saved
            status: 'Operational'
        };

        await db('lab_equipment').insert(newEquipment);
        res.status(201).json(newEquipment);
    } catch (error) {
        console.error('Error creating equipment:', error);
        res.status(500).json({ error: 'Failed to create equipment' });
    }
});

// Update equipment
router.put('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Prevent updating ID
        delete updates.id;
        updates.updated_at = db.fn.now();

        const updated = await db('lab_equipment')
            .where('id', id)
            .update(updates);

        if (!updated) {
            return res.status(404).json({ error: 'Equipment not found' });
        }

        const equipment = await db('lab_equipment').where('id', id).first();
        res.json(equipment);
    } catch (error) {
        console.error('Error updating equipment:', error);
        res.status(500).json({ error: 'Failed to update equipment' });
    }
});

// Get maintenance logs for equipment
router.get('/:id/maintenance', auth, async (req, res) => {
    try {
        const logs = await db('lab_maintenance_logs')
            .where('equipment_id', req.params.id)
            .orderBy('scheduled_date', 'desc');
        res.json(logs);
    } catch (error) {
        console.error('Error fetching maintenance logs:', error);
        res.status(500).json({ error: 'Failed to fetch maintenance logs' });
    }
});

// Schedule/Log maintenance
router.post('/:id/maintenance', auth, async (req, res) => {
    try {
        const { equipment_id } = req.params; // use ID from param if not in body
        const {
            scheduled_date, type, technician, description, status
        } = req.body;

        const newLog = {
            id: uuidv4(),
            equipment_id: req.params.id,
            scheduled_date,
            type,
            technician,
            description,
            status: status || 'Scheduled'
        };

        await db('lab_maintenance_logs').insert(newLog);
        res.status(201).json(newLog);
    } catch (error) {
        console.error('Error creating maintenance log:', error);
        res.status(500).json({ error: 'Failed to create maintenance log' });
    }
});

export default router;
