import express from 'express';
import { auth } from '../middleware/auth';
import db from '../db';
import { asyncHandler, Errors } from '../middleware/errorHandler';
import { log } from '../utils/logger';

const router = express.Router();

// Get prescriptions (with filters)
router.get('/', auth, asyncHandler(async (req, res) => {
    const { patient_id, status, date_from, date_to } = req.query;

    let query = db('prescriptions')
        .join('users', 'prescriptions.prescribed_by', 'users.id')
        .join('patients', 'prescriptions.patient_id', 'patients.id')
        .select(
            'prescriptions.*',
            'users.first_name as prescriber_first_name',
            'users.last_name as prescriber_last_name',
            'patients.first_name as patient_first_name',
            'patients.last_name as patient_last_name',
            'patients.mrn as patient_mrn'
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
}));

// Get single prescription
router.get('/:id', auth, asyncHandler(async (req, res) => {
    const prescription = await db('prescriptions')
        .where('id', req.params.id)
        .first();

    if (!prescription) {
        throw Errors.notFound('Prescription');
    }

    res.json(prescription);
}));

// Create prescription
router.post('/', auth, asyncHandler(async (req, res) => {
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
        log.info('Prescription created', { prescriptionId: prescription.id, patientId: patient_id });
        return res.status(201).json(prescription);
    }

    log.info('Prescription created', { prescriptionId: newPrescription.id, patientId: patient_id });
    res.status(201).json(newPrescription);
}));

// Update prescription
router.put('/:id', auth, asyncHandler(async (req, res) => {
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
    log.info('Prescription updated', { prescriptionId: req.params.id });
    res.json(updatedPrescription);
}));

// Dispense prescription
router.post('/:id/dispense', auth, asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { notes, items, type } = req.body;
    const dispensed_by = (req as any).user.id;

    await db.transaction(async (trx) => {
        const prescription = await trx('prescriptions').where('id', id).first();
        if (!prescription) throw Errors.notFound('Prescription');

        if (prescription.status !== 'active' && type !== 'refill') {
            throw Errors.badRequest('Prescription is not active');
        }

        let newStatus = 'dispensed';

        if (type === 'partial') {
            newStatus = 'active';
        } else if (type === 'refill') {
            if (prescription.refills_remaining <= 0) {
                throw Errors.badRequest('No refills remaining');
            }

            await trx('prescriptions').where('id', id).decrement('refills_remaining', 1);
            await trx('prescriptions').where('id', id).update({ last_refill_date: trx.fn.now() });

            if (prescription.refills_remaining - 1 > 0) {
                newStatus = 'active';
            }
        }

        await trx('prescriptions').where('id', id).update({
            status: newStatus,
            dispensed_at: trx.fn.now(),
            dispensed_by,
            dispensing_notes: notes,
            updated_at: trx.fn.now()
        });

        await trx('prescription_fills').insert({
            prescription_id: id,
            dispensed_by,
            items: JSON.stringify(items || []),
            notes,
            type: type || 'fill'
        });

        if (items && Array.isArray(items)) {
            for (const item of items) {
                await trx('inventory_items').where('id', item.item_id).decrement('current_stock', item.quantity);

                if (item.batch_id) {
                    await trx('inventory_batches').where('id', item.batch_id).decrement('remaining_quantity', item.quantity);
                }

                await trx('stock_movements').insert({
                    item_id: item.item_id,
                    batch_id: item.batch_id,
                    type: 'OUT',
                    quantity: item.quantity,
                    previous_stock: 0,
                    new_stock: 0,
                    reference_type: 'Prescription',
                    reference_id: id,
                    performed_by: dispensed_by,
                    notes: `Dispensed (${type || 'fill'}) for Rx ${id}`
                });
            }
        }
    });

    log.info('Prescription dispensed', { prescriptionId: id, type, dispensedBy: dispensed_by });
    res.json({ message: 'Prescription dispensed successfully' });
}));

// Cancel prescription
router.delete('/:id', auth, asyncHandler(async (req, res) => {
    await db('prescriptions').where('id', req.params.id).update({
        status: 'cancelled',
        updated_at: db.fn.now()
    });

    log.info('Prescription cancelled', { prescriptionId: req.params.id });
    res.json({ message: 'Prescription cancelled successfully' });
}));

// Get active prescriptions for pharmacy
router.get('/active/pharmacy', auth, asyncHandler(async (req, res) => {
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
}));

// Get patient prescription history
router.get('/patient/:patientId/history', auth, asyncHandler(async (req, res) => {
    const history = await db('prescriptions')
        .where('patient_id', req.params.patientId)
        .orderBy('prescription_date', 'desc');
    res.json(history);
}));

// Get stats overview
router.get('/stats/overview', auth, asyncHandler(async (req, res) => {
    const total = await db('prescriptions').count('id as count').first();
    const active = await db('prescriptions').where('status', 'active').count('id as count').first();

    res.json({
        total: total?.count || 0,
        active: active?.count || 0
    });
}));

export default router;
