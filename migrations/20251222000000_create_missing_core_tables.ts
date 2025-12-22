import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    // 1. Departments
    const hasDepts = await knex.schema.hasTable('departments');
    if (!hasDepts) {
        await knex.schema.createTable('departments', (table) => {
            table.increments('id').primary();
            table.string('name').notNullable().unique();
            table.text('description');
            table.string('head_of_department');
            table.boolean('is_active').defaultTo(true);
            table.timestamps(true, true);
        });

        // Seed default departments
        await knex('departments').insert([
            { name: 'General Medicine', description: 'General practice and primary care' },
            { name: 'Pharmacy', description: 'Medication dispensing and management' },
            { name: 'Laboratory', description: 'Pathology and diagnostic testing' },
            { name: 'Nursing', description: 'Patient care and ward management' },
            { name: 'Administration', description: 'Hospital management and finance' }
        ]);
    }

    // 2. Service Categories
    const hasCats = await knex.schema.hasTable('service_categories');
    if (!hasCats) {
        await knex.schema.createTable('service_categories', (table) => {
            table.increments('id').primary();
            table.string('name').notNullable().unique();
            table.text('description');
            table.timestamps(true, true);
        });

        // Seed default categories
        await knex('service_categories').insert([
            { name: 'Consultation', description: 'Doctor visits and consultations' },
            { name: 'Laboratory', description: 'Lab tests' },
            { name: 'Pharmacy', description: 'Drugs and medical supplies' },
            { name: 'Procedure', description: 'Medical procedures' },
            { name: 'Admission', description: 'Ward and bed charges' },
            { name: 'Registration', description: 'Patient registration fees' }
        ]);
    }

    // 3. Services
    const hasServices = await knex.schema.hasTable('services');
    if (!hasServices) {
        await knex.schema.createTable('services', (table) => {
            table.increments('id').primary();
            table.string('name').notNullable();
            table.text('description');
            table.string('category').notNullable();
            table.string('department');
            table.decimal('base_price', 10, 2).notNullable();
            table.decimal('tax_rate', 5, 2).defaultTo(0);
            table.boolean('hmo_covered').defaultTo(false);
            table.decimal('hmo_price', 10, 2).nullable();
            table.integer('duration_minutes').nullable();
            table.boolean('is_active').defaultTo(true);
            table.timestamps(true, true);
        });

        // Seed some basic services
        await knex('services').insert([
            { name: 'General Consultation', category: 'Consultation', department: 'General Medicine', base_price: 5000, hmo_covered: true },
            { name: 'Specialist Consultation', category: 'Consultation', department: 'General Medicine', base_price: 15000, hmo_covered: true },
            { name: 'Registration Fee', category: 'Registration', department: 'Administration', base_price: 2000, hmo_covered: false },
            { name: 'Malaria Parasite Test', category: 'Laboratory', department: 'Laboratory', base_price: 3000, hmo_covered: true },
            { name: 'Widal Test', category: 'Laboratory', department: 'Laboratory', base_price: 4000, hmo_covered: true }
        ]);
    }
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('services');
    await knex.schema.dropTableIfExists('service_categories');
    await knex.schema.dropTableIfExists('departments');
}
