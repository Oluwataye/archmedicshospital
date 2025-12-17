import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    // Wards Table
    const hasWards = await knex.schema.hasTable("wards");
    if (!hasWards) {
        await knex.schema.createTable("wards", (table) => {
            table.uuid("id").primary().defaultTo(knex.raw("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"));
            table.string("name", 100).unique().notNullable();
            table.string("type", 50).notNullable(); // General, ICU, Maternity, Pediatric, Surgical
            table.integer("capacity").notNullable();
            table.string("gender", 20).defaultTo("Mixed"); // Male, Female, Mixed
            table.string("status", 20).defaultTo("Active"); // Active, Maintenance, Closed
            table.text("description");
            table.timestamp("created_at").defaultTo(knex.fn.now());
            table.timestamp("updated_at").defaultTo(knex.fn.now());
        });
    }

    // Beds Table
    const hasBeds = await knex.schema.hasTable("beds");
    if (!hasBeds) {
        await knex.schema.createTable("beds", (table) => {
            table.uuid("id").primary().defaultTo(knex.raw("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"));
            table.uuid("ward_id").notNullable().references("id").inTable("wards").onDelete("CASCADE");
            table.string("bed_number", 20).notNullable();
            table.string("type", 50).defaultTo("Standard"); // Standard, ICU, Incubator, VIP
            table.string("status", 20).defaultTo("Available"); // Available, Occupied, Maintenance, Cleaning
            table.boolean("is_occupied").defaultTo(false);
            table.timestamp("created_at").defaultTo(knex.fn.now());
            table.timestamp("updated_at").defaultTo(knex.fn.now());

            // Ensure unique bed number per ward
            table.unique(["ward_id", "bed_number"]);
        });
    }

    // Admissions Table
    const hasAdmissions = await knex.schema.hasTable("admissions");
    if (!hasAdmissions) {
        await knex.schema.createTable("admissions", (table) => {
            table.uuid("id").primary().defaultTo(knex.raw("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"));
            table.uuid("patient_id").notNullable().references("id").inTable("patients");
            table.uuid("ward_id").notNullable().references("id").inTable("wards");
            table.uuid("bed_id").notNullable().references("id").inTable("beds");
            table.uuid("admitted_by").notNullable().references("id").inTable("users");
            table.timestamp("admission_date").defaultTo(knex.fn.now());
            table.timestamp("discharge_date");
            table.uuid("discharged_by").references("id").inTable("users");
            table.text("reason").notNullable();
            table.string("status", 20).defaultTo("Admitted"); // Admitted, Discharged, Transferred
            table.text("diagnosis");
            table.text("notes");
            table.timestamp("created_at").defaultTo(knex.fn.now());
            table.timestamp("updated_at").defaultTo(knex.fn.now());
        });
    }

    // Indexes
    await knex.schema.raw("CREATE INDEX IF NOT EXISTS idx_beds_ward ON beds(ward_id);");
    await knex.schema.raw("CREATE INDEX IF NOT EXISTS idx_beds_status ON beds(status);");
    await knex.schema.raw("CREATE INDEX IF NOT EXISTS idx_admissions_patient ON admissions(patient_id);");
    await knex.schema.raw("CREATE INDEX IF NOT EXISTS idx_admissions_status ON admissions(status);");

    // Insert default wards
    const hasExistingWards = await knex("wards").first();
    if (!hasExistingWards) {
        await knex("wards").insert([
            { name: "General Ward A (Male)", type: "General", capacity: 20, gender: "Male", status: "Active" },
            { name: "General Ward B (Female)", type: "General", capacity: 20, gender: "Female", status: "Active" },
            { name: "Pediatric Ward", type: "Pediatric", capacity: 15, gender: "Mixed", status: "Active" },
            { name: "Maternity Ward", type: "Maternity", capacity: 10, gender: "Female", status: "Active" },
            { name: "ICU", type: "ICU", capacity: 5, gender: "Mixed", status: "Active" },
            { name: "Emergency Ward", type: "Emergency", capacity: 10, gender: "Mixed", status: "Active" },
        ]);
    }
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("admissions");
    await knex.schema.dropTableIfExists("beds");
    await knex.schema.dropTableIfExists("wards");
}

