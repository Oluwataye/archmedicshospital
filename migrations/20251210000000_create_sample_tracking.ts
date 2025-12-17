import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('lab_samples', (table) => {
        table.uuid('id').primary().defaultTo(knex.fn.uuid());
        table.integer('patient_id').references('id').inTable('patients').onDelete('CASCADE');
        table.integer('test_id').references('id').inTable('lab_results').onDelete('SET NULL');
        table.string('sample_type').notNullable(); // e.g., Blood, Urine, Swab
        table.string('barcode').notNullable().unique();
        table.dateTime('collection_date').notNullable();
        table.integer('collected_by').references('id').inTable('users');
        table.string('status').notNullable().defaultTo('collected'); // collected, received, processing, completed, rejected
        table.text('notes');
        table.text('rejection_reason');
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('lab_samples');
}
