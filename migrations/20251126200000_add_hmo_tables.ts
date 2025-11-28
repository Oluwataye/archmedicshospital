import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // 1. Create HMO Providers table
  await knex.schema.createTable("hmo_providers", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"));
    table.string("name", 200).notNullable();
    table.string("code", 50).unique().notNullable();
    table.string("nhia_accreditation_number", 100);
    table.string("contact_email", 255);
    table.string("contact_phone", 20);
    table.text("address");
    table.string("coverage_type", 50); // individual, family, corporate
    table.boolean("is_active").defaultTo(true);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  // 2. Create HMO Service Packages table
  await knex.schema.createTable("hmo_service_packages", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"));
    table.uuid("hmo_provider_id").notNullable().references("id").inTable("hmo_providers").onDelete("CASCADE");
    table.string("package_name", 200).notNullable();
    table.string("package_code", 50).notNullable();
    table.decimal("annual_limit", 12, 2);
    table.text("services_covered"); // JSON array of service codes
    table.text("exclusions"); // JSON array
    table.decimal("copay_percentage", 5, 2);
    table.boolean("is_active").defaultTo(true);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  // 3. Create NHIS Service Codes table
  await knex.schema.createTable("nhis_service_codes", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"));
    table.string("code", 50).unique().notNullable();
    table.string("description", 500).notNullable();
    table.string("category", 100); // consultation, procedure, diagnostic, etc.
    table.decimal("base_tariff", 10, 2).notNullable();
    table.boolean("is_active").defaultTo(true);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  // 4. Create HMO Tariffs table (pricing per HMO)
  await knex.schema.createTable("hmo_tariffs", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"));
    table.uuid("hmo_provider_id").notNullable().references("id").inTable("hmo_providers").onDelete("CASCADE");
    table.uuid("service_code_id").notNullable().references("id").inTable("nhis_service_codes").onDelete("CASCADE");
    table.decimal("tariff_amount", 10, 2).notNullable();
    table.decimal("copay_amount", 10, 2);
    table.decimal("copay_percentage", 5, 2);
    table.date("effective_from").notNullable();
    table.date("effective_to");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  // 5. Create HMO Claims table
  await knex.schema.createTable("hmo_claims", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"));
    table.string("claim_number", 50).unique().notNullable();
    table.uuid("patient_id").notNullable().references("id").inTable("patients").onDelete("RESTRICT");
    table.uuid("hmo_provider_id").notNullable().references("id").inTable("hmo_providers").onDelete("RESTRICT");
    table.date("claim_date").notNullable();
    table.date("service_date").notNullable();
    table.decimal("total_amount", 12, 2).notNullable();
    table.decimal("copay_amount", 12, 2).defaultTo(0);
    table.decimal("claim_amount", 12, 2).notNullable();
    table.string("status", 50).defaultTo("pending"); // pending, submitted, approved, rejected, paid
    table.timestamp("submission_date");
    table.timestamp("approval_date");
    table.timestamp("payment_date");
    table.text("rejection_reason");
    table.uuid("created_by").references("id").inTable("users");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  // 6. Create HMO Claim Items table
  await knex.schema.createTable("hmo_claim_items", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"));
    table.uuid("claim_id").notNullable().references("id").inTable("hmo_claims").onDelete("CASCADE");
    table.uuid("service_code_id").notNullable().references("id").inTable("nhis_service_codes").onDelete("RESTRICT");
    table.integer("quantity").defaultTo(1);
    table.decimal("unit_price", 10, 2).notNullable();
    table.decimal("total_price", 10, 2).notNullable();
    table.string("diagnosis_code", 50);
    table.uuid("provider_id").references("id").inTable("users"); // doctor who provided service
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });

  // 7. Create HMO Pre-authorizations table
  await knex.schema.createTable("hmo_preauthorizations", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"));
    table.string("authorization_code", 50).unique().notNullable();
    table.uuid("patient_id").notNullable().references("id").inTable("patients").onDelete("RESTRICT");
    table.uuid("hmo_provider_id").notNullable().references("id").inTable("hmo_providers").onDelete("RESTRICT");
    table.uuid("requested_service_code_id").references("id").inTable("nhis_service_codes").onDelete("RESTRICT");
    table.text("diagnosis");
    table.uuid("requested_by").notNullable().references("id").inTable("users");
    table.timestamp("request_date").defaultTo(knex.fn.now());
    table.timestamp("approval_date");
    table.date("expiry_date");
    table.string("status", 50).defaultTo("pending"); // pending, approved, rejected, expired
    table.decimal("approved_amount", 10, 2);
    table.text("notes");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  // 8. Create Referrals table
  await knex.schema.createTable("referrals", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"));
    table.string("referral_code", 50).unique().notNullable();
    table.uuid("patient_id").notNullable().references("id").inTable("patients").onDelete("RESTRICT");
    table.uuid("referring_provider_id").notNullable().references("id").inTable("users");
    table.string("referring_facility", 200);
    table.string("referred_to_facility", 200);
    table.string("referred_to_specialist", 200);
    table.string("specialty_required", 100);
    table.text("reason_for_referral").notNullable();
    table.text("diagnosis");
    table.string("urgency", 50).defaultTo("routine"); // routine, urgent, emergency
    table.uuid("hmo_provider_id").references("id").inTable("hmo_providers");
    table.boolean("preauth_required").defaultTo(false);
    table.uuid("preauth_id").references("id").inTable("hmo_preauthorizations");
    table.string("status", 50).defaultTo("pending"); // pending, accepted, completed, cancelled
    table.date("referral_date").notNullable();
    table.date("appointment_date");
    table.text("feedback");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  // Create indexes for performance
  await knex.schema.raw("CREATE INDEX idx_hmo_providers_code ON hmo_providers(code);");
  await knex.schema.raw("CREATE INDEX idx_hmo_providers_active ON hmo_providers(is_active);");
  await knex.schema.raw("CREATE INDEX idx_nhis_service_codes_code ON nhis_service_codes(code);");
  await knex.schema.raw("CREATE INDEX idx_nhis_service_codes_category ON nhis_service_codes(category);");
  await knex.schema.raw("CREATE INDEX idx_hmo_tariffs_lookup ON hmo_tariffs(hmo_provider_id, service_code_id, effective_from);");
  await knex.schema.raw("CREATE INDEX idx_hmo_claims_patient ON hmo_claims(patient_id);");
  await knex.schema.raw("CREATE INDEX idx_hmo_claims_status ON hmo_claims(status);");
  await knex.schema.raw("CREATE INDEX idx_hmo_claims_date ON hmo_claims(claim_date);");
  await knex.schema.raw("CREATE INDEX idx_hmo_preauth_patient ON hmo_preauthorizations(patient_id);");
  await knex.schema.raw("CREATE INDEX idx_hmo_preauth_code ON hmo_preauthorizations(authorization_code);");
  await knex.schema.raw("CREATE INDEX idx_referrals_patient ON referrals(patient_id);");
  await knex.schema.raw("CREATE INDEX idx_referrals_code ON referrals(referral_code);");
  await knex.schema.raw("CREATE INDEX idx_referrals_status ON referrals(status);");
}

export async function down(knex: Knex): Promise<void> {
  // Drop tables in reverse order to respect foreign key constraints
  await knex.schema.dropTableIfExists("referrals");
  await knex.schema.dropTableIfExists("hmo_preauthorizations");
  await knex.schema.dropTableIfExists("hmo_claim_items");
  await knex.schema.dropTableIfExists("hmo_claims");
  await knex.schema.dropTableIfExists("hmo_tariffs");
  await knex.schema.dropTableIfExists("nhis_service_codes");
  await knex.schema.dropTableIfExists("hmo_service_packages");
  await knex.schema.dropTableIfExists("hmo_providers");
}
