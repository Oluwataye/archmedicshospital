
import db from '../src/server/db';

async function checkPatient(id: string) {
    try {
        const patient = await db('patients').where('id', id).first();
        console.log('Patient:', patient);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

const id = process.argv[2];
if (id) checkPatient(id);
else console.log('Please provide ID');
