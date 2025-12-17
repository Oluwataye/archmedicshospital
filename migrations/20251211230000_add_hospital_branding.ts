import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    // Create hospital_settings table
    await knex.schema.createTable('hospital_settings', (table) => {
        table.increments('id').primary();
        table.string('hospital_name', 255).notNullable();
        table.string('hospital_abbreviation', 3).notNullable();
        table.text('address');
        table.string('phone', 20);
        table.string('email', 255);
        table.text('logo_url');
        table.datetime('created_at').defaultTo(knex.fn.now());
        table.datetime('updated_at').defaultTo(knex.fn.now());
    });

    // Create patient_id_sequence table for atomic sequence generation
    await knex.schema.createTable('patient_id_sequence', (table) => {
        table.integer('year').primary();
        table.integer('last_sequence').defaultTo(0).notNullable();
        table.datetime('created_at').defaultTo(knex.fn.now());
        table.datetime('updated_at').defaultTo(knex.fn.now());
    });

    // Add old_mrn column to patients table for migration tracking
    await knex.schema.table('patients', (table) => {
        table.string('old_mrn', 100).nullable().comment('Previous MRN for existing patients during re-registration');
    });

    // Insert default hospital settings
    await knex('hospital_settings').insert({
        hospital_name: 'Archmedics Hospital',
        hospital_abbreviation: 'ARC',
        address: '123 Medical Center Drive, Lagos, Nigeria',
        phone: '+234-XXX-XXX-XXXX',
        email: 'info@archmedics.com'
    });

    // Initialize sequence for current year
    const currentYear = new Date().getFullYear() % 100; // Last 2 digits
    await knex('patient_id_sequence').insert({
        year: currentYear,
        last_sequence: 0
    });
}

export async function down(knex: Knex): Promise<void> {
    // Remove old_mrn column from patients
    await knex.schema.table('patients', (table) => {
        table.dropColumn('old_mrn');
    });

    // Drop tables in reverse order
    await knex.schema.dropTableIfExists('patient_id_sequence');
    await knex.schema.dropTableIfExists('hospital_settings');
}
