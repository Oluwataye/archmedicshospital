import { useState, useEffect, useCallback } from 'react';
import { ApiService } from '@/services/apiService';
import { toast } from 'sonner';

export interface PharmacyStats {
    pendingVerifications: number;
    readyToDispense: number;
    inventoryAlerts: number;
    totalPrescriptionsToday: number;
}

export interface PharmacyActivity {
    time: string;
    activity: string;
    type: 'New Prescription' | 'Approval' | 'Inventory' | 'Alert';
}

export function usePharmacy() {
    const [stats, setStats] = useState<PharmacyStats>({
        pendingVerifications: 0,
        readyToDispense: 0,
        inventoryAlerts: 0,
        totalPrescriptionsToday: 0
    });
    const [recentPrescriptions, setRecentPrescriptions] = useState<any[]>([]);
    const [recentActivity, setRecentActivity] = useState<PharmacyActivity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const [prescriptions, alerts, statsOverview] = await Promise.all([
                ApiService.getActivePrescriptions(),
                ApiService.getInventoryAlerts(),
                ApiService.getPrescriptionStats()
            ]);

            setRecentPrescriptions(prescriptions.slice(0, 10)); // Top 10 recent

            // Calculate stats
            const pendingCount = prescriptions.filter((p: any) => p.status === 'active' || p.status === 'pending').length;

            setStats({
                pendingVerifications: pendingCount,
                readyToDispense: prescriptions.filter((p: any) => p.status === 'active').length,
                inventoryAlerts: (alerts.lowStock?.length || 0) + (alerts.expiringBatches?.length || 0),
                totalPrescriptionsToday: statsOverview.total || 0
            });

            // Mock some activity for now, as we don't have a specific endpoint for it yet
            // In a real app, this would come from an audit log or activity feed
            const mockActivities: PharmacyActivity[] = [
                { time: 'Just now', activity: 'System check completed', type: 'Inventory' }
            ];
            setRecentActivity(mockActivities);

        } catch (err: any) {
            console.error('Error fetching pharmacy data:', err);
            setError(err.message || 'Failed to load pharmacy data');
            toast.error('Failed to load pharmacy dashboard data');
        } finally {
            setLoading(false);
        }
    }, []);

    const approvePrescription = async (id: string) => {
        try {
            await ApiService.updatePrescription(id, { status: 'approved' });
            toast.success('Prescription approved successfully');
            await fetchData();
        } catch (err) {
            toast.error('Failed to approve prescription');
        }
    };

    const rejectPrescription = async (id: string) => {
        try {
            await ApiService.updatePrescription(id, { status: 'rejected' });
            toast.success('Prescription rejected');
            await fetchData();
        } catch (err) {
            toast.error('Failed to reject prescription');
        }
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        stats,
        recentPrescriptions,
        recentActivity,
        loading,
        error,
        refresh: fetchData,
        approvePrescription,
        rejectPrescription
    };
}
