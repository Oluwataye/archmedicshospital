import { Router } from 'express';
import db from '../db';
import { auth, authorize } from '../middleware/auth';

const router = Router();

// Get patient wallet balance
router.get('/wallet/:patientId', auth, async (req, res) => {
    try {
        const { patientId } = req.params;

        let wallet = await db('patient_wallets')
            .where({ patient_id: patientId })
            .first();

        if (!wallet) {
            // Create wallet if it doesn't exist
            const [walletId] = await db('patient_wallets').insert({
                patient_id: patientId,
                balance: 0.00
            });

            wallet = await db('patient_wallets').where({ id: walletId }).first();
        }

        res.json(wallet);
    } catch (error) {
        console.error('Error fetching wallet:', error);
        res.status(500).json({ error: 'Failed to fetch wallet balance' });
    }
});

// Create deposit
router.post('/', auth, authorize(['cashier', 'admin']), async (req, res) => {
    try {
        const { patient_id, amount, payment_method, description } = req.body;
        const userId = (req as any).user.id;

        if (!patient_id || !amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid deposit data' });
        }

        // Generate reference number
        const referenceNumber = `DEP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

        // Create deposit record
        const [depositId] = await db('patient_deposits').insert({
            patient_id,
            amount,
            payment_method,
            transaction_type: 'deposit',
            reference_number: referenceNumber,
            description,
            processed_by: userId,
            status: 'completed'
        });

        // Update or create wallet
        const wallet = await db('patient_wallets')
            .where({ patient_id })
            .first();

        if (wallet) {
            await db('patient_wallets')
                .where({ patient_id })
                .update({
                    balance: db.raw('balance + ?', [amount]),
                    last_transaction_id: depositId,
                    last_updated: db.fn.now()
                });
        } else {
            await db('patient_wallets').insert({
                patient_id,
                balance: amount,
                last_transaction_id: depositId
            });
        }

        const deposit = await db('patient_deposits').where({ id: depositId }).first();
        const updatedWallet = await db('patient_wallets').where({ patient_id }).first();

        res.status(201).json({
            deposit,
            wallet: updatedWallet
        });
    } catch (error) {
        console.error('Error creating deposit:', error);
        res.status(500).json({ error: 'Failed to create deposit' });
    }
});

// Get deposits history
router.get('/', auth, async (req, res) => {
    try {
        const { patient_id, start_date, end_date, limit = 50 } = req.query;

        let query = db('patient_deposits')
            .select(
                'patient_deposits.*',
                'patients.first_name',
                'patients.last_name',
                'patients.mrn',
                'users.firstName as cashier_first_name',
                'users.lastName as cashier_last_name'
            )
            .leftJoin('patients', 'patient_deposits.patient_id', 'patients.id')
            .leftJoin('users', 'patient_deposits.processed_by', 'users.id')
            .orderBy('patient_deposits.created_at', 'desc')
            .limit(parseInt(limit as string));

        if (patient_id) {
            query = query.where('patient_deposits.patient_id', patient_id);
        }

        if (start_date) {
            query = query.where('patient_deposits.created_at', '>=', start_date);
        }

        if (end_date) {
            query = query.where('patient_deposits.created_at', '<=', end_date);
        }

        const deposits = await query;

        res.json(deposits);
    } catch (error) {
        console.error('Error fetching deposits:', error);
        res.status(500).json({ error: 'Failed to fetch deposits' });
    }
});

// Deduct from wallet (for payments)
router.post('/deduct', auth, authorize(['cashier', 'admin']), async (req, res) => {
    try {
        const { patient_id, amount, description, reference_number } = req.body;
        const userId = (req as any).user.id;

        if (!patient_id || !amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid deduction data' });
        }

        // Check wallet balance
        const wallet = await db('patient_wallets')
            .where({ patient_id })
            .first();

        if (!wallet || wallet.balance < amount) {
            return res.status(400).json({ error: 'Insufficient wallet balance' });
        }

        // Create deduction record
        const [deductionId] = await db('patient_deposits').insert({
            patient_id,
            amount: -amount,
            payment_method: 'wallet',
            transaction_type: 'deduction',
            reference_number,
            description,
            processed_by: userId,
            status: 'completed'
        });

        // Update wallet
        await db('patient_wallets')
            .where({ patient_id })
            .update({
                balance: db.raw('balance - ?', [amount]),
                last_transaction_id: deductionId,
                last_updated: db.fn.now()
            });

        const deduction = await db('patient_deposits').where({ id: deductionId }).first();
        const updatedWallet = await db('patient_wallets').where({ patient_id }).first();

        res.status(201).json({
            deduction,
            wallet: updatedWallet
        });
    } catch (error) {
        console.error('Error processing deduction:', error);
        res.status(500).json({ error: 'Failed to process deduction' });
    }
});

export default router;
