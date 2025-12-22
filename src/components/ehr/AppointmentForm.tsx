import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ApiService } from '@/services/apiService';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface AppointmentFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: any) => Promise<void>;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ open, onOpenChange, onSubmit }) => {
    const [patients, setPatients] = useState<any[]>([]);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        patient_id: '',
        doctor_id: '',
        appointment_date: '',
        appointment_time: '',
        duration: 30,
        type: 'Consultation',
        notes: '',
        symptoms: ''
    });

    useEffect(() => {
        if (open) {
            fetchData();
        }
    }, [open]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [patientsRes, doctorsRes] = await Promise.all([
                ApiService.getPatients(),
                ApiService.getDoctors()
            ]);
            setPatients(patientsRes.data || []);
            setDoctors(doctorsRes.data || doctorsRes || []);
        } catch (error) {
            console.error('Error fetching form data:', error);
            toast.error('Failed to load patients or doctors');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.patient_id || !formData.doctor_id || !formData.appointment_date || !formData.appointment_time) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setSubmitting(true);
            await onSubmit(formData);
            // Reset form on success
            setFormData({
                patient_id: '',
                doctor_id: '',
                appointment_date: '',
                appointment_time: '',
                duration: 30,
                type: 'Consultation',
                notes: '',
                symptoms: ''
            });
        } catch (error) {
            // Error handled by parent/toast
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Schedule New Appointment</DialogTitle>
                </DialogHeader>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-10">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="mt-2 text-sm text-muted-foreground">Loading patient and doctor data...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="patient_id">Patient <span className="text-red-500">*</span></Label>
                                <Select
                                    value={formData.patient_id}
                                    onValueChange={(val) => handleSelectChange('patient_id', val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Patient" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {patients.map(p => (
                                            <SelectItem key={p.id} value={p.id}>
                                                {p.first_name} {p.last_name} ({p.mrn})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="doctor_id">Doctor <span className="text-red-500">*</span></Label>
                                <Select
                                    value={formData.doctor_id}
                                    onValueChange={(val) => handleSelectChange('doctor_id', val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Doctor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.isArray(doctors) && doctors.map(d => (
                                            <SelectItem key={d.id} value={d.id}>
                                                Dr. {d.firstName} {d.lastName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="appointment_date">Date <span className="text-red-500">*</span></Label>
                                <Input
                                    id="appointment_date"
                                    name="appointment_date"
                                    type="date"
                                    required
                                    value={formData.appointment_date}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="appointment_time">Time <span className="text-red-500">*</span></Label>
                                <Input
                                    id="appointment_time"
                                    name="appointment_time"
                                    type="time"
                                    required
                                    value={formData.appointment_time}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="duration">Duration (mins)</Label>
                                <Input
                                    id="duration"
                                    name="duration"
                                    type="number"
                                    value={formData.duration}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(val) => handleSelectChange('type', val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Consultation">Consultation</SelectItem>
                                        <SelectItem value="Follow-up">Follow-up</SelectItem>
                                        <SelectItem value="Surgery">Surgery</SelectItem>
                                        <SelectItem value="Urgent">Urgent</SelectItem>
                                        <SelectItem value="Diagnostic">Diagnostic</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="symptoms">Symptoms</Label>
                                <Textarea
                                    id="symptoms"
                                    name="symptoms"
                                    placeholder="Record patient symptoms"
                                    value={formData.symptoms}
                                    onChange={handleChange}
                                    rows={2}
                                />
                            </div>

                            <div className="space-y-2 col-span-2">
                                <Label htmlFor="notes">Clinical Notes</Label>
                                <Textarea
                                    id="notes"
                                    name="notes"
                                    placeholder="Additional notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows={2}
                                />
                            </div>
                        </div>

                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={submitting}>
                                {submitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Scheduling...
                                    </>
                                ) : 'Schedule Appointment'}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default AppointmentForm;
