import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    // Add new fields to hmo_preauthorizations table for verification
    // SQLite doesn't support adding foreign keys via ALTER TABLE, so we'll add them without FK constraints
    await knex.schema.alterTable('hmo_preauthorizations', (table) => {
        table.timestamp('verified_at').nullable();
        table.uuid('verified_by').nullable(); // FK to users table (not enforced in SQLite)
        table.boolean('is_used').defaultTo(false).notNullable();
        table.string('service_category').nullable(); // 'primary', 'secondary', or 'tertiary'
        table.string('patient_mrn').nullable();
        table.text('verification_notes').nullable();
    });

    // Create indexes for faster lookups
    await knex.schema.raw(`
    CREATE INDEX IF NOT EXISTS idx_hmo_preauth_auth_code ON hmo_preauthorizations(authorization_code);
  `);
    await knex.schema.raw(`
    CREATE INDEX IF NOT EXISTS idx_hmo_preauth_patient_mrn ON hmo_preauthorizations(patient_mrn);
  `);
    await knex.schema.raw(`
    CREATE INDEX IF NOT EXISTS idx_hmo_preauth_is_used ON hmo_preauthorizations(is_used);
  `);

    // Create authorization_verification_logs table for audit trail
    await knex.schema.createTable('authorization_verification_logs', (table) => {
        table.uuid('id').primary();
        table.uuid('authorization_id').nullable(); // FK to hmo_preauthorizations
        table.uuid('patient_id').nullable(); // FK to patients
        table.uuid('verified_by').nullable(); // FK to users
        table.string('authorization_code').notNullable();
        table.string('verification_status').notNullable(); // 'verified', 'rejected', 'expired', 'invalid'
        table.timestamp('verification_date').defaultTo(knex.fn.now()).notNullable();
        table.string('service_category').nullable(); // 'primary', 'secondary', 'tertiary'
        table.text('notes').nullable();
        table.string('verified_by_name').nullable(); // Denormalized for reporting
        table.string('patient_name').nullable(); // Denormalized for reporting
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });

    // Create indexes for filtering and reporting
    await knex.schema.raw(`
    CREATE INDEX IF NOT EXISTS idx_auth_logs_auth_id ON authorization_verification_logs(authorization_id);
  `);
    await knex.schema.raw(`
    CREATE INDEX IF NOT EXISTS idx_auth_logs_patient_id ON authorization_verification_logs(patient_id);
  `);
    await knex.schema.raw(`
    CREATE INDEX IF NOT EXISTS idx_auth_logs_verified_by ON authorization_verification_logs(verified_by);
  `);
    await knex.schema.raw(`
    CREATE INDEX IF NOT EXISTS idx_auth_logs_date ON authorization_verification_logs(verification_date);
  `);
    await knex.schema.raw(`
    CREATE INDEX IF NOT EXISTS idx_auth_logs_status ON authorization_verification_logs(verification_status);
  `);
}

export async function down(knex: Knex): Promise<void> {
    // Drop the verification logs table
    await knex.schema.dropTableIfExists('authorization_verification_logs');

    // Remove added columns from hmo_preauthorizations
    await knex.schema.alterTable('hmo_preauthorizations', (table) => {
        table.dropColumn('verified_at');
        table.dropColumn('verified_by');
        table.dropColumn('is_used');
        table.dropColumn('service_category');
        table.dropColumn('patient_mrn');
        table.dropColumn('verification_notes');
    });
}
