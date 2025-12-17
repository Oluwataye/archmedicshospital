import express from 'express';
import { auth } from '../middleware/auth';
import db from '../db';
import { asyncHandler, Errors } from '../middleware/errorHandler';
import { log } from '../utils/logger';

const router = express.Router();

// Get appointments (with filters)
router.get('/', auth, asyncHandler(async (req, res) => {
    const { date, doctor_id, patient_id, status } = req.query;

    let query = db('appointments')
        .join('patients', 'appointments.patient_id', 'patients.id')
        .join('users', 'appointments.doctor_id', 'users.id')
        .select(
            'appointments.*',
            'patients.first_name as patient_first_name',
            'patients.last_name as patient_last_name',
            'patients.mrn as patient_mrn',
            'patients.date_of_birth as patient_dob',
            'patients.gender as patient_gender',
            'users.first_name as doctor_first_name',
            'users.last_name as doctor_last_name',
            db.raw('(SELECT MAX(a2.appointment_date) FROM appointments a2 WHERE a2.patient_id = appointments.patient_id AND a2.appointment_date < appointments.appointment_date) as last_visit')
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

    // Fetch vitals for these appointments
    const appointmentsWithVitals = await Promise.all(appointments.map(async (apt: any) => {
        const vitals = await db('vital_signs')
            .where('patient_id', apt.patient_id)
            .whereRaw('DATE(recorded_at) = ?', [apt.appointment_date])
            .orderBy('recorded_at', 'desc')
            .first();
        return { ...apt, vital_signs: vitals };
    }));

    return res.json(appointmentsWithVitals);
}));

// Get single appointment
router.get('/:id', auth, asyncHandler(async (req, res) => {
    const appointment = await db('appointments')
        .join('patients', 'appointments.patient_id', 'patients.id')
        .join('users', 'appointments.doctor_id', 'users.id')
        .where('appointments.id', req.params.id)
        .select(
            'appointments.*',
            'patients.first_name as patient_first_name',
            'patients.last_name as patient_last_name',
            'patients.mrn as patient_mrn',
            'patients.date_of_birth as patient_dob',
            'patients.gender as patient_gender',
            'users.first_name as doctor_first_name',
            'users.last_name as doctor_last_name',
            db.raw('(SELECT MAX(a2.appointment_date) FROM appointments a2 WHERE a2.patient_id = appointments.patient_id AND a2.appointment_date < appointments.appointment_date) as last_visit')
        )
        .first();

    if (!appointment) {
        throw Errors.notFound('Appointment');
    }

    return res.json(appointment);
}));

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

// Get weekly appointment stats
router.get('/stats/weekly', auth, async (req, res) => {
    try {
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 6);

        const startDate = sevenDaysAgo.toISOString().split('T')[0];

        const stats = await db('appointments')
            .where('appointment_date', '>=', startDate)
            .select(db.raw('DATE(appointment_date) as date'))
            .count('* as count')
            .groupByRaw('DATE(appointment_date)')
            .orderBy('date', 'asc');

        // Fill in missing days with 0
        const result = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(sevenDaysAgo);
            d.setDate(d.getDate() + i);
            const dateStr = d.toISOString().split('T')[0];
            const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

            const found = stats.find((s: any) => {
                // Handle different date formats returned by drivers (string or Date object)
                const sDate = s.date instanceof Date ? s.date.toISOString().split('T')[0] : s.date;
                return sDate === dateStr;
            });

            result.push({
                name: dayName,
                date: dateStr,
                appointments: found ? Number(found.count) : 0
            });
        }

        res.json(result);
    } catch (error) {
        console.error('Error fetching weekly appointment stats:', error);
        res.status(500).json({ error: 'Failed to fetch weekly appointment stats' });
    }
});

export default router;
