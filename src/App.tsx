import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { useAuth } from '@/contexts/AuthContext';
import { HospitalSettingsProvider } from '@/contexts/HospitalSettingsContext';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import AppLayout from '@/components/layout/AppLayout';
import LoginPage from '@/pages/LoginPage';
import ProfilePage from '@/pages/ProfilePage';
import SettingsPage from '@/pages/SettingsPage';
import DashboardPage from '@/pages/DashboardPage';
import Index from '@/pages/Index';

// Admin Pages
import HMOManagementPage from '@/pages/admin/HMOManagementPage';
import AdminSettingsPage from '@/pages/admin/SettingsPage';
import UserManagementPage from '@/pages/admin/UserManagementPage';
import ServicesManagementPage from '@/pages/admin/ServicesManagementPage';
import FinancialDashboardPage from '@/pages/admin/FinancialDashboardPage';
import CashierActivityPage from '@/pages/admin/CashierActivityPage';
import AdminTransactionsPage from '@/pages/admin/AdminTransactionsPage';
import AdminCashierPage from '@/pages/admin/AdminCashierPage';
import AdminRefundsPage from '@/pages/admin/AdminRefundsPage';
import ReportsPage from '@/pages/admin/ReportsPage';
import AuditLogsPage from '@/pages/admin/AuditLogsPage';
import AuthorizationLogsPage from '@/pages/admin/AuthorizationLogsPage';
import DepartmentsPage from '@/pages/admin/DepartmentsPage';
import UnitsPage from '@/pages/admin/UnitsPage';
import AllStaffPage from '@/pages/admin/AllStaffPage';
import RolesPermissionsPage from '@/pages/admin/RolesPermissionsPage';
import StaffSchedulePage from '@/pages/admin/StaffSchedulePage';

// Cashier Pages
import CashierDashboard from '@/pages/cashier/CashierDashboard';
import ClaimsManagementPage from '@/pages/cashier/ClaimsManagementPage';
import PreAuthorizationPage from '@/pages/cashier/PreAuthorizationPage';
import BillingPage from '@/pages/cashier/BillingPage';
import PaymentsPage from '@/pages/cashier/PaymentsPage';
import RefundsPage from '@/pages/cashier/RefundsPage';
import CashierReportsPage from '@/pages/cashier/ReportsPage';
import ReprintPage from '@/pages/cashier/ReprintPage';
import SalesSummaryPage from '@/pages/cashier/SalesSummaryPage';
import SalesByDepartmentPage from '@/pages/cashier/SalesByDepartmentPage';
import SalesByWardPage from '@/pages/cashier/SalesByWardPage';
import DepositsPage from '@/pages/cashier/DepositsPage';
// EHR Pages
import PatientRecords from '@/pages/ehr/PatientRecordsPage';
import PatientManagement from '@/pages/ehr/PatientManagementPage';
import Appointments from '@/pages/ehr/AppointmentsPage';
import ProgressNotes from '@/pages/ehr/ProgressNotesPage';
import SOAPNotes from '@/pages/ehr/SOAPNotesPage';
import DischargeNotes from '@/pages/ehr/DischargeNotesPage';
import LabResults from '@/pages/ehr/LabResultsPage';
import Imaging from '@/pages/ehr/ImagingPage';
import Medications from '@/pages/ehr/MedicationsPage';
import PatientStatistics from '@/pages/ehr/PatientStatisticsPage';
import DiseasePrevalence from '@/pages/ehr/DiseasePrevalencePage';
import TreatmentOutcomes from '@/pages/ehr/TreatmentOutcomesPage';
import AuthorizationVerificationPage from '@/pages/ehr/AuthorizationVerificationPage';

import HMOReportsPage from '@/pages/ehr/HMOReportsPage';
import RenderServices from '@/pages/ehr/RenderServicesPage';

// Lab Pages
import LabDashboard from '@/pages/lab/LabDashboard';
import LabWorklistPage from '@/pages/lab/LabWorklistPage';
import LabInventoryPage from '@/pages/lab/LabInventoryPage';
import LabReportsPage from '@/pages/lab/LabReportsPage';
import QualityControlPage from '@/pages/lab/QualityControlPage';
import EquipmentPage from '@/pages/lab/EquipmentPage';
import SampleTrackingPage from '@/pages/lab/SampleTrackingPage';
import WardOccupancyReport from '@/pages/reports/WardOccupancyReport';
import MedicationReport from '@/pages/reports/MedicationReport';
import VitalsTrendsReport from '@/pages/reports/VitalsTrendsReport';

// Doctor Pages
import DoctorDashboardPage from '@/pages/doctor/DoctorDashboardPage';
import DoctorAppointmentsPage from '@/pages/doctor/AppointmentsPage';
import DoctorPatientsPage from '@/pages/doctor/PatientsPage';
import DoctorPrescriptionsPage from '@/pages/doctor/PrescriptionsPage';
import DoctorLabOrdersPage from '@/pages/doctor/LabOrdersPage';
import DoctorMedicalRecordsPage from '@/pages/doctor/MedicalRecordsPage';
import PatientEMRPage from '@/pages/doctor/PatientEMRPage';

// Nurse Pages
import NurseDashboard from '@/pages/nurse/NurseDashboard';
import NursePatientsPage from '@/pages/nurse/PatientsPage';
import NurseVitalsPage from '@/pages/nurse/VitalsPage';
import NurseMedicationPage from '@/pages/nurse/MedicationPage';
import NurseWardManagementPage from '@/pages/nurse/WardManagementPage';

// Pharmacy Pages
import PharmacistDashboard from '@/pages/pharmacy/PharmacistDashboard';
import PharmacyDispensaryPage from '@/pages/pharmacy/DispensaryPage';
import PharmacyInventoryPage from '@/pages/pharmacy/InventoryPage';
import PharmacyPrescriptionsPage from '@/pages/pharmacy/PrescriptionsPage';
import PharmacyAlertsPage from '@/pages/pharmacy/AlertsPage';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirects if already authenticated)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading..." />;
  }

  if (user) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      } />

      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }>
        {/* Admin Routes */}
        <Route path="admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="admin/hmo" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <HMOManagementPage />
          </ProtectedRoute>
        } />

        <Route path="admin/settings" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminSettingsPage />
          </ProtectedRoute>
        } />
        <Route path="admin/users" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <UserManagementPage />
          </ProtectedRoute>
        } />
        {/* Staff Management Routes */}
        <Route path="staff" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AllStaffPage />
          </ProtectedRoute>
        } />
        <Route path="staff/roles" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <RolesPermissionsPage />
          </ProtectedRoute>
        } />
        <Route path="staff/schedule" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <StaffSchedulePage />
          </ProtectedRoute>
        } />
        <Route path="admin/services" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ServicesManagementPage />
          </ProtectedRoute>
        } />
        <Route path="admin/departments" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DepartmentsPage />
          </ProtectedRoute>
        } />
        <Route path="admin/units" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <UnitsPage />
          </ProtectedRoute>
        } />
        <Route path="admin/financial" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <FinancialDashboardPage />
          </ProtectedRoute>
        } />
        <Route path="admin/cashier-activity" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <CashierActivityPage />
          </ProtectedRoute>
        } />
        <Route path="admin/transactions" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminTransactionsPage />
          </ProtectedRoute>
        } />
        <Route path="admin/cashier" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminCashierPage />
          </ProtectedRoute>
        } />
        <Route path="admin/refunds" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminRefundsPage />
          </ProtectedRoute>
        } />
        <Route path="admin/reports" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ReportsPage />
          </ProtectedRoute>
        } />
        <Route path="admin/reports/ward-occupancy" element={
          <ProtectedRoute allowedRoles={['admin', 'nurse']}>
            <WardOccupancyReport />
          </ProtectedRoute>
        } />
        <Route path="admin/reports/medication-compliance" element={
          <ProtectedRoute allowedRoles={['admin', 'nurse']}>
            <MedicationReport />
          </ProtectedRoute>
        } />
        <Route path="admin/reports/vitals-trends" element={
          <ProtectedRoute allowedRoles={['admin', 'nurse', 'doctor']}>
            <VitalsTrendsReport />
          </ProtectedRoute>
        } />
        <Route path="admin/logs" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AuditLogsPage />
          </ProtectedRoute>
        } />
        <Route path="admin/authorization-logs" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AuthorizationLogsPage />
          </ProtectedRoute>
        } />
        <Route path="admin/authorization-verification" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AuthorizationVerificationPage />
          </ProtectedRoute>
        } />
        <Route path="admin/patients" element={
          <ProtectedRoute allowedRoles={['admin', 'ehr']}>
            <PatientManagement />
          </ProtectedRoute>
        } />

        {/* Doctor Routes */}
        <Route path="doctor" element={
          <ProtectedRoute allowedRoles={['doctor', 'admin']}>
            <DoctorDashboardPage />
          </ProtectedRoute>
        } />
        <Route path="doctor/appointments" element={
          <ProtectedRoute allowedRoles={['doctor', 'admin']}>
            <DoctorAppointmentsPage />
          </ProtectedRoute>
        } />
        <Route path="doctor/patients" element={
          <ProtectedRoute allowedRoles={['doctor', 'admin']}>
            <DoctorPatientsPage />
          </ProtectedRoute>
        } />
        <Route path="doctor/prescriptions" element={
          <ProtectedRoute allowedRoles={['doctor', 'admin']}>
            <DoctorPrescriptionsPage />
          </ProtectedRoute>
        } />
        <Route path="doctor/lab-orders" element={
          <ProtectedRoute allowedRoles={['doctor', 'admin']}>
            <DoctorLabOrdersPage />
          </ProtectedRoute>
        } />
        <Route path="doctor/medical-records" element={
          <ProtectedRoute allowedRoles={['doctor', 'admin']}>
            <DoctorMedicalRecordsPage />
          </ProtectedRoute>
        } />
        <Route path="doctor/patient-emr/:patientId" element={
          <ProtectedRoute allowedRoles={['doctor', 'admin', 'nurse', 'ehr']}>
            <PatientEMRPage />
          </ProtectedRoute>
        } />

        {/* Nurse Routes */}
        <Route path="nurse" element={
          <ProtectedRoute allowedRoles={['nurse', 'admin']}>
            <NurseDashboard />
          </ProtectedRoute>
        } />
        <Route path="nurse/patients" element={
          <ProtectedRoute allowedRoles={['nurse', 'admin']}>
            <NursePatientsPage />
          </ProtectedRoute>
        } />
        <Route path="nurse/vitals" element={
          <ProtectedRoute allowedRoles={['nurse', 'admin']}>
            <NurseVitalsPage />
          </ProtectedRoute>
        } />
        <Route path="nurse/medications" element={
          <ProtectedRoute allowedRoles={['nurse', 'admin']}>
            <NurseMedicationPage />
          </ProtectedRoute>
        } />
        <Route path="nurse/wards" element={
          <ProtectedRoute allowedRoles={['nurse', 'admin']}>
            <NurseWardManagementPage />
          </ProtectedRoute>
        } />

        {/* Pharmacist Routes */}
        <Route path="pharmacist" element={
          <ProtectedRoute allowedRoles={['pharmacist', 'admin']}>
            <PharmacistDashboard />
          </ProtectedRoute>
        } />
        <Route path="pharmacy" element={
          <ProtectedRoute allowedRoles={['pharmacist', 'admin']}>
            <PharmacistDashboard />
          </ProtectedRoute>
        } />
        <Route path="pharmacy/dispensary" element={
          <ProtectedRoute allowedRoles={['pharmacist', 'admin']}>
            <PharmacyDispensaryPage />
          </ProtectedRoute>
        } />
        <Route path="pharmacy/inventory" element={
          <ProtectedRoute allowedRoles={['pharmacist', 'admin']}>
            <PharmacyInventoryPage />
          </ProtectedRoute>
        } />
        <Route path="pharmacy/prescriptions" element={
          <ProtectedRoute allowedRoles={['pharmacist', 'admin']}>
            <PharmacyPrescriptionsPage />
          </ProtectedRoute>
        } />
        <Route path="pharmacy/alerts" element={
          <ProtectedRoute allowedRoles={['pharmacist', 'admin']}>
            <PharmacyAlertsPage />
          </ProtectedRoute>
        } />

        {/* Lab Tech Routes */}
        <Route path="labtech" element={
          <ProtectedRoute allowedRoles={['labtech']}>
            <LabDashboard />
          </ProtectedRoute>
        } />
        <Route path="lab" element={
          <ProtectedRoute allowedRoles={['labtech', 'admin']}>
            <LabDashboard />
          </ProtectedRoute>
        } />
        <Route path="lab/dashboard" element={
          <ProtectedRoute allowedRoles={['labtech', 'admin']}>
            <LabDashboard />
          </ProtectedRoute>
        } />
        <Route path="lab/worklist" element={
          <ProtectedRoute allowedRoles={['labtech', 'admin']}>
            <LabWorklistPage />
          </ProtectedRoute>
        } />
        <Route path="lab/samples" element={
          <ProtectedRoute allowedRoles={['labtech', 'admin']}>
            <SampleTrackingPage />
          </ProtectedRoute>
        } />
        <Route path="lab/inventory" element={
          <ProtectedRoute allowedRoles={['labtech', 'admin']}>
            <LabInventoryPage />
          </ProtectedRoute>
        } />
        <Route path="lab/reports" element={
          <ProtectedRoute allowedRoles={['labtech', 'admin']}>
            <LabResults />
          </ProtectedRoute>
        } />

        {/* Cashier Routes */}
        {/* Cashier Routes */}
        <Route path="cashier" element={
          <ProtectedRoute allowedRoles={['cashier', 'admin']}>
            <CashierDashboard />
          </ProtectedRoute>
        } />
        <Route path="cashier/billing" element={
          <ProtectedRoute allowedRoles={['cashier', 'admin']}>
            <BillingPage />
          </ProtectedRoute>
        } />
        <Route path="cashier/payments" element={
          <ProtectedRoute allowedRoles={['cashier', 'admin']}>
            <PaymentsPage />
          </ProtectedRoute>
        } />
        <Route path="cashier/refunds" element={
          <ProtectedRoute allowedRoles={['cashier', 'admin']}>
            <RefundsPage />
          </ProtectedRoute>
        } />
        <Route path="cashier/reports" element={
          <ProtectedRoute allowedRoles={['cashier', 'admin']}>
            <CashierReportsPage />
          </ProtectedRoute>
        } />
        <Route path="cashier/reprint" element={
          <ProtectedRoute allowedRoles={['cashier', 'admin']}>
            <ReprintPage />
          </ProtectedRoute>
        } />
        <Route path="cashier/sales/summary" element={
          <ProtectedRoute allowedRoles={['cashier', 'admin']}>
            <SalesSummaryPage />
          </ProtectedRoute>
        } />
        <Route path="cashier/sales/by-department" element={
          <ProtectedRoute allowedRoles={['cashier', 'admin']}>
            <SalesByDepartmentPage />
          </ProtectedRoute>
        } />
        <Route path="cashier/sales/by-ward" element={
          <ProtectedRoute allowedRoles={['cashier', 'admin']}>
            <SalesByWardPage />
          </ProtectedRoute>
        } />

        <Route path="cashier/deposits" element={
          <ProtectedRoute allowedRoles={['cashier', 'admin']}>
            <DepositsPage />
          </ProtectedRoute>
        } />
        <Route path="cashier/claims" element={
          <ProtectedRoute allowedRoles={['cashier', 'admin']}>
            <ClaimsManagementPage />
          </ProtectedRoute>
        } />
        <Route path="cashier/preauth" element={
          <ProtectedRoute allowedRoles={['cashier', 'admin']}>
            <PreAuthorizationPage />
          </ProtectedRoute>
        } />

        {/* EHR Routes */}
        <Route path="ehr" element={
          <ProtectedRoute allowedRoles={['ehr']}>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="ehr/patient-records" element={
          <ProtectedRoute allowedRoles={['ehr', 'nurse', 'doctor', 'admin']}>
            <PatientRecords />
          </ProtectedRoute>
        } />
        <Route path="ehr/patient-management" element={
          <ProtectedRoute allowedRoles={['ehr', 'nurse', 'doctor', 'admin']}>
            <PatientManagement />
          </ProtectedRoute>
        } />
        <Route path="ehr/appointments" element={
          <ProtectedRoute allowedRoles={['ehr', 'nurse', 'doctor', 'admin']}>
            <Appointments />
          </ProtectedRoute>
        } />
        <Route path="ehr/render-services" element={
          <ProtectedRoute allowedRoles={['ehr', 'nurse', 'doctor', 'admin']}>
            <RenderServices />
          </ProtectedRoute>
        } />
        <Route path="ehr/progress-notes" element={
          <ProtectedRoute allowedRoles={['ehr', 'nurse', 'doctor', 'admin']}>
            <ProgressNotes />
          </ProtectedRoute>
        } />
        <Route path="ehr/soap-notes" element={
          <ProtectedRoute allowedRoles={['ehr', 'nurse', 'doctor', 'admin']}>
            <SOAPNotes />
          </ProtectedRoute>
        } />
        <Route path="ehr/discharge-notes" element={
          <ProtectedRoute allowedRoles={['ehr', 'nurse', 'doctor', 'admin']}>
            <DischargeNotes />
          </ProtectedRoute>
        } />
        <Route path="ehr/lab-results" element={
          <ProtectedRoute allowedRoles={['ehr', 'nurse', 'doctor', 'admin', 'labtech']}>
            <LabResults />
          </ProtectedRoute>
        } />
        <Route path="lab/quality" element={
          <ProtectedRoute allowedRoles={['labtech', 'admin']}>
            <QualityControlPage />
          </ProtectedRoute>
        } />
        <Route path="lab/equipment" element={
          <ProtectedRoute allowedRoles={['labtech', 'admin']}>
            <EquipmentPage />
          </ProtectedRoute>
        } />
        <Route path="lab/reports" element={
          <ProtectedRoute allowedRoles={['labtech', 'admin']}>
            <LabReportsPage />
          </ProtectedRoute>
        } />
        <Route path="ehr/imaging" element={
          <ProtectedRoute allowedRoles={['ehr', 'nurse', 'doctor', 'admin']}>
            <Imaging />
          </ProtectedRoute>
        } />
        <Route path="ehr/medications" element={
          <ProtectedRoute allowedRoles={['ehr', 'nurse', 'doctor', 'admin']}>
            <Medications />
          </ProtectedRoute>
        } />
        <Route path="ehr/analytics/statistics" element={
          <ProtectedRoute allowedRoles={['ehr', 'admin']}>
            <PatientStatistics />
          </ProtectedRoute>
        } />
        <Route path="ehr/analytics/disease-prevalence" element={
          <ProtectedRoute allowedRoles={['ehr', 'admin']}>
            <DiseasePrevalence />
          </ProtectedRoute>
        } />
        <Route path="ehr/analytics/treatment-outcomes" element={
          <ProtectedRoute allowedRoles={['ehr', 'admin']}>
            <TreatmentOutcomes />
          </ProtectedRoute>
        } />
        <Route path="ehr/authorization-verification" element={
          <ProtectedRoute allowedRoles={['ehr', 'admin']}>
            <AuthorizationVerificationPage />
          </ProtectedRoute>
        } />
        <Route path="ehr/hmo/reports" element={
          <ProtectedRoute allowedRoles={['ehr', 'admin']}>
            <HMOReportsPage />
          </ProtectedRoute>
        } />

        {/* Common Routes - Accessible to all authenticated users */}
        <Route path="profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="settings" element={
          <ProtectedRoute>
            {user?.role === 'admin' ? (
              <Navigate to="/admin/settings" replace />
            ) : (
              <SettingsPage />
            )}
          </ProtectedRoute>
        } />

        {/* Default redirect based on user role handled by Index component */}
        <Route index element={<Index />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes >
  );
}

function App() {
  return (
    <ErrorBoundary>
      <HospitalSettingsProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <AppRoutes />
              <Toaster
                position="top-right"
                expand={true}
                richColors
                closeButton
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'hsl(var(--background))',
                    color: 'hsl(var(--foreground))',
                    border: '1px solid hsl(var(--border))',
                  },
                }}
              />
            </div>
          </Router>
        </AuthProvider>
      </HospitalSettingsProvider>
    </ErrorBoundary>
  );
}

export default App;
