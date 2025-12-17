import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    // Add refill fields to prescriptions
    const hasRefills = await knex.schema.hasColumn("prescriptions", "refills_authorized");
    if (!hasRefills) {
        await knex.schema.alterTable("prescriptions", (table) => {
            table.integer("refills_authorized").defaultTo(0);
            table.integer("refills_remaining").defaultTo(0);
            table.date("last_refill_date");
        });
    }

    // Create prescription_fills table for tracking partials/refills
    const hasFillsTable = await knex.schema.hasTable("prescription_fills");
    if (!hasFillsTable) {
        await knex.schema.createTable("prescription_fills", (table) => {
            table.uuid("id").primary().defaultTo(knex.raw("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"));
            table.uuid("prescription_id").notNullable().references("id").inTable("prescriptions").onDelete("CASCADE");
            table.timestamp("dispensed_at").defaultTo(knex.fn.now());
            table.uuid("dispensed_by").references("id").inTable("users");
            table.text("items").notNullable(); // JSON: [{name: "Drug A", quantity: 15}]
            table.text("notes");
            table.string("type", 20).defaultTo("fill"); // fill, refill, partial
            table.timestamp("created_at").defaultTo(knex.fn.now());
        });
    }
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("prescription_fills");

    await knex.schema.alterTable("prescriptions", (table) => {
        table.dropColumn("last_refill_date");
        table.dropColumn("refills_remaining");
        table.dropColumn("refills_authorized");
    });
}
