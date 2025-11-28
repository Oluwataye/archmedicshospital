import React, { useState, useEffect } from 'react';
import { HMOProvider, HMOServicePackage } from '@/types/hmo';
import HMOService from '@/services/hmoService';
import { toast } from 'sonner';

interface HMOSelectorProps {
    selectedHMOId?: string;
    selectedPackageId?: string;
    onHMOChange: (hmoId: string) => void;
    onPackageChange: (packageId: string) => void;
    disabled?: boolean;
}

export const HMOSelector: React.FC<HMOSelectorProps> = ({
    selectedHMOId,
    selectedPackageId,
    onHMOChange,
    onPackageChange,
    disabled = false,
}) => {
    const [hmoProviders, setHMOProviders] = useState<HMOProvider[]>([]);
    const [packages, setPackages] = useState<HMOServicePackage[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingPackages, setLoadingPackages] = useState(false);

    // Load HMO providers on mount
    useEffect(() => {
        loadHMOProviders();
    }, []);

    // Load packages when HMO is selected
    useEffect(() => {
        if (selectedHMOId) {
            loadPackages(selectedHMOId);
        } else {
            setPackages([]);
        }
    }, [selectedHMOId]);

    const loadHMOProviders = async () => {
        try {
            setLoading(true);
            const providers = await HMOService.getHMOProviders(true);
            setHMOProviders(providers);
        } catch (error) {
            console.error('Error loading HMO providers:', error);
            toast.error('Failed to load HMO providers');
        } finally {
            setLoading(false);
        }
    };

    const loadPackages = async (hmoId: string) => {
        try {
            setLoadingPackages(true);
            const pkgs = await HMOService.getHMOPackages(hmoId);
            setPackages(pkgs);
        } catch (error) {
            console.error('Error loading packages:', error);
            toast.error('Failed to load HMO packages');
        } finally {
            setLoadingPackages(false);
        }
    };

    const handleHMOChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const hmoId = e.target.value;
        onHMOChange(hmoId);
        onPackageChange(''); // Reset package selection
    };

    const handlePackageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onPackageChange(e.target.value);
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* HMO Provider Selection */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    HMO Provider
                </label>
                <select
                    value={selectedHMOId || ''}
                    onChange={handleHMOChange}
                    disabled={disabled}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                    <option value="">Select HMO Provider</option>
                    {hmoProviders.map((hmo) => (
                        <option key={hmo.id} value={hmo.id}>
                            {hmo.name} ({hmo.code})
                        </option>
                    ))}
                </select>
            </div>

            {/* Package Selection */}
            {selectedHMOId && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Coverage Package
                    </label>
                    {loadingPackages ? (
                        <div className="animate-pulse">
                            <div className="h-10 bg-gray-200 rounded"></div>
                        </div>
                    ) : (
                        <select
                            value={selectedPackageId || ''}
                            onChange={handlePackageChange}
                            disabled={disabled || packages.length === 0}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                            <option value="">Select Package</option>
                            {packages.map((pkg) => (
                                <option key={pkg.id} value={pkg.id}>
                                    {pkg.package_name} - ₦{pkg.annual_limit?.toLocaleString()} annual limit
                                </option>
                            ))}
                        </select>
                    )}
                    {!loadingPackages && packages.length === 0 && (
                        <p className="mt-1 text-sm text-gray-500">
                            No packages available for this HMO
                        </p>
                    )}
                </div>
            )}

            {/* Package Details */}
            {selectedPackageId && packages.length > 0 && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                    {(() => {
                        const selectedPackage = packages.find(p => p.id === selectedPackageId);
                        if (!selectedPackage) return null;

                        return (
                            <div className="space-y-2">
                                <h4 className="font-semibold text-blue-900">Package Details</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <span className="text-gray-600">Annual Limit:</span>
                                        <span className="ml-2 font-medium">
                                            ₦{selectedPackage.annual_limit?.toLocaleString()}
                                        </span>
                                    </div>
                                    {selectedPackage.copay_percentage && (
                                        <div>
                                            <span className="text-gray-600">Co-pay:</span>
                                            <span className="ml-2 font-medium">
                                                {selectedPackage.copay_percentage}%
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })()}
                </div>
            )}
        </div>
    );
};

export default HMOSelector;
