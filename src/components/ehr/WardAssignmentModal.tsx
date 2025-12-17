import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ApiService } from '@/services/apiService';
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface WardAssignmentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    patientId: string;
    patientName: string;
}

interface Ward {
    id: string;
    name: string;
    type: string;
    capacity: number;
    occupied_beds: number;
}

interface Bed {
    id: string;
    bed_number: string;
    status: string;
    is_occupied: boolean;
}

const WardAssignmentModal: React.FC<WardAssignmentModalProps> = ({
    open,
    onOpenChange,
    patientId,
    patientName
}) => {
    const [wards, setWards] = useState<Ward[]>([]);
    const [beds, setBeds] = useState<Bed[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [selectedWard, setSelectedWard] = useState('');
    const [selectedBed, setSelectedBed] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [reason, setReason] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (open) {
            fetchWards();
        }
    }, [open]);

    useEffect(() => {
        if (selectedWard) {
            fetchBeds(selectedWard);
        } else {
            setBeds([]);
        }
    }, [selectedWard]);

    const fetchWards = async () => {
        try {
            setLoading(true);
            const data = await ApiService.getWards();
            setWards(data);
        } catch (error) {
            console.error('Error fetching wards:', error);
            toast.error('Failed to load wards');
        } finally {
            setLoading(false);
        }
    };

    const fetchBeds = async (wardId: string) => {
        try {
            const data = await ApiService.getWard(wardId);
            setBeds(data.beds || []);
        } catch (error) {
            console.error('Error fetching beds:', error);
            toast.error('Failed to load beds');
        }
    };

    const handleSubmit = async () => {
        if (!selectedWard || !selectedBed || !diagnosis) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setSubmitting(true);
            await ApiService.admitPatient({
                patient_id: patientId,
                ward_id: selectedWard,
                bed_id: selectedBed,
                diagnosis,
                reason,
                notes
            });
            toast.success('Patient admitted successfully');
            onOpenChange(false);
            // Reset form
            setSelectedWard('');
            setSelectedBed('');
            setDiagnosis('');
            setReason('');
            setNotes('');
        } catch (error) {
            console.error('Error admitting patient:', error);
            toast.error('Failed to admit patient');
        } finally {
            setSubmitting(false);
        }
    };

    const availableBeds = beds.filter(bed => !bed.is_occupied && bed.status === 'Available');

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Admit Patient - {patientName}</DialogTitle>
                    <div className="sr-only">
                        <DialogDescription>
                            Form to admit patient {patientName} to a ward.
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Ward *</Label>
                        <Select value={selectedWard} onValueChange={setSelectedWard}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Ward" />
                            </SelectTrigger>
                            <SelectContent>
                                {wards.map(ward => (
                                    <SelectItem key={ward.id} value={ward.id}>
                                        {ward.name} ({ward.type}) - {ward.capacity - (ward.occupied_beds || 0)} beds free
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Bed *</Label>
                        <Select value={selectedBed} onValueChange={setSelectedBed} disabled={!selectedWard}>
                            <SelectTrigger>
                                <SelectValue placeholder={selectedWard ? "Select Bed" : "Select Ward first"} />
                            </SelectTrigger>
                            <SelectContent>
                                {availableBeds.length === 0 ? (
                                    <SelectItem value="none" disabled>No available beds</SelectItem>
                                ) : (
                                    availableBeds.map(bed => (
                                        <SelectItem key={bed.id} value={bed.id}>
                                            Bed {bed.bed_number}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Primary Diagnosis *</Label>
                        <Input
                            value={diagnosis}
                            onChange={(e) => setDiagnosis(e.target.value)}
                            placeholder="e.g. Acute Appendicitis"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Reason for Admission</Label>
                        <Input
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="e.g. Surgery required"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Notes</Label>
                        <Textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Additional instructions..."
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={submitting}>
                        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Admit Patient
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default WardAssignmentModal;
