import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable("lab_inventory");
    if (!hasTable) {
        await knex.schema.createTable("lab_inventory", (table) => {
            table.uuid("id").primary().defaultTo(knex.raw("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"));
            table.string("item_name", 100).notNullable();
            table.string("item_code", 50).unique();
            table.string("category", 50);
            table.text("description");
            table.integer("quantity").defaultTo(0);
            table.integer("reorder_level").defaultTo(10);
            table.string("unit", 20);
            table.decimal("unit_price", 10, 2);
            table.string("supplier", 100);
            table.date("expiry_date");
            table.string("storage_location", 100);
            table.timestamp("created_at").defaultTo(knex.fn.now());
            table.timestamp("updated_at").defaultTo(knex.fn.now());

            // Indexes
            table.index("item_code");
            table.index("category");
            table.index("quantity");
        });
    }
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("lab_inventory");
}
