import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    const hasSettings = await knex.schema.hasTable("settings");
    if (!hasSettings) {
        await knex.schema.createTable("settings", (table) => {
            table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
            table.string("key", 100).unique().notNullable();
            table.text("value");
            table.string("category", 50).notNullable(); // general, security, backup, notifications
            table.string("data_type", 20).defaultTo("string"); // string, number, boolean, json
            table.text("description");
            table.timestamp("created_at").defaultTo(knex.fn.now());
            table.timestamp("updated_at").defaultTo(knex.fn.now());
        });

        // Create index for faster lookups
        await knex.schema.raw("CREATE INDEX IF NOT EXISTS idx_settings_category ON settings(category);");
        await knex.schema.raw("CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);");

        // Insert default settings
        await knex("settings").insert([
            // General Settings
            { key: "hospital_name", value: "Archmedics Hospital", category: "general", data_type: "string", description: "Hospital name" },
            { key: "hospital_address", value: "", category: "general", data_type: "string", description: "Hospital address" },
            { key: "hospital_phone", value: "", category: "general", data_type: "string", description: "Hospital phone number" },
            { key: "hospital_email", value: "", category: "general", data_type: "string", description: "Hospital email" },
            { key: "timezone", value: "Africa/Lagos", category: "general", data_type: "string", description: "System timezone" },

            // Security Settings
            { key: "session_timeout", value: "30", category: "security", data_type: "number", description: "Session timeout in minutes" },
            { key: "password_min_length", value: "8", category: "security", data_type: "number", description: "Minimum password length" },
            { key: "password_require_uppercase", value: "true", category: "security", data_type: "boolean", description: "Require uppercase letters" },
            { key: "password_require_numbers", value: "true", category: "security", data_type: "boolean", description: "Require numbers" },
            { key: "password_require_special", value: "false", category: "security", data_type: "boolean", description: "Require special characters" },
            { key: "max_login_attempts", value: "5", category: "security", data_type: "number", description: "Maximum login attempts before lockout" },

            // Backup Settings
            { key: "auto_backup_enabled", value: "false", category: "backup", data_type: "boolean", description: "Enable automatic backups" },
            { key: "backup_frequency", value: "daily", category: "backup", data_type: "string", description: "Backup frequency (daily, weekly, monthly)" },
            { key: "backup_retention_days", value: "30", category: "backup", data_type: "number", description: "Number of days to retain backups" },

            // Notification Settings
            { key: "email_notifications_enabled", value: "false", category: "notifications", data_type: "boolean", description: "Enable email notifications" },
            { key: "sms_notifications_enabled", value: "false", category: "notifications", data_type: "boolean", description: "Enable SMS notifications" },
        ]);
    }
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("settings");
}



