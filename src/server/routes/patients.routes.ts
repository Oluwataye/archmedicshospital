import express from 'express';
import { auth } from '../middleware/auth.ts';
import db from '../db.ts';

const router = express.Router();

// Get all patients (with search and filters)
router.get('/', auth, async (req, res) => {
    try {
        const { search, status, gender, limit = 50, offset = 0 } = req.query;

        let query = db('patients').select('*');

        if (search) {
            query = query.where(builder => {
                builder.where('first_name', 'like', `%${search}%`)
                    .orWhere('last_name', 'like', `%${search}%`)
                    .orWhere('mrn', 'like', `%${search}%`)
                    .orWhere('phone', 'like', `%${search}%`)
                    .orWhere('email', 'like', `%${search}%`);
            });
        }

        if (status && status !== 'all') {
            query = query.where('status', status as string);
        }

        if (gender && gender !== 'all') {
            query = query.where('gender', gender as string);
        }

        // Get total count for pagination
        const countQuery = query.clone().clearSelect().count('id as total').first();
        const totalResult = await countQuery;
        const total = totalResult?.total || 0;

        // Apply pagination
        const patients = await query
            .orderBy('created_at', 'desc')
            .limit(Number(limit))
            .offset(Number(offset));

        res.json({
            data: patients,
            total,
            page: Math.floor(Number(offset) / Number(limit)) + 1,
            limit: Number(limit)
        });
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ error: 'Failed to fetch patients' });
    }
});

// Get single patient
router.get('/:id', auth, async (req, res) => {
    try {
        const patient = await db('patients').where('id', req.params.id).first();

        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        // Get recent appointments
        const appointments = await db('appointments')
            .where('patient_id', req.params.id)
            .orderBy('appointment_date', 'desc')
            .limit(5);

        // Get recent medical records
        const medicalRecords = await db('medical_records')
            .where('patient_id', req.params.id)
            .orderBy('record_date', 'desc')
            .limit(5);

        res.json({
            ...patient,
            recentAppointments: appointments,
            recentMedicalRecords: medicalRecords
        });
    } catch (error) {
        console.error('Error fetching patient:', error);
        res.status(500).json({ error: 'Failed to fetch patient' });
    }
});

// Create patient
router.post('/', auth, async (req, res) => {
    try {
        const {
            first_name, last_name, date_of_birth, gender, phone, email,
            address, city, state, zip_code, emergency_contact,
            insurance, medical_history, allergies, current_medications,
            assigned_doctor
        } = req.body;

        // Generate MRN (Medical Record Number)
        // Format: PAT-YYYYMMDD-XXXX
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        const mrn = `PAT-${dateStr}-${randomSuffix}`;

        const [newPatient] = await db('patients').insert({
            mrn,
            first_name,
            last_name,
            date_of_birth,
            gender,
            phone,
            email,
            address,
            city,
            state,
            zip_code,
            emergency_contact: JSON.stringify(emergency_contact),
            insurance: JSON.stringify(insurance),
            medical_history: JSON.stringify(medical_history),
            allergies: JSON.stringify(allergies),
            current_medications: JSON.stringify(current_medications),
            assigned_doctor,
            status: 'active'
        }).returning('*');

        // For SQLite which might not support returning('*') in older versions/knex config
        if (!newPatient) {
            const patient = await db('patients').where('mrn', mrn).first();
            return res.status(201).json(patient);
        }

        res.status(201).json(newPatient);
    } catch (error) {
        console.error('Error creating patient:', error);
        res.status(500).json({ error: 'Failed to create patient' });
    }
});

// Update patient
router.put('/:id', auth, async (req, res) => {
    try {
        const updates = req.body;
        delete updates.id; // Prevent updating ID
        delete updates.mrn; // Prevent updating MRN
        delete updates.created_at;

        // Handle JSON fields if they are objects
        if (typeof updates.emergency_contact === 'object') updates.emergency_contact = JSON.stringify(updates.emergency_contact);
        if (typeof updates.insurance === 'object') updates.insurance = JSON.stringify(updates.insurance);
        if (typeof updates.medical_history === 'object') updates.medical_history = JSON.stringify(updates.medical_history);
        if (typeof updates.allergies === 'object') updates.allergies = JSON.stringify(updates.allergies);
        if (typeof updates.current_medications === 'object') updates.current_medications = JSON.stringify(updates.current_medications);

        await db('patients').where('id', req.params.id).update({
            ...updates,
            updated_at: db.fn.now()
        });

        const updatedPatient = await db('patients').where('id', req.params.id).first();
        res.json(updatedPatient);
    } catch (error) {
        console.error('Error updating patient:', error);
        res.status(500).json({ error: 'Failed to update patient' });
    }
});

// Delete patient (Soft delete usually, but here we might do hard delete or status update)
router.delete('/:id', auth, async (req, res) => {
    try {
        // Check if patient has related records
        const hasAppointments = await db('appointments').where('patient_id', req.params.id).first();
        const hasRecords = await db('medical_records').where('patient_id', req.params.id).first();

        if (hasAppointments || hasRecords) {
            // Soft delete
            await db('patients').where('id', req.params.id).update({
                status: 'inactive',
                updated_at: db.fn.now()
            });
            return res.json({ message: 'Patient marked as inactive due to existing records' });
        }

        await db('patients').where('id', req.params.id).delete();
        res.json({ message: 'Patient deleted successfully' });
    } catch (error) {
        console.error('Error deleting patient:', error);
        res.status(500).json({ error: 'Failed to delete patient' });
    }
});

export default router;
