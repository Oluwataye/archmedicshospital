import type {
    HMOClaim,
    CreateHMOClaimDTO,
    ClaimsFilters,
    ClaimsStatistics
} from '@/types/hmo';
import { apiClient } from './apiService';

export class ClaimsService {
    static async getClaims(filters?: ClaimsFilters): Promise<HMOClaim[]> {
        const response = await apiClient.get('/claims', { params: filters });
        return response.data;
    }

    static async getClaim(id: string): Promise<HMOClaim> {
        const response = await apiClient.get(`/claims/${id}`);
        return response.data;
    }

    static async createClaim(data: CreateHMOClaimDTO): Promise<HMOClaim> {
        const response = await apiClient.post('/claims', data);
        return response.data;
    }

    static async updateClaim(id: string, data: Partial<CreateHMOClaimDTO>): Promise<HMOClaim> {
        const response = await apiClient.put(`/claims/${id}`, data);
        return response.data;
    }

    static async submitClaim(id: string): Promise<HMOClaim> {
        const response = await apiClient.post(`/claims/${id}/submit`);
        return response.data;
    }

    static async getClaimsStatistics(): Promise<ClaimsStatistics> {
        const response = await apiClient.get('/claims/statistics');
        return response.data;
    }
}

export default ClaimsService;
