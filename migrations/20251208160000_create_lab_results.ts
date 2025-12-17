import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable("lab_results");
    if (!hasTable) {
        await knex.schema.createTable("lab_results", (table) => {
            table.uuid("id").primary().defaultTo(knex.raw("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"));
            table.uuid("patient_id").notNullable();
            table.uuid("ordered_by").notNullable(); // Doctor who ordered the test
            table.uuid("performed_by").nullable(); // Lab technician who performed the test
            table.string("test_name", 100).notNullable();
            table.string("test_code", 50).nullable();
            table.string("category", 50).nullable();
            table.enum("status", ["ordered", "in_progress", "completed", "cancelled"]).defaultTo("ordered");
            table.date("order_date").notNullable();
            table.date("result_date").nullable();
            table.text("result_value").nullable();
            table.string("unit", 20).nullable();
            table.string("reference_range", 50).nullable();
            table.boolean("is_critical").defaultTo(false);
            table.text("notes").nullable();
            table.text("interpretation").nullable();
            table.json("attachments").nullable(); // For storing file paths/URLs
            table.timestamp("created_at").defaultTo(knex.fn.now());
            table.timestamp("updated_at").defaultTo(knex.fn.now());

            // Foreign keys
            table.foreign("patient_id").references("id").inTable("patients").onDelete("CASCADE");
            table.foreign("ordered_by").references("id").inTable("users").onDelete("RESTRICT");
            table.foreign("performed_by").references("id").inTable("users").onDelete("SET NULL");

            // Indexes for better query performance
            table.index("patient_id");
            table.index("status");
            table.index("order_date");
            table.index("is_critical");
        });
    }
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("lab_results");
}
