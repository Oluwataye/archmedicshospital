import axios from 'axios';
import type {
    Referral,
    CreateReferralDTO,
    ReferralFilters,
    ReferralStatus,
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

export class ReferralService {
    // Referral Management
    static async getReferrals(filters?: ReferralFilters): Promise<Referral[]> {
        const response = await apiClient.get('/referrals', {
            params: filters,
        });
        return response.data;
    }

    static async getReferral(id: string): Promise<Referral> {
        const response = await apiClient.get(`/referrals/${id}`);
        return response.data;
    }

    static async getReferralByCode(referralCode: string): Promise<Referral> {
        const response = await apiClient.get(`/referrals/code/${referralCode}`);
        return response.data;
    }

    static async createReferral(data: CreateReferralDTO): Promise<Referral> {
        const response = await apiClient.post('/referrals', data);
        return response.data;
    }

    static async updateReferral(id: string, data: Partial<CreateReferralDTO>): Promise<Referral> {
        const response = await apiClient.put(`/referrals/${id}`, data);
        return response.data;
    }

    // Referral Status Updates
    static async acceptReferral(id: string, appointmentDate?: string): Promise<Referral> {
        const response = await apiClient.put(`/referrals/${id}/accept`, {
            appointment_date: appointmentDate,
        });
        return response.data;
    }

    static async completeReferral(id: string, feedback?: string): Promise<Referral> {
        const response = await apiClient.put(`/referrals/${id}/complete`, {
            feedback,
        });
        return response.data;
    }

    static async cancelReferral(id: string, reason?: string): Promise<Referral> {
        const response = await apiClient.put(`/referrals/${id}/cancel`, {
            feedback: reason,
        });
        return response.data;
    }

    // Patient Referrals
    static async getPatientReferrals(patientId: string): Promise<Referral[]> {
        const response = await apiClient.get(`/referrals/patient/${patientId}`);
        return response.data;
    }

    // Provider Referrals
    static async getProviderReferrals(providerId: string): Promise<Referral[]> {
        const response = await apiClient.get(`/referrals/provider/${providerId}`);
        return response.data;
    }

    // Generate Referral Letter
    static async generateReferralLetter(id: string): Promise<Blob> {
        const response = await apiClient.get(`/referrals/${id}/letter`, {
            responseType: 'blob',
        });
        return response.data;
    }

    // Verify Referral Code
    static async verifyReferralCode(referralCode: string): Promise<{
        valid: boolean;
        referral?: Referral;
        message: string;
    }> {
        const response = await apiClient.get(`/referrals/verify/${referralCode}`);
        return response.data;
    }
}

export default ReferralService;
