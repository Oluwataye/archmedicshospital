import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, RefreshCw, Download, Eye, User, Calendar, CreditCard, DollarSign } from "lucide-react";
import { ApiService } from '@/services/apiService';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { toast } from 'sonner';

export default function CashierActivityPage() {
    const [loading, setLoading] = useState(true);
    const [liveTransactions, setLiveTransactions] = useState<any[]>([]);
    const [cashierPerformance, setCashierPerformance] = useState<any[]>([]);
    const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('live');
    const [dateRange, setDateRange] = useState({
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchData();
        // Poll for live updates every 30 seconds only on live tab
        let interval: NodeJS.Timeout;
        if (activeTab === 'live') {
            interval = setInterval(fetchLiveTransactions, 30000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [activeTab, dateRange]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'live') {
                await fetchLiveTransactions();
            } else {
                await fetchPerformance();
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchLiveTransactions = async () => {
        try {
            // Live transactions usually just show recent, but we can respect filters if needed
            // For now, let's keep live as 'recent' (limit 20) as per backend default
            // but if user wants to filter live feed history, we could pass params.
            // The backend endpoint accepts limit, but not date range for /live.
            // So we just call it as is for "Live Feed".
            const data = await ApiService.get('/cashier/live');
            setLiveTransactions(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching live transactions:', error);
            setLiveTransactions([]);
        }
    };

    const fetchPerformance = async () => {
        try {
            const params = new URLSearchParams({
                startDate: dateRange.startDate,
                endDate: dateRange.endDate
            });
            const data = await ApiService.get(`/cashier/performance?${params.toString()}`);
            setCashierPerformance(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching performance:', error);
            toast.error('Failed to load performance data');
            setCashierPerformance([]);
        }
    };

    const handleViewDetails = async (id: number) => {
        try {
            const details = await ApiService.get(`/cashier/${id}/details`);
            setSelectedTransaction(details);
            setIsDetailsModalOpen(true);
        } catch (error) {
            console.error('Error fetching transaction details:', error);
            toast.error('Failed to load transaction details');
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount || 0);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString();
    };

    return (
        <div className="space-y-6 p-6 pb-16 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Cashier Activity Monitor</h1>
                    <p className="text-muted-foreground">Live transaction feed and cashier performance tracking</p>
                </div>
                <div className="flex gap-2 items-center">
                    {activeTab === 'performance' && (
                        <div className="flex items-center gap-2 mr-2">
                            <Input
                                type="date"
                                value={dateRange.startDate}
                                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                                className="w-auto"
                            />
                            <span className="text-muted-foreground">-</span>
                            <Input
                                type="date"
                                value={dateRange.endDate}
                                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                                className="w-auto"
                            />
                        </div>
                    )}
                    <Button variant="outline" size="icon" onClick={fetchData} title="Refresh Data">
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="live">Live Transactions</TabsTrigger>
                    <TabsTrigger value="performance">Cashier Performance</TabsTrigger>
                </TabsList>

                <TabsContent value="live" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Transactions</CardTitle>
                            <CardDescription>Real-time feed of all processed payments</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Time</TableHead>
                                            <TableHead>Invoice #</TableHead>
                                            <TableHead>Patient</TableHead>
                                            <TableHead>Cashier</TableHead>
                                            <TableHead>Method</TableHead>
                                            <TableHead className="text-right">Amount</TableHead>
                                            <TableHead className="text-center">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading && liveTransactions.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center py-8">
                                                    <LoadingSpinner />
                                                </TableCell>
                                            </TableRow>
                                        ) : liveTransactions.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                                    No recent transactions found
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            liveTransactions.map((tx) => (
                                                <TableRow key={tx.id}>
                                                    <TableCell className="font-medium">
                                                        {new Date(tx.transaction_date).toLocaleTimeString()}
                                                    </TableCell>
                                                    <TableCell>{tx.invoice_number || tx.reference_number || 'N/A'}</TableCell>
                                                    <TableCell>{tx.patient_name || 'Walk-in'}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">{tx.cashier_name || 'Unknown'}</Badge>
                                                    </TableCell>
                                                    <TableCell>{tx.payment_method}</TableCell>
                                                    <TableCell className="text-right font-bold">
                                                        {formatCurrency(tx.total_amount)}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Button variant="ghost" size="sm" onClick={() => handleViewDetails(tx.id)}>
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="performance" className="space-y-4">
                    {loading && cashierPerformance.length === 0 ? (
                        <div className="flex justify-center py-12">
                            <LoadingSpinner />
                        </div>
                    ) : cashierPerformance.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                <User className="h-12 w-12 mb-4 opacity-20" />
                                <p>No performance data found for the selected period</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {cashierPerformance.map((cashier) => (
                                <Card key={cashier.id || Math.random()} className="card-accent-blue hover:shadow-lg transition-all hover:scale-105">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h3 className="font-bold text-lg">{cashier.name || 'Unknown Cashier'}</h3>
                                                <p className="text-xs text-muted-foreground">Cashier</p>
                                            </div>
                                            <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center">
                                                <User className="h-5 w-5 text-blue-600" />
                                            </div>
                                        </div>

                                        <div className="text-3xl font-bold text-blue-600 mb-4">{formatCurrency(cashier.total_revenue)}</div>

                                        <div className="space-y-3 text-sm">
                                            <div className="grid grid-cols-2 gap-2 text-muted-foreground text-xs uppercase tracking-wider font-semibold mb-1">
                                                <span>Metric</span>
                                                <span className="text-right">Value</span>
                                            </div>
                                            <div className="flex justify-between border-b pb-2">
                                                <span className="text-muted-foreground">Transactions</span>
                                                <span className="font-medium">{cashier.total_transactions}</span>
                                            </div>
                                            <div className="flex justify-between border-b pb-2">
                                                <span className="text-muted-foreground">Avg. Value</span>
                                                <span className="font-medium">{formatCurrency(cashier.avg_transaction_value)}</span>
                                            </div>

                                            <div className="pt-2">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Cash</span>
                                                    <span className="font-medium">{formatCurrency(cashier.cash_total)}</span>
                                                </div>
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Card</span>
                                                    <span className="font-medium">{formatCurrency(cashier.card_total)}</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Transfer</span>
                                                    <span className="font-medium">{formatCurrency(cashier.transfer_total)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* Transaction Details Modal */}
            <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Transaction Details</DialogTitle>
                        <DialogDescription>
                            Invoice #{selectedTransaction?.invoice_number || selectedTransaction?.reference_number}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedTransaction && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-muted-foreground">Date:</span>
                                    <div className="font-medium">{formatDate(selectedTransaction.transaction_date)}</div>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Cashier:</span>
                                    <div className="font-medium">{selectedTransaction.cashier_name}</div>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Patient:</span>
                                    <div className="font-medium">{selectedTransaction.patient_name}</div>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Payment Method:</span>
                                    <div className="font-medium">{selectedTransaction.payment_method}</div>
                                </div>
                            </div>

                            <div className="border rounded-md p-0 overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50">
                                            <TableHead>Service</TableHead>
                                            <TableHead className="text-right">Qty</TableHead>
                                            <TableHead className="text-right">Price</TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {selectedTransaction.items?.map((item: any, i: number) => (
                                            <TableRow key={i}>
                                                <TableCell>{item.service_name || item.name || 'Item'}</TableCell>
                                                <TableCell className="text-right">{item.quantity}</TableCell>
                                                <TableCell className="text-right">{formatCurrency(item.unit_price)}</TableCell>
                                                <TableCell className="text-right">{formatCurrency(item.total_price || (item.quantity * item.unit_price))}</TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow className="font-bold bg-muted/20">
                                            <TableCell colSpan={3} className="text-right">Total Amount</TableCell>
                                            <TableCell className="text-right">{formatCurrency(selectedTransaction.total_amount)}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
