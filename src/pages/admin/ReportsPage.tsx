import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Calendar, FileText, Activity, TrendingUp, Download, CreditCard, DollarSign, Filter, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { ApiService } from '@/services/apiService';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function ReportsPage() {
    const [loading, setLoading] = useState(true);
    const [userStats, setUserStats] = useState<any>(null);
    const [appointmentStats, setAppointmentStats] = useState<any[]>([]);
    const [patientStats, setPatientStats] = useState<any>({ byStatus: [], byGender: [] });
    const [financialStats, setFinancialStats] = useState<any>(null);

    // Financial Reports State
    const [reportType, setReportType] = useState('daily-sales');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [reportData, setReportData] = useState<any>(null);
    const [reportLoading, setReportLoading] = useState(false);

    useEffect(() => {
        loadReports();
    }, []);

    useEffect(() => {
        if (reportType) {
            fetchFinancialReport();
        }
    }, [reportType]);

    const loadReports = async () => {
        try {
            setLoading(true);

            const [users, appointments, patients, financial] = await Promise.all([
                ApiService.getUserStats(),
                ApiService.getAppointmentStats(),
                ApiService.getPatientStats(),
                ApiService.getPaymentStatistics()
            ]);

            setUserStats(users);
            setAppointmentStats(appointments);
            setPatientStats(patients);
            setFinancialStats(financial);

        } catch (error) {
            console.error('Error loading reports:', error);
            toast.error('Failed to load reports');
        } finally {
            setLoading(false);
        }
    };

    const fetchFinancialReport = async () => {
        setReportLoading(true);
        try {
            let endpoint = '';
            const params: any = {};

            if (dateRange.start) params.startDate = dateRange.start;
            if (dateRange.end) params.endDate = dateRange.end;

            switch (reportType) {
                case 'daily-sales':
                    endpoint = '/reports/financial/daily-sales';
                    break;
                case 'cashier-reconciliation':
                    endpoint = '/reports/financial/cashier-reconciliation';
                    break;
                case 'revenue-by-service':
                    endpoint = '/reports/financial/revenue-by-service';
                    break;
                case 'revenue-by-department':
                    endpoint = '/reports/financial/revenue-by-department';
                    break;
                case 'refunds-voids':
                    endpoint = '/reports/financial/refunds-voids';
                    break;
                default:
                    return;
            }

            const data = await ApiService.get(endpoint, { params });
            setReportData(data);
        } catch (error) {
            console.error('Error fetching financial report:', error);
            toast.error('Failed to fetch report data');
        } finally {
            setReportLoading(false);
        }
    };

    const handleExport = (type: string) => {
        toast.info(`Exporting ${type} report...`);
        // Implement export functionality
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);
    };

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 p-6 pb-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
                    <p className="text-muted-foreground mt-1">View system statistics and generate comprehensive reports</p>
                </div>
                <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export All
                </Button>
            </div>

            {/* Overview Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="card-accent-blue hover:shadow-lg transition-all hover:scale-105">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                            <h2 className="text-3xl font-bold text-blue-600">{userStats?.total || 0}</h2>
                            <p className="text-xs text-muted-foreground mt-1">
                                {userStats?.active || 0} active
                            </p>
                        </div>
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="h-6 w-6 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="card-accent-purple hover:shadow-lg transition-all hover:scale-105">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Weekly Appointments</p>
                            <h2 className="text-3xl font-bold text-purple-600">
                                {appointmentStats.reduce((acc, curr) => acc + curr.appointments, 0)}
                            </h2>
                            <p className="text-xs text-muted-foreground mt-1">
                                Last 7 days
                            </p>
                        </div>
                        <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="card-accent-green hover:shadow-lg transition-all hover:scale-105">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                            <h2 className="text-3xl font-bold text-green-600">₦{(financialStats?.monthRevenue || 0).toLocaleString()}</h2>
                            <p className="text-xs text-muted-foreground mt-1">
                                This month
                            </p>
                        </div>
                        <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                            <CreditCard className="h-6 w-6 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="card-accent-orange hover:shadow-lg transition-all hover:scale-105">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">System Health</p>
                            <h2 className="text-3xl font-bold text-orange-600">99%</h2>
                            <p className="text-xs text-muted-foreground mt-1">
                                Uptime this month
                            </p>
                        </div>
                        <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                            <Activity className="h-6 w-6 text-orange-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="financial" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="financial">Financial Reports</TabsTrigger>
                    <TabsTrigger value="users">User Analytics</TabsTrigger>
                    <TabsTrigger value="appointments">Appointments</TabsTrigger>
                    <TabsTrigger value="patients">Patients</TabsTrigger>
                </TabsList>

                <TabsContent value="financial" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <CardTitle>Financial Reports</CardTitle>
                                    <CardDescription>Generate detailed financial statements</CardDescription>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Select value={reportType} onValueChange={setReportType}>
                                        <SelectTrigger className="w-[200px]">
                                            <SelectValue placeholder="Select Report Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="daily-sales">Daily Sales Report</SelectItem>
                                            <SelectItem value="cashier-reconciliation">Cashier Reconciliation</SelectItem>
                                            <SelectItem value="revenue-by-service">Revenue by Service</SelectItem>
                                            <SelectItem value="revenue-by-department">Revenue by Department</SelectItem>
                                            <SelectItem value="refunds-voids">Refunds & Voids</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Input
                                        type="date"
                                        className="w-[150px]"
                                        value={dateRange.start}
                                        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                    />
                                    <Input
                                        type="date"
                                        className="w-[150px]"
                                        value={dateRange.end}
                                        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                    />
                                    <Button variant="outline" size="icon" onClick={fetchFinancialReport}>
                                        <RefreshCw className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" onClick={() => handleExport(reportType)}>
                                        <Download className="h-4 w-4 mr-2" /> Export
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {reportLoading ? (
                                <div className="flex justify-center py-12"><LoadingSpinner /></div>
                            ) : !reportData ? (
                                <div className="text-center py-12 text-muted-foreground">Select a report type to view data</div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Report Summary Section */}
                                    {reportType === 'daily-sales' && reportData.summary && (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                            <div className="p-4 border rounded-lg bg-muted/20">
                                                <div className="text-sm text-muted-foreground">Total Revenue</div>
                                                <div className="text-2xl font-bold">{formatCurrency(reportData.summary.total_revenue)}</div>
                                            </div>
                                            <div className="p-4 border rounded-lg bg-muted/20">
                                                <div className="text-sm text-muted-foreground">Transactions</div>
                                                <div className="text-2xl font-bold">{reportData.summary.total_transactions}</div>
                                            </div>
                                            <div className="p-4 border rounded-lg bg-muted/20">
                                                <div className="text-sm text-muted-foreground">Cash Payments</div>
                                                <div className="text-2xl font-bold">{formatCurrency(reportData.summary.cash_total)}</div>
                                            </div>
                                            <div className="p-4 border rounded-lg bg-muted/20">
                                                <div className="text-sm text-muted-foreground">Card Payments</div>
                                                <div className="text-2xl font-bold">{formatCurrency(reportData.summary.card_total)}</div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Report Data Table */}
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                {reportType === 'daily-sales' && (
                                                    <TableRow>
                                                        <TableHead>Time</TableHead>
                                                        <TableHead>Invoice #</TableHead>
                                                        <TableHead>Patient</TableHead>
                                                        <TableHead>Cashier</TableHead>
                                                        <TableHead>Method</TableHead>
                                                        <TableHead className="text-right">Amount</TableHead>
                                                    </TableRow>
                                                )}
                                                {reportType === 'cashier-reconciliation' && (
                                                    <TableRow>
                                                        <TableHead>Cashier Name</TableHead>
                                                        <TableHead className="text-right">Transactions</TableHead>
                                                        <TableHead className="text-right">Cash Total</TableHead>
                                                        <TableHead className="text-right">Card Total</TableHead>
                                                        <TableHead className="text-right">Transfer Total</TableHead>
                                                        <TableHead className="text-right">Total Revenue</TableHead>
                                                    </TableRow>
                                                )}
                                                {reportType === 'revenue-by-service' && (
                                                    <TableRow>
                                                        <TableHead>Service Name</TableHead>
                                                        <TableHead>Category</TableHead>
                                                        <TableHead className="text-right">Qty Sold</TableHead>
                                                        <TableHead className="text-right">Total Revenue</TableHead>
                                                    </TableRow>
                                                )}
                                                {reportType === 'revenue-by-department' && (
                                                    <TableRow>
                                                        <TableHead>Department</TableHead>
                                                        <TableHead className="text-right">Transactions</TableHead>
                                                        <TableHead className="text-right">Total Revenue</TableHead>
                                                    </TableRow>
                                                )}
                                                {reportType === 'refunds-voids' && (
                                                    <TableRow>
                                                        <TableHead>Date</TableHead>
                                                        <TableHead>Type</TableHead>
                                                        <TableHead>Invoice #</TableHead>
                                                        <TableHead>Reason</TableHead>
                                                        <TableHead>Processed By</TableHead>
                                                        <TableHead className="text-right">Amount</TableHead>
                                                    </TableRow>
                                                )}
                                            </TableHeader>
                                            <TableBody>
                                                {reportType === 'daily-sales' && reportData.transactions?.map((row: any, i: number) => (
                                                    <TableRow key={i}>
                                                        <TableCell>{new Date(row.transaction_date).toLocaleTimeString()}</TableCell>
                                                        <TableCell>{row.invoice_number}</TableCell>
                                                        <TableCell>{row.patient_name}</TableCell>
                                                        <TableCell>{row.cashier_name}</TableCell>
                                                        <TableCell>{row.payment_method}</TableCell>
                                                        <TableCell className="text-right">{formatCurrency(row.total_amount)}</TableCell>
                                                    </TableRow>
                                                ))}
                                                {reportType === 'cashier-reconciliation' && reportData.map((row: any, i: number) => (
                                                    <TableRow key={i}>
                                                        <TableCell className="font-medium">{row.cashier_name}</TableCell>
                                                        <TableCell className="text-right">{row.total_transactions}</TableCell>
                                                        <TableCell className="text-right">{formatCurrency(row.cash_total)}</TableCell>
                                                        <TableCell className="text-right">{formatCurrency(row.card_total)}</TableCell>
                                                        <TableCell className="text-right">{formatCurrency(row.transfer_total)}</TableCell>
                                                        <TableCell className="text-right font-bold">{formatCurrency(row.total_revenue)}</TableCell>
                                                    </TableRow>
                                                ))}
                                                {reportType === 'revenue-by-service' && reportData.map((row: any, i: number) => (
                                                    <TableRow key={i}>
                                                        <TableCell className="font-medium">{row.service_name}</TableCell>
                                                        <TableCell>{row.category}</TableCell>
                                                        <TableCell className="text-right">{row.quantity_sold}</TableCell>
                                                        <TableCell className="text-right font-bold">{formatCurrency(row.total_revenue)}</TableCell>
                                                    </TableRow>
                                                ))}
                                                {reportType === 'revenue-by-department' && reportData.map((row: any, i: number) => (
                                                    <TableRow key={i}>
                                                        <TableCell className="font-medium">{row.department || 'Unassigned'}</TableCell>
                                                        <TableCell className="text-right">{row.transaction_count}</TableCell>
                                                        <TableCell className="text-right font-bold">{formatCurrency(row.total_revenue)}</TableCell>
                                                    </TableRow>
                                                ))}
                                                {reportType === 'refunds-voids' && reportData.map((row: any, i: number) => (
                                                    <TableRow key={i}>
                                                        <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                                                        <TableCell>
                                                            <span className={`px-2 py-1 rounded-full text-xs ${row.type === 'Void' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}`}>
                                                                {row.type}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>{row.invoice_number}</TableCell>
                                                        <TableCell className="max-w-[200px] truncate" title={row.reason}>{row.reason}</TableCell>
                                                        <TableCell>{row.processed_by}</TableCell>
                                                        <TableCell className="text-right font-bold">{formatCurrency(row.total_amount)}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="users" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Users by Role</CardTitle>
                                <CardDescription>Distribution of system users by role</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] w-full min-w-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={userStats?.byRole || []}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={(props: any) => `${props.role}: ${props.count}`}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="count"
                                            >
                                                {(userStats?.byRole || []).map((entry: any, index: number) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>User Activity</CardTitle>
                                <CardDescription>Active vs Inactive users</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Active Users</span>
                                        <span className="text-2xl font-bold text-green-600">{userStats?.active || 0}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Inactive Users</span>
                                        <span className="text-2xl font-bold text-gray-400">
                                            {(userStats?.total || 0) - (userStats?.active || 0)}
                                        </span>
                                    </div>
                                    <Button className="w-full" variant="outline" onClick={() => handleExport('users')}>
                                        <Download className="h-4 w-4 mr-2" />
                                        Export User Report
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="appointments" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Weekly Appointments</CardTitle>
                            <CardDescription>Appointments scheduled over the last 7 days</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full min-w-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={appointmentStats}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="appointments" fill="#8884d8" name="Appointments" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="patients" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Patient Status Distribution</CardTitle>
                                <CardDescription>Patients by active status</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] w-full min-w-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={patientStats.byStatus}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={(entry) => `${entry.name}: ${entry.value}`}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {patientStats.byStatus.map((entry: any, index: number) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Patient Gender Distribution</CardTitle>
                                <CardDescription>Patients by gender</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] w-full min-w-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={patientStats.byGender}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={(entry) => `${entry.name}: ${entry.value}`}
                                                outerRadius={80}
                                                fill="#82CA9D"
                                                dataKey="value"
                                            >
                                                {patientStats.byGender.map((entry: any, index: number) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
