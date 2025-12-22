import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    const hasColumn = await knex.schema.hasColumn("lab_test_definitions", "price");
    if (!hasColumn) {
        await knex.schema.alterTable("lab_test_definitions", (table) => {
            table.decimal("price", 10, 2).defaultTo(0);
        });
    }
}

export async function down(knex: Knex): Promise<void> {
    const hasColumn = await knex.schema.hasColumn("lab_test_definitions", "price");
    if (hasColumn) {
        await knex.schema.alterTable("lab_test_definitions", (table) => {
            table.dropColumn("price");
        });
    }
}

