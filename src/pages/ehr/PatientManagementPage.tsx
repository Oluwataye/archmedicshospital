
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { usePatientManagement } from '@/hooks/usePatientManagement';

// Import refactored components
import PatientManagementHeader from '@/components/ehr/patient-management/PatientManagementHeader';
import PatientSearchFilters from '@/components/ehr/patient-management/PatientSearchFilters';
import PatientListTable from '@/components/ehr/patient-management/PatientListTable';
import PatientsTablePagination from '@/components/ehr/patient-management/PatientsTablePagination';
import PatientOverviewStats from '@/components/ehr/patient-management/PatientOverviewStats';

// Import modals
import PatientRegistrationModal from '@/components/ehr/PatientRegistrationModal';
import MedicalHistoryModal from '@/components/ehr/MedicalHistoryModal';
import ShareRecordsModal from '@/components/ehr/ShareRecordsModal';
import PatientStatisticsModal from '@/components/ehr/PatientStatisticsModal';
import WardAssignmentModal from '@/components/ehr/WardAssignmentModal';

const PatientManagementPage = () => {
  // Use the custom hook for patient management
  const {
    patients,
    filteredPatients,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    genderFilter,
    setGenderFilter,
    selectedPatient,
    setSelectedPatient,
    handleNewPatientSave,
    handleDeletePatient,
    handleEditPatient,
    handleExportPatientList
  } = usePatientManagement();

  // Modal states
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isMedicalHistoryModalOpen, setIsMedicalHistoryModalOpen] = useState(false);
  const [isShareRecordsModalOpen, setIsShareRecordsModalOpen] = useState(false);
  const [isStatisticsModalOpen, setIsStatisticsModalOpen] = useState(false);
  const [isWardAssignmentModalOpen, setIsWardAssignmentModalOpen] = useState(false);

  // Handle adding a new patient
  const handleAddPatient = () => {
    setIsRegistrationModalOpen(true);
  };

  // Handle view medical history
  const handleViewMedicalHistory = (patient: any) => {
    setSelectedPatient(patient);
    setIsMedicalHistoryModalOpen(true);
  };

  // Handle sharing records
  const handleShareRecords = (patient: any) => {
    setSelectedPatient(patient);
    setIsShareRecordsModalOpen(true);
  };

  // Handle ward assignment
  const handleWardAssignment = (patient: any) => {
    setSelectedPatient(patient);
    setIsWardAssignmentModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PatientManagementHeader 
        onAddPatient={handleAddPatient}
        onViewStatistics={() => setIsStatisticsModalOpen(true)}
      />

      {/* Modals */}
      <PatientRegistrationModal
        open={isRegistrationModalOpen}
        onOpenChange={setIsRegistrationModalOpen}
        onSave={handleNewPatientSave}
      />
      
      {selectedPatient && (
        <>
          <MedicalHistoryModal
            open={isMedicalHistoryModalOpen}
            onOpenChange={setIsMedicalHistoryModalOpen}
            patientId={selectedPatient.id}
            patientName={selectedPatient.name}
          />
          
          <ShareRecordsModal
            open={isShareRecordsModalOpen}
            onOpenChange={setIsShareRecordsModalOpen}
            patientId={selectedPatient.id}
            patientName={selectedPatient.name}
          />
          
          <WardAssignmentModal
            open={isWardAssignmentModalOpen}
            onOpenChange={setIsWardAssignmentModalOpen}
            patientId={selectedPatient.id}
            patientName={selectedPatient.name}
          />
        </>
      )}
      
      <PatientStatisticsModal
        open={isStatisticsModalOpen}
        onOpenChange={setIsStatisticsModalOpen}
      />

      {/* Patient Management Card */}
      <Card>
        <CardContent className="pt-6">
          {/* Search and Filters */}
          <PatientSearchFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            genderFilter={genderFilter}
            setGenderFilter={setGenderFilter}
            onExport={handleExportPatientList}
          />

          {/* Patient List Table */}
          <div className="mt-6">
            <PatientListTable
              patients={filteredPatients}
              onViewMedicalHistory={handleViewMedicalHistory}
              onEditPatient={handleEditPatient}
              onShareRecords={handleShareRecords}
              onWardAssignment={handleWardAssignment}
              onDeletePatient={handleDeletePatient}
            />

            {/* Pagination */}
            {filteredPatients.length > 0 && (
              <PatientsTablePagination
                totalCount={filteredPatients.length}
                currentPage={1}
              />
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Patient Statistics Dashboard */}
      <PatientOverviewStats
        patients={patients}
        onViewStatistics={() => setIsStatisticsModalOpen(true)}
      />
    </div>
  );
};

export default PatientManagementPage;
