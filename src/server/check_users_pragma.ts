import db from './db';

async function checkUsersColumns() {
    try {
        console.log('Checking users table columns...');
        const result = await db.raw("PRAGMA table_info(users)");
        console.log(JSON.stringify(result, null, 2));
    } catch (error: any) {
        console.error('ERROR:', error.message);
    } finally {
        process.exit();
    }
}

checkUsersColumns();
