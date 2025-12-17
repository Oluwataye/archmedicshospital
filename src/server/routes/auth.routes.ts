import express from 'express';
import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import knex from '../db';
import { validate, schemas } from '../middleware/validation';
import { asyncHandler, AppError, Errors } from '../middleware/errorHandler';
import { log } from '../utils/logger';

const router = express.Router();

// POST /api/auth/logout
router.post('/logout', (req: Request, res: Response) => {
    res.json({ message: 'Logged out successfully' });
});

// POST /api/auth/login
router.post('/login', validate(schemas.login), asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await knex('users').where('email', email).first();

    if (!user) {
        throw Errors.unauthorized('Invalid login credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
        throw Errors.unauthorized('Invalid login credentials');
    }

    // Validate JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
        log.error('CRITICAL: JWT_SECRET is not configured!');
        throw Errors.internal('Server configuration error');
    }

    const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: (process.env.JWT_EXPIRES_IN || '24h') as any }
    );

    // Transform user object to match frontend interface
    const userResponse = {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        department: user.department,
        specialty: user.specialty,
        licenseNumber: user.license_number,
        phone: user.phone,
        isActive: user.is_active
    };

    log.info('User logged in', { userId: user.id, email: user.email });
    return res.json({ user: userResponse, token });
}));

// GET /api/auth/profile
router.get('/profile', asyncHandler(async (req: Request, res: Response) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        throw Errors.unauthorized('Authentication required');
    }

    // Validate JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
        log.error('CRITICAL: JWT_SECRET is not configured!');
        throw Errors.internal('Server configuration error');
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        throw Errors.unauthorized('Invalid or expired token');
    }

    const user = await knex('users').where('id', (decoded as any).id).first();

    if (!user) {
        throw Errors.notFound('User');
    }

    // Transform user object to match frontend interface
    const userResponse = {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        department: user.department,
        specialty: user.specialty,
        licenseNumber: user.license_number,
        phone: user.phone,
        isActive: user.is_active
    };

    return res.json(userResponse);
}));

export default router;
