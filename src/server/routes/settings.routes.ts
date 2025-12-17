import express from 'express';
import { auth, authorize } from '../middleware/auth';
import db from '../db';

const router = express.Router();

// Get all settings or by category (Admin only)
router.get('/', auth, authorize(['admin']), async (req, res) => {
    try {
        const { category } = req.query;
        let query = db('settings').select('*');

        if (category) {
            query = query.where('category', category as string);
        }

        const settings = await query;
        res.json(settings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

// Get single setting by key (Admin only)
router.get('/:key', auth, authorize(['admin']), async (req, res) => {
    try {
        const setting = await db('settings')
            .where('key', req.params.key)
            .first();

        if (!setting) {
            return res.status(404).json({ error: 'Setting not found' });
        }

        res.json(setting);
    } catch (error) {
        console.error('Error fetching setting:', error);
        res.status(500).json({ error: 'Failed to fetch setting' });
    }
});

// Update setting (Admin only)
router.put('/:key', auth, authorize(['admin']), async (req, res) => {
    try {
        const { value } = req.body;

        const updated = await db('settings')
            .where('key', req.params.key)
            .update({
                value,
                updated_at: db.fn.now()
            });

        if (!updated) {
            return res.status(404).json({ error: 'Setting not found' });
        }

        const setting = await db('settings')
            .where('key', req.params.key)
            .first();

        res.json(setting);
    } catch (error) {
        console.error('Error updating setting:', error);
        res.status(500).json({ error: 'Failed to update setting' });
    }
});

// Bulk update settings (Admin only)
router.post('/bulk-update', auth, authorize(['admin']), async (req, res) => {
    try {
        const { settings } = req.body;

        if (!Array.isArray(settings)) {
            return res.status(400).json({ error: 'Settings must be an array' });
        }

        // Update each setting
        for (const setting of settings) {
            await db('settings')
                .where('key', setting.key)
                .update({
                    value: setting.value,
                    updated_at: db.fn.now()
                });
        }

        res.json({ message: 'Settings updated successfully' });
    } catch (error) {
        console.error('Error bulk updating settings:', error);
        res.status(500).json({ error: 'Failed to update settings' });
    }
});

export default router;
