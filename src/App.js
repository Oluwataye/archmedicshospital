"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_router_dom_1 = require("react-router-dom");
var sonner_1 = require("sonner");
var AuthContext_1 = require("@/contexts/AuthContext");
var AuthContext_2 = require("@/contexts/AuthContext");
var ErrorBoundary_1 = require("@/components/common/ErrorBoundary");
var LoadingSpinner_1 = require("@/components/common/LoadingSpinner");
var AppLayout_1 = require("@/components/layout/AppLayout");
var LoginPage_1 = require("@/pages/LoginPage");
var DashboardPage_1 = require("@/pages/DashboardPage");
// Admin Pages
var HMOManagementPage_1 = require("@/pages/admin/HMOManagementPage");
// Cashier Pages
var ClaimsManagementPage_1 = require("@/pages/cashier/ClaimsManagementPage");
var PreAuthorizationPage_1 = require("@/pages/cashier/PreAuthorizationPage");
// EHR Pages
var PatientRecordsPage_1 = require("@/pages/ehr/PatientRecordsPage");
var PatientManagementPage_1 = require("@/pages/ehr/PatientManagementPage");
var AppointmentsPage_1 = require("@/pages/ehr/AppointmentsPage");
var ProgressNotesPage_1 = require("@/pages/ehr/ProgressNotesPage");
var SOAPNotesPage_1 = require("@/pages/ehr/SOAPNotesPage");
var DischargeNotesPage_1 = require("@/pages/ehr/DischargeNotesPage");
var LabResultsPage_1 = require("@/pages/ehr/LabResultsPage");
var ImagingPage_1 = require("@/pages/ehr/ImagingPage");
var MedicationsPage_1 = require("@/pages/ehr/MedicationsPage");
var PatientStatisticsPage_1 = require("@/pages/ehr/PatientStatisticsPage");
var DiseasePrevalencePage_1 = require("@/pages/ehr/DiseasePrevalencePage");
var TreatmentOutcomesPage_1 = require("@/pages/ehr/TreatmentOutcomesPage");
// Protected Route Component
var ProtectedRoute = function (_a) {
    var children = _a.children, allowedRoles = _a.allowedRoles;
    var _b = (0, AuthContext_2.useAuth)(), user = _b.user, loading = _b.loading;
    if (loading) {
        return <LoadingSpinner_1.default fullScreen text="Loading..."/>;
    }
    if (!user) {
        return <react_router_dom_1.Navigate to="/login" replace/>;
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <react_router_dom_1.Navigate to={"/".concat(user.role)} replace/>;
    }
    return <>{children}</>;
};
// Public Route Component (redirects if already authenticated)
var PublicRoute = function (_a) {
    var children = _a.children;
    var _b = (0, AuthContext_2.useAuth)(), user = _b.user, loading = _b.loading;
    if (loading) {
        return <LoadingSpinner_1.default fullScreen text="Loading..."/>;
    }
    if (user) {
        return <react_router_dom_1.Navigate to={"/".concat(user.role)} replace/>;
    }
    return <>{children}</>;
};
function AppRoutes() {
    return (<react_router_dom_1.Routes>
      {/* Public Routes */}
      <react_router_dom_1.Route path="/login" element={<PublicRoute>
          <LoginPage_1.default />
        </PublicRoute>}/>

      {/* Protected Routes */}
      <react_router_dom_1.Route path="/" element={<ProtectedRoute>
          <AppLayout_1.default />
        </ProtectedRoute>}>
        {/* Admin Routes */}
        <react_router_dom_1.Route path="admin" element={<ProtectedRoute allowedRoles={['admin']}>
            <DashboardPage_1.default />
          </ProtectedRoute>}/>
        <react_router_dom_1.Route path="admin/hmo" element={<ProtectedRoute allowedRoles={['admin']}>
            <HMOManagementPage_1.default />
          </ProtectedRoute>}/>

        {/* Doctor Routes */}
        <react_router_dom_1.Route path="doctor" element={<ProtectedRoute allowedRoles={['doctor']}>
            <DashboardPage_1.default />
          </ProtectedRoute>}/>

        {/* Nurse Routes */}
        <react_router_dom_1.Route path="nurse" element={<ProtectedRoute allowedRoles={['nurse']}>
            <DashboardPage_1.default />
          </ProtectedRoute>}/>

        {/* Pharmacist Routes */}
        <react_router_dom_1.Route path="pharmacist" element={<ProtectedRoute allowedRoles={['pharmacist']}>
            <DashboardPage_1.default />
          </ProtectedRoute>}/>

        {/* Lab Tech Routes */}
        <react_router_dom_1.Route path="labtech" element={<ProtectedRoute allowedRoles={['labtech']}>
            <DashboardPage_1.default />
          </ProtectedRoute>}/>

        {/* Cashier Routes */}
        <react_router_dom_1.Route path="cashier" element={<ProtectedRoute allowedRoles={['cashier']}>
            <DashboardPage_1.default />
          </ProtectedRoute>}/>
        <react_router_dom_1.Route path="cashier/claims" element={<ProtectedRoute allowedRoles={['cashier', 'admin']}>
            <ClaimsManagementPage_1.default />
          </ProtectedRoute>}/>
        <react_router_dom_1.Route path="cashier/preauth" element={<ProtectedRoute allowedRoles={['cashier', 'admin']}>
            <PreAuthorizationPage_1.default />
          </ProtectedRoute>}/>

        {/* EHR Routes */}
        <react_router_dom_1.Route path="ehr" element={<ProtectedRoute allowedRoles={['ehr']}>
            <DashboardPage_1.default />
          </ProtectedRoute>}/>
        <react_router_dom_1.Route path="ehr/patient-records" element={<ProtectedRoute allowedRoles={['ehr']}>
            <PatientRecordsPage_1.default />
          </ProtectedRoute>}/>
        <react_router_dom_1.Route path="ehr/patient-management" element={<ProtectedRoute allowedRoles={['ehr']}>
            <PatientManagementPage_1.default />
          </ProtectedRoute>}/>
        <react_router_dom_1.Route path="ehr/appointments" element={<ProtectedRoute allowedRoles={['ehr']}>
            <AppointmentsPage_1.default />
          </ProtectedRoute>}/>
        <react_router_dom_1.Route path="ehr/progress-notes" element={<ProtectedRoute allowedRoles={['ehr']}>
            <ProgressNotesPage_1.default />
          </ProtectedRoute>}/>
        <react_router_dom_1.Route path="ehr/soap-notes" element={<ProtectedRoute allowedRoles={['ehr']}>
            <SOAPNotesPage_1.default />
          </ProtectedRoute>}/>
        <react_router_dom_1.Route path="ehr/discharge-notes" element={<ProtectedRoute allowedRoles={['ehr']}>
            <DischargeNotesPage_1.default />
          </ProtectedRoute>}/>
        <react_router_dom_1.Route path="ehr/lab-results" element={<ProtectedRoute allowedRoles={['ehr']}>
            <LabResultsPage_1.default />
          </ProtectedRoute>}/>
        <react_router_dom_1.Route path="ehr/imaging" element={<ProtectedRoute allowedRoles={['ehr']}>
            <ImagingPage_1.default />
          </ProtectedRoute>}/>
        <react_router_dom_1.Route path="ehr/medications" element={<ProtectedRoute allowedRoles={['ehr']}>
            <MedicationsPage_1.default />
          </ProtectedRoute>}/>
        <react_router_dom_1.Route path="ehr/analytics/statistics" element={<ProtectedRoute allowedRoles={['ehr']}>
            <PatientStatisticsPage_1.default />
          </ProtectedRoute>}/>
        <react_router_dom_1.Route path="ehr/analytics/disease-prevalence" element={<ProtectedRoute allowedRoles={['ehr']}>
            <DiseasePrevalencePage_1.default />
          </ProtectedRoute>}/>
        <react_router_dom_1.Route path="ehr/analytics/treatment-outcomes" element={<ProtectedRoute allowedRoles={['ehr']}>
            <TreatmentOutcomesPage_1.default />
          </ProtectedRoute>}/>

        {/* Default redirect based on user role */}
        <react_router_dom_1.Route path="/" element={<react_router_dom_1.Navigate to="/ehr" replace/>}/>
      </react_router_dom_1.Route>

      {/* Catch all route */}
      <react_router_dom_1.Route path="*" element={<react_router_dom_1.Navigate to="/login" replace/>}/>
    </react_router_dom_1.Routes>);
}
function App() {
    return (<ErrorBoundary_1.default>
      <AuthContext_1.AuthProvider>
        <react_router_dom_1.BrowserRouter>
          <div className="min-h-screen bg-background">
            <AppRoutes />
            <sonner_1.Toaster position="top-right" expand={true} richColors closeButton toastOptions={{
            duration: 4000,
            style: {
                background: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))',
            },
        }}/>
          </div>
        </react_router_dom_1.BrowserRouter>
      </AuthContext_1.AuthProvider>
    </ErrorBoundary_1.default>);
}
exports.default = App;
