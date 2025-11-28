import express from 'express';
import { auth } from '../middleware/auth';
import db from '../db';

const router = express.Router();

// Get prescriptions (with filters)
router.get('/', auth, async (req, res) => {
    try {
        const { patient_id, status, date_from, date_to } = req.query;

        let query = db('prescriptions')
            .join('users', 'prescriptions.prescribed_by', 'users.id')
            .select(
                'prescriptions.*',
                'users.first_name as prescriber_first_name',
                'users.last_name as prescriber_last_name'
            );

        if (patient_id) {
            query = query.where('prescriptions.patient_id', patient_id as string);
        }

        if (status) {
            query = query.where('prescriptions.status', status as string);
        }

        if (date_from) {
            query = query.where('prescriptions.prescription_date', '>=', date_from as string);
        }

        if (date_to) {
            query = query.where('prescriptions.prescription_date', '<=', date_to as string);
        }

        const prescriptions = await query.orderBy('prescriptions.prescription_date', 'desc');
        res.json(prescriptions);
    } catch (error) {
        console.error('Error fetching prescriptions:', error);
        res.status(500).json({ error: 'Failed to fetch prescriptions' });
    }
});

// Get single prescription
router.get('/:id', auth, async (req, res) => {
    try {
        const prescription = await db('prescriptions')
            .where('id', req.params.id)
            .first();

        if (!prescription) {
            return res.status(404).json({ error: 'Prescription not found' });
        }

        res.json(prescription);
    } catch (error) {
        console.error('Error fetching prescription:', error);
        res.status(500).json({ error: 'Failed to fetch prescription' });
    }
});

// Create prescription
router.post('/', auth, async (req, res) => {
    try {
        const {
            patient_id, medications, notes, status
        } = req.body;

        const prescribed_by = req.user.id;

        const [newPrescription] = await db('prescriptions').insert({
            patient_id,
            prescribed_by,
            prescription_date: new Date(),
            medications: typeof medications === 'object' ? JSON.stringify(medications) : medications,
            notes,
            status: status || 'active'
        }).returning('*');

        // SQLite fallback
        if (!newPrescription) {
            const prescription = await db('prescriptions')
                .where({ patient_id, prescribed_by })
                .orderBy('created_at', 'desc')
                .first();
            return res.status(201).json(prescription);
        }

        res.status(201).json(newPrescription);
    } catch (error) {
        console.error('Error creating prescription:', error);
        res.status(500).json({ error: 'Failed to create prescription' });
    }
});

// Update prescription
router.put('/:id', auth, async (req, res) => {
    try {
        const updates = req.body;
        delete updates.id;
        delete updates.created_at;
        delete updates.prescribed_by;

        if (typeof updates.medications === 'object') updates.medications = JSON.stringify(updates.medications);

        await db('prescriptions').where('id', req.params.id).update({
            ...updates,
            updated_at: db.fn.now()
        });

        const updatedPrescription = await db('prescriptions').where('id', req.params.id).first();
        res.json(updatedPrescription);
    } catch (error) {
        console.error('Error updating prescription:', error);
        res.status(500).json({ error: 'Failed to update prescription' });
    }
});

// Cancel prescription (or mark as dispensed/completed)
router.delete('/:id', auth, async (req, res) => {
    try {
        await db('prescriptions').where('id', req.params.id).update({
            status: 'cancelled',
            updated_at: db.fn.now()
        });
        res.json({ message: 'Prescription cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling prescription:', error);
        res.status(500).json({ error: 'Failed to cancel prescription' });
    }
});

// Get active prescriptions for pharmacy
router.get('/active/pharmacy', auth, async (req, res) => {
    try {
        const activePrescriptions = await db('prescriptions')
            .join('patients', 'prescriptions.patient_id', 'patients.id')
            .join('users', 'prescriptions.prescribed_by', 'users.id')
            .where('prescriptions.status', 'active')
            .select(
                'prescriptions.*',
                'patients.first_name as patient_first_name',
                'patients.last_name as patient_last_name',
                'patients.mrn as patient_mrn',
                'users.first_name as prescriber_first_name',
                'users.last_name as prescriber_last_name'
            )
            .orderBy('prescriptions.prescription_date', 'asc');
        res.json(activePrescriptions);
    } catch (error) {
        console.error('Error fetching active prescriptions:', error);
        res.status(500).json({ error: 'Failed to fetch active prescriptions' });
    }
});

// Get patient prescription history
router.get('/patient/:patientId/history', auth, async (req, res) => {
    try {
        const history = await db('prescriptions')
            .where('patient_id', req.params.patientId)
            .orderBy('prescription_date', 'desc');
        res.json(history);
    } catch (error) {
        console.error('Error fetching patient prescription history:', error);
        res.status(500).json({ error: 'Failed to fetch patient prescription history' });
    }
});

// Get stats overview
router.get('/stats/overview', auth, async (req, res) => {
    try {
        const total = await db('prescriptions').count('id as count').first();
        const active = await db('prescriptions').where('status', 'active').count('id as count').first();

        res.json({
            total: total?.count || 0,
            active: active?.count || 0
        });
    } catch (error) {
        console.error('Error fetching prescription stats:', error);
        res.status(500).json({ error: 'Failed to fetch prescription stats' });
    }
});

export default router;
