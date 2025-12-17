import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Edit, Trash2, Download, Upload, Filter, MoreHorizontal, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import { ApiService } from '@/services/apiService';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import * as XLSX from 'xlsx';

interface Service {
    id: number;
    name: string;
    description: string;
    category: string;
    department: string;
    base_price: number;
    tax_rate: number;
    hmo_covered: boolean;
    hmo_price: number | null;
    duration_minutes: number | null;
    is_active: boolean;
}

export default function ServicesManagementPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [categories, setCategories] = useState<string[]>([]); // Sourced from Departments
    const [departments, setDepartments] = useState<string[]>([]); // Sourced from Departments

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '', // Represents 'Department' in UI, maps to 'category' in DB
        department: '', // Ignored/Auto-filled
        base_price: '',
        tax_rate: '0',
        hmo_covered: false,
        hmo_price: '',
        duration_minutes: '',
        is_active: true
    });

    useEffect(() => {
        fetchServices();
        fetchMetadata();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const response = await ApiService.get('/services');
            setServices(response.services);
        } catch (error) {
            console.error('Error fetching services:', error);
            toast.error('Failed to load services');
        } finally {
            setLoading(false);
        }
    };

    const fetchMetadata = async () => {
        try {
            // Fetch real departments to populate the dropdown
            const [deptsApiRes] = await Promise.all([
                ApiService.get('/departments'),
            ]);

            // Map departments to names for the dropdown
            const deptNames = deptsApiRes.map((d: any) => d.name);
            setCategories(deptNames);
            setDepartments(deptNames);
        } catch (error) {
            console.error('Error fetching metadata:', error);
            // Fallback: try fetching existing service categories if departments endpoint fails
            try {
                const catsRes = await ApiService.get('/services/meta/categories');
                setCategories(catsRes.map((c: any) => c.name));
            } catch (e) {
                console.error("Fallback failed", e);
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSwitchChange = (name: string, checked: boolean) => {
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            category: '',
            department: '',
            base_price: '',
            tax_rate: '0',
            hmo_covered: false,
            hmo_price: '',
            duration_minutes: '',
            is_active: true
        });
    };

    const handleAddService = async () => {
        try {
            setIsSubmitting(true);
            // Semantic Mapping: UI "Department" -> DB "category" AND DB "department"
            const payload = {
                ...formData,
                department: formData.category
            };

            await ApiService.post('/services', payload);
            toast.success('Service created successfully');
            setIsAddModalOpen(false);
            resetForm();
            fetchServices();
        } catch (error) {
            console.error('Error creating service:', error);
            toast.error('Failed to create service');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditService = async () => {
        if (!selectedService) return;
        try {
            setIsSubmitting(true);
            const payload = {
                ...formData,
                department: formData.category
            };
            await ApiService.put(`/services/${selectedService.id}`, payload);
            toast.success('Service updated successfully');
            setIsEditModalOpen(false);
            setSelectedService(null);
            fetchServices();
        } catch (error) {
            console.error('Error updating service:', error);
            toast.error('Failed to update service');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteService = async (id: number) => {
        if (!confirm('Are you sure you want to delete this service?')) return;
        try {
            await ApiService.delete(`/services/${id}`);
            toast.success('Service deleted successfully');
            fetchServices();
        } catch (error) {
            console.error('Error deleting service:', error);
            toast.error('Failed to delete service');
        }
    };

    const openEditModal = (service: Service) => {
        setSelectedService(service);
        setFormData({
            name: service.name,
            description: service.description || '',
            category: service.category,
            department: service.department || service.category, // Fallback
            base_price: service.base_price.toString(),
            tax_rate: service.tax_rate.toString(),
            hmo_covered: service.hmo_covered,
            hmo_price: service.hmo_price ? service.hmo_price.toString() : '',
            duration_minutes: service.duration_minutes ? service.duration_minutes.toString() : '',
            is_active: service.is_active
        });
        setIsEditModalOpen(true);
    };

    const filteredServices = services.filter(service => {
        const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            service.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
    };

    const handleExport = () => {
        try {
            const exportData = services.map(service => ({
                Name: service.name,
                Department: service.category, // Export as Department
                Description: service.description || '',
                'Base Price': service.base_price,
                'Tax Rate': service.tax_rate,
                'HMO Covered': service.hmo_covered ? 'Yes' : 'No',
                'HMO Price': service.hmo_price || '',
                'Duration (mins)': service.duration_minutes || '',
                Status: service.is_active ? 'Active' : 'Inactive'
            }));

            const ws = XLSX.utils.json_to_sheet(exportData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Services");
            XLSX.writeFile(wb, "services_export.xlsx");
            toast.success('Services exported successfully');
        } catch (error) {
            console.error('Error exporting services:', error);
            toast.error('Failed to export services');
        }
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const reader = new FileReader();
            reader.onload = async (evt) => {
                try {
                    const bstr = evt.target?.result;
                    const wb = XLSX.read(bstr, { type: 'binary' });
                    const wsname = wb.SheetNames[0];
                    const ws = wb.Sheets[wsname];
                    const data = XLSX.utils.sheet_to_json(ws);

                    if (data.length === 0) {
                        toast.error('File is empty');
                        return;
                    }

                    const formattedData = data.map((item: any) => ({
                        name: item.Name || item.name,
                        // Prioritize Department, fallback to Category
                        category: item.Department || item.department || item.Category || item.category,
                        department: item.Department || item.department,
                        description: item.Description || item.description,
                        // Flexible Price headers
                        base_price: item['Base Price'] || item['Price'] || item.base_price || item.price,
                        tax_rate: item['Tax Rate'] || item.tax_rate,
                        // Flexible Boolean parsing
                        hmo_covered: (item['HMO Covered'] === 'Yes' || item['HMO'] === 'Yes' || item.hmo_covered === true || item.hmo_covered === 'true'),
                        hmo_price: item['HMO Price'] || item.hmo_price,
                        duration_minutes: item['Duration (mins)'] || item.duration_minutes,
                        is_active: (item.Status === 'Active' || item.status === 'Active' || item.is_active === true)
                    }));

                    const response = await ApiService.importServices(formattedData);

                    if (response.results.failed > 0) {
                        toast.warning(`Import completed: ${response.results.success} successful, ${response.results.failed} failed. Check console for details.`);
                        console.warn('Import failures:', response.results.errors);
                    } else {
                        toast.success(`Successfully imported ${response.results.success} services`);
                    }

                    setIsImportModalOpen(false);
                    fetchServices();
                    e.target.value = '';
                } catch (error) {
                    console.error('Error parsing/importing file:', error);
                    toast.error('Failed to import services. Please check file format.');
                }
            };
            reader.readAsBinaryString(file);
        } catch (error) {
            console.error('Error reading file:', error);
            toast.error('Failed to read file');
        }
    };

    return (
        <div className="space-y-6 p-6 pb-16 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Services Management</h1>
                    <p className="text-muted-foreground">Manage hospital services, pricing, and departments</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsImportModalOpen(true)}>
                        <Upload className="mr-2 h-4 w-4" /> Import
                    </Button>
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" /> Export
                    </Button>
                    <Button onClick={() => { resetForm(); setIsAddModalOpen(true); }}>
                        <Plus className="mr-2 h-4 w-4" /> Add Service
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search services..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Department" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Departments</SelectItem>
                                    {categories.map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button variant="outline" size="icon" onClick={fetchServices}>
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <LoadingSpinner />
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Department</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                        <TableHead className="text-center">HMO</TableHead>
                                        <TableHead className="text-center">Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredServices.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                                No services found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredServices.map((service) => (
                                            <TableRow key={service.id}>
                                                <TableCell className="font-medium">
                                                    <div>{service.name}</div>
                                                    <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                                                        {service.description}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{service.category}</Badge>
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    {formatCurrency(service.base_price)}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {service.hmo_covered ? (
                                                        <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                                                    ) : (
                                                        <XCircle className="h-4 w-4 text-muted-foreground mx-auto" />
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant={service.is_active ? "default" : "secondary"}>
                                                        {service.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem onClick={() => openEditModal(service)}>
                                                                <Edit className="mr-2 h-4 w-4" /> Edit
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteService(service.id)}>
                                                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add/Edit Service Modal */}
            <Dialog open={isAddModalOpen || isEditModalOpen} onOpenChange={(open) => {
                if (!open) {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                }
            }}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{isAddModalOpen ? 'Add New Service' : 'Edit Service'}</DialogTitle>
                        <DialogDescription>
                            {isAddModalOpen ? 'Create a new service offering.' : 'Update existing service details.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto px-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Service Name *</Label>
                                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. General Consultation" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Department *</Label>
                                <Select value={formData.category} onValueChange={(val) => handleSelectChange('category', val)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(cat => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Brief description of the service" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Duration only now, removed nested Department select */}
                            <div className="space-y-2">
                                <Label htmlFor="duration">Duration (mins)</Label>
                                <Input id="duration" name="duration_minutes" type="number" value={formData.duration_minutes} onChange={handleInputChange} placeholder="e.g. 30" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="base_price">Base Price (₦) *</Label>
                                <Input id="base_price" name="base_price" type="number" value={formData.base_price} onChange={handleInputChange} placeholder="0.00" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="tax_rate">Tax Rate (%)</Label>
                                <Input id="tax_rate" name="tax_rate" type="number" value={formData.tax_rate} onChange={handleInputChange} placeholder="0" />
                            </div>
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                                <Label>HMO Coverage</Label>
                                <div className="text-sm text-muted-foreground">Is this service covered by HMO?</div>
                            </div>
                            <Switch checked={formData.hmo_covered} onCheckedChange={(checked) => handleSwitchChange('hmo_covered', checked)} />
                        </div>
                        {formData.hmo_covered && (
                            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                <Label htmlFor="hmo_price">HMO Price (₦)</Label>
                                <Input id="hmo_price" name="hmo_price" type="number" value={formData.hmo_price} onChange={handleInputChange} placeholder="Leave empty to use base price" />
                            </div>
                        )}
                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                                <Label>Active Status</Label>
                                <div className="text-sm text-muted-foreground">Service is available for selection</div>
                            </div>
                            <Switch checked={formData.is_active} onCheckedChange={(checked) => handleSwitchChange('is_active', checked)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}>Cancel</Button>
                        <Button onClick={isAddModalOpen ? handleAddService : handleEditService} disabled={isSubmitting}>
                            {isSubmitting && <LoadingSpinner className="mr-2 h-4 w-4" />}
                            {isAddModalOpen ? 'Create Service' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Import Modal */}
            <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Import Services</DialogTitle>
                        <DialogDescription>Upload an Excel or CSV file to bulk import services.</DialogDescription>
                    </DialogHeader>
                    <div className="py-8 text-center border-2 border-dashed rounded-lg">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground mb-4">Drag and drop file here, or click to browse</p>
                        <Input
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            onChange={handleImport}
                            className="max-w-xs mx-auto"
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsImportModalOpen(false)}>Cancel</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
