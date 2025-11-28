import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import hmoService from '@/services/hmoService';
import { HMOProvider, HMOServicePackage } from '@/types/hmo';

interface HMOEnrollmentSectionProps {
    formData: any;
    setFormData: (data: any) => void;
}

export default function HMOEnrollmentSection({ formData, setFormData }: HMOEnrollmentSectionProps) {
    const [hmoProviders, setHmoProviders] = useState<HMOProvider[]>([]);
    const [packages, setPackages] = useState<HMOServicePackage[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadHMOProviders();
    }, []);

    useEffect(() => {
        if (formData.hmo_provider_id) {
            loadPackages(formData.hmo_provider_id);
        } else {
            setPackages([]);
        }
    }, [formData.hmo_provider_id]);

    const loadHMOProviders = async () => {
        try {
            const data = await hmoService.getHMOProviders(true);
            setHmoProviders(data);
        } catch (error) {
            console.error('Error loading HMO providers:', error);
            toast.error('Failed to load HMO providers');
        }
    };

    const loadPackages = async (providerId: string) => {
        try {
            setLoading(true);
            const data = await hmoService.getHMOPackages(providerId);
            setPackages(data);
        } catch (error) {
            console.error('Error loading packages:', error);
            toast.error('Failed to load packages');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <input
                    type="checkbox"
                    id="has_hmo"
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                    checked={formData.has_hmo || false}
                    onChange={(e) => {
                        setFormData({
                            ...formData,
                            has_hmo: e.target.checked,
                            hmo_provider_id: e.target.checked ? formData.hmo_provider_id : '',
                            hmo_package_id: '',
                            nhis_enrollment_number: '',
                            policy_start_date: '',
                            policy_end_date: '',
                            principal_member_id: '',
                            relationship_to_principal: ''
                        });
                    }}
                />
                <label htmlFor="has_hmo" className="text-sm font-medium text-gray-700">
                    Enroll in HMO/NHIS
                </label>
            </div>

            {formData.has_hmo && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">HMO Provider *</label>
                            <select
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                value={formData.hmo_provider_id || ''}
                                onChange={(e) => setFormData({ ...formData, hmo_provider_id: e.target.value, hmo_package_id: '' })}
                                required={formData.has_hmo}
                            >
                                <option value="">Select HMO Provider</option>
                                {hmoProviders.map((provider) => (
                                    <option key={provider.id} value={provider.id}>
                                        {provider.name} ({provider.code})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Service Package</label>
                            <select
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                value={formData.hmo_package_id || ''}
                                onChange={(e) => setFormData({ ...formData, hmo_package_id: e.target.value })}
                                disabled={!formData.hmo_provider_id || loading}
                            >
                                <option value="">Select Package (Optional)</option>
                                {packages.map((pkg) => (
                                    <option key={pkg.id} value={pkg.id}>
                                        {pkg.package_name} ({pkg.package_code})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">NHIS Enrollment Number</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                value={formData.nhis_enrollment_number || ''}
                                onChange={(e) => setFormData({ ...formData, nhis_enrollment_number: e.target.value })}
                                placeholder="e.g., NHIS-12345678"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Relationship to Principal</label>
                            <select
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                value={formData.relationship_to_principal || ''}
                                onChange={(e) => setFormData({ ...formData, relationship_to_principal: e.target.value })}
                            >
                                <option value="">Select Relationship</option>
                                <option value="self">Self (Principal)</option>
                                <option value="spouse">Spouse</option>
                                <option value="child">Child</option>
                                <option value="parent">Parent</option>
                                <option value="dependent">Other Dependent</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Policy Start Date</label>
                            <input
                                type="date"
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                value={formData.policy_start_date || ''}
                                onChange={(e) => setFormData({ ...formData, policy_start_date: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Policy End Date</label>
                            <input
                                type="date"
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                value={formData.policy_end_date || ''}
                                onChange={(e) => setFormData({ ...formData, policy_end_date: e.target.value })}
                            />
                        </div>

                        <div className="col-span-2 space-y-2">
                            <label className="text-sm font-medium text-gray-700">Principal Member ID (if dependent)</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                value={formData.principal_member_id || ''}
                                onChange={(e) => setFormData({ ...formData, principal_member_id: e.target.value })}
                                placeholder="Leave empty if this is the principal member"
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
