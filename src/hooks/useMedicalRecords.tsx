import { useState, useEffect } from 'react';
import { ApiService } from '@/services/apiService';
import { toast } from 'sonner';

export interface MedicalRecord {
    id: string;
    patient_id: string;
    provider_id: string;
    record_type: string;
    record_date: string;
    title: string;
    content: string;
    attachments?: string;
    status: string;
    created_at?: string;
    updated_at?: string;
}

export const useMedicalRecords = (patientId?: string) => {
    const [records, setRecords] = useState<MedicalRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadRecords = async (params?: any) => {
        try {
            setLoading(true);
            setError(null);

            let data;
            if (patientId) {
                data = await ApiService.getPatientMedicalHistory(patientId, params);
            } else {
                data = await ApiService.getMedicalRecords(params);
            }

            setRecords(Array.isArray(data) ? data : []);
        } catch (err: any) {
            console.error('Error loading medical records:', err);
            setError(err.message || 'Failed to load medical records');
            toast.error('Failed to load medical records');
        } finally {
            setLoading(false);
        }
    };

    const createRecord = async (recordData: any) => {
        try {
            const newRecord = await ApiService.createMedicalRecord(recordData);
            toast.success('Medical record created successfully');
            await loadRecords();
            return newRecord;
        } catch (err: any) {
            console.error('Error creating medical record:', err);
            toast.error(err.response?.data?.error || 'Failed to create medical record');
            throw err;
        }
    };

    const updateRecord = async (id: string, recordData: any) => {
        try {
            const updated = await ApiService.updateMedicalRecord(id, recordData);
            toast.success('Medical record updated successfully');
            await loadRecords();
            return updated;
        } catch (err: any) {
            console.error('Error updating medical record:', err);
            toast.error('Failed to update medical record');
            throw err;
        }
    };

    const deleteRecord = async (id: string) => {
        try {
            await ApiService.deleteMedicalRecord(id);
            toast.success('Medical record deleted successfully');
            await loadRecords();
        } catch (err: any) {
            console.error('Error deleting medical record:', err);
            toast.error('Failed to delete medical record');
            throw err;
        }
    };

    const getRecordsByType = (type: string) => {
        return records.filter(record => record.record_type === type);
    };

    useEffect(() => {
        if (patientId) {
            loadRecords();
        }
    }, [patientId]);

    return {
        records,
        loading,
        error,
        loadRecords,
        createRecord,
        updateRecord,
        deleteRecord,
        getRecordsByType,
    };
};
