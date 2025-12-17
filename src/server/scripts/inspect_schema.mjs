import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', '..', '..', 'hospital.db');

const db = new Database(dbPath);

try {
    console.log('Inspecting revolving_funds table schema...');
    const tableInfo = db.prepare("PRAGMA table_info(revolving_funds)").all();
    console.log(tableInfo);

    const fks = db.prepare("PRAGMA foreign_key_list(revolving_funds)").all();
    console.log('Foreign Keys:', fks);

} catch (error) {
    console.error('Error:', error);
} finally {
    db.close();
}
