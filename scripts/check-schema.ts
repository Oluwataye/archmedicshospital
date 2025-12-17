
import db from '../src/server/db';

async function checkSchema() {
    try {
        console.log('Checking database schema...');

        // List all tables
        const tables = await db.raw("SELECT name FROM sqlite_master WHERE type='table'");
        console.log('Tables:', tables.map((t: any) => t.name));

        const requiredTables = ['users'];
        const users = await db('users').select('email', 'password_hash').limit(1);
        console.log('Users:', users);

        for (const table of requiredTables) {
            console.log(`\nSchema for ${table}:`);
            try {
                const schema = await db.raw(`PRAGMA table_info(${table})`);
                console.log(schema);
            } catch (e) {
                console.log(`Table ${table} does not exist or error fetching info.`);
            }
        }

    } catch (error) {
        console.error('Error checking schema:', error);
    } finally {
        await db.destroy();
    }
}

checkSchema();
