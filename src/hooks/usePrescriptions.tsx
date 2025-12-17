import { useState, useEffect } from 'react';
import { ApiService } from '@/services/apiService';
import { toast } from 'sonner';

export interface Prescription {
    id: string;
    patient_id: string;
    doctor_id: string;
    medication_name: string;
    dosage: string;
    frequency: string;
    duration: string;
    quantity?: number;
    refills?: number;
    instructions?: string;
    status: string;
    prescribed_date: string;
    start_date?: string;
    end_date?: string;
    notes?: string;
    created_at?: string;
    updated_at?: string;
}

export const usePrescriptions = (patientId?: string) => {
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadPrescriptions = async (params?: any) => {
        try {
            setLoading(true);
            setError(null);

            let data;
            if (patientId) {
                data = await ApiService.getPatientPrescriptionHistory(patientId, params);
            } else {
                data = await ApiService.getPrescriptions(params);
            }

            setPrescriptions(Array.isArray(data) ? data : []);
        } catch (err: any) {
            console.error('Error loading prescriptions:', err);
            setError(err.message || 'Failed to load prescriptions');
            toast.error('Failed to load prescriptions');
        } finally {
            setLoading(false);
        }
    };

    const createPrescription = async (prescriptionData: any) => {
        try {
            const newPrescription = await ApiService.createPrescription(prescriptionData);
            toast.success('Prescription created successfully');
            await loadPrescriptions();
            return newPrescription;
        } catch (err: any) {
            console.error('Error creating prescription:', err);
            toast.error(err.response?.data?.error || 'Failed to create prescription');
            throw err;
        }
    };

    const updatePrescription = async (id: string, updates: any) => {
        try {
            const updated = await ApiService.updatePrescription(id, updates);
            toast.success('Prescription updated successfully');
            await loadPrescriptions();
            return updated;
        } catch (err: any) {
            console.error('Error updating prescription:', err);
            toast.error('Failed to update prescription');
            throw err;
        }
    };

    const cancelPrescription = async (id: string) => {
        try {
            await ApiService.cancelPrescription(id);
            toast.success('Prescription cancelled successfully');
            await loadPrescriptions();
        } catch (err: any) {
            console.error('Error cancelling prescription:', err);
            toast.error('Failed to cancel prescription');
            throw err;
        }
    };

    const getActivePrescriptions = () => {
        return prescriptions.filter(rx => rx.status === 'active' || rx.status === 'pending');
    };

    const getPrescriptionsByStatus = (status: string) => {
        return prescriptions.filter(rx => rx.status === status);
    };

    useEffect(() => {
        if (patientId) {
            loadPrescriptions();
        }
    }, [patientId]);

    return {
        prescriptions,
        loading,
        error,
        loadPrescriptions,
        createPrescription,
        updatePrescription,
        cancelPrescription,
        getActivePrescriptions,
        getPrescriptionsByStatus,
    };
};
