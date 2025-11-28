import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"));
    table.string("username", 50).unique().notNullable();
    table.string("email", 255).unique().notNullable();
    table.string("password_hash", 255).notNullable();
    table.string("first_name", 100).notNullable();
    table.string("last_name", 100).notNullable();
    table.string("role", 20).notNullable();
    table.string("department", 100);
    table.string("specialty", 100);
    table.string("license_number", 50);
    table.string("phone", 20);
    table.boolean("is_active").defaultTo(true);
    table.timestamp("last_login");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("patients", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"));
    table.string("mrn", 20).unique().notNullable();
    table.string("first_name", 100).notNullable();
    table.string("last_name", 100).notNullable();
    table.date("date_of_birth").notNullable();
    table.string("gender", 10).notNullable();
    table.string("phone", 20);
    table.string("email", 255);
    table.text("address");
    table.string("city", 100);
    table.string("state", 2);
    table.string("zip_code", 10);
    table.text("emergency_contact");
    table.text("insurance");
    table.text("medical_history");
    table.text("allergies");
    table.text("current_medications");
    table.string("status", 20).defaultTo("active");
    table.uuid("assigned_doctor").references("id").inTable("users");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("appointments", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"));
    table.uuid("patient_id").notNullable().references("id").inTable("patients");
    table.uuid("doctor_id").notNullable().references("id").inTable("users");
    table.date("appointment_date").notNullable();
    table.time("appointment_time").notNullable();
    table.integer("duration").notNullable().defaultTo(30);
    table.string("type", 20).notNullable();
    table.string("status", 20).defaultTo("scheduled");
    table.text("notes");
    table.text("symptoms");
    table.text("diagnosis");
    table.text("treatment");
    table.string("room", 20);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("medical_records", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"));
    table.uuid("patient_id").notNullable().references("id").inTable("patients");
    table.uuid("provider_id").notNullable().references("id").inTable("users");
    table.string("record_type", 20).notNullable();
    table.date("record_date").notNullable();
    table.string("title", 200).notNullable();
    table.text("content").notNullable();
    table.text("attachments");
    table.string("status", 20).defaultTo("final");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("vital_signs", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"));
    table.uuid("patient_id").notNullable().references("id").inTable("patients");
    table.uuid("recorded_by").notNullable().references("id").inTable("users");
    table.timestamp("recorded_at").notNullable();
    table.integer("systolic_bp");
    table.integer("diastolic_bp");
    table.integer("heart_rate");
    table.decimal("temperature", 4, 1);
    table.integer("respiratory_rate");
    table.integer("oxygen_saturation");
    table.decimal("weight", 5, 2);
    table.decimal("height", 5, 2);
    table.decimal("bmi", 4, 1);
    table.text("notes");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("lab_results", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"));
    table.uuid("patient_id").notNullable().references("id").inTable("patients");
    table.uuid("ordered_by").notNullable().references("id").inTable("users");
    table.uuid("performed_by").references("id").inTable("users");
    table.string("test_type", 100).notNullable();
    table.string("test_name", 200).notNullable();
    table.date("order_date").notNullable();
    table.date("collection_date");
    table.date("result_date");
    table.string("status", 20).defaultTo("ordered");
    table.text("results");
    table.text("interpretation");
    table.boolean("critical_values").defaultTo(false);
    table.text("attachments");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("prescriptions", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"));
    table.uuid("patient_id").notNullable().references("id").inTable("patients");
    table.uuid("prescribed_by").notNullable().references("id").inTable("users");
    table.date("prescription_date").notNullable();
    table.text("medications").notNullable();
    table.string("status", 20).defaultTo("active");
    table.text("notes");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("audit_logs", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"));
    table.uuid("user_id").references("id").inTable("users");
    table.string("action", 100).notNullable();
    table.string("resource_type", 50).notNullable();
    table.uuid("resource_id");
    table.text("old_values");
    table.text("new_values");
    table.string("ip_address");
    table.text("user_agent");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });

  // Create indexes for performance
  await knex.schema.raw("CREATE INDEX idx_patients_mrn ON patients(mrn);");
  await knex.schema.raw("CREATE INDEX idx_appointments_patient_date ON appointments(patient_id, appointment_date);");
  await knex.schema.raw("CREATE INDEX idx_appointments_doctor_date ON appointments(doctor_id, appointment_date);");
  await knex.schema.raw("CREATE INDEX idx_medical_records_patient ON medical_records(patient_id);");
  await knex.schema.raw("CREATE INDEX idx_vital_signs_patient_date ON vital_signs(patient_id, recorded_at);");
  await knex.schema.raw("CREATE INDEX idx_lab_results_patient ON lab_results(patient_id);");
  await knex.schema.raw("CREATE INDEX idx_prescriptions_patient ON prescriptions(patient_id);");
  await knex.schema.raw("CREATE INDEX idx_audit_logs_user_date ON audit_logs(user_id, created_at);");
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("audit_logs");
  await knex.schema.dropTableIfExists("prescriptions");
  await knex.schema.dropTableIfExists("lab_results");
  await knex.schema.dropTableIfExists("vital_signs");
  await knex.schema.dropTableIfExists("medical_records");
  await knex.schema.dropTableIfExists("appointments");
  await knex.schema.dropTableIfExists("patients");
  await knex.schema.dropTableIfExists("users");
}
