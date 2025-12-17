
import { Router } from 'express';
import db from '../db';
import { auth, authorize } from '../middleware/auth';
import bcrypt from 'bcryptjs';
import { asyncHandler, Errors } from '../middleware/errorHandler';
import { log } from '../utils/logger';

const router = Router();

// Get all staff users
router.get('/', auth, authorize(['admin']), asyncHandler(async (req, res) => {
    const { role, department_id, status } = req.query;

    let query = db('users').select('*');

    if (role) {
        query = query.where('role', role);
    }

    if (status) {
        query = query.where('is_active', status === 'active');
    }

    const users = await query;
    res.json(users);
}));

// Create new staff
router.post('/', auth, authorize(['admin']), asyncHandler(async (req, res) => {
    const { firstName, lastName, email, username, password, role, department, phone } = req.body;

    if (!firstName || !lastName || !email || !username || !password || !role) {
        throw Errors.badRequest('Missing required fields');
    }

    const existingUser = await db('users').where({ email }).orWhere({ username }).first();
    if (existingUser) {
        throw Errors.conflict('User with this email or username already exists');
    }

    const password_hash = await bcrypt.hash(password, 10);

    const [userId] = await db('users').insert({
        firstName,
        lastName,
        email,
        username,
        password_hash,
        role,
        department: department || null,
        phone: phone || null,
        is_active: true
    });

    const newUser = await db('users').where({ id: userId }).first();
    const { password_hash: _, ...userWithoutPassword } = newUser;

    log.info('Staff created', { userId, email, role });
    res.status(201).json(userWithoutPassword);
}));

// Update staff
router.put('/:id', auth, authorize(['admin']), asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, role, department, phone, is_active } = req.body;

    const updateData: any = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (role) updateData.role = role;
    if (department !== undefined) updateData.department = department;
    if (phone !== undefined) updateData.phone = phone;
    if (is_active !== undefined) updateData.is_active = is_active;

    await db('users').where({ id }).update(updateData);

    const updatedUser = await db('users').where({ id }).first();
    const { password_hash: _, ...userWithoutPassword } = updatedUser;

    log.info('Staff updated', { userId: id });
    res.json(userWithoutPassword);
}));

// Get Schedules
router.get('/schedules', auth, authorize(['admin', 'doctor', 'nurse', 'receptionist']), asyncHandler(async (req, res) => {
    const { start_date, end_date, user_id, department_id } = req.query;

    let query = db('schedules')
        .select(
            'schedules.*',
            'users.firstName',
            'users.lastName',
            'users.role',
            'departments.name as department_name',
            'units.name as unit_name'
        )
        .join('users', 'schedules.user_id', 'users.id')
        .leftJoin('departments', 'schedules.department_id', 'departments.id')
        .leftJoin('units', 'schedules.unit_id', 'units.id');

    if (start_date) {
        query = query.where('start_time', '>=', start_date);
    }
    if (end_date) {
        query = query.where('end_time', '<=', end_date);
    }
    if (user_id) {
        query = query.where('schedules.user_id', user_id);
    }
    if (department_id) {
        query = query.where('schedules.department_id', department_id);
    }

    const schedules = await query.orderBy('start_time', 'asc');
    res.json(schedules);
}));

// Create Schedule
router.post('/schedules', auth, authorize(['admin']), asyncHandler(async (req, res) => {
    const { user_id, department_id, unit_id, start_time, end_time, shift_type, notes } = req.body;

    if (!user_id || !start_time || !end_time || !shift_type) {
        throw Errors.badRequest('Missing required schedule fields');
    }

    const [scheduleId] = await db('schedules').insert({
        user_id,
        department_id,
        unit_id,
        start_time,
        end_time,
        shift_type,
        notes,
        status: 'Scheduled'
    });

    const newSchedule = await db('schedules').where({ id: scheduleId }).first();
    log.info('Schedule created', { scheduleId, userId: user_id });
    res.status(201).json(newSchedule);
}));

// Update Schedule
router.put('/schedules/:id', auth, authorize(['admin']), asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { start_time, end_time, shift_type, status, notes } = req.body;

    const updateData: any = {};
    if (start_time) updateData.start_time = start_time;
    if (end_time) updateData.end_time = end_time;
    if (shift_type) updateData.shift_type = shift_type;
    if (status) updateData.status = status;
    if (notes) updateData.notes = notes;
    updateData.updated_at = db.fn.now();

    await db('schedules').where({ id }).update(updateData);

    const updatedSchedule = await db('schedules').where({ id }).first();
    log.info('Schedule updated', { scheduleId: id });
    res.json(updatedSchedule);
}));

// Delete Schedule
router.delete('/schedules/:id', auth, authorize(['admin']), asyncHandler(async (req, res) => {
    const { id } = req.params;
    await db('schedules').where({ id }).del();
    log.info('Schedule deleted', { scheduleId: id });
    res.json({ message: 'Schedule deleted successfully' });
}));

// Get Roles (Admin only for management)
router.get('/roles', auth, authorize(['admin']), asyncHandler(async (req, res) => {
    const roles = [
        { name: 'admin', description: 'Full system access', type: 'System' },
        { name: 'doctor', description: 'Clinical access, consultations, prescriptions', type: 'Clinical' },
        { name: 'nurse', description: 'Patient care, vitals, medication administration', type: 'Clinical' },
        { name: 'pharmacist', description: 'Inventory, dispensing', type: 'Clinical' },
        { name: 'labtech', description: 'Lab results, tests', type: 'Clinical' },
        { name: 'cashier', description: 'Billing, payments', type: 'Administrative' },
        { name: 'receptionist', description: 'Registration, appointments', type: 'Administrative' },
        { name: 'ehr', description: 'Electronic Health Records management', type: 'Administrative' }
    ];
    res.json(roles);
}));

export default router;
