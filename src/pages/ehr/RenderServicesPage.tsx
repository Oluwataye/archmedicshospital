
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Trash2, Save } from 'lucide-react';
import { toast } from "sonner";
import ApiService from '@/services/apiService';
import { ServiceSearchCombobox } from '@/components/common/ServiceSearchCombobox';

const RenderServicesPage = () => {
    const [loading, setLoading] = useState(false);
    const [patientSearchQuery, setPatientSearchQuery] = useState('');
    const [patientInfo, setPatientInfo] = useState<{
        id: string; // Display ID (MRN)
        name: string;
        patientId?: string; // DB ID
    }>({ id: '', name: '' });

    const [selectedServices, setSelectedServices] = useState<any[]>([]);
    // If we want to filter services by department, we can add that state. 
    // For now, allow searching all services as per request.

    const handlePatientSearch = async () => {
        if (!patientSearchQuery.trim()) {
            toast.error("Please enter a patient name or MRN");
            return;
        }

        try {
            setLoading(true);
            const response = await ApiService.getPatients({ search: patientSearchQuery.trim() });
            const patients = Array.isArray(response) ? response : (response.data || []);

            if (patients.length === 0) {
                toast.error("No patient found");
                return;
            }

            // Default to first match for simplicity, or ideally show a list
            const patient = patients[0];
            setPatientInfo({
                id: patient.mrn,
                name: `${patient.first_name} ${patient.last_name}`,
                patientId: patient.id
            });
            setPatientSearchQuery('');
            toast.success(`Selected patient: ${patient.first_name} ${patient.last_name}`);
        } catch (error) {
            console.error(error);
            toast.error("Error searching for patient");
        } finally {
            setLoading(false);
        }
    };

    const handleAddService = (service: any) => {
        // Prevent duplicates if needed, or allow quantities
        const newItem = {
            id: `SVC-${Date.now()}`, // Temporary ID
            service_id: service.id,
            name: service.name,
            price: service.price || service.base_price || 0,
            type: service.category || 'Service'
        };
        setSelectedServices([...selectedServices, newItem]);
        toast.success(`${service.name} added`);
    };

    const handleRemoveService = (id: string) => {
        setSelectedServices(selectedServices.filter(s => s.id !== id));
    };

    const handleRenderServices = async () => {
        if (!patientInfo.patientId) {
            toast.error("Please select a patient first");
            return;
        }
        if (selectedServices.length === 0) {
            toast.error("Please add services to render");
            return;
        }

        try {
            setLoading(true);
            const totalAmount = selectedServices.reduce((sum, s) => sum + s.price, 0);

            // Create an invoice with status 'pending' so Cashier can see it
            // Or 'ordered' if that status exists. 'pending' is standard for "Ready to pay".
            const invoiceData = {
                patient_id: patientInfo.patientId,
                total_amount: totalAmount,
                discount_amount: 0,
                net_amount: totalAmount,
                status: 'pending',
                items: selectedServices.map(s => ({
                    description: s.name,
                    unit_price: s.price,
                    total_price: s.price,
                    quantity: 1,
                    service_type: s.type,
                    service_id: s.service_id
                }))
            };

            await ApiService.createInvoice(invoiceData);

            toast.success("Services rendered successfully", {
                description: "Please direct the patient to the Cashier for payment.",
                duration: 5000,
            });
            setSelectedServices([]);
            setPatientInfo({ id: '', name: '' });
        } catch (error) {
            console.error("Error rendering services", error);
            toast.error("Failed to render services");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Render Services</h1>
                    <p className="text-muted-foreground mt-1">Order and record services for patients</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Patient Search Section */}
                <Card className="md:col-span-1 h-fit">
                    <CardHeader>
                        <CardTitle>Patient Selection</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col space-y-2">
                            <label className="text-sm font-medium">Search Patient (Name/MRN)</label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Enter hospital number..."
                                    value={patientSearchQuery}
                                    onChange={(e) => setPatientSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handlePatientSearch()}
                                />
                                <Button onClick={handlePatientSearch} disabled={loading} size="icon">
                                    <Search className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {patientInfo.patientId && (
                            <div className="p-4 bg-primary/10 rounded-md border border-primary/20">
                                <h3 className="font-bold text-primary">{patientInfo.name}</h3>
                                <p className="text-sm text-muted-foreground">{patientInfo.id}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Service Selection Section */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Service Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Service Search Input */}
                        <div className="flex flex-col space-y-2">
                            <label className="text-sm font-medium">Add Service</label>
                            <div className="flex gap-4 items-center">
                                <div className="flex-1">
                                    <ServiceSearchCombobox
                                        onSelect={handleAddService}
                                        className="w-full"
                                        placeholder="Type at least 3 letters to search services..."
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Search by service name. Results appear after typing 3 characters.
                            </p>
                        </div>

                        {/* Selected Services Table */}
                        <div className="border rounded-md overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-muted">
                                    <tr>
                                        <th className="p-3">Service Name</th>
                                        <th className="p-3">Category</th>
                                        <th className="p-3 text-right">Price</th>
                                        <th className="p-3 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {selectedServices.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="p-6 text-center text-muted-foreground">
                                                No services added. Start searching above.
                                            </td>
                                        </tr>
                                    ) : (
                                        selectedServices.map((service) => (
                                            <tr key={service.id}>
                                                <td className="p-3 font-medium">{service.name}</td>
                                                <td className="p-3 text-muted-foreground">{service.type}</td>
                                                <td className="p-3 text-right">₦{service.price.toLocaleString()}</td>
                                                <td className="p-3 text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        onClick={() => handleRemoveService(service.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                                {selectedServices.length > 0 && (
                                    <tfoot className="bg-muted/50 font-bold">
                                        <tr>
                                            <td colSpan={2} className="p-3 text-right">Total:</td>
                                            <td className="p-3 text-right">
                                                ₦{selectedServices.reduce((acc, s) => acc + s.price, 0).toLocaleString()}
                                            </td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                )}
                            </table>
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button
                                size="lg"
                                className="w-full md:w-auto gap-2"
                                onClick={handleRenderServices}
                                disabled={loading || !patientInfo.patientId || selectedServices.length === 0}
                            >
                                <Save className="h-4 w-4" />
                                Render Services
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default RenderServicesPage;
