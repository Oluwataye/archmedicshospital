import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ApiService } from '@/services/apiService';
import { Loader2, Pill, CheckCircle, AlertTriangle, XCircle, Activity } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function MedicationReport() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const report = await ApiService.getMedicationComplianceReport();
            setData(report);
        } catch (error) {
            console.error('Error loading medication report:', error);
            toast.error('Failed to load medication data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!data) return null;

    const { summary, trends, missedDoses } = data;

    // Pie data for compliance
    const pieData = [
        { name: 'Administered', value: summary.administered, color: '#22c55e' },
        { name: 'Missed', value: summary.missed, color: '#ef4444' },
        { name: 'Late', value: summary.late, color: '#eab308' }
    ].filter(d => d.value > 0);

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Medication Administration Report (MAR)</h1>
                <p className="text-muted-foreground mt-1">Compliance tracking and missed dose alerts.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-6 md:grid-cols-4 mb-6">
                <Card className="card-accent-blue hover:shadow-lg transition-all hover:scale-105">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Scheduled</p>
                            <h2 className="text-3xl font-bold text-blue-600">{summary.total}</h2>
                            <p className="text-xs text-muted-foreground mt-1">Doses scheduled today</p>
                        </div>
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Pill className="h-6 w-6 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="card-accent-green hover:shadow-lg transition-all hover:scale-105">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Administered</p>
                            <h2 className="text-3xl font-bold text-green-600">{summary.administered}</h2>
                            <p className="text-xs text-muted-foreground mt-1">
                                {((summary.administered / summary.total) * 100).toFixed(1)}% Completion
                            </p>
                        </div>
                        <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="card-accent-red hover:shadow-lg transition-all hover:scale-105">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Missed Doses</p>
                            <h2 className="text-3xl font-bold text-red-600">{summary.missed}</h2>
                            <p className="text-xs text-muted-foreground mt-1">Requires immediate attention</p>
                        </div>
                        <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                            <XCircle className="h-6 w-6 text-red-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="card-accent-purple hover:shadow-lg transition-all hover:scale-105">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Compliance Rate</p>
                            <h2 className="text-3xl font-bold text-purple-600">{summary.complianceRate}%</h2>
                            <p className="text-xs text-muted-foreground mt-1">Overall adherence</p>
                        </div>
                        <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <Activity className="h-6 w-6 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Trends Chart */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Administration Trends (Last 7 Days)</CardTitle>
                        <CardDescription>Scheduled vs Administered doses over time.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trends}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="scheduled" stroke="#8884d8" name="Scheduled" />
                                    <Line type="monotone" dataKey="administered" stroke="#82ca9d" name="Administered" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Compliance Pie Chart */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Today's Status</CardTitle>
                        <CardDescription>Breakdown of dose statuses.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Missed Doses Alert List */}
            <Card className="border-red-200">
                <CardHeader className="bg-red-50">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <CardTitle className="text-red-900">Missed Doses / Action Required</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Patient</TableHead>
                                <TableHead>Medication</TableHead>
                                <TableHead>Scheduled Time</TableHead>
                                <TableHead>Ward</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {missedDoses.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                                        No missed doses reported.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                missedDoses.map((dose: any) => (
                                    <TableRow key={dose.id}>
                                        <TableCell className="font-medium">
                                            {dose.patientName} <span className="text-xs text-muted-foreground">({dose.mrn})</span>
                                        </TableCell>
                                        <TableCell>{dose.medication}</TableCell>
                                        <TableCell>{new Date(dose.scheduledAt).toLocaleTimeString()}</TableCell>
                                        <TableCell>{dose.ward}</TableCell>
                                        <TableCell>
                                            <Badge variant="destructive">Missed</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
