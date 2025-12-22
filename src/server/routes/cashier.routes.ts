import express from 'express';
import { auth } from '../middleware/auth';
import db from '../db';

const router = express.Router();

// Get live transaction feed
router.get('/live', auth, async (req, res) => {
    try {
        const { limit = 20 } = req.query;

        const transactions = await db('transactions')
            .leftJoin('users', 'transactions.cashier_id', 'users.id')
            .leftJoin('patients', 'transactions.patient_id', 'patients.id')
            .select(
                'transactions.*',
                'users.name as cashier_name',
                'patients.first_name',
                'patients.last_name'
            )
            .orderBy('transactions.transaction_date', 'desc')
            .limit(Number(limit));

        // Format patient name
        const formattedTransactions = transactions.map((tx: any) => ({
            ...tx,
            patient_name: tx.first_name ? `${tx.first_name} ${tx.last_name}` : 'Walk-in Customer'
        }));

        res.json(formattedTransactions);
    } catch (error) {
        console.error('Error fetching live transactions:', error);
        // Return empty array instead of 500 to prevent UI breaking
        res.json([]);
    }
});

// Get transactions by cashier
router.get('/cashier/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { startDate, endDate } = req.query;

        let query = db('transactions')
            .leftJoin('users', 'transactions.cashier_id', 'users.id')
            .leftJoin('patients', 'transactions.patient_id', 'patients.id')
            .select(
                'transactions.*',
                'users.name as cashier_name',
                'patients.first_name',
                'patients.last_name'
            )
            .where('transactions.cashier_id', id)
            .orderBy('transactions.transaction_date', 'desc');

        if (startDate && endDate) {
            query = query.whereBetween('transactions.transaction_date', [startDate, endDate]);
        }

        const transactions = await query;

        const formattedTransactions = transactions.map((tx: any) => ({
            ...tx,
            patient_name: tx.first_name ? `${tx.first_name} ${tx.last_name}` : 'Walk-in Customer'
        }));

        res.json(formattedTransactions);
    } catch (error) {
        console.error('Error fetching cashier transactions:', error);
        // Return empty array instead of 500
        res.json([]);
    }
});

// Get detailed cashier performance
router.get('/performance', auth, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        let query = db('transactions')
            .leftJoin('users', 'transactions.cashier_id', 'users.id')
            .select(
                'users.id',
                'users.name',
                db.raw('COUNT(transactions.id) as total_transactions'),
                db.raw('SUM(transactions.total_amount) as total_revenue'),
                db.raw('AVG(transactions.total_amount) as avg_transaction_value'),
                db.raw('SUM(CASE WHEN transactions.payment_method = "Cash" THEN transactions.total_amount ELSE 0 END) as cash_total'),
                db.raw('SUM(CASE WHEN transactions.payment_method = "Card" THEN transactions.total_amount ELSE 0 END) as card_total'),
                db.raw('SUM(CASE WHEN transactions.payment_method = "Transfer" THEN transactions.total_amount ELSE 0 END) as transfer_total')
            )
            .where('transactions.voided', false)
            .groupBy('users.id', 'users.name');

        if (startDate && endDate) {
            query = query.whereBetween('transactions.transaction_date', [startDate, endDate]);
        }

        const performance = await query;
        res.json(performance);
    } catch (error) {
        console.error('Error fetching cashier performance:', error);
        // Return empty array instead of 500
        res.json([]);
    }
});

// Get transaction details with items
router.get('/:id/details', auth, async (req, res) => {
    try {
        const { id } = req.params;

        const transaction = await db('transactions')
            .leftJoin('users', 'transactions.cashier_id', 'users.id')
            .leftJoin('patients', 'transactions.patient_id', 'patients.id')
            .select(
                'transactions.*',
                'users.name as cashier_name',
                'patients.first_name',
                'patients.last_name'
            )
            .where('transactions.id', id)
            .first();

        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        const items = await db('transaction_items')
            .where('transaction_id', id);

        res.json({
            ...transaction,
            patient_name: transaction.first_name ? `${transaction.first_name} ${transaction.last_name}` : 'Walk-in Customer',
            items
        });
    } catch (error) {
        console.error('Error fetching transaction details:', error);
        res.status(500).json({ error: 'Failed to fetch transaction details' });
    }
});

export default router;
