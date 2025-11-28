import express from 'express';
import { auth } from '../middleware/auth.ts';
import db from '../db.ts';

const router = express.Router();

// Get vital signs (with filters)
router.get('/', auth, async (req, res) => {
    try {
        const { patient_id, date_from, date_to } = req.query;

        let query = db('vital_signs')
            .join('users', 'vital_signs.recorded_by', 'users.id')
            .select(
                'vital_signs.*',
                'users.first_name as recorder_first_name',
                'users.last_name as recorder_last_name'
            );

        if (patient_id) {
            query = query.where('vital_signs.patient_id', patient_id as string);
        }

        if (date_from) {
            query = query.where('vital_signs.recorded_at', '>=', date_from as string);
        }

        if (date_to) {
            query = query.where('vital_signs.recorded_at', '<=', date_to as string);
        }

        const vitals = await query.orderBy('vital_signs.recorded_at', 'desc');
        res.json(vitals);
    } catch (error) {
        console.error('Error fetching vital signs:', error);
        res.status(500).json({ error: 'Failed to fetch vital signs' });
    }
});

// Create vital signs
router.post('/', auth, async (req, res) => {
    try {
        const {
            patient_id, systolic_bp, diastolic_bp, heart_rate,
            temperature, respiratory_rate, oxygen_saturation,
            weight, height, bmi, notes
        } = req.body;

        const recorded_by = req.user.id;

        const [newVitals] = await db('vital_signs').insert({
            patient_id,
            recorded_by,
            recorded_at: db.fn.now(),
            systolic_bp,
            diastolic_bp,
            heart_rate,
            temperature,
            respiratory_rate,
            oxygen_saturation,
            weight,
            height,
            bmi,
            notes
        }).returning('*');

        // SQLite fallback
        if (!newVitals) {
            const vitals = await db('vital_signs')
                .where({ patient_id, recorded_by })
                .orderBy('created_at', 'desc')
                .first();
            return res.status(201).json(vitals);
        }

        res.status(201).json(newVitals);
    } catch (error) {
        console.error('Error creating vital signs:', error);
        res.status(500).json({ error: 'Failed to create vital signs' });
    }
});

// Update vital signs
router.put('/:id', auth, async (req, res) => {
    try {
        const updates = req.body;
        delete updates.id;
        delete updates.created_at;
        delete updates.recorded_at;
        delete updates.recorded_by;

        await db('vital_signs').where('id', req.params.id).update(updates);

        const updatedVitals = await db('vital_signs').where('id', req.params.id).first();
        res.json(updatedVitals);
    } catch (error) {
        console.error('Error updating vital signs:', error);
        res.status(500).json({ error: 'Failed to update vital signs' });
    }
});

// Delete vital signs
router.delete('/:id', auth, async (req, res) => {
    try {
        await db('vital_signs').where('id', req.params.id).delete();
        res.json({ message: 'Vital signs deleted successfully' });
    } catch (error) {
        console.error('Error deleting vital signs:', error);
        res.status(500).json({ error: 'Failed to delete vital signs' });
    }
});

// Get patient vital history
router.get('/patient/:patientId/history', auth, async (req, res) => {
    try {
        const vitals = await db('vital_signs')
            .where('patient_id', req.params.patientId)
            .orderBy('recorded_at', 'desc');
        res.json(vitals);
    } catch (error) {
        console.error('Error fetching patient vital history:', error);
        res.status(500).json({ error: 'Failed to fetch patient vital history' });
    }
});

// Get patient vital trends (simplified)
router.get('/patient/:patientId/trends', auth, async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        const vitals = await db('vital_signs')
            .where('patient_id', req.params.patientId)
            .orderBy('recorded_at', 'asc') // Ascending for charts
            .limit(Number(limit));
        res.json(vitals);
    } catch (error) {
        console.error('Error fetching patient vital trends:', error);
        res.status(500).json({ error: 'Failed to fetch patient vital trends' });
    }
});

export default router;
