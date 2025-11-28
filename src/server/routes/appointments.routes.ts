import express from 'express';
import { auth } from '../middleware/auth.ts';
import db from '../db.ts';

const router = express.Router();

// Get appointments (with filters)
router.get('/', auth, async (req, res) => {
    try {
        const { date, doctor_id, patient_id, status } = req.query;

        let query = db('appointments')
            .join('patients', 'appointments.patient_id', 'patients.id')
            .join('users', 'appointments.doctor_id', 'users.id')
            .select(
                'appointments.*',
                'patients.first_name as patient_first_name',
                'patients.last_name as patient_last_name',
                'users.first_name as doctor_first_name',
                'users.last_name as doctor_last_name'
            );

        if (date) {
            query = query.where('appointments.appointment_date', date as string);
        }

        if (doctor_id) {
            query = query.where('appointments.doctor_id', doctor_id as string);
        }

        if (patient_id) {
            query = query.where('appointments.patient_id', patient_id as string);
        }

        if (status) {
            query = query.where('appointments.status', status as string);
        }

        const appointments = await query.orderBy('appointments.appointment_date', 'asc').orderBy('appointments.appointment_time', 'asc');
        return res.json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});

// Get single appointment
router.get('/:id', auth, async (req, res) => {
    try {
        const appointment = await db('appointments')
            .join('patients', 'appointments.patient_id', 'patients.id')
            .join('users', 'appointments.doctor_id', 'users.id')
            .where('appointments.id', req.params.id)
            .select(
                'appointments.*',
                'patients.first_name as patient_first_name',
                'patients.last_name as patient_last_name',
                'users.first_name as doctor_first_name',
                'users.last_name as doctor_last_name'
            )
            .first();

        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        return res.json(appointment);
    } catch (error) {
        console.error('Error fetching appointment:', error);
        res.status(500).json({ error: 'Failed to fetch appointment' });
    }
});

// Create appointment
router.post('/', auth, async (req, res) => {
    try {
        const {
            patient_id, doctor_id, appointment_date, appointment_time,
            duration, type, notes, symptoms
        } = req.body;

        // Check availability
        const existingAppointment = await db('appointments')
            .where({
                doctor_id,
                appointment_date,
                appointment_time,
                status: 'scheduled'
            })
            .first();

        if (existingAppointment) {
            return res.status(400).json({ error: 'Doctor is not available at this time' });
        }

        const [newAppointment] = await db('appointments').insert({
            patient_id,
            doctor_id,
            appointment_date,
            appointment_time,
            duration: duration || 30,
            type,
            notes,
            symptoms,
            status: 'scheduled'
        }).returning('*');

        // SQLite fallback
        if (!newAppointment) {
            const appointment = await db('appointments')
                .where({ patient_id, doctor_id, appointment_date, appointment_time })
                .first();
            return res.status(201).json(appointment);
        }

        return res.status(201).json(newAppointment);
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ error: 'Failed to create appointment' });
    }
});

// Update appointment
router.put('/:id', auth, async (req, res) => {
    try {
        const updates = req.body;
        delete updates.id;
        delete updates.created_at;

        await db('appointments').where('id', req.params.id).update({
            ...updates,
            updated_at: db.fn.now()
        });

        const updatedAppointment = await db('appointments').where('id', req.params.id).first();
        return res.json(updatedAppointment);
    } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({ error: 'Failed to update appointment' });
    }
});

// Cancel appointment
router.delete('/:id', auth, async (req, res) => {
    try {
        await db('appointments').where('id', req.params.id).update({
            status: 'cancelled',
            updated_at: db.fn.now()
        });
        return res.json({ message: 'Appointment cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling appointment:', error);
        res.status(500).json({ error: 'Failed to cancel appointment' });
    }
});

// Check doctor availability
router.get('/availability/:doctorId', auth, async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) {
            return res.status(400).json({ error: 'Date is required' });
        }

        const appointments = await db('appointments')
            .where({
                doctor_id: req.params.doctorId,
                appointment_date: date,
            })
            .whereNot('status', 'cancelled')
            .select('appointment_time', 'duration');

        return res.json(appointments);
    } catch (error) {
        console.error('Error checking availability:', error);
        res.status(500).json({ error: 'Failed to check availability' });
    }
});

export default router;
