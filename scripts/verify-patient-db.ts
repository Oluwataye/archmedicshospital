import knex from '../src/server/db';

async function verifyPatient() {
    try {
        const search = 'James';
        console.log(`Searching for "${search}"...`);

        const patients = await knex('patients')
            .select(
                'patients.id',
                'patients.mrn',
                'patients.first_name',
                'patients.last_name',
                'patients.hmo_provider_id'
            )
            .leftJoin('hmo_providers', 'patients.hmo_provider_id', 'hmo_providers.id')
            .where('patients.mrn', 'like', `%${search}%`)
            .orWhere('patients.first_name', 'like', `%${search}%`)
            .orWhere('patients.last_name', 'like', `%${search}%`)
            .limit(10);

        console.log('Found patients:', patients);

        const allJames = await knex('patients').where('first_name', 'James').select('id', 'first_name', 'last_name');
        console.log('All patients named James:', allJames);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await knex.destroy();
    }
}

verifyPatient();
