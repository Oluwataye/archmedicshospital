import express from 'express';
import { auth, authorize } from '../middleware/auth';
import db from '../db';
import { DrugInteractionService } from '../../services/drugInteractionService';

const router = express.Router();

// Check drug interactions
router.post('/check', auth, async (req, res) => {
    try {
        const { medications, patientConditions, allergies } = req.body;

        if (!medications || !Array.isArray(medications) || medications.length === 0) {
            return res.status(400).json({ error: 'Medications array is required' });
        }

        const result = await DrugInteractionService.performComprehensiveCheck(
            medications,
            patientConditions || [],
            allergies || []
        );

        res.json(result);
    } catch (error) {
        console.error('Error checking drug interactions:', error);
        res.status(500).json({ error: 'Failed to check drug interactions' });
    }
});

// Check interactions for a specific prescription
router.post('/check-prescription/:prescriptionId', auth, async (req, res) => {
    try {
        const { prescriptionId } = req.params;

        // Get prescription
        const prescription = await db('prescriptions')
            .where('id', prescriptionId)
            .first();

        if (!prescription) {
            return res.status(404).json({ error: 'Prescription not found' });
        }

        // Get patient data
        const patient = await db('patients')
            .where('id', prescription.patient_id)
            .first();

        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        // Extract medications from prescription
        const medications = DrugInteractionService.parseMedicationsFromPrescription(prescription);

        // Get patient conditions and allergies
        const patientConditions = patient.medical_history
            ? (typeof patient.medical_history === 'string'
                ? JSON.parse(patient.medical_history)
                : patient.medical_history)
            : [];

        const allergies = patient.allergies
            ? (typeof patient.allergies === 'string'
                ? JSON.parse(patient.allergies)
                : patient.allergies)
            : [];

        // Perform comprehensive check
        const result = await DrugInteractionService.performComprehensiveCheck(
            medications,
            patientConditions,
            allergies
        );

        res.json({
            ...result,
            prescription,
            patient: {
                id: patient.id,
                name: `${patient.first_name} ${patient.last_name}`,
                mrn: patient.mrn
            }
        });
    } catch (error) {
        console.error('Error checking prescription interactions:', error);
        res.status(500).json({ error: 'Failed to check prescription interactions' });
    }
});

// Log interaction check
router.post('/log-check', auth, async (req, res) => {
    try {
        const {
            patientId,
            prescriptionId,
            medicationsChecked,
            result,
            actionTaken,
            notes
        } = req.body;

        const checkedBy = (req as any).user.id;

        await DrugInteractionService.logInteractionCheck(
            patientId,
            prescriptionId,
            checkedBy,
            medicationsChecked,
            result,
            actionTaken,
            notes
        );

        res.json({ message: 'Interaction check logged successfully' });
    } catch (error) {
        console.error('Error logging interaction check:', error);
        res.status(500).json({ error: 'Failed to log interaction check' });
    }
});

// Get all recent interaction alerts (system-wide)
router.get('/alerts/recent', auth, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit as string) || 50;
        const alerts = await DrugInteractionService.getAllRecentAlerts(limit);
        res.json(alerts);
    } catch (error) {
        console.error('Error fetching recent alerts:', error);
        res.status(500).json({ error: 'Failed to fetch recent alerts' });
    }
});

// Get patient interaction check history
router.get('/history/:patientId', auth, async (req, res) => {
    try {
        const { patientId } = req.params;
        const limit = parseInt(req.query.limit as string) || 10;

        const history = await DrugInteractionService.getPatientCheckHistory(patientId, limit);

        res.json(history);
    } catch (error) {
        console.error('Error fetching interaction history:', error);
        res.status(500).json({ error: 'Failed to fetch interaction history' });
    }
});

// Get all drug interactions (for reference)
router.get('/interactions', auth, async (req, res) => {
    try {
        const { severity, search } = req.query;

        let query = db('drug_interactions');

        if (severity) {
            query = query.where('severity', severity);
        }

        if (search) {
            query = query.where(function () {
                this.where('drug_a', 'like', `%${search}%`)
                    .orWhere('drug_b', 'like', `%${search}%`);
            });
        }

        const interactions = await query.orderBy('severity').limit(100);

        res.json(interactions);
    } catch (error) {
        console.error('Error fetching interactions:', error);
        res.status(500).json({ error: 'Failed to fetch interactions' });
    }
});

// Get all contraindications (for reference)
router.get('/contraindications', auth, async (req, res) => {
    try {
        const { search } = req.query;

        let query = db('drug_contraindications');

        if (search) {
            query = query.where(function () {
                this.where('drug_name', 'like', `%${search}%`)
                    .orWhere('condition', 'like', `%${search}%`);
            });
        }

        const contraindications = await query.orderBy('severity').limit(100);

        res.json(contraindications);
    } catch (error) {
        console.error('Error fetching contraindications:', error);
        res.status(500).json({ error: 'Failed to fetch contraindications' });
    }
});

// Get allergy cross-sensitivities (for reference)
router.get('/allergy-interactions', auth, async (req, res) => {
    try {
        const { search } = req.query;

        let query = db('allergy_interactions');

        if (search) {
            query = query.where(function () {
                this.where('allergen', 'like', `%${search}%`)
                    .orWhere('drug_name', 'like', `%${search}%`);
            });
        }

        const allergyInteractions = await query.orderBy('cross_sensitivity').limit(100);

        res.json(allergyInteractions);
    } catch (error) {
        console.error('Error fetching allergy interactions:', error);
        res.status(500).json({ error: 'Failed to fetch allergy interactions' });
    }
});

// Add new drug interaction (Admin only)
router.post('/interactions', auth, authorize(['admin']), async (req, res) => {
    try {
        const interactionData = req.body;

        const [id] = await db('drug_interactions').insert(interactionData);
        const newInteraction = await db('drug_interactions').where({ id }).first();

        res.status(201).json(newInteraction);
    } catch (error) {
        console.error('Error creating interaction:', error);
        res.status(500).json({ error: 'Failed to create interaction' });
    }
});

// Update drug interaction (Admin only)
router.put('/interactions/:id', auth, authorize(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        await db('drug_interactions')
            .where({ id })
            .update({
                ...updateData,
                updated_at: db.fn.now()
            });

        const updated = await db('drug_interactions').where({ id }).first();

        res.json(updated);
    } catch (error) {
        console.error('Error updating interaction:', error);
        res.status(500).json({ error: 'Failed to update interaction' });
    }
});

// Delete drug interaction (Admin only)
router.delete('/interactions/:id', auth, authorize(['admin']), async (req, res) => {
    try {
        const { id } = req.params;

        await db('drug_interactions').where({ id }).delete();

        res.json({ message: 'Interaction deleted successfully' });
    } catch (error) {
        console.error('Error deleting interaction:', error);
        res.status(500).json({ error: 'Failed to delete interaction' });
    }
});

export default router;
