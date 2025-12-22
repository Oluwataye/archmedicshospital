import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    const hasColumn = await knex.schema.hasColumn("prescriptions", "dispensed_at");
    if (!hasColumn) {
        await knex.schema.alterTable("prescriptions", (table) => {
            table.timestamp("dispensed_at");
            table.uuid("dispensed_by").references("id").inTable("users");
            table.text("dispensing_notes");
        });
    }
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("prescriptions", (table) => {
        table.dropColumn("dispensing_notes");
        table.dropColumn("dispensed_by");
        table.dropColumn("dispensed_at");
    });
}

