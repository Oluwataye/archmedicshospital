import React, { useState, useEffect } from 'react';
import { Plus, Search, Eye, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ApiService } from '@/services/apiService';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Patient } from '@/types/patient';

interface LabOrder {
    id: string;
    patient_id: string;
    patient_name?: string;
    test_type: string;
    test_name: string;
    order_date: string;
    status: string;
    critical_values: boolean;
}

const LAB_TEST_TYPES = [
    { value: 'hematology', label: 'Hematology' },
    { value: 'biochemistry', label: 'Biochemistry' },
    { value: 'microbiology', label: 'Microbiology' },
    { value: 'immunology', label: 'Immunology' },
    { value: 'pathology', label: 'Pathology' },
];

const COMMON_TESTS = {
    hematology: ['Complete Blood Count (CBC)', 'ESR', 'Blood Group', 'Hemoglobin', 'Platelet Count'],
    biochemistry: ['Fasting Blood Sugar', 'Lipid Profile', 'Liver Function Test', 'Kidney Function Test', 'Electrolytes'],
    microbiology: ['Blood Culture', 'Urine Culture', 'Stool Culture', 'Sputum Culture'],
    immunology: ['HIV Test', 'Hepatitis Panel', 'Thyroid Function Test'],
    pathology: ['Biopsy', 'Cytology', 'Histopathology'],
};

export default function DoctorLabOrdersPage() {
    const [labOrders, setLabOrders] = useState<LabOrder[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<LabOrder | null>(null);
    const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
    const [formData, setFormData] = useState({
        patient_id: '',
        test_type: '',
        test_name: '',
        notes: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [ordersResponse, patientsResponse] = await Promise.all([
                ApiService.getLabResults(),
                ApiService.getPatients()
            ]);

            const ordersData = ordersResponse.data || [];
            const mappedOrders: LabOrder[] = ordersData.map((order: any) => ({
                id: order.id,
                patient_id: order.patient_id,
                patient_name: order.patient_first_name && order.patient_last_name
                    ? `${order.patient_first_name} ${order.patient_last_name}`
                    : 'Unknown',
                test_type: order.test_type || 'general',
                test_name: order.test_name,
                order_date: order.order_date,
                status: order.status,
                critical_values: order.is_critical || false
            }));

            setLabOrders(mappedOrders);
            setPatients(patientsResponse.data || []);
        } catch (error) {
            console.error('Error loading data:', error);
            toast.error('Failed to load lab orders');
        } finally {
            setLoading(false);
        }
    };

    const filteredOrders = labOrders.filter(order =>
        searchQuery === '' ||
        order.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.test_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.test_type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status: string): "default" | "destructive" | "outline" | "secondary" => {
        switch (status.toLowerCase()) {
            case 'completed':
                return 'default';
            case 'pending':
                return 'secondary';
            case 'in_progress':
                return 'outline';
            case 'cancelled':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Check for HMO authorization
            const patient = patients.find(p => String(p.id) === formData.patient_id);
            if (patient?.hmo_provider_id) {
                const authCheck = await import('@/services/preauthService').then(m => m.default.checkActiveAuthorization(String(patient.id)));
                if (!authCheck.has_active_authorization) {
                    toast.error('Patient requires a valid HMO authorization to access services');
                    return;
                }
            }

            const orderData = {
                patient_id: formData.patient_id,
                test_type: formData.test_type,
                test_name: formData.test_name,
                notes: formData.notes,
                status: 'pending',
                order_date: new Date().toISOString()
            };

            await ApiService.createLabOrder(orderData);
            toast.success('Lab order created successfully', {
                description: "Please direct the patient to the Cashier for payment.",
                duration: 5000,
            });
            setIsModalOpen(false);
            setFormData({ patient_id: '', test_type: '', test_name: '', notes: '' });
            loadData();
        } catch (error) {
            console.error('Error creating lab order:', error);
            toast.error('Failed to create lab order');
        }
    };

    const handleViewDetails = (order: LabOrder) => {
        setSelectedOrder(order);
        setIsViewDetailsOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Lab Orders</h1>
                    <div className="text-sm text-gray-500 flex items-center mt-1">
                        <span>Doctor Dashboard</span>
                        <span className="mx-2">›</span>
                        <span className="text-blue-500">Lab Orders</span>
                    </div>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Lab Order
                </Button>
            </div>

            <Card>
                <CardContent className="p-6">
                    {/* Search Bar */}
                    <div className="flex gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search lab orders..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

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
                            {filteredOrders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                        No lab orders found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredOrders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="whitespace-nowrap">
                                            {format(new Date(order.order_date), 'MMM d, yyyy')}
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{order.patient_name}</div>
                                        </TableCell>
                                        <TableCell className="capitalize">{order.test_type}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {order.test_name}
                                                {order.critical_values && (
                                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusColor(order.status)} className="capitalize">
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                title="View Details"
                                                onClick={() => handleViewDetails(order)}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                {/* ... (keep existing New Lab Order Dialog) */}
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>New Lab Order</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSave} className="space-y-4">
                        {/* ... (keep existing form fields) */}
                        <div className="space-y-2">
                            <Label htmlFor="patient_id">Patient</Label>
                            <Select
                                value={formData.patient_id}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, patient_id: value }))}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select patient" />
                                </SelectTrigger>
                                <SelectContent>
                                    {patients.map((patient) => (
                                        <SelectItem key={patient.id} value={String(patient.id)}>
                                            {patient.first_name} {patient.last_name} (MRN: {patient.mrn})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="test_type">Test Type</Label>
                            <Select
                                value={formData.test_type}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, test_type: value, test_name: '' }))}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select test type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {LAB_TEST_TYPES.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {formData.test_type && (
                            <div className="space-y-2">
                                <Label htmlFor="test_name">Test Name</Label>
                                <Select
                                    value={formData.test_name}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, test_name: value }))}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select test" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {COMMON_TESTS[formData.test_type as keyof typeof COMMON_TESTS]?.map((test) => (
                                            <SelectItem key={test} value={test}>
                                                {test}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="notes">Clinical Notes</Label>
                            <Textarea
                                id="notes"
                                value={formData.notes}
                                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                                placeholder="Enter clinical indication or special instructions..."
                                rows={3}
                            />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                Create Order
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* View Details Dialog */}
            <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Lab Order Details</DialogTitle>
                    </DialogHeader>
                    {selectedOrder && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-muted-foreground">Patient</Label>
                                    <p className="font-medium">{selectedOrder.patient_name}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Order Date</Label>
                                    <p className="font-medium">{format(new Date(selectedOrder.order_date), 'PPP')}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Test Type</Label>
                                    <p className="font-medium capitalize">{selectedOrder.test_type}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Test Name</Label>
                                    <p className="font-medium">{selectedOrder.test_name}</p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Status</Label>
                                    <div className="mt-1">
                                        <Badge variant={getStatusColor(selectedOrder.status)} className="capitalize">
                                            {selectedOrder.status}
                                        </Badge>
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Critical Values</Label>
                                    <div className="mt-1">
                                        {selectedOrder.critical_values ? (
                                            <Badge variant="destructive">Yes</Badge>
                                        ) : (
                                            <Badge variant="outline">No</Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={() => setIsViewDetailsOpen(false)}>Close</Button>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
