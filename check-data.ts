import db from './src/server/db.ts';

async function checkData() {
    try {
        const records = await db('medical_records').select('content').limit(5);
        console.log("Record content samples:");
        records.forEach((r, i) => {
            console.log(`Record ${i}:`, r.content);
        });
        process.exit(0);
    } catch (error) {
        console.error("Data check failed!");
        console.error(error);
        process.exit(1);
    }
}

checkData();
