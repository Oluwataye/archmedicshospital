
import db from './db';

async function checkSchema() {
    try {
        const columns = await db.raw("PRAGMA table_info(transactions)");
        console.log('Transactions Table Columns:', columns);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit();
    }
}

checkSchema();
