import express from 'express';
import { auth } from '../middleware/auth';
import db from '../db';

const router = express.Router();

// Daily Sales Report
router.get('/daily-sales', auth, async (req, res) => {
    try {
        const { date } = req.query;
        const targetDate = date ? String(date) : new Date().toISOString().split('T')[0];
        console.log(`Daily Sales Report Request - Date Param: ${date}, Target Date: ${targetDate}`);

        const transactions = await db('transactions')
            .leftJoin('users', 'transactions.cashier_id', 'users.id')
            .leftJoin('patients', 'transactions.patient_id', 'patients.id')
            .select(
                'transactions.*',
                'users.first_name as cashier_first_name',
                'users.last_name as cashier_last_name',
                'patients.first_name',
                'patients.last_name'
            )
            .whereRaw('substr(transactions.transaction_date, 1, 10) = ?', [targetDate])
            .where('transactions.voided', 0)
            .orderBy('transactions.transaction_date', 'desc');

        console.log(`Found ${transactions.length} transactions for date ${targetDate}`);

        const summaryResult: any = await db('transactions')
            .whereRaw('substr(transaction_date, 1, 10) = ?', [targetDate])
            .where('voided', 0)
            .select(
                db.raw('COUNT(id) as total_transactions'),
                db.raw('SUM(total_amount) as total_revenue'),
                db.raw("SUM(CASE WHEN payment_method = 'Cash' THEN total_amount ELSE 0 END) as cash_total"),
                db.raw("SUM(CASE WHEN payment_method = 'Card' THEN total_amount ELSE 0 END) as card_total"),
                db.raw("SUM(CASE WHEN payment_method = 'Transfer' THEN total_amount ELSE 0 END) as transfer_total"),
                db.raw("SUM(CASE WHEN payment_method = 'HMO' THEN total_amount ELSE 0 END) as hmo_total")
            )
            .first();

        // Ensure summary has default values if null
        const summary = {
            total_transactions: summaryResult?.total_transactions || 0,
            total_revenue: summaryResult?.total_revenue || 0,
            cash_total: summaryResult?.cash_total || 0,
            card_total: summaryResult?.card_total || 0,
            transfer_total: summaryResult?.transfer_total || 0,
            hmo_total: summaryResult?.hmo_total || 0
        };

        res.json({
            date: targetDate,
            summary,
            transactions: transactions.map((tx: any) => ({
                ...tx,
                cashier_name: tx.cashier_first_name ? `${tx.cashier_first_name} ${tx.cashier_last_name}` : 'Unknown Cashier',
                patient_name: tx.first_name ? `${tx.first_name} ${tx.last_name}` : 'Walk-in Customer'
            }))
        });
    } catch (error) {
        console.error('Error fetching daily sales report:', error);
        // Return default empty structure instead of 500
        res.json({
            date: new Date().toISOString().split('T')[0],
            summary: {
                total_transactions: 0,
                total_revenue: 0,
                cash_total: 0,
                card_total: 0,
                transfer_total: 0,
                hmo_total: 0
            },
            transactions: []
        });
    }
});

// Cashier Reconciliation Report
router.get('/cashier-reconciliation', auth, async (req, res) => {
    try {
        const { startDate, endDate, cashierId } = req.query;

        let query = db('transactions')
            .leftJoin('users', 'transactions.cashier_id', 'users.id')
            .select(
                'users.first_name as cashier_first_name',
                'users.last_name as cashier_last_name',
                'users.id as cashier_id',
                db.raw('COUNT(transactions.id) as total_transactions'),
                db.raw('SUM(transactions.total_amount) as total_revenue'),
                db.raw("SUM(CASE WHEN transactions.payment_method = 'Cash' THEN transactions.total_amount ELSE 0 END) as cash_total"),
                db.raw("SUM(CASE WHEN transactions.payment_method = 'Card' THEN transactions.total_amount ELSE 0 END) as card_total"),
                db.raw("SUM(CASE WHEN transactions.payment_method = 'Transfer' THEN transactions.total_amount ELSE 0 END) as transfer_total"),
                db.raw("SUM(CASE WHEN transactions.payment_method = 'HMO' THEN transactions.total_amount ELSE 0 END) as hmo_total")
            )
            .where('transactions.voided', 0)
            .groupBy('users.id', 'users.first_name', 'users.last_name');

        if (startDate && endDate) {
            query = query.whereBetween('transactions.transaction_date', [startDate, endDate]);
        }

        if (cashierId && cashierId !== 'all') {
            query = query.where('transactions.cashier_id', cashierId);
        }

        const report = await query;

        // Ensure we handle null cashier names (orphaned transactions)
        const formattedReport = report.map((row: any) => ({
            ...row,
            cashier_name: row.cashier_first_name ? `${row.cashier_first_name} ${row.cashier_last_name}` : 'Unknown Cashier'
        }));

        res.json(formattedReport);
    } catch (error) {
        console.error('Error fetching cashier reconciliation report:', error);
        res.json([]);
    }
});

// Revenue by Service Report
router.get('/revenue-by-service', auth, async (req, res) => {
    try {
        const { startDate, endDate, category } = req.query;

        let query = db('transaction_items')
            .join('transactions', 'transaction_items.transaction_id', 'transactions.id')
            .join('services', 'transaction_items.service_id', 'services.id')
            .select(
                'services.name as service_name',
                'services.category',
                db.raw('SUM(transaction_items.quantity) as quantity_sold'),
                db.raw('SUM(transaction_items.total_price) as total_revenue')
            )
            .where('transactions.voided', 0)
            .groupBy('services.id', 'services.name', 'services.category')
            .orderBy('total_revenue', 'desc');

        if (startDate && endDate) {
            query = query.whereBetween('transactions.transaction_date', [startDate, endDate]);
        }

        if (category && category !== 'all') {
            query = query.where('services.category', category);
        }

        const report = await query;
        res.json(report);
    } catch (error) {
        console.error('Error fetching revenue by service report:', error);
        res.status(500).json({ error: 'Failed to fetch revenue by service report' });
    }
});

// Revenue by Department Report
router.get('/revenue-by-department', auth, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        let query = db('transaction_items')
            .join('transactions', 'transaction_items.transaction_id', 'transactions.id')
            .join('services', 'transaction_items.service_id', 'services.id')
            .select(
                'services.department',
                db.raw('COUNT(DISTINCT transactions.id) as transaction_count'),
                db.raw('SUM(transaction_items.total_price) as total_revenue')
            )
            .where('transactions.voided', 0)
            .whereNotNull('services.department')
            .groupBy('services.department')
            .orderBy('total_revenue', 'desc');

        if (startDate && endDate) {
            query = query.whereBetween('transactions.transaction_date', [startDate, endDate]);
        }

        const report = await query;
        res.json(report);
    } catch (error) {
        console.error('Error fetching revenue by department report:', error);
        res.status(500).json({ error: 'Failed to fetch revenue by department report' });
    }
});

// Refunds and Voids Report
router.get('/refunds-voids', auth, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Voids
        let voidsQuery = db('transactions')
            .leftJoin('users', 'transactions.voided_by', 'users.id')
            .select(
                'transactions.invoice_number',
                'transactions.total_amount',
                'transactions.void_reason as reason',
                'transactions.voided_at as date',
                'users.first_name',
                'users.last_name',
                db.raw('"Void" as type')
            )
            .where('transactions.voided', 1);

        // Refunds
        let refundsQuery = db('refunds')
            .leftJoin('transactions', 'refunds.transaction_id', 'transactions.id')
            .leftJoin('users', 'refunds.approved_by', 'users.id')
            .select(
                'transactions.invoice_number',
                'refunds.amount as total_amount',
                'refunds.reason',
                'refunds.approved_at as date',
                'users.first_name',
                'users.last_name',
                db.raw('"Refund" as type')
            )
            .where('refunds.status', 'approved');

        if (startDate && endDate) {
            voidsQuery = voidsQuery.whereBetween('transactions.voided_at', [startDate, endDate]);
            refundsQuery = refundsQuery.whereBetween('refunds.approved_at', [startDate, endDate]);
        }

        const [voids, refunds] = await Promise.all([voidsQuery, refundsQuery]);

        // Combine and sort
        const report = [...voids, ...refunds].map((item: any) => ({
            ...item,
            processed_by: item.first_name ? `${item.first_name} ${item.last_name}` : 'Unknown User'
        })).sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        res.json(report);
    } catch (error) {
        console.error('Error fetching refunds and voids report:', error);
        res.json([]);
    }
});

export default router;
