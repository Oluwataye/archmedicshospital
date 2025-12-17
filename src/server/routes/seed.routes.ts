import express from 'express';
import crypto from 'crypto';
import knex from '../db';
import { log } from '../utils/logger';

const router = express.Router();

router.post('/hmo-test', async (req, res) => {
    log.info('Seeding HMO Test Data via API');
    try {
        const suffix = Date.now().toString().slice(-4);

        log.debug('Creating HMO Provider');
        // 1. Create Test HMO Provider
        const [hmoProvider] = await knex('hmo_providers').insert({
            id: crypto.randomUUID(),
            name: `UI Test HMO ${suffix}`,
            code: `UI-TEST-${suffix}`,
            is_active: true,
            contact_email: `uitest-${suffix}@hmo.com`,
            contact_phone: `080${suffix}0000`,
            address: 'Test Address',
            coverage_type: 'private'
        }).returning('*');
        log.info('Created HMO Provider', { name: hmoProvider.name });

        log.debug('Creating Patient');
        // 2. Create Test Patient linked to HMO
        const [patient] = await knex('patients').insert({
            first_name: 'James',
            last_name: 'Test',
            mrn: `MRN-UI-TEST-${suffix}`,
            date_of_birth: '1990-01-01',
            gender: 'male',
            phone: `0809${suffix}999`,
            email: `james.test-${suffix}@example.com`,
            hmo_provider_id: hmoProvider.id,
            status: 'active',
            address: 'Test Address'
        }).returning('*');
        log.info('Created Patient', { name: `${patient.first_name} ${patient.last_name}` });

        // Get a user for requested_by
        const user = await knex('users').first();
        if (!user) throw new Error('No users found to assign as requested_by');

        log.debug('Creating Pre-authorization');
        // 3. Create Pre-authorization
        const [preauth] = await knex('hmo_preauthorizations').insert({
            id: crypto.randomUUID(),
            authorization_code: `AUTH-UI-TEST-${suffix}`,
            patient_id: patient.id,
            hmo_provider_id: hmoProvider.id,
            requested_by: user.id,
            request_date: new Date().toISOString(),
            expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
            status: 'approved',
            approval_date: new Date().toISOString(),
            approved_amount: 5000,
            is_used: false,
            notes: 'Seeded for UI Test'
        }).returning('*');
        log.info('Created Pre-authorization', { code: preauth.authorization_code });

        res.json({ success: true, message: 'Seeding successful', hmoProvider, patient, preauth });
    } catch (error) {
        console.error('❌ Seeding Failed at step:', error);
        res.status(500).json({ error: 'Seeding failed', details: error });
    }
});

export default router;
