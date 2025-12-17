import db from '../server/db';

export interface DrugInteraction {
    id: string;
    drug_a: string;
    drug_b: string;
    severity: 'Critical' | 'Major' | 'Moderate' | 'Minor';
    description: string;
    clinical_effects?: string;
    management_recommendation?: string;
    evidence_level?: string;
}

export interface DrugContraindication {
    id: string;
    drug_name: string;
    condition: string;
    severity: 'Absolute' | 'Relative';
    description: string;
    alternative_recommendations?: string;
}

export interface AllergyInteraction {
    id: string;
    allergen: string;
    drug_name: string;
    cross_sensitivity: 'High' | 'Moderate' | 'Low';
    description: string;
    precautions?: string;
}

export interface InteractionCheckResult {
    interactions: DrugInteraction[];
    contraindications: DrugContraindication[];
    allergyAlerts: AllergyInteraction[];
    hasCriticalIssues: boolean;
    hasMajorIssues: boolean;
}

export class DrugInteractionService {
    /**
     * Check for drug interactions between medications
     */
    static async checkDrugInteractions(medications: string[]): Promise<DrugInteraction[]> {
        if (medications.length < 2) {
            return [];
        }

        const interactions: DrugInteraction[] = [];

        // Check each pair of medications
        for (let i = 0; i < medications.length; i++) {
            for (let j = i + 1; j < medications.length; j++) {
                const drugA = medications[i].trim();
                const drugB = medications[j].trim();

                // Check both directions (A-B and B-A)
                const foundInteractions = await db('drug_interactions')
                    .where(function () {
                        this.where({ drug_a: drugA, drug_b: drugB })
                            .orWhere({ drug_a: drugB, drug_b: drugA });
                    })
                    .orWhere(function () {
                        // Also check for partial matches (e.g., "Aspirin 81mg" matches "Aspirin")
                        this.where('drug_a', 'like', `%${drugA}%`)
                            .andWhere('drug_b', 'like', `%${drugB}%`);
                    })
                    .orWhere(function () {
                        this.where('drug_a', 'like', `%${drugB}%`)
                            .andWhere('drug_b', 'like', `%${drugA}%`);
                    });

                interactions.push(...foundInteractions);
            }
        }

        // Remove duplicates and sort by severity
        const uniqueInteractions = Array.from(
            new Map(interactions.map(item => [item.id, item])).values()
        );

        return this.sortBySeverity(uniqueInteractions);
    }

    /**
     * Check for contraindications based on patient conditions
     */
    static async checkContraindications(
        medications: string[],
        patientConditions: string[]
    ): Promise<DrugContraindication[]> {
        if (medications.length === 0 || patientConditions.length === 0) {
            return [];
        }

        const contraindications: DrugContraindication[] = [];

        for (const medication of medications) {
            const drugName = medication.trim();

            for (const condition of patientConditions) {
                const found = await db('drug_contraindications')
                    .where('drug_name', 'like', `%${drugName}%`)
                    .andWhere('condition', 'like', `%${condition}%`);

                contraindications.push(...found);
            }
        }

        // Sort by severity (Absolute first)
        return contraindications.sort((a, b) => {
            if (a.severity === 'Absolute' && b.severity !== 'Absolute') return -1;
            if (a.severity !== 'Absolute' && b.severity === 'Absolute') return 1;
            return 0;
        });
    }

    /**
     * Check for allergy cross-sensitivities
     */
    static async checkAllergyInteractions(
        medications: string[],
        allergies: string[]
    ): Promise<AllergyInteraction[]> {
        if (medications.length === 0 || allergies.length === 0) {
            return [];
        }

        const allergyAlerts: AllergyInteraction[] = [];

        for (const medication of medications) {
            const drugName = medication.trim();

            for (const allergy of allergies) {
                const allergen = allergy.trim();

                const found = await db('allergy_interactions')
                    .where('drug_name', 'like', `%${drugName}%`)
                    .andWhere('allergen', 'like', `%${allergen}%`);

                allergyAlerts.push(...found);
            }
        }

        // Sort by cross-sensitivity (High first)
        return allergyAlerts.sort((a, b) => {
            const order = { 'High': 0, 'Moderate': 1, 'Low': 2 };
            return order[a.cross_sensitivity] - order[b.cross_sensitivity];
        });
    }

    /**
     * Comprehensive interaction check
     */
    static async performComprehensiveCheck(
        medications: string[],
        patientConditions: string[] = [],
        allergies: string[] = []
    ): Promise<InteractionCheckResult> {
        const [interactions, contraindications, allergyAlerts] = await Promise.all([
            this.checkDrugInteractions(medications),
            this.checkContraindications(medications, patientConditions),
            this.checkAllergyInteractions(medications, allergies)
        ]);

        const hasCriticalIssues =
            interactions.some(i => i.severity === 'Critical') ||
            contraindications.some(c => c.severity === 'Absolute') ||
            allergyAlerts.some(a => a.cross_sensitivity === 'High');

        const hasMajorIssues =
            interactions.some(i => i.severity === 'Major') ||
            contraindications.some(c => c.severity === 'Relative') ||
            allergyAlerts.some(a => a.cross_sensitivity === 'Moderate');

        return {
            interactions,
            contraindications,
            allergyAlerts,
            hasCriticalIssues,
            hasMajorIssues
        };
    }

    /**
     * Log interaction check for audit trail
     */
    static async logInteractionCheck(
        patientId: string,
        prescriptionId: string | null,
        checkedBy: string,
        medicationsChecked: string[],
        result: InteractionCheckResult,
        actionTaken: string,
        notes?: string
    ): Promise<void> {
        await db('interaction_checks').insert({
            patient_id: patientId,
            prescription_id: prescriptionId,
            checked_by: checkedBy,
            medications_checked: JSON.stringify(medicationsChecked),
            interactions_found: JSON.stringify(result.interactions),
            contraindications_found: JSON.stringify(result.contraindications),
            allergy_alerts: JSON.stringify(result.allergyAlerts),
            action_taken: actionTaken,
            notes: notes || null
        });
    }

    /**
     * Get interaction check history for a patient
     */
    static async getPatientCheckHistory(patientId: string, limit: number = 10) {
        return await db('interaction_checks')
            .where('patient_id', patientId)
            .orderBy('checked_at', 'desc')
            .limit(limit)
            .select('*');
    }

    /**
     * Get all recent interaction alerts (system-wide)
     */
    static async getAllRecentAlerts(limit: number = 50) {
        return await db('interaction_checks')
            .leftJoin('patients', 'interaction_checks.patient_id', 'patients.id')
            .select(
                'interaction_checks.*',
                'patients.first_name as patient_first_name',
                'patients.last_name as patient_last_name',
                'patients.mrn as patient_mrn'
            )
            .orderBy('interaction_checks.checked_at', 'desc')
            .limit(limit);
    }

    /**
     * Helper: Sort interactions by severity
     */
    private static sortBySeverity(interactions: DrugInteraction[]): DrugInteraction[] {
        const severityOrder = { 'Critical': 0, 'Major': 1, 'Moderate': 2, 'Minor': 3 };
        return interactions.sort((a, b) => {
            return severityOrder[a.severity] - severityOrder[b.severity];
        });
    }

    /**
     * Extract drug names from medication strings
     * Handles formats like "Aspirin 81mg", "Metformin 500mg twice daily"
     */
    static extractDrugName(medicationString: string): string {
        // Remove dosage information (numbers followed by mg, mcg, etc.)
        let drugName = medicationString.replace(/\d+\s*(mg|mcg|g|ml|units?|iu)/gi, '');

        // Remove frequency information
        drugName = drugName.replace(/(once|twice|three times|daily|weekly|monthly|as needed|prn)/gi, '');

        // Trim and return
        return drugName.trim();
    }

    /**
     * Parse medications from prescription JSON
     */
    static parseMedicationsFromPrescription(prescriptionData: any): string[] {
        if (!prescriptionData || !prescriptionData.medications) {
            return [];
        }

        const medications = typeof prescriptionData.medications === 'string'
            ? JSON.parse(prescriptionData.medications)
            : prescriptionData.medications;

        return medications.map((med: any) => this.extractDrugName(med.name || med));
    }
}

export default DrugInteractionService;
