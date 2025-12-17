/**
 * Vital Signs Color-Coding Utility
 * Provides consistent color-coding logic for vital signs across the application
 */

export type VitalStatus = 'normal' | 'borderline' | 'danger';

// Medical ranges for vital signs
export const VITAL_RANGES = {
    bloodPressure: {
        systolic: {
            normal: { min: 90, max: 120 },
            borderline: { min: 121, max: 139 },
            // < 90 or >= 140 is danger
        },
        diastolic: {
            normal: { min: 60, max: 80 },
            borderline: { min: 81, max: 89 },
            // < 60 or >= 90 is danger
        }
    },
    heartRate: {
        normal: { min: 60, max: 100 },
        borderline: { min: 50, max: 110 },
        // < 50 or > 110 is danger
    },
    temperature: {
        normal: { min: 97.0, max: 99.0 },
        borderline: { min: 96.0, max: 100.4 },
        // < 96.0 or > 100.4 is danger
    },
    oxygenSaturation: {
        normal: { min: 95, max: 100 },
        borderline: { min: 90, max: 94 },
        // < 90 is danger
    }
};

/**
 * Parse blood pressure string into systolic and diastolic values
 */
export const parseBP = (bp: string): { systolic: number | null; diastolic: number | null } => {
    if (!bp || bp === '--/--' || bp === 'N/A') return { systolic: null, diastolic: null };
    const parts = bp.split('/');
    return {
        systolic: parseInt(parts[0]),
        diastolic: parseInt(parts[1])
    };
};

/**
 * Get status for blood pressure
 */
export const getBPStatus = (bp: string): VitalStatus => {
    const { systolic, diastolic } = parseBP(bp);
    if (!systolic || !diastolic) return 'normal';

    const systolicDanger = systolic < 90 || systolic >= 140;
    const diastolicDanger = diastolic < 60 || diastolic >= 90;

    if (systolicDanger || diastolicDanger) return 'danger';

    const systolicBorderline = systolic >= VITAL_RANGES.bloodPressure.systolic.borderline.min &&
        systolic <= VITAL_RANGES.bloodPressure.systolic.borderline.max;
    const diastolicBorderline = diastolic >= VITAL_RANGES.bloodPressure.diastolic.borderline.min &&
        diastolic <= VITAL_RANGES.bloodPressure.diastolic.borderline.max;

    if (systolicBorderline || diastolicBorderline) return 'borderline';

    return 'normal';
};

/**
 * Get status for heart rate
 */
export const getHRStatus = (hr: string | number): VitalStatus => {
    const value = typeof hr === 'string' ? parseInt(hr) : hr;
    if (!value || isNaN(value)) return 'normal';

    if (value < 50 || value > 110) return 'danger';
    if ((value >= 50 && value < 60) || (value > 100 && value <= 110)) return 'borderline';
    return 'normal';
};

/**
 * Get status for temperature
 */
export const getTempStatus = (temp: string | number): VitalStatus => {
    const value = typeof temp === 'string' ? parseFloat(temp) : temp;
    if (!value || isNaN(value)) return 'normal';

    if (value < 96.0 || value > 100.4) return 'danger';
    if ((value >= 96.0 && value < 97.0) || (value > 99.0 && value <= 100.4)) return 'borderline';
    return 'normal';
};

/**
 * Get status for oxygen saturation
 */
export const getO2Status = (o2: string | number): VitalStatus => {
    const value = typeof o2 === 'string' ? parseInt(o2) : o2;
    if (!value || isNaN(value)) return 'normal';

    if (value < 90) return 'danger';
    if (value >= 90 && value < 95) return 'borderline';
    return 'normal';
};

/**
 * Get card styling classes based on status
 */
export const getVitalCardClasses = (status: VitalStatus): string => {
    switch (status) {
        case 'danger':
            return 'border-2 border-red-500 bg-red-50 dark:bg-red-950/20';
        case 'borderline':
            return 'border-2 border-amber-500 bg-amber-50 dark:bg-amber-950/20';
        case 'normal':
            return 'border-2 border-green-500 bg-green-50 dark:bg-green-950/20';
        default:
            return '';
    }
};

/**
 * Get text color classes based on status
 */
export const getVitalTextColor = (status: VitalStatus): string => {
    switch (status) {
        case 'danger':
            return 'text-red-700 dark:text-red-400';
        case 'borderline':
            return 'text-amber-700 dark:text-amber-400';
        case 'normal':
            return 'text-green-700 dark:text-green-400';
        default:
            return '';
    }
};

/**
 * Get status label text
 */
export const getVitalStatusLabel = (status: VitalStatus, vitalType?: 'o2'): string => {
    switch (status) {
        case 'danger':
            return vitalType === 'o2' ? 'Critical' : 'Abnormal';
        case 'borderline':
            return 'Borderline';
        case 'normal':
            return 'Normal';
        default:
            return '';
    }
};

/**
 * Get all vital statuses at once
 */
export const getVitalStatuses = (vitals: {
    bloodPressure?: string;
    heartRate?: string | number;
    temperature?: string | number;
    oxygenSaturation?: string | number;
}) => {
    return {
        bp: vitals.bloodPressure ? getBPStatus(vitals.bloodPressure) : 'normal',
        hr: vitals.heartRate ? getHRStatus(vitals.heartRate) : 'normal',
        temp: vitals.temperature ? getTempStatus(vitals.temperature) : 'normal',
        o2: vitals.oxygenSaturation ? getO2Status(vitals.oxygenSaturation) : 'normal',
    };
};
