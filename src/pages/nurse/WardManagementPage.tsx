import React, { useState, useEffect } from 'react';
import { Bed, Users, Activity, LogOut, Plus, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { ApiService } from '@/services/apiService';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Ward {
    id: string;
    name: string;
    type: string;
    capacity: number;
    gender: string;
    total_beds: number;
    occupied_beds: number;
}

interface Bed {
    id: string;
    bed_number: string;
    type: string;
    status: string;
    is_occupied: boolean;
    admission?: {
        id: string;
        patient_id: string;
        first_name: string;
        last_name: string;
        mrn: string;
        diagnosis: string;
        admission_date: string;
    };
}

interface Patient {
    id: string;
    first_name: string;
    last_name: string;
    mrn: string;
}

export default function WardManagementPage() {
    const [wards, setWards] = useState<Ward[]>([]);
    const [selectedWard, setSelectedWard] = useState<Ward | null>(null);
    const [beds, setBeds] = useState<Bed[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'list' | 'details'>('list');

    // Modals
    const [isAdmitModalOpen, setIsAdmitModalOpen] = useState(false);
    const [isDischargeModalOpen, setIsDischargeModalOpen] = useState(false);
    const [selectedBed, setSelectedBed] = useState<Bed | null>(null);

    // Forms
    const [admitForm, setAdmitForm] = useState({
        patient_id: '',
        reason: '',
        diagnosis: '',
        notes: ''
    });

    const [dischargeForm, setDischargeForm] = useState({
        notes: '',
        discharge_type: 'Discharged'
    });

    useEffect(() => {
        loadWards();
        loadPatients();
    }, []);

    const loadWards = async () => {
        try {
            setLoading(true);
            const data = await ApiService.getWards();
            setWards(data);
        } catch (error) {
            console.error('Error loading wards:', error);
            toast.error('Failed to load wards');
        } finally {
            setLoading(false);
        }
    };

    const loadWardDetails = async (wardId: string) => {
        try {
            setLoading(true);
            const data = await ApiService.getWard(wardId);
            setSelectedWard(data);
            setBeds(data.beds);
            setViewMode('details');
        } catch (error) {
            console.error('Error loading ward details:', error);
            toast.error('Failed to load ward details');
        } finally {
            setLoading(false);
        }
    };

    const loadPatients = async () => {
        try {
            const data = await ApiService.getPatients();
            // Ensure data is an array
            setPatients(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error loading patients:', error);
            setPatients([]); // Set to empty array on error
        }
    };

    const handleAdmitClick = (bed: Bed) => {
        setSelectedBed(bed);
        setAdmitForm({
            patient_id: '',
            reason: '',
            diagnosis: '',
            notes: ''
        });
        setIsAdmitModalOpen(true);
    };

    const handleDischargeClick = (bed: Bed) => {
        setSelectedBed(bed);
        setDischargeForm({
            notes: '',
            discharge_type: 'Discharged'
        });
        setIsDischargeModalOpen(true);
    };

    const handleAdmitSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBed || !selectedWard) return;

        try {
            await ApiService.admitPatient({
                ...admitForm,
                ward_id: selectedWard.id,
                bed_id: selectedBed.id
            });
            toast.success('Patient admitted successfully');
            setIsAdmitModalOpen(false);
            loadWardDetails(selectedWard.id);
            loadWards(); // Refresh summary
        } catch (error: any) {
            console.error('Error admitting patient:', error);
            toast.error(error.response?.data?.error || 'Failed to admit patient');
        }
    };

    const handleDischargeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBed || !selectedBed.admission) return;

        try {
            await ApiService.dischargePatient(selectedBed.admission.id, dischargeForm);
            toast.success('Patient discharged successfully');
            setIsDischargeModalOpen(false);
            loadWardDetails(selectedWard!.id);
            loadWards(); // Refresh summary
        } catch (error: any) {
            console.error('Error discharging patient:', error);
            toast.error(error.response?.data?.error || 'Failed to discharge patient');
        }
    };

    const handleStatusUpdate = async (bed: Bed, status: string) => {
        try {
            await ApiService.updateBedStatus(bed.id, status);
            toast.success(`Bed status updated to ${status}`);
            loadWardDetails(selectedWard!.id);
        } catch (error) {
            console.error('Error updating bed status:', error);
            toast.error('Failed to update bed status');
        }
    };

    const getBedStatusColor = (status: string) => {
        switch (status) {
            case 'Available': return 'bg-green-100 text-green-800 border-green-200';
            case 'Occupied': return 'bg-red-100 text-red-800 border-red-200';
            case 'Cleaning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Maintenance': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading && !selectedWard) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Ward Management</h1>
                    <p className="text-muted-foreground mt-1">Manage wards, beds, and patient admissions</p>
                </div>
                {viewMode === 'details' && (
                    <Button variant="outline" onClick={() => setViewMode('list')}>
                        Back to Wards List
                    </Button>
                )}
            </div>

            {viewMode === 'list' ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {wards.map((ward) => {
                        const isFull = ward.occupied_beds >= ward.capacity;
                        const accentClass = isFull ? 'card-accent-red' : 'card-accent-blue';

                        return (
                            <Card
                                key={ward.id}
                                className={`hover:shadow-lg transition-all hover:scale-105 cursor-pointer ${accentClass}`}
                                onClick={() => loadWardDetails(ward.id)}
                            >
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isFull ? 'bg-red-100' : 'bg-blue-100'}`}>
                                            <Bed className={`h-5 w-5 ${isFull ? 'text-red-600' : 'text-blue-600'}`} />
                                        </div>
                                        <CardTitle className="text-xl font-bold">{ward.name}</CardTitle>
                                    </div>
                                    <Badge variant={isFull ? "destructive" : "outline"}>{ward.type}</Badge>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4 mt-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Capacity:</span>
                                            <span className="font-medium">{ward.capacity} Beds</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Occupancy:</span>
                                            <span className={`font-medium ${isFull ? 'text-red-600' : 'text-green-600'}`}>
                                                {ward.occupied_beds} / {ward.total_beds}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Gender:</span>
                                            <span className="font-medium">{ward.gender}</span>
                                        </div>
                                        <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${isFull ? 'bg-red-500' : 'bg-green-500'}`}
                                                style={{ width: `${(ward.occupied_beds / Math.max(ward.total_beds, 1)) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>{selectedWard?.name}</CardTitle>
                                    <p className="text-muted-foreground">{selectedWard?.type} Ward • {selectedWard?.gender}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Badge variant="outline" className="text-lg px-3 py-1">
                                        Occupancy: {beds.filter(b => b.is_occupied).length} / {beds.length}
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                                {beds.map((bed) => (
                                    <div
                                        key={bed.id}
                                        className={`p-4 rounded-lg border-2 ${getBedStatusColor(bed.status)} flex flex-col justify-between min-h-[160px] relative group`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <span className="font-bold text-lg">{bed.bed_number}</span>
                                            <Badge variant="secondary" className="text-xs">{bed.type}</Badge>
                                        </div>

                                        {bed.is_occupied && bed.admission ? (
                                            <div className="mt-2 text-sm">
                                                <p className="font-bold truncate">{bed.admission.first_name} {bed.admission.last_name}</p>
                                                <p className="text-xs opacity-80">MRN: {bed.admission.mrn}</p>
                                                <p className="text-xs opacity-80 mt-1 truncate">{bed.admission.diagnosis}</p>
                                            </div>
                                        ) : (
                                            <div className="mt-2 text-sm opacity-60">
                                                <p>{bed.status}</p>
                                            </div>
                                        )}

                                        <div className="mt-4 pt-2 border-t border-black/10 flex justify-end gap-2">
                                            {bed.status === 'Available' && (
                                                <Button size="sm" variant="secondary" className="w-full h-8" onClick={(e) => { e.stopPropagation(); handleAdmitClick(bed); }}>
                                                    Admit
                                                </Button>
                                            )}
                                            {bed.status === 'Occupied' && (
                                                <Button size="sm" variant="destructive" className="w-full h-8" onClick={(e) => { e.stopPropagation(); handleDischargeClick(bed); }}>
                                                    Discharge
                                                </Button>
                                            )}
                                            {bed.status === 'Cleaning' && (
                                                <Button size="sm" variant="outline" className="w-full h-8 bg-white" onClick={(e) => { e.stopPropagation(); handleStatusUpdate(bed, 'Available'); }}>
                                                    Mark Clean
                                                </Button>
                                            )}
                                            {bed.status === 'Maintenance' && (
                                                <Button size="sm" variant="outline" className="w-full h-8 bg-white" onClick={(e) => { e.stopPropagation(); handleStatusUpdate(bed, 'Available'); }}>
                                                    Ready
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Admit Patient Modal */}
            <Dialog open={isAdmitModalOpen} onOpenChange={setIsAdmitModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Admit Patient to Bed {selectedBed?.bed_number}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAdmitSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="patient_id">Patient</Label>
                            <Select
                                value={admitForm.patient_id}
                                onValueChange={(value) => setAdmitForm(prev => ({ ...prev, patient_id: value }))}
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
                            <Label htmlFor="reason">Reason for Admission</Label>
                            <Input
                                id="reason"
                                value={admitForm.reason}
                                onChange={(e) => setAdmitForm(prev => ({ ...prev, reason: e.target.value }))}
                                placeholder="e.g., Surgery recovery, Observation"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="diagnosis">Diagnosis</Label>
                            <Input
                                id="diagnosis"
                                value={admitForm.diagnosis}
                                onChange={(e) => setAdmitForm(prev => ({ ...prev, diagnosis: e.target.value }))}
                                placeholder="Primary diagnosis"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                value={admitForm.notes}
                                onChange={(e) => setAdmitForm(prev => ({ ...prev, notes: e.target.value }))}
                                placeholder="Additional notes..."
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsAdmitModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                Admit Patient
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Discharge Patient Modal */}
            <Dialog open={isDischargeModalOpen} onOpenChange={setIsDischargeModalOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Discharge Patient</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleDischargeSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="discharge_type">Discharge Type</Label>
                            <Select
                                value={dischargeForm.discharge_type}
                                onValueChange={(value) => setDischargeForm(prev => ({ ...prev, discharge_type: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Discharged">Regular Discharge</SelectItem>
                                    <SelectItem value="Transferred">Transferred</SelectItem>
                                    <SelectItem value="Deceased">Deceased</SelectItem>
                                    <SelectItem value="AMA">Against Medical Advice</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="discharge_notes">Discharge Notes</Label>
                            <Textarea
                                id="discharge_notes"
                                value={dischargeForm.notes}
                                onChange={(e) => setDischargeForm(prev => ({ ...prev, notes: e.target.value }))}
                                placeholder="Instructions, summary, follow-up..."
                                required
                                rows={4}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDischargeModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="destructive">
                                Discharge
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
