import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    // Drug Interactions Table
    const hasDrugInteractions = await knex.schema.hasTable("drug_interactions");
    if (!hasDrugInteractions) {
        await knex.schema.createTable("drug_interactions", (table) => {
            table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
            table.string("drug_a", 200).notNullable();
            table.string("drug_b", 200).notNullable();
            table.string("severity", 20).notNullable(); // Critical, Major, Moderate, Minor
            table.text("description").notNullable();
            table.text("clinical_effects");
            table.text("management_recommendation");
            table.string("evidence_level", 50); // Well-documented, Theoretical, Case reports
            table.timestamp("created_at").defaultTo(knex.fn.now());
            table.timestamp("updated_at").defaultTo(knex.fn.now());

            // Index for faster lookups
            table.index(["drug_a", "drug_b"]);
        });
    }

    // Drug Contraindications Table
    const hasContraindications = await knex.schema.hasTable("drug_contraindications");
    if (!hasContraindications) {
        await knex.schema.createTable("drug_contraindications", (table) => {
            table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
            table.string("drug_name", 200).notNullable();
            table.string("condition", 200).notNullable();
            table.string("severity", 20).notNullable(); // Absolute, Relative
            table.text("description").notNullable();
            table.text("alternative_recommendations");
            table.timestamp("created_at").defaultTo(knex.fn.now());
            table.timestamp("updated_at").defaultTo(knex.fn.now());

            table.index("drug_name");
        });
    }

    // Allergy Interactions Table
    const hasAllergyInteractions = await knex.schema.hasTable("allergy_interactions");
    if (!hasAllergyInteractions) {
        await knex.schema.createTable("allergy_interactions", (table) => {
            table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
            table.string("allergen", 200).notNullable();
            table.string("drug_name", 200).notNullable();
            table.string("cross_sensitivity", 20).notNullable(); // High, Moderate, Low
            table.text("description").notNullable();
            table.text("precautions");
            table.timestamp("created_at").defaultTo(knex.fn.now());
            table.timestamp("updated_at").defaultTo(knex.fn.now());

            table.index(["allergen", "drug_name"]);
        });
    }

    // Interaction Checks Log (for audit trail)
    const hasInteractionChecks = await knex.schema.hasTable("interaction_checks");
    if (!hasInteractionChecks) {
        await knex.schema.createTable("interaction_checks", (table) => {
            table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
            table.uuid("patient_id").notNullable().references("id").inTable("patients");
            table.uuid("prescription_id").references("id").inTable("prescriptions");
            table.uuid("checked_by").notNullable().references("id").inTable("users");
            table.json("medications_checked").notNullable();
            table.json("interactions_found");
            table.json("contraindications_found");
            table.json("allergy_alerts");
            table.string("action_taken", 50); // Dispensed, Modified, Rejected, Consulted
            table.text("notes");
            table.timestamp("checked_at").defaultTo(knex.fn.now());

            table.index("patient_id");
            table.index("checked_at");
        });
    }
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("interaction_checks");
    await knex.schema.dropTableIfExists("allergy_interactions");
    await knex.schema.dropTableIfExists("drug_contraindications");
    await knex.schema.dropTableIfExists("drug_interactions");
}


