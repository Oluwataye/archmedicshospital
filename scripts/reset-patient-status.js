
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../data/archmedics_hms.db');
const db = new Database(dbPath);

try {
    const info = db.prepare("UPDATE patients SET status = 'pending_payment' WHERE id = ?").run('edcc3d2d-cd6b-4685-b10b-88ef41edf0c0');
    console.log('Update info:', info);
} catch (e) {
    console.error(e);
}
