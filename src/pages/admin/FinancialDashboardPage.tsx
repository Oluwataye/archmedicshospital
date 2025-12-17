import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
    CreditCard, TrendingUp, Users, DollarSign, Activity, Calendar,
    ArrowUpRight, ArrowDownRight, RefreshCw, Download
} from 'lucide-react';
import { ApiService } from '@/services/apiService';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { toast } from 'sonner';

export default function FinancialDashboardPage() {
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState<any>(null);
    const [revenueData, setRevenueData] = useState<any[]>([]);
    const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
    const [topServices, setTopServices] = useState<any[]>([]);
    const [cashierPerformance, setCashierPerformance] = useState<any[]>([]);
    const [chartPeriod, setChartPeriod] = useState('week');

    useEffect(() => {
        fetchDashboardData();
    }, [chartPeriod]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [
                metricsRes,
                revenueRes,
                methodsRes,
                servicesRes,
                cashierRes
            ] = await Promise.all([
                ApiService.get('/financial/dashboard'),
                ApiService.get(`/financial/revenue-chart?period=${chartPeriod}`),
                ApiService.get('/financial/payment-methods'),
                ApiService.get('/financial/top-services'),
                ApiService.get('/financial/cashier-performance')
            ]);

            setMetrics(metricsRes);
            setRevenueData(revenueRes);
            setPaymentMethods(methodsRes);
            setTopServices(servicesRes);
            setCashierPerformance(cashierRes);
        } catch (error) {
            console.error('Error fetching financial dashboard data:', error);
            toast.error('Failed to load financial data');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSpinner text="Loading financial data..." />
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6 pb-16 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Financial Dashboard</h1>
                    <p className="text-muted-foreground">Real-time financial overview and revenue analysis</p>
                </div>
                <div className="flex gap-2">
                    <Select value={chartPeriod} onValueChange={setChartPeriod}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Period" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="week">This Week</SelectItem>
                            <SelectItem value="month">This Month</SelectItem>
                            <SelectItem value="year">This Year</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" onClick={fetchDashboardData}>
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" /> Export Report
                    </Button>
                </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="card-accent-green hover:shadow-lg transition-all hover:scale-105">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Today's Revenue</p>
                            <h2 className="text-3xl font-bold text-green-600">{formatCurrency(metrics?.todayRevenue || 0)}</h2>
                            <p className="text-xs text-muted-foreground mt-1">
                                {metrics?.todayTransactionCount} transactions today
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
                            <p className="text-sm font-medium text-muted-foreground">This Week</p>
                            <h2 className="text-3xl font-bold text-blue-600">{formatCurrency(metrics?.weekRevenue || 0)}</h2>
                            <p className="text-xs text-muted-foreground mt-1">
                                Total revenue for current week
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
                            <p className="text-sm font-medium text-muted-foreground">This Month</p>
                            <h2 className="text-3xl font-bold text-purple-600">{formatCurrency(metrics?.monthRevenue || 0)}</h2>
                            <p className="text-xs text-muted-foreground mt-1">
                                Total revenue for current month
                            </p>
                        </div>
                        <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="card-accent-orange hover:shadow-lg transition-all hover:scale-105">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Active Cashiers</p>
                            <h2 className="text-3xl font-bold text-orange-600">{metrics?.activeCashiersCount || 0}</h2>
                            <p className="text-xs text-muted-foreground mt-1">
                                Processing payments today
                            </p>
                        </div>
                        <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                            <Users className="h-6 w-6 text-orange-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Revenue Chart */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Revenue Overview</CardTitle>
                        <CardDescription>
                            Revenue trends over the selected period
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full min-w-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueData}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#0088FE" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    />
                                    <YAxis
                                        tickFormatter={(value) => `₦${value / 1000}k`}
                                    />
                                    <Tooltip
                                        formatter={(value: number) => formatCurrency(value)}
                                        labelFormatter={(label) => new Date(label).toLocaleDateString()}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#0088FE" fillOpacity={1} fill="url(#colorRevenue)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Methods Pie Chart */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Payment Methods</CardTitle>
                        <CardDescription>Distribution of payment types</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full min-w-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={paymentMethods}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="total"
                                        nameKey="payment_method"
                                    >
                                        {paymentMethods.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {/* Top Services */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Performing Services</CardTitle>
                        <CardDescription>Highest revenue generating services</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topServices.map((service, index) => (
                                <div key={index} className="flex items-center">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold mr-4">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none">{service.service_name}</p>
                                        <p className="text-xs text-muted-foreground">{service.quantity} performed</p>
                                    </div>
                                    <div className="font-medium">
                                        {formatCurrency(service.revenue)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Cashier Performance */}
                <Card>
                    <CardHeader>
                        <CardTitle>Cashier Performance (Today)</CardTitle>
                        <CardDescription>Transaction volume by cashier</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {cashierPerformance.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">No transactions today</div>
                            ) : (
                                cashierPerformance.map((cashier, index) => (
                                    <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">{cashier.cashier_name}</p>
                                            <p className="text-xs text-muted-foreground">{cashier.transaction_count} transactions</p>
                                        </div>
                                        <div className="font-medium text-green-600">
                                            {formatCurrency(cashier.total_revenue)}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
