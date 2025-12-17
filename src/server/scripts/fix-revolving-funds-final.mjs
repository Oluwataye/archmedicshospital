import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', '..', '..', 'hospital.db');

const db = new Database(dbPath);

try {
    console.log('Recreating revolving_funds tables without foreign key constraints...\n');

    // Backup existing data
    let funds = [];
    let transactions = [];

    try {
        funds = db.prepare('SELECT * FROM revolving_funds').all();
        transactions = db.prepare('SELECT * FROM revolving_fund_transactions').all();
        console.log(`Backed up ${funds.length} funds and ${transactions.length} transactions`);
    } catch (e) {
        console.log('No existing data to backup');
    }

    // Drop tables
    db.exec('DROP TABLE IF EXISTS revolving_fund_transactions');
    db.exec('DROP TABLE IF EXISTS revolving_funds');
    console.log('✓ Dropped old tables');

    // Recreate without FK constraints (SQLite doesn't enforce them by default anyway)
    db.exec(`
    CREATE TABLE revolving_funds (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      fund_name TEXT NOT NULL,
      department_id TEXT,
      unit_id TEXT,
      initial_amount REAL NOT NULL DEFAULT 0,
      current_balance REAL NOT NULL DEFAULT 0,
      allocated_date TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      managed_by TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    db.exec(`
    CREATE TABLE revolving_fund_transactions (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      fund_id TEXT NOT NULL,
      transaction_type TEXT NOT NULL,
      amount REAL NOT NULL,
      description TEXT,
      reference_number TEXT,
      processed_by TEXT,
      transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    console.log('✓ Created new tables without FK constraints');

    // Restore data
    if (funds.length > 0) {
        const insertFund = db.prepare(`
      INSERT INTO revolving_funds (id, fund_name, department_id, unit_id, initial_amount, current_balance, allocated_date, status, managed_by, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

        for (const fund of funds) {
            insertFund.run(
                fund.id, fund.fund_name, fund.department_id, fund.unit_id,
                fund.initial_amount, fund.current_balance, fund.allocated_date,
                fund.status, fund.managed_by, fund.created_at, fund.updated_at
            );
        }
        console.log(`✓ Restored ${funds.length} funds`);
    }

    if (transactions.length > 0) {
        const insertTx = db.prepare(`
      INSERT INTO revolving_fund_transactions (id, fund_id, transaction_type, amount, description, reference_number, processed_by, transaction_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

        for (const tx of transactions) {
            insertTx.run(
                tx.id, tx.fund_id, tx.transaction_type, tx.amount,
                tx.description, tx.reference_number, tx.processed_by, tx.transaction_date
            );
        }
        console.log(`✓ Restored ${transactions.length} transactions`);
    }

    console.log('\n✅ Successfully recreated tables!');

} catch (error) {
    console.error('Error:', error);
    process.exit(1);
} finally {
    db.close();
}
