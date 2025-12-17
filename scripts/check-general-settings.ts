import knex from '../src/config/database';

async function checkSettings() {
    try {
        console.log('Checking settings table...\n');

        const settings = await knex('settings')
            .select('*')
            .where('category', 'general')
            .orderBy('key');

        console.log('General category settings:');
        console.log('========================');
        settings.forEach(s => {
            console.log(`- ${s.key}: ${s.description}`);
            console.log(`  Value: ${s.value}`);
            console.log(`  Type: ${s.data_type}`);
            console.log('');
        });

        console.log(`\nTotal: ${settings.length} settings in 'general' category`);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkSettings();
