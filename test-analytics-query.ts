import db from './src/server/db.ts';

async function testQuery() {
    try {
        console.log("Testing disease prevalence query...");
        const result = await db('medical_records')
            .join('patients', 'medical_records.patient_id', 'patients.id')
            .select(
                db.raw(`
                    (medical_records.content::jsonb->>'diagnosis') as disease,
                    COUNT(*) as cases,
                    patients.gender,
                    CASE
                        WHEN EXTRACT(YEAR FROM AGE(patients.date_of_birth)) < 18 THEN 'Child (0-17)'
                        WHEN EXTRACT(YEAR FROM AGE(patients.date_of_birth)) BETWEEN 18 AND 35 THEN 'Young Adult (18-35)'
                        WHEN EXTRACT(YEAR FROM AGE(patients.date_of_birth)) BETWEEN 36 AND 65 THEN 'Adult (36-65)'
                        ELSE 'Senior (65+)'
                    END as age_group,
                    to_char(medical_records.record_date, 'YYYY "Q"') || to_char(medical_records.record_date, 'Q') as period
                `)
            )
            .whereRaw("(medical_records.content::jsonb->>'diagnosis') IS NOT NULL")
            .whereRaw("(medical_records.content::jsonb->>'diagnosis') != ''")
            .groupBy(
                db.raw(`(medical_records.content::jsonb->>'diagnosis')`),
                'patients.gender',
                db.raw(`CASE
                    WHEN EXTRACT(YEAR FROM AGE(patients.date_of_birth)) < 18 THEN 'Child (0-17)'
                    WHEN EXTRACT(YEAR FROM AGE(patients.date_of_birth)) BETWEEN 18 AND 35 THEN 'Young Adult (18-35)'
                    WHEN EXTRACT(YEAR FROM AGE(patients.date_of_birth)) BETWEEN 36 AND 65 THEN 'Adult (36-65)'
                    ELSE 'Senior (65+)'
                END`),
                db.raw(`to_char(medical_records.record_date, 'YYYY "Q"') || to_char(medical_records.record_date, 'Q')`)
            );

        console.log("Query success! Result count:", result.length);
        process.exit(0);
    } catch (error) {
        console.error("Query failed!");
        console.error(error);
        process.exit(1);
    }
}

testQuery();
