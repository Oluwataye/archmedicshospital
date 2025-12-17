import { useState, useEffect } from 'react';
import { ApiService } from '@/services/apiService';
import { toast } from 'sonner';

export interface VitalSigns {
    id: string;
    patient_id: string;
    recorded_by: string;
    recorded_at: string;
    systolic_bp?: number;
    diastolic_bp?: number;
    heart_rate?: number;
    temperature?: number;
    respiratory_rate?: number;
    oxygen_saturation?: number;
    weight?: number;
    height?: number;
    bmi?: number;
    notes?: string;
    created_at?: string;
    updated_at?: string;
}

export const useVitalSigns = (patientId?: string) => {
    const [vitalSigns, setVitalSigns] = useState<VitalSigns[]>([]);
    const [latestVitals, setLatestVitals] = useState<VitalSigns | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadVitalSigns = async (params?: any) => {
        try {
            setLoading(true);
            setError(null);

            let data;
            if (patientId) {
                data = await ApiService.getPatientVitalHistory(patientId, params);
            } else {
                data = await ApiService.getVitalSigns(params);
            }

            const vitalsArray = Array.isArray(data) ? data : [];
            setVitalSigns(vitalsArray);

            // Set latest vitals
            if (vitalsArray.length > 0) {
                setLatestVitals(vitalsArray[vitalsArray.length - 1]);
            }
        } catch (err: any) {
            console.error('Error loading vital signs:', err);
            setError(err.message || 'Failed to load vital signs');
            toast.error('Failed to load vital signs');
        } finally {
            setLoading(false);
        }
    };

    const createVitalSigns = async (vitalData: any) => {
        try {
            const newVital = await ApiService.createVitalSigns(vitalData);
            toast.success('Vital signs recorded successfully');
            await loadVitalSigns();
            return newVital;
        } catch (err: any) {
            console.error('Error creating vital signs:', err);
            toast.error(err.response?.data?.error || 'Failed to record vital signs');
            throw err;
        }
    };

    const updateVitalSigns = async (id: string, vitalData: any) => {
        try {
            const updated = await ApiService.updateVitalSigns(id, vitalData);
            toast.success('Vital signs updated successfully');
            await loadVitalSigns();
            return updated;
        } catch (err: any) {
            console.error('Error updating vital signs:', err);
            toast.error('Failed to update vital signs');
            throw err;
        }
    };

    const deleteVitalSigns = async (id: string) => {
        try {
            await ApiService.deleteVitalSigns(id);
            toast.success('Vital signs deleted successfully');
            await loadVitalSigns();
        } catch (err: any) {
            console.error('Error deleting vital signs:', err);
            toast.error('Failed to delete vital signs');
            throw err;
        }
    };

    useEffect(() => {
        if (patientId) {
            loadVitalSigns();
        }
    }, [patientId]);

    return {
        vitalSigns,
        latestVitals,
        loading,
        error,
        loadVitalSigns,
        createVitalSigns,
        updateVitalSigns,
        deleteVitalSigns,
    };
};
