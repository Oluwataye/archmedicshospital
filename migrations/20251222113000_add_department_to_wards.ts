import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    // Add department_id to wards table if it doesn't exist
    const hasColumn = await knex.schema.hasColumn("wards", "department_id");
    if (!hasColumn) {
        await knex.schema.alterTable("wards", (table) => {
            table.integer("department_id").unsigned().references("id").inTable("departments").onDelete("SET NULL");
        });
    }
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable("wards", (table) => {
        table.dropColumn("department_id");
    });
}
