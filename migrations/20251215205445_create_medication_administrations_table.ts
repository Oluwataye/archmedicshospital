import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('medication_administrations', function (table) {
        table.uuid('id').primary();
        table.uuid('prescription_id').notNullable(); // No foreign key to avoid complexity if prescription deleted/archived, or link looser
        table.uuid('patient_id').notNullable().references('id').inTable('patients').onDelete('CASCADE');
        table.uuid('administered_by').notNullable().references('id').inTable('users');
        table.timestamp('administered_at').defaultTo(knex.fn.now());
        table.enum('status', ['Administered', 'Missed', 'Refused', 'Held']).defaultTo('Administered');
        table.text('notes');
        table.text('pain_score');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('medication_administrations');
}

