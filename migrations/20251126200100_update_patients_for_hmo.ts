import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    // Add HMO-related fields to patients table only if they don't exist
    const hasNhisEnrollment = await knex.schema.hasColumn("patients", "nhis_enrollment_number");
    const hasHmoProvider = await knex.schema.hasColumn("patients", "hmo_provider_id");
    const hasHmoPackage = await knex.schema.hasColumn("patients", "hmo_package_id");
    const hasPolicyStart = await knex.schema.hasColumn("patients", "policy_start_date");
    const hasPolicyEnd = await knex.schema.hasColumn("patients", "policy_end_date");
    const hasPrincipalMember = await knex.schema.hasColumn("patients", "principal_member_id");
    const hasRelationship = await knex.schema.hasColumn("patients", "relationship_to_principal");

    await knex.schema.alterTable("patients", (table) => {
        if (!hasNhisEnrollment) table.string("nhis_enrollment_number", 50);
        if (!hasHmoProvider) table.uuid("hmo_provider_id").references("id").inTable("hmo_providers");
        if (!hasHmoPackage) table.uuid("hmo_package_id").references("id").inTable("hmo_service_packages");
        if (!hasPolicyStart) table.date("policy_start_date");
        if (!hasPolicyEnd) table.date("policy_end_date");
        if (!hasPrincipalMember) table.uuid("principal_member_id").references("id").inTable("patients"); // for dependents
        if (!hasRelationship) table.string("relationship_to_principal", 50); // spouse, child, parent, etc.
    });

    // Create index for NHIS enrollment number lookups
    await knex.schema.raw("CREATE INDEX IF NOT EXISTS idx_patients_nhis_enrollment ON patients(nhis_enrollment_number);");
    await knex.schema.raw("CREATE INDEX IF NOT EXISTS idx_patients_hmo_provider ON patients(hmo_provider_id);");
    await knex.schema.raw("CREATE INDEX IF NOT EXISTS idx_patients_policy_dates ON patients(policy_start_date, policy_end_date);");
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
