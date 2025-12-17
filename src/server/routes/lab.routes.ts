import express from 'express';
import { auth } from '../middleware/auth';
import db from '../db';
import { log } from '../utils/logger';

const router = express.Router();

// Get lab results (with filters)
router.get('/', auth, async (req, res) => {
    try {
        const { patient_id, status, date_from, date_to } = req.query;

        let query = db('lab_results')
            .join('users as orderer', 'lab_results.ordered_by', 'orderer.id')
            .leftJoin('users as performer', 'lab_results.performed_by', 'performer.id')
            .select(
                'lab_results.*',
                'orderer.first_name as orderer_first_name',
                'orderer.last_name as orderer_last_name',
                'performer.first_name as performer_first_name',
                'performer.last_name as performer_last_name'
            );

        if (patient_id) {
            query = query.where('lab_results.patient_id', patient_id as string);
        }

        if (status) {
            query = query.where('lab_results.status', status as string);
        }

        if (date_from) {
            query = query.where('lab_results.order_date', '>=', date_from as string);
        }

        if (date_to) {
            query = query.where('lab_results.order_date', '<=', date_to as string);
        }

        const results = await query.orderBy('lab_results.order_date', 'desc');
        return res.json(results);
    } catch (error) {
        console.error('Error fetching lab results:', error);
        res.status(500).json({ error: 'Failed to fetch lab results' });
    }
});

// Get pending orders
router.get('/pending/orders', auth, async (req, res) => {
    try {
        const pendingOrders = await db('lab_results')
            .join('patients', 'lab_results.patient_id', 'patients.id')
            .where('lab_results.status', 'ordered')
            .select(
                'lab_results.*',
                'patients.first_name as patient_first_name',
                'patients.last_name as patient_last_name',
                'patients.mrn as patient_mrn'
            )
            .orderBy('lab_results.order_date', 'asc');
        return res.json(pendingOrders);
    } catch (error) {
        console.error('Error fetching pending lab orders:', error);
        res.status(500).json({ error: 'Failed to fetch pending lab orders' });
    }
});

// Get patient lab history
router.get('/patient/:patientId/history', auth, async (req, res) => {
    try {
        const results = await db('lab_results')
            .where('patient_id', req.params.patientId)
            .orderBy('order_date', 'desc');
        return res.json(results);
    } catch (error) {
        console.error('Error fetching patient lab history:', error);
        res.status(500).json({ error: 'Failed to fetch patient lab history' });
    }
});

// Get lab test definitions
router.get('/definitions', auth, async (req, res) => {
    try {
        const definitions = await db('lab_test_definitions').where('is_active', true).orderBy('name');
        res.json(definitions);
    } catch (error) {
        console.error('Error fetching lab definitions:', error);
        res.status(500).json({ error: 'Failed to fetch lab definitions' });
    }
});

// Create lab test definition
router.post('/definitions', auth, async (req, res) => {
    try {
        const definitionData = req.body;
        const [id] = await db('lab_test_definitions').insert(definitionData);
        const newDefinition = await db('lab_test_definitions').where({ id }).first();
        res.status(201).json(newDefinition);
    } catch (error) {
        console.error('Error creating lab definition:', error);
        res.status(500).json({ error: 'Failed to create lab definition' });
    }
});

// Get lab statistics - SIMPLIFIED to avoid date function issues
router.get('/stats/overview', auth, async (req, res) => {
    try {
        log.debug('Fetching lab stats');
        const [
            totalTests,
            pendingTests,
            completedTests,
            criticalResults
        ] = await Promise.all([
            db('lab_results').count('* as count').first(),
            db('lab_results').where('status', 'ordered').count('* as count').first(),
            db('lab_results').where('status', 'completed').count('* as count').first(),
            db('lab_results').where('is_critical', 1).where('status', 'completed').count('* as count').first()
        ]);
        log.debug('Lab stats fetched', { totalTests, pendingTests, completedTests, criticalResults });

        res.json({
            todayTests: totalTests?.count || 0,
            pendingTests: pendingTests?.count || 0,
            completedToday: completedTests?.count || 0,
            criticalResults: criticalResults?.count || 0
        });
    } catch (error) {
        console.error('[LAB STATS] Error:', error);
        console.error('[LAB STATS] Stack:', error.stack);
        res.status(500).json({ error: 'Failed to fetch lab statistics', details: error.message });
    }
});

// Get critical results
router.get('/critical/results', auth, async (req, res) => {
    try {
        log.debug('Fetching critical results');
        const criticalResults = await db('lab_results')
            .where('is_critical', 1)
            .where('status', 'completed')
            .select('*')
            .orderBy('result_date', 'desc')
            .limit(50);
        log.debug('Critical results fetched', { count: criticalResults.length });

        res.json(criticalResults);
    } catch (error) {
        console.error('[CRITICAL RESULTS] Error:', error);
        console.error('[CRITICAL RESULTS] Stack:', error.stack);
        res.status(500).json({ error: 'Failed to fetch critical results', details: error.message });
    }
});

// Get completed results
router.get('/completed/results', auth, async (req, res) => {
    try {
        const completedResults = await db('lab_results')
            .join('patients', 'lab_results.patient_id', 'patients.id')
            .where('lab_results.status', 'completed')
            .select(
                'lab_results.*',
                'patients.first_name as patient_first_name',
                'patients.last_name as patient_last_name',
                'patients.mrn as patient_mrn'
            )
            .orderBy('lab_results.result_date', 'desc')
            .limit(100);

        res.json(completedResults);
    } catch (error) {
        console.error('Error fetching completed results:', error);
        res.status(500).json({ error: 'Failed to fetch completed results' });
    }
});

// Get single lab result
router.get('/:id', auth, async (req, res) => {
    try {
        const result = await db('lab_results')
            .where('id', req.params.id)
            .first();

        if (!result) {
            return res.status(404).json({ error: 'Lab result not found' });
        }

        return res.json(result);
    } catch (error) {
        console.error('Error fetching lab result:', error);
        res.status(500).json({ error: 'Failed to fetch lab result' });
    }
});

// Update lab result (e.g. adding results)
router.put('/:id', auth, async (req, res) => {
    try {
        const updates = req.body;
        delete updates.id;
        delete updates.created_at;
        delete updates.ordered_by;

        // If updating status to completed, set performed_by if not set
        if (updates.status === 'completed' && !updates.performed_by) {
            updates.performed_by = req.user.id;
            updates.result_date = new Date();
        }

        if (typeof updates.attachments === 'object') updates.attachments = JSON.stringify(updates.attachments);

        await db('lab_results').where('id', req.params.id).update({
            ...updates,
            updated_at: db.fn.now()
        });

        const updatedResult = await db('lab_results').where('id', req.params.id).first();
        return res.json(updatedResult);
    } catch (error) {
        console.error('Error updating lab result:', error);
        res.status(500).json({ error: 'Failed to update lab result' });
    }
});

// Cancel lab order
router.delete('/:id', auth, async (req, res) => {
    try {
        await db('lab_results').where('id', req.params.id).update({
            status: 'cancelled',
            updated_at: db.fn.now()
        });
        return res.json({ message: 'Lab order cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling lab order:', error);
        res.status(500).json({ error: 'Failed to cancel lab order' });
    }
});

// Send lab order to billing
router.post('/:id/bill', auth, async (req, res) => {
    const trx = await db.transaction();
    try {
        const { id } = req.params;

        // Get lab order
        const labResult = await trx('lab_results').where('id', id).first();
        if (!labResult) {
            await trx.rollback();
            return res.status(404).json({ error: 'Lab order not found' });
        }

        // Get test price
        const definition = await trx('lab_test_definitions')
            .where('code', labResult.test_code)
            .orWhere('name', labResult.test_name)
            .first();

        const price = definition?.price || 0;

        // Generate invoice number
        const lastInvoice = await trx('invoices').orderBy('id', 'desc').first();
        const invoiceNumber = `INV-${String((lastInvoice?.id || 0) + 1).padStart(6, '0')}`;

        // Create Invoice
        const [invoiceId] = await trx('invoices').insert({
            invoice_number: invoiceNumber,
            patient_id: labResult.patient_id,
            total_amount: price,
            status: 'pending', // Unpaid
            due_date: new Date(),
            created_by: req.user.id,
            created_at: new Date(),
            updated_at: new Date()
        });

        // Add Invoice Item
        await trx('invoice_items').insert({
            invoice_id: invoiceId,
            description: `Lab Test: ${labResult.test_name}`,
            quantity: 1,
            unit_price: price,
            total_price: price,
            created_at: new Date()
        });

        // Update Lab Result to indicate billing sent
        // We add a note or special status
        const currentNotes = labResult.notes || '';
        await trx('lab_results').where('id', id).update({
            // status: 'pending_payment', // Use if we want to block until paid
            notes: currentNotes ? `${currentNotes}\nSent to billing (INV #${invoiceNumber})` : `Sent to billing (INV #${invoiceNumber})`,
            updated_at: new Date()
        });

        await trx.commit();
        res.json({ message: 'Invoice created successfully', invoiceId, invoiceNumber });

    } catch (error) {
        await trx.rollback();
        console.error('Error billing lab order:', error);
        res.status(500).json({ error: 'Failed to bill lab order' });
    }
});

export default router;
