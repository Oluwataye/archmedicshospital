import React, { useState, useEffect, useMemo } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import ApiService from '@/services/apiService';
import hmoService from '@/services/hmoService';
import { CreatePreAuthorizationDTO } from '@/types/hmo';
import { ServiceSearchCombobox } from '@/components/common/ServiceSearchCombobox';
import PatientSearchSelect from '@/components/common/PatientSearchSelect';
import { Service } from '@/types/service';
import { Patient } from '@/types/patient';

interface PreAuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function PreAuthModal({ isOpen, onClose, onSuccess }: PreAuthModalProps) {
    const [loading, setLoading] = useState(false);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [hmoProviders, setHMOProviders] = useState<any[]>([]);
    const [serviceCodes, setServiceCodes] = useState<any[]>([]);
    const [formData, setFormData] = useState<CreatePreAuthorizationDTO>({
        patient_id: '',
        hmo_provider_id: '',
        requested_service_code_id: '',
        diagnosis: '',
        requested_by: '',
        expiry_date: '',
        notes: ''
    });

    // Form selection states for UI components
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    useEffect(() => {
        if (isOpen) {
            loadData();
            // Set default requested_by to current user
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            setFormData(prev => ({ ...prev, requested_by: user.id || '' }));
            setSelectedService(null);
        }
    }, [isOpen]);

    const loadData = async () => {
        try {
            const [patientsData, hmoData] = await Promise.all([
                ApiService.getPatients(),
                hmoService.getHMOProviders()
            ]);
            // Handle different response structures for patients
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
            // Don't show error toast, just log it
        }
    };

    // Map service codes to Service type for the combobox
    const mappedServices = useMemo(() => {
        return serviceCodes.map(s => ({
            id: s.id,
            name: s.description,
            code: s.code,
            price: 0 // Price not relevant for code selection or can be fetched if available
        } as Service));
    }, [serviceCodes]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.patient_id || !formData.hmo_provider_id) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);
            const preAuthService = (await import('@/services/preauthService')).default;
            await preAuthService.createPreAuthorization(formData);
            toast.success('Pre-authorization request created successfully');
            onSuccess();
            onClose();
            resetForm();
        } catch (error: any) {
            console.error('Error creating pre-authorization:', error);
            toast.error(error.response?.data?.error || 'Failed to create pre-authorization');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            patient_id: '',
            hmo_provider_id: '',
            requested_service_code_id: '',
            diagnosis: '',
            requested_by: '',
            expiry_date: '',
            notes: ''
        });
        setSelectedService(null);
    };

    const handlePatientSelect = (patientId: string) => {
        setFormData(prev => ({ ...prev, patient_id: patientId }));
    };

    const handleServiceSelect = (service: Service | null) => {
        setSelectedService(service);
        setFormData(prev => ({
            ...prev,
            requested_service_code_id: service ? String(service.id) : ''
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-bold">New Pre-Authorization Request</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Patient Selection */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium mb-1">Patient *</label>
                        <PatientSearchSelect
                            patients={patients}
                            selectedPatientId={formData.patient_id}
                            onSelectPatient={handlePatientSelect}
                        />
                    </div>

                    {/* HMO Provider */}
                    <div>
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

                    {/* Service Code */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Requested Service</label>
                        <ServiceSearchCombobox
                            value={selectedService}
                            onSelect={handleServiceSelect}
                            items={mappedServices}
                            placeholder="Type 3+ chars to search service codes..."
                            showPrice={false}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Search by service description or code
                        </p>
                    </div>

                    {/* Diagnosis */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Diagnosis</label>
                        <Input
                            type="text"
                            value={formData.diagnosis}
                            onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                            placeholder="Enter diagnosis"
                        />
                    </div>

                    {/* Expiry Date */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Expiry Date</label>
                        <Input
                            type="date"
                            value={formData.expiry_date}
                            onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Notes</label>
                        <Textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Additional notes or comments"
                            rows={3}
                        />
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
                            {loading ? 'Creating...' : 'Create Pre-Authorization'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
