import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Clear existing data
    await knex('stock_movements').del();
    await knex('inventory_batches').del();
    await knex('inventory_items').del();
    await knex('suppliers').del();

    // 1. Insert Suppliers
    const suppliers = await knex('suppliers').insert([
        {
            name: 'PharmaPlus Distributors',
            contact_person: 'John Doe',
            email: 'orders@pharmaplus.com',
            phone: '08012345678',
            address: '123 Pharma Way, Lagos'
        },
        {
            name: 'MediCare Supplies Ltd',
            contact_person: 'Jane Smith',
            email: 'sales@medicare.com',
            phone: '08087654321',
            address: '456 Health Ave, Abuja'
        },
        {
            name: 'Global Health Imports',
            contact_person: 'Robert Brown',
            email: 'info@globalhealth.com',
            phone: '08011223344',
            address: '789 Import Blvd, Port Harcourt'
        }
    ]).returning('id');

    // Helper to get supplier ID
    const getSupplierId = (index: number) => suppliers[index].id;

    // 2. Insert Inventory Items
    const items = await knex('inventory_items').insert([
        {
            name: 'Paracetamol 500mg',
            generic_name: 'Acetaminophen',
            sku: 'PARA-500',
            category: 'Tablet',
            description: 'Pain reliever and fever reducer',
            unit_price: 5.00,
            selling_price: 15.00,
            current_stock: 1000,
            reorder_level: 200,
            reorder_quantity: 1000,
            unit_measure: 'tablet',
            preferred_supplier_id: getSupplierId(0)
        },
        {
            name: 'Amoxicillin 500mg',
            generic_name: 'Amoxicillin',
            sku: 'AMOX-500',
            category: 'Capsule',
            description: 'Antibiotic for bacterial infections',
            unit_price: 25.00,
            selling_price: 75.00,
            current_stock: 500,
            reorder_level: 100,
            reorder_quantity: 500,
            unit_measure: 'capsule',
            preferred_supplier_id: getSupplierId(0)
        },
        {
            name: 'Metformin 500mg',
            generic_name: 'Metformin Hydrochloride',
            sku: 'MET-500',
            category: 'Tablet',
            description: 'Oral diabetes medicine',
            unit_price: 15.00,
            selling_price: 45.00,
            current_stock: 300,
            reorder_level: 100,
            reorder_quantity: 300,
            unit_measure: 'tablet',
            preferred_supplier_id: getSupplierId(1)
        },
        {
            name: 'Ibuprofen 400mg',
            generic_name: 'Ibuprofen',
            sku: 'IBU-400',
            category: 'Tablet',
            description: 'Nonsteroidal anti-inflammatory drug (NSAID)',
            unit_price: 10.00,
            selling_price: 30.00,
            current_stock: 50, // Low stock for testing alerts
            reorder_level: 100,
            reorder_quantity: 500,
            unit_measure: 'tablet',
            preferred_supplier_id: getSupplierId(1)
        },
        {
            name: 'Ciprofloxacin 500mg',
            generic_name: 'Ciprofloxacin',
            sku: 'CIPRO-500',
            category: 'Tablet',
            description: 'Antibiotic',
            unit_price: 40.00,
            selling_price: 120.00,
            current_stock: 200,
            reorder_level: 50,
            reorder_quantity: 200,
            unit_measure: 'tablet',
            preferred_supplier_id: getSupplierId(2)
        },
        {
            name: 'Insulin Glargine',
            generic_name: 'Insulin Glargine',
            sku: 'INS-GLA',
            category: 'Injection',
            description: 'Long-acting insulin',
            unit_price: 2500.00,
            selling_price: 5000.00,
            current_stock: 20,
            reorder_level: 10,
            reorder_quantity: 20,
            unit_measure: 'vial',
            preferred_supplier_id: getSupplierId(2)
        }
    ]).returning('*');

    // 3. Insert Inventory Batches
    const today = new Date();
    const nextMonth = new Date(today); nextMonth.setMonth(today.getMonth() + 1);
    const sixMonths = new Date(today); sixMonths.setMonth(today.getMonth() + 6);
    const oneYear = new Date(today); oneYear.setFullYear(today.getFullYear() + 1);

    for (const item of items) {
        // Create 2 batches for each item
        await knex('inventory_batches').insert([
            {
                item_id: item.id,
                batch_number: `B-${item.sku}-001`,
                quantity: Math.floor(item.current_stock / 2),
                remaining_quantity: Math.floor(item.current_stock / 2),
                expiry_date: oneYear, // Good expiry
                received_date: new Date(),
                supplier_id: item.preferred_supplier_id
            },
            {
                item_id: item.id,
                batch_number: `B-${item.sku}-002`,
                quantity: Math.ceil(item.current_stock / 2),
                remaining_quantity: Math.ceil(item.current_stock / 2),
                expiry_date: item.sku === 'AMOX-500' ? nextMonth : sixMonths, // Amoxicillin near expiry
                received_date: new Date(),
                supplier_id: item.preferred_supplier_id
            }
        ]);
    }

    // 4. Insert Initial Stock Movements (Opening Stock)
    // Get admin user for "performed_by"
    const admin = await knex('users').where('role', 'admin').first();
    const adminId = admin ? admin.id : null;

    if (adminId) {
        const movements = items.map(item => ({
            item_id: item.id,
            type: 'IN',
            quantity: item.current_stock,
            previous_stock: 0,
            new_stock: item.current_stock,
            reference_type: 'Initial Seed',
            performed_by: adminId,
            notes: 'Opening stock'
        }));
        await knex('stock_movements').insert(movements);
    }

    console.log('Inventory data seeded successfully!');
}
