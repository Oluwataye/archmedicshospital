import express from 'express';
import { auth, authorize } from '../middleware/auth';
import db from '../db';

const router = express.Router();

// Create audit log (e.g. for reprint)
router.post('/log', auth, async (req, res) => {
    try {
        const { action, resource_type, resource_id, details } = req.body;
        const userId = (req as any).user.id;

        await db('audit_logs').insert({
            user_id: userId,
            action,
            resource_type,
            resource_id,
            new_values: details ? JSON.stringify(details) : null,
            ip_address: req.ip,
            user_agent: req.headers['user-agent'],
            created_at: new Date()
        });

        res.json({ message: 'Log recorded' });
    } catch (error) {
        console.error('Error recording audit log:', error);
        res.status(500).json({ error: 'Failed to record log' });
    }
});

// Get audit logs (Admin only)
router.get('/', auth, authorize(['admin']), async (req, res) => {
    try {
        const { page = 1, limit = 50, user_id, action, resource_type, start_date, end_date } = req.query;
        const offset = (Number(page) - 1) * Number(limit);

        let query = db('audit_logs')
            .leftJoin('users', 'audit_logs.user_id', 'users.id')
            .select(
                'audit_logs.*',
                'users.username',
                'users.first_name as firstName',
                'users.last_name as lastName'
            )
            .orderBy('audit_logs.created_at', 'desc');

        if (user_id) {
            query = query.where('audit_logs.user_id', user_id as string);
        }

        if (action) {
            query = query.where('audit_logs.action', 'like', `%${action}%`);
        }

        if (resource_type) {
            query = query.where('audit_logs.resource_type', resource_type as string);
        }

        if (start_date) {
            query = query.where('audit_logs.created_at', '>=', start_date as string);
        }

        if (end_date) {
            query = query.where('audit_logs.created_at', '<=', end_date as string);
        }

        // Get total count for pagination
        const countQuery = db('audit_logs');
        if (user_id) countQuery.where('user_id', user_id as string);
        if (action) countQuery.where('action', 'like', `%${action}%`);
        if (resource_type) countQuery.where('resource_type', resource_type as string);
        if (start_date) countQuery.where('created_at', '>=', start_date as string);
        if (end_date) countQuery.where('created_at', '<=', end_date as string);

        const totalResult = await countQuery.count('id as count').first();
        const total = totalResult?.count || 0;

        const logs = await query.limit(Number(limit)).offset(offset);

        res.json({
            data: logs,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(Number(total) / Number(limit))
            }
        });
    } catch (error) {
        console.error('Error fetching audit logs:', error);
        res.status(500).json({ error: 'Failed to fetch audit logs' });
    }
});

export default router;
