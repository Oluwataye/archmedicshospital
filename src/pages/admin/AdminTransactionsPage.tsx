import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Filter, RefreshCw, Download, Eye, Ban, RotateCcw, CheckCircle, XCircle, Printer, Plus } from "lucide-react";
import { ApiService } from '@/services/apiService';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { toast } from 'sonner';
import ReceiptModal from '@/components/cashier/ReceiptModal';

export default function AdminTransactionsPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [reprintLogs, setReprintLogs] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState('transactions');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Modal states
    const [isVoidModalOpen, setIsVoidModalOpen] = useState(false);
    const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
    const [actionReason, setActionReason] = useState('');
    const [refundAmount, setRefundAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Receipt Modal State
    const [isReceiptOpen, setIsReceiptOpen] = useState(false);
    const [receiptData, setReceiptData] = useState<any>(null);

    useEffect(() => {
        fetchData();
    }, [activeTab, statusFilter]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'transactions') {
                const params: any = { search: searchTerm };
                if (statusFilter !== 'all') params.status = statusFilter;
                const data = await ApiService.get('/transactions', { params });
                setTransactions(data.transactions);
            } else if (activeTab === 'reprints') {
                const data = await ApiService.get('/audit', { params: { action: 'reprint' } });
                setReprintLogs(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    // ... (Void logic remains)

    const handleCreateRefund = async () => {
        if (!selectedTransaction || !actionReason || !refundAmount) return;

        try {
            setIsSubmitting(true);
            // Uses /transactions/refunds for creation, but now that endpoint is fixed to use payment_id
            // ideally we should use /api/refunds (POST)?
            // But /api/refunds POST expects { payment_id, ... }.
            // selectedTransaction has ID (transaction_id).
            // So we KEEP calling /transactions/refunds because backend handles lookup logic!
            await ApiService.post('/transactions/refunds', {
                transactionId: selectedTransaction.id,
                amount: parseFloat(refundAmount),
                reason: actionReason
            });
            toast.success('Refund request created successfully');
            setIsRefundModalOpen(false);
            setActionReason('');
            setRefundAmount('');
            fetchData();
        } catch (error) {
            console.error('Error creating refund:', error);
            toast.error('Failed to create refund request');
        } finally {
            setIsSubmitting(false);
        }
    };



    const handlePrintReceipt = async (tx: any) => {
        // LOGGING REPRINT
        try {
            await ApiService.post('/audit/log', {
                action: 'reprint',
                resource_type: 'transaction',
                resource_id: tx.id,
                details: { reason: 'Admin Reprint', invoice: tx.invoice_number }
            });
        } catch (err) {
            console.error("Failed to log reprint", err);
            // Proceed anyway? Yes, vital to print.
        }

        // Format data for ReceiptModal
        const data = {
            receiptNumber: tx.invoice_number || `REC-${tx.id}`,
            date: tx.transaction_date,
            patientName: tx.patient_name,
            patientId: "N/A",
            items: tx.items || [],
            totalAmount: tx.total_amount,
            discount: 0,
            netAmount: tx.total_amount,
            paymentMethod: tx.payment_method || 'Cash',
            cashierName: tx.cashier_name
        };

        setReceiptData(data);
        setIsReceiptOpen(true);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const handleVoidTransaction = async () => {
        if (!selectedTransaction || !actionReason) return;
        setIsSubmitting(true);
        try {
            await ApiService.post(`/transactions/${selectedTransaction.id}/void`, { reason: actionReason });
            toast.success('Transaction voided successfully');
            setIsVoidModalOpen(false);
            setActionReason('');
            fetchData();
        } catch (error) {
            console.error('Error voiding transaction:', error);
            toast.error('Failed to void transaction');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 p-6 pb-16 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Transaction Management</h1>
                    <p className="text-muted-foreground">Manage transactions, voids, and refund requests</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={() => navigate('/admin/cashier')}
                    >
                        <Plus className="mr-2 h-4 w-4" /> New Transaction
                    </Button>
                    <Button variant="outline" size="icon" onClick={fetchData}>
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" onClick={() => {
                        try {
                            // Define headers
                            const headers = ['Date', 'Invoice #', 'Patient', 'Cashier', 'Amount', 'Status'];

                            // Map data
                            const csvContent = [
                                headers.join(','),
                                ...transactions.map(tx => [
                                    new Date(tx.transaction_date).toLocaleDateString(),
                                    tx.invoice_number || tx.reference_number || '-',
                                    `"${tx.patient_name || 'Walk-in'}"`,
                                    `"${tx.cashier_name || 'System'}"`,
                                    tx.total_amount,
                                    tx.voided ? 'Voided' : 'Completed'
                                ].join(','))
                            ].join('\n');

                            // Create blob and download
                            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                            const link = document.createElement('a');
                            if (link.download !== undefined) {
                                const url = URL.createObjectURL(blob);
                                link.setAttribute('href', url);
                                link.setAttribute('download', `transactions_export_${new Date().toISOString().split('T')[0]}.csv`);
                                link.style.visibility = 'hidden';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                toast.success('Transactions exported successfully');
                            }
                        } catch (err) {
                            console.error('Export failed', err);
                            toast.error('Failed to export transactions');
                        }
                    }}>
                        <Download className="mr-2 h-4 w-4" /> Export
                    </Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="transactions">All Transactions</TabsTrigger>
                    <TabsTrigger value="reprints">Reprint Logs</TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-4 mb-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search invoice or patient..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && fetchData()}
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            {activeTab === 'transactions' ? (
                                <>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="voided">Voided</SelectItem>
                                </>
                            ) : (
                                <></>
                            )}
                        </SelectContent>
                    </Select>
                </div>

                <TabsContent value="transactions">
                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Invoice #</TableHead>
                                        <TableHead>Patient</TableHead>
                                        <TableHead>Cashier</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-8"><LoadingSpinner /></TableCell>
                                        </TableRow>
                                    ) : transactions.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No transactions found</TableCell>
                                        </TableRow>
                                    ) : (
                                        transactions.map((tx) => (
                                            <TableRow key={tx.id} className={tx.voided ? 'bg-muted/50' : ''}>
                                                <TableCell>{formatDate(tx.transaction_date)}</TableCell>
                                                <TableCell className="font-medium">{tx.invoice_number}</TableCell>
                                                <TableCell>{tx.patient_name}</TableCell>
                                                <TableCell>{tx.cashier_name}</TableCell>
                                                <TableCell>{formatCurrency(tx.total_amount)}</TableCell>
                                                <TableCell>
                                                    {tx.voided ? (
                                                        <Badge variant="destructive">Voided</Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {!tx.voided && (
                                                        <div className="flex justify-end gap-2">
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button variant="ghost" size="sm" onClick={() => handlePrintReceipt(tx)}>
                                                                            <Printer className="h-4 w-4 text-blue-500" />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>Print Receipt</p>
                                                                    </TooltipContent>
                                                                </Tooltip>

                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button variant="ghost" size="sm" onClick={() => {
                                                                            setSelectedTransaction(tx);
                                                                            setRefundAmount(tx.total_amount.toString());
                                                                            setIsRefundModalOpen(true);
                                                                        }}>
                                                                            <RotateCcw className="h-4 w-4 text-orange-500" />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>Request Refund</p>
                                                                    </TooltipContent>
                                                                </Tooltip>

                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button variant="ghost" size="sm" onClick={() => {
                                                                            setSelectedTransaction(tx);
                                                                            setIsVoidModalOpen(true);
                                                                        }}>
                                                                            <Ban className="h-4 w-4 text-red-500" />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>Void Transaction</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        </div>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>



                <TabsContent value="reprints">
                    <Card>
                        <CardHeader>
                            <CardTitle>Reprint History</CardTitle>
                            <CardDescription>Log of all receipts reprinted by staff</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>User</TableHead>
                                        <TableHead>Details</TableHead>
                                        <TableHead>Resource ID</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reprintLogs.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No reprint logs found</TableCell>
                                        </TableRow>
                                    ) : (
                                        reprintLogs.map((log: any) => (
                                            <TableRow key={log.id}>
                                                <TableCell>{formatDate(log.created_at)}</TableCell>
                                                <TableCell>{log.firstName} {log.lastName} ({log.username})</TableCell>
                                                <TableCell>{log.new_values ? JSON.parse(log.new_values).reason || '-' : '-'}</TableCell>
                                                <TableCell>{log.resource_id}</TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Modals ... */}
            <Dialog open={isVoidModalOpen} onOpenChange={setIsVoidModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Void Transaction</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to void invoice #{selectedTransaction?.invoice_number || selectedTransaction?.reference_number}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    {/* ... content ... */}
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Reason for Voiding</Label>
                            <Textarea
                                value={actionReason}
                                onChange={(e) => setActionReason(e.target.value)}
                                placeholder="Please explain why this transaction is being voided..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsVoidModalOpen(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleVoidTransaction} disabled={isSubmitting || !actionReason}>
                            {isSubmitting && <LoadingSpinner className="mr-2 h-4 w-4" />}
                            Confirm Void
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create Refund Modal */}
            <Dialog open={isRefundModalOpen} onOpenChange={setIsRefundModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Request Refund</DialogTitle>
                        <DialogDescription>
                            Create a refund request for invoice #{selectedTransaction?.invoice_number || selectedTransaction?.reference_number}.
                        </DialogDescription>
                    </DialogHeader>
                    {/* ... content ... */}
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Refund Amount (Max: {selectedTransaction && formatCurrency(selectedTransaction.total_amount)})</Label>
                            <Input
                                type="number"
                                value={refundAmount}
                                onChange={(e) => setRefundAmount(e.target.value)}
                                max={selectedTransaction?.total_amount}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Reason for Refund</Label>
                            <Textarea
                                value={actionReason}
                                onChange={(e) => setActionReason(e.target.value)}
                                placeholder="Please explain why a refund is required..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRefundModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateRefund} disabled={isSubmitting || !actionReason || !refundAmount}>
                            {isSubmitting && <LoadingSpinner className="mr-2 h-4 w-4" />}
                            Submit Request
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <ReceiptModal
                open={isReceiptOpen}
                onOpenChange={setIsReceiptOpen}
                data={receiptData}
            />
        </div>
    );
}
