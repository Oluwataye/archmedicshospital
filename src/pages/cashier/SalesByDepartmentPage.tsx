import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Building2, TrendingUp, Download, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ApiService from '@/services/apiService';

const SalesByDepartmentPage = () => {
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [salesData, setSalesData] = useState<any[]>([]);

    useEffect(() => {
        fetchSalesByDepartment();
    }, []);

    const fetchSalesByDepartment = async () => {
        setLoading(true);
        try {
            const data = await ApiService.getSalesByDepartment({
                start_date: startDate,
                end_date: endDate
            });
            setSalesData(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching sales by department:', error);
            toast.error('Failed to load department sales');
            setLoading(false);
        }
    };

    const handleExport = () => {
        toast.success('Exporting department sales report...');
        // TODO: Implement export functionality
    };

    const getTotalSales = () => {
        return salesData.reduce((sum, dept) => sum + dept.totalSales, 0);
    };

    const getTotalTransactions = () => {
        return salesData.reduce((sum, dept) => sum + dept.transactionCount, 0);
    };

    if (loading) {
        return <LoadingSpinner fullScreen text="Loading department sales..." />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Sales by Department</h1>
                    <p className="text-sm text-gray-500 mt-1">View sales breakdown by department</p>
                </div>
                <Button onClick={handleExport} className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export Report
                </Button>
            </div>

            {/* Date Filter */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Date Range
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                        <div className="flex items-end">
                            <Button onClick={fetchSalesByDepartment} className="w-full">
                                Apply Filter
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₦{getTotalSales().toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">All departments</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{getTotalTransactions()}</div>
                        <p className="text-xs text-muted-foreground mt-1">Across all departments</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Departments</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{salesData.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">With sales activity</p>
                    </CardContent>
                </Card>
            </div>

            {/* Department Sales Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Department Sales Breakdown
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {salesData.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-3 font-semibold">Department</th>
                                        <th className="text-right p-3 font-semibold">Transactions</th>
                                        <th className="text-right p-3 font-semibold">Total Sales</th>
                                        <th className="text-right p-3 font-semibold">Average Sale</th>
                                        <th className="text-right p-3 font-semibold">% of Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {salesData.map((dept, index) => (
                                        <tr key={index} className="border-b hover:bg-gray-50">
                                            <td className="p-3">
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="h-4 w-4 text-blue-500" />
                                                    <span className="font-medium">{dept.departmentName}</span>
                                                </div>
                                            </td>
                                            <td className="text-right p-3">{dept.transactionCount}</td>
                                            <td className="text-right p-3 font-semibold">
                                                ₦{dept.totalSales.toLocaleString()}
                                            </td>
                                            <td className="text-right p-3">
                                                ₦{dept.averageSale.toLocaleString()}
                                            </td>
                                            <td className="text-right p-3">
                                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                                                    {((dept.totalSales / getTotalSales()) * 100).toFixed(1)}%
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-gray-50 font-bold">
                                        <td className="p-3">TOTAL</td>
                                        <td className="text-right p-3">{getTotalTransactions()}</td>
                                        <td className="text-right p-3">₦{getTotalSales().toLocaleString()}</td>
                                        <td className="text-right p-3">
                                            ₦{(getTotalSales() / getTotalTransactions()).toLocaleString()}
                                        </td>
                                        <td className="text-right p-3">100%</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center p-10 text-gray-500">
                            <Building2 className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                            <p className="font-medium">No sales data found</p>
                            <p className="text-sm mt-2">Try adjusting the date range</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default SalesByDepartmentPage;
