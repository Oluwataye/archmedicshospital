
import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    // Revolving Funds Table
    await knex.schema.createTable('revolving_funds', (table) => {
        table.uuid('id').primary().defaultTo(knex.fn.uuid());
        table.string('fund_name').notNullable();
        table.uuid('department_id').nullable().references('id').inTable('departments');
        table.uuid('unit_id').nullable().references('id').inTable('wards');
        table.decimal('initial_amount', 14, 2).notNullable();
        table.decimal('current_balance', 14, 2).notNullable();
        table.date('allocated_date').notNullable();
        table.string('status').notNullable().defaultTo('active'); // active, depleted, closed
        table.uuid('managed_by').nullable().references('id').inTable('users');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });

    // Revolving Fund Transactions
    await knex.schema.createTable('revolving_fund_transactions', (table) => {
        table.uuid('id').primary().defaultTo(knex.fn.uuid());
        table.uuid('fund_id').notNullable().references('id').inTable('revolving_funds').onDelete('CASCADE');
        table.string('transaction_type').notNullable(); // allocation, expenditure, replenishment, adjustment
        table.decimal('amount', 14, 2).notNullable();
        table.string('description').nullable();
        table.string('reference_number').nullable();
        table.uuid('processed_by').nullable().references('id').inTable('users');
        table.timestamp('transaction_date').defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('revolving_fund_transactions');
    await knex.schema.dropTableIfExists('revolving_funds');
}
