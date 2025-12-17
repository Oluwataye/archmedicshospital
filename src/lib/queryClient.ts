/**
 * React Query Client Configuration
 * Provides centralized data fetching, caching, and synchronization
 */

import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { toast } from 'sonner';

export const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: (error: any) => {
            const message = error?.response?.data?.message || error?.message || 'An error occurred';
            console.error('Query error:', message);
        },
    }),
    mutationCache: new MutationCache({
        onError: (error: any) => {
            const message = error?.response?.data?.message || error?.message || 'An error occurred';
            toast.error(message);
            console.error('Mutation error:', message);
        },
    }),
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            retry: (failureCount, error: any) => {
                // Don't retry on 4xx errors
                if (error?.response?.status >= 400 && error?.response?.status < 500) {
                    return false;
                }
                // Retry up to 2 times for other errors
                return failureCount < 2;
            },
        },
        mutations: {
            retry: false,
        },
    },
});
