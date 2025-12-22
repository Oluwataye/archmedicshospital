import express from 'express';
import { auth } from '../middleware/auth';
import db from '../db';

const router = express.Router();

// Department mapping
const DEPARTMENT_MAPPING: Record<string, string> = {
    'hypertension': 'Cardiology', 'heart disease': 'Cardiology', 'diabetes': 'Endocrinology',
    'asthma': 'Pulmonology', 'pneumonia': 'Pulmonology', 'depression': 'Psychiatry',
    'anxiety': 'Psychiatry', 'stroke': 'Neurology', 'epilepsy': 'Neurology',
    'gastritis': 'Gastroenterology', 'kidney disease': 'Nephrology', 'arthritis': 'Orthopedics',
    'influenza': 'Infectious Disease', 'covid-19': 'Infectious Disease', 'cancer': 'Oncology'
};

const getDepartment = (diagnosis: string): string => {
    if (!diagnosis) return 'General Medicine';
    const normalized = diagnosis.toLowerCase().trim();
    if (DEPARTMENT_MAPPING[normalized]) return DEPARTMENT_MAPPING[normalized];
    for (const [key, dept] of Object.entries(DEPARTMENT_MAPPING)) {
        if (normalized.includes(key) || key.includes(normalized)) return dept;
    }
    return 'General Medicine';
};

// Get disease prevalence analytics
router.get('/disease-prevalence', auth, async (req, res) => {
    try {
        const { timeRange, ageGroup, gender, search } = req.query;

        // 1. Prepare base data extraction
        const baseQuery = db('medical_records')
            .join('patients', 'medical_records.patient_id', 'patients.id')
            .select({
                disease: db.raw("(medical_records.content::jsonb->>'diagnosis')"),
                gender: 'patients.gender',
                age_group: db.raw(`
                    CASE
                        WHEN EXTRACT(YEAR FROM AGE(patients.date_of_birth)) < 18 THEN 'Child (0-17)'
                        WHEN EXTRACT(YEAR FROM AGE(patients.date_of_birth)) BETWEEN 18 AND 35 THEN 'Young Adult (18-35)'
                        WHEN EXTRACT(YEAR FROM AGE(patients.date_of_birth)) BETWEEN 36 AND 65 THEN 'Adult (36-65)'
                        ELSE 'Senior (65+)'
                    END
                `),
                period: db.raw("to_char(medical_records.record_date, 'YYYY \"Q\"Q')"),
                record_date: 'medical_records.record_date'
            })
            .where('medical_records.content', 'like', '{%');

        // Apply filters to base query
        if (timeRange && timeRange !== 'all') {
            const now = new Date();
            let dateFrom;
            switch (timeRange) {
                case 'current':
                    const currentQuarter = Math.floor(now.getMonth() / 3) + 1;
                    dateFrom = new Date(now.getFullYear(), (currentQuarter - 1) * 3, 1);
                    break;
                case 'last_quarter':
                    dateFrom = new Date(now.getFullYear(), now.getMonth() - 3, 1);
                    break;
                case 'last_year':
                    dateFrom = new Date(now.getFullYear() - 1, now.getMonth(), 1);
                    break;
            }
            if (dateFrom) {
                baseQuery.where('medical_records.record_date', '>=', dateFrom.toISOString().split('T')[0]);
            }
        }

        if (gender && gender !== 'all') {
            baseQuery.where('patients.gender', gender as string);
        }

        // 2. Perform aggregation on base data
        const mainQuery = db.select('disease', 'gender', 'age_group', 'period')
            .count('* as cases')
            .from(baseQuery.as('sub'))
            .whereNotNull('disease')
            .where('disease', '!=', '')
            .groupBy('disease', 'gender', 'age_group', 'period');

        // Apply search and age group filters after grouping
        if (ageGroup && ageGroup !== 'all') {
            mainQuery.where('age_group', 'like', `%${ageGroup}%`);
        }

        if (search) {
            mainQuery.where('disease', 'ilike', `%${search}%`);
        }

        const results = await mainQuery;

        // 3. Get historical data for trend calculation
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

        const historicalQuery = await db('medical_records')
            .select(db.raw(`(content::jsonb->>'diagnosis') as disease, COUNT(*) as cases`))
            .where('content', 'like', '{%')
            .whereRaw("(content::jsonb->>'diagnosis') IS NOT NULL")
            .where('record_date', '<', threeMonthsAgo.toISOString().split('T')[0])
            .groupBy(db.raw(`(content::jsonb->>'diagnosis')`));

        const historicalMap = new Map(historicalQuery.map(h => [h.disease, parseInt(h.cases)]));

        // 4. Format results
        const formattedResults = results.map((row, index) => {
            const disease = row.disease || 'Unknown';
            const currentCases = parseInt(row.cases) || 0;
            const historicalCases = Number(historicalMap.get(disease)) || 0;
            const percentageChange = historicalCases > 0
                ? ((currentCases - historicalCases) / historicalCases) * 100
                : 0;

            return {
                id: `DP-${10000 + index}`,
                disease,
                cases: currentCases,
                ageGroup: row.age_group || 'All Ages',
                gender: row.gender || 'All',
                period: row.period || 'Unknown',
                department: getDepartment(disease),
                riskFactor: currentCases > 100 ? 'High' : currentCases > 50 ? 'Medium' : 'Low',
                region: 'All',
                percentageIncrease: percentageChange > 0 ? `+${percentageChange.toFixed(1)}%` : `${percentageChange.toFixed(1)}%`,
                trend: percentageChange
            };
        });

        res.json({
            data: formattedResults,
            totalCount: formattedResults.length
        });
    } catch (error) {
        console.error('Error fetching disease prevalence:', error);
        res.status(500).json({ error: 'Failed to fetch disease prevalence data' });
    }
});

// Get treatment outcomes analytics
router.get('/treatment-outcomes', auth, async (req, res) => {
    try {
        const { treatmentType, timeRange, search } = req.query;

        // Query medical records with treatment information
        // We avoid joining prescriptions directly to prevent Cartesian products
        // Instead we focus on medical records which should contain the primary source of treatment outcomes
        let query = db('medical_records')
            .join('patients', 'medical_records.patient_id', 'patients.id')
            .select(
                db.raw(`
                    (medical_records.content::jsonb->>'treatment') as treatment,
                    (medical_records.content::jsonb->>'diagnosis') as condition,
                    patients.first_name || ' ' || patients.last_name as patient,
                    medical_records.record_date as start_date,
                    CASE 
                        WHEN medical_records.status = 'final' THEN medical_records.record_date::text
                        ELSE 'Ongoing'
                    END as end_date,
                    CASE
                        WHEN (medical_records.content::jsonb->>'outcome') = 'resolved' THEN 'Successful'
                        WHEN (medical_records.content::jsonb->>'outcome') = 'improved' THEN 'Partially Successful'
                        WHEN (medical_records.content::jsonb->>'outcome') = 'unchanged' THEN 'Unsuccessful'
                        ELSE 'Successful'
                    END as outcome,
                    COALESCE((medical_records.content::jsonb->>'notes'), medical_records.title) as notes,
                    'General Medicine' as department,
                    medical_records.id as record_id
                `)
            )
            .where('medical_records.content', 'like', '{%')
            .whereRaw("(medical_records.content::jsonb->>'treatment') IS NOT NULL");

        // Apply time range filter
        if (timeRange && timeRange !== 'all') {
            if (timeRange === 'ongoing') {
                query = query.where('medical_records.status', '!=', 'final');
            } else if (timeRange === 'completed') {
                query = query.where('medical_records.status', 'final');
            }
        }

        let results = await query.limit(100) as any[];

        // Apply search filter
        if (search) {
            results = results.filter(r =>
                (r.treatment && r.treatment.toLowerCase().includes(String(search).toLowerCase())) ||
                (r.condition && r.condition.toLowerCase().includes(String(search).toLowerCase())) ||
                (r.patient && r.patient.toLowerCase().includes(String(search).toLowerCase()))
            );
        }

        // Apply treatment type filter
        if (treatmentType && treatmentType !== 'all') {
            results = results.filter(r => {
                const treatment = (r.treatment || '').toLowerCase();
                switch (treatmentType) {
                    case 'medication':
                        return treatment.includes('therapy') || treatment.includes('inhibitor') ||
                            treatment.includes('antibiotic') || treatment.includes('drug') || treatment.includes('mg');
                    case 'procedure':
                        return treatment.includes('surgery') || treatment.includes('procedure') ||
                            treatment.includes('physical therapy') || treatment.includes('incision');
                    case 'behavioral':
                        return treatment.includes('behavioral') || treatment.includes('cognitive') ||
                            treatment.includes('counseling');
                    default:
                        return true;
                }
            });
        }

        // Format results
        const formattedResults = results.map((row, index) => ({
            id: `TO-${row.record_id || index}`,
            treatment: row.treatment || 'Unspecified Treatment',
            condition: row.condition || 'Unspecified Condition',
            patient: row.patient,
            startDate: row.start_date ? new Date(row.start_date).toISOString().split('T')[0] : 'Unknown',
            endDate: row.end_date === 'Ongoing' ? 'Ongoing' :
                (row.end_date ? new Date(row.end_date).toISOString().split('T')[0] : 'Unknown'),
            outcome: row.outcome,
            notes: row.notes || 'No notes available',
            department: row.department
        }));

        res.json({
            data: formattedResults,
            totalCount: formattedResults.length
        });
    } catch (error) {
        console.error('Error fetching treatment outcomes:', error);
        // Return empty data instead of 500 to prevent UI crash, but log error
        res.json({
            data: [],
            totalCount: 0,
            error: 'Failed to fetch data'
        });
    }
});

export default router;
