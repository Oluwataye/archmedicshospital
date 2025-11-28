import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit, Trash2, Package, Coins } from 'lucide-react';
import { toast } from 'sonner';
import { HMOProvider, HMOServicePackage, HMOTariff, CreateHMOServicePackageDTO, CreateHMOTariffDTO } from '@/types/hmo';
import hmoService from '@/services/hmoService';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import HMOPackageModal from './HMOPackageModal';
import HMOTariffModal from './HMOTariffModal';

interface HMOProviderDetailsProps {
    provider: HMOProvider;
    onBack: () => void;
}

export default function HMOProviderDetails({ provider, onBack }: HMOProviderDetailsProps) {
    const [activeTab, setActiveTab] = useState<'packages' | 'tariffs'>('packages');
    const [packages, setPackages] = useState<HMOServicePackage[]>([]);
    const [tariffs, setTariffs] = useState<HMOTariff[]>([]);
    const [loading, setLoading] = useState(false);

    // Package Modal State
    const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<HMOServicePackage | undefined>(undefined);

    // Tariff Modal State
    const [isTariffModalOpen, setIsTariffModalOpen] = useState(false);
    const [selectedTariff, setSelectedTariff] = useState<HMOTariff | undefined>(undefined);

    useEffect(() => {
        loadData();
    }, [provider.id, activeTab]);

    const loadData = async () => {
        try {
            setLoading(true);
            if (activeTab === 'packages') {
                const data = await hmoService.getHMOPackages(provider.id);
                setPackages(data);
            } else {
                const data = await hmoService.getHMOTariffs(provider.id);
                setTariffs(data);
            }
        } catch (error) {
            console.error('Error loading data:', error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    // Package Handlers
    const handleCreatePackage = () => {
        setSelectedPackage(undefined);
        setIsPackageModalOpen(true);
    };

    const handleEditPackage = (pkg: HMOServicePackage) => {
        setSelectedPackage(pkg);
        setIsPackageModalOpen(true);
    };

    const handleDeletePackage = async (pkg: HMOServicePackage) => {
        if (!window.confirm(`Are you sure you want to delete ${pkg.package_name}?`)) return;
        try {
            await hmoService.deleteHMOPackage(pkg.id);
            toast.success('Package deleted');
            loadData();
        } catch (error) {
            toast.error('Failed to delete package');
        }
    };

    const handleSavePackage = async (data: CreateHMOServicePackageDTO) => {
        try {
            if (selectedPackage) {
                await hmoService.updateHMOPackage(selectedPackage.id, data);
                toast.success('Package updated');
            } else {
                await hmoService.createHMOPackage(data);
                toast.success('Package created');
            }
            loadData();
        } catch (error) {
            toast.error('Failed to save package');
            throw error;
        }
    };

    // Tariff Handlers
    const handleCreateTariff = () => {
        setSelectedTariff(undefined);
        setIsTariffModalOpen(true);
    };

    const handleEditTariff = (tariff: HMOTariff) => {
        setSelectedTariff(tariff);
        setIsTariffModalOpen(true);
    };

    const handleDeleteTariff = async (tariff: HMOTariff) => {
        if (!window.confirm('Are you sure you want to delete this tariff?')) return;
        try {
            await hmoService.deleteHMOTariff(tariff.id);
            toast.success('Tariff deleted');
            loadData();
        } catch (error) {
            toast.error('Failed to delete tariff');
        }
    };

    const handleSaveTariff = async (data: CreateHMOTariffDTO) => {
        try {
            if (selectedTariff) {
                await hmoService.updateHMOTariff(selectedTariff.id, data);
                toast.success('Tariff updated');
            } else {
                await hmoService.createHMOTariff(data);
                toast.success('Tariff created');
            }
            loadData();
        } catch (error) {
            toast.error('Failed to save tariff');
            throw error;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{provider.name}</h1>
                    <p className="text-gray-500">Manage packages and tariffs</p>
                </div>
            </div>

            <div className="border-b flex gap-6">
                <button
                    className={`pb-3 px-2 flex items-center gap-2 font-medium transition-colors ${activeTab === 'packages'
                            ? 'border-b-2 border-primary text-primary'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    onClick={() => setActiveTab('packages')}
                >
                    <Package size={20} />
                    Service Packages
                </button>
                <button
                    className={`pb-3 px-2 flex items-center gap-2 font-medium transition-colors ${activeTab === 'tariffs'
                            ? 'border-b-2 border-primary text-primary'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    onClick={() => setActiveTab('tariffs')}
                >
                    <Coins size={20} />
                    Tariffs
                </button>
            </div>

            {loading ? (
                <LoadingSpinner />
            ) : (
                <div className="bg-white rounded-lg border shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold">
                            {activeTab === 'packages' ? 'Service Packages' : 'Service Tariffs'}
                        </h2>
                        <button
                            className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2 hover:bg-primary/90 transition-colors"
                            onClick={activeTab === 'packages' ? handleCreatePackage : handleCreateTariff}
                        >
                            <Plus size={20} />
                            Add {activeTab === 'packages' ? 'Package' : 'Tariff'}
                        </button>
                    </div>

                    {activeTab === 'packages' ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Annual Limit</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {packages.length === 0 ? (
                                        <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No packages found</td></tr>
                                    ) : (
                                        packages.map(pkg => (
                                            <tr key={pkg.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium">{pkg.package_name}</td>
                                                <td className="px-6 py-4 text-gray-500">{pkg.package_code}</td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    {pkg.annual_limit ? `₦${pkg.annual_limit.toLocaleString()}` : 'Unlimited'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${pkg.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {pkg.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={() => handleEditPackage(pkg)} className="p-1 text-gray-600 hover:bg-gray-100 rounded">
                                                            <Edit size={18} />
                                                        </button>
                                                        <button onClick={() => handleDeletePackage(pkg)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service Code</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tariff Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Copay</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Effective From</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {tariffs.length === 0 ? (
                                        <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No tariffs found</td></tr>
                                    ) : (
                                        tariffs.map(tariff => (
                                            <tr key={tariff.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium">{tariff.service_code_id}</td>
                                                <td className="px-6 py-4 text-gray-500">₦{tariff.tariff_amount.toLocaleString()}</td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    {tariff.copay_amount ? `₦${tariff.copay_amount}` : (tariff.copay_percentage ? `${tariff.copay_percentage}%` : '-')}
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">{new Date(tariff.effective_from).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={() => handleEditTariff(tariff)} className="p-1 text-gray-600 hover:bg-gray-100 rounded">
                                                            <Edit size={18} />
                                                        </button>
                                                        <button onClick={() => handleDeleteTariff(tariff)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            <HMOPackageModal
                isOpen={isPackageModalOpen}
                onClose={() => setIsPackageModalOpen(false)}
                onSave={handleSavePackage}
                packageData={selectedPackage}
                providerId={provider.id}
            />

            <HMOTariffModal
                isOpen={isTariffModalOpen}
                onClose={() => setIsTariffModalOpen(false)}
                onSave={handleSaveTariff}
                tariffData={selectedTariff}
                providerId={provider.id}
            />
        </div>
    );
}
