import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    // Add Next of Kin fields to patients table
    const hasNokName = await knex.schema.hasColumn("patients", "nok_full_name");
    const hasNokRelationship = await knex.schema.hasColumn("patients", "nok_relationship");
    const hasNokPhone = await knex.schema.hasColumn("patients", "nok_phone");
    const hasNokEmail = await knex.schema.hasColumn("patients", "nok_email");
    const hasNokAddress = await knex.schema.hasColumn("patients", "nok_address");

    // Add Demographic fields to patients table
    const hasStateOfOrigin = await knex.schema.hasColumn("patients", "state_of_origin");
    const hasLga = await knex.schema.hasColumn("patients", "lga");
    const hasReligion = await knex.schema.hasColumn("patients", "religion");
    const hasTribe = await knex.schema.hasColumn("patients", "tribe");
    const hasEmploymentStatus = await knex.schema.hasColumn("patients", "employment_status");

    await knex.schema.alterTable("patients", (table) => {
        // Next of Kin Information
        if (!hasNokName) table.string("nok_full_name", 200);
        if (!hasNokRelationship) table.string("nok_relationship", 50);
        if (!hasNokPhone) table.string("nok_phone", 20);
        if (!hasNokEmail) table.string("nok_email", 255);
        if (!hasNokAddress) table.text("nok_address");

        // Demographic Information
        if (!hasStateOfOrigin) table.string("state_of_origin", 100);
        if (!hasLga) table.string("lga", 100);
        if (!hasReligion) table.string("religion", 50);
        if (!hasTribe) table.string("tribe", 100);
        if (!hasEmploymentStatus) table.string("employment_status", 50);
    });

    // Create indexes for commonly searched fields
    await knex.schema.raw("CREATE INDEX IF NOT EXISTS idx_patients_state_of_origin ON patients(state_of_origin);");
    await knex.schema.raw("CREATE INDEX IF NOT EXISTS idx_patients_lga ON patients(lga);");
}

export async function down(knex: Knex): Promise<void> {
    // Remove Next of Kin and Demographic fields from patients table
    await knex.schema.alterTable("patients", (table) => {
        table.dropColumn("nok_full_name");
        table.dropColumn("nok_relationship");
        table.dropColumn("nok_phone");
        table.dropColumn("nok_email");
        table.dropColumn("nok_address");
        table.dropColumn("state_of_origin");
        table.dropColumn("lga");
        table.dropColumn("religion");
        table.dropColumn("tribe");
        table.dropColumn("employment_status");
    });
}

