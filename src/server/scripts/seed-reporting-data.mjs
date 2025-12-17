import { db } from '../db/index';

async function seedTransactions() {
  try {
    console.log('Seeding test transactions...');

    // Get services with departments
    const services = await db('services').select('*');
    if (services.length === 0) {
      console.log('No services found. Run seed script first.');
      return;
    }

    const depts = ['Pharmacy', 'Laboratory', 'Radiology', 'Consultation', 'Nursing'];
    
    // Create transactions for last 30 days
    for (let i = 0; i < 50; i++) {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));
        
        const service = services[Math.floor(Math.random() * services.length)];
        // Force a department if null
        const department = service.department || depts[Math.floor(Math.random() * depts.length)];
        
        // Ensure service has department for test
        if (!service.department) {
            await db('services').where({ id: service.id }).update({ department });
        }

        const amount = service.base_price || 5000;
        
        // Create Transaction
        const [txId] = await db('transactions').insert({
            transaction_date: date,
            total_amount: amount,
            payment_method: 'cash',
            payment_status: 'completed',
            voided: false
        });

        // Link Item
        await db('transaction_items').insert({
            transaction_id: txId,
            service_id: service.id,
            service_name: service.name,
            unit_price: amount,
            quantity: 1,
            total_price: amount,
            type: 'service'
        });
    }

    console.log('✅ Seeded 50 test transactions across departments');
  } catch (err) {
    console.error('Error seeding transactions:', err);
  } finally {
    process.exit();
  }
}

seedTransactions();
