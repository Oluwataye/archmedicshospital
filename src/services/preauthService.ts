import axios from 'axios';
import type {
    HMOPreAuthorization,
    CreatePreAuthorizationDTO,
    PreAuthFilters
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

export class PreAuthService {
    static async getPreAuthorizations(filters?: PreAuthFilters): Promise<HMOPreAuthorization[]> {
        const response = await apiClient.get('/preauth', { params: filters });
        return response.data;
    }

    static async getPreAuthorization(id: string): Promise<HMOPreAuthorization> {
        const response = await apiClient.get(`/preauth/${id}`);
        return response.data;
    }

    static async createPreAuthorization(data: CreatePreAuthorizationDTO): Promise<HMOPreAuthorization> {
        const response = await apiClient.post('/preauth', data);
        return response.data;
    }

    static async updatePreAuthorization(id: string, data: Partial<CreatePreAuthorizationDTO>): Promise<HMOPreAuthorization> {
        const response = await apiClient.put(`/preauth/${id}`, data);
        return response.data;
    }

    static async approvePreAuthorization(id: string, approvedAmount: number): Promise<HMOPreAuthorization> {
        const response = await apiClient.post(`/preauth/${id}/approve`, { approved_amount: approvedAmount });
        return response.data;
    }

    static async rejectPreAuthorization(id: string, reason: string): Promise<HMOPreAuthorization> {
        const response = await apiClient.post(`/preauth/${id}/reject`, { reason });
        return response.data;
    }
}

export default PreAuthService;
