import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { CreateHMOProviderDTO, HMOProvider } from '@/types/hmo';

interface HMOProviderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: CreateHMOProviderDTO) => Promise<void>;
    provider?: HMOProvider;
}

export default function HMOProviderModal({ isOpen, onClose, onSave, provider }: HMOProviderModalProps) {
    const [formData, setFormData] = useState<CreateHMOProviderDTO>({
        name: '',
        code: '',
        nhia_accreditation_number: '',
        contact_email: '',
        contact_phone: '',
        address: '',
        coverage_type: 'individual',
        is_active: true
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (provider) {
            setFormData({
                name: provider.name,
                code: provider.code,
                nhia_accreditation_number: provider.nhia_accreditation_number || '',
                contact_email: provider.contact_email || '',
                contact_phone: provider.contact_phone || '',
                address: provider.address || '',
                coverage_type: provider.coverage_type || 'individual',
                is_active: provider.is_active
            });
        } else {
            setFormData({
                name: '',
                code: '',
                nhia_accreditation_number: '',
                contact_email: '',
                contact_phone: '',
                address: '',
                coverage_type: 'individual',
                is_active: true
            });
        }
    }, [provider, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.code) {
            toast.error('Name and Code are required');
            return;
        }

        try {
            setLoading(true);
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error('Error saving provider:', error);
            // Error handling is done in parent
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-semibold">
                        {provider ? 'Edit HMO Provider' : 'Add HMO Provider'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Provider Name *</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Provider Code *</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                value={formData.code}
                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">NHIA Accreditation Number</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                value={formData.nhia_accreditation_number}
                                onChange={(e) => setFormData({ ...formData, nhia_accreditation_number: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Coverage Type</label>
                            <select
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                value={formData.coverage_type}
                                onChange={(e) => setFormData({ ...formData, coverage_type: e.target.value as any })}
                            >
                                <option value="individual">Individual</option>
                                <option value="family">Family</option>
                                <option value="corporate">Corporate</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                value={formData.contact_email}
                                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Phone</label>
                            <input
                                type="tel"
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                value={formData.contact_phone}
                                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                            />
                        </div>

                        <div className="col-span-2 space-y-2">
                            <label className="text-sm font-medium text-gray-700">Address</label>
                            <textarea
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                rows={3}
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                className="rounded border-gray-300 text-primary focus:ring-primary"
                                checked={formData.is_active}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            />
                            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                                Active Status
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : (provider ? 'Update Provider' : 'Create Provider')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
