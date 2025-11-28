import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from "sonner";
import { healthRecordsService } from '@/services/healthRecordsService';
import { FileText, Activity, ListFilter, AlertTriangle, Clock } from 'lucide-react';
import { TabsContent } from '@/components/ui/tabs';

// Import refactored components
import PageHeader from '@/components/ehr/PageHeader';
import PatientSearchFilters from '@/components/ehr/PatientSearchFilters';
import PatientCardsList from '@/components/ehr/PatientCardsList';
import PatientInfoCard from '@/components/ehr/PatientInfoCard';
import PatientVitals from '@/components/ehr/PatientVitals';
import RecordTabs from '@/components/ehr/RecordTabs';
import RecordsTable from '@/components/ehr/RecordsTable';
import NewRecordForm from '@/components/ehr/NewRecordForm';
import VitalSignsTab from '@/components/ehr/VitalSignsTab';
import ProceduresTab from '@/components/ehr/ProceduresTab';
import AllergiesTab from '@/components/ehr/AllergiesTab';
import MedicalHistoryTab from '@/components/ehr/MedicalHistoryTab';

// Sample patients data
const patientsData = [
  {
    id: 'P-10237',
    name: 'John Smith',
    age: 42,
    gender: 'Male',
    dob: '10/15/1982',
    address: '123 Main St, Anytown, CA',
    phone: '(555) 123-4567',
    email: 'john.smith@email.com',
    status: 'Active',
    lastVisit: 'Apr 25, 2025',
    doctor: 'Dr. Johnson',
    records: 3
  },
  {
    id: 'P-10892',
    name: 'Emily Davis',
    age: 35,
    gender: 'Female',
    dob: '03/22/1990',
    address: '456 Oak Ave, Somewhere, CA',
    phone: '(555) 987-6543',
    email: 'emily.davis@email.com',
    status: 'Follow-up',
    lastVisit: 'Apr 22, 2025',
    doctor: 'Dr. Chen',
    records: 5
  },
  {
    id: 'P-10745',
    name: 'Michael Brown',
    age: 58,
    gender: 'Male',
    dob: '11/07/1966',
    address: '789 Pine Rd, Nowhere, CA',
    phone: '(555) 456-7890',
    email: 'michael.brown@email.com',
    status: 'New',
    lastVisit: 'Today',
    doctor: 'Dr. Wilson',
    records: 1
  },
];

// Sample vital signs data - this will be replaced by records from our service
const defaultVitalSigns = {
  bloodPressure: '120/80',
  heartRate: '72',
  temperature: '98.6',
  oxygenSaturation: '98',
  recordedTime: 'Today, 10:30 AM'
};

const PatientRecordsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [department, setDepartment] = useState('all');
  const [patientStatus, setPatientStatus] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState(patientsData[0]);
  const [activeTab, setActiveTab] = useState('all');
  const [isNewRecordFormOpen, setIsNewRecordFormOpen] = useState(false);
  const [patientRecords, setPatientRecords] = useState<any[]>([]);
  const [vitalSigns, setVitalSigns] = useState(defaultVitalSigns);
  const [allergies, setAllergies] = useState<any[]>([]);
  const [procedures, setProcedures] = useState<any[]>([]);
  const [medicalHistory, setMedicalHistory] = useState<any[]>([]);

  // Load patient records when selected patient changes
  useEffect(() => {
    if (selectedPatient) {
      const records = healthRecordsService.getRecordsByPatient(selectedPatient.id);
      setPatientRecords(records);
      
      // Get vital signs records
      const vitals = healthRecordsService.getRecordsByType(selectedPatient.id, 'vital-signs');
      if (vitals.length > 0) {
        const latestVital = vitals[vitals.length - 1];
        setVitalSigns({
          bloodPressure: latestVital.bloodPressure || defaultVitalSigns.bloodPressure,
          heartRate: latestVital.heartRate || defaultVitalSigns.heartRate,
          temperature: latestVital.temperature || defaultVitalSigns.temperature,
          oxygenSaturation: latestVital.oxygenSaturation || defaultVitalSigns.oxygenSaturation,
          recordedTime: latestVital.date ? new Date(latestVital.date).toLocaleString() : defaultVitalSigns.recordedTime
        });
      } else {
        setVitalSigns(defaultVitalSigns);
      }

      // Get allergies records
      const allergyRecords = healthRecordsService.getRecordsByType(selectedPatient.id, 'allergies');
      setAllergies(allergyRecords);

      // Get procedures records
      const procedureRecords = healthRecordsService.getRecordsByType(selectedPatient.id, 'procedures');
      setProcedures(procedureRecords);

      // Get medical history records
      const historyRecords = healthRecordsService.getRecordsByType(selectedPatient.id, 'history');
      setMedicalHistory(historyRecords);
    }
  }, [selectedPatient]);

  const handleSaveRecord = (record: any) => {
    const savedRecord = healthRecordsService.addRecord(record);
    
    // Update local state based on record type
    setPatientRecords([...patientRecords, savedRecord]);
    
    // Close the form
    setIsNewRecordFormOpen(false);
    
    // Refresh specific record type data
    if (record.recordType === 'vital-signs') {
      setVitalSigns({
        bloodPressure: record.bloodPressure || defaultVitalSigns.bloodPressure,
        heartRate: record.heartRate || defaultVitalSigns.heartRate,
        temperature: record.temperature || defaultVitalSigns.temperature,
        oxygenSaturation: record.oxygenSaturation || defaultVitalSigns.oxygenSaturation,
        recordedTime: new Date(record.date).toLocaleString()
      });
    } else if (record.recordType === 'allergies') {
      setAllergies([...allergies, savedRecord]);
    } else if (record.recordType === 'procedures') {
      setProcedures([...procedures, savedRecord]);
    } else if (record.recordType === 'history') {
      setMedicalHistory([...medicalHistory, savedRecord]);
    }
  };

  const handleNewRecordClick = () => {
    setIsNewRecordFormOpen(true);
  };

  const handleAddTabSpecificRecord = () => {
    setActiveTab("all");
    setIsNewRecordFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader onNewRecordClick={handleNewRecordClick} />

      {/* Main Panel */}
      <Card>
        {/* Filters and Search */}
        <div className="p-4 border-b border-gray-200">
          <PatientSearchFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            department={department}
            setDepartment={setDepartment}
            patientStatus={patientStatus}
            setPatientStatus={setPatientStatus}
          />
        </div>

        {/* Patient Records Content */}
        <div className="p-4">
          {isNewRecordFormOpen ? (
            <NewRecordForm 
              patientId={selectedPatient.id} 
              patientName={selectedPatient.name}
              onSave={handleSaveRecord}
              onCancel={() => setIsNewRecordFormOpen(false)}
            />
          ) : (
            <>
              <RecordTabs activeTab={activeTab} onTabChange={setActiveTab}>
                {/* All Records Tab Content */}
                <TabsContent value="all" className="space-y-6">
                  {/* Patient Cards Grid */}
                  <PatientCardsList
                    patients={patientsData}
                    selectedPatient={selectedPatient}
                    onSelectPatient={setSelectedPatient}
                  />

                  {/* Selected Patient Record Details */}
                  {selectedPatient && (
                    <Card>
                      {/* Patient Header */}
                      <PatientInfoCard 
                        patient={selectedPatient}
                        onEdit={() => toast.info("Edit patient information")}
                        onPrint={() => toast.info("Print patient records")}
                        onShare={() => toast.info("Share patient records")}
                      />

                      {/* Record Content */}
                      <CardContent className="p-4">
                        {/* Vital Signs Summary */}
                        <PatientVitals
                          patientId={selectedPatient.id}
                          patientName={selectedPatient.name}
                          bloodPressure={vitalSigns.bloodPressure}
                          heartRate={vitalSigns.heartRate}
                          temperature={vitalSigns.temperature}
                          oxygenSaturation={vitalSigns.oxygenSaturation}
                          recordedTime={vitalSigns.recordedTime}
                        />

                        {/* Recent Records */}
                        <div className="mb-6">
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                            <FileText className="h-5 w-5 text-blue-500 mr-2" /> Recent Records
                          </h4>
                          <RecordsTable records={patientRecords} />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Vital Signs Tab Content */}
                <TabsContent value="vital-signs">
                  <VitalSignsTab
                    patientId={selectedPatient.id}
                    patientName={selectedPatient.name}
                    vitalSigns={vitalSigns}
                    onAddRecordClick={handleAddTabSpecificRecord}
                  />
                </TabsContent>

                {/* Procedures Tab Content */}
                <TabsContent value="procedures">
                  <ProceduresTab
                    patientId={selectedPatient.id}
                    procedures={procedures}
                    onAddRecordClick={handleAddTabSpecificRecord}
                  />
                </TabsContent>

                {/* Allergies Tab Content */}
                <TabsContent value="allergies">
                  <AllergiesTab
                    allergies={allergies}
                    onAddRecordClick={handleAddTabSpecificRecord}
                  />
                </TabsContent>

                {/* Medical History Tab Content */}
                <TabsContent value="history">
                  <MedicalHistoryTab
                    medicalHistory={medicalHistory}
                    onAddRecordClick={handleAddTabSpecificRecord}
                  />
                </TabsContent>
              </RecordTabs>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PatientRecordsPage;
