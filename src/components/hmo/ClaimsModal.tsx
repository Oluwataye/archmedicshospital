import React, { useState, useEffect, useMemo } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ApiService from '@/services/apiService';
import hmoService from '@/services/hmoService';
import claimsService from '@/services/claimsService';
import { CreateHMOClaimDTO, CreateHMOClaimItemDTO } from '@/types/hmo';
import { ServiceSearchCombobox } from '@/components/common/ServiceSearchCombobox';
import PatientSearchSelect from '@/components/common/PatientSearchSelect';
import { Service } from '@/types/service';
import { Patient } from '@/types/patient';

interface ClaimsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ClaimsModal({ isOpen, onClose, onSuccess }: ClaimsModalProps) {
    const [loading, setLoading] = useState(false);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [hmoProviders, setHMOProviders] = useState<any[]>([]);
    const [serviceCodes, setServiceCodes] = useState<any[]>([]);
    const [claimItems, setClaimItems] = useState<CreateHMOClaimItemDTO[]>([]);
    const [formData, setFormData] = useState({
        patient_id: '',
        hmo_provider_id: '',
        claim_date: new Date().toISOString().split('T')[0],
        service_date: new Date().toISOString().split('T')[0],
        copay_amount: 0
    });

    useEffect(() => {
        if (isOpen) {
            loadData();
        }
    }, [isOpen]);

    const loadData = async () => {
        try {
            const [patientsData, hmoData] = await Promise.all([
                ApiService.getPatients(),
                hmoService.getHMOProviders()
            ]);
            const pData = Array.isArray(patientsData) ? patientsData : patientsData.data || [];
            setPatients(pData);
            setHMOProviders(hmoData);

            // Fetch service codes from NHIS API
            const token = localStorage.getItem('authToken');
            const response = await fetch('/api/nhis/service-codes', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const servicesData = await response.json();
                setServiceCodes(servicesData);
            }
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    // Map service codes to Service type for the combobox
    const mappedServices = useMemo(() => {
        return serviceCodes.map(s => ({
            id: s.id,
            name: s.description,
            code: s.code,
            price: 0 // Default price as fetch doesn't include it or it varies
        } as Service));
    }, [serviceCodes]);

    const addClaimItem = () => {
        setClaimItems([...claimItems, {
            service_code_id: '',
            quantity: 1,
            unit_price: 0,
            total_price: 0,
            diagnosis_code: '',
            provider_id: ''
        }]);
    };

    const removeClaimItem = (index: number) => {
        setClaimItems(claimItems.filter((_, i) => i !== index));
    };

    const updateClaimItem = (index: number, field: string, value: any) => {
        const updated = [...claimItems];
        updated[index] = { ...updated[index], [field]: value };

        // Auto-calculate total_price
        if (field === 'quantity' || field === 'unit_price') {
            updated[index].total_price = updated[index].quantity * updated[index].unit_price;
        }

        setClaimItems(updated);
    };

    const handleServiceSelect = (index: number, service: Service | null) => {
        if (service) {
            updateClaimItem(index, 'service_code_id', String(service.id));
            // Optional: If service had a price, we could auto-fill it
        } else {
            updateClaimItem(index, 'service_code_id', '');
        }
    };

    const calculateTotals = () => {
        const total_amount = claimItems.reduce((sum, item) => sum + item.total_price, 0);
        const claim_amount = total_amount - formData.copay_amount;
        return { total_amount, claim_amount };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.patient_id || !formData.hmo_provider_id) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (claimItems.length === 0) {
            toast.error('Please add at least one claim item');
            return;
        }

        try {
            setLoading(true);
            const { total_amount, claim_amount } = calculateTotals();

            const claimData: CreateHMOClaimDTO = {
                patient_id: formData.patient_id,
                hmo_provider_id: formData.hmo_provider_id,
                claim_date: formData.claim_date,
                service_date: formData.service_date,
                total_amount,
                copay_amount: formData.copay_amount,
                claim_amount,
                items: claimItems
            };

            await claimsService.createClaim(claimData);
            toast.success('Claim created successfully');
            onSuccess();
            onClose();
            resetForm();
        } catch (error: any) {
            console.error('Error creating claim:', error);
            toast.error(error.response?.data?.error || 'Failed to create claim');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            patient_id: '',
            hmo_provider_id: '',
            claim_date: new Date().toISOString().split('T')[0],
            service_date: new Date().toISOString().split('T')[0],
            copay_amount: 0
        });
        setClaimItems([]);
    };

    const handlePatientSelect = (patientId: string) => {
        setFormData(prev => ({ ...prev, patient_id: patientId }));
    };

    if (!isOpen) return null;

    const { total_amount, claim_amount } = calculateTotals();

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-bold">New HMO Claim</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Patient Selection */}
                        <div className="col-span-2 space-y-2">
                            <label className="block text-sm font-medium mb-1">Patient *</label>
                            <PatientSearchSelect
                                patients={patients}
                                selectedPatientId={formData.patient_id}
                                onSelectPatient={handlePatientSelect}
                            />
                        </div>

                        {/* HMO Provider */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium mb-1">HMO Provider *</label>
                            <select
                                value={formData.hmo_provider_id}
                                onChange={(e) => setFormData({ ...formData, hmo_provider_id: e.target.value })}
                                className="w-full border rounded-md px-3 py-2"
                                required
                            >
                                <option value="">Select HMO Provider</option>
                                {hmoProviders.map((provider) => (
                                    <option key={provider.id} value={provider.id}>
                                        {provider.name} ({provider.code})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Claim Date */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Claim Date *</label>
                            <Input
                                type="date"
                                value={formData.claim_date}
                                onChange={(e) => setFormData({ ...formData, claim_date: e.target.value })}
                                required
                            />
                        </div>

                        {/* Service Date */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Service Date *</label>
                            <Input
                                type="date"
                                value={formData.service_date}
                                onChange={(e) => setFormData({ ...formData, service_date: e.target.value })}
                                required
                            />
                        </div>

                        {/* Copay Amount */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium mb-1">Copay Amount</label>
                            <Input
                                type="number"
                                step="0.01"
                                value={formData.copay_amount}
                                onChange={(e) => setFormData({ ...formData, copay_amount: parseFloat(e.target.value) || 0 })}
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    {/* Claim Items */}
                    <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-semibold">Claim Items</h3>
                            <Button type="button" onClick={addClaimItem} size="sm">
                                <Plus className="h-4 w-4 mr-1" />
                                Add Item
                            </Button>
                        </div>

                        {claimItems.map((item, index) => {
                            const selectedService = mappedServices.find(s => String(s.id) === item.service_code_id) || null;
                            return (
                                <div key={index} className="grid grid-cols-12 gap-2 mb-2 p-3 bg-gray-50 rounded items-start">
                                    <div className="col-span-5">
                                        <ServiceSearchCombobox
                                            value={selectedService}
                                            onSelect={(service) => handleServiceSelect(index, service)}
                                            items={mappedServices}
                                            placeholder="Search Service Code..."
                                            showPrice={false}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <Input
                                            type="number"
                                            placeholder="Qty"
                                            value={item.quantity}
                                            onChange={(e) => updateClaimItem(index, 'quantity', parseInt(e.target.value) || 1)}
                                            min="1"
                                            className="text-sm"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="Unit Price"
                                            value={item.unit_price}
                                            onChange={(e) => updateClaimItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                                            className="text-sm"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={item.total_price}
                                            readOnly
                                            className="text-sm bg-gray-100"
                                        />
                                    </div>
                                    <div className="col-span-1 flex items-center justify-center pt-2">
                                        <button
                                            type="button"
                                            onClick={() => removeClaimItem(index)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        {claimItems.length === 0 && (
                            <p className="text-sm text-gray-500 text-center py-4">No items added yet</p>
                        )}
                    </div>

                    {/* Totals */}
                    <div className="border-t pt-4 space-y-2">
                        <div className="flex justify-between">
                            <span className="font-medium">Total Amount:</span>
                            <span>₦{total_amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-medium">Copay Amount:</span>
                            <span>₦{formData.copay_amount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold">
                            <span>Claim Amount:</span>
                            <span>₦{claim_amount.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                            {loading ? 'Creating...' : 'Create Claim'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
