import express from 'express';
import db from '../db';
import { auth } from '../middleware/auth';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get QC records with filters
router.get('/', auth, async (req, res) => {
    try {
        const { equipment_id, status, search, start_date, end_date } = req.query;

        let query = db('lab_quality_control')
            .join('lab_equipment', 'lab_quality_control.equipment_id', 'lab_equipment.id')
            .select(
                'lab_quality_control.*',
                'lab_equipment.name as equipment_name',
                'lab_equipment.model as equipment_model'
            );

        if (equipment_id && equipment_id !== 'all') {
            query = query.where('lab_quality_control.equipment_id', equipment_id as string);
        }

        if (status && status !== 'all') {
            query = query.where('lab_quality_control.status', status as string);
        }

        if (start_date) {
            query = query.where('lab_quality_control.test_date', '>=', start_date as string);
        }

        if (end_date) {
            query = query.where('lab_quality_control.test_date', '<=', end_date as string);
        }

        if (search) {
            query = query.where(builder => {
                builder.where('lab_equipment.name', 'like', `%${search}%`)
                    .orWhere('lab_quality_control.control_material', 'like', `%${search}%`)
                    .orWhere('lab_quality_control.performed_by', 'like', `%${search}%`);
            });
        }

        const records = await query.orderBy('lab_quality_control.test_date', 'desc');
        res.json(records);
    } catch (error) {
        console.error('Error fetching QC records:', error);
        res.status(500).json({ error: 'Failed to fetch QC records' });
    }
});

// Create new QC record
router.post('/', auth, async (req, res) => {
    try {
        const {
            equipment_id, test_date, control_material, result_value,
            status, notes, performed_by
        } = req.body;

        const newRecord = {
            id: uuidv4(),
            equipment_id,
            test_date,
            control_material,
            performed_by: performed_by || req.user?.username || 'Unknown', // Fallback to current user if not provided
            result_value,
            status: status || 'Pass',
            notes,
            verified: false
        };

        await db('lab_quality_control').insert(newRecord);
        res.status(201).json(newRecord);
    } catch (error) {
        console.error('Error creating QC record:', error);
        res.status(500).json({ error: 'Failed to create QC record' });
    }
});

// Verify QC record
router.put('/:id/verify', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { verified_by } = req.body;

        const updates = {
            verified: true,
            verified_by: verified_by || req.user?.username || 'Admin',
            verified_at: db.fn.now(),
            updated_at: db.fn.now()
        };

        const updated = await db('lab_quality_control')
            .where('id', id)
            .update(updates);

        if (!updated) {
            return res.status(404).json({ error: 'QC record not found' });
        }

        const record = await db('lab_quality_control').where('id', id).first();
        res.json(record);
    } catch (error) {
        console.error('Error verifying QC record:', error);
        res.status(500).json({ error: 'Failed to verify QC record' });
    }
});

export default router;
