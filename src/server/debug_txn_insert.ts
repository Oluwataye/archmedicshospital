
import db from './db';

async function testInsert() {
    try {
        const user = await db('users').first();
        const cashierId = user ? user.id : null;
        console.log("Using Cashier ID:", cashierId);

        console.log("Attempting transaction insert...");

        await db('transactions').insert({
            transaction_date: new Date().toISOString(),
            total_amount: 7453.5,
            payment_method: 'Cash',
            cashier_id: cashierId,

            patient_id: "c3e6f190-dfba-40b3-8d5b-b998fd95f79b", // Innocent Ojo (Verified exists)

            reference_number: "INV-000023", // Mimic App logic
            payment_status: 'completed',
            voided: 0,
            created_at: new Date(),
            updated_at: new Date()
        });
        console.log("Insert 1 Successful!");

        // Try inserting AGAIN to check unique constraint
        await db('transactions').insert({
            transaction_date: new Date().toISOString(),
            total_amount: 100,
            payment_method: 'Cash',
            cashier_id: cashierId,
            patient_id: "c3e6f190-dfba-40b3-8d5b-b998fd95f79b",
            reference_number: "INV-000023",
            payment_status: 'completed',
            voided: 0,
            created_at: new Date(),
            updated_at: new Date()
        });
        console.log("Insert 2 Successful (No unique constraint)!");

    } catch (error: any) {
        console.error('Insert Failed:', error.message);
    } finally {
        process.exit();
    }
}

testInsert();
