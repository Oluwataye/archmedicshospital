/**
 * React Query hooks for Patients
 */

import { useQuery } from '@tanstack/react-query';
import { ApiService } from '@/services/apiService';
import { Patient } from '@/types/patient';

export const patientKeys = {
    all: ['patients'] as const,
    lists: () => [...patientKeys.all, 'list'] as const,
    list: (filters: any) => [...patientKeys.lists(), filters] as const,
    search: (query: string) => [...patientKeys.all, 'search', query] as const,
};

/**
 * Get all patients
 */
export function usePatients(filters?: any) {
    return useQuery({
        queryKey: patientKeys.list(filters || {}),
        queryFn: async () => {
            const response = await ApiService.getPatients(filters);
            // Handle different response structures (array or object with data property)
            return Array.isArray(response) ? response : response.data || [];
        },
        staleTime: 5 * 60 * 1000,
    });
}

/**
 * Search patients
 */
export function usePatientSearch(searchQuery: string) {
    return useQuery({
        queryKey: patientKeys.search(searchQuery),
        queryFn: async () => {
            if (!searchQuery) return [];
            const response = await ApiService.getPatients({ search: searchQuery });
            return Array.isArray(response) ? response : response.data || [];
        },
        enabled: searchQuery.length >= 2,
    });
}
