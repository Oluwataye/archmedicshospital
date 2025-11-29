import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Shield, Package } from 'lucide-react';
import { toast } from 'sonner';
import hmoService from '@/services/hmoService';
import { HMOProvider, CreateHMOProviderDTO } from '@/types/hmo';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import HMOProviderModal from '@/components/hmo/HMOProviderModal';
import HMOProviderDetails from '@/components/hmo/HMOProviderDetails';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

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
            const data = await hmoService.getHMOProviders(false);
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
            throw error;
        }
    };

    const filteredProviders = providers.filter(provider =>
        provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        provider.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (viewingProvider) {
        return (
            <div className="space-y-6">
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
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">HMO Management</h1>
                    <p className="text-muted-foreground mt-1">Manage HMO providers, packages, and tariffs</p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Provider
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="p-4 border-b flex items-center gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search providers..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Provider</TableHead>
                                <TableHead>Code</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProviders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                        No providers found matching your search.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredProviders.map((provider) => (
                                    <TableRow key={provider.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                                        {provider.name.substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium">{provider.name}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        Accreditation: {provider.nhia_accreditation_number || 'N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{provider.code}</Badge>
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            <div>{provider.contact_email}</div>
                                            <div className="text-muted-foreground">{provider.contact_phone}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={provider.is_active ? 'default' : 'secondary'}>
                                                {provider.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    title="View Packages & Tariffs"
                                                    onClick={() => setViewingProvider(provider)}
                                                >
                                                    <Package className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    title="Edit Provider"
                                                    onClick={() => handleEdit(provider)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    title="Delete"
                                                    onClick={() => handleDelete(provider)}
                                                    className="text-destructive hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <HMOProviderModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                provider={selectedProvider}
            />
        </div>
    );
}
