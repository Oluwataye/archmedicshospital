import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    // Enable UUID extension for SQLite if not already enabled (usually handled by the driver, but good practice)

    // 1. Create lab_equipment table
    const hasEquipmentTable = await knex.schema.hasTable("lab_equipment");
    if (!hasEquipmentTable) {
        await knex.schema.createTable("lab_equipment", (table) => {
            table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
            table.string("name", 100).notNullable();
            table.string("model", 100);
            table.string("manufacturer", 100);
            table.string("serial_number", 100).unique();
            table.string("location", 100);
            table.string("status", 50).defaultTo('Operational'); // Operational, Needs Maintenance, Out of Service
            table.string("equipment_type", 50);
            table.date("purchase_date");
            table.date("last_calibration");
            table.date("next_calibration");
            table.date("last_maintenance");
            table.date("next_maintenance");
            table.text("notes");
            table.timestamp("created_at").defaultTo(knex.fn.now());
            table.timestamp("updated_at").defaultTo(knex.fn.now());

            // Indexes
            table.index("status");
            table.index("equipment_type");
            table.index("next_maintenance");
        });
    }

    // 2. Create lab_maintenance_logs table
    const hasMaintenanceTable = await knex.schema.hasTable("lab_maintenance_logs");
    if (!hasMaintenanceTable) {
        await knex.schema.createTable("lab_maintenance_logs", (table) => {
            table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
            table.uuid("equipment_id").notNullable();
            table.date("scheduled_date").notNullable();
            table.date("completed_date");
            table.string("type", 50); // Regular, Repair, Calibration
            table.string("technician", 100);
            table.text("description");
            table.string("status", 50).defaultTo('Scheduled'); // Scheduled, Completed, Pending
            table.timestamp("created_at").defaultTo(knex.fn.now());
            table.timestamp("updated_at").defaultTo(knex.fn.now());

            // Foreign Key
            table.foreign("equipment_id").references("id").inTable("lab_equipment").onDelete("CASCADE");

            // Indexes
            table.index("equipment_id");
            table.index("scheduled_date");
            table.index("status");
        });
    }

    // 3. Create lab_quality_control table
    const hasQCTable = await knex.schema.hasTable("lab_quality_control");
    if (!hasQCTable) {
        await knex.schema.createTable("lab_quality_control", (table) => {
            table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
            table.uuid("equipment_id").notNullable();
            table.date("test_date").notNullable();
            table.string("control_material", 100);
            table.string("performed_by", 100); // Can be user ID or name
            table.text("result_value");
            table.string("status", 50).defaultTo('Pass'); // Pass, Fail, Warning
            table.boolean("verified").defaultTo(false);
            table.string("verified_by", 100); // Can be user ID or name
            table.timestamp("verified_at");
            table.text("notes");
            table.timestamp("created_at").defaultTo(knex.fn.now());
            table.timestamp("updated_at").defaultTo(knex.fn.now());

            // Foreign Key
            table.foreign("equipment_id").references("id").inTable("lab_equipment").onDelete("CASCADE");

            // Indexes
            table.index("equipment_id");
            table.index("test_date");
            table.index("status");
        });
    }
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("lab_quality_control");
    await knex.schema.dropTableIfExists("lab_maintenance_logs");
    await knex.schema.dropTableIfExists("lab_equipment");
}


