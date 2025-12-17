import { useState, useEffect } from 'react';
import { ApiService } from '@/services/apiService';
import { toast } from 'sonner';

export interface Appointment {
    id: string;
    patient_id: string;
    doctor_id: string;
    appointment_date: string;
    appointment_time: string;
    duration: number;
    type: string;
    status: string;
    notes?: string;
    symptoms?: string;
    diagnosis?: string;
    treatment?: string;
    room?: string;
    patient_first_name?: string;
    patient_last_name?: string;
    doctor_first_name?: string;
    doctor_last_name?: string;
    created_at?: string;
    updated_at?: string;
    patient_mrn?: string;
    patient_dob?: string;
    patient_gender?: string;
    last_visit?: string;
    vital_signs?: {
        temperature?: number;
        blood_pressure?: string;
        heart_rate?: number;
        respiratory_rate?: number;
        oxygen_saturation?: number;
        weight?: number;
        height?: number;
        bmi?: number;
        recorded_at: string;
    };
}

export const useAppointments = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadAppointments = async (params?: any) => {
        try {
            setLoading(true);
            setError(null);
            const data = await ApiService.getAppointments(params);
            setAppointments(data);
        } catch (err: any) {
            console.error('Error loading appointments:', err);
            setError(err.message || 'Failed to load appointments');
            toast.error('Failed to load appointments');
        } finally {
            setLoading(false);
        }
    };

    const createAppointment = async (appointmentData: any) => {
        try {
            const newAppointment = await ApiService.createAppointment(appointmentData);
            toast.success('Appointment created successfully');
            await loadAppointments();
            return newAppointment;
        } catch (err: any) {
            console.error('Error creating appointment:', err);
            toast.error(err.response?.data?.error || 'Failed to create appointment');
            throw err;
        }
    };

    const updateAppointment = async (id: string, appointmentData: any) => {
        try {
            const updated = await ApiService.updateAppointment(id, appointmentData);
            toast.success('Appointment updated successfully');
            await loadAppointments();
            return updated;
        } catch (err: any) {
            console.error('Error updating appointment:', err);
            toast.error('Failed to update appointment');
            throw err;
        }
    };

    const cancelAppointment = async (id: string) => {
        try {
            await ApiService.cancelAppointment(id);
            toast.success('Appointment cancelled successfully');
            await loadAppointments();
        } catch (err: any) {
            console.error('Error cancelling appointment:', err);
            toast.error('Failed to cancel appointment');
            throw err;
        }
    };

    const getDoctorAvailability = async (doctorId: string, date: string) => {
        try {
            return await ApiService.getDoctorAvailability(doctorId, date);
        } catch (err: any) {
            console.error('Error checking availability:', err);
            toast.error('Failed to check doctor availability');
            throw err;
        }
    };

    useEffect(() => {
        loadAppointments();
    }, []);

    return {
        appointments,
        loading,
        error,
        loadAppointments,
        createAppointment,
        updateAppointment,
        cancelAppointment,
        getDoctorAvailability,
    };
};
