import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ApiService from '@/services/apiService';
import PaymentWorkspace from '@/components/cashier/PaymentWorkspace';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { CreditCard, Clock, FileText } from 'lucide-react';
import { toast } from 'sonner';

const AdminCashierPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('new-payment');
    const [loading, setLoading] = useState(false);
    const [pendingInvoices, setPendingInvoices] = useState<any[]>([]);
    const [selectedPatientId, setSelectedPatientId] = useState<string | undefined>(undefined);

    const fetchPendingItems = async () => {
        setLoading(true);
        try {
            const [pendingInvoicesList, pendingRegistrations] = await Promise.all([
                ApiService.getInvoices({ status: 'pending' }),
                ApiService.getPatients({ status: 'pending_payment' })
            ]);

            const formattedRegistrations = (Array.isArray(pendingRegistrations?.data) ? pendingRegistrations.data : []).map((p: any) => ({
                id: `REG-${p.id}`,
                invoice_number: 'REGISTRATION',
                created_at: p.created_at,
                patient_name: `${p.first_name} ${p.last_name}`,
                patient_mrn: p.mrn,
                patient_id: p.id,
                total_amount: 1000,
                type: 'Registration'
            }));

            const allPendingItems = [...formattedRegistrations, ...pendingInvoicesList.map((inv: any) => ({ ...inv, type: 'Invoice' }))];
            allPendingItems.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            setPendingInvoices(allPendingItems);
        } catch (error) {
            console.error('Error fetching pending items:', error);
            toast.error('Failed to load pending bills');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'pending') {
            fetchPendingItems();
        }
    }, [activeTab]);

    return (
        <div className="p-6 space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Admin Cashier Portal</h1>
                    <p className="text-muted-foreground">Process payments securely as an Administrator.</p>
                </div>
                <Button variant="outline" onClick={() => navigate('/admin/transactions')}>
                    <FileText className="mr-2 h-4 w-4" />
                    View All Transactions
                </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList>
                    <TabsTrigger value="new-payment"><CreditCard className="mr-2 h-4 w-4" /> New Payment</TabsTrigger>
                    <TabsTrigger value="pending"><Clock className="mr-2 h-4 w-4" /> Pending Bills</TabsTrigger>
                </TabsList>

                <TabsContent value="new-payment">
                    <Card>
                        <CardContent className="p-6">
                            <PaymentWorkspace
                                initialPatientId={selectedPatientId}
                                onPaymentComplete={() => {
                                    // Maybe refresh pending count?
                                    setSelectedPatientId(undefined); // Clear selection
                                }}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="pending">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pending Bills & Registrations</CardTitle>
                            <CardDescription>Select a pending item to process payment.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loading ? <LoadingSpinner /> : (
                                <div className="rounded-md border">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-muted border-b">
                                            <tr>
                                                <th className="p-4 font-medium">Type</th>
                                                <th className="p-4 font-medium">Ref #</th>
                                                <th className="p-4 font-medium">Date</th>
                                                <th className="p-4 font-medium">Patient</th>
                                                <th className="p-4 font-medium">Amount</th>
                                                <th className="p-4 font-medium text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {pendingInvoices.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className="p-8 text-center text-muted-foreground">No pending bills found</td>
                                                </tr>
                                            ) : (
                                                pendingInvoices.map((item: any) => (
                                                    <tr key={item.id} className="hover:bg-muted/5">
                                                        <td className="p-4">
                                                            <span className={`text-xs px-2 py-1 rounded-full ${item.type === 'Registration' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                                                {item.type}
                                                            </span>
                                                        </td>
                                                        <td className="p-4 font-medium">{item.invoice_number}</td>
                                                        <td className="p-4 text-muted-foreground">{new Date(item.created_at).toLocaleDateString()}</td>
                                                        <td className="p-4">{item.patient_name || item.patient_id}</td>
                                                        <td className="p-4 font-bold max-w-xs truncate">
                                                            {item.type === 'Registration' ? '1,000' : `₦${Number(item.net_amount || item.total_amount).toLocaleString()}`}
                                                        </td>
                                                        <td className="p-4 text-right">
                                                            <Button
                                                                size="sm"
                                                                onClick={() => {
                                                                    setSelectedPatientId(item.patient_id);
                                                                    setActiveTab('new-payment');
                                                                }}
                                                            >
                                                                Process
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                )))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdminCashierPage;
