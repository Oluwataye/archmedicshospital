import axios from 'axios';
import type {
    HMOClaim,
    CreateHMOClaimDTO,
    ClaimsFilters,
    ClaimsStatistics
} from '@/types/hmo';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

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
