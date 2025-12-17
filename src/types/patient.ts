export interface Patient {
    id: number | string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    gender: string;
    phone: string;
    email: string;
    address: string;
    mrn: string;
    status: string;
    created_at?: string;
    updated_at?: string;
    insurance?: string;
    hmo_provider_id?: string;
    hmo_package_id?: string;

    // Computed/UI fields (optional or mapped)
    name?: string;
    age?: number;
    contact?: string;
    dob?: string; // Alias for date_of_birth for backward compatibility
    lastVisit?: string;
}
