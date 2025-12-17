import express from 'express';
import { auth } from '../middleware/auth';
import db from '../db';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Generate a unique barcode
const generateBarcode = async () => {
    let barcode = '';
    let isUnique = false;
    while (!isUnique) {
        // Simple alphanumeric 10-char barcode
        barcode = 'LAB-' + Math.random().toString(36).substr(2, 8).toUpperCase();
        const existing = await db('lab_samples').where('barcode', barcode).first();
        if (!existing) isUnique = true;
    }
    return barcode;
};

// Create new sample
router.post('/', auth, async (req, res) => {
    try {
        const { patient_id, test_id, sample_type, notes } = req.body;
        const collected_by = (req as any).user.id;

        const barcode = await generateBarcode();

        const [id] = await db('lab_samples').insert({
            id: uuidv4(),
            patient_id,
            test_id,
            sample_type,
            barcode,
            collection_date: new Date(),
            collected_by,
            status: 'collected',
            notes,
            created_at: new Date(),
            updated_at: new Date()
        });

        // If linked to a test, update test status ideally, but keeping decoupled for now

        const newSample = await db('lab_samples').where('barcode', barcode).first();
        res.status(201).json(newSample);
    } catch (error) {
        console.error('Error creating sample:', error);
        res.status(500).json({ error: 'Failed to create sample' });
    }
});

// Get all samples
router.get('/', auth, async (req, res) => {
    try {
        const { status, patient_id, barcode, date_from, date_to } = req.query;

        let query = db('lab_samples')
            .join('patients', 'lab_samples.patient_id', 'patients.id')
            .leftJoin('users', 'lab_samples.collected_by', 'users.id')
            .select(
                'lab_samples.*',
                'patients.first_name as patient_first_name',
                'patients.last_name as patient_last_name',
                'patients.mrn as patient_mrn',
                'users.first_name as collector_first_name',
                'users.last_name as collector_last_name'
            );

        if (status) query = query.where('lab_samples.status', status as string);
        if (patient_id) query = query.where('lab_samples.patient_id', patient_id as string);
        if (barcode) query = query.where('lab_samples.barcode', 'like', `%${barcode}%`);
        if (date_from) query = query.where('lab_samples.collection_date', '>=', date_from as string);
        if (date_to) query = query.where('lab_samples.collection_date', '<=', date_to as string);

        const samples = await query.orderBy('lab_samples.collection_date', 'desc');
        res.json(samples);
    } catch (error) {
        console.error('Error fetching samples:', error);
        res.status(500).json({ error: 'Failed to fetch samples' });
    }
});

// Get by barcode
router.get('/:barcode', auth, async (req, res) => {
    try {
        const { barcode } = req.params;
        const sample = await db('lab_samples')
            .join('patients', 'lab_samples.patient_id', 'patients.id')
            .leftJoin('users', 'lab_samples.collected_by', 'users.id')
            .leftJoin('lab_results', 'lab_samples.test_id', 'lab_results.id')
            .select(
                'lab_samples.*',
                'patients.first_name as patient_first_name',
                'patients.last_name as patient_last_name',
                'patients.mrn as patient_mrn',
                'patients.date_of_birth',
                'patients.gender',
                'users.first_name as collector_first_name',
                'users.last_name as collector_last_name',
                'lab_results.test_name as test_name'
            )
            .where('lab_samples.barcode', barcode)
            .first();

        if (!sample) return res.status(404).json({ error: 'Sample not found' });
        res.json(sample);
    } catch (error) {
        console.error('Error fetching sample by barcode:', error);
        res.status(500).json({ error: 'Failed to fetch sample' });
    }
});

// Update status
router.put('/:id/status', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        const updateData: any = {
            status,
            updated_at: new Date()
        };

        if (notes) updateData.notes = notes;

        await db('lab_samples').where('id', id).update(updateData);

        const updated = await db('lab_samples').where('id', id).first();
        res.json(updated);
    } catch (error) {
        console.error('Error updating sample status:', error);
        res.status(500).json({ error: 'Failed to update status' });
    }
});

// Reject sample
router.post('/:id/reject', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        await db('lab_samples').where('id', id).update({
            status: 'rejected',
            rejection_reason: reason,
            updated_at: new Date()
        });

        const updated = await db('lab_samples').where('id', id).first();
        res.json(updated);
    } catch (error) {
        console.error('Error rejecting sample:', error);
        res.status(500).json({ error: 'Failed to reject sample' });
    }
});

export default router;
