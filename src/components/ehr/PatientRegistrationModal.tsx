import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, AlertCircle, User, Users, MapPin } from 'lucide-react';
import { NIGERIAN_STATES, LGA_BY_STATE, RELIGIONS, EMPLOYMENT_STATUS, NOK_RELATIONSHIPS } from '@/constants/nigerianData';

interface PatientRegistrationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (data: any) => void;
    patient?: any;
}

const PatientRegistrationModal: React.FC<PatientRegistrationModalProps> = ({ open, onOpenChange, onSave, patient }) => {
    const [registrationType, setRegistrationType] = useState<'new' | 'existing'>('new');
    const [formData, setFormData] = useState({
        // Basic Information
        name: '',
        dob: '',
        gender: '',
        phone: '',
        email: '',
        address: '',
        insurance: '',
        status: 'Active',
        manual_mrn: '',
        // Demographics
        state_of_origin: '',
        lga: '',
        religion: '',
        tribe: '',
        employment_status: '',
        // Next of Kin
        nok_full_name: '',
        nok_relationship: '',
        nok_phone: '',
        nok_email: '',
        nok_address: ''
    });

    const [availableLGAs, setAvailableLGAs] = useState<string[]>([]);

    useEffect(() => {
        if (open) {
            if (patient) {
                // Editing existing patient
                setRegistrationType('existing');
                setFormData({
                    name: patient.name || `${patient.first_name} ${patient.last_name}` || '',
                    dob: patient.dob ? new Date(patient.dob).toISOString().split('T')[0] : '',
                    gender: patient.gender || '',
                    phone: patient.contact || patient.phone || '',
                    email: patient.email || '',
                    address: patient.address || '',
                    insurance: patient.insurance || '',
                    status: patient.status || 'Active',
                    manual_mrn: patient.mrn || '',
                    // Demographics
                    state_of_origin: patient.state_of_origin || '',
                    lga: patient.lga || '',
                    religion: patient.religion || '',
                    tribe: patient.tribe || '',
                    employment_status: patient.employment_status || '',
                    // Next of Kin
                    nok_full_name: patient.nok_full_name || '',
                    nok_relationship: patient.nok_relationship || '',
                    nok_phone: patient.nok_phone || '',
                    nok_email: patient.nok_email || '',
                    nok_address: patient.nok_address || ''
                });
                // Set available LGAs based on state
                if (patient.state_of_origin && LGA_BY_STATE[patient.state_of_origin]) {
                    setAvailableLGAs(LGA_BY_STATE[patient.state_of_origin]);
                }
            } else {
                // Reset for new registration
                setRegistrationType('new');
                setFormData({
                    name: '',
                    dob: '',
                    gender: '',
                    phone: '',
                    email: '',
                    address: '',
                    insurance: '',
                    status: 'Active',
                    manual_mrn: '',
                    state_of_origin: '',
                    lga: '',
                    religion: '',
                    tribe: '',
                    employment_status: '',
                    nok_full_name: '',
                    nok_relationship: '',
                    nok_phone: '',
                    nok_email: '',
                    nok_address: ''
                });
                setAvailableLGAs([]);
            }
        }
    }, [patient, open]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));

        // Update available LGAs when state changes
        if (name === 'state_of_origin') {
            console.log('State selected:', value);
            const lgas = LGA_BY_STATE[value] || [];
            console.log('Available LGAs:', lgas);
            setAvailableLGAs(lgas);
            // Reset LGA if state changes
            setFormData(prev => ({ ...prev, lga: '' }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate Next of Kin required fields
        if (!formData.nok_full_name || !formData.nok_phone) {
            alert('Next of Kin name and phone number are required');
            return;
        }

        // Prepare payload matching backend expectations
        const names = formData.name.split(' ');
        const first_name = names[0];
        const last_name = names.length > 1 ? names.slice(1).join(' ') : '';

        const payload = {
            first_name,
            last_name,
            date_of_birth: formData.dob,
            gender: formData.gender,
            phone: formData.phone,
            email: formData.email,
            address: formData.address,
            insurance: formData.insurance,
            status: formData.status,
            registration_type: registrationType,
            manual_mrn: formData.manual_mrn,
            // Demographics
            state_of_origin: formData.state_of_origin,
            lga: formData.lga,
            religion: formData.religion,
            tribe: formData.tribe,
            employment_status: formData.employment_status,
            // Next of Kin
            nok_full_name: formData.nok_full_name,
            nok_relationship: formData.nok_relationship,
            nok_phone: formData.nok_phone,
            nok_email: formData.nok_email,
            nok_address: formData.nok_address
        };

        onSave(payload);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{patient ? 'Edit Patient' : 'Register Patient'}</DialogTitle>
                    <div className="sr-only">
                        <DialogDescription>
                            {patient ? 'Form to edit existing patient details.' : 'Form to register a patient.'}
                        </DialogDescription>
                    </div>
                </DialogHeader>

                {!patient && (
                    <div className="mb-4 space-y-3">
                        <Label>Registration Type</Label>
                        <RadioGroup
                            defaultValue="new"
                            value={registrationType}
                            onValueChange={(val) => setRegistrationType(val as 'new' | 'existing')}
                            className="flex flex-col space-y-1"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="new" id="r-new" />
                                <Label htmlFor="r-new">New Patient (System Generated MRN)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="existing" id="r-existing" />
                                <Label htmlFor="r-existing">Existing Patient (Manual MRN)</Label>
                            </div>
                        </RadioGroup>

                        {registrationType === 'new' ? (
                            <Alert variant="default" className="bg-blue-50 border-blue-200">
                                <Info className="h-4 w-4 text-blue-600" />
                                <AlertTitle className="text-blue-800">Registration Fee Required</AlertTitle>
                                <AlertDescription className="text-blue-700">
                                    New patients will be set to <strong>Pending Payment</strong> status. They must pay the registration fee at the Cashier to become Active.
                                </AlertDescription>
                            </Alert>
                        ) : (
                            <Alert variant="default" className="bg-green-50 border-green-200">
                                <AlertCircle className="h-4 w-4 text-green-600" />
                                <AlertTitle className="text-green-800">Immediate Activation</AlertTitle>
                                <AlertDescription className="text-green-700">
                                    Existing patients with a valid MRN will be <strong>Active</strong> immediately. No registration fee required.
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <Tabs defaultValue="basic" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="basic">
                                <User className="h-4 w-4 mr-2" />
                                Basic Info
                            </TabsTrigger>
                            <TabsTrigger value="demographics">
                                <MapPin className="h-4 w-4 mr-2" />
                                Demographics
                            </TabsTrigger>
                            <TabsTrigger value="nok">
                                <Users className="h-4 w-4 mr-2" />
                                Next of Kin
                            </TabsTrigger>
                        </TabsList>

                        {/* Basic Information Tab */}
                        <TabsContent value="basic" className="space-y-4 mt-4">
                            {/* Manual MRN Input for Existing Patients */}
                            {registrationType === 'existing' && !patient && (
                                <div className="space-y-2">
                                    <Label htmlFor="manual_mrn">Existing MRN / Patient ID *</Label>
                                    <Input
                                        id="manual_mrn"
                                        name="manual_mrn"
                                        value={formData.manual_mrn}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter existing manual patient number"
                                        className="border-green-500 focus-visible:ring-green-500"
                                    />
                                    <p className="text-sm text-muted-foreground">This ID will be used to sync with paper records.</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name *</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dob">Date of Birth *</Label>
                                    <Input
                                        id="dob"
                                        name="dob"
                                        type="date"
                                        value={formData.dob}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="gender">Gender *</Label>
                                    <Select
                                        value={formData.gender}
                                        onValueChange={(value) => handleSelectChange('gender', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Male">Male</SelectItem>
                                            <SelectItem value="Female">Female</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(value) => handleSelectChange('status', value)}
                                        disabled
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="Pending Payment">Pending Payment</SelectItem>
                                            <SelectItem value="New">New</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="080XXXXXXXX"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Textarea
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="123 Main St, City"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="insurance">Insurance Provider</Label>
                                <Input
                                    id="insurance"
                                    name="insurance"
                                    value={formData.insurance}
                                    onChange={handleChange}
                                    placeholder="NHIS / HMO Provider"
                                />
                            </div>
                        </TabsContent>

                        {/* Demographics Tab */}
                        <TabsContent value="demographics" className="space-y-4 mt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="state_of_origin">State of Origin</Label>
                                    <Select
                                        value={formData.state_of_origin}
                                        onValueChange={(value) => handleSelectChange('state_of_origin', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select state" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {NIGERIAN_STATES.map((state) => (
                                                <SelectItem key={state.value} value={state.value}>
                                                    {state.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lga">Local Government Area</Label>
                                    <Select
                                        value={formData.lga}
                                        onValueChange={(value) => handleSelectChange('lga', value)}
                                        disabled={!formData.state_of_origin || availableLGAs.length === 0}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={
                                                !formData.state_of_origin
                                                    ? "Select state first"
                                                    : availableLGAs.length === 0
                                                        ? "No LGAs available for this state"
                                                        : "Select LGA"
                                            } />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableLGAs.length > 0 ? (
                                                availableLGAs.map((lga) => (
                                                    <SelectItem key={lga} value={lga}>
                                                        {lga}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem value="none" disabled>No LGAs available</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    {formData.state_of_origin && availableLGAs.length === 0 && (
                                        <p className="text-xs text-muted-foreground">
                                            LGA data not available for {formData.state_of_origin}. You can leave this blank.
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="religion">Religion</Label>
                                    <Select
                                        value={formData.religion}
                                        onValueChange={(value) => handleSelectChange('religion', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select religion" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {RELIGIONS.map((religion) => (
                                                <SelectItem key={religion.value} value={religion.value}>
                                                    {religion.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tribe">Tribe / Ethnicity</Label>
                                    <Input
                                        id="tribe"
                                        name="tribe"
                                        value={formData.tribe}
                                        onChange={handleChange}
                                        placeholder="e.g., Yoruba, Igbo, Hausa"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="employment_status">Employment Status</Label>
                                <Select
                                    value={formData.employment_status}
                                    onValueChange={(value) => handleSelectChange('employment_status', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select employment status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {EMPLOYMENT_STATUS.map((status) => (
                                            <SelectItem key={status.value} value={status.value}>
                                                {status.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </TabsContent>

                        {/* Next of Kin Tab */}
                        <TabsContent value="nok" className="space-y-4 mt-4">
                            <Alert variant="default" className="bg-amber-50 border-amber-200">
                                <Info className="h-4 w-4 text-amber-600" />
                                <AlertTitle className="text-amber-800">Required Information</AlertTitle>
                                <AlertDescription className="text-amber-700">
                                    Next of Kin name and phone number are required for emergency contact purposes.
                                </AlertDescription>
                            </Alert>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nok_full_name">Full Name *</Label>
                                    <Input
                                        id="nok_full_name"
                                        name="nok_full_name"
                                        value={formData.nok_full_name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Jane Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nok_relationship">Relationship *</Label>
                                    <Select
                                        value={formData.nok_relationship}
                                        onValueChange={(value) => handleSelectChange('nok_relationship', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select relationship" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {NOK_RELATIONSHIPS.map((rel) => (
                                                <SelectItem key={rel.value} value={rel.value}>
                                                    {rel.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nok_phone">Phone Number *</Label>
                                    <Input
                                        id="nok_phone"
                                        name="nok_phone"
                                        value={formData.nok_phone}
                                        onChange={handleChange}
                                        required
                                        placeholder="080XXXXXXXX"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nok_email">Email</Label>
                                    <Input
                                        id="nok_email"
                                        name="nok_email"
                                        type="email"
                                        value={formData.nok_email}
                                        onChange={handleChange}
                                        placeholder="jane@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nok_address">Address</Label>
                                <Textarea
                                    id="nok_address"
                                    name="nok_address"
                                    value={formData.nok_address}
                                    onChange={handleChange}
                                    placeholder="Next of Kin's residential address"
                                />
                            </div>
                        </TabsContent>
                    </Tabs>

                    <DialogFooter className="mt-6">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">{patient ? 'Update Patient' : 'Register Patient'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default PatientRegistrationModal;
