
import knex from 'knex';
import config from './knexfile.js';

// @ts-ignore
const db = knex(config.development);

async function testComp() {
    try {
        console.log('Fetching prescriptions...');
        const prescriptions = await db('prescriptions')
            .join('patients', 'prescriptions.patient_id', 'patients.id')
            .where('prescriptions.status', 'active')
            .select(
                'prescriptions.*',
                'patients.first_name as patient_first_name',
                'patients.last_name as patient_last_name',
                'patients.mrn'
            );

        console.log(`Found ${prescriptions.length} prescriptions.`);
        if (prescriptions.length > 0) {
            console.log('Sample prescription keys:', Object.keys(prescriptions[0]));
            console.log('Sample prescription:', prescriptions[0]);
            try {
                const meds = JSON.parse(prescriptions[0].medications || '[]');
                console.log('Parsed meds:', meds);
            } catch (e) {
                console.error('JSON Parse Error on:', prescriptions[0].medications);
            }
            if (!prescriptions[0].frequency) {
                console.log('WARNING: frequency field is missing or null');
            }
        } else {
            // Check if any prescriptions exist at all
            const allPrescriptions = await db('prescriptions').select('*').limit(1);
            console.log('Any prescriptions?', allPrescriptions);
        }

    } catch (error) {
        console.error('DB Error:', error);
    } finally {
        await db.destroy();
    }
}

testComp();
