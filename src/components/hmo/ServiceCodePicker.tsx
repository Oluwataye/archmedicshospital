import React, { useState, useEffect } from 'react';
import { NHISServiceCode, ServiceCategory } from '@/types/hmo';
import NHISService from '@/services/nhisService';
import { toast } from 'sonner';
import { Search, X } from 'lucide-react';

interface ServiceCodePickerProps {
    onServiceSelect: (service: NHISServiceCode) => void;
    selectedServices?: NHISServiceCode[];
    hmoProviderId?: string;
}

export const ServiceCodePicker: React.FC<ServiceCodePickerProps> = ({
    onServiceSelect,
    selectedServices = [],
    hmoProviderId,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [serviceCodes, setServiceCodes] = useState<NHISServiceCode[]>([]);
    const [filteredServices, setFilteredServices] = useState<NHISServiceCode[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        loadCategories();
        loadServiceCodes();
    }, []);

    useEffect(() => {
        filterServices();
    }, [searchQuery, selectedCategory, serviceCodes]);

    const loadCategories = async () => {
        try {
            const cats = await NHISService.getServiceCategories();
            setCategories(cats);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    const loadServiceCodes = async () => {
        try {
            setLoading(true);
            const codes = await NHISService.getServiceCodes({ is_active: true });
            setServiceCodes(codes);
        } catch (error) {
            console.error('Error loading service codes:', error);
            toast.error('Failed to load service codes');
        } finally {
            setLoading(false);
        }
    };

    const filterServices = () => {
        let filtered = [...serviceCodes];

        // Filter by category
        if (selectedCategory) {
            filtered = filtered.filter(s => s.category === selectedCategory);
        }

        // Filter by search query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                s =>
                    s.code.toLowerCase().includes(query) ||
                    s.description.toLowerCase().includes(query)
            );
        }

        setFilteredServices(filtered);
    };

    const handleSearch = async (query: string) => {
        setSearchQuery(query);

        if (query.length >= 2) {
            try {
                setSearching(true);
                const results = await NHISService.searchServiceCodes(query);
                setFilteredServices(results);
            } catch (error) {
                console.error('Error searching:', error);
            } finally {
                setSearching(false);
            }
        }
    };

    const isServiceSelected = (serviceId: string) => {
        return selectedServices.some(s => s.id === serviceId);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search by code or description..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {searchQuery && (
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            filterServices();
                        }}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                        <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    </button>
                )}
            </div>

            {/* Category Filter */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Category
                </label>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>

            {/* Service List */}
            <div className="border border-gray-200 rounded-md max-h-96 overflow-y-auto">
                {filteredServices.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        {searching ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                <span className="ml-2">Searching...</span>
                            </div>
                        ) : (
                            <p>No services found</p>
                        )}
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {filteredServices.map((service) => {
                            const selected = isServiceSelected(service.id);

                            return (
                                <div
                                    key={service.id}
                                    onClick={() => !selected && onServiceSelect(service)}
                                    className={`p-4 cursor-pointer transition-colors ${selected
                                            ? 'bg-blue-50 border-l-4 border-blue-500'
                                            : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2">
                                                <span className="font-mono text-sm font-semibold text-blue-600">
                                                    {service.code}
                                                </span>
                                                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                                                    {service.category}
                                                </span>
                                            </div>
                                            <p className="mt-1 text-sm text-gray-900">{service.description}</p>
                                            <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                                                <span>Base Tariff: ₦{service.base_tariff.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        {selected && (
                                            <div className="ml-4">
                                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500">
                                                    <svg
                                                        className="w-4 h-4 text-white"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-500 text-center">
                Showing {filteredServices.length} of {serviceCodes.length} services
            </div>
        </div>
    );
};

export default ServiceCodePicker;
