import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, User, FileText, Stethoscope } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ApiService } from '@/services/apiService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface Patient {
    id: string;
    first_name: string;
    last_name: string;
    mrn: string;
}

interface Doctor {
    id: string;
    first_name: string;
    last_name: string;
    specialty?: string;
    department?: string;
}

interface SendToDoctorModalProps {
    patient: Patient;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function SendToDoctorModal({ patient, isOpen, onClose, onSuccess }: SendToDoctorModalProps) {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

    const [formData, setFormData] = useState({
        doctor_id: '',
        appointment_date: '',
        appointment_time: '',
        type: 'Consultation',
        symptoms: '',
        notes: ''
    });

    useEffect(() => {
        if (isOpen) {
            loadDoctors();
            // Reset form when modal opens
            setSelectedDate(undefined);
            setFormData({
                doctor_id: '',
                appointment_date: '',
                appointment_time: '',
                type: 'Consultation',
                symptoms: '',
                notes: ''
            });
        }
    }, [isOpen]);

    const loadDoctors = async () => {
        try {
            setLoading(true);
            const response = await ApiService.getDoctors();
            // Handle both array and object with data property
            const doctorsData = Array.isArray(response) ? response : (response.data || []);
            setDoctors(doctorsData);
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

        if (!formData.doctor_id) {
            toast.error('Please select a doctor');
            return;
        }

        if (!formData.appointment_date || !formData.appointment_time) {
            toast.error('Please select date and time');
            return;
        }

        try {
            setSubmitting(true);
            await ApiService.createAppointment({
                patient_id: patient.id,
                doctor_id: formData.doctor_id,
                appointment_date: formData.appointment_date,
                appointment_time: formData.appointment_time,
                type: formData.type,
                symptoms: formData.symptoms,
                notes: formData.notes,
                duration: 30, // Default 30 minutes
                status: 'scheduled'
            });

            toast.success(`Appointment created for ${patient.first_name} ${patient.last_name}`);
            onSuccess();
        } catch (error: any) {
            console.error('Error creating appointment:', error);
            toast.error(error.response?.data?.error || 'Failed to create appointment');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle>Send Patient to Doctor</DialogTitle>
                    <DialogDescription>
                        Create an appointment for {patient.first_name} {patient.last_name} (MRN: {patient.mrn})
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
                                value={formData.doctor_id}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, doctor_id: value }))}
                                required
                            >
                                <SelectTrigger id="doctor">
                                    <SelectValue placeholder="Choose a doctor" />
                                </SelectTrigger>
                                <SelectContent>
                                    {doctors.length === 0 ? (
                                        <div className="p-2 text-sm text-muted-foreground text-center">
                                            No doctors available
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

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="date">Appointment Date *</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !selectedDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={selectedDate}
                                            onSelect={(date) => {
                                                setSelectedDate(date);
                                                if (date) {
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        appointment_date: format(date, 'yyyy-MM-dd')
                                                    }));
                                                }
                                            }}
                                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                            defaultMonth={new Date()}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="time">Appointment Time *</Label>
                                <div className="relative">
                                    <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="time"
                                        type="time"
                                        className="pl-9"
                                        value={formData.appointment_time}
                                        onChange={(e) => setFormData(prev => ({ ...prev, appointment_time: e.target.value }))}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">Appointment Type</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                            >
                                <SelectTrigger id="type">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Consultation">Consultation</SelectItem>
                                    <SelectItem value="Follow-up">Follow-up</SelectItem>
                                    <SelectItem value="Emergency">Emergency</SelectItem>
                                    <SelectItem value="Routine Check">Routine Check</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="symptoms">Symptoms / Chief Complaint</Label>
                            <Textarea
                                id="symptoms"
                                placeholder="Describe the patient's symptoms or reason for visit..."
                                value={formData.symptoms}
                                onChange={(e) => setFormData(prev => ({ ...prev, symptoms: e.target.value }))}
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">Additional Notes</Label>
                            <Textarea
                                id="notes"
                                placeholder="Any additional information for the doctor..."
                                value={formData.notes}
                                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                                rows={2}
                            />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting ? (
                                    <>
                                        <LoadingSpinner className="mr-2 h-4 w-4" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Stethoscope className="mr-2 h-4 w-4" />
                                        Create Appointment
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
