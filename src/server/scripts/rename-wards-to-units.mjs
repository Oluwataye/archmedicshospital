import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', '..', '..', 'hospital.db');

const db = new Database(dbPath);

try {
    console.log('Checking current database tables...\n');

    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all();
    console.log('Existing tables:');
    tables.forEach(t => console.log(`  - ${t.name}`));

    // Check if wards table exists
    const wardsExists = tables.some(t => t.name === 'wards');
    const unitsExists = tables.some(t => t.name === 'units');

    console.log(`\nwards table exists: ${wardsExists}`);
    console.log(`units table exists: ${unitsExists}`);

    if (wardsExists && !unitsExists) {
        console.log('\n✓ Found wards table, will rename to units');

        db.exec('ALTER TABLE wards RENAME TO units;');
        console.log('✓ Renamed wards to units');

        db.exec('ALTER TABLE beds RENAME COLUMN ward_id TO unit_id;');
        console.log('✓ Renamed beds.ward_id to beds.unit_id');

        db.exec('ALTER TABLE admissions RENAME COLUMN ward_id TO unit_id;');
        console.log('✓ Renamed admissions.ward_id to admissions.unit_id');

        console.log('\n✅ Database schema updated successfully!');
    } else if (unitsExists) {
        console.log('\n✓ units table already exists, no changes needed');
    } else {
        console.log('\n⚠️  Neither wards nor units table exists!');
        console.log('Creating units table from scratch...');

        db.exec(`
      CREATE TABLE IF NOT EXISTS units (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        name TEXT NOT NULL,
        type TEXT,
        capacity INTEGER,
        gender TEXT,
        description TEXT,
        department_id TEXT REFERENCES departments(id),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('✓ Created units table');
    }

} catch (error) {
    console.error('Error:', error);
    process.exit(1);
} finally {
    db.close();
}
