import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', '..', '..', 'hospital.db');

const db = new Database(dbPath);

try {
    console.log('--- Database Diagnostic ---');

    // 1. List all tables
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all().map(t => t.name);
    console.log('Tables:', tables);
    console.log(`'units' table exists:`, tables.includes('units'));
    console.log(`'wards' table exists:`, tables.includes('wards'));
    console.log(`'revolving_funds' table exists:`, tables.includes('revolving_funds'));

    if (tables.includes('revolving_funds')) {
        // 2. Describe revolving_funds
        console.log('\n--- revolving_funds Schema ---');
        const cols = db.prepare("PRAGMA table_info(revolving_funds)").all();
        console.log(cols);

        // 3. Check Foreign Keys on revolving_funds
        console.log('\n--- revolving_funds Foreign Keys ---');
        const fks = db.prepare("PRAGMA foreign_key_list(revolving_funds)").all();
        console.log(fks);
    }

    // 4. Check Triggers
    console.log('\n--- Triggers ---');
    const triggers = db.prepare("SELECT name, tbl_name, sql FROM sqlite_master WHERE type = 'trigger'").all();
    console.log(triggers);

} catch (error) {
    console.error('Diagnostic Error:', error);
} finally {
    db.close();
}
