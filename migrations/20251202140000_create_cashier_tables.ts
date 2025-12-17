import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    // Create payments table
    await knex.schema.createTable('payments', (table) => {
        table.increments('id').primary();
        table.integer('patient_id').notNullable();
        table.integer('invoice_id').nullable();
        table.decimal('amount', 10, 2).notNullable();
        table.string('payment_method', 50).nullable();
        table.datetime('payment_date').defaultTo(knex.fn.now());
        table.integer('cashier_id').nullable();
        table.string('status', 20).defaultTo('completed');
        table.string('reference_number', 100).nullable();
        table.text('notes').nullable();
        table.datetime('created_at').defaultTo(knex.fn.now());
        table.datetime('updated_at').defaultTo(knex.fn.now());

        table.foreign('patient_id').references('patients.id');
        table.foreign('cashier_id').references('users.id');
        table.foreign('invoice_id').references('invoices.id');
    });

    // Create invoices table
    await knex.schema.createTable('invoices', (table) => {
        table.increments('id').primary();
        table.integer('patient_id').notNullable();
        table.string('invoice_number', 50).unique().notNullable();
        table.decimal('total_amount', 10, 2).notNullable();
        table.decimal('discount_amount', 10, 2).defaultTo(0);
        table.decimal('tax_amount', 10, 2).defaultTo(0);
        table.decimal('net_amount', 10, 2).notNullable();
        table.string('status', 20).defaultTo('pending');
        table.integer('created_by').nullable();
        table.datetime('created_at').defaultTo(knex.fn.now());
        table.datetime('updated_at').defaultTo(knex.fn.now());

        table.foreign('patient_id').references('patients.id');
        table.foreign('created_by').references('users.id');
    });

    // Create invoice_items table
    await knex.schema.createTable('invoice_items', (table) => {
        table.increments('id').primary();
        table.integer('invoice_id').notNullable();
        table.string('service_type', 50).nullable();
        table.integer('service_id').nullable();
        table.text('description').nullable();
        table.integer('quantity').defaultTo(1);
        table.decimal('unit_price', 10, 2).notNullable();
        table.decimal('total_price', 10, 2).notNullable();
        table.datetime('created_at').defaultTo(knex.fn.now());

        table.foreign('invoice_id').references('invoices.id').onDelete('CASCADE');
    });

    // Create refunds table
    await knex.schema.createTable('refunds', (table) => {
        table.increments('id').primary();
        table.integer('payment_id').notNullable();
        table.decimal('amount', 10, 2).notNullable();
        table.text('reason').nullable();
        table.integer('approved_by').nullable();
        table.string('status', 20).defaultTo('pending');
        table.datetime('refund_date').nullable();
        table.datetime('created_at').defaultTo(knex.fn.now());
        table.datetime('updated_at').defaultTo(knex.fn.now());

        table.foreign('payment_id').references('payments.id');
        table.foreign('approved_by').references('users.id');
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('refunds');
    await knex.schema.dropTableIfExists('invoice_items');
    await knex.schema.dropTableIfExists('invoices');
    await knex.schema.dropTableIfExists('payments');
}
