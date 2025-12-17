import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, TestTube, Clock, CheckCircle, AlertTriangle, FileText, CreditCard } from 'lucide-react';
import { usePendingLabOrders, useLabResults } from '@/hooks/useLabHooks';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';

const LabWorklistPage = () => {
    const { orders, loading, refetch } = usePendingLabOrders();
    const { updateResult, billOrder } = useLabResults();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [isResultModalOpen, setIsResultModalOpen] = useState(false);

    // Result Form State
    const [resultValue, setResultValue] = useState('');
    const [resultUnit, setResultUnit] = useState('');
    const [referenceRange, setReferenceRange] = useState('');
    const [abnormalFlag, setAbnormalFlag] = useState('normal');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const filteredOrders = orders.filter(order =>
        order.patient_first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.patient_last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.test_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.patient_mrn?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenResultModal = (order: any) => {
        setSelectedOrder(order);
        setResultValue('');
        setResultUnit(order.result_unit || ''); // Pre-fill if available from definition
        setReferenceRange(order.reference_range || '');
        setAbnormalFlag('normal');
        setNotes('');
        setIsResultModalOpen(true);
    };

    const handleSendToCashier = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent row click
        try {
            await billOrder(id);
            // billOrder shows toast
            refetch();
        } catch (error) {
            console.error('Failed to send to cashier:', error);
            // toast error handled in hook
        }
    };

    const handleSubmitResult = async () => {
        if (!resultValue) {
            toast.error('Result value is required');
            return;
        }

        try {
            setIsSubmitting(true);
            await updateResult(selectedOrder.id, {
                result_value: resultValue,
                result_unit: resultUnit,
                reference_range: referenceRange,
                abnormal_flag: abnormalFlag,
                comments: notes,
                status: 'completed',
                result_date: new Date().toISOString()
            });

            toast.success('Result submitted successfully');
            setIsResultModalOpen(false);
            refetch(); // Refresh the list
        } catch (error) {
            console.error('Failed to submit result:', error);
            toast.error('Failed to submit result');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Lab Worklist</h1>
                    <p className="text-gray-500">Manage pending tests and enter results</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                            placeholder="Search patient or test..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-700 uppercase font-medium">
                                <tr>
                                    <th className="px-6 py-3">Patient</th>
                                    <th className="px-6 py-3">Test Details</th>
                                    <th className="px-6 py-3">Order Date</th>
                                    <th className="px-6 py-3">Priority</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                            Loading worklist...
                                        </td>
                                    </tr>
                                ) : filteredOrders.length > 0 ? (
                                    filteredOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">
                                                    {order.patient_first_name} {order.patient_last_name}
                                                </div>
                                                <div className="text-xs text-gray-500">{order.patient_mrn}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-indigo-600">{order.test_name}</div>
                                                <div className="text-xs text-gray-500">{order.test_category}</div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {format(parseISO(order.order_date), 'MMM d, h:mm a')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {order.priority === 'urgent' ? (
                                                    <Badge variant="destructive" className="flex w-fit items-center gap-1">
                                                        <AlertTriangle className="h-3 w-3" /> Urgent
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                                                        Routine
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={(e) => handleSendToCashier(String(order.id), e)}
                                                    className="mr-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                    title="Send to Cashier"
                                                >
                                                    <CreditCard className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleOpenResultModal(order)}
                                                    className="bg-indigo-600 hover:bg-indigo-700"
                                                >
                                                    <TestTube className="h-4 w-4 mr-2" />
                                                    Enter Result
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <CheckCircle className="h-12 w-12 text-green-100 mb-3" />
                                                <p className="font-medium">All caught up!</p>
                                                <p className="text-sm">No pending orders found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Result Entry Modal */}
            <Dialog open={isResultModalOpen} onOpenChange={setIsResultModalOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Enter Lab Results</DialogTitle>
                        <DialogDescription>
                            Enter the test results, reference range, and interpretation below.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedOrder && (
                        <div className="space-y-4 py-4">
                            <div className="bg-gray-50 p-3 rounded-lg text-sm space-y-1">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Patient:</span>
                                    <span className="font-medium">{selectedOrder.patient_first_name} {selectedOrder.patient_last_name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Test:</span>
                                    <span className="font-medium text-indigo-600">{selectedOrder.test_name}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Result Value</Label>
                                    <Input
                                        value={resultValue}
                                        onChange={(e) => setResultValue(e.target.value)}
                                        placeholder="Enter value"
                                        autoFocus
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Unit</Label>
                                    <Input
                                        value={resultUnit}
                                        onChange={(e) => setResultUnit(e.target.value)}
                                        placeholder="e.g. mg/dL"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Reference Range</Label>
                                <Input
                                    value={referenceRange}
                                    onChange={(e) => setReferenceRange(e.target.value)}
                                    placeholder="e.g. 70 - 100"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Flag</Label>
                                <Select value={abnormalFlag} onValueChange={setAbnormalFlag}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="normal">Normal</SelectItem>
                                        <SelectItem value="high">High (H)</SelectItem>
                                        <SelectItem value="low">Low (L)</SelectItem>
                                        <SelectItem value="critical">Critical (!)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Comments / Notes</Label>
                                <Textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Add any additional observations..."
                                    rows={3}
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsResultModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmitResult} disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700">
                            {isSubmitting ? 'Submitting...' : 'Submit Result'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default LabWorklistPage;
