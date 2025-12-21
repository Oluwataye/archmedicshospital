import type {
    NHISServiceCode,
    CreateNHISServiceCodeDTO,
    ServiceCodeFilters,
    HMOTariff,
} from '@/types/hmo';
import { apiClient } from './apiService';

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
