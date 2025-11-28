// HMO Provider Types
export interface HMOProvider {
    id: string;
    name: string;
    code: string;
    nhia_accreditation_number?: string;
    contact_email?: string;
    contact_phone?: string;
    address?: string;
    coverage_type?: 'individual' | 'family' | 'corporate';
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateHMOProviderDTO {
    name: string;
    code: string;
    nhia_accreditation_number?: string;
    contact_email?: string;
    contact_phone?: string;
    address?: string;
    coverage_type?: 'individual' | 'family' | 'corporate';
    is_active?: boolean;
}

// HMO Service Package Types
export interface HMOServicePackage {
    id: string;
    hmo_provider_id: string;
    package_name: string;
    package_code: string;
    annual_limit?: number;
    services_covered?: string[]; // Array of service codes
    exclusions?: string[]; // Array of excluded service codes
    copay_percentage?: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateHMOServicePackageDTO {
    hmo_provider_id: string;
    package_name: string;
    package_code: string;
    annual_limit?: number;
    services_covered?: string[];
    exclusions?: string[];
    copay_percentage?: number;
    is_active?: boolean;
}

// NHIS Service Code Types
export interface NHISServiceCode {
    id: string;
    code: string;
    description: string;
    category: ServiceCategory;
    base_tariff: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export type ServiceCategory =
    | 'Consultation'
    | 'Laboratory'
    | 'Radiology'
    | 'Procedure'
    | 'Inpatient'
    | 'Pharmacy'
    | 'Maternity'
    | 'Dental'
    | 'Optical'
    | 'Physiotherapy'
    | 'Emergency';

export interface CreateNHISServiceCodeDTO {
    code: string;
    description: string;
    category: ServiceCategory;
    base_tariff: number;
    is_active?: boolean;
}

// HMO Tariff Types
export interface HMOTariff {
    id: string;
    hmo_provider_id: string;
    service_code_id: string;
    tariff_amount: number;
    copay_amount?: number;
    copay_percentage?: number;
    effective_from: string;
    effective_to?: string;
    created_at: string;
    updated_at: string;
}

export interface CreateHMOTariffDTO {
    hmo_provider_id: string;
    service_code_id: string;
    tariff_amount: number;
    copay_amount?: number;
    copay_percentage?: number;
    effective_from: string;
    effective_to?: string;
}

// HMO Claims Types
export interface HMOClaim {
    id: string;
    claim_number: string;
    patient_id: string;
    hmo_provider_id: string;
    claim_date: string;
    service_date: string;
    total_amount: number;
    copay_amount: number;
    claim_amount: number;
    status: ClaimStatus;
    submission_date?: string;
    approval_date?: string;
    payment_date?: string;
    rejection_reason?: string;
    created_by?: string;
    created_at: string;
    updated_at: string;
}

export type ClaimStatus = 'pending' | 'submitted' | 'approved' | 'rejected' | 'paid';

export interface CreateHMOClaimDTO {
    patient_id: string;
    hmo_provider_id: string;
    claim_date: string;
    service_date: string;
    total_amount: number;
    copay_amount: number;
    claim_amount: number;
    items: CreateHMOClaimItemDTO[];
}

// HMO Claim Item Types
export interface HMOClaimItem {
    id: string;
    claim_id: string;
    service_code_id: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    diagnosis_code?: string;
    provider_id?: string;
    created_at: string;
}

export interface CreateHMOClaimItemDTO {
    service_code_id: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    diagnosis_code?: string;
    provider_id?: string;
}

// HMO Pre-authorization Types
export interface HMOPreAuthorization {
    id: string;
    authorization_code: string;
    patient_id: string;
    hmo_provider_id: string;
    requested_service_code_id?: string;
    diagnosis?: string;
    requested_by: string;
    request_date: string;
    approval_date?: string;
    expiry_date?: string;
    status: PreAuthStatus;
    approved_amount?: number;
    notes?: string;
    created_at: string;
    updated_at: string;
}

export type PreAuthStatus = 'pending' | 'approved' | 'rejected' | 'expired';

export interface CreatePreAuthorizationDTO {
    patient_id: string;
    hmo_provider_id: string;
    requested_service_code_id?: string;
    diagnosis?: string;
    requested_by: string;
    expiry_date?: string;
    notes?: string;
}

// Referral Types
export interface Referral {
    id: string;
    referral_code: string;
    patient_id: string;
    referring_provider_id: string;
    referring_facility?: string;
    referred_to_facility?: string;
    referred_to_specialist?: string;
    specialty_required?: string;
    reason_for_referral: string;
    diagnosis?: string;
    urgency: ReferralUrgency;
    hmo_provider_id?: string;
    preauth_required: boolean;
    preauth_id?: string;
    status: ReferralStatus;
    referral_date: string;
    appointment_date?: string;
    feedback?: string;
    created_at: string;
    updated_at: string;
}

export type ReferralUrgency = 'routine' | 'urgent' | 'emergency';
export type ReferralStatus = 'pending' | 'accepted' | 'completed' | 'cancelled';

export interface CreateReferralDTO {
    patient_id: string;
    referring_provider_id: string;
    referring_facility?: string;
    referred_to_facility?: string;
    referred_to_specialist?: string;
    specialty_required?: string;
    reason_for_referral: string;
    diagnosis?: string;
    urgency?: ReferralUrgency;
    hmo_provider_id?: string;
    preauth_required?: boolean;
    preauth_id?: string;
    referral_date: string;
    appointment_date?: string;
}

// Extended Patient Type with HMO fields
export interface PatientWithHMO {
    id: string;
    mrn: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    gender: string;
    phone?: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    emergency_contact?: string;
    insurance?: string;
    medical_history?: string;
    allergies?: string;
    current_medications?: string;
    status: string;
    assigned_doctor?: string;
    // HMO-specific fields
    nhis_enrollment_number?: string;
    hmo_provider_id?: string;
    hmo_package_id?: string;
    policy_start_date?: string;
    policy_end_date?: string;
    principal_member_id?: string;
    relationship_to_principal?: string;
    created_at: string;
    updated_at: string;
}

// Eligibility Check Types
export interface EligibilityCheckResult {
    is_eligible: boolean;
    patient_id: string;
    hmo_provider?: HMOProvider;
    package?: HMOServicePackage;
    policy_status: 'active' | 'expired' | 'not_enrolled';
    coverage_remaining?: number;
    message: string;
}

// Claims Statistics Types
export interface ClaimsStatistics {
    total_claims: number;
    pending_claims: number;
    submitted_claims: number;
    approved_claims: number;
    rejected_claims: number;
    paid_claims: number;
    total_claim_amount: number;
    total_approved_amount: number;
    total_paid_amount: number;
    average_processing_time_days: number;
}

// Service Code Search Filters
export interface ServiceCodeFilters {
    category?: ServiceCategory;
    search?: string;
    is_active?: boolean;
    min_tariff?: number;
    max_tariff?: number;
}

// Claims Filters
export interface ClaimsFilters {
    patient_id?: string;
    hmo_provider_id?: string;
    status?: ClaimStatus;
    from_date?: string;
    to_date?: string;
    created_by?: string;
}

// Pre-authorization Filters
export interface PreAuthFilters {
    patient_id?: string;
    hmo_provider_id?: string;
    status?: PreAuthStatus;
    from_date?: string;
    to_date?: string;
    requested_by?: string;
}

// Referral Filters
export interface ReferralFilters {
    patient_id?: string;
    referring_provider_id?: string;
    status?: ReferralStatus;
    urgency?: ReferralUrgency;
    from_date?: string;
    to_date?: string;
}
