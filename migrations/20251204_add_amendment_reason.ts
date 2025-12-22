import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    // Add amendment_reason column to medical_records table
    await knex.schema.alterTable('medical_records', (table) => {
        table.text('amendment_reason').nullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    // Remove amendment_reason column
    await knex.schema.alterTable('medical_records', (table) => {
        table.dropColumn('amendment_reason');
    });
}

