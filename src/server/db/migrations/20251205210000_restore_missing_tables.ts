
import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    // Services Table
    if (!(await knex.schema.hasTable('services'))) {
        await knex.schema.createTable('services', (table) => {
            table.increments('id').primary();
            table.string('name').notNullable();
            table.text('description');
            table.string('category').notNullable();
            table.string('department');
            table.decimal('base_price', 10, 2).notNullable();
            table.decimal('tax_rate', 5, 2).defaultTo(0);
            table.boolean('hmo_covered').defaultTo(false);
            table.decimal('hmo_price', 10, 2);
            table.integer('duration_minutes');
            table.boolean('is_active').defaultTo(true);
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        });
        console.log('Created services table');
    }

    // Service Categories Table
    if (!(await knex.schema.hasTable('service_categories'))) {
        await knex.schema.createTable('service_categories', (table) => {
            table.increments('id').primary();
            table.string('name').notNullable().unique();
            table.text('description');
            table.boolean('is_active').defaultTo(true);
        });
        console.log('Created service_categories table');
    }

    // Transactions Table
    if (!(await knex.schema.hasTable('transactions'))) {
        await knex.schema.createTable('transactions', (table) => {
            table.string('id').primary().defaultTo(knex.raw("(lower(hex(randomblob(16))))"));
            table.timestamp('transaction_date').defaultTo(knex.fn.now());
            table.string('patient_id').references('id').inTable('patients');
            table.string('cashier_id').references('id').inTable('users');
            table.decimal('total_amount', 10, 2).notNullable();
            table.string('payment_method').notNullable(); // 'cash', 'card', 'transfer', 'split'
            table.string('payment_status').defaultTo('pending'); // 'pending', 'completed', 'failed'
            table.string('reference_number');
            table.boolean('voided').defaultTo(false);
            table.string('void_reason');
            table.string('voided_by').references('id').inTable('users');
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        });
        console.log('Created transactions table');
    }

    // Transaction Items Table
    if (!(await knex.schema.hasTable('transaction_items'))) {
        await knex.schema.createTable('transaction_items', (table) => {
            table.string('id').primary().defaultTo(knex.raw("(lower(hex(randomblob(16))))"));
            table.string('transaction_id').notNullable().references('id').inTable('transactions').onDelete('CASCADE');
            table.integer('service_id').references('id').inTable('services');
            table.string('service_name').notNullable(); // Snapshot of name
            table.decimal('unit_price', 10, 2).notNullable();
            table.integer('quantity').notNullable().defaultTo(1);
            table.decimal('total_price', 10, 2).notNullable();
            table.string('type').defaultTo('service'); // 'service', 'drug', 'registration', etc.
        });
        console.log('Created transaction_items table');
    }

    // Refunds Table
    if (!(await knex.schema.hasTable('refunds'))) {
        await knex.schema.createTable('refunds', (table) => {
            table.string('id').primary().defaultTo(knex.raw("(lower(hex(randomblob(16))))"));
            table.string('transaction_id').notNullable().references('id').inTable('transactions');
            table.decimal('amount', 10, 2).notNullable();
            table.string('reason').notNullable();
            table.string('status').defaultTo('pending'); // 'pending', 'approved', 'rejected'
            table.string('requested_by').references('id').inTable('users');
            table.string('processed_by').references('id').inTable('users');
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        });
        console.log('Created refunds table');
    }
}

export async function down(knex: Knex): Promise<void> {
    // We won't drop tables in down migrations generally to preserve data, 
    // or we can drop them if we want a clean rollback.
    // access to drop checking existence is redundant here.
}
