import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { useAuth } from '@/contexts/AuthContext';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import AppLayout from '@/components/layout/AppLayout';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';

// Admin Pages
import HMOManagementPage from '@/pages/admin/HMOManagementPage';

// Cashier Pages
import ClaimsManagementPage from '@/pages/cashier/ClaimsManagementPage';
import PreAuthorizationPage from '@/pages/cashier/PreAuthorizationPage';

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

        {/* Doctor Routes */}
        <Route path="doctor" element={
          <ProtectedRoute allowedRoles={['doctor']}>
            <DashboardPage />
          </ProtectedRoute>
        } />

        {/* Nurse Routes */}
        <Route path="nurse" element={
          <ProtectedRoute allowedRoles={['nurse']}>
            <DashboardPage />
          </ProtectedRoute>
        } />

        {/* Pharmacist Routes */}
        <Route path="pharmacist" element={
          <ProtectedRoute allowedRoles={['pharmacist']}>
            <DashboardPage />
          </ProtectedRoute>
        } />

        {/* Lab Tech Routes */}
        <Route path="labtech" element={
          <ProtectedRoute allowedRoles={['labtech']}>
            <DashboardPage />
          </ProtectedRoute>
        } />

        {/* Cashier Routes */}
        <Route path="cashier" element={
          <ProtectedRoute allowedRoles={['cashier']}>
            <DashboardPage />
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
          <ProtectedRoute allowedRoles={['ehr']}>
            <PatientRecords />
          </ProtectedRoute>
        } />
        <Route path="ehr/patient-management" element={
          <ProtectedRoute allowedRoles={['ehr']}>
            <PatientManagement />
          </ProtectedRoute>
        } />
        <Route path="ehr/appointments" element={
          <ProtectedRoute allowedRoles={['ehr']}>
            <Appointments />
          </ProtectedRoute>
        } />
        <Route path="ehr/progress-notes" element={
          <ProtectedRoute allowedRoles={['ehr']}>
            <ProgressNotes />
          </ProtectedRoute>
        } />
        <Route path="ehr/soap-notes" element={
          <ProtectedRoute allowedRoles={['ehr']}>
            <SOAPNotes />
          </ProtectedRoute>
        } />
        <Route path="ehr/discharge-notes" element={
          <ProtectedRoute allowedRoles={['ehr']}>
            <DischargeNotes />
          </ProtectedRoute>
        } />
        <Route path="ehr/lab-results" element={
          <ProtectedRoute allowedRoles={['ehr']}>
            <LabResults />
          </ProtectedRoute>
        } />
        <Route path="ehr/imaging" element={
          <ProtectedRoute allowedRoles={['ehr']}>
            <Imaging />
          </ProtectedRoute>
        } />
        <Route path="ehr/medications" element={
          <ProtectedRoute allowedRoles={['ehr']}>
            <Medications />
          </ProtectedRoute>
        } />
        <Route path="ehr/analytics/statistics" element={
          <ProtectedRoute allowedRoles={['ehr']}>
            <PatientStatistics />
          </ProtectedRoute>
        } />
        <Route path="ehr/analytics/disease-prevalence" element={
          <ProtectedRoute allowedRoles={['ehr']}>
            <DiseasePrevalence />
          </ProtectedRoute>
        } />
        <Route path="ehr/analytics/treatment-outcomes" element={
          <ProtectedRoute allowedRoles={['ehr']}>
            <TreatmentOutcomes />
          </ProtectedRoute>
        } />

        {/* Default redirect based on user role */}
        <Route path="/" element={<Navigate to="/ehr" replace />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}

export default App;
