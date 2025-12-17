import React, { useState, useEffect } from 'react';
import { FileText, Download, Printer, Filter, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import hmoService from '@/services/hmoService';
import { ApiService } from '@/services/apiService';
import { useHospitalSettings } from '@/contexts/HospitalSettingsContext';

export default function HMOReportsPage() {
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState<any[]>([]);
    const [providers, setProviders] = useState<any[]>([]);
    const { settings } = useHospitalSettings();

    const currentYear = new Date().getFullYear();
    const [selectedMonth, setSelectedMonth] = useState<string>(String(new Date().getMonth() + 1));
    const [selectedYear, setSelectedYear] = useState<string>(String(currentYear));
    const [selectedProvider, setSelectedProvider] = useState<string>('all');

    useEffect(() => {
        loadProviders();
    }, []);

    const loadProviders = async () => {
        try {
            const data = await hmoService.getHMOProviders();
            setProviders(data);
        } catch (error) {
            console.error('Error loading providers:', error);
        }
    };

    const generateReport = async () => {
        try {
            setLoading(true);
            const response = await hmoService.getMonthlyBillingReport(selectedMonth, selectedYear, selectedProvider);
            setReportData(response);
            if (response.length === 0) {
                toast.info('No data found for the selected period');
            } else {
                toast.success('Report generated successfully');
            }
        } catch (error) {
            console.error('Error generating report:', error);
            toast.error('Failed to generate report');
        } finally {
            setLoading(false);
        }
    };

    const exportExcel = () => {
        if (reportData.length === 0) return;

        const headers = ['HMO Provider', 'Patient Name', 'Enrollee ID', 'Authorization Codes', 'Claims Count', 'Total Billed', 'Patient Copay', 'HMO Liability'];
        const csvContent = [
            headers.join(','),
            ...reportData.map(row => [
                `"${row.hmo_name}"`,
                `"${row.patient_name}"`,
                `"${row.enrollee_id}"`,
                `"${row.authorization_codes}"`,
                row.claim_count,
                row.total_billed,
                row.patient_copay,
                row.hmo_liability
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `HMO_Billing_Report_${selectedMonth}_${selectedYear}.csv`;
        link.click();
    };

    const exportWord = () => {
        if (reportData.length === 0) return;

        const content = `
            <html>
                <head>
                    <style>
                        table { border-collapse: collapse; width: 100%; }
                        th, td { border: 1px solid black; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                        body { font-family: Arial, sans-serif; }
                        .text-right { text-align: right; }
                        .text-center { text-align: center; }
                    </style>
                </head>
                <body>
                    <h2>HMO Monthly Billing Report</h2>
                    <p>Period: ${new Date(0, parseInt(selectedMonth) - 1).toLocaleString('default', { month: 'long' })} ${selectedYear}</p>
                    <table>
                        <thead>
                            <tr>
                                <th>HMO Provider</th>
                                <th>Patient Name</th>
                                <th>Enrollee ID</th>
                                <th>Authorization Codes</th>
                                <th class="text-center">Claims</th>
                                <th class="text-right">Total Billed</th>
                                <th class="text-right">Patient Copay</th>
                                <th class="text-right">HMO Liability</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${reportData.map(row => `
                                <tr>
                                    <td>${row.hmo_name}</td>
                                    <td>${row.patient_name}</td>
                                    <td>${row.enrollee_id}</td>
                                    <td>${row.authorization_codes}</td>
                                    <td class="text-center">${row.claim_count}</td>
                                    <td class="text-right">₦${row.total_billed.toLocaleString()}</td>
                                    <td class="text-right">₦${row.patient_copay.toLocaleString()}</td>
                                    <td class="text-right">₦${row.hmo_liability.toLocaleString()}</td>
                                </tr>
                            `).join('')}
                            <tr style="font-weight: bold; background-color: #f9f9f9;">
                                <td colspan="4">Total</td>
                                <td class="text-center">${reportData.reduce((acc, curr) => acc + curr.claim_count, 0)}</td>
                                <td class="text-right">₦${reportData.reduce((acc, curr) => acc + curr.total_billed, 0).toLocaleString()}</td>
                                <td class="text-right">₦${reportData.reduce((acc, curr) => acc + curr.patient_copay, 0).toLocaleString()}</td>
                                <td class="text-right">₦${reportData.reduce((acc, curr) => acc + curr.hmo_liability, 0).toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>
                </body>
            </html>
        `;

        const blob = new Blob([content], { type: 'application/msword' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `HMO_Billing_Report_${selectedMonth}_${selectedYear}.doc`;
        link.click();
    };

    const printReport = () => {
        window.print();
    };

    return (
        <div className="space-y-6 p-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 no-print">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">HMO Monthly Billing</h1>
                    <p className="text-muted-foreground mt-1">Generate and export monthly billing reports per enrollee</p>
                </div>
            </div>

            <Card className="no-print">
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Month</label>
                            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Month" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                        <SelectItem key={m} value={String(m)}>
                                            {new Date(0, m - 1).toLocaleString('default', { month: 'long' })}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Year</label>
                            <Select value={selectedYear} onValueChange={setSelectedYear}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[currentYear, currentYear - 1, currentYear - 2].map(y => (
                                        <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">HMO Provider</label>
                            <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Providers" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Providers</SelectItem>
                                    {providers.map(p => (
                                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={generateReport} disabled={loading}>
                            {loading && <span className="mr-2">Loading...</span>}
                            {!loading && <Filter className="h-4 w-4 mr-2" />}
                            Generate Report
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {reportData.length > 0 && (
                <div className="space-y-4">
                    <div className="flex justify-end gap-2 no-print">
                        <Button variant="outline" onClick={exportExcel}>
                            <FileText className="h-4 w-4 mr-2 text-green-600" />
                            Excel
                        </Button>
                        <Button variant="outline" onClick={exportWord}>
                            <FileText className="h-4 w-4 mr-2 text-blue-600" />
                            Word
                        </Button>
                        <Button variant="outline" onClick={printReport}>
                            <Printer className="h-4 w-4 mr-2" />
                            Print / PDF
                        </Button>
                    </div>

                    <Card className="print-content">
                        <CardHeader className="print-header hidden print:block">
                            <CardTitle className="text-center text-2xl">{settings?.hospital_name || 'Hospital'}</CardTitle>
                            <p className="text-center text-muted-foreground">HMO Monthly Billing Report - {new Date(0, parseInt(selectedMonth) - 1).toLocaleString('default', { month: 'long' })} {selectedYear}</p>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>HMO Provider</TableHead>
                                        <TableHead>Patient Name</TableHead>
                                        <TableHead>Enrollee ID</TableHead>
                                        <TableHead>Authorization Codes</TableHead>
                                        <TableHead className="text-center">Claims</TableHead>
                                        <TableHead className="text-right">Total Billed</TableHead>
                                        <TableHead className="text-right">Patient Copay</TableHead>
                                        <TableHead className="text-right">HMO Liability</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reportData.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{row.hmo_name}</TableCell>
                                            <TableCell>{row.patient_name}</TableCell>
                                            <TableCell>{row.enrollee_id}</TableCell>
                                            <TableCell>{row.authorization_codes}</TableCell>
                                            <TableCell className="text-center">{row.claim_count}</TableCell>
                                            <TableCell className="text-right">₦{row.total_billed.toLocaleString()}</TableCell>
                                            <TableCell className="text-right">₦{row.patient_copay.toLocaleString()}</TableCell>
                                            <TableCell className="text-right font-bold">₦{row.hmo_liability.toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow className="bg-muted/50 font-bold">
                                        <TableCell colSpan={4}>Total</TableCell>
                                        <TableCell className="text-center">{reportData.reduce((acc, curr) => acc + curr.claim_count, 0)}</TableCell>
                                        <TableCell className="text-right">₦{reportData.reduce((acc, curr) => acc + curr.total_billed, 0).toLocaleString()}</TableCell>
                                        <TableCell className="text-right">₦{reportData.reduce((acc, curr) => acc + curr.patient_copay, 0).toLocaleString()}</TableCell>
                                        <TableCell className="text-right">₦{reportData.reduce((acc, curr) => acc + curr.hmo_liability, 0).toLocaleString()}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            )}

            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    .print-content { box-shadow: none; border: none; }
                    .print-header { display: block !important; margin-bottom: 20px; }
                }
            `}</style>
        </div>
    );
}
