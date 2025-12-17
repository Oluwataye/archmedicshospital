/**
 * React Query hooks for Services
 */

import { useQuery } from '@tanstack/react-query';
import { ApiService } from '@/services/apiService';
import { Service, ServiceFilters } from '@/types/service';

export const serviceKeys = {
    all: ['services'] as const,
    lists: () => [...serviceKeys.all, 'list'] as const,
    list: (filters: ServiceFilters) => [...serviceKeys.lists(), filters] as const,
    search: (query: string) => [...serviceKeys.all, 'search', query] as const,
};

/**
 * Search services with autocomplete
 * Only triggers when search query has 3+ characters
 */
export function useServiceSearch(searchQuery: string, filters: ServiceFilters = {}, options?: { enabled?: boolean }) {
    const shouldSearch = searchQuery.length >= 3;

    return useQuery({
        queryKey: [...serviceKeys.search(searchQuery), filters],
        queryFn: async () => {
            if (!shouldSearch) return [];

            const response = await ApiService.getServices({
                search: searchQuery,
                limit: 20, // Limit results for performance
                is_active: true, // Only show active services
                ...filters
            });

            // Handle various response formats
            if (Array.isArray(response)) return response;
            if (response.services) return response.services;
            if (response.data) return response.data;
            return [];
        },
        enabled: shouldSearch && (options?.enabled !== false),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

/**
 * Get all services (for initial load or full list)
 */
export function useServices(filters?: ServiceFilters) {
    return useQuery({
        queryKey: serviceKeys.list(filters || {}),
        queryFn: () => ApiService.get('/services', { params: filters }),
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}
