import axios from 'axios';
import type {
    HMOPreAuthorization,
    CreatePreAuthorizationDTO,
    PreAuthFilters
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

// Types for verification
export interface PatientSearchResult {
    id: string;
    mrn: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    gender: string;
    phone: string;
    hmo_provider_id: string | null;
    hmo_provider_name: string | null;
    hmo_package: string | null;
}

export interface AuthCodeValidationResult {
    valid: boolean;
    message: string;
    status: 'valid' | 'invalid' | 'used' | 'expired' | string;
    preauth?: any;
}

export interface VerificationSubmitData {
    authorization_code: string;
    patient_id: string;
    service_category?: 'primary' | 'secondary' | 'tertiary';
    notes?: string;
}

export interface VerificationLog {
    id: string;
    authorization_id: string | null;
    authorization_code: string;
    patient_id: string | null;
    patient_name: string | null;
    verified_by: string | null;
    verified_by_name: string | null;
    verification_status: 'verified' | 'rejected' | 'expired' | 'invalid';
    verification_date: string;
    service_category: string | null;
    notes: string | null;
    created_at: string;
}

export interface ActiveAuthorizationResult {
    has_active_authorization: boolean;
    authorization?: HMOPreAuthorization;
    message?: string;
}

export class PreAuthService {
    // ============================================
    // EXISTING METHODS
    // ============================================

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

    // ============================================
    // NEW VERIFICATION METHODS
    // ============================================

    /**
     * Search for patients by MRN, name, or phone for authorization verification
     * @param search - Search query (MRN, name, or phone)
     * @returns Array of matching patients with HMO information
     */
    static async searchPatientForAuth(search: string): Promise<PatientSearchResult[]> {
        const response = await apiClient.post('/preauth/verify/search-patient', { search });
        return response.data;
    }

    /**
     * Validate authorization code without marking it as used
     * @param authorization_code - The authorization code to validate
     * @param patient_id - Optional patient ID to verify code belongs to patient
     * @returns Validation result with status and details
     */
    static async validateAuthCode(
        authorization_code: string,
        patient_id?: string
    ): Promise<AuthCodeValidationResult> {
        const response = await apiClient.post('/preauth/verify/validate-code', {
            authorization_code,
            patient_id
        });
        return response.data;
    }

    /**
     * Verify and mark authorization code as used (one-time use)
     * @param data - Verification data including code, patient, category, and notes
     * @returns Success result with updated authorization
     */
    static async verifyAuthorizationCode(data: VerificationSubmitData): Promise<{
        success: boolean;
        message: string;
        authorization: HMOPreAuthorization;
    }> {
        const response = await apiClient.post('/preauth/verify/submit', data);
        return response.data;
    }

    /**
     * Get verification audit logs (Admin only)
     * @param filters - Optional filters for date range, staff, status, patient
     * @returns Array of verification log entries
     */
    static async getVerificationLogs(filters?: {
        from_date?: string;
        to_date?: string;
        verified_by?: string;
        status?: string;
        patient_id?: string;
    }): Promise<VerificationLog[]> {
        const response = await apiClient.get('/preauth/verify/logs', { params: filters });
        return response.data;
    }

    /**
     * Check if patient has an active (unused, approved, not expired) authorization
     * @param patient_id - Patient ID to check
     * @returns Active authorization status and details
     */
    static async checkActiveAuthorization(patient_id: string): Promise<ActiveAuthorizationResult> {
        const response = await apiClient.get(`/preauth/patient/${patient_id}/active`);
        return response.data;
    }
}

export default PreAuthService;
