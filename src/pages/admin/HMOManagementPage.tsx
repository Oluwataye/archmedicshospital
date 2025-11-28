import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Shield, Package } from 'lucide-react';
import { toast } from 'sonner';
import hmoService from '@/services/hmoService';
import { HMOProvider, CreateHMOProviderDTO } from '@/types/hmo';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import HMOProviderModal from '@/components/hmo/HMOProviderModal';
import HMOProviderDetails from '@/components/hmo/HMOProviderDetails';

export default function HMOManagementPage() {
    const [providers, setProviders] = useState<HMOProvider[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState<HMOProvider | undefined>(undefined);
    const [viewingProvider, setViewingProvider] = useState<HMOProvider | undefined>(undefined);

    useEffect(() => {
        if (!viewingProvider) {
            loadProviders();
        }
    }, [viewingProvider]);

    const loadProviders = async () => {
        try {
            setLoading(true);
            const data = await hmoService.getHMOProviders(false); // Fetch all, including inactive
            setProviders(data);
        } catch (error) {
            console.error('Error loading HMO providers:', error);
            toast.error('Failed to load HMO providers');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedProvider(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (provider: HMOProvider) => {
        setSelectedProvider(provider);
        setIsModalOpen(true);
    };

    const handleDelete = async (provider: HMOProvider) => {
        if (!window.confirm(`Are you sure you want to delete ${provider.name}?`)) return;

        try {
            await hmoService.deleteHMOProvider(provider.id);
            toast.success('Provider deleted successfully');
            loadProviders();
        } catch (error) {
            console.error('Error deleting provider:', error);
            toast.error('Failed to delete provider');
        }
    };

    const handleSave = async (data: CreateHMOProviderDTO) => {
        try {
            if (selectedProvider) {
                await hmoService.updateHMOProvider(selectedProvider.id, data);
                toast.success('Provider updated successfully');
            } else {
                await hmoService.createHMOProvider(data);
                toast.success('Provider created successfully');
            }
            loadProviders();
        } catch (error) {
            console.error('Error saving provider:', error);
            toast.error('Failed to save provider');
            throw error; // Re-throw to let modal know it failed
        }
    };

    const filteredProviders = providers.filter(provider =>
        provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (viewingProvider) {
        return (
            <div className="p-6">
                <HMOProviderDetails
                    provider={viewingProvider}
                    onBack={() => setViewingProvider(undefined)}
                />
            </div>
        );
    }

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">HMO Management</h1>
                    <p className="text-gray-500">Manage HMO providers, packages, and tariffs</p>
                </div>
                <button
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2 hover:bg-primary/90 transition-colors"
                    onClick={handleCreate}
                >
                    <Plus size={20} />
                    Add Provider
                </button>
            </div>

            <div className="bg-white rounded-lg border shadow-sm">
                <div className="p-4 border-b flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search providers..."
                            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredProviders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No providers found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredProviders.map((provider) => (
                                    <tr key={provider.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                                    {provider.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{provider.name}</div>
                                                    <div className="text-xs text-gray-500">Accreditation: {provider.nhia_accreditation_number || 'N/A'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                                                {provider.code}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div>{provider.contact_email}</div>
                                            <div>{provider.contact_phone}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${provider.is_active
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {provider.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                    title="View Packages & Tariffs"
                                                    onClick={() => setViewingProvider(provider)}
                                                >
                                                    <Package size={18} />
                                                </button>
                                                <button
                                                    className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                                                    title="Edit Provider"
                                                    onClick={() => handleEdit(provider)}
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                    title="Delete"
                                                    onClick={() => handleDelete(provider)}
                                                >
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
            </div>

            <HMOProviderModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                provider={selectedProvider}
            />
        </div>
    );
}
