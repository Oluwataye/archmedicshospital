
import db from './src/server/db.ts';

async function checkTransactions() {
    try {
        const exists = await db.schema.hasTable('transactions');
        console.log('Transactions table exists:', exists);

        if (exists) {
            const count = await db('transactions').count('* as count').first();
            console.log('Total transactions:', count?.count);

            const recent = await db('transactions').orderBy('created_at', 'desc').limit(5);
            console.log('Recent transactions:', JSON.stringify(recent, null, 2));
        }

        const salesExists = await db.schema.hasTable('sales_tracking');
        console.log('Sales Tracking table exists:', salesExists);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkTransactions();
