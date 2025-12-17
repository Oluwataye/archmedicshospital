/**
 * Payment Types
 */

export type PaymentMethod = 'Cash' | 'Credit Card' | 'Insurance' | 'Bank Transfer' | 'Debit Card' | 'Mobile Money';
export type PaymentStatus = 'completed' | 'pending' | 'failed' | 'refunded' | 'cancelled';

export interface Payment {
    id: number;
    patient_id: number;
    patient_first_name: string;
    patient_last_name: string;
    patient_mrn: string;
    amount: number;
    payment_method: PaymentMethod;
    payment_date: string;
    status: PaymentStatus;
    reference_number: string;
    invoice_number?: string;
    invoice_id?: number;
    notes?: string;
    created_at: string;
    updated_at: string;
    created_by?: number;
}

export interface PaymentFilters {
    patient_id?: number;
    status?: PaymentStatus | 'all';
    payment_method?: PaymentMethod | 'all';
    date_from?: string;
    date_to?: string;
    search?: string;
    page?: number;
    limit?: number;
}

export interface CreatePaymentData {
    patient_id: number;
    amount: number;
    payment_method: PaymentMethod;
    reference_number: string;
    invoice_id?: number;
    notes?: string;
}

export interface PaymentStatistics {
    total_payments: number;
    total_amount: number;
    completed_amount: number;
    pending_amount: number;
    refunded_amount: number;
    by_method: Record<PaymentMethod, number>;
}
