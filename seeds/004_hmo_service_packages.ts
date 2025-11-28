import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Get HMO providers
    const hmoProviders = await knex('hmo_providers').select('*');

    // Clear existing service packages
    await knex('hmo_service_packages').del();

    // Create service packages for each HMO
    const packages = [];

    for (const hmo of hmoProviders) {
        // Basic Individual Package
        packages.push({
            hmo_provider_id: hmo.id,
            package_name: `${hmo.name} - Basic Individual`,
            package_code: `${hmo.code}-BASIC-IND`,
            annual_limit: 500000.00,
            services_covered: JSON.stringify([
                'CONS-GP-001', 'LAB-BLOOD-001', 'LAB-BLOOD-002', 'LAB-URINE-001',
                'RAD-XRAY-001', 'PROC-MINOR-001', 'PHARM-DRUG-001'
            ]),
            exclusions: JSON.stringify([
                'RAD-MRI-001', 'PROC-SURG-003', 'OPT-GLASS-001'
            ]),
            copay_percentage: 10.00,
            is_active: true,
        });

        // Premium Individual Package
        packages.push({
            hmo_provider_id: hmo.id,
            package_name: `${hmo.name} - Premium Individual`,
            package_code: `${hmo.code}-PREM-IND`,
            annual_limit: 1500000.00,
            services_covered: JSON.stringify([
                'CONS-GP-001', 'CONS-SPEC-001', 'CONS-SPEC-002', 'CONS-SPEC-003',
                'LAB-BLOOD-001', 'LAB-BLOOD-002', 'LAB-BLOOD-003', 'LAB-BLOOD-004',
                'RAD-XRAY-001', 'RAD-ULTRA-001', 'RAD-CT-001',
                'PROC-MINOR-001', 'PROC-MINOR-002', 'PROC-SURG-001',
                'INPT-WARD-001', 'PHARM-DRUG-001', 'PHARM-DRUG-002'
            ]),
            exclusions: JSON.stringify([
                'RAD-MRI-001', 'OPT-GLASS-001'
            ]),
            copay_percentage: 5.00,
            is_active: true,
        });

        // Family Package
        packages.push({
            hmo_provider_id: hmo.id,
            package_name: `${hmo.name} - Family Package`,
            package_code: `${hmo.code}-FAM`,
            annual_limit: 3000000.00,
            services_covered: JSON.stringify([
                'CONS-GP-001', 'CONS-SPEC-001', 'CONS-SPEC-004',
                'LAB-BLOOD-001', 'LAB-BLOOD-002', 'LAB-MICRO-001',
                'RAD-XRAY-001', 'RAD-ULTRA-001', 'RAD-ULTRA-003',
                'MAT-ANC-001', 'MAT-DEL-001', 'MAT-PNC-001',
                'PROC-MINOR-001', 'INPT-WARD-001', 'PHARM-DRUG-001'
            ]),
            exclusions: JSON.stringify([
                'RAD-MRI-001', 'PROC-SURG-003'
            ]),
            copay_percentage: 10.00,
            is_active: true,
        });

        // Corporate Package
        packages.push({
            hmo_provider_id: hmo.id,
            package_name: `${hmo.name} - Corporate Package`,
            package_code: `${hmo.code}-CORP`,
            annual_limit: 2000000.00,
            services_covered: JSON.stringify([
                'CONS-GP-001', 'CONS-SPEC-001', 'CONS-SPEC-002',
                'LAB-BLOOD-001', 'LAB-BLOOD-002', 'LAB-BLOOD-003',
                'RAD-XRAY-001', 'RAD-ULTRA-001', 'RAD-CT-001',
                'PROC-MINOR-001', 'PROC-MINOR-002',
                'INPT-WARD-001', 'INPT-WARD-002',
                'PHARM-DRUG-001', 'PHARM-DRUG-002',
                'PHYSIO-SESS-001'
            ]),
            exclusions: JSON.stringify([
                'RAD-MRI-001', 'OPT-GLASS-001', 'DENT-FILL-001'
            ]),
            copay_percentage: 0.00,
            is_active: true,
        });
    }

    await knex('hmo_service_packages').insert(packages);

    console.log(`Created ${packages.length} service packages for ${hmoProviders.length} HMO providers`);
}
