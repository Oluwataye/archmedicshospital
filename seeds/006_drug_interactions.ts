import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Clear existing data
    await knex('interaction_checks').del();
    await knex('allergy_interactions').del();
    await knex('drug_contraindications').del();
    await knex('drug_interactions').del();

    // Insert common drug interactions
    await knex('drug_interactions').insert([
        // Critical Interactions
        {
            drug_a: 'Warfarin',
            drug_b: 'Aspirin',
            severity: 'Critical',
            description: 'Increased risk of bleeding',
            clinical_effects: 'Combined anticoagulant and antiplatelet effects significantly increase bleeding risk, including life-threatening hemorrhage.',
            management_recommendation: 'Avoid combination if possible. If necessary, use lowest effective doses and monitor INR closely. Consider alternative analgesics.',
            evidence_level: 'Well-documented'
        },
        {
            drug_a: 'Metformin',
            drug_b: 'Contrast Media (Iodinated)',
            severity: 'Critical',
            description: 'Risk of lactic acidosis',
            clinical_effects: 'Contrast media can cause acute kidney injury, leading to metformin accumulation and lactic acidosis.',
            management_recommendation: 'Discontinue metformin before or at the time of imaging procedure. Restart only after 48 hours and after renal function confirmed normal.',
            evidence_level: 'Well-documented'
        },
        {
            drug_a: 'Sildenafil',
            drug_b: 'Nitroglycerin',
            severity: 'Critical',
            description: 'Severe hypotension',
            clinical_effects: 'Potentiation of hypotensive effects can lead to life-threatening drop in blood pressure.',
            management_recommendation: 'Absolute contraindication. Do not use within 24 hours of each other.',
            evidence_level: 'Well-documented'
        },
        {
            drug_a: 'Simvastatin',
            drug_b: 'Clarithromycin',
            severity: 'Critical',
            description: 'Increased risk of rhabdomyolysis',
            clinical_effects: 'Clarithromycin inhibits CYP3A4, increasing simvastatin levels and risk of muscle toxicity.',
            management_recommendation: 'Suspend simvastatin during clarithromycin therapy. Consider alternative antibiotic or statin.',
            evidence_level: 'Well-documented'
        },

        // Major Interactions
        {
            drug_a: 'Lisinopril',
            drug_b: 'Spironolactone',
            severity: 'Major',
            description: 'Risk of hyperkalemia',
            clinical_effects: 'Both drugs increase potassium levels, potentially leading to dangerous hyperkalemia.',
            management_recommendation: 'Monitor potassium levels closely. Consider dose adjustment. Avoid potassium supplements.',
            evidence_level: 'Well-documented'
        },
        {
            drug_a: 'Methotrexate',
            drug_b: 'Ibuprofen',
            severity: 'Major',
            description: 'Increased methotrexate toxicity',
            clinical_effects: 'NSAIDs reduce methotrexate clearance, increasing risk of bone marrow suppression and hepatotoxicity.',
            management_recommendation: 'Avoid NSAIDs during methotrexate therapy. Use acetaminophen for pain relief. Monitor CBC and liver function.',
            evidence_level: 'Well-documented'
        },
        {
            drug_a: 'Digoxin',
            drug_b: 'Furosemide',
            severity: 'Major',
            description: 'Increased digoxin toxicity risk',
            clinical_effects: 'Furosemide-induced hypokalemia increases risk of digoxin toxicity.',
            management_recommendation: 'Monitor potassium and digoxin levels. Supplement potassium as needed.',
            evidence_level: 'Well-documented'
        },
        {
            drug_a: 'Levothyroxine',
            drug_b: 'Calcium Carbonate',
            severity: 'Major',
            description: 'Reduced levothyroxine absorption',
            clinical_effects: 'Calcium binds to levothyroxine, reducing its absorption and effectiveness.',
            management_recommendation: 'Separate administration by at least 4 hours. Monitor TSH levels.',
            evidence_level: 'Well-documented'
        },

        // Moderate Interactions
        {
            drug_a: 'Omeprazole',
            drug_b: 'Clopidogrel',
            severity: 'Moderate',
            description: 'Reduced clopidogrel effectiveness',
            clinical_effects: 'Omeprazole inhibits CYP2C19, reducing conversion of clopidogrel to active form.',
            management_recommendation: 'Consider alternative PPI (pantoprazole) or H2 blocker. Separate dosing times.',
            evidence_level: 'Well-documented'
        },
        {
            drug_a: 'Ciprofloxacin',
            drug_b: 'Theophylline',
            severity: 'Moderate',
            description: 'Increased theophylline levels',
            clinical_effects: 'Ciprofloxacin inhibits theophylline metabolism, increasing risk of toxicity.',
            management_recommendation: 'Monitor theophylline levels. Consider dose reduction. Watch for signs of toxicity.',
            evidence_level: 'Well-documented'
        },
        {
            drug_a: 'Amoxicillin',
            drug_b: 'Oral Contraceptives',
            severity: 'Moderate',
            description: 'Reduced contraceptive effectiveness',
            clinical_effects: 'Antibiotics may reduce gut flora that help activate oral contraceptives.',
            management_recommendation: 'Use additional barrier contraception during antibiotic therapy and for 7 days after.',
            evidence_level: 'Theoretical'
        },
        {
            drug_a: 'Prednisone',
            drug_b: 'Ibuprofen',
            severity: 'Moderate',
            description: 'Increased GI bleeding risk',
            clinical_effects: 'Both drugs increase risk of gastric ulceration and bleeding.',
            management_recommendation: 'Use gastroprotection (PPI). Monitor for GI symptoms. Consider alternative analgesic.',
            evidence_level: 'Well-documented'
        }
    ]);

    // Insert drug contraindications
    await knex('drug_contraindications').insert([
        {
            drug_name: 'Metformin',
            condition: 'Severe Renal Impairment (eGFR <30)',
            severity: 'Absolute',
            description: 'Risk of lactic acidosis in patients with severe kidney disease',
            alternative_recommendations: 'Consider insulin therapy or other diabetes medications safe in renal impairment (e.g., DPP-4 inhibitors with dose adjustment)'
        },
        {
            drug_name: 'Aspirin',
            condition: 'Active Peptic Ulcer Disease',
            severity: 'Absolute',
            description: 'High risk of gastrointestinal bleeding',
            alternative_recommendations: 'Use alternative antiplatelet (clopidogrel) with PPI, or address ulcer before starting aspirin'
        },
        {
            drug_name: 'ACE Inhibitors',
            condition: 'Pregnancy',
            severity: 'Absolute',
            description: 'Teratogenic effects, risk of fetal renal dysfunction and death',
            alternative_recommendations: 'Use methyldopa, labetalol, or nifedipine for hypertension in pregnancy'
        },
        {
            drug_name: 'Statins',
            condition: 'Active Liver Disease',
            severity: 'Absolute',
            description: 'Risk of hepatotoxicity and elevated liver enzymes',
            alternative_recommendations: 'Address liver disease first. Consider ezetimibe or PCSK9 inhibitors'
        },
        {
            drug_name: 'NSAIDs',
            condition: 'Heart Failure (NYHA Class III-IV)',
            severity: 'Relative',
            description: 'Fluid retention and worsening heart failure',
            alternative_recommendations: 'Use acetaminophen for pain. If NSAID necessary, use lowest dose for shortest duration with close monitoring'
        },
        {
            drug_name: 'Metronidazole',
            condition: 'First Trimester Pregnancy',
            severity: 'Relative',
            description: 'Potential teratogenic effects',
            alternative_recommendations: 'Avoid if possible. If necessary, use after first trimester with careful risk-benefit assessment'
        },
        {
            drug_name: 'Fluoroquinolones',
            condition: 'History of Tendon Disorders',
            severity: 'Relative',
            description: 'Increased risk of tendon rupture',
            alternative_recommendations: 'Use alternative antibiotic class. If necessary, counsel patient on tendon pain and discontinuation'
        },
        {
            drug_name: 'Benzodiazepines',
            condition: 'Severe Respiratory Disease',
            severity: 'Relative',
            description: 'Risk of respiratory depression',
            alternative_recommendations: 'Use alternative anxiolytic or sedative. If necessary, use lowest dose with close monitoring'
        }
    ]);

    // Insert allergy cross-sensitivities
    await knex('allergy_interactions').insert([
        {
            allergen: 'Penicillin',
            drug_name: 'Amoxicillin',
            cross_sensitivity: 'High',
            description: 'Amoxicillin is a penicillin derivative with complete cross-reactivity',
            precautions: 'Absolute contraindication. Use alternative antibiotic class (macrolides, fluoroquinolones, or cephalosporins with caution)'
        },
        {
            allergen: 'Penicillin',
            drug_name: 'Cephalexin',
            cross_sensitivity: 'Moderate',
            description: 'Cross-reactivity between penicillins and cephalosporins is approximately 2-10%',
            precautions: 'Use with caution. Avoid if history of severe penicillin reaction (anaphylaxis). Monitor closely for allergic reaction'
        },
        {
            allergen: 'Penicillin',
            drug_name: 'Meropenem',
            cross_sensitivity: 'Low',
            description: 'Carbapenems have low cross-reactivity with penicillins',
            precautions: 'Generally safe but use with caution. Monitor for allergic reaction, especially if severe penicillin allergy'
        },
        {
            allergen: 'Sulfa',
            drug_name: 'Sulfamethoxazole',
            cross_sensitivity: 'High',
            description: 'Sulfamethoxazole is a sulfonamide antibiotic',
            precautions: 'Absolute contraindication. Use alternative antibiotic'
        },
        {
            allergen: 'Sulfa',
            drug_name: 'Furosemide',
            cross_sensitivity: 'Low',
            description: 'Loop diuretics contain sulfonamide moiety but cross-reactivity is rare',
            precautions: 'Generally safe. Monitor for allergic reaction. Consider alternative diuretic if severe sulfa allergy'
        },
        {
            allergen: 'Aspirin',
            drug_name: 'Ibuprofen',
            cross_sensitivity: 'High',
            description: 'Cross-reactivity among NSAIDs is common in aspirin-sensitive patients',
            precautions: 'Avoid all NSAIDs. Use acetaminophen for pain/fever. Consider COX-2 inhibitors with caution under supervision'
        },
        {
            allergen: 'Codeine',
            drug_name: 'Morphine',
            cross_sensitivity: 'High',
            description: 'Cross-sensitivity among opioids is common',
            precautions: 'Avoid opioids if possible. If necessary, consider opioid from different class (e.g., fentanyl) under close supervision'
        },
        {
            allergen: 'Shellfish',
            drug_name: 'Iodinated Contrast Media',
            cross_sensitivity: 'Low',
            description: 'Shellfish allergy does not predict contrast allergy; both related to iodine is a myth',
            precautions: 'Shellfish allergy is not a contraindication. Assess for previous contrast reactions. Premedicate if history of any contrast reaction'
        }
    ]);

    console.log('Drug interactions, contraindications, and allergy data seeded successfully!');
}
