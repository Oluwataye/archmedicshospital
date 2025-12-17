import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';
import { ApiService } from '@/services/apiService';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

interface Prescription {
    id: string;
    patient_id: string;
    patient_name: string;
    prescription_date: string;
    medications: string;
    status: string;
    notes: string;
}

interface Patient {
    id: string;
    first_name: string;
    last_name: string;
    mrn: string;
}

export default function DoctorPrescriptionsPage() {
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPrescription, setSelectedPrescription] = useState<Prescription | undefined>(undefined);
    const [formData, setFormData] = useState({
        patient_id: '',
        medications: '',
        notes: ''
    });

    useEffect(() => {
        loadPrescriptions();
        loadPatients();
    }, []);

    const loadPrescriptions = async () => {
        try {
            setLoading(true);
            const data = await ApiService.getPrescriptions();
            setPrescriptions(data);
        } catch (error) {
            console.error('Error loading prescriptions:', error);
            toast.error('Failed to load prescriptions');
        } finally {
            setLoading(false);
        }
    };

    const loadPatients = async () => {
        try {
            const data = await ApiService.getPatients();
            if (Array.isArray(data)) {
                setPatients(data);
            } else if (data && Array.isArray(data.data)) {
                setPatients(data.data);
            } else {
                console.error('Invalid patients data format:', data);
                setPatients([]);
            }
        } catch (error) {
            console.error('Error loading patients:', error);
            setPatients([]);
        }
    };

    const handleCreate = () => {
        setSelectedPrescription(undefined);
        setFormData({
            patient_id: '',
            medications: '',
            notes: ''
        });
        setIsModalOpen(true);
    };

    const handleEdit = (prescription: Prescription) => {
        setSelectedPrescription(prescription);
        setFormData({
            patient_id: prescription.patient_id,
            medications: prescription.medications,
            notes: prescription.notes
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (prescription: Prescription) => {
        if (!window.confirm('Are you sure you want to cancel this prescription?')) return;

        try {
            await ApiService.cancelPrescription(prescription.id);
            toast.success('Prescription cancelled successfully');
            loadPrescriptions();
        } catch (error) {
            console.error('Error cancelling prescription:', error);
            toast.error('Failed to cancel prescription');
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Check for HMO authorization
            const patient = patients.find(p => String(p.id) === formData.patient_id);
            // Note: Patient interface in this file is local and might need update or casting
            if ((patient as any)?.hmo_provider_id) {
                const authCheck = await import('@/services/preauthService').then(m => m.default.checkActiveAuthorization(String(patient.id)));
                if (!authCheck.has_active_authorization) {
                    toast.error('Patient requires a valid HMO authorization to access services');
                    return;
                }
            }

            const prescriptionData = {
                ...formData,
                prescription_date: new Date().toISOString().split('T')[0],
                status: 'active'
            };

            if (selectedPrescription) {
                await ApiService.updatePrescription(selectedPrescription.id, prescriptionData);
                toast.success('Prescription updated successfully');
            } else {
                await ApiService.createPrescription(prescriptionData);
                toast.success('Prescription created successfully', {
                    description: "Please direct the patient to the Cashier for payment.",
                    duration: 5000,
                });
            }
            loadPrescriptions();
            setIsModalOpen(false);
        } catch (error: any) {
            console.error('Error saving prescription:', error);
            toast.error(error.response?.data?.error || 'Failed to save prescription');
        }
    };

    const filteredPrescriptions = prescriptions.filter(prescription =>
        prescription.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prescription.medications?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Prescriptions</h1>
                    <p className="text-muted-foreground mt-1">Manage patient prescriptions and medications</p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Prescription
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="p-4 border-b flex items-center gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search prescriptions..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Patient</TableHead>
                                <TableHead>Medications</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPrescriptions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                        No prescriptions found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredPrescriptions.map((prescription) => (
                                    <TableRow key={prescription.id}>
                                        <TableCell className="whitespace-nowrap">
                                            {format(new Date(prescription.prescription_date), 'MMM d, yyyy')}
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{prescription.patient_name}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="max-w-md truncate">{prescription.medications}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={prescription.status === 'active' ? 'default' : 'secondary'}>
                                                {prescription.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    title="Edit"
                                                    onClick={() => handleEdit(prescription)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    title="Cancel"
                                                    onClick={() => handleDelete(prescription)}
                                                    className="text-destructive hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
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

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{selectedPrescription ? 'Edit Prescription' : 'New Prescription'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="patient_id">Patient</Label>
                            <Select
                                value={formData.patient_id}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, patient_id: value }))}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select patient" />
                                </SelectTrigger>
                                <SelectContent>
                                    {patients.map((patient) => (
                                        <SelectItem key={patient.id} value={patient.id}>
                                            {patient.first_name} {patient.last_name} (MRN: {patient.mrn})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="medications">Medications</Label>
                            <Textarea
                                id="medications"
                                value={formData.medications}
                                onChange={(e) => setFormData(prev => ({ ...prev, medications: e.target.value }))}
                                placeholder="Enter medication details (name, dosage, frequency, duration)..."
                                rows={5}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                value={formData.notes}
                                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                                placeholder="Additional notes or instructions..."
                                rows={3}
                            />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                Save Prescription
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
