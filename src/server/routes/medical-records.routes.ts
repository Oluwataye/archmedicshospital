import express from 'express';
import { auth } from '../middleware/auth';
import db from '../db';

const router = express.Router();

// Get medical records (with filters)
router.get('/', auth, async (req, res) => {
    try {
        const { patient_id, record_type, date_from, date_to } = req.query;

        let query = db('medical_records')
            .join('users', 'medical_records.provider_id', 'users.id')
            .select(
                'medical_records.*',
                'users.first_name as provider_first_name',
                'users.last_name as provider_last_name',
                'users.role as provider_role'
            );

        if (patient_id) {
            query = query.where('medical_records.patient_id', patient_id as string);
        }

        if (record_type) {
            query = query.where('medical_records.record_type', record_type as string);
        }

        if (date_from) {
            query = query.where('medical_records.record_date', '>=', date_from as string);
        }

        if (date_to) {
            query = query.where('medical_records.record_date', '<=', date_to as string);
        }

        const records = await query.orderBy('medical_records.record_date', 'desc');
        return res.json(records);
    } catch (error) {
        console.error('Error fetching medical records:', error);
        res.status(500).json({ error: 'Failed to fetch medical records' });
    }
});

// Get single record
router.get('/:id', auth, async (req, res) => {
    try {
        const record = await db('medical_records')
            .join('users', 'medical_records.provider_id', 'users.id')
            .where('medical_records.id', req.params.id)
            .select(
                'medical_records.*',
                'users.first_name as provider_first_name',
                'users.last_name as provider_last_name'
            )
            .first();

        if (!record) {
            return res.status(404).json({ error: 'Medical record not found' });
        }

        return res.json(record);
    } catch (error) {
        console.error('Error fetching medical record:', error);
        res.status(500).json({ error: 'Failed to fetch medical record' });
    }
});

// Create medical record
router.post('/', auth, async (req, res) => {
    try {
        const {
            patient_id, record_type, record_date, title,
            content, attachments, status
        } = req.body;

        const provider_id = req.user.id; // From auth middleware

        const [newRecord] = await db('medical_records').insert({
            patient_id,
            provider_id,
            record_type,
            record_date: record_date || new Date(),
            title,
            content,
            attachments: attachments ? JSON.stringify(attachments) : null,
            status: status || 'final'
        }).returning('*');

        // SQLite fallback
        if (!newRecord) {
            // This fallback is imperfect for concurrent inserts but okay for low volume
            const record = await db('medical_records')
                .where({ patient_id, provider_id, title })
                .orderBy('created_at', 'desc')
                .first();
            return res.status(201).json(record);
        }

        return res.status(201).json(newRecord);
    } catch (error) {
        console.error('Error creating medical record:', error);
        res.status(500).json({ error: 'Failed to create medical record' });
    }
});

// Update medical record
router.put('/:id', auth, async (req, res) => {
    try {
        const updates = req.body;
        delete updates.id;
        delete updates.created_at;
        delete updates.provider_id; // Prevent changing provider

        if (typeof updates.attachments === 'object') updates.attachments = JSON.stringify(updates.attachments);

        await db('medical_records').where('id', req.params.id).update({
            ...updates,
            updated_at: db.fn.now()
        });

        const updatedRecord = await db('medical_records').where('id', req.params.id).first();
        return res.json(updatedRecord);
    } catch (error) {
        console.error('Error updating medical record:', error);
        res.status(500).json({ error: 'Failed to update medical record' });
    }
});

// Delete medical record
router.delete('/:id', auth, async (req, res) => {
    try {
        await db('medical_records').where('id', req.params.id).delete();
        return res.json({ message: 'Medical record deleted successfully' });
    } catch (error) {
        console.error('Error deleting medical record:', error);
        res.status(500).json({ error: 'Failed to delete medical record' });
    }
});

// Get patient history
router.get('/patient/:patientId/history', auth, async (req, res) => {
    try {
        const records = await db('medical_records')
            .join('users', 'medical_records.provider_id', 'users.id')
            .where('medical_records.patient_id', req.params.patientId)
            .select(
                'medical_records.*',
                'users.first_name as provider_first_name',
                'users.last_name as provider_last_name'
            )
            .orderBy('medical_records.record_date', 'desc');

        return res.json(records);
    } catch (error) {
        console.error('Error fetching patient history:', error);
        res.status(500).json({ error: 'Failed to fetch patient history' });
    }
});

// Get stats overview
router.get('/stats/overview', auth, async (req, res) => {
    try {
        const totalRecords = await db('medical_records').count('id as count').first();

        const byType = await db('medical_records')
            .select('record_type')
            .count('id as count')
            .groupBy('record_type');

        return res.json({
            total: totalRecords?.count || 0,
            byType
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

export default router;
