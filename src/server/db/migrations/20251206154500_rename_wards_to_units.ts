
import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    // 1. Rename wards to units
    if (await knex.schema.hasTable('wards')) {
        await knex.schema.renameTable('wards', 'units');
        console.log('Renamed wards table to units');
    }

    // 2. Fix the foreign key in beds table if possible (SQLite doesn't support direct FK changes easily, 
    // but renaming the parent table in SQLite usually keeps the link if using IDs, but metadata might differ).
    // For SQLite, typically we'd recreate the table, but for now we just rename the column 'ward_id' to 'unit_id' if desired.
    // The user didn't explicitly ask to rename columns, but "replace wards with units" implies 'unit_id' in other tables.
    // Let's rename 'ward_id' to 'unit_id' in beds and admissions tables to be consistent.

    if (await knex.schema.hasTable('beds')) {
        if (await knex.schema.hasColumn('beds', 'ward_id')) {
            await knex.schema.alterTable('beds', (table) => {
                table.renameColumn('ward_id', 'unit_id');
            });
            console.log('Renamed bed.ward_id to bed.unit_id');
        }
    }

    if (await knex.schema.hasTable('admissions')) {
        if (await knex.schema.hasColumn('admissions', 'ward_id')) {
            await knex.schema.alterTable('admissions', (table) => {
                table.renameColumn('ward_id', 'unit_id');
            });
            console.log('Renamed admissions.ward_id to admissions.unit_id');
        }
    }
}

export async function down(knex: Knex): Promise<void> {
    if (await knex.schema.hasTable('units')) {
        await knex.schema.renameTable('units', 'wards');
    }

    if (await knex.schema.hasTable('beds')) {
        if (await knex.schema.hasColumn('beds', 'unit_id')) {
            await knex.schema.alterTable('beds', (table) => {
                table.renameColumn('unit_id', 'ward_id');
            });
        }
    }

    if (await knex.schema.hasTable('admissions')) {
        if (await knex.schema.hasColumn('admissions', 'unit_id')) {
            await knex.schema.alterTable('admissions', (table) => {
                table.renameColumn('unit_id', 'ward_id');
            });
        }
    }
}
