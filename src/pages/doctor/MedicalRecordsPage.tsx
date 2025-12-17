import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, Search, Edit, Eye, FileText, Stethoscope, ArrowRightLeft, BedDouble } from 'lucide-react';
import { toast } from 'sonner';
import { ApiService } from '@/services/apiService';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

import { Patient } from '@/types/patient';

interface MedicalRecord {
    id: string;
    patient_id: string;
    patient_name?: string;
    record_type: string;
    record_date: string;
    title: string;
    content: string;
    status: string;
}

export default function DoctorMedicalRecordsPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [records, setRecords] = useState<MedicalRecord[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | undefined>(undefined);
    const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('progress');
    const [progressNoteForm, setProgressNoteForm] = useState({
        patient_id: '',
        title: '',
        subjective: '',
        objective: '',
        assessment: '',
        plan: ''
    });
    const [soapNoteForm, setSoapNoteForm] = useState({
        patient_id: '',
        title: '',
        subjective: '',
        objective: '',
        assessment: '',
        plan: ''
    });

    // Action states
    const [actionType, setActionType] = useState<'consult' | 'transfer' | 'admit' | null>(null);
    const [selectedPatientForAction, setSelectedPatientForAction] = useState<any>(null);
    const [transferDepartment, setTransferDepartment] = useState('');
    const [admitWard, setAdmitWard] = useState('');
    const [admitReason, setAdmitReason] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (!loading && location.state?.patientId && location.state?.action === 'create_note') {
            const { patientId } = location.state;
            setProgressNoteForm(prev => ({ ...prev, patient_id: patientId }));
            setSoapNoteForm(prev => ({ ...prev, patient_id: patientId }));
            setIsModalOpen(true);
            // Clear the state to prevent reopening if the user closes and re-opens the page without navigating
            window.history.replaceState({}, document.title);
        }
    }, [loading, location.state]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [recordsResponse, patientsResponse] = await Promise.all([
                ApiService.getMedicalRecords(),
                ApiService.getPatients()
            ]);

            const patientsList = patientsResponse.data || [];
            const patientsMap = new Map(patientsList.map((p: any) => [String(p.id), `${p.first_name} ${p.last_name}`]));

            // ApiService.getMedicalRecords returns the data directly (array)
            const recordsData = Array.isArray(recordsResponse) ? recordsResponse : (recordsResponse.data || []);

            const recordsWithNames = recordsData.map((r: any) => ({
                ...r,
                patient_name: patientsMap.get(String(r.patient_id)) || 'Unknown Patient'
            }));

            setRecords(recordsWithNames);
            setPatients(patientsList);
        } catch (error) {
            console.error('Error loading data:', error);
            toast.error('Failed to load medical records');
        } finally {
            setLoading(false);
        }
    };

    const filteredRecords = (type: string) => {
        return records.filter(r =>
            r.record_type === type &&
            (searchQuery === '' ||
                r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    };

    const handleCreateProgressNote = () => {
        setActiveTab('progress');
        setIsModalOpen(true);
    };

    const handleCreateSOAPNote = () => {
        setActiveTab('soap');
        setIsModalOpen(true);
    };

    const handleSaveProgressNote = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const noteData = {
                patient_id: progressNoteForm.patient_id,
                record_type: 'progress_note',
                title: progressNoteForm.title,
                content: JSON.stringify({
                    subjective: progressNoteForm.subjective,
                    objective: progressNoteForm.objective,
                    assessment: progressNoteForm.assessment,
                    plan: progressNoteForm.plan
                }),
                status: 'active',
                record_date: new Date().toISOString()
            };

            await ApiService.createMedicalRecord(noteData);
            toast.success('Progress note created successfully');
            setIsModalOpen(false);
            setProgressNoteForm({
                patient_id: '',
                title: '',
                subjective: '',
                objective: '',
                assessment: '',
                plan: ''
            });
            loadData();
        } catch (error) {
            console.error('Error creating progress note:', error);
            toast.error('Failed to create progress note');
        }
    };

    const handleSaveSOAPNote = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const noteData = {
                patient_id: soapNoteForm.patient_id,
                record_type: 'soap_note',
                title: soapNoteForm.title,
                content: JSON.stringify({
                    subjective: soapNoteForm.subjective,
                    objective: soapNoteForm.objective,
                    assessment: soapNoteForm.assessment,
                    plan: soapNoteForm.plan
                }),
                status: 'active',
                record_date: new Date().toISOString()
            };

            await ApiService.createMedicalRecord(noteData);
            toast.success('SOAP note created successfully');
            setIsModalOpen(false);
            setSoapNoteForm({
                patient_id: '',
                title: '',
                subjective: '',
                objective: '',
                assessment: '',
                plan: ''
            });
            loadData();
        } catch (error) {
            console.error('Error creating SOAP note:', error);
            toast.error('Failed to create SOAP note');
        }
    };

    const handleConsult = (patientId: string) => {
        // Navigate to Patient EMR Folder page
        navigate(`/doctor/patient-emr/${patientId}`);
    };

    const handleTransfer = (patientId: string) => {
        const patient = patients.find(p => String(p.id) === String(patientId));
        if (patient) {
            setSelectedPatientForAction(patient);
            setActionType('transfer');
            setTransferDepartment('');
        }
    };

    const handleAdmit = (patientId: string) => {
        const patient = patients.find(p => String(p.id) === String(patientId));
        if (patient) {
            setSelectedPatientForAction(patient);
            setActionType('admit');
            setAdmitWard('');
            setAdmitReason('');
        }
    };

    const handleSubmitTransfer = () => {
        if (!transferDepartment) {
            toast.error('Please select a department');
            return;
        }
        toast.success(`Transfer request submitted for ${selectedPatientForAction.first_name} ${selectedPatientForAction.last_name} to ${transferDepartment}`);
        closeActionDialog();
    };

    const handleSubmitAdmit = () => {
        if (!admitWard || !admitReason.trim()) {
            toast.error('Please fill in all required fields');
            return;
        }
        toast.success(`Admission request submitted for ${selectedPatientForAction.first_name} ${selectedPatientForAction.last_name} to ${admitWard}`);
        closeActionDialog();
    };

    const closeActionDialog = () => {
        setSelectedPatientForAction(null);
        setActionType(null);
        setTransferDepartment('');
        setAdmitWard('');
        setAdmitReason('');
    };



    const handleViewRecord = (record: MedicalRecord) => {
        setSelectedRecord(record);
        setIsViewDetailsOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Medical Records</h1>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                        <span>Doctor Dashboard</span>
                        <span className="mx-2">›</span>
                        <span className="text-blue-500">Medical Records</span>
                    </div>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="progress">Progress Notes</TabsTrigger>
                    <TabsTrigger value="soap">SOAP Notes</TabsTrigger>
                </TabsList>

                <TabsContent value="progress" className="space-y-4">
                    {/* ... (keep existing search bar) */}
                    <div className="flex justify-between items-center">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search patient..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button onClick={handleCreateProgressNote}>
                            <Plus className="h-4 w-4 mr-2" />
                            New Progress Note
                        </Button>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Patient</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredRecords('progress_note').length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                                No progress notes found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredRecords('progress_note').map((record) => (
                                            <TableRow key={record.id}>
                                                <TableCell className="whitespace-nowrap">
                                                    {format(new Date(record.record_date), 'MMM d, yyyy')}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{record.patient_name}</div>
                                                </TableCell>
                                                <TableCell>{record.title}</TableCell>
                                                <TableCell>
                                                    <Badge variant="default" className="capitalize">
                                                        {record.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleConsult(record.patient_id)}
                                                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                                        >
                                                            <Stethoscope className="h-3 w-3 mr-1" />
                                                            Consult
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleTransfer(record.patient_id)}
                                                            className="text-orange-600 border-orange-200 hover:bg-orange-50"
                                                        >
                                                            <ArrowRightLeft className="h-3 w-3 mr-1" />
                                                            Transfer
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleAdmit(record.patient_id)}
                                                            className="text-green-600 border-green-200 hover:bg-green-50"
                                                        >
                                                            <BedDouble className="h-3 w-3 mr-1" />
                                                            Admit
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title="View"
                                                            onClick={() => handleViewRecord(record)}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="soap" className="space-y-4">
                    {/* ... (keep existing search bar) */}
                    <div className="flex justify-between items-center">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search patient..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button onClick={handleCreateSOAPNote}>
                            <Plus className="h-4 w-4 mr-2" />
                            New SOAP Note
                        </Button>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Patient</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredRecords('soap_note').length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                                No SOAP notes found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredRecords('soap_note').map((record) => (
                                            <TableRow key={record.id}>
                                                <TableCell className="whitespace-nowrap">
                                                    {format(new Date(record.record_date), 'MMM d, yyyy')}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{record.patient_name}</div>
                                                </TableCell>
                                                <TableCell>{record.title}</TableCell>
                                                <TableCell>
                                                    <Badge variant="default" className="capitalize">
                                                        {record.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleConsult(record.patient_id)}
                                                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                                        >
                                                            <Stethoscope className="h-3 w-3 mr-1" />
                                                            Consult
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleTransfer(record.patient_id)}
                                                            className="text-orange-600 border-orange-200 hover:bg-orange-50"
                                                        >
                                                            <ArrowRightLeft className="h-3 w-3 mr-1" />
                                                            Transfer
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleAdmit(record.patient_id)}
                                                            className="text-green-600 border-green-200 hover:bg-green-50"
                                                        >
                                                            <BedDouble className="h-3 w-3 mr-1" />
                                                            Admit
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            title="View"
                                                            onClick={() => handleViewRecord(record)}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* ... (keep existing Progress Note Modal) */}
            <Dialog open={isModalOpen && activeTab === 'progress'} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>New Progress Note</DialogTitle>
                        <DialogDescription>Create a new progress note for a patient.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveProgressNote} className="space-y-4">
                        {/* ... (keep existing form fields) */}
                        <div className="space-y-2">
                            <Label htmlFor="patient_id">Patient</Label>
                            <Select
                                value={progressNoteForm.patient_id}
                                onValueChange={(value) => setProgressNoteForm(prev => ({ ...prev, patient_id: value }))}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select patient" />
                                </SelectTrigger>
                                <SelectContent>
                                    {patients.map((patient) => (
                                        <SelectItem key={patient.id} value={String(patient.id)}>
                                            {patient.first_name} {patient.last_name} (MRN: {patient.mrn})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={progressNoteForm.title}
                                onChange={(e) => setProgressNoteForm(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="e.g., Follow-up Visit, Initial Consultation"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subjective">Subjective</Label>
                            <Textarea
                                id="subjective"
                                value={progressNoteForm.subjective}
                                onChange={(e) => setProgressNoteForm(prev => ({ ...prev, subjective: e.target.value }))}
                                placeholder="Patient's complaints, symptoms, and history..."
                                rows={3}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="objective">Objective</Label>
                            <Textarea
                                id="objective"
                                value={progressNoteForm.objective}
                                onChange={(e) => setProgressNoteForm(prev => ({ ...prev, objective: e.target.value }))}
                                placeholder="Physical examination findings, vital signs, test results..."
                                rows={3}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="assessment">Assessment</Label>
                            <Textarea
                                id="assessment"
                                value={progressNoteForm.assessment}
                                onChange={(e) => setProgressNoteForm(prev => ({ ...prev, assessment: e.target.value }))}
                                placeholder="Diagnosis, clinical impression..."
                                rows={3}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="plan">Plan</Label>
                            <Textarea
                                id="plan"
                                value={progressNoteForm.plan}
                                onChange={(e) => setProgressNoteForm(prev => ({ ...prev, plan: e.target.value }))}
                                placeholder="Treatment plan, medications, follow-up..."
                                rows={3}
                                required
                            />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                Save Progress Note
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ... (keep existing SOAP Note Modal) */}
            <Dialog open={isModalOpen && activeTab === 'soap'} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>New SOAP Note</DialogTitle>
                        <DialogDescription>Create a new SOAP note for a patient.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveSOAPNote} className="space-y-4">
                        {/* ... (keep existing form fields) */}
                        <div className="space-y-2">
                            <Label htmlFor="patient_id">Patient</Label>
                            <Select
                                value={soapNoteForm.patient_id}
                                onValueChange={(value) => setSoapNoteForm(prev => ({ ...prev, patient_id: value }))}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select patient" />
                                </SelectTrigger>
                                <SelectContent>
                                    {patients.map((patient) => (
                                        <SelectItem key={patient.id} value={String(patient.id)}>
                                            {patient.first_name} {patient.last_name} (MRN: {patient.mrn})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={soapNoteForm.title}
                                onChange={(e) => setSoapNoteForm(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="e.g., Routine Check-up, Emergency Visit"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subjective">S - Subjective</Label>
                            <Textarea
                                id="subjective"
                                value={soapNoteForm.subjective}
                                onChange={(e) => setSoapNoteForm(prev => ({ ...prev, subjective: e.target.value }))}
                                placeholder="Chief complaint, history of present illness..."
                                rows={3}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="objective">O - Objective</Label>
                            <Textarea
                                id="objective"
                                value={soapNoteForm.objective}
                                onChange={(e) => setSoapNoteForm(prev => ({ ...prev, objective: e.target.value }))}
                                placeholder="Vital signs, physical exam, lab results..."
                                rows={3}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="assessment">A - Assessment</Label>
                            <Textarea
                                id="assessment"
                                value={soapNoteForm.assessment}
                                onChange={(e) => setSoapNoteForm(prev => ({ ...prev, assessment: e.target.value }))}
                                placeholder="Diagnosis, differential diagnosis..."
                                rows={3}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="plan">P - Plan</Label>
                            <Textarea
                                id="plan"
                                value={soapNoteForm.plan}
                                onChange={(e) => setSoapNoteForm(prev => ({ ...prev, plan: e.target.value }))}
                                placeholder="Treatment, medications, tests, follow-up..."
                                rows={3}
                                required
                            />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                Save SOAP Note
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Transfer Dialog */}
            <Dialog open={actionType === 'transfer'} onOpenChange={() => closeActionDialog()}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Transfer Patient</DialogTitle>
                        <DialogDescription>
                            Transfer {selectedPatientForAction?.first_name} {selectedPatientForAction?.last_name} to another department
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Department</Label>
                            <Select value={transferDepartment} onValueChange={setTransferDepartment}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select department" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="cardiology">Cardiology</SelectItem>
                                    <SelectItem value="neurology">Neurology</SelectItem>
                                    <SelectItem value="orthopedics">Orthopedics</SelectItem>
                                    <SelectItem value="pediatrics">Pediatrics</SelectItem>
                                    <SelectItem value="oncology">Oncology</SelectItem>
                                    <SelectItem value="emergency">Emergency</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={closeActionDialog}>Cancel</Button>
                        <Button onClick={handleSubmitTransfer} className="bg-orange-600 hover:bg-orange-700 text-white">
                            Submit Transfer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Admit Dialog */}
            <Dialog open={actionType === 'admit'} onOpenChange={() => closeActionDialog()}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Admit Patient</DialogTitle>
                        <DialogDescription>
                            Admit {selectedPatientForAction?.first_name} {selectedPatientForAction?.last_name} to a ward
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Ward</Label>
                            <Select value={admitWard} onValueChange={setAdmitWard}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select ward" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="general_male">General Ward (Male)</SelectItem>
                                    <SelectItem value="general_female">General Ward (Female)</SelectItem>
                                    <SelectItem value="icu">ICU</SelectItem>
                                    <SelectItem value="pediatric">Pediatric Ward</SelectItem>
                                    <SelectItem value="maternity">Maternity Ward</SelectItem>
                                    <SelectItem value="isolation">Isolation Ward</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Reason for Admission</Label>
                            <Textarea
                                placeholder="Enter reason for admission and initial instructions..."
                                value={admitReason}
                                onChange={(e) => setAdmitReason(e.target.value)}
                                rows={4}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={closeActionDialog}>Cancel</Button>
                        <Button onClick={handleSubmitAdmit} className="bg-green-600 hover:bg-green-700 text-white">
                            Submit Admission
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View Record Details Dialog */}
            <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{selectedRecord?.title || 'Medical Record'}</DialogTitle>
                        <DialogDescription>View details of the selected medical record.</DialogDescription>
                    </DialogHeader>
                    {selectedRecord && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-muted-foreground">Patient</Label>
                                    <p className="font-medium">{selectedRecord.patient_name}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Date</Label>
                                    <p className="font-medium">{format(new Date(selectedRecord.record_date), 'PPP')}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Type</Label>
                                    <p className="font-medium capitalize">{selectedRecord.record_type.replace('_', ' ')}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Status</Label>
                                    <div className="mt-1">
                                        <Badge variant="default" className="capitalize">
                                            {selectedRecord.status}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-4 mt-4">
                                <Label className="text-muted-foreground mb-2 block">Content</Label>
                                <div className="bg-muted p-4 rounded-md whitespace-pre-wrap font-mono text-sm">
                                    {selectedRecord.content}
                                </div>
                            </div>

                            <DialogFooter>
                                <Button onClick={() => setIsViewDetailsOpen(false)}>Close</Button>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
