import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from "sonner";
import { healthRecordsService } from '@/services/healthRecordsService';
import { ApiService } from '@/services/apiService';
import { FileText, Activity, ListFilter, AlertTriangle, Clock } from 'lucide-react';
import { TabsContent } from '@/components/ui/tabs';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

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


// Sample vital signs data - this will be replaced by records from our service
const defaultVitalSigns = {
  bloodPressure: '120/80',
  heartRate: '72',
  temperature: '98.6',
  oxygenSaturation: '98',
  recordedTime: 'Today, 10:30 AM'
};

const PatientRecordsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientIdParam = searchParams.get('id');
  const tabParam = searchParams.get('tab');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [department, setDepartment] = useState('all');
  const [patientStatus, setPatientStatus] = useState('all');
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [isNewRecordFormOpen, setIsNewRecordFormOpen] = useState(false);
  const [patientRecords, setPatientRecords] = useState<any[]>([]);
  const [vitalSigns, setVitalSigns] = useState(defaultVitalSigns);
  const [allergies, setAllergies] = useState<any[]>([]);
  const [procedures, setProcedures] = useState<any[]>([]);
  const [medicalHistory, setMedicalHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Auto-select patient from URL params
  useEffect(() => {
    if (patientIdParam && patients.length > 0 && !selectedPatient) {
      const patient = patients.find(p => String(p.id) === patientIdParam);
      if (patient) {
        setSelectedPatient(patient);
        if (tabParam) setActiveTab(tabParam);
      }
    }
  }, [patientIdParam, patients, tabParam, selectedPatient]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load patients from API
  useEffect(() => {
    loadPatients();
  }, [debouncedSearchTerm, department, patientStatus]);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (debouncedSearchTerm) params.search = debouncedSearchTerm;
      if (department !== 'all') params.department = department;
      if (patientStatus !== 'all') params.status = patientStatus;

      const response = await ApiService.getPatients(params);
      const patientsList = response.data || [];

      // Map API data to component structure
      const mappedPatients = patientsList.map((p: any) => ({
        id: p.id,
        mrn: p.mrn, // Ensure MRN is passed
        name: `${p.first_name} ${p.last_name}`,
        age: p.date_of_birth ? new Date().getFullYear() - new Date(p.date_of_birth).getFullYear() : 'N/A',
        gender: p.gender,
        dob: p.date_of_birth,
        address: p.address,
        phone: p.phone,
        email: p.email,
        status: 'Active', // Default or from API if available
        lastVisit: 'N/A',
        doctor: 'N/A',
        records: 0
      }));

      setPatients(mappedPatients);

      // If we have patients but none selected, select the first one (optional, maybe better not to auto-select for search)
      if (mappedPatients.length > 0 && !selectedPatient && !debouncedSearchTerm) {
        // setSelectedPatient(mappedPatients[0]); 
      }
    } catch (error) {
      console.error('Error loading patients:', error);
      toast.error('Failed to search patients');
    } finally {
      setLoading(false);
    }
  };

  // Load patient records when selected patient changes
  useEffect(() => {
    if (selectedPatient) {
      // If doctor, nurse, or EHR, navigate immediately to their EMR view
      if (user?.role === 'doctor' || user?.role === 'admin' || user?.role === 'nurse' || user?.role === 'ehr') {
        const query = tabParam ? `?tab=${tabParam}` : '';
        navigate(`/doctor/patient-emr/${selectedPatient.id}${query}`, { replace: true });
        return;
      }
      loadPatientData();
    }
  }, [selectedPatient, user, navigate]);

  const loadPatientData = async () => {
    if (!selectedPatient) return;

    try {
      // Get all records from healthRecordsService (mock for now)
      const records = healthRecordsService.getRecordsByPatient(selectedPatient.id);
      setPatientRecords(records);

      // Get REAL vital signs from API
      const vitalsData = await ApiService.getPatientVitalHistory(selectedPatient.id);
      const vitals = Array.isArray(vitalsData) ? vitalsData : [];

      if (vitals.length > 0) {
        const latestVital = vitals[0]; // Already sorted by date desc from API
        setVitalSigns({
          bloodPressure: latestVital.systolic_bp && latestVital.diastolic_bp
            ? `${latestVital.systolic_bp}/${latestVital.diastolic_bp}`
            : defaultVitalSigns.bloodPressure,
          heartRate: latestVital.heart_rate?.toString() || defaultVitalSigns.heartRate,
          temperature: latestVital.temperature?.toString() || defaultVitalSigns.temperature,
          oxygenSaturation: latestVital.oxygen_saturation?.toString() || defaultVitalSigns.oxygenSaturation,
          recordedTime: latestVital.recorded_at
            ? new Date(latestVital.recorded_at).toLocaleString()
            : defaultVitalSigns.recordedTime
        });
      } else {
        setVitalSigns(defaultVitalSigns);
      }

      // Get Allergies (Real-ish or Mock)
      // fetch real allergies if endpoint exists, else fallback
      const allergyRecords = healthRecordsService.getRecordsByType(selectedPatient.id, 'allergies');
      setAllergies(allergyRecords);

      // Get Procedures
      const procedureRecords = healthRecordsService.getRecordsByType(selectedPatient.id, 'procedures');
      setProcedures(procedureRecords);

      // Get Aggregated History from REAL API
      const historyRecords = await ApiService.getPatientMedicalHistory(selectedPatient.id);
      setMedicalHistory(historyRecords);
    } catch (error) {
      console.error('Error loading patient data:', error);
      setVitalSigns(defaultVitalSigns);
    }
  };

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
              patientId={selectedPatient?.id || ''}
              patientName={selectedPatient?.name || ''}
              onSave={handleSaveRecord}
              onCancel={() => setIsNewRecordFormOpen(false)}
            />
          ) : (
            <>
              {loading && <div className="text-center py-4">Searching patients...</div>}

              {!loading && patients.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm ? 'No patients found matching your search.' : 'Enter a name or MRN to search for a patient.'}
                </div>
              )}

              <RecordTabs activeTab={activeTab} onTabChange={setActiveTab}>
                {/* All Records Tab Content */}
                <TabsContent value="all" className="space-y-6">
                  {/* Patient Cards Grid */}
                  {patients.length > 0 && (
                    <PatientCardsList
                      patients={patients}
                      selectedPatient={selectedPatient}
                      onSelectPatient={setSelectedPatient}
                    />
                  )}

                  {/* Selected Patient Record Details - Only render if logic didn't navigate away (e.g. for non-doctors) */}
                  {selectedPatient && user?.role !== 'doctor' && (
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
                  {selectedPatient ? (
                    <VitalSignsTab
                      patientId={selectedPatient.id}
                      patientName={selectedPatient.name}
                      vitalSigns={vitalSigns}
                      onAddRecordClick={handleAddTabSpecificRecord}
                    />
                  ) : <div className="text-center p-4">Select a patient to view details</div>}
                </TabsContent>

                {/* Procedures Tab Content */}
                <TabsContent value="procedures">
                  {selectedPatient ? (
                    <ProceduresTab
                      patientId={selectedPatient.id}
                      procedures={procedures}
                      onAddRecordClick={handleAddTabSpecificRecord}
                    />
                  ) : <div className="text-center p-4">Select a patient to view details</div>}
                </TabsContent>

                {/* Allergies Tab Content */}
                <TabsContent value="allergies">
                  {selectedPatient ? (
                    <AllergiesTab
                      allergies={allergies}
                      onAddRecordClick={handleAddTabSpecificRecord}
                    />
                  ) : <div className="text-center p-4">Select a patient to view details</div>}
                </TabsContent>

                {/* Medical History Tab Content */}
                <TabsContent value="history">
                  {selectedPatient ? (
                    <MedicalHistoryTab
                      medicalHistory={medicalHistory}
                      onAddRecordClick={handleAddTabSpecificRecord}
                    />
                  ) : <div className="text-center p-4">Select a patient to view details</div>}
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
