import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { CreateHMOTariffDTO, HMOTariff } from '@/types/hmo';

interface HMOTariffModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: CreateHMOTariffDTO) => Promise<void>;
    tariffData?: HMOTariff;
    providerId: string;
}

export default function HMOTariffModal({ isOpen, onClose, onSave, tariffData, providerId }: HMOTariffModalProps) {
    const [formData, setFormData] = useState<CreateHMOTariffDTO>({
        hmo_provider_id: providerId,
        service_code_id: '',
        tariff_amount: 0,
        copay_amount: 0,
        copay_percentage: 0,
        effective_from: new Date().toISOString().split('T')[0],
        effective_to: undefined
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (tariffData) {
            setFormData({
                hmo_provider_id: tariffData.hmo_provider_id,
                service_code_id: tariffData.service_code_id,
                tariff_amount: tariffData.tariff_amount,
                copay_amount: tariffData.copay_amount || 0,
                copay_percentage: tariffData.copay_percentage || 0,
                effective_from: tariffData.effective_from.split('T')[0],
                effective_to: tariffData.effective_to ? tariffData.effective_to.split('T')[0] : undefined
            });
        } else {
            setFormData({
                hmo_provider_id: providerId,
                service_code_id: '',
                tariff_amount: 0,
                copay_amount: 0,
                copay_percentage: 0,
                effective_from: new Date().toISOString().split('T')[0],
                effective_to: undefined
            });
        }
    }, [tariffData, isOpen, providerId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.service_code_id || formData.tariff_amount < 0) {
            toast.error('Service Code and valid Tariff Amount are required');
            return;
        }

        try {
            setLoading(true);
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error('Error saving tariff:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-semibold">
                        {tariffData ? 'Edit Tariff' : 'Add Tariff'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Service Code ID *</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                value={formData.service_code_id}
                                onChange={(e) => setFormData({ ...formData, service_code_id: e.target.value })}
                                required
                                placeholder="Enter Service Code ID"
                            />
                            {/* In a real app, this would be a search/select for service codes */}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Tariff Amount *</label>
                            <input
                                type="number"
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                value={formData.tariff_amount}
                                onChange={(e) => setFormData({ ...formData, tariff_amount: Number(e.target.value) })}
                                required
                                min="0"
                                step="0.01"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Copay Amount</label>
                                <input
                                    type="number"
                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    value={formData.copay_amount}
                                    onChange={(e) => setFormData({ ...formData, copay_amount: Number(e.target.value) })}
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Copay %</label>
                                <input
                                    type="number"
                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    value={formData.copay_percentage}
                                    onChange={(e) => setFormData({ ...formData, copay_percentage: Number(e.target.value) })}
                                    min="0"
                                    max="100"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Effective From</label>
                                <input
                                    type="date"
                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    value={formData.effective_from}
                                    onChange={(e) => setFormData({ ...formData, effective_from: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Effective To</label>
                                <input
                                    type="date"
                                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    value={formData.effective_to || ''}
                                    onChange={(e) => setFormData({ ...formData, effective_to: e.target.value || undefined })}
                                />
                            </div>
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
                            {loading ? 'Saving...' : (tariffData ? 'Update Tariff' : 'Create Tariff')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
