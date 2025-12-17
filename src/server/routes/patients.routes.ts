import express from 'express';
import { auth } from '../middleware/auth';
import db from '../db';
import { asyncHandler, Errors } from '../middleware/errorHandler';
import { log } from '../utils/logger';
import { generatePatientId } from '../utils/patient-id-generator';

const router = express.Router();

// Get all patients (with search and filters)
router.get('/', auth, asyncHandler(async (req, res) => {
    const { search, status, gender, limit = 50, offset = 0 } = req.query;

    let query = db('patients').select('*');

    if (search) {
        const searchTerm = (search as string).toLowerCase();
        console.log(`Searching for patient with term: "${searchTerm}"`);

        query = query.where(builder => {
            builder.whereRaw('LOWER(first_name) LIKE ?', [`%${searchTerm}%`])
                .orWhereRaw('LOWER(last_name) LIKE ?', [`%${searchTerm}%`])
                .orWhereRaw('LOWER(mrn) LIKE ?', [`%${searchTerm}%`])
                .orWhereRaw('LOWER(phone) LIKE ?', [`%${searchTerm}%`])
                .orWhereRaw('LOWER(email) LIKE ?', [`%${searchTerm}%`])
                .orWhere('id', search);
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

    return res.json({
        data: patients,
        total,
        page: Math.floor(Number(offset) / Number(limit)) + 1,
        limit: Number(limit)
    });
}));

// Get single patient
router.get('/:id', auth, asyncHandler(async (req, res) => {
    const patient = await db('patients').where('id', req.params.id).first();

    if (!patient) {
        throw Errors.notFound('Patient');
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

    return res.json({
        ...patient,
        recentAppointments: appointments,
        recentMedicalRecords: medicalRecords
    });
}));

// Create patient
router.post('/', auth, async (req, res) => {
    try {
        const {
            first_name, last_name, date_of_birth, gender, phone, email,
            address, city, state, zip_code, emergency_contact,
            insurance, medical_history, allergies, current_medications,
            assigned_doctor,
            registration_type, // 'new' | 'existing'
            manual_mrn, // Required if registration_type is 'existing'
            // Next of Kin fields
            nok_full_name, nok_relationship, nok_phone, nok_email, nok_address,
            // Demographic fields
            state_of_origin, lga, religion, tribe, employment_status
        } = req.body;

        let mrn = '';
        let status = 'active'; // Default for existing

        if (registration_type === 'existing') {
            if (!manual_mrn) {
                return res.status(400).json({ error: 'Old MRN is required for existing patients' });
            }
            // Generate new format ID for existing patient
            mrn = await generatePatientId(db);
            status = 'active'; // Existing patients are active immediately (no payment required)

            // Store old MRN for reference
            const patientData: any = {
                mrn,
                old_mrn: manual_mrn, // Store old MRN for tracking
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
                status: status,
                // Next of Kin fields
                nok_full_name,
                nok_relationship,
                nok_phone,
                nok_email,
                nok_address,
                // Demographic fields
                state_of_origin,
                lga,
                religion,
                tribe,
                employment_status
            };

            const [newPatient] = await db('patients').insert(patientData).returning('*');
            const patient = newPatient || await db('patients').where('mrn', mrn).first();

            log.info('Existing patient re-registered with new ID', {
                newMrn: mrn,
                oldMrn: manual_mrn,
                patientId: patient.id
            });
            return res.status(201).json(patient);
        } else {
            // New Patient - Generate new format ID
            mrn = await generatePatientId(db);
            status = 'pending_payment'; // New patients need to pay registration fee
        }

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
            status: status,
            // Next of Kin fields
            nok_full_name,
            nok_relationship,
            nok_phone,
            nok_email,
            nok_address,
            // Demographic fields
            state_of_origin,
            lga,
            religion,
            tribe,
            employment_status
        }).returning('*');

        // For SQLite which might not support returning('*') in older versions/knex config
        if (!newPatient) {
            const patient = await db('patients').where('mrn', mrn).first();
            return res.status(201).json(patient);
        }

        return res.status(201).json(newPatient);
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
        return res.json(updatedPatient);
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
        return res.json({ message: 'Patient deleted successfully' });
    } catch (error) {
        console.error('Error deleting patient:', error);
        res.status(500).json({ error: 'Failed to delete patient' });
    }
});

// Get patient distribution stats
router.get('/stats/distribution', auth, async (req, res) => {
    try {
        // By status
        const statusStats = await db('patients')
            .select('status')
            .count('* as value')
            .groupBy('status');

        // By gender
        const genderStats = await db('patients')
            .select('gender')
            .count('* as value')
            .groupBy('gender');

        // Map to format expected by charts
        const statusData = statusStats.map((s: any) => ({
            name: s.status ? s.status.charAt(0).toUpperCase() + s.status.slice(1) : 'Unknown',
            value: Number(s.value)
        }));

        const genderData = genderStats.map((s: any) => ({
            name: s.gender || 'Unknown',
            value: Number(s.value)
        }));

        res.json({
            byStatus: statusData,
            byGender: genderData
        });
    } catch (error) {
        console.error('Error fetching patient distribution stats:', error);
        res.status(500).json({ error: 'Failed to fetch patient distribution stats' });
    }
});

export default router;
