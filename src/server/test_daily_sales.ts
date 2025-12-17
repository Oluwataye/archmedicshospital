import db from './db';

async function testDailySales() {
    try {
        const targetDate = new Date().toISOString().split('T')[0];
        console.log('Testing daily-sales query for date:', targetDate);

        console.log('\n1. Testing transactions query...');
        const transactions = await db('transactions')
            .leftJoin('users', 'transactions.cashier_id', 'users.id')
            .leftJoin('patients', 'transactions.patient_id', 'patients.id')
            .select(
                'transactions.*',
                'users.name as cashier_name',
                'patients.first_name',
                'patients.last_name'
            )
            .whereRaw('date(transactions.transaction_date) = ?', [targetDate])
            .where('transactions.voided', 0)
            .orderBy('transactions.transaction_date', 'desc')
            .limit(5);

        console.log('SUCCESS! Found', transactions.length, 'transactions');
        console.log('Sample:', JSON.stringify(transactions[0], null, 2));

    } catch (error: any) {
        console.error('ERROR:', error.message);
        console.error('Stack:', error.stack);
    } finally {
        process.exit();
    }
}

testDailySales();
