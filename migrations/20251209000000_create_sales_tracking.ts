import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable('sales_tracking');
    if (!hasTable) {
        await knex.schema.createTable('sales_tracking', (table) => {
            table.increments('id').primary();
            table.string('transaction_date').notNullable(); // Storing as ISO string or YYYY-MM-DD
            table.integer('department_id').references('id').inTable('departments').onDelete('SET NULL');
            table.integer('ward_id').references('id').inTable('wards').onDelete('SET NULL');
            table.integer('payment_id').references('id').inTable('payments');
            table.integer('invoice_id').references('id').inTable('invoices');
            table.decimal('amount', 14, 2).notNullable();
            table.string('payment_method').notNullable();
            table.integer('cashier_id').references('id').inTable('users');
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());

            // Indexes for reporting performance
            table.index(['transaction_date']);
            table.index(['department_id']);
            table.index(['ward_id']);
        });
    }
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('sales_tracking');
}
