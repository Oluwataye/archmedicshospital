import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Plus, Download, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { TableSkeleton } from '@/components/common/Skeletons';
import { usePayments } from '@/hooks/usePaymentsQuery';
import { useDebounce } from '@/hooks/useDebounce';
import { PaymentFilters, PaymentStatus, PaymentMethod } from '@/types/payment';

const PaymentsPage = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // Initialize state from URL params
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [statusFilter, setStatusFilter] = useState<PaymentStatus | 'all'>(
        (searchParams.get('status') as PaymentStatus) || 'all'
    );
    const [paymentMethodFilter, setPaymentMethodFilter] = useState<PaymentMethod | 'all'>(
        (searchParams.get('method') as PaymentMethod) || 'all'
    );
    const [dateFrom, setDateFrom] = useState(searchParams.get('dateFrom') || '');
    const [dateTo, setDateTo] = useState(searchParams.get('dateTo') || '');

    // Debounce search query
    const debouncedSearch = useDebounce(searchQuery, 300);

    // Sync URL with filters
    const updateUrlParams = useCallback((updates: Record<string, string | undefined>) => {
        const newParams = new URLSearchParams(searchParams);
        Object.entries(updates).forEach(([key, value]) => {
            if (value && value !== 'all') {
                newParams.set(key, value);
            } else {
                newParams.delete(key);
            }
        });
        setSearchParams(newParams);
    }, [searchParams, setSearchParams]);

    // Build filters object for API
    const filters = useMemo<PaymentFilters>(() => ({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        payment_method: paymentMethodFilter !== 'all' ? paymentMethodFilter : undefined,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
        search: debouncedSearch || undefined,
    }), [statusFilter, paymentMethodFilter, dateFrom, dateTo, debouncedSearch]);

    // Fetch payments using React Query
    const { data: payments = [], isLoading, error, refetch } = usePayments(filters);

    // Memoized filtered payments (client-side filtering for search)
    // Note: If backend filtering is working correctly, simple search filtering here is fine for now
    const filteredPayments = useMemo(() => {
        if (!searchQuery) return payments;

        const searchLower = searchQuery.toLowerCase();
        return payments.filter(payment =>
            payment.patient_first_name?.toLowerCase().includes(searchLower) ||
            payment.patient_last_name?.toLowerCase().includes(searchLower) ||
            payment.patient_mrn?.toLowerCase().includes(searchLower) ||
            payment.reference_number?.toLowerCase().includes(searchLower) ||
            payment.invoice_number?.toLowerCase().includes(searchLower)
        );
    }, [payments, searchQuery]);

    // Update filters wrappers
    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
        updateUrlParams({ search: query });
    }, [updateUrlParams]);

    const handleStatusChange = useCallback((status: string) => {
        setStatusFilter(status as PaymentStatus | 'all');
        updateUrlParams({ status });
    }, [updateUrlParams]);

    const handleMethodChange = useCallback((method: string) => {
        setPaymentMethodFilter(method as PaymentMethod | 'all');
        updateUrlParams({ method });
    }, [updateUrlParams]);

    const handleDateFromChange = useCallback((date: string) => {
        setDateFrom(date);
        updateUrlParams({ dateFrom: date });
    }, [updateUrlParams]);

    const handleDateToChange = useCallback((date: string) => {
        setDateTo(date);
        updateUrlParams({ dateTo: date });
    }, [updateUrlParams]);

    // Utility functions
    const getStatusColor = useCallback((status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'bg-green-100 text-green-800 hover:bg-green-100';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
            case 'failed':
                return 'bg-red-100 text-red-800 hover:bg-red-100';
            case 'refunded':
                return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
            default:
                return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
        }
    }, []);

    const formatCurrency = useCallback((amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN'
        }).format(amount);
    }, []);

    const formatDate = useCallback((dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }, []);

    // Handle export
    const handleExport = useCallback(() => {
        toast.info('Export functionality coming soon');
    }, []);

    // Show loading skeleton
    if (isLoading) {
        return (
            <div className="animate-in fade-in duration-500">
                <div className="text-muted-foreground text-sm mb-4">
                    Cashier &gt; Payments
                </div>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Payment Management</h1>
                        <p className="text-muted-foreground mt-1">Track and manage all payment transactions</p>
                    </div>
                </div>
                <Card>
                    <CardContent className="p-6">
                        <TableSkeleton rows={10} columns={9} />
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Card className="max-w-md">
                    <CardContent className="p-6 text-center space-y-4">
                        <p className="text-destructive">Failed to load payments</p>
                        <Button onClick={() => refetch()}>Try Again</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-500">
            {/* Breadcrumbs */}
            <div className="text-muted-foreground text-sm mb-4">
                Cashier &gt; Payments
            </div>

            {/* Page Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Payment Management</h1>
                    <p className="text-muted-foreground mt-1">Track and manage all payment transactions</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => navigate('/cashier')}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Back to Dashboard
                    </Button>
                    <Button onClick={() => navigate('/cashier/billing')}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Payment
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search payments..."
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Status Filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                            <option value="all">All Status</option>
                            <option value="completed">Completed</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                            <option value="refunded">Refunded</option>
                        </select>

                        {/* Payment Method Filter */}
                        <select
                            value={paymentMethodFilter}
                            onChange={(e) => handleMethodChange(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                            <option value="all">All Methods</option>
                            <option value="Cash">Cash</option>
                            <option value="Credit Card">Credit Card</option>
                            <option value="Insurance">Insurance</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                        </select>

                        {/* Date From */}
                        <Input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => handleDateFromChange(e.target.value)}
                            placeholder="From Date"
                        />

                        {/* Date To */}
                        <Input
                            type="date"
                            value={dateTo}
                            onChange={(e) => handleDateToChange(e.target.value)}
                            placeholder="To Date"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Payments Table */}
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Payment Transactions</CardTitle>
                        <Button variant="outline" size="sm" onClick={handleExport}>
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
                                    <TableHead>Date</TableHead>
                                    <TableHead>Patient</TableHead>
                                    <TableHead>MRN</TableHead>
                                    <TableHead>Invoice #</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead>Reference</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredPayments.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                                            No payments found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredPayments.map((payment) => (
                                        <TableRow key={payment.id} className="hover:bg-muted/50">
                                            <TableCell className="font-medium">
                                                {formatDate(payment.payment_date)}
                                            </TableCell>
                                            <TableCell>
                                                {payment.patient_first_name} {payment.patient_last_name}
                                            </TableCell>
                                            <TableCell>{payment.patient_mrn}</TableCell>
                                            <TableCell>
                                                {payment.invoice_number || '-'}
                                            </TableCell>
                                            <TableCell className="font-semibold">
                                                {formatCurrency(payment.amount)}
                                            </TableCell>
                                            <TableCell>{payment.payment_method}</TableCell>
                                            <TableCell className="font-mono text-sm">
                                                {payment.reference_number || '-'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={getStatusColor(payment.status)}>
                                                    {payment.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => navigate(`/cashier/payments/${payment.id}`)}
                                                >
                                                    View
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Summary */}
                    {filteredPayments.length > 0 && (
                        <div className="mt-4 pt-4 border-t flex justify-between items-center">
                            <div className="text-sm text-muted-foreground">
                                Showing {filteredPayments.length} payment{filteredPayments.length !== 1 ? 's' : ''}
                            </div>
                            <div className="text-sm font-semibold">
                                Total: {formatCurrency(
                                    filteredPayments
                                        .filter(p => p.status === 'completed')
                                        .reduce((sum, p) => sum + p.amount, 0)
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default PaymentsPage;
