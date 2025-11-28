import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { CreateHMOServicePackageDTO, HMOServicePackage } from '@/types/hmo';
import nhisService from '@/services/nhisService';
import { NHISServiceCode } from '@/types/hmo';

interface HMOPackageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: CreateHMOServicePackageDTO) => Promise<void>;
    packageData?: HMOServicePackage;
    providerId: string;
}

export default function HMOPackageModal({ isOpen, onClose, onSave, packageData, providerId }: HMOPackageModalProps) {
    const [formData, setFormData] = useState<CreateHMOServicePackageDTO>({
        hmo_provider_id: providerId,
        package_name: '',
        package_code: '',
        annual_limit: 0,
        copay_percentage: 0,
        services_covered: [],
        exclusions: [],
        is_active: true
    });
    const [loading, setLoading] = useState(false);
    const [serviceCodes, setServiceCodes] = useState<NHISServiceCode[]>([]);
    const [searchService, setSearchService] = useState('');

    useEffect(() => {
        if (packageData) {
            setFormData({
                hmo_provider_id: packageData.hmo_provider_id,
                package_name: packageData.package_name,
                package_code: packageData.package_code,
                annual_limit: packageData.annual_limit || 0,
                copay_percentage: packageData.copay_percentage || 0,
                services_covered: packageData.services_covered || [],
                exclusions: packageData.exclusions || [],
                is_active: packageData.is_active
            });
        } else {
            setFormData({
                hmo_provider_id: providerId,
                package_name: '',
                package_code: '',
                annual_limit: 0,
                copay_percentage: 0,
                services_covered: [],
                exclusions: [],
                is_active: true
            });
        }
    }, [packageData, isOpen, providerId]);

    // Mock loading service codes for selection - in real app would fetch from API
    // For now we'll just use a simple text area for codes or a basic list if we had the service

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.package_name || !formData.package_code) {
            toast.error('Package Name and Code are required');
            return;
        }

        try {
            setLoading(true);
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error('Error saving package:', error);
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
                        {packageData ? 'Edit Service Package' : 'Add Service Package'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Package Name *</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                value={formData.package_name}
                                onChange={(e) => setFormData({ ...formData, package_name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Package Code *</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                value={formData.package_code}
                                onChange={(e) => setFormData({ ...formData, package_code: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Annual Limit</label>
                            <input
                                type="number"
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                value={formData.annual_limit}
                                onChange={(e) => setFormData({ ...formData, annual_limit: Number(e.target.value) })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Copay Percentage (%)</label>
                            <input
                                type="number"
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                value={formData.copay_percentage}
                                onChange={(e) => setFormData({ ...formData, copay_percentage: Number(e.target.value) })}
                                min="0"
                                max="100"
                            />
                        </div>

                        <div className="col-span-2 space-y-2">
                            <label className="text-sm font-medium text-gray-700">Services Covered (Comma separated codes)</label>
                            <textarea
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                rows={3}
                                value={formData.services_covered?.join(', ')}
                                onChange={(e) => setFormData({ ...formData, services_covered: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                                placeholder="e.g. CON-001, LAB-002"
                            />
                            <p className="text-xs text-gray-500">Leave empty to cover all services by default (unless excluded)</p>
                        </div>

                        <div className="col-span-2 space-y-2">
                            <label className="text-sm font-medium text-gray-700">Exclusions (Comma separated codes)</label>
                            <textarea
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                rows={2}
                                value={formData.exclusions?.join(', ')}
                                onChange={(e) => setFormData({ ...formData, exclusions: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                                placeholder="e.g. COS-001"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_active_pkg"
                                className="rounded border-gray-300 text-primary focus:ring-primary"
                                checked={formData.is_active}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            />
                            <label htmlFor="is_active_pkg" className="text-sm font-medium text-gray-700">
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
                            {loading ? 'Saving...' : (packageData ? 'Update Package' : 'Create Package')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
