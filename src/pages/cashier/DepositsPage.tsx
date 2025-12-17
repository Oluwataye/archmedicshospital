import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Wallet, Plus, Search, DollarSign, User, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { toast } from 'sonner';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PatientSearchSelect from '@/components/common/PatientSearchSelect';
import { usePatientManagement } from '@/hooks/usePatientManagement';
import ApiService from '@/services/apiService';

const DepositsPage = () => {
    const { patients, loading: patientsLoading } = usePatientManagement();
    const [loading, setLoading] = useState(false);
    const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);
    const [selectedPatientId, setSelectedPatientId] = useState('');
    const [depositAmount, setDepositAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [deposits, setDeposits] = useState([]);

    useEffect(() => {
        fetchDeposits();
    }, []);

    const fetchDeposits = async () => {
        setLoading(true);
        try {
            // TODO: Implement API call
            // const data = await ApiService.getDeposits();
            // setDeposits(data);

            // Mock data
            setTimeout(() => {
                setDeposits([
                    {
                        id: 1,
                        patient_name: 'John Doe',
                        mrn: 'MRN001',
                        amount: 50000,
                        payment_method: 'Cash',
                        date: new Date().toISOString(),
                        balance: 50000
                    }
                ]);
                setLoading(false);
            }, 500);
        } catch (error) {
            console.error('Error fetching deposits:', error);
            toast.error('Failed to load deposits');
            setLoading(false);
        }
    };

    const handleDeposit = async () => {
        if (!selectedPatientId) {
            toast.error('Please select a patient');
            return;
        }

        if (!depositAmount || parseFloat(depositAmount) <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        try {
            // TODO: Implement API call
            // await ApiService.createDeposit({
            //   patient_id: selectedPatientId,
            //   amount: parseFloat(depositAmount),
            //   payment_method: paymentMethod
            // });

            toast.success(`Deposit of ₦${parseFloat(depositAmount).toLocaleString()} processed successfully`);
            setIsDepositDialogOpen(false);
            setSelectedPatientId('');
            setDepositAmount('');
            fetchDeposits();
        } catch (error) {
            console.error('Error processing deposit:', error);
            toast.error('Failed to process deposit');
        }
    };

    if (loading) {
        return <LoadingSpinner fullScreen text="Loading deposits..." />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Patient Deposits</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage patient wallet top-ups</p>
                </div>
                <Button onClick={() => setIsDepositDialogOpen(true)} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    New Deposit
                </Button>
            </div>

            {/* Deposits List */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Deposits</CardTitle>
                </CardHeader>
                <CardContent>
                    {deposits.length > 0 ? (
                        <div className="space-y-4">
                            {deposits.map((deposit) => (
                                <div key={deposit.id} className="border rounded-lg p-4 hover:bg-gray-50">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <User className="h-4 w-4 text-blue-500" />
                                                <h3 className="font-semibold">{deposit.patient_name}</h3>
                                                <span className="text-sm text-gray-500">({deposit.mrn})</span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="text-gray-500">Amount:</span>
                                                    <span className="font-bold ml-2">₦{deposit.amount.toLocaleString()}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Method:</span>
                                                    <span className="ml-2">{deposit.payment_method}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Date:</span>
                                                    <span className="ml-2">{format(new Date(deposit.date), 'MMM dd, yyyy HH:mm')}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Balance:</span>
                                                    <span className="font-bold ml-2 text-green-600">₦{deposit.balance.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-10 text-gray-500">
                            <Wallet className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                            <p>No deposits found</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* New Deposit Dialog */}
            <Dialog open={isDepositDialogOpen} onOpenChange={setIsDepositDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>New Patient Deposit</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Patient Selection */}
                        <PatientSearchSelect
                            patients={patients}
                            selectedPatientId={selectedPatientId}
                            onSelectPatient={setSelectedPatientId}
                            loading={patientsLoading}
                        />

                        {/* Deposit Amount */}
                        <div>
                            <Label htmlFor="amount">Deposit Amount *</Label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                <Input
                                    id="amount"
                                    type="number"
                                    placeholder="0.00"
                                    value={depositAmount}
                                    onChange={(e) => setDepositAmount(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div>
                            <Label>Payment Method</Label>
                            <div className="grid grid-cols-3 gap-2 mt-2">
                                <Button
                                    variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                                    onClick={() => setPaymentMethod('cash')}
                                >
                                    Cash
                                </Button>
                                <Button
                                    variant={paymentMethod === 'card' ? 'default' : 'outline'}
                                    onClick={() => setPaymentMethod('card')}
                                >
                                    Card
                                </Button>
                                <Button
                                    variant={paymentMethod === 'transfer' ? 'default' : 'outline'}
                                    onClick={() => setPaymentMethod('transfer')}
                                >
                                    Transfer
                                </Button>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDepositDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleDeposit}>
                            Process Deposit
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default DepositsPage;
