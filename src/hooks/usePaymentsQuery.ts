/**
 * React Query hooks for Payments
 * Provides data fetching, mutations, and caching for payment operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiService } from '@/services/apiService';
import { Payment, PaymentFilters, CreatePaymentData, PaymentStatistics } from '@/types/payment';
import { toast } from 'sonner';

// Query Keys
export const paymentKeys = {
    all: ['payments'] as const,
    lists: () => [...paymentKeys.all, 'list'] as const,
    list: (filters: PaymentFilters) => [...paymentKeys.lists(), filters] as const,
    details: () => [...paymentKeys.all, 'detail'] as const,
    detail: (id: number) => [...paymentKeys.details(), id] as const,
    statistics: () => [...paymentKeys.all, 'statistics'] as const,
};

// Hooks

/**
 * Fetch list of payments with filters
 */
export function usePayments(filters?: PaymentFilters) {
    return useQuery({
        queryKey: paymentKeys.list(filters || {}),
        queryFn: () => ApiService.getPayments(filters),
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
}

/**
 * Fetch single payment by ID
 */
export function usePayment(id: number) {
    return useQuery({
        queryKey: paymentKeys.detail(id),
        queryFn: () => ApiService.getPayment(id),
        enabled: !!id && id > 0,
    });
}

/**
 * Fetch payment statistics
 */
export function usePaymentStatistics() {
    return useQuery({
        queryKey: paymentKeys.statistics(),
        queryFn: () => ApiService.getPaymentStatistics(),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

/**
 * Create new payment
 */
export function useCreatePayment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreatePaymentData) => ApiService.createPayment(data),
        onSuccess: () => {
            // Invalidate all payment queries to refetch
            queryClient.invalidateQueries({ queryKey: paymentKeys.all });
            toast.success('Payment created successfully');
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Failed to create payment';
            toast.error(message);
        },
    });
}

/**
 * Update payment
 */
export function useUpdatePayment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updates }: { id: number; updates: Partial<Payment> }) =>
            ApiService.updatePayment(id, updates),
        onSuccess: (_, variables) => {
            // Invalidate specific payment and list
            queryClient.invalidateQueries({ queryKey: paymentKeys.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: paymentKeys.lists() });
            toast.success('Payment updated successfully');
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || 'Failed to update payment';
            toast.error(message);
        },
    });
}
