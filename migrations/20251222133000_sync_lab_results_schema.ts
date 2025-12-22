import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable("lab_results");
    if (!hasTable) return;

    await knex.schema.alterTable("lab_results", (table) => {
        // Rename columns if they exist under old names
        // Note: Knex.alterTable renameColumn doesn't always work perfectly across all DBs with hasColumn check inside, 
        // but for PG it should be fine.
    });

    // Check and rename critical_values
    const hasCriticalValues = await knex.schema.hasColumn("lab_results", "critical_values");
    if (hasCriticalValues) {
        await knex.schema.alterTable("lab_results", (table) => {
            table.renameColumn("critical_values", "is_critical");
        });
    }

    // Check and rename results
    const hasResults = await knex.schema.hasColumn("lab_results", "results");
    if (hasResults) {
        await knex.schema.alterTable("lab_results", (table) => {
            table.renameColumn("results", "result_value");
        });
    }

    // Add missing columns
    await knex.schema.alterTable("lab_results", (table) => {
        table.string("test_code", 50).nullable();
        table.string("category", 50).nullable();
        table.string("unit", 20).nullable();
        table.string("reference_range", 50).nullable();
        table.text("notes").nullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    const hasTable = await knex.schema.hasTable("lab_results");
    if (!hasTable) return;

    await knex.schema.alterTable("lab_results", (table) => {
        table.dropColumn("test_code");
        table.dropColumn("category");
        table.dropColumn("unit");
        table.dropColumn("reference_range");
        table.dropColumn("notes");
        table.renameColumn("is_critical", "critical_values");
        table.renameColumn("result_value", "results");
    });
}
