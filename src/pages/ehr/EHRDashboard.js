"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var sonner_1 = require("sonner");
var scroll_area_1 = require("@/components/ui/scroll-area");
var PatientRegistrationModal_1 = require("@/components/ehr/PatientRegistrationModal");
var DashboardHeader_1 = require("@/components/ehr/dashboard/DashboardHeader");
var QuickSearch_1 = require("@/components/ehr/dashboard/QuickSearch");
var StatsOverview_1 = require("@/components/ehr/dashboard/StatsOverview");
var FeaturedPatientVitals_1 = require("@/components/ehr/dashboard/FeaturedPatientVitals");
var RecentPatients_1 = require("@/components/ehr/dashboard/RecentPatients");
var RecentActivity_1 = require("@/components/ehr/dashboard/RecentActivity");
var QuickLinks_1 = require("@/components/ehr/dashboard/QuickLinks");
var EHRDashboard = function () {
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _a = (0, react_1.useState)(false), isRegistrationModalOpen = _a[0], setIsRegistrationModalOpen = _a[1];
    var _b = (0, react_1.useState)(''), searchQuery = _b[0], setSearchQuery = _b[1];
    // Recent patients data
    var recentPatients = [
        {
            id: 'P-10237',
            name: 'John Smith',
            age: 42,
            gender: 'Male',
            status: 'Active',
            lastVisit: 'Apr 25, 2025',
            records: 3
        },
        {
            id: 'P-10892',
            name: 'Emily Davis',
            age: 35,
            gender: 'Female',
            status: 'Follow-up',
            lastVisit: 'Apr 22, 2025',
            records: 5
        },
        {
            id: 'P-10745',
            name: 'Michael Brown',
            age: 58,
            gender: 'Male',
            status: 'New',
            lastVisit: 'Today',
            records: 1
        },
    ];
    // Filter patients based on search query
    var filteredPatients = searchQuery.trim() === ''
        ? recentPatients
        : recentPatients.filter(function (patient) {
            return patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                patient.id.toLowerCase().includes(searchQuery.toLowerCase());
        });
    var handleNewPatientSave = function (data) {
        // In a real app, this would call an API to save the patient data
        var newPatientId = "P-".concat(Math.floor(10000 + Math.random() * 90000));
        sonner_1.toast.success("Patient ".concat(data.name, " registered successfully with ID: ").concat(newPatientId));
        setIsRegistrationModalOpen(false);
        // Navigate to the patient records page after successful registration
        setTimeout(function () {
            navigate('/ehr/records');
        }, 1000);
    };
    return (<scroll_area_1.ScrollArea className="h-[calc(100vh-80px)]">
      <div className="space-y-6 p-6">
        {/* Dashboard Header with New Record button */}
        <DashboardHeader_1.default onOpenModal={function () { return setIsRegistrationModalOpen(true); }}/>

        {/* Patient Registration Modal */}
        <PatientRegistrationModal_1.default open={isRegistrationModalOpen} onOpenChange={setIsRegistrationModalOpen} onSave={handleNewPatientSave}/>

        {/* Quick Search */}
        <QuickSearch_1.default searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>

        {/* Stats Overview */}
        <StatsOverview_1.default />

        {/* Featured Patient Vitals */}
        <FeaturedPatientVitals_1.default />

        {/* Recent Patients and Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Patients */}
          <RecentPatients_1.default patients={recentPatients} filteredPatients={filteredPatients}/>

          {/* Recent Activity */}
          <RecentActivity_1.default />
        </div>

        {/* Quick Links */}
        <QuickLinks_1.default />
      </div>
    </scroll_area_1.ScrollArea>);
};
exports.default = EHRDashboard;
