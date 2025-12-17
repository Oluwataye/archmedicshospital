import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import ApiService from '@/services/apiService';
import ReceiptModal from '@/components/cashier/ReceiptModal';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ServiceSearchCombobox } from '@/components/common/ServiceSearchCombobox';

interface PaymentWorkspaceProps {
    initialPatientId?: string;
    onPaymentComplete?: () => void;
    className?: string;
}

const PaymentWorkspace: React.FC<PaymentWorkspaceProps> = ({
    initialPatientId,
    onPaymentComplete,
    className
}) => {
    const [loading, setLoading] = useState(false);
    const [patientInfo, setPatientInfo] = useState<{
        id: string;
        name: string;
        patientId?: string;
    }>({
        id: '',
        name: ''
    });

    const [patientSearchQuery, setPatientSearchQuery] = useState('');
    const [selectedServices, setSelectedServices] = useState<any[]>([]);
    const [discount, setDiscount] = useState({ applied: true, amount: 45.50 });
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Cash');
    const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);

    const [departments, setDepartments] = useState<string[]>([]);
    const [selectedDepartment, setSelectedDepartment] = useState<string>('All');

    const [isReceiptOpen, setIsReceiptOpen] = useState(false);
    const [receiptData, setReceiptData] = useState<any>(null);

    // Fetch departments on mount
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const deptList = await ApiService.getDepartments();
                if (deptList) {
                    const deptNames = Array.isArray(deptList)
                        ? deptList.map((d: any) => typeof d === 'object' ? d.name : d)
                        : [];
                    setDepartments(['All', ...deptNames]);
                }
            } catch (err) {
                console.error("Failed to fetch departments", err);
            }
        };
        fetchDepartments();
    }, []);

    // Fetch patient data if initialPatientId is provided
    useEffect(() => {
        const loadPatient = async () => {
            if (!initialPatientId) return;

            setLoading(true);
            try {
                // We assume initialPatientId is the UUID. 
                // We need to fetch details to get MRN and Name.
                // Or if we check the usage, usually we might pass the full object.
                // For now, let's try to fetch by ID.
                // Assuming ApiService.getPatient(id).
                // But existing code uses `getPatients({ search: query })`.
                // Let's stick to what we know works: Loading items if ID is present.

                // Wait, if we want to "Process" a pending invoice, we need to populate patientInfo.
                // CashierDashboard was doing this manually in the onClick handler.
                // We should expose a method or allow props to drive this.
                // But for "Initial Load", let's assume the parent manages the context.
                // Actually, if we just want to load items:
                const pendingItems = await ApiService.getPendingBillableItems(initialPatientId);

                // We need patient name for display. 
                // Maybe we just rely on parent to pass patientInfo object? 
                // Let's keep it simple: Use props for initial population.
                // But the prop is `initialPatientId`.
                // Let's change the prop to `initialPatient` object.
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        // Implement if needed. For now, we rely on search.
    }, [initialPatientId]);

    const handlePatientSearch = async () => {
        if (!patientInfo.id && !patientSearchQuery.trim()) {
            toast.error("Please enter a patient name, MRN, or phone number");
            return;
        }

        try {
            setLoading(true);
            const query = patientSearchQuery.trim();
            const response = await ApiService.getPatients({ search: query });
            const patients = Array.isArray(response) ? response : (response.data || []);

            if (patients.length === 0) {
                toast.error("No patient found matching your search");
                setLoading(false);
                return;
            }

            let selectedPatient = patients[0];
            if (patients.length > 1) {
                toast.info(`Found ${patients.length} patients. Selected: ${selectedPatient.first_name} ${selectedPatient.last_name}`);
            } else {
                toast.success(`Patient ${selectedPatient.first_name} ${selectedPatient.last_name} selected`);
            }

            setPatientInfo({
                id: selectedPatient.mrn,
                name: `${selectedPatient.first_name} ${selectedPatient.last_name}`,
                patientId: selectedPatient.id
            });
            setPatientSearchQuery('');

            // Fetch Pending Billable Items
            try {
                const pendingItems = await ApiService.getPendingBillableItems(selectedPatient.id);
                const formattedPendingItems = pendingItems.map((item: any) => ({
                    id: item.id,
                    name: item.description || item.name,
                    price: item.price,
                    type: item.type,
                    source_id: item.source_id,
                    isLocked: true
                }));

                if (pendingItems.length > 0) {
                    toast.success(`Found ${pendingItems.length} pending items.`);
                    setSelectedServices(formattedPendingItems);
                } else {
                    toast.warning("Patient found, but NO pending items returned.");
                    setSelectedServices([]);
                }
            } catch (err) {
                console.error("Failed to load pending items", err);
                toast.error("Could not load pending bills for patient");
            }

        } catch (error) {
            console.error('Error searching for patient:', error);
            toast.error('Failed to search for patient');
        } finally {
            setLoading(false);
        }
    };

    const addManualService = (service: any) => {
        const newItem = {
            id: `MANUAL-${Date.now()}`,
            name: service.name,
            price: service.price || parseFloat(service.base_price) || 0,
            type: 'Manual',
            source_id: service.id,
            isLocked: false
        };
        setSelectedServices([...selectedServices, newItem]);
        setIsAddServiceModalOpen(false);
        toast.success(`${service.name} added`);
    };

    const handleRemoveService = (serviceId: number | string) => {
        setSelectedServices(selectedServices.filter(service => service.id !== serviceId));
        toast.info("Service removed from invoice");
    };

    const getTotalAmount = () => {
        const subtotal = selectedServices.reduce((total, service) => total + service.price, 0);
        return discount.applied ? subtotal - discount.amount : subtotal;
    };

    const handleProcessPayment = async () => {
        if (!patientInfo.id) {
            toast.error("Please select a patient before processing payment");
            return;
        }

        if (selectedServices.length === 0) {
            toast.error("Please add at least one service");
            return;
        }

        if (!patientInfo.patientId) {
            toast.error("Invalid patient selection.");
            return;
        }

        try {
            const totalAmount = selectedServices.reduce((sum, service) => sum + service.price, 0);
            const discountAmount = discount.applied ? discount.amount : 0;
            const netAmount = totalAmount - discountAmount;

            const invoiceData = {
                patient_id: patientInfo.patientId,
                total_amount: totalAmount,
                discount_amount: discountAmount,
                net_amount: netAmount,
                status: 'paid',
                items: selectedServices.map(service => ({
                    description: service.name,
                    unit_price: service.price,
                    total_price: service.price,
                    quantity: 1,
                    service_type: service.type || 'Manual',
                    service_id: service.source_id
                }))
            };

            const invoice = await ApiService.createInvoice(invoiceData);

            const paymentData = {
                patient_id: patientInfo.patientId,
                invoice_id: invoice.id,
                amount: netAmount,
                payment_method: selectedPaymentMethod,
                payment_date: new Date().toISOString(),
                status: 'completed',
                reference_number: `PAY-${Date.now()}`
            };

            await ApiService.createPayment(paymentData);

            toast.success(`Payment of ₦${netAmount.toLocaleString()} processed successfully.`);

            setReceiptData({
                receiptNumber: paymentData.reference_number,
                date: paymentData.payment_date,
                patientName: patientInfo.name,
                patientId: patientInfo.id,
                items: selectedServices.map(s => ({
                    description: s.name,
                    amount: s.price,
                    quantity: 1
                })),
                totalAmount,
                discount: discountAmount,
                netAmount,
                paymentMethod: selectedPaymentMethod,
                cashierName: 'System' // Or Admin?
            });
            setIsReceiptOpen(true);

            // Clear Form
            setPatientInfo({ id: '', name: '', patientId: undefined });
            setSelectedServices([]);
            setDiscount({ applied: false, amount: 0 });

            if (onPaymentComplete) {
                onPaymentComplete();
            }

        } catch (error) {
            console.error('Error processing payment:', error);
            toast.error('Failed to process payment.');
        }
    };

    return (
        <div className={className}>
            <div className="flex space-x-4">
                <div className="w-2/3">
                    {/* Patient Information Form */}
                    <div className="bg-muted/50 border border-border rounded-md p-4 mb-4">
                        <h2 className="text-lg font-bold mb-4">Patient Information</h2>
                        <div className="mb-4">
                            <label className="block text-muted-foreground text-sm mb-1">Patient ID/Name:</label>
                            <div className="flex">
                                <Input
                                    value={patientInfo.id ? `${patientInfo.id} - ${patientInfo.name}` : patientSearchQuery}
                                    placeholder="Search patient via Name or MRN..."
                                    className="flex-1 mr-2"
                                    readOnly={!!patientInfo.id}
                                    onChange={(e) => setPatientSearchQuery(e.target.value)}
                                />
                                <Button className="bg-primary" onClick={handlePatientSearch} disabled={loading}>
                                    <Search className="h-4 w-4 mr-2" />
                                    Search
                                </Button>
                            </div>
                            {!patientInfo.id && (
                                <div className="mt-2 flex">
                                    <p className="text-xs text-muted-foreground">Enter MRN or Name to search.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment Details Section */}
                    <div className="bg-muted/50 border border-border rounded-md p-4">
                        <h2 className="text-lg font-bold mb-4">Payment Details</h2>

                        {/* Services Table */}
                        <div className="mb-4">
                            <div className="bg-muted p-2 grid grid-cols-12 font-bold text-sm">
                                <div className="col-span-7">Service</div>
                                <div className="col-span-3">Amount</div>
                                <div className="col-span-2">Actions</div>
                            </div>

                            {selectedServices.length > 0 ? (
                                selectedServices.map((service) => (
                                    <div key={service.id} className="border border-border p-2 grid grid-cols-12 text-sm">
                                        <div className="col-span-7">{service.name}</div>
                                        <div className="col-span-3">₦{service.price.toFixed(2)}</div>
                                        <div className="col-span-2">
                                            {service.isLocked ? (
                                                <span className="text-xs text-muted-foreground">Locked</span>
                                            ) : (
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <button className="text-destructive" onClick={() => handleRemoveService(service.id)}>
                                                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                                                                    <path d="M8 8L16 16M8 16L16 8" strokeWidth="2" />
                                                                </svg>
                                                            </button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Remove Service</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="border border-border p-4 text-center text-muted-foreground">
                                    No services added yet
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-4 mb-4">
                            <Button variant="outline" onClick={() => setIsAddServiceModalOpen(true)}>
                                + Add Service
                            </Button>
                            <Button
                                variant="outline"
                                className={discount.applied ? 'bg-primary/10' : ''}
                                onClick={() => setDiscount({ applied: !discount.applied, amount: 45.50 })}
                            >
                                {discount.applied ? 'Remove Discount' : 'Apply Discount'}
                            </Button>
                        </div>

                        {/* Total Section */}
                        <div className="bg-primary/10 border border-primary/20 p-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="font-bold">Total Amount</div>
                                    {discount.applied && (
                                        <div className="text-xs text-muted-foreground">(₦{discount.amount.toFixed(2)} discount applied)</div>
                                    )}
                                </div>
                                <div className="text-xl font-bold">₦{getTotalAmount().toFixed(2)}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Options */}
                <div className="w-1/3">
                    <div className="bg-muted/50 border border-border rounded-md p-4 h-full">
                        <h2 className="text-lg font-bold mb-4">Payment Options</h2>

                        <div className="flex flex-col space-y-3">
                            {['Cash', 'Credit Card', 'Insurance', 'Bank Transfer'].map(method => (
                                <Button
                                    key={method}
                                    variant={selectedPaymentMethod === method ? 'default' : 'outline'}
                                    className={`py-2 rounded-full font-bold ${selectedPaymentMethod === method ? 'bg-primary text-primary-foreground' : 'border-primary text-primary'}`}
                                    onClick={() => setSelectedPaymentMethod(method)}
                                >
                                    {method}
                                </Button>
                            ))}
                        </div>

                        <div className="mt-6">
                            <Button
                                className="bg-green-600 text-white py-2 rounded w-full font-bold hover:bg-green-700"
                                onClick={handleProcessPayment}
                                disabled={!patientInfo.id || selectedServices.length === 0 || loading}
                            >
                                {loading ? 'Processing...' : 'Process Payment'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Service Modal */}
            {isAddServiceModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Add Manual Service</h3>
                            <button onClick={() => setIsAddServiceModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <div className="space-y-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                <select
                                    className="w-full border border-gray-300 rounded-md p-2 bg-white text-black"
                                    value={selectedDepartment}
                                    onChange={(e) => setSelectedDepartment(e.target.value)}
                                >
                                    {departments.map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                                <ServiceSearchCombobox
                                    onSelect={(service) => {
                                        if (service) addManualService(service);
                                    }}
                                    filters={{
                                        ...(selectedDepartment && selectedDepartment !== 'All' ? { department: selectedDepartment } : {}),
                                        exclude_categories: 'Pharmacy,Laboratory,Patient Management,Registration'
                                    } as any}
                                    placeholder="Type 3 chars to search service..."
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Searching in {selectedDepartment === 'All' ? 'all departments' : selectedDepartment}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ReceiptModal
                open={isReceiptOpen}
                onOpenChange={setIsReceiptOpen}
                data={receiptData}
            />
        </div>
    );
};

export default PaymentWorkspace;
