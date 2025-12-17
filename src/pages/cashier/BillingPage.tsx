import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Download, FileText, Trash2, Edit, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import ApiService from '@/services/apiService';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { usePatients } from '@/hooks/usePatientsQuery';
import { ServiceSearchCombobox } from '@/components/common/ServiceSearchCombobox';
import PatientSearchSelect from '@/components/common/PatientSearchSelect';
import { Service } from '@/types/service';
import { useDebounce } from '@/hooks/useDebounce';

interface Invoice {
    id: number;
    invoice_number: string;
    patient_first_name: string;
    patient_last_name: string;
    patient_mrn: string;
    total_amount: number;
    discount_amount: number;
    net_amount: number;
    status: string;
    created_at: string;
}

interface BillItem {
    id: number;
    service: Service;
    quantity: number;
    unit_price: number;
    total: number;
}

const BillingPage = () => {
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showNewInvoiceDialog, setShowNewInvoiceDialog] = useState(false);

    // New Invoice Form State
    const [selectedPatientId, setSelectedPatientId] = useState<string>('');
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [billItems, setBillItems] = useState<BillItem[]>([]);
    const [quantity, setQuantity] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch Patients for Search
    const { data: patients = [] } = usePatients();

    useEffect(() => {
        fetchInvoices();
    }, [statusFilter]);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const filters: any = {};
            if (statusFilter !== 'all') filters.status = statusFilter;

            const data = await ApiService.getInvoices(filters);
            setInvoices(data);
        } catch (error) {
            console.error('Error fetching invoices:', error);
            toast.error('Failed to load invoices');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid': return 'bg-green-100 text-green-800 hover:bg-green-100';
            case 'pending': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
            case 'cancelled': return 'bg-red-100 text-red-800 hover:bg-red-100';
            case 'partial': return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
            default: return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
        }
    };

    const debouncedSearch = useDebounce(searchQuery, 300);

    const filteredInvoices = useMemo(() => {
        if (!debouncedSearch) return invoices;
        const searchLower = debouncedSearch.toLowerCase();
        return invoices.filter(invoice =>
            invoice.invoice_number?.toLowerCase().includes(searchLower) ||
            invoice.patient_first_name?.toLowerCase().includes(searchLower) ||
            invoice.patient_last_name?.toLowerCase().includes(searchLower) ||
            invoice.patient_mrn?.toLowerCase().includes(searchLower)
        );
    }, [invoices, debouncedSearch]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Invoice Creation Handlers
    const handleAddService = () => {
        if (!selectedService) return;

        // Check for duplicates
        if (billItems.some(item => item.service.id === selectedService.id)) {
            toast.error('Service already added');
            return;
        }

        const newItem: BillItem = {
            id: Date.now(),
            service: selectedService,
            quantity: quantity,
            unit_price: selectedService.price,
            total: selectedService.price * quantity,
        };

        setBillItems([...billItems, newItem]);
        setSelectedService(null);
        setQuantity(1);
    };

    const handleRemoveItem = (id: number) => {
        setBillItems(billItems.filter(item => item.id !== id));
    };

    const calculateTotal = () => {
        return billItems.reduce((sum, item) => sum + item.total, 0);
    };

    const handleCreateInvoice = async () => {
        if (!selectedPatientId) {
            toast.error('Please select a patient');
            return;
        }
        if (billItems.length === 0) {
            toast.error('Please add at least one service');
            return;
        }

        try {
            setIsSubmitting(true);
            const invoiceData = {
                patient_id: parseInt(selectedPatientId),
                items: billItems.map(item => ({
                    service_id: item.service.id,
                    service_name: item.service.name,
                    quantity: item.quantity,
                    unit_price: item.unit_price,
                    total_price: item.total
                })),
                total_amount: calculateTotal(),
                status: 'pending'
            };

            await ApiService.createInvoice(invoiceData);
            toast.success('Invoice created successfully');
            setShowNewInvoiceDialog(false);
            setBillItems([]);
            setSelectedPatientId('');
            fetchInvoices();
        } catch (error) {
            console.error('Error creating invoice:', error);
            toast.error('Failed to create invoice');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteInvoice = async (id: number) => {
        if (!confirm('Are you sure you want to delete this invoice?')) return;
        try {
            await ApiService.deleteInvoice(id);
            toast.success('Invoice deleted successfully');
            fetchInvoices();
        } catch (error) {
            // console.error('Error deleting invoice:', error);
            toast.error('Failed to delete invoice');
        }
    };

    if (loading) {
        return <LoadingSpinner fullScreen text="Loading invoices..." />;
    }

    return (
        <div className="animate-in fade-in duration-500">
            {/* Breadcrumbs */}
            <div className="text-muted-foreground text-sm mb-4">
                Cashier &gt; Billing & Invoices
            </div>

            {/* Page Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Billing & Invoices</h1>
                    <p className="text-muted-foreground mt-1">Create and manage patient invoices</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => navigate('/cashier')}>
                        Back to Dashboard
                    </Button>
                    <Button onClick={() => setShowNewInvoiceDialog(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Invoice
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative col-span-2">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by invoice number, patient name, or MRN..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="partial">Partially Paid</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Invoices Table */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Invoices</CardTitle>
                        <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Export
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Invoice #</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Patient</TableHead>
                                    <TableHead>MRN</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Discount</TableHead>
                                    <TableHead>Net Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredInvoices.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                                            No invoices found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredInvoices.map((invoice) => (
                                        <TableRow key={invoice.id} className="hover:bg-muted/50">
                                            <TableCell className="font-mono font-medium">{invoice.invoice_number}</TableCell>
                                            <TableCell>{formatDate(invoice.created_at)}</TableCell>
                                            <TableCell>{invoice.patient_first_name} {invoice.patient_last_name}</TableCell>
                                            <TableCell>{invoice.patient_mrn}</TableCell>
                                            <TableCell>{formatCurrency(invoice.total_amount)}</TableCell>
                                            <TableCell className="text-red-600">{invoice.discount_amount > 0 ? `-${formatCurrency(invoice.discount_amount)}` : '-'}</TableCell>
                                            <TableCell className="font-semibold">{formatCurrency(invoice.net_amount)}</TableCell>
                                            <TableCell>
                                                <Badge className={getStatusColor(invoice.status)}>{invoice.status}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="sm" onClick={() => navigate(`/cashier/invoices/${invoice.id}`)}>
                                                        <FileText className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => navigate(`/cashier/invoices/${invoice.id}/edit`)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    {invoice.status === 'pending' && (
                                                        <Button variant="ghost" size="sm" onClick={() => handleDeleteInvoice(invoice.id)}>
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* New Invoice Dialog */}
            <Dialog open={showNewInvoiceDialog} onOpenChange={setShowNewInvoiceDialog}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Create New Invoice</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* 1. Patient Selection */}
                        <div className="space-y-2">
                            <Label>Select Patient</Label>
                            <PatientSearchSelect
                                patients={patients}
                                selectedPatientId={selectedPatientId}
                                onSelectPatient={setSelectedPatientId}
                                loading={false}
                            />
                        </div>

                        {/* 2. Service Selection */}
                        <div className="p-4 border rounded-lg bg-muted/20 space-y-4">
                            <h3 className="font-medium text-sm">Add Services</h3>
                            <div className="flex gap-4 items-end">
                                <div className="flex-1 space-y-2">
                                    <Label>Service / Item</Label>
                                    <ServiceSearchCombobox
                                        value={selectedService}
                                        onSelect={setSelectedService}
                                        placeholder="Type 3+ chars to search services..."
                                        showPrice={true}
                                    />
                                </div>
                                <div className="w-24 space-y-2">
                                    <Label>Quantity</Label>
                                    <Input
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                    />
                                </div>
                                <Button onClick={handleAddService} disabled={!selectedService}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add
                                </Button>
                            </div>
                        </div>

                        {/* 3. Bill Items List */}
                        <Card>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Service</TableHead>
                                            <TableHead className="w-24">Qty</TableHead>
                                            <TableHead className="w-32 text-right">Unit Price</TableHead>
                                            <TableHead className="w-32 text-right">Total</TableHead>
                                            <TableHead className="w-12"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {billItems.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                    No items added. Search services above.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            billItems.map(item => (
                                                <TableRow key={item.id}>
                                                    <TableCell className="font-medium">{item.service.name}</TableCell>
                                                    <TableCell>{item.quantity}</TableCell>
                                                    <TableCell className="text-right">{formatCurrency(item.unit_price)}</TableCell>
                                                    <TableCell className="text-right font-bold">{formatCurrency(item.total)}</TableCell>
                                                    <TableCell>
                                                        <Button variant="ghost" size="sm" onClick={() => handleRemoveItem(item.id)}>
                                                            <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                        {billItems.length > 0 && (
                                            <TableRow className="bg-muted/50 font-bold">
                                                <TableCell colSpan={3} className="text-right">Total Amount:</TableCell>
                                                <TableCell className="text-right text-lg">{formatCurrency(calculateTotal())}</TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowNewInvoiceDialog(false)}>Cancel</Button>
                        <Button
                            onClick={handleCreateInvoice}
                            disabled={isSubmitting || !selectedPatientId || billItems.length === 0}
                        >
                            {isSubmitting ? (
                                <>
                                    <LoadingSpinner className="mr-2 h-4 w-4" />
                                    Creating...
                                </>
                            ) : (
                                'Create Invoice'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default BillingPage;
