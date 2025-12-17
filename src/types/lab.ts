export interface LabResult {
    id: number | string;
    patient_id: number | string;
    test_type: string;
    test_name: string;
    test_category?: string;
    test_code?: string;
    status: string;
    priority?: 'routine' | 'urgent' | 'stat';
    order_date: string;
    result_date?: string;
    result_value?: string;
    result_unit?: string;
    interpretation?: string;
    is_critical?: boolean;
    abnormal_flag?: string;
    reference_range?: string;
    unit?: string;
    notes?: string;

    // Patient info (from joins)
    patient_first_name?: string;
    patient_last_name?: string;
    patient_mrn?: string;

    // Orderer info
    orderer_first_name?: string;
    orderer_last_name?: string;
}
