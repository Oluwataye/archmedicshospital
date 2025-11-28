import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

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

  // Users
  static async getUsers(params?: any) {
    const response = await apiClient.get('/users', { params });
    return response.data;
  }

  static async getUser(id: string) {
    const response = await apiClient.get(`/users/${id}`);
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

  static async updatePrescription(id: string, prescriptionData: any) {
    const response = await apiClient.put(`/prescriptions/${id}`, prescriptionData);
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

  // Health Check
  static async healthCheck() {
    const response = await apiClient.get('/health');
    return response.data;
  }
}

export default ApiService;
