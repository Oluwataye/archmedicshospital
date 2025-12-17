import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Printer, FileText, CheckCircle, AlertTriangle, Download } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import apiService from '@/services/apiService';

const LabReportsPage = () => {
    const [searchParams] = useSearchParams();
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');

    const fetchReports = async () => {
        try {
            setLoading(true);
            const data = await apiService.getCompletedLabResults();
            setReports(data);
        } catch (error) {
            console.error('Error fetching reports:', error);
            toast.error('Failed to load lab reports');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const filteredReports = reports.filter(report => {
        const matchesSearch =
            report.patient_first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.patient_last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.test_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.patient_mrn?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'critical' ? report.is_critical : true); // Add more status logic if needed

        return matchesSearch && matchesStatus;
    });

    const handlePrint = (report: any) => {
        toast.success(`Printing report for ${report.test_name}`);
        // In a real app, this would open a print window or PDF
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Lab Reports</h1>
                    <p className="text-gray-500">View and print completed test results</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                            placeholder="Search patient or test..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button
                        variant={statusFilter === 'critical' ? 'destructive' : 'outline'}
                        onClick={() => setStatusFilter(statusFilter === 'all' ? 'critical' : 'all')}
                        className="gap-2"
                    >
                        <AlertTriangle className="h-4 w-4" />
                        {statusFilter === 'critical' ? 'Show All' : 'Critical Only'}
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-700 uppercase font-medium">
                                <tr>
                                    <th className="px-6 py-3">Patient</th>
                                    <th className="px-6 py-3">Test</th>
                                    <th className="px-6 py-3">Result</th>
                                    <th className="px-6 py-3">Completed Date</th>
                                    <th className="px-6 py-3">Reference</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                            Loading reports...
                                        </td>
                                    </tr>
                                ) : filteredReports.length > 0 ? (
                                    filteredReports.map((report) => (
                                        <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">
                                                    {report.patient_first_name} {report.patient_last_name}
                                                </div>
                                                <div className="text-xs text-gray-500">{report.patient_mrn}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-indigo-600">{report.test_name}</div>
                                                <div className="text-xs text-gray-500">{report.category}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">{report.result_value}</span>
                                                    <span className="text-gray-500">{report.unit}</span>
                                                </div>
                                                {report.is_critical && (
                                                    <Badge variant="destructive" className="mt-1 text-xs">CRITICAL</Badge>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {report.result_date ? format(parseISO(report.result_date), 'MMM d, yyyy h:mm a') : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">
                                                {report.reference_range || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handlePrint(report)}
                                                    className="gap-2 text-gray-600 hover:text-gray-900"
                                                >
                                                    <Printer className="h-4 w-4" />
                                                    Print
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <FileText className="h-12 w-12 text-gray-200 mb-3" />
                                                <p className="font-medium">No reports found</p>
                                                <p className="text-sm">Try adjusting your search filters</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default LabReportsPage;
