
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, RefreshCw, Printer, RotateCcw } from "lucide-react";
import ApiService from '@/services/apiService';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { toast } from 'sonner';
import ReceiptModal from '@/components/cashier/ReceiptModal';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function CashierHistory() {
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
    const [actionReason, setActionReason] = useState('');
    const [refundAmount, setRefundAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isReceiptOpen, setIsReceiptOpen] = useState(false);
    const [receiptData, setReceiptData] = useState<any>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const params: any = { search: searchTerm };
            // Cashiers might only see their own? For now, let's show all or backend filters by user if needed.
            // But requirement is "Cashier can reprint", implying any transaction they have access to.
            const data = await ApiService.get('/transactions', { params });
            setTransactions(data.transactions || []);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            toast.error('Failed to load transactions');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateRefund = async () => {
        if (!selectedTransaction || !actionReason || !refundAmount) return;

        try {
            setIsSubmitting(true);
            await ApiService.post('/transactions/refunds', {
                transactionId: selectedTransaction.id,
                amount: parseFloat(refundAmount),
                reason: actionReason
            });
            toast.success('Refund request created successfully');
            setIsRefundModalOpen(false);
            setActionReason('');
            setRefundAmount('');
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
                details: { reason: 'Cashier Reprint', invoice: tx.invoice_number }
            });
        } catch (err) {
            console.error("Failed to log reprint", err);
        }

        const data = {
            receiptNumber: tx.invoice_number || `REC-${tx.id}`,
            date: tx.transaction_date,
            patientName: tx.patient_name,
            patientId: "N/A",
            items: tx.items || [], // Items logic might need enhancement if backend doesn't send items
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

    return (
        <div className="space-y-4">
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
                <Button variant="outline" size="icon" onClick={fetchData}>
                    <RefreshCw className="h-4 w-4" />
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Invoice #</TableHead>
                                <TableHead>Patient</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8"><LoadingSpinner /></TableCell>
                                </TableRow>
                            ) : transactions.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No transactions found</TableCell>
                                </TableRow>
                            ) : (
                                transactions.map((tx) => (
                                    <TableRow key={tx.id} className={tx.voided ? 'bg-muted/50' : ''}>
                                        <TableCell>{formatDate(tx.transaction_date)}</TableCell>
                                        <TableCell className="font-medium">{tx.reference_number || tx.invoice_number}</TableCell>
                                        <TableCell>{tx.patient_name}</TableCell>
                                        <TableCell>{formatCurrency(tx.total_amount)}</TableCell>
                                        <TableCell>
                                            {tx.voided ? <Badge variant="destructive">Voided</Badge> : <Badge variant="outline" className="text-green-600 border-green-200">Completed</Badge>}
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
                                                                <p>Reprint Receipt</p>
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

            <Dialog open={isRefundModalOpen} onOpenChange={setIsRefundModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Request Refund</DialogTitle>
                        <DialogDescription>
                            Request a refund for invoice #{selectedTransaction?.reference_number || selectedTransaction?.invoice_number}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Refund Amount</Label>
                            <Input
                                type="number"
                                value={refundAmount}
                                onChange={(e) => setRefundAmount(e.target.value)}
                                max={selectedTransaction?.total_amount}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Reason</Label>
                            <Textarea
                                value={actionReason}
                                onChange={(e) => setActionReason(e.target.value)}
                                placeholder="Reason for refund..."
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRefundModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateRefund} disabled={isSubmitting || !actionReason || !refundAmount}>Submit Request</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <ReceiptModal open={isReceiptOpen} onOpenChange={setIsReceiptOpen} data={receiptData} />
        </div>
    );
}
