
import db from './db';

async function test() {
    try {
        console.log('Checking tables...');
        const tables = await db.raw("SELECT name FROM sqlite_master WHERE type='table'");
        console.log('Tables:', tables.map((t: any) => t.name));

        console.log('\nChecking departments table...');
        const depts = await db('departments').select('*').limit(1);
        console.log('Departments query result:', depts);

        console.log('\nTesting Wards query...');
        const wards = await db('wards')
            .select(
                'wards.*',
                'departments.name as department_name',
                db.raw('count(beds.id) as total_beds'),
                db.raw('count(CASE WHEN beds.is_occupied = 1 THEN 1 END) as occupied_beds')
            )
            .leftJoin('beds', 'wards.id', 'beds.ward_id')
            .leftJoin('departments', 'wards.department_id', 'departments.id')
            .groupBy('wards.id');
        console.log('Wards query successful. Count:', wards.length);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await db.destroy();
    }
}

test();
