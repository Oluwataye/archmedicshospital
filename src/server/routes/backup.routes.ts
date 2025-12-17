import express from 'express';
import { auth, authorize } from '../middleware/auth';
import db from '../db';

const router = express.Router();

// Helper to convert array of objects to CSV
const convertToCSV = (data: any[]) => {
    if (!data || data.length === 0) return '';
    const header = Object.keys(data[0]).join(',');
    const rows = data.map(obj => Object.values(obj).map(val =>
        typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
    ).join(','));
    return [header, ...rows].join('\n');
};

// Full System Backup (JSON)
router.get('/full', auth, authorize(['admin']), async (req, res) => {
    try {
        const backup = {
            timestamp: new Date().toISOString(),
            users: await db('users').select('*'),
            patients: await db('patients').select('*'),
            appointments: await db('appointments').select('*'),
            medical_records: await db('medical_records').select('*'),
            vital_signs: await db('vital_signs').select('*'),
            lab_results: await db('lab_results').select('*'),
            prescriptions: await db('prescriptions').select('*'),
            hmo_providers: await db('hmo_providers').select('*'),
            inventory: await db('inventory').select('*'),
            invoices: await db('invoices').select('*'),
            payments: await db('payments').select('*'),
            settings: await db('settings').select('*')
        };

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename=archmedics_backup_${new Date().toISOString().split('T')[0]}.json`);
        res.json(backup);
    } catch (error) {
        console.error('Error creating full backup:', error);
        res.status(500).json({ error: 'Failed to create backup' });
    }
});

// CSV Export for specific tables
router.get('/csv/:type', auth, authorize(['admin']), async (req, res) => {
    try {
        const { type } = req.params;
        let data = [];
        let filename = `${type}_export_${new Date().toISOString().split('T')[0]}.csv`;

        switch (type) {
            case 'patients':
                data = await db('patients').select('*');
                break;
            case 'users':
                data = await db('users').select('id', 'username', 'email', 'first_name', 'last_name', 'role', 'department', 'is_active', 'created_at');
                break;
            case 'inventory':
                data = await db('inventory').select('*');
                break;
            case 'transactions':
                data = await db('payments')
                    .join('invoices', 'payments.invoice_id', 'invoices.id')
                    .select('payments.*', 'invoices.patient_id', 'invoices.total_amount as invoice_amount');
                break;
            case 'appointments':
                data = await db('appointments').select('*');
                break;
            default:
                return res.status(400).json({ error: 'Invalid export type' });
        }

        const csv = convertToCSV(data);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.send(csv);
    } catch (error) {
        console.error('Error exporting CSV:', error);
        res.status(500).json({ error: 'Failed to export CSV' });
    }
});

// List automatic backups
router.get('/list', auth, authorize(['admin']), async (req, res) => {
    try {
        const fs = require('fs');
        const path = require('path');
        const BACKUP_DIR = path.join(process.cwd(), 'backups');

        if (!fs.existsSync(BACKUP_DIR)) {
            return res.json([]);
        }

        const files = fs.readdirSync(BACKUP_DIR)
            .filter((f: string) => f.startsWith('auto_backup_') && f.endsWith('.json'))
            .map((f: string) => {
                const stats = fs.statSync(path.join(BACKUP_DIR, f));
                return {
                    filename: f,
                    date: stats.mtime,
                    size: stats.size
                };
            })
            .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

        res.json(files);
    } catch (error) {
        console.error('Error listing backups:', error);
        res.status(500).json({ error: 'Failed to list backups' });
    }
});

// Download specific backup file
router.get('/download/:filename', auth, authorize(['admin']), async (req, res) => {
    try {
        const { filename } = req.params;
        const path = require('path');
        const BACKUP_DIR = path.join(process.cwd(), 'backups');
        const filepath = path.join(BACKUP_DIR, filename);

        // Security check: prevent directory traversal
        if (!filename.startsWith('auto_backup_') || !filename.endsWith('.json') || filename.includes('..')) {
            return res.status(400).json({ error: 'Invalid filename' });
        }

        if (!require('fs').existsSync(filepath)) {
            return res.status(404).json({ error: 'File not found' });
        }

        res.download(filepath);
    } catch (error) {
        console.error('Error downloading backup:', error);
        res.status(500).json({ error: 'Failed to download backup' });
    }
});

export default router;
