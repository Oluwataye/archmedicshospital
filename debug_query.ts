const db = require('./src/server/db').default;
const { log } = require('./src/server/utils/logger'); // Mock or use if available, or just console

async function testQuery() {
    try {
        const targetDate = new Date().toISOString().split('T')[0];
        console.log('Target Date:', targetDate);

        const transactions = await db('transactions')
            .select('*')
            .where('transaction_date', 'like', `${targetDate}%`)
            .where('voided', 0);

        console.log('Found Transactions:', transactions.length);
        if (transactions.length > 0) console.log(transactions[0]);

        const summaryResult = await db('transactions')
            .where('transaction_date', 'like', `${targetDate}%`)
            .where('voided', 0) // Try removing this if 0 fails
            .select(
                db.raw('COUNT(id) as total_transactions'),
                db.raw('SUM(total_amount) as total_revenue')
            )
            .first();

        console.log('Summary:', summaryResult);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

testQuery();
