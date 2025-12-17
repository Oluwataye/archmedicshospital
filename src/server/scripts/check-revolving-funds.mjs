import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', '..', '..', 'hospital.db');

const db = new Database(dbPath);

try {
    console.log('Checking revolving_funds table...\n');

    const tableInfo = db.prepare("PRAGMA table_info(revolving_funds)").all();

    if (tableInfo.length === 0) {
        console.log('❌ revolving_funds table does not exist');
        console.log('Creating table...');

        db.exec(`
      CREATE TABLE revolving_funds (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        fund_name TEXT NOT NULL,
        department_id TEXT REFERENCES departments(id),
        unit_id TEXT REFERENCES wards(id),
        initial_amount REAL NOT NULL DEFAULT 0,
        current_balance REAL NOT NULL DEFAULT 0,
        allocated_date TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'active',
        managed_by TEXT REFERENCES users(id),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

        db.exec(`
      CREATE TABLE revolving_fund_transactions (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        fund_id TEXT NOT NULL REFERENCES revolving_funds(id) ON DELETE CASCADE,
        transaction_type TEXT NOT NULL,
        amount REAL NOT NULL,
        description TEXT,
        reference_number TEXT,
        processed_by TEXT REFERENCES users(id),
        transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

        console.log('✅ Tables created successfully!');
    } else {
        console.log('✓ revolving_funds table exists');
        console.log('\nColumns:');
        tableInfo.forEach(col => {
            console.log(`  - ${col.name} (${col.type})`);
        });

        // Check foreign keys
        const fks = db.prepare("PRAGMA foreign_key_list(revolving_funds)").all();
        console.log('\nForeign Keys:');
        fks.forEach(fk => {
            console.log(`  - ${fk.from} -> ${fk.table}.${fk.to}`);
        });
    }

} catch (error) {
    console.error('Error:', error);
    process.exit(1);
} finally {
    db.close();
}
