import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = (import.meta.env.PROD || import.meta.env.MODE === 'production')
  ? '/api'
  : (import.meta.env.VITE_API_BASE_URL || '/api');

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { token } = response.data;
          localStorage.setItem('authToken', token);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API Service Class
export class ApiService {
  // Authentication
  static async login(email: string, password: string) {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  }

  static async register(userData: any) {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  }

  static async logout() {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  }

  static async getProfile() {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  }

  static async refreshToken(refreshToken: string) {
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    return response.data;
  }

  // Generic API methods
  static async get(url: string, config?: any) {
    const response = await apiClient.get(url, config);
    return response.data;
  }

  static async post(url: string, data?: any, config?: any) {
    const response = await apiClient.post(url, data, config);
    return response.data;
  }

  static async put(url: string, data?: any, config?: any) {
    const response = await apiClient.put(url, data, config);
    return response.data;
  }

  static async delete(url: string, config?: any) {
    const response = await apiClient.delete(url, config);
    return response.data;
  }

  // Users
  static async getUsers(params?: any) {
    const response = await apiClient.get('/users', { params });
    return response.data;
  }

  static async getUser(id: string) {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  }

  static async createUser(userData: any) {
    const response = await apiClient.post('/users', userData);
    return response.data;
  }

  static async updateUser(id: string, userData: any) {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  }

  static async changePassword(id: string, passwordData: any) {
    const response = await apiClient.put(`/users/${id}/password`, passwordData);
    return response.data;
  }

  static async deactivateUser(id: string) {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  }

  static async updateUserProfile(data: any) {
    const response = await apiClient.put('/users/profile', data);
    return response.data;
  }

  static async activateUser(id: string) {
    const response = await apiClient.put(`/users/${id}/activate`);
    return response.data;
  }

  static async resetUserPassword(id: string, newPassword: string) {
    const response = await apiClient.put(`/users/${id}/reset-password`, { newPassword });
    return response.data;
  }

  static async getDoctors(params?: any) {
    const response = await apiClient.get('/users/doctors/list', { params });
    return response.data;
  }

  static async getUserStats() {
    const response = await apiClient.get('/users/stats/overview');
    return response.data;
  }

  // Patients
  static async getPatients(params?: any) {
    const response = await apiClient.get('/patients', { params });
    return response.data;
  }

  static async getPatient(id: string) {
    const response = await apiClient.get(`/patients/${id}`);
    return response.data;
  }

  static async createPatient(patientData: any) {
    const response = await apiClient.post('/patients', patientData);
    return response.data;
  }

  static async updatePatient(id: string, patientData: any) {
    const response = await apiClient.put(`/patients/${id}`, patientData);
    return response.data;
  }

  static async deletePatient(id: string) {
    const response = await apiClient.delete(`/patients/${id}`);
    return response.data;
  }

  static async getPatientStats() {
    const response = await apiClient.get('/patients/stats/distribution');
    return response.data;
  }

  // Appointments
  static async getAppointments(params?: any) {
    const response = await apiClient.get('/appointments', { params });
    return response.data;
  }

  static async getAppointment(id: string) {
    const response = await apiClient.get(`/appointments/${id}`);
    return response.data;
  }

  static async createAppointment(appointmentData: any) {
    const response = await apiClient.post('/appointments', appointmentData);
    return response.data;
  }

  static async updateAppointment(id: string, appointmentData: any) {
    const response = await apiClient.put(`/appointments/${id}`, appointmentData);
    return response.data;
  }

  static async cancelAppointment(id: string) {
    const response = await apiClient.delete(`/appointments/${id}`);
    return response.data;
  }

  static async getAppointmentStats() {
    const response = await apiClient.get('/appointments/stats/weekly');
    return response.data;
  }

  static async getDoctorAvailability(doctorId: string, date: string) {
    const response = await apiClient.get(`/appointments/availability/${doctorId}`, {
      params: { date },
    });
    return response.data;
  }

  // Medical Records
  static async getMedicalRecords(params?: any) {
    const response = await apiClient.get('/medical-records', { params });
    return response.data;
  }

  static async getMedicalRecord(id: string) {
    const response = await apiClient.get(`/medical-records/${id}`);
    return response.data;
  }

  static async createMedicalRecord(recordData: any) {
    const response = await apiClient.post('/medical-records', recordData);
    return response.data;
  }

  static async updateMedicalRecord(id: string, recordData: any) {
    const response = await apiClient.put(`/medical-records/${id}`, recordData);
    return response.data;
  }

  static async deleteMedicalRecord(id: string) {
    const response = await apiClient.delete(`/medical-records/${id}`);
    return response.data;
  }

  static async getPatientMedicalHistory(patientId: string, params?: any) {
    const response = await apiClient.get(`/medical-records/patient/${patientId}/history`, {
      params,
    });
    return response.data;
  }

  static async getMedicalRecordStats(params?: any) {
    const response = await apiClient.get('/medical-records/stats/overview', { params });
    return response.data;
  }

  // Vital Signs
  static async getVitalSigns(params?: any) {
    const response = await apiClient.get('/vital-signs', { params });
    return response.data;
  }

  static async getVitalSign(id: string) {
    const response = await apiClient.get(`/vital-signs/${id}`);
    return response.data;
  }

  static async createVitalSigns(vitalData: any) {
    const response = await apiClient.post('/vital-signs', vitalData);
    return response.data;
  }

  static async updateVitalSigns(id: string, vitalData: any) {
    const response = await apiClient.put(`/vital-signs/${id}`, vitalData);
    return response.data;
  }

  static async deleteVitalSigns(id: string) {
    const response = await apiClient.delete(`/vital-signs/${id}`);
    return response.data;
  }

  static async getPatientVitalHistory(patientId: string, params?: any) {
    const response = await apiClient.get(`/vital-signs/patient/${patientId}/history`, {
      params,
    });
    return response.data;
  }

  static async getPatientVitalTrends(patientId: string, params?: any) {
    const response = await apiClient.get(`/vital-signs/patient/${patientId}/trends`, {
      params,
    });
    return response.data;
  }

  // Lab Results
  static async getLabResults(params?: any) {
    const response = await apiClient.get('/lab-results', { params });
    return response.data;
  }

  static async getLabResult(id: string) {
    const response = await apiClient.get(`/lab-results/${id}`);
    return response.data;
  }

  static async createLabOrder(labData: any) {
    const response = await apiClient.post('/lab-results', labData);
    return response.data;
  }

  static async updateLabResult(id: string, labData: any) {
    const response = await apiClient.put(`/lab-results/${id}`, labData);
    return response.data;
  }

  static async cancelLabOrder(id: string) {
    const response = await apiClient.delete(`/lab-results/${id}`);
    return response.data;
  }

  static async getPatientLabHistory(patientId: string, params?: any) {
    const response = await apiClient.get(`/lab-results/patient/${patientId}/history`, {
      params,
    });
    return response.data;
  }

  static async getPendingLabOrders(params?: any) {
    const response = await apiClient.get('/lab-results/pending/orders', { params });
    return response.data;
  }

  static async getLabStatistics() {
    const response = await apiClient.get('/lab-results/stats/overview');
    return response.data;
  }

  static async getCriticalLabResults() {
    const response = await apiClient.get('/lab-results/critical/results');
    return response.data;
  }

  static async getCompletedLabResults() {
    const response = await apiClient.get('/lab-results/completed/results');
    return response.data;
  }

  static async billLabOrder(id: string) {
    const response = await apiClient.post(`/lab-results/${id}/bill`);
    return response.data;
  }

  static async getLabTestDefinitions() {
    const response = await apiClient.get('/lab-results/definitions');
    return response.data;
  }

  static async createLabTestDefinition(data: any) {
    const response = await apiClient.post('/lab-results/definitions', data);
    return response.data;
  }

  // Prescriptions
  static async getPrescriptions(params?: any) {
    const response = await apiClient.get('/prescriptions', { params });
    return response.data;
  }

  static async getPrescription(id: string) {
    const response = await apiClient.get(`/prescriptions/${id}`);
    return response.data;
  }

  static async createPrescription(prescriptionData: any) {
    const response = await apiClient.post('/prescriptions', prescriptionData);
    return response.data;
  }

  static async updatePrescription(id: string, updates: any) {
    const response = await apiClient.put(`/prescriptions/${id}`, updates);
    return response.data;
  }



  static async dispensePrescription(id: string, dispenseData: any) {
    const response = await apiClient.post(`/prescriptions/${id}/dispense`, dispenseData);
    return response.data;
  }

  static async cancelPrescription(id: string) {
    const response = await apiClient.delete(`/prescriptions/${id}`);
    return response.data;
  }

  static async getPatientPrescriptionHistory(patientId: string, params?: any) {
    const response = await apiClient.get(`/prescriptions/patient/${patientId}/history`, {
      params,
    });
    return response.data;
  }

  static async getActivePrescriptions(params?: any) {
    const response = await apiClient.get('/prescriptions/active/pharmacy', { params });
    return response.data;
  }

  static async getPrescriptionStats(params?: any) {
    const response = await apiClient.get('/prescriptions/stats/overview', { params });
    return response.data;
  }

  // Settings
  // Billing & Payment
  static async getPendingBillableItems(patientId: string) {
    const response = await apiClient.get(`/billing/pending-items/${patientId}`);
    return response.data;
  }

  static async processPayment(data: any) {
    const response = await apiClient.post('/billing/process-payment', data);
    return response.data;
  }

  static async getFinancialStats(period: string = 'day') {
    const response = await apiClient.get('/financial/stats', { params: { period } });
    return response.data;
  }

  static async getSettings(category?: string) {
    const response = await apiClient.get('/settings', { params: { category } });
    return response.data;
  }

  static async getSetting(key: string) {
    const response = await apiClient.get(`/settings/${key}`);
    return response.data;
  }

  static async updateSetting(key: string, value: string) {
    const response = await apiClient.put(`/settings/${key}`, { value });
    return response.data;
  }

  static async bulkUpdateSettings(settings: Array<{ key: string; value: string }>) {
    const response = await apiClient.post('/settings/bulk-update', { settings });
    return response.data;
  }

  // Ward Management
  static async getWards() {
    const response = await apiClient.get('/wards');
    return response.data;
  }

  static async getWardDetails(id: string) {
    const response = await apiClient.get(`/wards/${id}`);
    return response.data;
  }



  static async getWard(id: string) {
    const response = await apiClient.get(`/wards/${id}`);
    return response.data;
  }

  static async createWard(wardData: any) {
    const response = await apiClient.post('/wards', wardData);
    return response.data;
  }

  static async addBeds(wardId: string, beds: any[]) {
    const response = await apiClient.post(`/wards/${wardId}/beds`, { beds });
    return response.data;
  }

  static async admitPatient(admissionData: any) {
    const response = await apiClient.post('/wards/admit', admissionData);
    return response.data;
  }

  static async dischargePatient(admissionId: string, dischargeData: any) {
    const response = await apiClient.put(`/wards/discharge/${admissionId}`, dischargeData);
    return response.data;
  }

  static async updateBedStatus(bedId: string, status: string) {
    const response = await apiClient.put(`/wards/beds/${bedId}/status`, { status });
    return response.data;
  }

  // Drug Interactions
  static async checkDrugInteractions(medications: string[], patientConditions?: string[], allergies?: string[]) {
    const response = await apiClient.post('/drug-interactions/check', {
      medications,
      patientConditions,
      allergies
    });
    return response.data;
  }

  static async checkPrescriptionInteractions(prescriptionId: string) {
    const response = await apiClient.post(`/drug-interactions/check-prescription/${prescriptionId}`);
    return response.data;
  }

  static async logInteractionCheck(checkData: any) {
    const response = await apiClient.post('/drug-interactions/log-check', checkData);
    return response.data;
  }

  static async getInteractionHistory(patientId: string, limit?: number) {
    const response = await apiClient.get(`/drug-interactions/history/${patientId}`, {
      params: { limit }
    });
    return response.data;
  }

  static async getRecentDrugInteractionAlerts(limit?: number) {
    const response = await apiClient.get('/drug-interactions/alerts/recent', {
      params: { limit }
    });
    return response.data;
  }

  static async getDrugInteractions(params?: any) {
    const response = await apiClient.get('/drug-interactions/interactions', { params });
    return response.data;
  }

  static async getDrugContraindications(params?: any) {
    const response = await apiClient.get('/drug-interactions/contraindications', { params });
    return response.data;
  }

  static async getAllergyInteractions(params?: any) {
    const response = await apiClient.get('/drug-interactions/allergy-interactions', { params });
    return response.data;
  }

  // Inventory
  static async getInventoryItems(params?: any) {
    const response = await apiClient.get('/inventory/items', { params });
    return response.data;
  }

  static async getInventoryItem(id: string) {
    const response = await apiClient.get(`/inventory/items/${id}`);
    return response.data;
  }

  static async createInventoryItem(itemData: any) {
    const response = await apiClient.post('/inventory/items', itemData);
    return response.data;
  }

  static async updateInventoryItem(id: string, itemData: any) {
    const response = await apiClient.put(`/inventory/items/${id}`, itemData);
    return response.data;
  }

  static async recordStockMovement(movementData: any) {
    const response = await apiClient.post('/inventory/movements', movementData);
    return response.data;
  }

  static async getStockMovements(params?: any) {
    const response = await apiClient.get('/inventory/movements', { params });
    return response.data;
  }

  static async getSuppliers() {
    const response = await apiClient.get('/inventory/suppliers');
    return response.data;
  }

  static async createSupplier(supplierData: any) {
    const response = await apiClient.post('/inventory/suppliers', supplierData);
    return response.data;
  }

  static async getInventoryAlerts() {
    const response = await apiClient.get('/inventory/alerts');
    return response.data;
  }

  // Audit Logs
  static async getAuditLogs(params?: any) {
    const response = await apiClient.get('/audit', { params });
    return response.data;
  }

  // Lab Inventory
  static async getLabInventory(params?: any) {
    const response = await apiClient.get('/lab-inventory', { params });
    return response.data;
  }

  static async getLabInventoryItem(id: string) {
    const response = await apiClient.get(`/lab-inventory/${id}`);
    return response.data;
  }

  static async createLabInventoryItem(data: any) {
    const response = await apiClient.post('/lab-inventory', data);
    return response.data;
  }

  static async updateLabInventoryItem(id: string, data: any) {
    const response = await apiClient.put(`/lab-inventory/${id}`, data);
    return response.data;
  }

  static async deleteLabInventoryItem(id: string) {
    const response = await apiClient.delete(`/lab-inventory/${id}`);
    return response.data;
  }

  static async getLabInventoryStats() {
    const response = await apiClient.get('/lab-inventory/stats/overview');
    return response.data;
  }

  static async getLabInventoryHistory(id: string) {
    const response = await apiClient.get(`/lab-inventory/${id}/history`);
    return response.data;
  }

  static async restockLabInventoryItem(id: string, quantity: number, reason?: string) {
    const response = await apiClient.post(`/lab-inventory/${id}/restock`, { quantity, reason });
    return response.data;
  }

  // ==================== Lab Equipment API ====================

  static async getLabEquipment(params?: any) {
    const response = await apiClient.get('/lab-equipment', { params });
    return response.data;
  }

  static async getLabEquipmentItem(id: string) {
    const response = await apiClient.get(`/lab-equipment/${id}`);
    return response.data;
  }

  static async createLabEquipment(data: any) {
    const response = await apiClient.post('/lab-equipment', data);
    return response.data;
  }

  static async updateLabEquipment(id: string, data: any) {
    const response = await apiClient.put(`/lab-equipment/${id}`, data);
    return response.data;
  }

  static async getEquipmentMaintenanceLogs(id: string) {
    const response = await apiClient.get(`/lab-equipment/${id}/maintenance`);
    return response.data;
  }

  static async createMaintenanceLog(equipmentId: string, data: any) {
    const response = await apiClient.post(`/lab-equipment/${equipmentId}/maintenance`, data);
    return response.data;
  }

  // ==================== Lab Quality Control API ====================

  static async getQCRecords(params?: any) {
    const response = await apiClient.get('/lab-quality', { params });
    return response.data;
  }

  static async createQCRecord(data: any) {
    const response = await apiClient.post('/lab-quality', data);
    return response.data;
  }

  static async verifyQCRecord(id: string, data?: any) {
    const response = await apiClient.put(`/lab-quality/${id}/verify`, data || {});
    return response.data;
  }

  // ==================== Service Metadata API ====================
  static async getServices(params?: any) {
    const response = await apiClient.get('/services', { params });
    return response.data;
  }

  static async getServiceCategories() {
    const response = await apiClient.get('/services/meta/categories');
    return response.data;
  }

  static async getServiceDepartments() {
    const response = await apiClient.get('/services/meta/departments');
    return response.data;
  }

  // ==================== Cashier/Payments API ====================

  // Payments
  static async getPayments(filters?: { patient_id?: number; status?: string; date_from?: string; date_to?: string; payment_method?: string }) {
    const response = await apiClient.get('/payments', { params: filters });
    return response.data;
  }

  static async getPayment(id: number) {
    const response = await apiClient.get(`/payments/${id}`);
    return response.data;
  }

  static async createPayment(paymentData: any) {
    const response = await apiClient.post('/payments', paymentData);
    return response.data;
  }

  static async updatePayment(id: number, updates: any) {
    const response = await apiClient.put(`/payments/${id}`, updates);
    return response.data;
  }

  static async getPaymentStatistics() {
    const response = await apiClient.get('/payments/stats/overview');
    return response.data;
  }

  static async getDailySummary(date?: string) {
    const response = await apiClient.get('/payments/stats/daily-summary', { params: { date } });
    return response.data;
  }

  // Invoices
  static async getInvoices(filters?: { patient_id?: number; status?: string; date_from?: string; date_to?: string }) {
    const response = await apiClient.get('/invoices', { params: filters });
    return response.data;
  }

  static async getInvoice(id: number) {
    const response = await apiClient.get(`/invoices/${id}`);
    return response.data;
  }

  static async createInvoice(invoiceData: any) {
    const response = await apiClient.post('/invoices', invoiceData);
    return response.data;
  }

  static async updateInvoice(id: number, updates: any) {
    const response = await apiClient.put(`/invoices/${id}`, updates);
    return response.data;
  }

  static async deleteInvoice(id: number) {
    const response = await apiClient.delete(`/invoices/${id}`);
    return response.data;
  }

  // Refunds
  static async getRefunds(filters?: { status?: string }) {
    const response = await apiClient.get('/refunds', { params: filters });
    return response.data;
  }

  static async getRefund(id: number) {
    const response = await apiClient.get(`/refunds/${id}`);
    return response.data;
  }

  static async createRefund(refundData: any) {
    const response = await apiClient.post('/refunds', refundData);
    return response.data;
  }

  static async approveRefund(id: number) {
    const response = await apiClient.put(`/refunds/${id}/approve`);
    return response.data;
  }

  static async rejectRefund(id: number) {
    const response = await apiClient.put(`/refunds/${id}/reject`);
    return response.data;
  }

  // Imaging
  static async getImagingOrders(params?: any) {
    const response = await apiClient.get('/imaging', { params });
    return response.data;
  }

  static async createImagingOrder(data: any) {
    const response = await apiClient.post('/imaging', data);
    return response.data;
  }

  // Allergies
  static async createAllergy(data: any) {
    const response = await apiClient.post('/medical-records/allergies', data);
    return response.data;
  }

  // Health Check
  static async healthCheck() {
    const response = await apiClient.get('/health');
    return response.data;
  }

  // Backup & Restore
  static async downloadFullBackup() {
    const response = await apiClient.get('/backup/full', { responseType: 'blob' });
    return response;
  }

  static async downloadCSVExport(type: string) {
    const response = await apiClient.get(`/backup/csv/${type}`, { responseType: 'blob' });
    return response;
  }

  static async getAutomaticBackups() {
    const response = await apiClient.get('/backup/list');
    return response.data;
  }

  static async downloadAutomaticBackup(filename: string) {
    const response = await apiClient.get(`/backup/download/${filename}`, { responseType: 'blob' });
    return response;
  }

  // Analytics
  static async getDiseasePrevalence(params?: { timeRange?: string; ageGroup?: string; gender?: string; search?: string }) {
    const response = await apiClient.get('/analytics/disease-prevalence', { params });
    return response.data;
  }

  static async getTreatmentOutcomes(params?: { treatmentType?: string; timeRange?: string; search?: string }) {
    const response = await apiClient.get('/analytics/treatment-outcomes', { params });
    return response.data;
  }

  // Departments
  static async getDepartments() {
    const response = await apiClient.get('/departments');
    return response.data;
  }

  static async createDepartment(data: any) {
    const response = await apiClient.post('/departments', data);
    return response.data;
  }

  static async updateDepartment(id: string, data: any) {
    const response = await apiClient.put(`/departments/${id}`, data);
    return response.data;
  }

  static async deleteDepartment(id: string) {
    const response = await apiClient.delete(`/departments/${id}`);
    return response.data;
  }

  // Wards (Units) - Additional methods
  static async updateWard(id: string, data: any) {
    const response = await apiClient.put(`/wards/${id}`, data);
    return response.data;
  }

  static async deleteWard(id: string) {
    const response = await apiClient.delete(`/wards/${id}`);
    return response.data;
  }

  // Services Import
  static async importServices(services: any[]) {
    const response = await apiClient.post('/services/bulk-import', { services });
    return response.data;
  }

  // ==================== CASHIER FEATURES ====================

  // Deposits & Wallet Management
  static async getPatientWallet(patientId: string) {
    const response = await apiClient.get(`/deposits/wallet/${patientId}`);
    return response.data;
  }

  static async createDeposit(data: {
    patient_id: string;
    amount: number;
    payment_method: string;
    description?: string;
  }) {
    const response = await apiClient.post('/deposits', data);
    return response.data;
  }

  static async getDeposits(params?: {
    patient_id?: string;
    start_date?: string;
    end_date?: string;
    limit?: number;
  }) {
    const response = await apiClient.get('/deposits', { params });
    return response.data;
  }

  static async deductFromWallet(data: {
    patient_id: string;
    amount: number;
    description?: string;
    reference_number?: string;
  }) {
    const response = await apiClient.post('/deposits/deduct', data);
    return response.data;
  }

  // Sales Reports
  static async getSalesSummary(params?: {
    start_date?: string;
    end_date?: string;
    cashier_id?: string;
  }) {
    const response = await apiClient.get('/sales/summary', { params });
    return response.data;
  }

  static async getSalesByDepartment(params?: {
    start_date?: string;
    end_date?: string;
  }) {
    const response = await apiClient.get('/sales/by-department', { params });
    return response.data;
  }

  static async getSalesByWard(params?: {
    start_date?: string;
    end_date?: string;
    department_id?: string;
  }) {
    const response = await apiClient.get('/sales/by-ward', { params });
    return response.data;
  }



  static async trackSale(data: {
    payment_id?: string;
    invoice_id?: string;
    department_id?: string;
    unit_id?: string;
    amount: number;
    payment_method: string;
  }) {
    const response = await apiClient.post('/sales/track', data);
    return response.data;

  }

  // --- Sample Tracking ---
  static async getSamples(params?: any) {
    const response = await apiClient.get('/samples', { params });
    return response.data;
  }

  static async getSampleByBarcode(barcode: string) {
    const response = await apiClient.get(`/samples/${barcode}`);
    return response.data;
  }

  static async createSample(data: any) {
    const response = await apiClient.post('/samples', data);
    return response.data;
  }

  static async updateSampleStatus(id: string, status: string, notes?: string) {
    const response = await apiClient.put(`/samples/${id}/status`, { status, notes });
    return response.data;
  }

  static async rejectSample(id: string, reason: string) {
    const response = await apiClient.post(`/samples/${id}/reject`, { reason });
    return response.data;
  }

  static async getFinancialReports(type: string, params?: any) {
    const response = await apiClient.get(`/reports/financial/${type}`, { params });
    return response.data;
  }

  // --- Hospital Settings ---
  static async getHospitalSettings() {
    const response = await apiClient.get('/hospital-settings');
    return response.data;
  }

  static async updateHospitalSettings(data: {
    hospital_name: string;
    address?: string;
    phone?: string;
    email?: string;
    logo_url?: string;
  }) {
    const response = await apiClient.put('/hospital-settings', data);
    return response.data;
  }

  static async uploadHospitalLogo(file: File) {
    const formData = new FormData();
    formData.append('logo', file);

    const response = await apiClient.post('/hospital-settings/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  static async deleteHospitalLogo() {
    const response = await apiClient.delete('/hospital-settings/logo');
    return response.data;
  }

  static async uploadFavicon(file: File) {
    const formData = new FormData();
    formData.append('favicon', file);

    const response = await apiClient.post('/hospital-settings/favicon', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Medical History (EMR)
  static async createMedicalHistory(data: any) {
    const response = await apiClient.post('/medical-records/history', data);
    return response.data;
  }

  // Revolving Funds
  static async getRevolvingFunds() {
    // Placeholder or real endpoint if backend exists
    const response = await apiClient.get('/financial/revolving-funds');
    return response.data;
  }

  static async getFundTransactions(fundId: string) {
    const response = await apiClient.get(`/financial/revolving-funds/${fundId}/transactions`);
    return response.data;
  }

  static async createFundTransaction(fundId: string, data: any) {
    const response = await apiClient.post(`/financial/revolving-funds/${fundId}/transactions`, data);
    return response.data;
  }

  // Reports
  static async getWardOccupancyReport() {
    const response = await apiClient.get('/reports/ward-occupancy');
    return response.data;
  }

  static async getMedicationComplianceReport() {
    const response = await apiClient.get('/reports/medication-compliance');
    return response.data;
  }

  static async getVitalsTrendsReport(params?: any) {
    const response = await apiClient.get('/reports/vitals-trends', { params });
    return response.data;
  }
}

export default ApiService;
