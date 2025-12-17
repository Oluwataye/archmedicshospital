import express from 'express';
import { auth } from '../middleware/auth';
import db from '../db';
import { asyncHandler, Errors } from '../middleware/errorHandler';
import { log } from '../utils/logger';

const router = express.Router();

// Get vital signs (with filters)
router.get('/', auth, asyncHandler(async (req, res) => {
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
}));

// Create vital signs
router.post('/', auth, asyncHandler(async (req, res) => {
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
        log.info('Vital signs recorded', { vitalId: vitals.id, patientId: patient_id });
        return res.status(201).json(vitals);
    }

    log.info('Vital signs recorded', { vitalId: newVitals.id, patientId: patient_id });
    res.status(201).json(newVitals);
}));

// Update vital signs
router.put('/:id', auth, asyncHandler(async (req, res) => {
    const updates = req.body;
    delete updates.id;
    delete updates.created_at;
    delete updates.recorded_at;
    delete updates.recorded_by;

    await db('vital_signs').where('id', req.params.id).update(updates);

    const updatedVitals = await db('vital_signs').where('id', req.params.id).first();
    log.info('Vital signs updated', { vitalId: req.params.id });
    res.json(updatedVitals);
}));

// Delete vital signs
router.delete('/:id', auth, asyncHandler(async (req, res) => {
    await db('vital_signs').where('id', req.params.id).delete();
    log.info('Vital signs deleted', { vitalId: req.params.id });
    res.json({ message: 'Vital signs deleted successfully' });
}));

// Get patient vital history
router.get('/patient/:patientId/history', auth, asyncHandler(async (req, res) => {
    const vitals = await db('vital_signs')
        .where('patient_id', req.params.patientId)
        .orderBy('recorded_at', 'desc');
    res.json(vitals);
}));

// Get patient vital trends (simplified)
router.get('/patient/:patientId/trends', auth, asyncHandler(async (req, res) => {
    const { limit = 10 } = req.query;
    const vitals = await db('vital_signs')
        .where('patient_id', req.params.patientId)
        .orderBy('recorded_at', 'asc')
        .limit(Number(limit));
    res.json(vitals);
}));

export default router;
