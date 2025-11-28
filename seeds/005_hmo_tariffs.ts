import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Get HMO providers and service codes
    const hmoProviders = await knex('hmo_providers').select('*');
    const serviceCodes = await knex('nhis_service_codes').select('*');

    // Clear existing tariffs
    await knex('hmo_tariffs').del();

    const tariffs = [];
    const today = new Date().toISOString().split('T')[0];

    // Create tariffs for each HMO
    for (const hmo of hmoProviders) {
        for (const service of serviceCodes) {
            // Calculate HMO-specific tariff (varies by HMO)
            // Some HMOs charge more, some less than base tariff
            let tariffMultiplier = 1.0;

            switch (hmo.code) {
                case 'AIICO':
                    tariffMultiplier = 1.05; // 5% above base
                    break;
                case 'HYGEIA':
                    tariffMultiplier = 1.10; // 10% above base
                    break;
                case 'RELIANCE':
                    tariffMultiplier = 1.00; // Same as base
                    break;
                case 'AXA':
                    tariffMultiplier = 1.15; // 15% above base
                    break;
                case 'TOTAL':
                    tariffMultiplier = 0.95; // 5% below base
                    break;
                case 'CLEARLINE':
                    tariffMultiplier = 1.00;
                    break;
                case 'INTEGRATED':
                    tariffMultiplier = 1.05;
                    break;
                case 'SONGHAI':
                    tariffMultiplier = 1.00;
                    break;
                case 'HEALTHCARE_INTL':
                    tariffMultiplier = 1.08;
                    break;
                case 'NOVO':
                    tariffMultiplier = 1.12;
                    break;
                default:
                    tariffMultiplier = 1.00;
            }

            const tariffAmount = parseFloat((service.base_tariff * tariffMultiplier).toFixed(2));

            // Calculate copay based on service category
            let copayAmount = 0;
            let copayPercentage = null;

            switch (service.category) {
                case 'Consultation':
                    copayAmount = 500.00; // Fixed copay for consultations
                    break;
                case 'Laboratory':
                    copayPercentage = 10.00; // 10% copay for lab tests
                    break;
                case 'Radiology':
                    copayPercentage = 15.00; // 15% copay for radiology
                    break;
                case 'Procedure':
                    copayPercentage = 20.00; // 20% copay for procedures
                    break;
                case 'Inpatient':
                    copayAmount = 5000.00; // Fixed daily copay for inpatient
                    break;
                case 'Pharmacy':
                    copayPercentage = 10.00;
                    break;
                case 'Maternity':
                    copayAmount = 0.00; // No copay for maternity
                    break;
                case 'Dental':
                    copayPercentage = 25.00; // 25% copay for dental
                    break;
                case 'Optical':
                    copayPercentage = 30.00; // 30% copay for optical
                    break;
                case 'Physiotherapy':
                    copayPercentage = 15.00;
                    break;
                case 'Emergency':
                    copayAmount = 0.00; // No copay for emergency
                    break;
                default:
                    copayPercentage = 10.00;
            }

            tariffs.push({
                hmo_provider_id: hmo.id,
                service_code_id: service.id,
                tariff_amount: tariffAmount,
                copay_amount: copayAmount > 0 ? copayAmount : null,
                copay_percentage: copayPercentage,
                effective_from: today,
                effective_to: null, // Open-ended
            });
        }
    }

    // Insert tariffs in batches to avoid SQLite limits
    const batchSize = 100;
    for (let i = 0; i < tariffs.length; i += batchSize) {
        const batch = tariffs.slice(i, i + batchSize);
        await knex('hmo_tariffs').insert(batch);
    }

    console.log(`Created ${tariffs.length} tariff mappings for ${hmoProviders.length} HMOs and ${serviceCodes.length} service codes`);
}
