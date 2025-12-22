import express from 'express';
import { auth, authorize } from '../middleware/auth';
import db from '../db';
import { asyncHandler, Errors } from '../middleware/errorHandler';
import { log } from '../utils/logger';

const router = express.Router();

// Get all wards
router.get('/', auth, asyncHandler(async (req, res) => {
    const wards = await db('wards')
        .select(
            'wards.*',
            'departments.name as department_name',
            db.raw('count(beds.id) as total_beds'),
            db.raw('count(CASE WHEN beds.is_occupied IS TRUE THEN 1 END) as occupied_beds')
        )
        .leftJoin('beds', 'wards.id', 'beds.ward_id')
        .leftJoin('departments', 'wards.department_id', 'departments.id')
        .groupBy('wards.id', 'departments.name');

    res.json(wards);
}));

// Get ward details with beds
router.get('/:id', auth, asyncHandler(async (req, res) => {
    const ward = await db('wards')
        .select('wards.*', 'departments.name as department_name')
        .leftJoin('departments', 'wards.department_id', 'departments.id')
        .where('wards.id', req.params.id)
        .first();

    if (!ward) {
        throw Errors.notFound('Ward');
    }

    const beds = await db('beds').where('ward_id', req.params.id).orderBy('bed_number');

    // Get active admission for occupied beds
    for (const bed of beds) {
        if (bed.is_occupied) {
            const admission = await db('admissions')
                .where('bed_id', bed.id)
                .where('status', 'Admitted')
                .join('patients', 'admissions.patient_id', 'patients.id')
                .select('admissions.*', 'patients.first_name', 'patients.last_name', 'patients.mrn')
                .first();

            if (admission) {
                bed.admission = admission;
            }
        }
    }

    res.json({ ...ward, beds });
}));

// Create new ward (Admin only)
router.post('/', auth, authorize(['admin']), asyncHandler(async (req, res) => {
    const { name, type, capacity, gender, description, department_id } = req.body;

    const [id] = await db('wards').insert({
        name,
        type,
        capacity,
        gender,
        description,
        department_id
    });

    const newWard = await db('wards').where('name', name).first();
    log.info('Ward created', { wardId: id, name });
    res.status(201).json(newWard);
}));

// Update ward (Admin only)
router.put('/:id', auth, authorize(['admin']), asyncHandler(async (req, res) => {
    const { name, type, capacity, gender, description, department_id } = req.body;
    const { id } = req.params;

    await db('wards').where('id', id).update({
        name,
        type,
        capacity,
        gender,
        description,
        department_id,
        updated_at: db.fn.now()
    });

    const updatedWard = await db('wards').where('id', id).first();
    log.info('Ward updated', { wardId: id });
    res.json(updatedWard);
}));

// Delete ward (Admin only)
router.delete('/:id', auth, authorize(['admin']), asyncHandler(async (req, res) => {
    const { id } = req.params;
    await db('wards').where('id', id).delete();
    log.info('Ward deleted', { wardId: id });
    res.json({ message: 'Ward deleted successfully' });
}));

// Add beds to ward
router.post('/:id/beds', auth, authorize(['admin', 'nurse']), asyncHandler(async (req, res) => {
    const { beds } = req.body;
    const wardId = req.params.id;

    if (!Array.isArray(beds)) {
        throw Errors.badRequest('Beds must be an array');
    }

    for (const bed of beds) {
        await db('beds').insert({
            ward_id: wardId,
            bed_number: bed.bed_number,
            type: bed.type || 'Standard',
            status: 'Available'
        });
    }

    log.info('Beds added to ward', { wardId, count: beds.length });
    res.json({ message: 'Beds added successfully' });
}));

// Admit patient
router.post('/admit', auth, authorize(['doctor', 'nurse', 'admin']), asyncHandler(async (req, res) => {
    const { patient_id, ward_id, bed_id, reason, diagnosis, notes } = req.body;
    const admitted_by = (req as any).user.id;

    // Check if bed is available
    const bed = await db('beds').where('id', bed_id).first();
    if (!bed) throw Errors.notFound('Bed');
    if (bed.is_occupied) throw Errors.badRequest('Bed is already occupied');

    await db.transaction(async (trx) => {
        // Create admission record
        await trx('admissions').insert({
            patient_id,
            ward_id,
            bed_id,
            admitted_by,
            reason,
            diagnosis,
            notes,
            status: 'Admitted'
        });

        // Update bed status
        await trx('beds').where('id', bed_id).update({
            is_occupied: true,
            status: 'Occupied',
            updated_at: db.fn.now()
        });
    });

    log.info('Patient admitted', { patientId: patient_id, wardId: ward_id, bedId: bed_id });
    res.json({ message: 'Patient admitted successfully' });
}));

// Discharge patient
router.put('/discharge/:admissionId', auth, authorize(['doctor', 'nurse', 'admin']), asyncHandler(async (req, res) => {
    const { admissionId } = req.params;
    const { notes, discharge_type } = req.body;
    const discharged_by = (req as any).user.id;

    const admission = await db('admissions').where('id', admissionId).first();
    if (!admission) throw Errors.notFound('Admission');
    if (admission.status !== 'Admitted') throw Errors.badRequest('Patient is not currently admitted');

    await db.transaction(async (trx) => {
        // Update admission record
        await trx('admissions').where('id', admissionId).update({
            status: discharge_type || 'Discharged',
            discharge_date: db.fn.now(),
            discharged_by,
            notes: admission.notes + '\n\nDischarge Notes: ' + (notes || ''),
            updated_at: db.fn.now()
        });

        // Update bed status
        await trx('beds').where('id', admission.bed_id).update({
            is_occupied: false,
            status: 'Cleaning',
            updated_at: db.fn.now()
        });
    });

    log.info('Patient discharged', { admissionId, dischargedBy: discharged_by });
    res.json({ message: 'Patient discharged successfully' });
}));

// Update bed status (e.g., after cleaning)
router.put('/beds/:id/status', auth, authorize(['nurse', 'admin']), asyncHandler(async (req, res) => {
    const { status } = req.body;

    await db('beds').where('id', req.params.id).update({
        status,
        updated_at: db.fn.now()
    });

    log.info('Bed status updated', { bedId: req.params.id, status });
    res.json({ message: 'Bed status updated' });
}));

export default router;
