import axios from 'axios';
import type {
    NHISServiceCode,
    CreateNHISServiceCodeDTO,
    ServiceCodeFilters,
    HMOTariff,
} from '@/types/hmo';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

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

export class NHISService {
    // Service Code Management
    static async getServiceCodes(filters?: ServiceCodeFilters): Promise<NHISServiceCode[]> {
        const response = await apiClient.get('/nhis/service-codes', {
            params: filters,
        });
        return response.data;
    }

    static async searchServiceCodes(query: string): Promise<NHISServiceCode[]> {
        const response = await apiClient.get('/nhis/service-codes/search', {
            params: { q: query },
        });
        return response.data;
    }

    static async getServiceCode(id: string): Promise<NHISServiceCode> {
        const response = await apiClient.get(`/nhis/service-codes/${id}`);
        return response.data;
    }

    static async getServiceCodeByCode(code: string): Promise<NHISServiceCode> {
        const response = await apiClient.get(`/nhis/service-codes/code/${code}`);
        return response.data;
    }

    static async createServiceCode(data: CreateNHISServiceCodeDTO): Promise<NHISServiceCode> {
        const response = await apiClient.post('/nhis/service-codes', data);
        return response.data;
    }

    static async updateServiceCode(
        id: string,
        data: Partial<CreateNHISServiceCodeDTO>
    ): Promise<NHISServiceCode> {
        const response = await apiClient.put(`/nhis/service-codes/${id}`, data);
        return response.data;
    }

    // Tariff Management
    static async getServiceTariffs(
        serviceCodeId: string,
        hmoProviderId?: string
    ): Promise<HMOTariff[]> {
        const response = await apiClient.get(`/nhis/service-codes/${serviceCodeId}/tariffs`, {
            params: { hmo_provider_id: hmoProviderId },
        });
        return response.data;
    }

    static async getTariffForService(
        serviceCodeId: string,
        hmoProviderId: string
    ): Promise<HMOTariff | null> {
        const response = await apiClient.get('/nhis/tariff', {
            params: {
                service_code_id: serviceCodeId,
                hmo_provider_id: hmoProviderId,
            },
        });
        return response.data;
    }

    // Service Categories
    static async getServiceCategories(): Promise<string[]> {
        const response = await apiClient.get('/nhis/service-codes/categories');
        return response.data;
    }
}

export default NHISService;
