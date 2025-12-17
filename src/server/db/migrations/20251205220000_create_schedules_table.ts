
import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    // Schedules Table
    await knex.schema.createTable('schedules', (table) => {
        table.uuid('id').primary().defaultTo(knex.fn.uuid());
        table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
        table.uuid('department_id').nullable().references('id').inTable('departments');
        table.uuid('unit_id').nullable().references('id').inTable('units');
        table.dateTime('start_time').notNullable();
        table.dateTime('end_time').notNullable();
        table.string('shift_type').notNullable(); // Morning, Afternoon, Night
        table.string('status').notNullable().defaultTo('Scheduled'); // Scheduled, Completed, Missed
        table.string('notes').nullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('schedules');
}
