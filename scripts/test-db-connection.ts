import knex from '../src/server/db';

async function testConnection() {
    console.log('Testing DB Connection...');
    try {
        const result = await knex.raw('SELECT 1+1 as result');
        console.log('✅ Connection successful. Result:', result);

        const tables = await knex.raw("SELECT name FROM sqlite_master WHERE type='table'");
        console.log('Tables:', tables.map((t: any) => t.name));

    } catch (error) {
        console.error('❌ Connection failed:', error);
    } finally {
        await knex.destroy();
    }
}

testConnection();
