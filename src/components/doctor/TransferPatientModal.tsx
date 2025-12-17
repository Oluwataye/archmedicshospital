
import React, { useState, useEffect } from 'react';
import { User, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { ApiService } from '@/services/apiService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface TransferPatientModalProps {
    appointmentId: string;
    currentDoctorId?: string;
    patientName: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface Doctor {
    id: string;
    first_name: string;
    last_name: string;
    specialty?: string;
}

export default function TransferPatientModal({
    appointmentId,
    currentDoctorId,
    patientName,
    isOpen,
    onClose,
    onSuccess
}: TransferPatientModalProps) {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [targetDoctorId, setTargetDoctorId] = useState('');
    const [reason, setReason] = useState('');

    useEffect(() => {
        if (isOpen) {
            loadDoctors();
            setTargetDoctorId('');
            setReason('');
        }
    }, [isOpen]);

    const loadDoctors = async () => {
        try {
            setLoading(true);
            const response = await ApiService.getDoctors();
            // Handle both array and object with data property
            const doctorsData = Array.isArray(response) ? response : (response.data || []);
            // Filter out current doctor
            setDoctors(doctorsData.filter((d: Doctor) => d.id !== currentDoctorId));
        } catch (error) {
            console.error('Error loading doctors:', error);
            toast.error('Failed to load doctors');
            setDoctors([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!targetDoctorId) {
            toast.error('Please select a doctor to transfer to');
            return;
        }

        try {
            setSubmitting(true);
            await ApiService.updateAppointment(appointmentId, {
                doctor_id: targetDoctorId,
                notes: reason ? `Transferred: ${reason}` : 'Transferred to another doctor'
            });

            toast.success(`Patient ${patientName} transferred successfully`);
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Error transferring patient:', error);
            toast.error(error.response?.data?.error || 'Failed to transfer patient');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Transfer Patient</DialogTitle>
                    <DialogDescription>
                        Transfer {patientName} to another doctor.
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="doctor">Select Doctor *</Label>
                            <Select
                                value={targetDoctorId}
                                onValueChange={setTargetDoctorId}
                                required
                            >
                                <SelectTrigger id="doctor">
                                    <SelectValue placeholder="Choose a doctor" />
                                </SelectTrigger>
                                <SelectContent>
                                    {doctors.length === 0 ? (
                                        <div className="p-2 text-sm text-muted-foreground text-center">
                                            No other doctors available
                                        </div>
                                    ) : (
                                        doctors.map((doctor) => (
                                            <SelectItem key={doctor.id} value={doctor.id}>
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4" />
                                                    <span>
                                                        Dr. {doctor.first_name} {doctor.last_name}
                                                        {doctor.specialty && ` - ${doctor.specialty}`}
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reason">Reason for Transfer</Label>
                            <Textarea
                                id="reason"
                                placeholder="Why is the patient being transferred?"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                rows={3}
                            />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting ? (
                                    <>
                                        <LoadingSpinner className="mr-2 h-4 w-4 animate-spin" />
                                        Transferring...
                                    </>
                                ) : (
                                    <>
                                        <ArrowRight className="mr-2 h-4 w-4" />
                                        Transfer Patient
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
