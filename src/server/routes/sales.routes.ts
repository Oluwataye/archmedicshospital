import { Router } from 'express';
import db from '../db';
import { auth, authorize } from '../middleware/auth';

const router = Router();

// Get sales summary
router.get('/summary', auth, authorize(['cashier', 'admin']), async (req, res) => {
    try {
        const { start_date, end_date, cashier_id } = req.query;
        const userId = (req as any).user.id;
        const userRole = (req as any).user.role;

        let query = db('payments')
            .select(
                db.raw('COUNT(*) as total_transactions'),
                db.raw('SUM(amount) as total_sales'),
                db.raw('AVG(amount) as average_transaction'),
                db.raw("SUM(CASE WHEN payment_method = 'cash' THEN amount ELSE 0 END) as cash_sales"),
                db.raw("SUM(CASE WHEN payment_method = 'card' OR payment_method = 'credit_card' THEN amount ELSE 0 END) as card_sales"),
                db.raw("SUM(CASE WHEN payment_method = 'insurance' OR payment_method = 'hmo' THEN amount ELSE 0 END) as insurance_sales")
            )
            .where('status', 'completed');

        // If cashier, only show their own sales unless admin
        if (userRole === 'cashier' && !cashier_id) {
            // TODO: Add cashier_id to payments table
            // query = query.where('cashier_id', userId);
        } else if (cashier_id) {
            // query = query.where('cashier_id', cashier_id);
        }

        if (start_date) {
            query = query.where('payment_date', '>=', start_date);
        }

        if (end_date) {
            query = query.where('payment_date', '<=', end_date);
        }

        const [summary] = await query;
        const result = summary as any;

        res.json({
            totalSales: parseFloat(result?.total_sales) || 0,
            totalTransactions: parseInt(result?.total_transactions) || 0,
            averageTransaction: parseFloat(result?.average_transaction) || 0,
            cashSales: parseFloat(result?.cash_sales) || 0,
            cardSales: parseFloat(result?.card_sales) || 0,
            insuranceSales: parseFloat(result?.insurance_sales) || 0
        });
    } catch (error) {
        console.error('Error fetching sales summary:', error);
        res.status(500).json({ error: 'Failed to fetch sales summary' });
    }
});

// Get sales by department
router.get('/by-department', auth, authorize(['cashier', 'admin']), async (req, res) => {
    try {
        const { start_date, end_date } = req.query;

        let query = db('sales_tracking')
            .select(
                'departments.id as department_id',
                'departments.name as department_name',
                db.raw('COUNT(*) as transaction_count'),
                db.raw('SUM(sales_tracking.amount) as total_sales'),
                db.raw('AVG(sales_tracking.amount) as average_sale')
            )
            .leftJoin('departments', 'sales_tracking.department_id', 'departments.id')
            .groupBy('departments.id', 'departments.name')
            .orderBy('total_sales', 'desc');

        if (start_date) {
            query = query.where('sales_tracking.transaction_date', '>=', start_date);
        }

        if (end_date) {
            query = query.where('sales_tracking.transaction_date', '<=', end_date);
        }

        const sales = await query;

        res.json(sales.map(s => ({
            departmentId: s.department_id,
            departmentName: s.department_name || 'Unassigned',
            transactionCount: parseInt(s.transaction_count),
            totalSales: parseFloat(s.total_sales) || 0,
            averageSale: parseFloat(s.average_sale) || 0
        })));
    } catch (error) {
        console.error('Error fetching sales by department:', error);
        res.status(500).json({ error: 'Failed to fetch sales by department' });
    }
});

// Get sales by ward/unit
router.get('/by-ward', auth, authorize(['cashier', 'admin']), async (req, res) => {
    try {
        const { start_date, end_date, department_id } = req.query;

        let query = db('sales_tracking')
            .select(
                'wards.id as ward_id',
                'wards.name as ward_name',
                'departments.name as department_name',
                db.raw('COUNT(*) as transaction_count'),
                db.raw('SUM(sales_tracking.amount) as total_sales'),
                db.raw('AVG(sales_tracking.amount) as average_sale')
            )
            .leftJoin('wards', 'sales_tracking.ward_id', 'wards.id')
            //.leftJoin('departments', 'wards.department_id', 'departments.id') // Wards table might not have department_id based on schema I saw?
            // Checking schema 20251130072654...: wards has name, type, capacity... NO department_id!
            // So we can't join department from wards directly unless we added it elsewhere.
            // But sales_tracking HAS department_id. So we can join department from there?
            // "leftJoin('departments', 'units.department_id'..." was previous code.
            // If wards doesn't have department_id, we should use sales_tracking.department_id.
            .leftJoin('departments', 'sales_tracking.department_id', 'departments.id')
            .groupBy('wards.id', 'wards.name', 'departments.name')
            .orderBy('total_sales', 'desc');

        if (start_date) {
            query = query.where('sales_tracking.transaction_date', '>=', start_date);
        }

        if (end_date) {
            query = query.where('sales_tracking.transaction_date', '<=', end_date);
        }

        if (department_id) {
            query = query.where('sales_tracking.department_id', department_id);
        }

        const sales = await query;

        res.json(sales.map(s => ({
            wardId: s.ward_id,
            wardName: s.ward_name || 'Unassigned',
            departmentName: s.department_name,
            transactionCount: parseInt(s.transaction_count),
            totalSales: parseFloat(s.total_sales) || 0,
            averageSale: parseFloat(s.average_sale) || 0
        })));
    } catch (error) {
        console.error('Error fetching sales by ward:', error);
        res.status(500).json({ error: 'Failed to fetch sales by ward' });
    }
});

// Track a sale (called when payment is processed)
router.post('/track', auth, authorize(['cashier', 'admin']), async (req, res) => {
    try {
        const { payment_id, invoice_id, department_id, unit_id, amount, payment_method } = req.body;
        const userId = (req as any).user.id;

        const [trackingId] = await db('sales_tracking').insert({
            transaction_date: new Date().toISOString().split('T')[0],
            department_id,
            ward_id: unit_id, // Map payload unit_id to ward_id
            payment_id,
            invoice_id,
            amount,
            payment_method,
            cashier_id: userId
        });

        const tracking = await db('sales_tracking').where({ id: trackingId }).first();

        res.status(201).json(tracking);
    } catch (error) {
        console.error('Error tracking sale:', error);
        res.status(500).json({ error: 'Failed to track sale' });
    }
});

export default router;
