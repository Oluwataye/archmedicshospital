import fs from 'fs';
import path from 'path';
import db from '../db';

const BACKUP_DIR = path.join(process.cwd(), 'backups');

const isProduction = process.env.NODE_ENV === 'production' || !!process.env.NETLIFY;

// Ensure backup directory exists (only in non-production/non-Netlify environments)
if (!isProduction && !process.env.NETLIFY) {
    if (!fs.existsSync(BACKUP_DIR)) {
        try {
            fs.mkdirSync(BACKUP_DIR, { recursive: true });
        } catch (e) {
            console.warn('Auto-backups disabled - could not create backup directory');
        }
    }
}

export const startScheduler = () => {
    console.log('Starting backup scheduler...');

    // Run every hour
    setInterval(async () => {
        try {
            await checkAndRunBackup();
        } catch (error) {
            console.error('Scheduler error:', error);
        }
    }, 60 * 60 * 1000); // 1 hour

    // Run immediately on startup to check if we missed one
    checkAndRunBackup();
};

const checkAndRunBackup = async () => {
    try {
        // Get backup settings
        const setting = await db('settings').where('key', 'backup_frequency').first();
        if (!setting) return;

        const frequency = setting.value; // 'daily', 'weekly', 'monthly'
        if (!frequency) return;

        // Check last backup
        const lastBackupFile = getLastBackupFile();
        if (shouldRunBackup(lastBackupFile, frequency)) {
            console.log(`Running automatic ${frequency} backup...`);
            await performBackup();
        }
    } catch (error) {
        console.error('Error in checkAndRunBackup:', error);
    }
};

const getLastBackupFile = () => {
    const files = fs.readdirSync(BACKUP_DIR)
        .filter(f => f.startsWith('auto_backup_') && f.endsWith('.json'))
        .sort()
        .reverse();
    return files.length > 0 ? files[0] : null;
};

const shouldRunBackup = (lastBackupFile: string | null, frequency: string) => {
    if (!lastBackupFile) return true;

    const lastDateStr = lastBackupFile.replace('auto_backup_', '').replace('.json', '');
    const lastDate = new Date(lastDateStr);
    const now = new Date();
    const diffHours = (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60);

    switch (frequency) {
        case 'daily':
            return diffHours >= 24;
        case 'weekly':
            return diffHours >= 24 * 7;
        case 'monthly':
            return diffHours >= 24 * 30;
        default:
            return false;
    }
};

const performBackup = async () => {
    try {
        const backup = {
            timestamp: new Date().toISOString(),
            type: 'automatic',
            data: {
                users: await db('users').select('*'),
                patients: await db('patients').select('*'),
                appointments: await db('appointments').select('*'),
                medical_records: await db('medical_records').select('*'),
                vital_signs: await db('vital_signs').select('*'),
                lab_results: await db('lab_results').select('*'),
                prescriptions: await db('prescriptions').select('*'),
                hmo_providers: await db('hmo_providers').select('*'),
                inventory_items: await db('inventory_items').select('*'),
                invoices: await db('invoices').select('*'),
                payments: await db('payments').select('*'),
                settings: await db('settings').select('*')
            }
        };

        const filename = `auto_backup_${new Date().toISOString().split('T')[0]}.json`;
        const filepath = path.join(BACKUP_DIR, filename);

        fs.writeFileSync(filepath, JSON.stringify(backup, null, 2));
        console.log(`Backup saved to ${filepath}`);
    } catch (error) {
        console.error('Failed to perform backup:', error);
    }
};
