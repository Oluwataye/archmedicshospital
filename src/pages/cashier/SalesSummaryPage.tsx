import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, DollarSign, TrendingUp, Download, Filter } from 'lucide-react';
import { format } from 'date-fns';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { toast } from 'sonner';
import ApiService from '@/services/apiService';

const SalesSummaryPage = () => {
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState('today');
    const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));

    const [summary, setSummary] = useState({
        totalSales: 0,
        totalTransactions: 0,
        cashSales: 0,
        cardSales: 0,
        insuranceSales: 0,
        averageTransaction: 0
    });

    useEffect(() => {
        fetchSalesSummary();
    }, [dateRange]);

    const fetchSalesSummary = async () => {
        setLoading(true);
        try {
            const params: any = {};

            if (dateRange === 'custom') {
                params.start_date = startDate;
                params.end_date = endDate;
            } else {
                // Calculate dates based on range
                const today = new Date();
                const formatDate = (date: Date) => format(date, 'yyyy-MM-dd');

                switch (dateRange) {
                    case 'today':
                        params.start_date = formatDate(today);
                        params.end_date = formatDate(today);
                        break;
                    case 'yesterday':
                        const yesterday = new Date(today);
                        yesterday.setDate(yesterday.getDate() - 1);
                        params.start_date = formatDate(yesterday);
                        params.end_date = formatDate(yesterday);
                        break;
                    case 'this_week':
                        const weekStart = new Date(today);
                        weekStart.setDate(today.getDate() - today.getDay());
                        params.start_date = formatDate(weekStart);
                        params.end_date = formatDate(today);
                        break;
                    case 'last_week':
                        const lastWeekEnd = new Date(today);
                        lastWeekEnd.setDate(today.getDate() - today.getDay() - 1);
                        const lastWeekStart = new Date(lastWeekEnd);
                        lastWeekStart.setDate(lastWeekEnd.getDate() - 6);
                        params.start_date = formatDate(lastWeekStart);
                        params.end_date = formatDate(lastWeekEnd);
                        break;
                    case 'this_month':
                        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
                        params.start_date = formatDate(monthStart);
                        params.end_date = formatDate(today);
                        break;
                    case 'last_month':
                        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
                        params.start_date = formatDate(lastMonthStart);
                        params.end_date = formatDate(lastMonthEnd);
                        break;
                }
            }

            const data = await ApiService.getSalesSummary(params);
            setSummary(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching sales summary:', error);
            toast.error('Failed to load sales summary');
            setLoading(false);
        }
    };

    const handleExport = () => {
        toast.success('Exporting sales summary...');
        // TODO: Implement export functionality
    };

    if (loading) {
        return <LoadingSpinner fullScreen text="Loading sales summary..." />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Transaction Summary</h1>
                    <p className="text-sm text-gray-500 mt-1">View and analyze your sales transactions</p>
                </div>
                <Button onClick={handleExport} className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export Report
                </Button>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filters
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Select value={dateRange} onValueChange={setDateRange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select period" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="today">Today</SelectItem>
                                <SelectItem value="yesterday">Yesterday</SelectItem>
                                <SelectItem value="this_week">This Week</SelectItem>
                                <SelectItem value="last_week">Last Week</SelectItem>
                                <SelectItem value="this_month">This Month</SelectItem>
                                <SelectItem value="last_month">Last Month</SelectItem>
                                <SelectItem value="custom">Custom Range</SelectItem>
                            </SelectContent>
                        </Select>

                        {dateRange === 'custom' && (
                            <>
                                <div>
                                    <label className="text-sm text-gray-600">Start Date</label>
                                    <Input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600">End Date</label>
                                    <Input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>
                            </>
                        )}

                        <Button onClick={fetchSalesSummary}>
                            Apply Filters
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="card-accent-green hover:shadow-lg transition-all hover:scale-105">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                            <h2 className="text-3xl font-bold text-green-600">₦{summary.totalSales.toLocaleString()}</h2>
                            <p className="text-xs text-muted-foreground mt-1">
                                {summary.totalTransactions} transactions
                            </p>
                        </div>
                        <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                            <DollarSign className="h-6 w-6 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="card-accent-blue hover:shadow-lg transition-all hover:scale-105">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Average Transaction</p>
                            <h2 className="text-3xl font-bold text-blue-600">₦{summary.averageTransaction.toLocaleString()}</h2>
                            <p className="text-xs text-muted-foreground mt-1">
                                Per transaction
                            </p>
                        </div>
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <TrendingUp className="h-6 w-6 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="card-accent-purple hover:shadow-lg transition-all hover:scale-105">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
                            <h2 className="text-3xl font-bold text-purple-600">{summary.totalTransactions}</h2>
                            <p className="text-xs text-muted-foreground mt-1">
                                Completed
                            </p>
                        </div>
                        <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Payment Methods Breakdown */}
            <Card>
                <CardHeader>
                    <CardTitle>Payment Methods Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Cash</span>
                            <span className="text-sm font-bold">₦{summary.cashSales.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Card</span>
                            <span className="text-sm font-bold">₦{summary.cardSales.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Insurance/HMO</span>
                            <span className="text-sm font-bold">₦{summary.insuranceSales.toLocaleString()}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SalesSummaryPage;
