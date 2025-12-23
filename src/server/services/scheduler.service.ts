import fs from 'fs';
import path from 'path';
import db from '../db';
import { log } from '../utils/logger';

const BACKUP_DIR = path.join(process.cwd(), 'backups');

// Backup directory handled externally or via cloud storage

export const startScheduler = () => {
    log.info('Starting backup scheduler...');

    // Run every hour - using a more controlled interval
    const interval = setInterval(async () => {
        try {
            await checkAndRunBackup();
        } catch (error) {
            log.error('Scheduler error:', error);
        }
    }, 60 * 60 * 1000); // 1 hour

    // Run immediately on startup
    checkAndRunBackup().catch(err => log.error('Initial backup check failed', err));

    return interval;
};

/**
 * Checks if a backup is due and runs it if necessary.
 * Decoupled to allow triggering from cloud crons or manual requests.
 */
export const checkAndRunBackup = async () => {
    try {
        const setting = await db('settings').where('key', 'backup_frequency').first();
        if (!setting || !setting.value) {
            log.info('Backup frequency not set, skipping automatic backup.');
            return;
        }

        const frequency = setting.value; // 'daily', 'weekly', 'monthly'
        const lastBackupFile = getLastBackupFile();

        if (shouldRunBackup(lastBackupFile, frequency)) {
            log.info(`Running automatic ${frequency} backup...`);
            return await performBackup();
        }
    } catch (error) {
        log.error('Error in checkAndRunBackup:', error);
        throw error;
    }
};

const getLastBackupFile = () => {
    if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
        return null;
    }
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
