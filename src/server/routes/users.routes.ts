import express from 'express';
import { auth, authorize } from '../middleware/auth.ts';
import db from '../db.ts';

const router = express.Router();

// Get all users (Admin only)
router.get('/', auth, authorize(['admin']), async (req, res) => {
    try {
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
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Get doctors list (Accessible by authenticated users)
router.get('/doctors/list', auth, async (req, res) => {
    try {
        const doctors = await db('users')
            .where('role', 'doctor')
            .where('is_active', true)
            .select('id', 'first_name', 'last_name', 'specialty', 'department');
        res.json(doctors);
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ error: 'Failed to fetch doctors' });
    }
});

// Get user stats overview (Admin only)
router.get('/stats/overview', auth, authorize(['admin']), async (req, res) => {
    try {
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
    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({ error: 'Failed to fetch user stats' });
    }
});

// Get single user
router.get('/:id', auth, authorize(['admin']), async (req, res) => {
    try {
        const user = await db('users')
            .where('id', req.params.id)
            .select('id', 'username', 'email', 'first_name', 'last_name', 'role', 'department', 'specialty', 'license_number', 'phone', 'is_active', 'created_at')
            .first();

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// Update user (Admin only)
router.put('/:id', auth, authorize(['admin']), async (req, res) => {
    try {
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

        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// Deactivate user (Admin only)
router.delete('/:id', auth, authorize(['admin']), async (req, res) => {
    try {
        await db('users').where('id', req.params.id).update({
            is_active: false,
            updated_at: db.fn.now()
        });
        res.json({ message: 'User deactivated successfully' });
    } catch (error) {
        console.error('Error deactivating user:', error);
        res.status(500).json({ error: 'Failed to deactivate user' });
    }
});

export default router;
