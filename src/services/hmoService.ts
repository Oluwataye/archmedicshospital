import type {
    HMOProvider,
    CreateHMOProviderDTO,
    HMOServicePackage,
    CreateHMOServicePackageDTO,
    HMOTariff,
    CreateHMOTariffDTO,
    EligibilityCheckResult,
} from '@/types/hmo';
import { apiClient } from './apiService';

export class HMOService {
    // HMO Provider Management
    static async getHMOProviders(activeOnly: boolean = true): Promise<HMOProvider[]> {
        const params: any = {};
        if (activeOnly) {
            params.active = true;
        }
        const response = await apiClient.get('/hmo/providers', {
            params,
        });
        return response.data;
    }

    static async getHMOProvider(id: string): Promise<HMOProvider> {
        const response = await apiClient.get(`/hmo/providers/${id}`);
        return response.data;
    }

    static async createHMOProvider(data: CreateHMOProviderDTO): Promise<HMOProvider> {
        const response = await apiClient.post('/hmo/providers', data);
        return response.data;
    }

    static async updateHMOProvider(id: string, data: Partial<CreateHMOProviderDTO>): Promise<HMOProvider> {
        const response = await apiClient.put(`/hmo/providers/${id}`, data);
        return response.data;
    }

    static async deleteHMOProvider(id: string): Promise<void> {
        await apiClient.delete(`/hmo/providers/${id}`);
    }

    // HMO Service Packages
    static async getHMOPackages(hmoProviderId: string): Promise<HMOServicePackage[]> {
        const response = await apiClient.get(`/hmo/providers/${hmoProviderId}/packages`);
        return response.data;
    }

    static async getHMOPackage(packageId: string): Promise<HMOServicePackage> {
        const response = await apiClient.get(`/hmo/packages/${packageId}`);
        return response.data;
    }

    static async createHMOPackage(data: CreateHMOServicePackageDTO): Promise<HMOServicePackage> {
        const response = await apiClient.post('/hmo/packages', data);
        return response.data;
    }

    static async updateHMOPackage(id: string, data: Partial<CreateHMOServicePackageDTO>): Promise<HMOServicePackage> {
        const response = await apiClient.put(`/hmo/packages/${id}`, data);
        return response.data;
    }

    static async deleteHMOPackage(id: string): Promise<void> {
        await apiClient.delete(`/hmo/packages/${id}`);
    }

    // HMO Tariffs
    static async getHMOTariffs(hmoProviderId: string): Promise<HMOTariff[]> {
        const response = await apiClient.get(`/hmo/providers/${hmoProviderId}/tariffs`);
        return response.data;
    }

    static async createHMOTariff(data: CreateHMOTariffDTO): Promise<HMOTariff> {
        const response = await apiClient.post('/hmo/tariffs', data);
        return response.data;
    }

    static async updateHMOTariff(id: string, data: Partial<CreateHMOTariffDTO>): Promise<HMOTariff> {
        const response = await apiClient.put(`/hmo/tariffs/${id}`, data);
        return response.data;
    }

    static async deleteHMOTariff(id: string): Promise<void> {
        await apiClient.delete(`/hmo/tariffs/${id}`);
    }

    // Eligibility Verification
    static async verifyEligibility(patientId: string): Promise<EligibilityCheckResult> {
        const response = await apiClient.get(`/hmo/eligibility/${patientId}`);
        return response.data;
    }

    static async getMonthlyBillingReport(month: string, year: string, hmoProviderId: string): Promise<any[]> {
        const response = await apiClient.get('/hmo/reports/monthly-billing', {
            params: {
                month,
                year,
                hmo_provider_id: hmoProviderId === 'all' ? undefined : hmoProviderId
            }
        });
        return response.data;
    }

    static async checkServiceCoverage(
        patientId: string,
        serviceCodeId: string
    ): Promise<{ covered: boolean; copay_amount?: number; copay_percentage?: number }> {
        const response = await apiClient.post('/hmo/check-coverage', {
            patient_id: patientId,
            service_code_id: serviceCodeId,
        });
        return response.data;
    }
}

export default HMOService;
