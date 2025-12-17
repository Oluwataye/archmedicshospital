import { useState, useEffect } from 'react';
import { ApiService } from '@/services/apiService';
import { toast } from 'sonner';
import { LabResult } from '@/types/lab';

interface LabStatistics {
    todayTests: number;
    pendingTests: number;
    completedToday: number;
    criticalResults: number;
}

export function useLabStatistics() {
    const [statistics, setStatistics] = useState<LabStatistics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStatistics = async () => {
        try {
            setLoading(true);
            const data = await ApiService.getLabStatistics();
            setStatistics(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch lab statistics');
            toast.error('Failed to load lab statistics');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatistics();
    }, []);

    return { statistics, loading, error, refetch: fetchStatistics };
}

export function usePendingLabOrders() {
    const [orders, setOrders] = useState<LabResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const data = await ApiService.getPendingLabOrders();
            setOrders(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch pending orders');
            toast.error('Failed to load pending orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return { orders, loading, error, refetch: fetchOrders };
}

export function useCriticalLabResults() {
    const [results, setResults] = useState<LabResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchResults = async () => {
        try {
            setLoading(true);
            const data = await ApiService.getCriticalLabResults();
            setResults(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch critical results');
            toast.error('Failed to load critical results');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResults();
    }, []);

    return { results, loading, error, refetch: fetchResults };
}

export function useCompletedLabResults() {
    const [results, setResults] = useState<LabResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchResults = async () => {
        try {
            setLoading(true);
            const data = await ApiService.getCompletedLabResults();
            setResults(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch completed results');
            toast.error('Failed to load completed results');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResults();
    }, []);

    return { results, loading, error, refetch: fetchResults };
}

export function useLabResults(filters?: any) {
    const [results, setResults] = useState<LabResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchResults = async () => {
        try {
            setLoading(true);
            const data = await ApiService.getLabResults(filters);
            setResults(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch lab results');
            toast.error('Failed to load lab results');
        } finally {
            setLoading(false);
        }
    };

    const updateResult = async (id: string, updates: any) => {
        try {
            await ApiService.updateLabResult(id, updates);
            toast.success('Lab result updated successfully');
            fetchResults();
        } catch (err: any) {
            toast.error('Failed to update lab result');
            throw err;
        }
    };

    const createOrder = async (orderData: any) => {
        try {
            await ApiService.createLabOrder(orderData);
            toast.success('Lab order created successfully');
            fetchResults();
        } catch (err: any) {
            toast.error('Failed to create lab order');
            throw err;
        }
    };

    const billOrder = async (id: string) => {
        try {
            await ApiService.billLabOrder(id);
            // toast success handled in page or here
            toast.success('Invoice created sent to cashier');
            fetchResults();
        } catch (err: any) {
            toast.error('Failed to bill lab order');
            throw err;
        }
    };

    useEffect(() => {
        fetchResults();
    }, [JSON.stringify(filters)]);

    return { results, loading, error, refetch: fetchResults, updateResult, createOrder, billOrder };
}
