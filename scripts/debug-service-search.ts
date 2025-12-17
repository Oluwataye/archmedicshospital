
import db from '../src/server/db';

async function debugSearch() {
    try {
        console.log('Searching for services matching "medical fitness"...');
        const services = await db('services')
            .where('name', 'like', '%Medical Fitness%')
            .orWhere('name', 'like', '%medical fitness%')
            .orWhere('name', 'like', '%medi%')
            .select('id', 'name', 'department', 'category', 'is_active');

        console.log(`Found ${services.length} services matching "medi" or "Medical Fitness":`);
        services.forEach(s => {
            console.log(JSON.stringify(s, null, 2));
        });

        const depts = await db('services').distinct('department');
        console.log('Available Departments:', depts.map(d => d.department));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit();
    }
}

debugSearch();
