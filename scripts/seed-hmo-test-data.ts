import knex from '../src/server/db';
import { v4 as uuidv4 } from 'uuid';

async function seedTestData() {
    console.log('Seeding HMO Test Data...');

    try {
        // 1. Create Test HMO Provider
        const [hmoProvider] = await knex('hmo_providers').insert({
            id: uuidv4(),
            name: 'UI Test HMO',
            code: 'UI-TEST',
            is_active: true,
            email: 'uitest@hmo.com',
            phone: '08000000000',
            address: 'Test Address',
            type: 'private'
        }).returning('*');
        console.log('✅ Created HMO Provider:', hmoProvider.name);

        // 2. Create Test Patient linked to HMO
        const [patient] = await knex('patients').insert({
            first_name: 'James',
            last_name: 'Test',
            mrn: 'MRN-UI-TEST',
            date_of_birth: '1990-01-01',
            gender: 'male',
            phone: '08099999999',
            email: 'james.test@example.com',
            hmo_provider_id: hmoProvider.id,
            status: 'active',
            address: 'Test Address'
        }).returning('*');
        console.log('✅ Created Patient:', patient.first_name, patient.last_name);

    } catch (error) {
        console.error('❌ Seeding Failed:', error);
    } finally {
        await knex.destroy();
    }
}

seedTestData();
