import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DollarSign, Plus, TrendingUp, Building2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ApiService from '@/services/apiService';

const RevolvingFundPage = () => {
    const [loading, setLoading] = useState(false);
    const [funds, setFunds] = useState<any[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);
    const [units, setUnits] = useState<any[]>([]);
    const [selectedFund, setSelectedFund] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
    const [transactionForm, setTransactionForm] = useState({
        transaction_type: 'expenditure',
        amount: '',
        description: '',
        reference_number: ''
    });

    useEffect(() => {
        fetchDepartments();
        fetchFunds();
    }, []);

    const fetchDepartments = async () => {
        try {
            const data = await ApiService.getDepartments();
            setDepartments(data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const fetchFunds = async () => {
        setLoading(true);
        try {
            const data = await ApiService.getRevolvingFunds();
            setFunds(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching revolving funds:', error);
            toast.error('Failed to load revolving funds');
            setLoading(false);
        }
    };

    const fetchFundTransactions = async (fundId: string) => {
        try {
            const data = await ApiService.getFundTransactions(fundId);
            setTransactions(data);
        } catch (error) {
            console.error('Error fetching fund transactions:', error);
            toast.error('Failed to load transactions');
        }
    };

    const handleViewFund = async (fund: any) => {
        setSelectedFund(fund);
        await fetchFundTransactions(fund.id);
    };

    const handleAddTransaction = async () => {
        if (!selectedFund) return;

        if (!transactionForm.amount || parseFloat(transactionForm.amount) <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        try {
            await ApiService.createFundTransaction(selectedFund.id, {
                transaction_type: transactionForm.transaction_type as any,
                amount: parseFloat(transactionForm.amount),
                description: transactionForm.description,
                reference_number: transactionForm.reference_number
            });

            toast.success('Transaction added successfully');
            setIsTransactionDialogOpen(false);
            setTransactionForm({
                transaction_type: 'expenditure',
                amount: '',
                description: '',
                reference_number: ''
            });
            fetchFunds();
            if (selectedFund) {
                await fetchFundTransactions(selectedFund.id);
            }
        } catch (error) {
            console.error('Error adding transaction:', error);
            toast.error('Failed to add transaction');
        }
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            active: 'bg-green-100 text-green-800',
            depleted: 'bg-red-100 text-red-800',
            closed: 'bg-gray-100 text-gray-800'
        };
        return styles[status as keyof typeof styles] || styles.active;
    };

    const getTransactionTypeBadge = (type: string) => {
        const styles = {
            allocation: 'bg-blue-100 text-blue-800',
            expenditure: 'bg-red-100 text-red-800',
            replenishment: 'bg-green-100 text-green-800',
            adjustment: 'bg-yellow-100 text-yellow-800'
        };
        return styles[type as keyof typeof styles] || styles.allocation;
    };

    if (loading) {
        return <LoadingSpinner fullScreen text="Loading revolving funds..." />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Revolving Fund Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Track and manage revolving funds by department and ward</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="card-accent-blue hover:shadow-lg transition-all hover:scale-105">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Funds</p>
                            <h2 className="text-3xl font-bold text-blue-600">{funds.length}</h2>
                            <p className="text-xs text-muted-foreground mt-1">Active funds</p>
                        </div>
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <DollarSign className="h-6 w-6 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="card-accent-purple hover:shadow-lg transition-all hover:scale-105">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Allocated</p>
                            <h2 className="text-3xl font-bold text-purple-600">
                                ₦{funds.reduce((sum, f) => sum + parseFloat(f.initial_amount || 0), 0).toLocaleString()}
                            </h2>
                            <p className="text-xs text-muted-foreground mt-1">Total allocation</p>
                        </div>
                        <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <TrendingUp className="h-6 w-6 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="card-accent-green hover:shadow-lg transition-all hover:scale-105">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Current Balance</p>
                            <h2 className="text-3xl font-bold text-green-600">
                                ₦{funds.reduce((sum, f) => sum + parseFloat(f.current_balance || 0), 0).toLocaleString()}
                            </h2>
                            <p className="text-xs text-muted-foreground mt-1">Available funds</p>
                        </div>
                        <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                            <DollarSign className="h-6 w-6 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="card-accent-red hover:shadow-lg transition-all hover:scale-105">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                            <h2 className="text-3xl font-bold text-red-600">
                                ₦{funds.reduce((sum, f) => sum + (parseFloat(f.initial_amount || 0) - parseFloat(f.current_balance || 0)), 0).toLocaleString()}
                            </h2>
                            <p className="text-xs text-muted-foreground mt-1">Total expenditure</p>
                        </div>
                        <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                            <TrendingUp className="h-6 w-6 text-red-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Funds List */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Revolving Funds
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {funds.length > 0 ? (
                        <div className="space-y-4">
                            {funds.map((fund) => (
                                <div key={fund.id} className="border rounded-lg p-4 hover:bg-gray-50">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Building2 className="h-4 w-4 text-blue-500" />
                                                <h3 className="font-semibold">{fund.fund_name}</h3>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(fund.status)}`}>
                                                    {fund.status}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                <div>
                                                    <span className="text-gray-500">Department:</span>
                                                    <span className="ml-2 font-medium">{fund.department_name || 'N/A'}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Unit:</span>
                                                    <span className="ml-2 font-medium">{fund.unit_name || 'N/A'}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Allocated:</span>
                                                    <span className="ml-2 font-bold text-blue-600">
                                                        ₦{parseFloat(fund.initial_amount).toLocaleString()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Balance:</span>
                                                    <span className="ml-2 font-bold text-green-600">
                                                        ₦{parseFloat(fund.current_balance).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mt-2">
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-green-500 h-2 rounded-full"
                                                        style={{
                                                            width: `${(parseFloat(fund.current_balance) / parseFloat(fund.initial_amount)) * 100}%`
                                                        }}
                                                    />
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {((parseFloat(fund.current_balance) / parseFloat(fund.initial_amount)) * 100).toFixed(1)}% remaining
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 ml-4">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleViewFund(fund)}
                                            >
                                                <Eye className="h-4 w-4 mr-1" />
                                                View
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-10 text-gray-500">
                            <DollarSign className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                            <p className="font-medium">No revolving funds found</p>
                            <p className="text-sm mt-2">Contact admin to create revolving funds</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Fund Details Dialog */}
            {selectedFund && (
                <Dialog open={!!selectedFund} onOpenChange={() => setSelectedFund(null)}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{selectedFund.fund_name} - Transactions</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4">
                            {/* Fund Summary */}
                            <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="text-sm text-gray-600">Initial Amount</p>
                                    <p className="text-lg font-bold">₦{parseFloat(selectedFund.initial_amount).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Current Balance</p>
                                    <p className="text-lg font-bold text-green-600">₦{parseFloat(selectedFund.current_balance).toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total Spent</p>
                                    <p className="text-lg font-bold text-red-600">
                                        ₦{(parseFloat(selectedFund.initial_amount) - parseFloat(selectedFund.current_balance)).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {/* Add Transaction Button */}
                            <Button onClick={() => setIsTransactionDialogOpen(true)} className="w-full">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Transaction
                            </Button>

                            {/* Transactions List */}
                            <div>
                                <h4 className="font-semibold mb-3">Transaction History</h4>
                                {transactions.length > 0 ? (
                                    <div className="space-y-2">
                                        {transactions.map((txn) => (
                                            <div key={txn.id} className="border rounded p-3">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getTransactionTypeBadge(txn.transaction_type)}`}>
                                                                {txn.transaction_type}
                                                            </span>
                                                            <span className="text-sm text-gray-600">
                                                                {new Date(txn.transaction_date).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        {txn.description && (
                                                            <p className="text-sm text-gray-700">{txn.description}</p>
                                                        )}
                                                        {txn.reference_number && (
                                                            <p className="text-xs text-gray-500">Ref: {txn.reference_number}</p>
                                                        )}
                                                    </div>
                                                    <div className="text-right">
                                                        <p className={`font-bold ${txn.transaction_type === 'expenditure' ? 'text-red-600' : 'text-green-600'}`}>
                                                            {txn.transaction_type === 'expenditure' ? '-' : '+'}₦{parseFloat(txn.amount).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 py-4">No transactions yet</p>
                                )}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            {/* Add Transaction Dialog */}
            <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Transaction</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Label>Transaction Type</Label>
                            <Select
                                value={transactionForm.transaction_type}
                                onValueChange={(value) => setTransactionForm({ ...transactionForm, transaction_type: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="expenditure">Expenditure</SelectItem>
                                    <SelectItem value="replenishment">Replenishment</SelectItem>
                                    <SelectItem value="adjustment">Adjustment</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Amount</Label>
                            <Input
                                type="number"
                                placeholder="0.00"
                                value={transactionForm.amount}
                                onChange={(e) => setTransactionForm({ ...transactionForm, amount: e.target.value })}
                            />
                        </div>

                        <div>
                            <Label>Description</Label>
                            <Textarea
                                placeholder="Transaction description..."
                                value={transactionForm.description}
                                onChange={(e) => setTransactionForm({ ...transactionForm, description: e.target.value })}
                            />
                        </div>

                        <div>
                            <Label>Reference Number (Optional)</Label>
                            <Input
                                placeholder="REF-001"
                                value={transactionForm.reference_number}
                                onChange={(e) => setTransactionForm({ ...transactionForm, reference_number: e.target.value })}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsTransactionDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleAddTransaction}>
                            Add Transaction
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default RevolvingFundPage;
