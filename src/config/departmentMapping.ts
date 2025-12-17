// Department mapping configuration for disease categorization
export const DEPARTMENT_MAPPING: Record<string, string> = {
    // Cardiology
    'hypertension': 'Cardiology',
    'heart disease': 'Cardiology',
    'coronary artery disease': 'Cardiology',
    'arrhythmia': 'Cardiology',
    'heart failure': 'Cardiology',
    'myocardial infarction': 'Cardiology',
    'angina': 'Cardiology',
    'atrial fibrillation': 'Cardiology',

    // Endocrinology
    'diabetes': 'Endocrinology',
    'type 1 diabetes': 'Endocrinology',
    'type 2 diabetes': 'Endocrinology',
    'thyroid disorder': 'Endocrinology',
    'hypothyroidism': 'Endocrinology',
    'hyperthyroidism': 'Endocrinology',
    'metabolic syndrome': 'Endocrinology',

    // Pulmonology
    'asthma': 'Pulmonology',
    'copd': 'Pulmonology',
    'pneumonia': 'Pulmonology',
    'bronchitis': 'Pulmonology',
    'tuberculosis': 'Pulmonology',
    'lung disease': 'Pulmonology',
    'respiratory infection': 'Pulmonology',

    // Psychiatry
    'depression': 'Psychiatry',
    'anxiety': 'Psychiatry',
    'bipolar disorder': 'Psychiatry',
    'schizophrenia': 'Psychiatry',
    'ptsd': 'Psychiatry',
    'ocd': 'Psychiatry',
    'panic disorder': 'Psychiatry',

    // Neurology
    'stroke': 'Neurology',
    'epilepsy': 'Neurology',
    'migraine': 'Neurology',
    'parkinson': 'Neurology',
    'alzheimer': 'Neurology',
    'multiple sclerosis': 'Neurology',
    'neuropathy': 'Neurology',

    // Gastroenterology
    'gastritis': 'Gastroenterology',
    'ulcer': 'Gastroenterology',
    'ibs': 'Gastroenterology',
    'crohn': 'Gastroenterology',
    'colitis': 'Gastroenterology',
    'hepatitis': 'Gastroenterology',
    'cirrhosis': 'Gastroenterology',

    // Nephrology
    'kidney disease': 'Nephrology',
    'renal failure': 'Nephrology',
    'kidney stones': 'Nephrology',
    'uti': 'Nephrology',
    'urinary tract infection': 'Nephrology',

    // Orthopedics
    'fracture': 'Orthopedics',
    'arthritis': 'Orthopedics',
    'osteoporosis': 'Orthopedics',
    'back pain': 'Orthopedics',
    'joint pain': 'Orthopedics',
    'disc herniation': 'Orthopedics',

    // Infectious Disease
    'influenza': 'Infectious Disease',
    'covid-19': 'Infectious Disease',
    'malaria': 'Infectious Disease',
    'hiv': 'Infectious Disease',
    'aids': 'Infectious Disease',
    'sepsis': 'Infectious Disease',

    // Oncology
    'cancer': 'Oncology',
    'tumor': 'Oncology',
    'leukemia': 'Oncology',
    'lymphoma': 'Oncology',
    'carcinoma': 'Oncology',
};

/**
 * Get department for a given diagnosis
 * @param diagnosis - The diagnosis string
 * @returns Department name or 'General Medicine' as fallback
 */
export const getDepartment = (diagnosis: string): string => {
    if (!diagnosis) return 'General Medicine';

    const normalizedDiagnosis = diagnosis.toLowerCase().trim();

    // Check for exact match
    if (DEPARTMENT_MAPPING[normalizedDiagnosis]) {
        return DEPARTMENT_MAPPING[normalizedDiagnosis];
    }

    // Check for partial match
    for (const [key, department] of Object.entries(DEPARTMENT_MAPPING)) {
        if (normalizedDiagnosis.includes(key) || key.includes(normalizedDiagnosis)) {
            return department;
        }
    }

    // Default fallback
    return 'General Medicine';
};

/**
 * Get all unique departments
 */
export const getAllDepartments = (): string[] => {
    const departments = new Set(Object.values(DEPARTMENT_MAPPING));
    departments.add('General Medicine');
    return Array.from(departments).sort();
};
