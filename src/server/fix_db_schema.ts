
import db from './db';

async function fix() {
    try {
        console.log('Creating departments table...');
        // Using raw SQL to match the migration exactly including the specific ID generation
        await db.raw(`
            CREATE TABLE IF NOT EXISTS departments (
              id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
              name TEXT NOT NULL UNIQUE,
              description TEXT,
              head_of_department TEXT,
              is_active INTEGER DEFAULT 1,
              created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Departments table created/verified.');

        console.log('Checking wards table for department_id...');
        const hasColumn = await db.schema.hasColumn('wards', 'department_id');
        if (!hasColumn) {
            console.log('Adding department_id to wards...');
            await db.schema.table('wards', (table) => {
                table.text('department_id').references('id').inTable('departments');
            });
            console.log('Column added.');
        } else {
            console.log('Column already exists.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await db.destroy();
    }
}

fix();
