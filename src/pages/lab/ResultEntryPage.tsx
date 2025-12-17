import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, FileText, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { ApiService } from '@/services/apiService';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ResultEntryModal from '@/components/lab/ResultEntryModal';

interface LabOrder {
    id: string;
    patient_first_name: string;
    patient_last_name: string;
    patient_mrn: string;
    test_type: string;
    test_name: string;
    order_date: string;
    status: string;
    critical_values: boolean;
}

export default function ResultEntryPage() {
    const [activeTab, setActiveTab] = useState('pending');
    const [loading, setLoading] = useState(true);
    const [orders, setOrders] = useState<LabOrder[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<LabOrder | null>(null);
    const [isResultModalOpen, setIsResultModalOpen] = useState(false);

    useEffect(() => {
        loadOrders();
    }, [activeTab]);

    const loadOrders = async () => {
        try {
            setLoading(true);
            let data;
            if (activeTab === 'pending') {
                data = await ApiService.getPendingLabOrders();
            } else {
                data = await ApiService.getLabResults({ status: 'completed' });
            }
            setOrders(data);
        } catch (error) {
            console.error('Error loading lab orders:', error);
            toast.error('Failed to load lab orders');
        } finally {
            setLoading(false);
        }
    };

    const handleEnterResults = (order: LabOrder) => {
        setSelectedOrder(order);
        setIsResultModalOpen(true);
    };

    const filteredOrders = orders.filter(order => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            order.patient_first_name?.toLowerCase().includes(query) ||
            order.patient_last_name?.toLowerCase().includes(query) ||
            order.patient_mrn?.toLowerCase().includes(query) ||
            order.test_name?.toLowerCase().includes(query)
        );
    });

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Lab Result Entry</h1>
                    <p className="text-muted-foreground mt-1">Enter and verify laboratory test results</p>
                </div>
            </div>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle>Search Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            className="pl-10"
                            placeholder="Search by patient name, MRN, or test name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </CardContent>
            </Card>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 mb-6 w-[400px]">
                    <TabsTrigger value="pending">Pending Results</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>

                <TabsContent value="pending">
                    <Card>
                        <CardContent className="p-0">
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Order Date</TableHead>
                                            <TableHead>Patient</TableHead>
                                            <TableHead>Test Type</TableHead>
                                            <TableHead>Test Name</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="h-24 text-center">
                                                    <LoadingSpinner />
                                                </TableCell>
                                            </TableRow>
                                        ) : filteredOrders.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                                    No pending orders found
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredOrders.map((order) => (
                                                <TableRow key={order.id}>
                                                    <TableCell className="whitespace-nowrap">
                                                        {new Date(order.order_date).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>
                                                            <div className="font-medium">{order.patient_first_name} {order.patient_last_name}</div>
                                                            <div className="text-xs text-muted-foreground">{order.patient_mrn}</div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{order.test_type}</TableCell>
                                                    <TableCell>{order.test_name}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="text-orange-600 bg-orange-50 border-orange-200">
                                                            {order.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleEnterResults(order)}
                                                        >
                                                            <FileText className="mr-2 h-4 w-4" /> Enter Results
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

                <TabsContent value="completed">
                    <Card>
                        <CardContent className="p-0">
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Result Date</TableHead>
                                            <TableHead>Patient</TableHead>
                                            <TableHead>Test Name</TableHead>
                                            <TableHead>Critical</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="h-24 text-center">
                                                    <LoadingSpinner />
                                                </TableCell>
                                            </TableRow>
                                        ) : filteredOrders.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                                    No completed results found
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredOrders.map((order) => (
                                                <TableRow key={order.id}>
                                                    <TableCell className="whitespace-nowrap">
                                                        {new Date(order.order_date).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div>
                                                            <div className="font-medium">{order.patient_first_name} {order.patient_last_name}</div>
                                                            <div className="text-xs text-muted-foreground">{order.patient_mrn}</div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{order.test_name}</TableCell>
                                                    <TableCell>
                                                        {order.critical_values && (
                                                            <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                                                                <AlertCircle className="h-3 w-3" /> Critical
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleEnterResults(order)}
                                                        >
                                                            View Results
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
            </Tabs>

            <ResultEntryModal
                isOpen={isResultModalOpen}
                onClose={() => setIsResultModalOpen(false)}
                order={selectedOrder}
                onResultSaved={loadOrders}
            />
        </div>
    );
}
