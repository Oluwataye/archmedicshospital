"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var usePatientManagement_1 = require("@/hooks/usePatientManagement");
// Import refactored components
var PatientManagementHeader_1 = require("@/components/ehr/patient-management/PatientManagementHeader");
var PatientSearchFilters_1 = require("@/components/ehr/patient-management/PatientSearchFilters");
var PatientListTable_1 = require("@/components/ehr/patient-management/PatientListTable");
var PatientsTablePagination_1 = require("@/components/ehr/patient-management/PatientsTablePagination");
var PatientOverviewStats_1 = require("@/components/ehr/patient-management/PatientOverviewStats");
// Import modals
var PatientRegistrationModal_1 = require("@/components/ehr/PatientRegistrationModal");
var MedicalHistoryModal_1 = require("@/components/ehr/MedicalHistoryModal");
var ShareRecordsModal_1 = require("@/components/ehr/ShareRecordsModal");
var PatientStatisticsModal_1 = require("@/components/ehr/PatientStatisticsModal");
var WardAssignmentModal_1 = require("@/components/ehr/WardAssignmentModal");
var PatientManagementPage = function () {
    // Use the custom hook for patient management
    var _a = (0, usePatientManagement_1.usePatientManagement)(), patients = _a.patients, filteredPatients = _a.filteredPatients, searchTerm = _a.searchTerm, setSearchTerm = _a.setSearchTerm, statusFilter = _a.statusFilter, setStatusFilter = _a.setStatusFilter, genderFilter = _a.genderFilter, setGenderFilter = _a.setGenderFilter, selectedPatient = _a.selectedPatient, setSelectedPatient = _a.setSelectedPatient, handleNewPatientSave = _a.handleNewPatientSave, handleDeletePatient = _a.handleDeletePatient, handleEditPatient = _a.handleEditPatient, handleExportPatientList = _a.handleExportPatientList;
    // Modal states
    var _b = (0, react_1.useState)(false), isRegistrationModalOpen = _b[0], setIsRegistrationModalOpen = _b[1];
    var _c = (0, react_1.useState)(false), isMedicalHistoryModalOpen = _c[0], setIsMedicalHistoryModalOpen = _c[1];
    var _d = (0, react_1.useState)(false), isShareRecordsModalOpen = _d[0], setIsShareRecordsModalOpen = _d[1];
    var _e = (0, react_1.useState)(false), isStatisticsModalOpen = _e[0], setIsStatisticsModalOpen = _e[1];
    var _f = (0, react_1.useState)(false), isWardAssignmentModalOpen = _f[0], setIsWardAssignmentModalOpen = _f[1];
    // Handle adding a new patient
    var handleAddPatient = function () {
        setIsRegistrationModalOpen(true);
    };
    // Handle view medical history
    var handleViewMedicalHistory = function (patient) {
        setSelectedPatient(patient);
        setIsMedicalHistoryModalOpen(true);
    };
    // Handle sharing records
    var handleShareRecords = function (patient) {
        setSelectedPatient(patient);
        setIsShareRecordsModalOpen(true);
    };
    // Handle ward assignment
    var handleWardAssignment = function (patient) {
        setSelectedPatient(patient);
        setIsWardAssignmentModalOpen(true);
    };
    return (<div className="space-y-6">
      {/* Page Header */}
      <PatientManagementHeader_1.default onAddPatient={handleAddPatient} onViewStatistics={function () { return setIsStatisticsModalOpen(true); }}/>

      {/* Modals */}
      <PatientRegistrationModal_1.default open={isRegistrationModalOpen} onOpenChange={setIsRegistrationModalOpen} onSave={handleNewPatientSave}/>
      
      {selectedPatient && (<>
          <MedicalHistoryModal_1.default open={isMedicalHistoryModalOpen} onOpenChange={setIsMedicalHistoryModalOpen} patientId={selectedPatient.id} patientName={selectedPatient.name}/>
          
          <ShareRecordsModal_1.default open={isShareRecordsModalOpen} onOpenChange={setIsShareRecordsModalOpen} patientId={selectedPatient.id} patientName={selectedPatient.name}/>
          
          <WardAssignmentModal_1.default open={isWardAssignmentModalOpen} onOpenChange={setIsWardAssignmentModalOpen} patientId={selectedPatient.id} patientName={selectedPatient.name}/>
        </>)}
      
      <PatientStatisticsModal_1.default open={isStatisticsModalOpen} onOpenChange={setIsStatisticsModalOpen}/>

      {/* Patient Management Card */}
      <card_1.Card>
        <card_1.CardContent className="pt-6">
          {/* Search and Filters */}
          <PatientSearchFilters_1.default searchTerm={searchTerm} setSearchTerm={setSearchTerm} statusFilter={statusFilter} setStatusFilter={setStatusFilter} genderFilter={genderFilter} setGenderFilter={setGenderFilter} onExport={handleExportPatientList}/>

          {/* Patient List Table */}
          <div className="mt-6">
            <PatientListTable_1.default patients={filteredPatients} onViewMedicalHistory={handleViewMedicalHistory} onEditPatient={handleEditPatient} onShareRecords={handleShareRecords} onWardAssignment={handleWardAssignment} onDeletePatient={handleDeletePatient}/>

            {/* Pagination */}
            {filteredPatients.length > 0 && (<PatientsTablePagination_1.default totalCount={filteredPatients.length} currentPage={1}/>)}
          </div>
        </card_1.CardContent>
      </card_1.Card>
      
      {/* Patient Statistics Dashboard */}
      <PatientOverviewStats_1.default patients={patients} onViewStatistics={function () { return setIsStatisticsModalOpen(true); }}/>
    </div>);
};
exports.default = PatientManagementPage;
