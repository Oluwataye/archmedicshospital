import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, TrendingUp, Download, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ApiService from '@/services/apiService';

const SalesByWardPage = () => {
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [selectedDepartment, setSelectedDepartment] = useState('all');
    const [departments, setDepartments] = useState<any[]>([]);
    const [salesData, setSalesData] = useState<any[]>([]);

    useEffect(() => {
        fetchDepartments();
        fetchSalesByWard();
    }, []);

    const fetchDepartments = async () => {
        try {
            const data = await ApiService.getDepartments();
            setDepartments(data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const fetchSalesByWard = async () => {
        setLoading(true);
        try {
            const params: any = {
                start_date: startDate,
                end_date: endDate
            };

            if (selectedDepartment && selectedDepartment !== 'all') {
                params.department_id = selectedDepartment;
            }

            const data = await ApiService.getSalesByWard(params);
            setSalesData(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching sales by ward:', error);
            toast.error('Failed to load ward sales');
            setLoading(false);
        }
    };

    const handleExport = () => {
        toast.success('Exporting ward sales report...');
    };

    const getTotalSales = () => {
        return salesData.reduce((sum, ward) => sum + ward.totalSales, 0);
    };

    const getTotalTransactions = () => {
        return salesData.reduce((sum, ward) => sum + ward.transactionCount, 0);
    };

    if (loading) {
        return <LoadingSpinner fullScreen text="Loading ward sales..." />;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Sales by Ward</h1>
                    <p className="text-sm text-gray-500 mt-1">View sales breakdown by ward/unit</p>
                </div>
                <Button onClick={handleExport} className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export Report
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Filters
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="text-sm text-gray-600">Department</label>
                            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Departments" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Departments</SelectItem>
                                    {departments.map((dept) => (
                                        <SelectItem key={dept.id} value={dept.id}>
                                            {dept.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
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
                            <Button onClick={fetchSalesByWard} className="w-full">
                                Apply Filters
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₦{getTotalSales().toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">All wards</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{getTotalTransactions()}</div>
                        <p className="text-xs text-muted-foreground mt-1">Across all wards</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Wards</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{salesData.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">With sales activity</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Ward Sales Breakdown
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {salesData.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-3 font-semibold">Ward/Unit</th>
                                        <th className="text-left p-3 font-semibold">Department</th>
                                        <th className="text-right p-3 font-semibold">Transactions</th>
                                        <th className="text-right p-3 font-semibold">Total Sales</th>
                                        <th className="text-right p-3 font-semibold">Average Sale</th>
                                        <th className="text-right p-3 font-semibold">% of Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {salesData.map((ward, index) => (
                                        <tr key={index} className="border-b hover:bg-gray-50">
                                            <td className="p-3">
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="h-4 w-4 text-green-500" />
                                                    <span className="font-medium">{ward.unitName}</span>
                                                </div>
                                            </td>
                                            <td className="p-3 text-gray-600">{ward.departmentName}</td>
                                            <td className="text-right p-3">{ward.transactionCount}</td>
                                            <td className="text-right p-3 font-semibold">
                                                ₦{ward.totalSales.toLocaleString()}
                                            </td>
                                            <td className="text-right p-3">
                                                ₦{ward.averageSale.toLocaleString()}
                                            </td>
                                            <td className="text-right p-3">
                                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                                                    {((ward.totalSales / getTotalSales()) * 100).toFixed(1)}%
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-gray-50 font-bold">
                                        <td className="p-3" colSpan={2}>TOTAL</td>
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
                            <p className="text-sm mt-2">Try adjusting the filters</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default SalesByWardPage;
