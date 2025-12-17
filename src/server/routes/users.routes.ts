import express from 'express';
import { auth, authorize } from '../middleware/auth';
import db from '../db';
import bcrypt from 'bcryptjs';
import { asyncHandler, Errors } from '../middleware/errorHandler';
import { log } from '../utils/logger';

const router = express.Router();

// Get all users (Admin only)
router.get('/', auth, authorize(['admin']), asyncHandler(async (req, res) => {
    const { role, search } = req.query;
    let query = db('users').select('id', 'username', 'email', 'first_name', 'last_name', 'role', 'department', 'specialty', 'is_active', 'last_login', 'created_at');

    if (role) {
        query = query.where('role', role as string);
    }

    if (search) {
        query = query.where(builder => {
            builder.where('first_name', 'like', `%${search}%`)
                .orWhere('last_name', 'like', `%${search}%`)
                .orWhere('email', 'like', `%${search}%`)
                .orWhere('username', 'like', `%${search}%`);
        });
    }

    const users = await query;
    res.json(users);
}));

// Create new user (Admin only)
router.post('/', auth, authorize(['admin']), asyncHandler(async (req, res) => {
    const { username, email, password, first_name, last_name, role, department, specialty, license_number, phone } = req.body;

    // Check if user already exists
    const existingUser = await db('users')
        .where('email', email)
        .orWhere('username', username)
        .first();

    if (existingUser) {
        throw Errors.conflict('User with this email or username already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Insert user
    const [user] = await db('users').insert({
        username,
        email,
        password_hash,
        first_name,
        last_name,
        role,
        department,
        specialty,
        license_number,
        phone,
        is_active: true
    }).returning('*');

    // Remove password hash from response
    delete user.password_hash;

    log.info('User created', { userId: user.id, email, role });
    res.status(201).json(user);
}));

// Get doctors list (Accessible by authenticated users)
router.get('/doctors/list', auth, asyncHandler(async (req, res) => {
    const doctors = await db('users')
        .where('role', 'doctor')
        .where('is_active', true)
        .select('id', 'first_name', 'last_name', 'specialty', 'department');
    res.json(doctors);
}));

// Get user stats overview (Admin only)
router.get('/stats/overview', auth, authorize(['admin']), asyncHandler(async (req, res) => {
    const totalUsers = await db('users').count('id as count').first();
    const activeUsers = await db('users').where('is_active', true).count('id as count').first();

    // Count by role
    const roleCounts = await db('users')
        .select('role')
        .count('id as count')
        .groupBy('role');

    res.json({
        total: totalUsers?.count || 0,
        active: activeUsers?.count || 0,
        byRole: roleCounts
    });
}));

// Get single user
router.get('/:id', auth, authorize(['admin']), asyncHandler(async (req, res) => {
    const user = await db('users')
        .where('id', req.params.id)
        .select('id', 'username', 'email', 'first_name', 'last_name', 'role', 'department', 'specialty', 'license_number', 'phone', 'is_active', 'created_at')
        .first();

    if (!user) {
        throw Errors.notFound('User');
    }

    res.json(user);
}));

// Update user (Admin only)
router.put('/:id', auth, authorize(['admin']), asyncHandler(async (req, res) => {
    const { password, ...updateData } = req.body;

    // Don't allow updating password directly through this endpoint
    // Use a separate endpoint or handle hashing if needed

    await db('users').where('id', req.params.id).update({
        ...updateData,
        updated_at: db.fn.now()
    });

    const updatedUser = await db('users')
        .where('id', req.params.id)
        .select('id', 'username', 'email', 'first_name', 'last_name', 'role', 'department', 'specialty', 'is_active')
        .first();

    log.info('User updated', { userId: req.params.id });
    res.json(updatedUser);
}));

// Reset user password (Admin only)
router.put('/:id/reset-password', auth, authorize(['admin']), asyncHandler(async (req, res) => {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
        throw Errors.badRequest('Password must be at least 6 characters');
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(newPassword, salt);

    await db('users').where('id', req.params.id).update({
        password_hash,
        updated_at: db.fn.now()
    });

    log.info('Password reset', { userId: req.params.id });
    res.json({ message: 'Password reset successfully' });
}));

// Update current user's profile (Accessible by authenticated users)
router.put('/profile', auth, asyncHandler(async (req, res) => {
    const userId = (req as any).user.id;
    const { first_name, last_name, email, phone, department_id, unit_id } = req.body;

    // Validate that unit belongs to department if both are provided
    if (department_id && unit_id) {
        const unit = await db('wards').where('id', unit_id).first();
        if (unit && unit.department_id !== department_id) {
            throw Errors.badRequest('Selected unit does not belong to the selected department');
        }
    }

    await db('users').where('id', userId).update({
        first_name,
        last_name,
        email,
        phone,
        department_id: department_id || null,
        unit_id: unit_id || null,
        updated_at: db.fn.now()
    });

    const updatedUser = await db('users')
        .leftJoin('departments', 'users.department_id', 'departments.id')
        .leftJoin('wards', 'users.unit_id', 'wards.id')
        .where('users.id', userId)
        .select(
            'users.id',
            'users.username',
            'users.email',
            'users.first_name',
            'users.last_name',
            'users.role',
            'users.department',
            'users.specialty',
            'users.phone',
            'users.department_id',
            'users.unit_id',
            'departments.name as department_name',
            'wards.name as unit_name'
        )
        .first();

    log.info('Profile updated', { userId });
    res.json(updatedUser);
}));

// Deactivate user (Admin only)
router.delete('/:id', auth, authorize(['admin']), asyncHandler(async (req, res) => {
    await db('users').where('id', req.params.id).update({
        is_active: false,
        updated_at: db.fn.now()
    });

    log.info('User deactivated', { userId: req.params.id });
    res.json({ message: 'User deactivated successfully' });
}));

export default router;
