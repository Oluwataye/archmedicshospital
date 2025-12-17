import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ApiService } from '@/services/apiService';
import { toast } from 'sonner';
import { Loader2, User, TestTube, ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SampleCollectionFormProps {
    onSuccess?: () => void;
}

export default function SampleCollectionForm({ onSuccess }: SampleCollectionFormProps) {
    const [loading, setLoading] = useState(false);
    const [patients, setPatients] = useState<any[]>([]);
    const [pendingOrders, setPendingOrders] = useState<any[]>([]);
    const [open, setOpen] = useState(false);

    const [formData, setFormData] = useState({
        patient_id: '',
        test_id: '', // Optional
        sample_type: 'Blood',
        notes: ''
    });

    useEffect(() => {
        loadPatients();
        loadPendingOrders();
    }, []);

    const loadPatients = async () => {
        try {
            const response = await ApiService.getPatients();
            // Handle both array and object with data property
            const patientsData = Array.isArray(response) ? response : (response.data || []);
            setPatients(patientsData);
        } catch (error) {
            console.error('Failed to load patients', error);
            setPatients([]);
        }
    };

    const loadPendingOrders = async () => {
        try {
            const data = await ApiService.getPendingLabOrders();
            setPendingOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Failed to load pending orders', error);
            setPendingOrders([]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.patient_id || !formData.sample_type) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);
            await ApiService.createSample(formData);
            toast.success('Sample collected and barcode generated');
            setFormData({
                patient_id: '',
                test_id: '',
                sample_type: 'Blood',
                notes: ''
            });
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Error creating sample:', error);
            toast.error('Failed to register sample');
        } finally {
            setLoading(false);
        }
    };

    const selectedPatient = patients.find(p => String(p.id) === formData.patient_id);

    return (
        <Card>
            <CardHeader>
                <CardTitle>New Sample Collection</CardTitle>
                <CardDescription>Register a new specimen collection to generate a tracking barcode.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2 flex flex-col">
                        <Label>Patient *</Label>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-full justify-between"
                                >
                                    {selectedPatient
                                        ? `${selectedPatient.first_name} ${selectedPatient.last_name} (${selectedPatient.mrn})`
                                        : "Select patient..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[400px] p-0" align="start">
                                <Command>
                                    <CommandInput placeholder="Search patient by name or MRN..." />
                                    <CommandList>
                                        <CommandEmpty>No patient found.</CommandEmpty>
                                        <CommandGroup>
                                            {patients.map((patient) => (
                                                <CommandItem
                                                    key={patient.id}
                                                    value={`${patient.first_name} ${patient.last_name} ${patient.mrn}`}
                                                    onSelect={() => {
                                                        setFormData(prev => ({ ...prev, patient_id: String(patient.id) }));
                                                        setOpen(false);
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            formData.patient_id === String(patient.id) ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    <div className="flex flex-col">
                                                        <span>{patient.first_name} {patient.last_name}</span>
                                                        <span className="text-xs text-muted-foreground">MRN: {patient.mrn}</span>
                                                    </div>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="space-y-2">
                        <Label>Link to Lab Order (Optional)</Label>
                        <Select
                            value={formData.test_id}
                            onValueChange={(val) => {
                                const order = pendingOrders.find(o => String(o.id) === val);
                                if (order) {
                                    setFormData(prev => ({
                                        ...prev,
                                        test_id: val,
                                        patient_id: String(order.patient_id) // Auto-select patient
                                    }));
                                } else {
                                    setFormData(prev => ({ ...prev, test_id: val }));
                                }
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Pending Order" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                {pendingOrders.map(order => (
                                    <SelectItem key={order.id} value={String(order.id)}>
                                        {order.test_name} - {order.patient_first_name} {order.patient_last_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Sample Type *</Label>
                        <Select
                            value={formData.sample_type}
                            onValueChange={(val) => setFormData(prev => ({ ...prev, sample_type: val }))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Blood">Blood (Whole/Serum/Plasma)</SelectItem>
                                <SelectItem value="Urine">Urine</SelectItem>
                                <SelectItem value="Stool">Stool</SelectItem>
                                <SelectItem value="Sputum">Sputum</SelectItem>
                                <SelectItem value="Swab">Swab (Throat/Nasal/Wound)</SelectItem>
                                <SelectItem value="Tissue">Tissue/Biopsy</SelectItem>
                                <SelectItem value="CSF">CSF</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Notes</Label>
                        <Input
                            value={formData.notes}
                            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                            placeholder="e.g. Fasting sample, urgent..."
                        />
                    </div>

                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <TestTube className="mr-2 h-4 w-4" />}
                        Generate Barcode & Register
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
