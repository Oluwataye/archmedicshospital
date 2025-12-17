import React, { useState } from 'react';
import { usePatientManagement } from '@/hooks/usePatientManagement';
import PatientListTable from '@/components/ehr/patient-management/PatientListTable';
import PatientRegistrationModal from '@/components/ehr/PatientRegistrationModal';
import PatientManagementHeader from '@/components/ehr/patient-management/PatientManagementHeader';
import PatientSearchFilters from '@/components/ehr/patient-management/PatientSearchFilters';
import PatientOverviewStats from '@/components/ehr/patient-management/PatientOverviewStats';
import PatientsTablePagination from '@/components/ehr/patient-management/PatientsTablePagination';
import MedicalHistoryModal from '@/components/ehr/MedicalHistoryModal';
import ShareRecordsModal from '@/components/ehr/ShareRecordsModal';
import WardAssignmentModal from '@/components/ehr/WardAssignmentModal';
import PatientStatisticsModal from '@/components/ehr/PatientStatisticsModal';

const PatientManagementPage = () => {
  const {
    patients,
    filteredPatients,
    loading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    genderFilter,
    setGenderFilter,
    handleNewPatientSave,
    handleUpdatePatient,
    handleDeletePatient,
    handleExportPatientList
  } = usePatientManagement();

  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);

  // Action Modals State
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isWardModalOpen, setIsWardModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Handlers
  const handleViewMedicalHistory = (patient: any) => {
    setSelectedPatient(patient);
    setIsHistoryModalOpen(true);
  };

  const handleShareRecords = (patient: any) => {
    setSelectedPatient(patient);
    setIsShareModalOpen(true);
  };

  const handleWardAssignment = (patient: any) => {
    setSelectedPatient(patient);
    setIsWardModalOpen(true);
  };

  const handleEditPatient = (id: string) => {
    const patient = patients.find(p => p.id === id);
    if (patient) {
      setSelectedPatient(patient);
      setIsEditModalOpen(true);
    }
  };

  return (
    <div className="space-y-6 p-6 pb-16">
      <PatientManagementHeader
        onAddPatient={() => {
          setSelectedPatient(null);
          setIsRegistrationModalOpen(true);
        }}
        onViewStatistics={() => setIsStatsModalOpen(true)}
      />

      <PatientOverviewStats
        patients={patients}
        onViewStatistics={() => setIsStatsModalOpen(true)}
      />

      <div className="space-y-4">
        <PatientSearchFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          genderFilter={genderFilter}
          setGenderFilter={setGenderFilter}
          onExport={handleExportPatientList}
        />

        <PatientListTable
          patients={filteredPatients}
          onViewMedicalHistory={handleViewMedicalHistory}
          onEditPatient={handleEditPatient}
          onShareRecords={handleShareRecords}
          onWardAssignment={handleWardAssignment}
          onDeletePatient={handleDeletePatient}
        />

        <PatientsTablePagination
          totalCount={filteredPatients.length}
          currentPage={1}
        />
      </div>

      {/* Registration / Edit Modal */}
      <PatientRegistrationModal
        open={isRegistrationModalOpen || isEditModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsRegistrationModalOpen(false);
            setIsEditModalOpen(false);
            setSelectedPatient(null);
          }
        }}
        onSave={(data) => {
          if (isEditModalOpen && selectedPatient) {
            handleUpdatePatient(selectedPatient.id, data);
          } else {
            handleNewPatientSave(data);
          }
        }}
        patient={isEditModalOpen ? selectedPatient : undefined}
      />

      {selectedPatient && (
        <>
          <MedicalHistoryModal
            open={isHistoryModalOpen}
            onOpenChange={setIsHistoryModalOpen}
            patientId={selectedPatient.id}
            patientName={selectedPatient.name}
          />

          <ShareRecordsModal
            open={isShareModalOpen}
            onOpenChange={setIsShareModalOpen}
            patientId={selectedPatient.id}
            patientName={selectedPatient.name}
          />

          <WardAssignmentModal
            open={isWardModalOpen}
            onOpenChange={setIsWardModalOpen}
            patientId={selectedPatient.id}
            patientName={selectedPatient.name}
          />
        </>
      )}

      <PatientStatisticsModal
        open={isStatsModalOpen}
        onOpenChange={setIsStatsModalOpen}
      />
    </div>
  );
};

export default PatientManagementPage;
