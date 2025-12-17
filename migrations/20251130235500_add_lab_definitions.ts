import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable("lab_test_definitions");
    if (!hasTable) {
        await knex.schema.createTable("lab_test_definitions", (table) => {
            table.uuid("id").primary().defaultTo(knex.raw("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"));
            table.string("code", 50).unique().notNullable();
            table.string("name", 100).notNullable();
            table.string("category", 50);
            table.string("unit", 20);
            table.decimal("reference_range_min", 10, 2);
            table.decimal("reference_range_max", 10, 2);
            table.decimal("critical_low", 10, 2);
            table.decimal("critical_high", 10, 2);
            table.text("description");
            table.boolean("is_active").defaultTo(true);
            table.timestamp("created_at").defaultTo(knex.fn.now());
            table.timestamp("updated_at").defaultTo(knex.fn.now());
        });
    }

    // Seed some initial data
    // We can't easily seed here without duplicating code, but we can assume the app will have a seeder or we can insert some defaults if needed.
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("lab_test_definitions");
}
