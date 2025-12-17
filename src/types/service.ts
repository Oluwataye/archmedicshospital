/**
 * Service Types
 */

export interface Service {
    id: number;
    name: string;
    code?: string;
    category?: string;
    department?: string;
    price: number;
    description?: string;
    is_active?: boolean;
}

export interface ServiceFilters {
    search?: string;
    category?: string;
    department?: string;
    is_active?: boolean;
    limit?: number;
}

export interface ServiceSearchResult extends Service {
    // Additional fields for search results
    match_score?: number;
}
