import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ApiService } from '@/services/apiService';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Share2, Printer, FileText, Pill, FlaskConical, Scan, Activity, AlertTriangle, History } from 'lucide-react';

// Import existing EHR components
import PatientInfoCard from '@/components/ehr/PatientInfoCard';
import PatientVitals from '@/components/ehr/PatientVitals';
import VitalSignsTab from '@/components/ehr/VitalSignsTab';
import ProceduresTab from '@/components/ehr/ProceduresTab';
import AllergiesTab from '@/components/ehr/AllergiesTab';
import MedicalHistoryTab from '@/components/ehr/MedicalHistoryTab';
import ShareRecordsModal from '@/components/ehr/ShareRecordsModal';
import LoadingSpinner from '@/components/common/LoadingSpinner';

// New doctor components
import ConsultNotesTab from '@/components/doctor/ConsultNotesTab';
import ConsultNoteModal from '@/components/doctor/ConsultNoteModal';
import ViewConsultNoteModal from '@/components/doctor/ViewConsultNoteModal';
import PrescriptionsTab from '@/components/doctor/PrescriptionsTab';
import LabResultsTab from '@/components/doctor/LabResultsTab';
import ImagingTab from '@/components/doctor/ImagingTab';

// New action modals
import NewPrescriptionModal from '@/components/doctor/NewPrescriptionModal';
import OrderLabTestModal from '@/components/doctor/OrderLabTestModal';
import OrderImagingModal from '@/components/doctor/OrderImagingModal';
import AddVitalsModal from '@/components/ehr/AddVitalsModal';
import AddAllergyModal from '@/components/ehr/AddAllergyModal';
import AddMedicalHistoryModal from '@/components/ehr/AddMedicalHistoryModal';

interface Patient {
    id: string;
    first_name: string;
    last_name: string;
    mrn: string;
    date_of_birth: string;
    gender: string;
    phone: string;
    email: string;
    address: string;
}

interface VitalSigns {
    bloodPressure: string;
    heartRate: string;
    temperature: string;
    oxygenSaturation: string;
    recordedTime: string;
}

export default function PatientEMRPage() {
    const { patientId } = useParams<{ patientId: string }>();
    const navigate = useNavigate();

    // State management
    const [patient, setPatient] = useState<Patient | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('consult-notes');
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    // Vital signs state
    const [vitalSigns, setVitalSigns] = useState<VitalSigns>({
        bloodPressure: '--/--',
        heartRate: '--',
        temperature: '--',
        oxygenSaturation: '--',
        recordedTime: 'No recent vitals'
    });

    // Medical data states
    const [consultNotes, setConsultNotes] = useState<any[]>([]);
    const [prescriptions, setPrescriptions] = useState<any[]>([]);
    const [labResults, setLabResults] = useState<any[]>([]);
    const [imagingResults, setImagingResults] = useState<any[]>([]);
    const [procedures, setProcedures] = useState<any[]>([]);
    const [allergies, setAllergies] = useState<any[]>([]);
    const [medicalHistory, setMedicalHistory] = useState<any[]>([]);

    // Consult notes modal states
    const [isConsultNoteModalOpen, setIsConsultNoteModalOpen] = useState(false);
    const [isViewNoteModalOpen, setIsViewNoteModalOpen] = useState(false);
    const [editingNote, setEditingNote] = useState<any | null>(null);
    const [viewingNote, setViewingNote] = useState<any | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);

    // Action modal states
    const [isNewPrescriptionModalOpen, setIsNewPrescriptionModalOpen] = useState(false);
    const [isOrderLabModalOpen, setIsOrderLabModalOpen] = useState(false);
    const [isOrderImagingModalOpen, setIsOrderImagingModalOpen] = useState(false);
    const [isAddVitalsModalOpen, setIsAddVitalsModalOpen] = useState(false);
    const [isAddAllergyModalOpen, setIsAddAllergyModalOpen] = useState(false);
    const [isAddHistoryModalOpen, setIsAddHistoryModalOpen] = useState(false);

    // Get current user info from auth context or localStorage
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const currentUserId = currentUser.id || '';
    const currentUserRole = currentUser.role || 'doctor';

    // Load patient data on mount
    useEffect(() => {
        if (patientId) {
            loadPatientData();
        }
    }, [patientId]);

    const loadPatientData = async () => {
        try {
            console.log('🔄 ===== LOADING PATIENT DATA =====');
            console.log('📍 Patient ID from URL:', patientId);
            setLoading(true);

            // Load patient details
            console.log('📞 Calling ApiService.getPatient...');
            const patientResponse = await ApiService.getPatient(patientId!);
            console.log('✅ Patient response received:', patientResponse);
            console.log('👤 Patient data from response.data:', patientResponse.data);
            console.log('👤 Patient data from response itself:', patientResponse);

            // The API response structure might be: response.data.data OR just response.data OR just response
            const patientData = patientResponse.data?.data || patientResponse.data || patientResponse;
            console.log('🎯 Final patient data to use:', patientData);

            setPatient(patientData);

            // Load vital signs
            console.log('📊 Loading vital signs...');
            await loadVitalSigns();

            // Load medical records
            console.log('📋 Loading medical records...');
            await loadMedicalRecords();

            console.log('✅ All patient data loaded successfully');

        } catch (error) {
            console.error('❌ Error loading patient data:', error);
            toast.error('Failed to load patient information');
        } finally {
            setLoading(false);
            console.log('🏁 Loading complete, loading state set to false');
        }
    };

    const loadVitalSigns = async () => {
        try {
            const response = await ApiService.getPatientVitalHistory(patientId!);
            const vitals = response.data || [];

            if (vitals.length > 0) {
                const latest = vitals[0];
                setVitalSigns({
                    bloodPressure: `${latest.systolic}/${latest.diastolic}` || '--/--',
                    heartRate: latest.heart_rate || '--',
                    temperature: latest.temperature || '--',
                    oxygenSaturation: latest.oxygen_saturation || '--',
                    recordedTime: latest.recorded_at ? new Date(latest.recorded_at).toLocaleString() : 'No recent vitals'
                });
            }
        } catch (error) {
            console.error('Error loading vital signs:', error);
        }
    };

    const loadMedicalRecords = async () => {
        try {
            // Load comprehensive medical history (previous consults)
            const historyResponse = await ApiService.getPatientMedicalHistory(patientId!);
            setMedicalHistory(historyResponse || []);

            // Load consult notes (progress notes) - Keep this for the specific tab if needed, or rely on history
            const recordsResponse = await ApiService.getMedicalRecords({ patient_id: patientId, record_type: 'progress_note' });
            setConsultNotes(Array.isArray(recordsResponse) ? recordsResponse : (recordsResponse.data || []));

            // Load prescriptions
            const prescriptionsResponse = await ApiService.getPatientPrescriptionHistory(patientId!);
            setPrescriptions(prescriptionsResponse.data || []);

            // Load lab results
            const labResponse = await ApiService.getPatientLabHistory(patientId!);
            setLabResults(labResponse.data || []);

            // TODO: Load imaging results when endpoint is available
            // const imagingResponse = await ApiService.getPatientImagingHistory(patientId!);
            // setImagingResults(imagingResponse.data || []);

        } catch (error) {
            console.error('Error loading medical records:', error);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleShare = () => {
        setIsShareModalOpen(true);
    };

    const handlePrint = () => {
        window.print();
        toast.success('Printing patient folder...');
    };

    // Consult Notes Handlers
    const handleCreateNote = () => {
        setEditingNote(null);
        setIsEditMode(false);
        setIsConsultNoteModalOpen(true);
    };

    const handleEditNote = (note: any) => {
        setEditingNote(note);
        setIsEditMode(true);
        setIsConsultNoteModalOpen(true);
    };

    const handleViewNote = (note: any) => {
        setViewingNote(note);
        setIsViewNoteModalOpen(true);
    };

    const handleSaveNote = async (noteData: any) => {
        try {
            if (isEditMode && editingNote) {
                // Update existing note
                await ApiService.updateMedicalRecord(editingNote.id, {
                    title: noteData.title,
                    content: JSON.stringify(noteData.content),
                    status: noteData.status,
                    amendment_reason: noteData.amendment_reason
                });
                toast.success('Consult note updated successfully');
            } else {
                // Create new note
                await ApiService.createMedicalRecord({
                    patient_id: patientId,
                    record_type: 'progress_note',
                    title: noteData.title,
                    content: JSON.stringify(noteData.content),
                    status: noteData.status,
                    record_date: new Date().toISOString()
                });
                toast.success('Consult note created successfully');
            }

            // Reload medical records
            await loadMedicalRecords();
            setIsConsultNoteModalOpen(false);
        } catch (error) {
            console.error('Error saving consult note:', error);
            throw error;
        }
    };

    const handleDeleteNote = async (noteId: string) => {
        try {
            await ApiService.deleteMedicalRecord(noteId);
            toast.success('Consult note deleted successfully');
            await loadMedicalRecords();
        } catch (error) {
            console.error('Error deleting consult note:', error);
            toast.error('Failed to delete consult note');
        }
    };

    // Action modal handlers
    const handleSavePrescription = async (prescriptionData: any) => {
        try {
            await ApiService.createPrescription({
                patient_id: patientId,
                ...prescriptionData,
                prescribed_by: currentUserId,
                prescribed_date: new Date().toISOString()
            });
            await loadMedicalRecords(); // Reload to get prescriptions
            toast.success('Prescription created successfully', {
                description: "Please direct the patient to the Cashier for payment.",
                duration: 5000,
            });
        } catch (error) {
            console.error('Error creating prescription:', error);
            throw error;
        }
    };

    const handleSaveLabOrder = async (labData: any) => {
        try {
            await ApiService.createLabOrder({
                patient_id: patientId,
                ...labData,
                ordered_by: currentUserId,
                order_date: new Date().toISOString()
            });
            await loadMedicalRecords(); // Reload to get lab orders
            toast.success('Lab order created successfully', {
                description: "Please direct the patient to the Cashier for payment.",
                duration: 5000,
            });
        } catch (error) {
            console.error('Error creating lab order:', error);
            throw error;
        }
    };

    const handleSaveImagingOrder = async (imagingData: any) => {
        try {
            await ApiService.createImagingOrder({
                patient_id: patientId,
                ...imagingData,
                ordered_by: currentUserId,
                order_date: new Date().toISOString()
            });
            await loadMedicalRecords(); // Reload to get imaging orders
            toast.success('Imaging order created successfully', {
                description: "Please direct the patient to the Cashier for payment.",
                duration: 5000,
            });
        } catch (error) {
            console.error('Error creating imaging order:', error);
            throw error;
        }
    };

    const handleSaveVitals = async (vitalsData: any) => {
        try {
            await ApiService.createVitalSigns({
                patient_id: patientId,
                ...vitalsData,
                recorded_by: currentUserId,
                recorded_at: new Date().toISOString()
            });
            await loadVitalSigns(); // Reload vital signs
        } catch (error) {
            console.error('Error saving vitals:', error);
            throw error;
        }
    };

    const handleSaveAllergy = async (allergyData: any) => {
        try {
            await ApiService.createAllergy({
                patient_id: patientId,
                ...allergyData,
                recorded_by: currentUserId,
                recorded_at: new Date().toISOString()
            });
            await loadMedicalRecords(); // Reload to get allergies
        } catch (error) {
            console.error('Error saving allergy:', error);
            throw error;
        }
    };

    const handleSaveMedicalHistory = async (historyData: any) => {
        try {
            await ApiService.createMedicalHistory({
                patient_id: patientId,
                ...historyData,
                recorded_by: currentUserId,
                recorded_at: new Date().toISOString()
            });
            await loadMedicalRecords(); // Reload to get medical history
        } catch (error) {
            console.error('Error saving medical history:', error);
            throw error;
        }
    };

    if (loading) {
        console.log('⏳ PatientEMRPage: Rendering loading spinner');
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    if (!patient) {
        console.log('❌ PatientEMRPage: No patient data, showing "not found"');
        console.log('Patient state:', patient);
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-lg text-gray-600 mb-4">Patient not found</p>
                <Button onClick={handleBack}>Go Back</Button>
            </div>
        );
    }

    console.log('✅ PatientEMRPage: Rendering full page with patient:', patient);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={handleBack}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Patient EMR Folder - {patient.first_name} {patient.last_name}
                        </h1>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                            <span>MRN: {patient.mrn}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleShare}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                    </Button>
                    <Button variant="outline" onClick={handlePrint}>
                        <Printer className="h-4 w-4 mr-2" />
                        Print
                    </Button>
                </div>
            </div>

            {/* Patient Info Card */}
            <PatientInfoCard
                patient={{
                    id: patient.id,
                    name: `${patient.first_name} ${patient.last_name}`,
                    age: new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear(),
                    gender: patient.gender,
                    dob: patient.date_of_birth,
                    address: patient.address,
                    phone: patient.phone,
                    email: patient.email,
                    status: 'Active',
                    lastVisit: 'Today',
                    doctor: 'Current User',
                    records: consultNotes.length
                }}
                onEdit={() => toast.info('Edit patient information')}
                onPrint={handlePrint}
                onShare={handleShare}
            />

            {/* Recent Vital Signs */}
            <Card>
                <CardContent className="p-4">
                    <PatientVitals
                        patientId={patient.id}
                        patientName={`${patient.first_name} ${patient.last_name}`}
                        bloodPressure={vitalSigns.bloodPressure}
                        heartRate={vitalSigns.heartRate}
                        temperature={vitalSigns.temperature}
                        oxygenSaturation={vitalSigns.oxygenSaturation}
                        recordedTime={vitalSigns.recordedTime}
                    />
                </CardContent>
            </Card>

            {/* Medical Records Tabs */}
            <Card>
                <CardContent className="p-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid grid-cols-4 lg:grid-cols-7 gap-2">
                            <TabsTrigger value="consult-notes" className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                <span className="hidden sm:inline">Consult Notes</span>
                            </TabsTrigger>
                            <TabsTrigger value="prescriptions" className="flex items-center gap-2">
                                <Pill className="h-4 w-4" />
                                <span className="hidden sm:inline">Prescriptions</span>
                            </TabsTrigger>
                            <TabsTrigger value="lab-results" className="flex items-center gap-2">
                                <FlaskConical className="h-4 w-4" />
                                <span className="hidden sm:inline">Lab Results</span>
                            </TabsTrigger>
                            <TabsTrigger value="imaging" className="flex items-center gap-2">
                                <Scan className="h-4 w-4" />
                                <span className="hidden sm:inline">Imaging</span>
                            </TabsTrigger>
                            <TabsTrigger value="vital-signs" className="flex items-center gap-2">
                                <Activity className="h-4 w-4" />
                                <span className="hidden sm:inline">Vital Signs</span>
                            </TabsTrigger>
                            <TabsTrigger value="allergies" className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4" />
                                <span className="hidden sm:inline">Allergies</span>
                            </TabsTrigger>
                            <TabsTrigger value="history" className="flex items-center gap-2">
                                <History className="h-4 w-4" />
                                <span className="hidden sm:inline">History</span>
                            </TabsTrigger>
                        </TabsList>

                        {/* Consult Notes Tab */}
                        <TabsContent value="consult-notes" className="mt-6">
                            <ConsultNotesTab
                                patientId={patient.id}
                                consultNotes={consultNotes}
                                currentUserId={currentUserId}
                                currentUserRole={currentUserRole}
                                onCreateNote={handleCreateNote}
                                onEditNote={handleEditNote}
                                onViewNote={handleViewNote}
                                onDeleteNote={handleDeleteNote}
                            />
                        </TabsContent>

                        {/* Prescriptions Tab */}
                        <TabsContent value="prescriptions" className="mt-6">
                            <PrescriptionsTab
                                prescriptions={prescriptions}
                                onAddPrescription={() => setIsNewPrescriptionModalOpen(true)}
                            />
                        </TabsContent>

                        {/* Lab Results Tab */}
                        <TabsContent value="lab-results" className="mt-6">
                            <LabResultsTab
                                labResults={labResults}
                                onOrderLab={() => setIsOrderLabModalOpen(true)}
                            />
                        </TabsContent>

                        {/* Imaging Tab */}
                        <TabsContent value="imaging" className="mt-6">
                            <ImagingTab
                                imagingResults={imagingResults}
                                onOrderImaging={() => setIsOrderImagingModalOpen(true)}
                            />
                        </TabsContent>

                        {/* Vital Signs Tab */}
                        <TabsContent value="vital-signs" className="mt-6">
                            <VitalSignsTab
                                patientId={patient.id}
                                patientName={`${patient.first_name} ${patient.last_name}`}
                                vitalSigns={vitalSigns}
                                onAddRecordClick={() => setIsAddVitalsModalOpen(true)}
                            />
                        </TabsContent>

                        {/* Allergies Tab */}
                        <TabsContent value="allergies" className="mt-6">
                            <AllergiesTab
                                allergies={allergies}
                                onAddRecordClick={() => setIsAddAllergyModalOpen(true)}
                            />
                        </TabsContent>

                        {/* Medical History Tab */}
                        <TabsContent value="history" className="mt-6">
                            <MedicalHistoryTab
                                medicalHistory={medicalHistory}
                                onAddRecordClick={() => setIsAddHistoryModalOpen(true)}
                            />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Share Records Modal */}
            {isShareModalOpen && patient && (
                <ShareRecordsModal
                    open={isShareModalOpen}
                    onOpenChange={setIsShareModalOpen}
                    patientId={patient.id}
                    patientName={`${patient.first_name} ${patient.last_name}`}
                />
            )}

            {/* Consult Note Modal (Create/Edit) */}
            <ConsultNoteModal
                isOpen={isConsultNoteModalOpen}
                onClose={() => setIsConsultNoteModalOpen(false)}
                onSave={handleSaveNote}
                patientId={patient.id}
                patientName={`${patient.first_name} ${patient.last_name}`}
                editingNote={editingNote}
                isEditMode={isEditMode}
            />

            {/* View Consult Note Modal */}
            <ViewConsultNoteModal
                isOpen={isViewNoteModalOpen}
                onClose={() => setIsViewNoteModalOpen(false)}
                note={viewingNote}
            />

            {/* Action Modals */}
            <NewPrescriptionModal
                isOpen={isNewPrescriptionModalOpen}
                onClose={() => setIsNewPrescriptionModalOpen(false)}
                patientId={patientId!}
                onSave={handleSavePrescription}
            />

            <OrderLabTestModal
                isOpen={isOrderLabModalOpen}
                onClose={() => setIsOrderLabModalOpen(false)}
                patientId={patientId!}
                onSave={handleSaveLabOrder}
            />

            <OrderImagingModal
                isOpen={isOrderImagingModalOpen}
                onClose={() => setIsOrderImagingModalOpen(false)}
                patientId={patientId!}
                onSave={handleSaveImagingOrder}
            />

            <AddVitalsModal
                isOpen={isAddVitalsModalOpen}
                onClose={() => setIsAddVitalsModalOpen(false)}
                patientId={patientId!}
                onSave={handleSaveVitals}
            />

            <AddAllergyModal
                isOpen={isAddAllergyModalOpen}
                onClose={() => setIsAddAllergyModalOpen(false)}
                patientId={patientId!}
                onSave={handleSaveAllergy}
            />

            <AddMedicalHistoryModal
                isOpen={isAddHistoryModalOpen}
                onClose={() => setIsAddHistoryModalOpen(false)}
                patientId={patientId!}
                onSave={handleSaveMedicalHistory}
            />
        </div>
    );
}
