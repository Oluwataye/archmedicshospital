import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    // Add HMO-related fields to patients table
    await knex.schema.alterTable("patients", (table) => {
        table.string("nhis_enrollment_number", 50);
        table.uuid("hmo_provider_id").references("id").inTable("hmo_providers");
        table.uuid("hmo_package_id").references("id").inTable("hmo_service_packages");
        table.date("policy_start_date");
        table.date("policy_end_date");
        table.uuid("principal_member_id").references("id").inTable("patients"); // for dependents
        table.string("relationship_to_principal", 50); // spouse, child, parent, etc.
    });

    // Create index for NHIS enrollment number lookups
    await knex.schema.raw("CREATE INDEX idx_patients_nhis_enrollment ON patients(nhis_enrollment_number);");
    await knex.schema.raw("CREATE INDEX idx_patients_hmo_provider ON patients(hmo_provider_id);");
    await knex.schema.raw("CREATE INDEX idx_patients_policy_dates ON patients(policy_start_date, policy_end_date);");
}

export async function down(knex: Knex): Promise<void> {
    // Remove HMO-related fields from patients table
    await knex.schema.alterTable("patients", (table) => {
        table.dropColumn("nhis_enrollment_number");
        table.dropColumn("hmo_provider_id");
        table.dropColumn("hmo_package_id");
        table.dropColumn("policy_start_date");
        table.dropColumn("policy_end_date");
        table.dropColumn("principal_member_id");
        table.dropColumn("relationship_to_principal");
    });
}
