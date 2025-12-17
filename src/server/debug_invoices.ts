
import db from './db';

const PATIENT_ID = 'c3e6f190-dfba-40b3-8d5b-b998fd95f79b'; // Innocent Ojo

async function checkInvoices() {
    try {
        console.log(`Checking invoices for patient: ${PATIENT_ID}`);

        const invoices = await db('invoices')
            .where('patient_id', PATIENT_ID)
            .select('*');

        console.log(`Found ${invoices.length} invoices.`);

        for (const invoice of invoices) {
            console.log(`Invoice ${invoice.id} (${invoice.invoice_number}): Status=${invoice.status}, Amount=${invoice.total_amount}`);

            const items = await db('invoice_items')
                .where('invoice_id', invoice.id)
                .select('*');

            console.log(`  - Items (${items.length}):`);
            items.forEach((item: any) => {
                console.log(`    - [${item.id}] ${item.description || item.service_name} (Qty: ${item.quantity}, Price: ${item.unit_price})`);
            });
        }
    } catch (error) {
        console.error('Error checking invoices:', error);
    } finally {
        process.exit();
    }
}

checkInvoices();
