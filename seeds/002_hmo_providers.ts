import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Clear existing HMO data
    await knex('hmo_tariffs').del();
    await knex('hmo_service_packages').del();
    await knex('hmo_providers').del();

    // Insert major Nigerian HMO providers
    await knex('hmo_providers').insert([
        {
            name: 'AIICO Multishield Limited',
            code: 'AIICO',
            nhia_accreditation_number: 'NHIA/HMO/001',
            contact_email: 'info@aiico.com',
            contact_phone: '+234-1-2701030',
            address: 'AIICO Plaza, Plot 2, Oba Akran Avenue, Ikeja, Lagos',
            coverage_type: 'individual',
            is_active: true,
        },
        {
            name: 'Hygeia HMO Limited',
            code: 'HYGEIA',
            nhia_accreditation_number: 'NHIA/HMO/002',
            contact_email: 'claims@hygeiahmo.com',
            contact_phone: '+234-1-2806000',
            address: '21/25 Broad Street, Lagos Island, Lagos',
            coverage_type: 'individual',
            is_active: true,
        },
        {
            name: 'Reliance HMO Limited',
            code: 'RELIANCE',
            nhia_accreditation_number: 'NHIA/HMO/003',
            contact_email: 'info@reliancehmo.com',
            contact_phone: '+234-1-2806543',
            address: '4th Floor, UBA House, 57 Marina, Lagos',
            coverage_type: 'individual',
            is_active: true,
        },
        {
            name: 'AXA Mansard Health Limited',
            code: 'AXA',
            nhia_accreditation_number: 'NHIA/HMO/004',
            contact_email: 'health@axamansard.com',
            contact_phone: '+234-1-2701030',
            address: 'Churchgate Tower 1, 30 Afribank Street, Victoria Island, Lagos',
            coverage_type: 'individual',
            is_active: true,
        },
        {
            name: 'Total Health Trust Limited',
            code: 'TOTAL',
            nhia_accreditation_number: 'NHIA/HMO/005',
            contact_email: 'info@totalhealthtrust.com',
            contact_phone: '+234-1-4617912',
            address: '142 Adetokunbo Ademola Crescent, Wuse II, Abuja',
            coverage_type: 'individual',
            is_active: true,
        },
        {
            name: 'Clearline HMO Limited',
            code: 'CLEARLINE',
            nhia_accreditation_number: 'NHIA/HMO/006',
            contact_email: 'info@clearlinehmo.com',
            contact_phone: '+234-1-2806789',
            address: 'Plot 1665, Oyin Jolayemi Street, Victoria Island, Lagos',
            coverage_type: 'individual',
            is_active: true,
        },
        {
            name: 'Integrated Healthcare Limited',
            code: 'INTEGRATED',
            nhia_accreditation_number: 'NHIA/HMO/007',
            contact_email: 'info@integratedhealthcare.com.ng',
            contact_phone: '+234-1-2806234',
            address: '23 Jimmy Carter Street, Asokoro, Abuja',
            coverage_type: 'individual',
            is_active: true,
        },
        {
            name: 'Songhai Health Trust HMO Limited',
            code: 'SONGHAI',
            nhia_accreditation_number: 'NHIA/HMO/008',
            contact_email: 'info@songhaihealthtrust.com',
            contact_phone: '+234-1-2806456',
            address: 'Plot 1548, Adetokunbo Ademola Street, Victoria Island, Lagos',
            coverage_type: 'individual',
            is_active: true,
        },
        {
            name: 'Healthcare International HMO Limited',
            code: 'HEALTHCARE_INTL',
            nhia_accreditation_number: 'NHIA/HMO/009',
            contact_email: 'info@healthcareinternational.com.ng',
            contact_phone: '+234-1-2806678',
            address: '15 Kofo Abayomi Street, Victoria Island, Lagos',
            coverage_type: 'individual',
            is_active: true,
        },
        {
            name: 'Novo Health Africa',
            code: 'NOVO',
            nhia_accreditation_number: 'NHIA/HMO/010',
            contact_email: 'info@novohealthafrica.com',
            contact_phone: '+234-1-2806890',
            address: '12A Akin Adesola Street, Victoria Island, Lagos',
            coverage_type: 'individual',
            is_active: true,
        },
    ]);

    console.log('HMO providers seeded successfully!');
}
