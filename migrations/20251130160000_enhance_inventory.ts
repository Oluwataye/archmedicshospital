import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    // Suppliers Table
    const hasSuppliers = await knex.schema.hasTable("suppliers");
    if (!hasSuppliers) {
        await knex.schema.createTable("suppliers", (table) => {
            table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
            table.string("name", 200).notNullable();
            table.string("contact_person", 100);
            table.string("email", 255);
            table.string("phone", 20);
            table.text("address");
            table.boolean("is_active").defaultTo(true);
            table.timestamp("created_at").defaultTo(knex.fn.now());
            table.timestamp("updated_at").defaultTo(knex.fn.now());
        });
    }

    // Inventory Items Table
    const hasInventoryItems = await knex.schema.hasTable("inventory_items");
    if (!hasInventoryItems) {
        await knex.schema.createTable("inventory_items", (table) => {
            table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
            table.string("name", 200).notNullable();
            table.string("generic_name", 200);
            table.string("sku", 50).unique();
            table.string("category", 50); // Tablet, Syrup, Injection, Consumable, etc.
            table.text("description");
            table.decimal("unit_price", 10, 2).notNullable(); // Cost price
            table.decimal("selling_price", 10, 2).notNullable();
            table.integer("current_stock").defaultTo(0);
            table.integer("reorder_level").defaultTo(10);
            table.integer("reorder_quantity").defaultTo(50);
            table.string("unit_measure", 20); // pcs, box, ml, mg
            table.uuid("preferred_supplier_id").references("id").inTable("suppliers");
            table.boolean("is_active").defaultTo(true);
            table.timestamp("created_at").defaultTo(knex.fn.now());
            table.timestamp("updated_at").defaultTo(knex.fn.now());

            table.index("name");
            table.index("category");
        });
    }

    // Inventory Batches Table (for expiry tracking)
    const hasInventoryBatches = await knex.schema.hasTable("inventory_batches");
    if (!hasInventoryBatches) {
        await knex.schema.createTable("inventory_batches", (table) => {
            table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
            table.uuid("item_id").notNullable().references("id").inTable("inventory_items").onDelete("CASCADE");
            table.string("batch_number", 50).notNullable();
            table.integer("quantity").notNullable();
            table.integer("remaining_quantity").notNullable();
            table.date("expiry_date").notNullable();
            table.date("received_date").defaultTo(knex.fn.now());
            table.uuid("supplier_id").references("id").inTable("suppliers");
            table.timestamp("created_at").defaultTo(knex.fn.now());
            table.timestamp("updated_at").defaultTo(knex.fn.now());

            table.index(["item_id", "expiry_date"]);
        });
    }

    // Stock Movements Table (Audit trail)
    const hasStockMovements = await knex.schema.hasTable("stock_movements");
    if (!hasStockMovements) {
        await knex.schema.createTable("stock_movements", (table) => {
            table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
            table.uuid("item_id").notNullable().references("id").inTable("inventory_items");
            table.uuid("batch_id").references("id").inTable("inventory_batches");
            table.string("type", 20).notNullable(); // IN, OUT, ADJUSTMENT, RETURN, EXPIRED
            table.integer("quantity").notNullable();
            table.integer("previous_stock").notNullable();
            table.integer("new_stock").notNullable();
            table.string("reference_type", 50); // Prescription, Purchase Order, etc.
            table.string("reference_id", 100);
            table.uuid("performed_by").notNullable().references("id").inTable("users");
            table.text("notes");
            table.timestamp("created_at").defaultTo(knex.fn.now());

            table.index(["item_id", "created_at"]);
        });
    }
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("stock_movements");
    await knex.schema.dropTableIfExists("inventory_batches");
    await knex.schema.dropTableIfExists("inventory_items");
    await knex.schema.dropTableIfExists("suppliers");
}


