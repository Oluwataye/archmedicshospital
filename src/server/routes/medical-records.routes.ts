import express from 'express';
import { auth } from '../middleware/auth';
import db from '../db';
import { asyncHandler, Errors } from '../middleware/errorHandler';
import { log } from '../utils/logger';

const router = express.Router();

// Get medical records (with filters)
router.get('/', auth, asyncHandler(async (req, res) => {
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
}));

// Get single record
router.get('/:id', auth, asyncHandler(async (req, res) => {
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
        throw Errors.notFound('Medical record');
    }

    return res.json(record);
}));

// Create allergy record
router.post('/allergies', auth, asyncHandler(async (req, res) => {
    const { patient_id, allergen, severity, reaction, notes, status } = req.body;
    const provider_id = req.user.id;

    // Create a structured content for the allergy
    const allergyContent = {
        allergen,
        severity,
        reaction,
        notes
    };

    const [newRecord] = await db('medical_records').insert({
        patient_id,
        provider_id,
        record_type: 'allergy',
        record_date: new Date(),
        title: `Allergy: ${allergen}`,
        content: JSON.stringify(allergyContent),
        status: status || 'active'
    }).returning('*');

    // SQLite fallback
    if (!newRecord) {
        const record = await db('medical_records')
            .where({ patient_id, provider_id, record_type: 'allergy', title: `Allergy: ${allergen}` })
            .orderBy('created_at', 'desc')
            .first();
        return res.status(201).json(record);
    }

    return res.status(201).json(newRecord);
}));

// Create medical record
router.post('/', auth, asyncHandler(async (req, res) => {
    const {
        patient_id, record_type, record_date, title,
        content, attachments, status
    } = req.body;

    const provider_id = req.user.id;

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
        const record = await db('medical_records')
            .where({ patient_id, provider_id, title })
            .orderBy('created_at', 'desc')
            .first();
        log.info('Medical record created', { recordId: record.id, patientId: patient_id });
        return res.status(201).json(record);
    }

    log.info('Medical record created', { recordId: newRecord.id, patientId: patient_id });
    return res.status(201).json(newRecord);
}));

// Update medical record
router.put('/:id', auth, asyncHandler(async (req, res) => {
    const recordId = req.params.id;
    const updates = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    const existingRecord = await db('medical_records').where('id', recordId).first();

    if (!existingRecord) {
        throw Errors.notFound('Medical record');
    }

    // Permission Check: Only admin or creator can edit
    if (userRole !== 'admin' && existingRecord.provider_id !== userId) {
        throw Errors.forbidden('You do not have permission to edit this record');
    }

    // 24-Hour Edit Window Check (for non-admins)
    if (userRole !== 'admin') {
        const createdAt = new Date(existingRecord.created_at);
        const now = new Date();
        const hoursSinceCreation = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

        if (hoursSinceCreation > 24) {
            throw Errors.forbidden('24-hour edit window has expired');
        }
    }

    delete updates.id;
    delete updates.created_at;
    delete updates.provider_id;

    if (typeof updates.attachments === 'object') updates.attachments = JSON.stringify(updates.attachments);

    await db('medical_records').where('id', recordId).update({
        ...updates,
        updated_at: db.fn.now()
    });

    const updatedRecord = await db('medical_records').where('id', recordId).first();
    log.info('Medical record updated', { recordId });
    return res.json(updatedRecord);
}));

// Delete medical record
router.delete('/:id', auth, asyncHandler(async (req, res) => {
    const recordId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role;

    const existingRecord = await db('medical_records').where('id', recordId).first();

    if (!existingRecord) {
        throw Errors.notFound('Medical record');
    }

    // Permission Check: Only admin or creator can delete
    if (userRole !== 'admin' && existingRecord.provider_id !== userId) {
        throw Errors.forbidden('You do not have permission to delete this record');
    }

    await db('medical_records').where('id', recordId).delete();
    log.info('Medical record deleted', { recordId });
    return res.json({ message: 'Medical record deleted successfully' });
}));

// Get patient history
// Get patient history (aggregated)
router.get('/patient/:patientId/history', auth, asyncHandler(async (req, res) => {
    const { patientId } = req.params;

    // Run queries in parallel for performance
    const [medicalRecords, prescriptions, labResults, vitalSigns] = await Promise.all([
        // 1. Fetch Medical Records
        db('medical_records')
            .join('users', 'medical_records.provider_id', 'users.id')
            .where('medical_records.patient_id', patientId)
            .select(
                'medical_records.id',
                'medical_records.record_type',
                'medical_records.record_date',
                'medical_records.title',
                'medical_records.content',
                'medical_records.status',
                'medical_records.created_at',
                'users.first_name as provider_first_name',
                'users.last_name as provider_last_name',
                'users.role as provider_role'
            ),

        // 2. Fetch Prescriptions
        db('prescriptions')
            .join('users', 'prescriptions.prescribed_by', 'users.id')
            .where('prescriptions.patient_id', patientId)
            .select(
                'prescriptions.id',
                'prescriptions.prescription_date as record_date',
                'prescriptions.medications as content',
                'prescriptions.status',
                'prescriptions.created_at',
                'users.first_name as provider_first_name',
                'users.last_name as provider_last_name',
                'users.role as provider_role'
            )
            .then(rows => rows.map(row => ({
                ...row,
                record_type: 'prescription',
                title: 'Prescription Order'
            }))),

        // 3. Fetch Lab Results
        db('lab_results')
            .join('users', 'lab_results.ordered_by', 'users.id')
            .where('lab_results.patient_id', patientId)
            .select(
                'lab_results.id',
                'lab_results.order_date as record_date',
                'lab_results.test_name as title',
                'lab_results.result_value as content', // Corrected column name
                'lab_results.interpretation',
                'lab_results.status',
                'lab_results.created_at',
                'users.first_name as provider_first_name',
                'users.last_name as provider_last_name',
                'users.role as provider_role'
            )
            .then(rows => rows.map(row => ({
                ...row,
                record_type: 'lab_result',
                title: `Lab: ${row.title}`,
                content: row.content || (row.status === 'completed' ? 'No result value' : 'Pending Result') + (row.interpretation ? `\nInterpretation: ${row.interpretation}` : '')
            }))),

        // 4. Fetch Vital Signs
        db('vital_signs')
            .join('users', 'vital_signs.recorded_by', 'users.id')
            .where('vital_signs.patient_id', patientId)
            .select(
                'vital_signs.id',
                'vital_signs.recorded_at as record_date',
                'vital_signs.systolic_bp',
                'vital_signs.diastolic_bp',
                'vital_signs.heart_rate',
                'vital_signs.temperature',
                'vital_signs.oxygen_saturation',
                'vital_signs.respiratory_rate', // Added respiratory rate
                'users.first_name as provider_first_name',
                'users.last_name as provider_last_name',
                'users.role as provider_role'
            )
            .then(rows => rows.map(row => {
                // Format vitals content safely
                const parts = [];
                if (row.systolic_bp && row.diastolic_bp) parts.push(`BP: ${row.systolic_bp}/${row.diastolic_bp} mmHg`);
                if (row.heart_rate) parts.push(`HR: ${row.heart_rate} bpm`);
                if (row.temperature) parts.push(`Temp: ${row.temperature}°F`); // Assuming F based on 98.6 default
                if (row.oxygen_saturation) parts.push(`O2: ${row.oxygen_saturation}%`);
                if (row.respiratory_rate) parts.push(`Resp: ${row.respiratory_rate}/min`);

                return {
                    id: row.id,
                    record_type: 'vital-signs', // normalized dash
                    record_date: row.record_date,
                    title: 'Vital Signs',
                    content: parts.join(', '),
                    status: 'final',
                    provider_first_name: row.provider_first_name,
                    provider_last_name: row.provider_last_name,
                    provider_role: row.provider_role,
                    // Keep raw values if needed by frontend, but strictly mapped to standard structure above
                    raw_vitals: { ...row }
                };
            }))
    ]);

    // Combine all records
    const allRecords = [
        ...medicalRecords,
        ...prescriptions,
        ...labResults,
        ...vitalSigns
    ];

    // Sort by date descending
    allRecords.sort((a, b) => {
        const dateA = new Date(a.record_date).getTime();
        const dateB = new Date(b.record_date).getTime();
        return dateB - dateA;
    });

    return res.json(allRecords);
}));

// Get stats overview
router.get('/stats/overview', auth, asyncHandler(async (req, res) => {
    const totalRecords = await db('medical_records').count('id as count').first();

    const byType = await db('medical_records')
        .select('record_type')
        .count('id as count')
        .groupBy('record_type');

    return res.json({
        total: totalRecords?.count || 0,
        byType
    });
}));

export default router;
