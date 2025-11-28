import express from 'express';
import { auth } from '../middleware/auth.ts';
import db from '../db.ts';

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

// Create lab order
router.post('/', auth, async (req, res) => {
    try {
        const {
            patient_id, test_type, test_name, order_date,
            status, notes
        } = req.body;

        const ordered_by = req.user.id;

        const [newOrder] = await db('lab_results').insert({
            patient_id,
            ordered_by,
            test_type,
            test_name,
            order_date: order_date || new Date(),
            status: status || 'ordered',
            // notes field not in schema but might be useful, ignored for now or map to interpretation if needed
        }).returning('*');

        // SQLite fallback
        if (!newOrder) {
            const order = await db('lab_results')
                .where({ patient_id, ordered_by, test_name })
                .orderBy('created_at', 'desc')
                .first();
            return res.status(201).json(order);
        }

        return res.status(201).json(newOrder);
    } catch (error) {
        console.error('Error creating lab order:', error);
        res.status(500).json({ error: 'Failed to create lab order' });
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

export default router;
