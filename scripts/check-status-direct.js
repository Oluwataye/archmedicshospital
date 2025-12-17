
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../data/archmedics_hms.db');
const db = new Database(dbPath);
// Wait, I should check valid DB path first.

try {
    const row = db.prepare("SELECT * FROM patients WHERE id = ?").get('edcc3d2d-cd6b-4685-b10b-88ef41edf0c0');
    console.log('PATIENT_DATA:', JSON.stringify(row, null, 2));
} catch (e) {
    console.error(e);
}
