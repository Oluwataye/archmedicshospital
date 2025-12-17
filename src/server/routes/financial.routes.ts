import express from 'express';
import { auth } from '../middleware/auth';
import db from '../db';

const router = express.Router();

// Get financial dashboard metrics
router.get('/dashboard', auth, async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
        const startOfWeek = new Date(new Date().setDate(new Date().getDate() - new Date().getDay())).toISOString().split('T')[0];

        // Today's Revenue
        const todayRevenue = await db('transactions')
            .where('transaction_date', 'like', `${today}%`)
            .where('payment_status', 'completed')
            .where('voided', 0)
            .sum('total_amount as total')
            .first();

        // This Week's Revenue
        const weekRevenue = await db('transactions')
            .whereRaw('date(transaction_date) >= ?', [startOfWeek])
            .where('payment_status', 'completed')
            .where('voided', 0)
            .sum('total_amount as total')
            .first();

        // This Month's Revenue
        const monthRevenue = await db('transactions')
            .whereRaw('date(transaction_date) >= ?', [startOfMonth])
            .where('payment_status', 'completed')
            .where('voided', 0)
            .sum('total_amount as total')
            .first();

        // Transaction Count Today
        const todayTxCount = await db('transactions')
            .where('transaction_date', 'like', `${today}%`)
            .where('voided', 0)
            .count('id as count')
            .first();

        // Pending Refunds
        const pendingRefunds = await db('refunds')
            .where('status', 'pending')
            .count('id as count')
            .first();

        // Active Cashiers Today
        const activeCashiers = await db('transactions')
            .whereRaw('date(transaction_date) = ?', [today])
            .distinct('cashier_id')
            .count('cashier_id as count')
            .first();

        res.json({
            todayRevenue: todayRevenue?.total || 0,
            weekRevenue: weekRevenue?.total || 0,
            monthRevenue: monthRevenue?.total || 0,
            todayTransactionCount: todayTxCount?.count || 0,
            pendingRefundsCount: pendingRefunds?.count || 0,
            activeCashiersCount: activeCashiers?.count || 0
        });
    } catch (error) {
        console.error('Error fetching financial dashboard metrics:', error);
        res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
    }
});

// Get revenue chart data
router.get('/revenue-chart', auth, async (req, res) => {
    try {
        const { period } = req.query; // 'week', 'month', 'year'
        let groupBy, dateFormat, limit;

        if (period === 'month') {
            groupBy = "strftime('%Y-%m-%d', transaction_date)";
            dateFormat = 'YYYY-MM-DD';
            limit = 30;
        } else if (period === 'year') {
            groupBy = "strftime('%Y-%m', transaction_date)";
            dateFormat = 'YYYY-MM';
            limit = 12;
        } else {
            // Default to week (last 7 days)
            groupBy = "strftime('%Y-%m-%d', transaction_date)";
            dateFormat = 'YYYY-MM-DD';
            limit = 7;
        }

        const revenueData = await db('transactions')
            .select(db.raw(`${groupBy} as date`), db.raw('SUM(total_amount) as revenue'))
            .where('payment_status', 'completed')
            .where('voided', 0)
            .groupByRaw(groupBy)
            .orderBy('date', 'asc')
            .limit(limit);

        res.json(revenueData);
    } catch (error) {
        console.error('Error fetching revenue chart data:', error);
        res.status(500).json({ error: 'Failed to fetch revenue chart data' });
    }
});

// Get payment method breakdown
router.get('/payment-methods', auth, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        let query = db('transactions')
            .select('payment_method')
            .count('id as count')
            .sum('total_amount as total')
            .where('payment_status', 'completed')
            .where('voided', 0)
            .groupBy('payment_method');

        if (startDate && endDate) {
            query = query.whereBetween('transaction_date', [startDate, endDate]);
        }

        const methods = await query;
        res.json(methods);
    } catch (error) {
        console.error('Error fetching payment methods:', error);
        res.status(500).json({ error: 'Failed to fetch payment methods' });
    }
});

// Get top performing services
router.get('/top-services', auth, async (req, res) => {
    try {
        const topServices = await db('transaction_items')
            .join('transactions', 'transaction_items.transaction_id', 'transactions.id')
            .select('transaction_items.service_name')
            .sum('transaction_items.quantity as quantity')
            .sum('transaction_items.total_price as revenue')
            .where('transactions.voided', 0)
            .groupBy('transaction_items.service_name')
            .orderBy('revenue', 'desc')
            .limit(5);

        res.json(topServices);
    } catch (error) {
        console.error('Error fetching top services:', error);
        res.status(500).json({ error: 'Failed to fetch top services' });
    }
});

// Get cashier performance summary
router.get('/cashier-performance', auth, async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        const performance = await db('transactions')
            .join('users', 'transactions.cashier_id', 'users.id')
            .select(
                'users.name as cashier_name',
                db.raw('COUNT(transactions.id) as transaction_count'),
                db.raw('SUM(transactions.total_amount) as total_revenue')
            )
            .where('transactions.transaction_date', 'like', `${today}%`)
            .where('transactions.voided', 0)
            .groupBy('users.id', 'users.name')
            .orderBy('total_revenue', 'desc');

        res.json(performance);
    } catch (error) {
        console.error('Error fetching cashier performance:', error);
        // Return empty array instead of 500 to prevent UI breaking
        res.json([]);
    }
});

export default router;
