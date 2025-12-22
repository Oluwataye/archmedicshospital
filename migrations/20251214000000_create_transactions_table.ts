
import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    const hasTransactions = await knex.schema.hasTable('transactions');
    if (!hasTransactions) {
        await knex.schema.createTable('transactions', (table) => {
            table.increments('id').primary();
            table.datetime('transaction_date').defaultTo(knex.fn.now());
            table.decimal('total_amount', 10, 2).notNullable();
            table.string('payment_method', 50).notNullable();
            table.uuid('cashier_id').references('id').inTable('users');
            table.uuid('patient_id').references('id').inTable('patients'); // Could be text for existing patients, but usually int/uuid
            table.string('invoice_number', 50);
            table.string('status', 20).defaultTo('completed'); // completed, voided, etc.
            table.boolean('voided').defaultTo(false);
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());

            table.index(['transaction_date']);
        });
    }
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('transactions');
}

