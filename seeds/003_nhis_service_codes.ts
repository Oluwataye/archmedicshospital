import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Clear existing NHIS service codes
    await knex('nhis_service_codes').del();

    // Insert NHIS service codes across different categories
    await knex('nhis_service_codes').insert([
        // CONSULTATIONS
        {
            code: 'CONS-GP-001',
            description: 'General Practitioner Consultation',
            category: 'Consultation',
            base_tariff: 2500.00,
            is_active: true,
        },
        {
            code: 'CONS-SPEC-001',
            description: 'Specialist Consultation - Cardiology',
            category: 'Consultation',
            base_tariff: 5000.00,
            is_active: true,
        },
        {
            code: 'CONS-SPEC-002',
            description: 'Specialist Consultation - Neurology',
            category: 'Consultation',
            base_tariff: 5000.00,
            is_active: true,
        },
        {
            code: 'CONS-SPEC-003',
            description: 'Specialist Consultation - Orthopedics',
            category: 'Consultation',
            base_tariff: 5000.00,
            is_active: true,
        },
        {
            code: 'CONS-SPEC-004',
            description: 'Specialist Consultation - Pediatrics',
            category: 'Consultation',
            base_tariff: 4500.00,
            is_active: true,
        },
        {
            code: 'CONS-EMERG-001',
            description: 'Emergency Room Consultation',
            category: 'Consultation',
            base_tariff: 7500.00,
            is_active: true,
        },

        // DIAGNOSTICS - LABORATORY
        {
            code: 'LAB-BLOOD-001',
            description: 'Complete Blood Count (CBC)',
            category: 'Laboratory',
            base_tariff: 3000.00,
            is_active: true,
        },
        {
            code: 'LAB-BLOOD-002',
            description: 'Blood Glucose (Fasting)',
            category: 'Laboratory',
            base_tariff: 1500.00,
            is_active: true,
        },
        {
            code: 'LAB-BLOOD-003',
            description: 'Lipid Profile',
            category: 'Laboratory',
            base_tariff: 4500.00,
            is_active: true,
        },
        {
            code: 'LAB-BLOOD-004',
            description: 'Liver Function Test (LFT)',
            category: 'Laboratory',
            base_tariff: 5000.00,
            is_active: true,
        },
        {
            code: 'LAB-BLOOD-005',
            description: 'Kidney Function Test (RFT)',
            category: 'Laboratory',
            base_tariff: 5000.00,
            is_active: true,
        },
        {
            code: 'LAB-URINE-001',
            description: 'Urinalysis',
            category: 'Laboratory',
            base_tariff: 2000.00,
            is_active: true,
        },
        {
            code: 'LAB-MICRO-001',
            description: 'Malaria Parasite Test',
            category: 'Laboratory',
            base_tariff: 2500.00,
            is_active: true,
        },
        {
            code: 'LAB-MICRO-002',
            description: 'Typhoid Test (Widal)',
            category: 'Laboratory',
            base_tariff: 3000.00,
            is_active: true,
        },
        {
            code: 'LAB-SERO-001',
            description: 'HIV Screening',
            category: 'Laboratory',
            base_tariff: 3500.00,
            is_active: true,
        },
        {
            code: 'LAB-SERO-002',
            description: 'Hepatitis B Surface Antigen',
            category: 'Laboratory',
            base_tariff: 4000.00,
            is_active: true,
        },

        // DIAGNOSTICS - RADIOLOGY
        {
            code: 'RAD-XRAY-001',
            description: 'Chest X-Ray (Single View)',
            category: 'Radiology',
            base_tariff: 8000.00,
            is_active: true,
        },
        {
            code: 'RAD-XRAY-002',
            description: 'Chest X-Ray (Two Views)',
            category: 'Radiology',
            base_tariff: 12000.00,
            is_active: true,
        },
        {
            code: 'RAD-XRAY-003',
            description: 'Abdominal X-Ray',
            category: 'Radiology',
            base_tariff: 10000.00,
            is_active: true,
        },
        {
            code: 'RAD-ULTRA-001',
            description: 'Abdominal Ultrasound',
            category: 'Radiology',
            base_tariff: 15000.00,
            is_active: true,
        },
        {
            code: 'RAD-ULTRA-002',
            description: 'Pelvic Ultrasound',
            category: 'Radiology',
            base_tariff: 15000.00,
            is_active: true,
        },
        {
            code: 'RAD-ULTRA-003',
            description: 'Obstetric Ultrasound',
            category: 'Radiology',
            base_tariff: 12000.00,
            is_active: true,
        },
        {
            code: 'RAD-CT-001',
            description: 'CT Scan - Head',
            category: 'Radiology',
            base_tariff: 45000.00,
            is_active: true,
        },
        {
            code: 'RAD-CT-002',
            description: 'CT Scan - Chest',
            category: 'Radiology',
            base_tariff: 50000.00,
            is_active: true,
        },
        {
            code: 'RAD-MRI-001',
            description: 'MRI Scan - Brain',
            category: 'Radiology',
            base_tariff: 85000.00,
            is_active: true,
        },

        // PROCEDURES
        {
            code: 'PROC-MINOR-001',
            description: 'Wound Dressing (Simple)',
            category: 'Procedure',
            base_tariff: 3000.00,
            is_active: true,
        },
        {
            code: 'PROC-MINOR-002',
            description: 'Suturing (Simple)',
            category: 'Procedure',
            base_tariff: 5000.00,
            is_active: true,
        },
        {
            code: 'PROC-MINOR-003',
            description: 'Incision and Drainage',
            category: 'Procedure',
            base_tariff: 8000.00,
            is_active: true,
        },
        {
            code: 'PROC-SURG-001',
            description: 'Appendectomy',
            category: 'Procedure',
            base_tariff: 150000.00,
            is_active: true,
        },
        {
            code: 'PROC-SURG-002',
            description: 'Hernia Repair',
            category: 'Procedure',
            base_tariff: 120000.00,
            is_active: true,
        },
        {
            code: 'PROC-SURG-003',
            description: 'Cesarean Section',
            category: 'Procedure',
            base_tariff: 180000.00,
            is_active: true,
        },

        // INPATIENT SERVICES
        {
            code: 'INPT-WARD-001',
            description: 'General Ward Admission (Per Day)',
            category: 'Inpatient',
            base_tariff: 15000.00,
            is_active: true,
        },
        {
            code: 'INPT-WARD-002',
            description: 'Private Ward Admission (Per Day)',
            category: 'Inpatient',
            base_tariff: 25000.00,
            is_active: true,
        },
        {
            code: 'INPT-ICU-001',
            description: 'ICU Admission (Per Day)',
            category: 'Inpatient',
            base_tariff: 50000.00,
            is_active: true,
        },

        // PHARMACY
        {
            code: 'PHARM-DRUG-001',
            description: 'Essential Drug Dispensing',
            category: 'Pharmacy',
            base_tariff: 500.00,
            is_active: true,
        },
        {
            code: 'PHARM-DRUG-002',
            description: 'Chronic Disease Medication (Monthly)',
            category: 'Pharmacy',
            base_tariff: 5000.00,
            is_active: true,
        },

        // MATERNITY SERVICES
        {
            code: 'MAT-ANC-001',
            description: 'Antenatal Care Visit',
            category: 'Maternity',
            base_tariff: 3500.00,
            is_active: true,
        },
        {
            code: 'MAT-DEL-001',
            description: 'Normal Delivery',
            category: 'Maternity',
            base_tariff: 50000.00,
            is_active: true,
        },
        {
            code: 'MAT-PNC-001',
            description: 'Postnatal Care Visit',
            category: 'Maternity',
            base_tariff: 3000.00,
            is_active: true,
        },

        // DENTAL SERVICES
        {
            code: 'DENT-CONS-001',
            description: 'Dental Consultation',
            category: 'Dental',
            base_tariff: 3500.00,
            is_active: true,
        },
        {
            code: 'DENT-EXTR-001',
            description: 'Tooth Extraction (Simple)',
            category: 'Dental',
            base_tariff: 5000.00,
            is_active: true,
        },
        {
            code: 'DENT-FILL-001',
            description: 'Tooth Filling',
            category: 'Dental',
            base_tariff: 8000.00,
            is_active: true,
        },

        // OPTICAL SERVICES
        {
            code: 'OPT-EXAM-001',
            description: 'Eye Examination',
            category: 'Optical',
            base_tariff: 4000.00,
            is_active: true,
        },
        {
            code: 'OPT-GLASS-001',
            description: 'Prescription Glasses',
            category: 'Optical',
            base_tariff: 15000.00,
            is_active: true,
        },

        // PHYSIOTHERAPY
        {
            code: 'PHYSIO-SESS-001',
            description: 'Physiotherapy Session',
            category: 'Physiotherapy',
            base_tariff: 5000.00,
            is_active: true,
        },
        {
            code: 'PHYSIO-REHAB-001',
            description: 'Rehabilitation Program (Per Week)',
            category: 'Physiotherapy',
            base_tariff: 25000.00,
            is_active: true,
        },

        // EMERGENCY SERVICES
        {
            code: 'EMERG-AMB-001',
            description: 'Ambulance Service (Within City)',
            category: 'Emergency',
            base_tariff: 20000.00,
            is_active: true,
        },
        {
            code: 'EMERG-RESUS-001',
            description: 'Emergency Resuscitation',
            category: 'Emergency',
            base_tariff: 30000.00,
            is_active: true,
        },
    ]);

    console.log('NHIS service codes seeded successfully!');
}
