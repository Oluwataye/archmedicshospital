
// Migration script to add cashier features tables
import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    // Patient Deposits table
    await knex.schema.createTable('patient_deposits', (table) => {
        table.string('id').primary().defaultTo(knex.raw("(lower(hex(randomblob(16))))"));
        table.string('patient_id').notNullable().references('id').inTable('patients').onDelete('CASCADE');
        table.decimal('amount', 10, 2).notNullable();
        table.enum('payment_method', ['cash', 'card', 'transfer', 'bank_transfer']).notNullable();
        table.enum('transaction_type', ['deposit', 'deduction', 'refund']).notNullable().defaultTo('deposit');
        table.string('reference_number').unique();
        table.text('description');
        table.string('processed_by').notNullable().references('id').inTable('users');
        table.enum('status', ['pending', 'completed', 'cancelled']).notNullable().defaultTo('completed');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());

        table.index('patient_id');
        table.index('created_at');
        table.index('status');
    });

    // Patient Wallets table
    await knex.schema.createTable('patient_wallets', (table) => {
        table.string('id').primary().defaultTo(knex.raw("(lower(hex(randomblob(16))))"));
        table.string('patient_id').notNullable().unique().references('id').inTable('patients').onDelete('CASCADE');
        table.decimal('balance', 10, 2).notNullable().defaultTo(0.00);
        table.string('last_transaction_id').references('id').inTable('patient_deposits');
        table.timestamp('last_updated').defaultTo(knex.fn.now());
        table.timestamp('created_at').defaultTo(knex.fn.now());

        table.index('patient_id');
    });

    // Sales Tracking table
    await knex.schema.createTable('sales_tracking', (table) => {
        table.string('id').primary().defaultTo(knex.raw("(lower(hex(randomblob(16))))"));
        table.date('transaction_date').notNullable();
        table.string('department_id').references('id').inTable('departments');
        table.string('unit_id').references('id').inTable('units');
        table.string('payment_id').references('id').inTable('payments');
        table.string('invoice_id').references('id').inTable('invoices');
        table.decimal('amount', 10, 2).notNullable();
        table.string('payment_method');
        table.string('cashier_id').notNullable().references('id').inTable('users');
        table.timestamp('created_at').defaultTo(knex.fn.now());

        table.index('transaction_date');
        table.index('department_id');
        table.index('unit_id');
        table.index('cashier_id');
    });

    console.log('✅ Cashier features tables created successfully');
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('sales_tracking');
    await knex.schema.dropTableIfExists('patient_wallets');
    await knex.schema.dropTableIfExists('patient_deposits');

    console.log('✅ Cashier features tables dropped successfully');
}
