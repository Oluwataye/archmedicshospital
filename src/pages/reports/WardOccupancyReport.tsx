import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ApiService } from '@/services/apiService';
import { Loader2, Bed, Users, Activity, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function WardOccupancyReport() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const report = await ApiService.getWardOccupancyReport();
            setData(report);
        } catch (error) {
            console.error('Error loading occupancy report:', error);
            toast.error('Failed to load occupancy data');
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

    const { summary, details } = data;

    // Pie chart data
    const pieData = [
        { name: 'Occupied', value: summary.totalOccupied, color: '#ef4444' }, // Red
        { name: 'Available', value: summary.totalAvailable, color: '#22c55e' }, // Green
        { name: 'Maintenance', value: summary.totalBeds - (summary.totalOccupied + summary.totalAvailable), color: '#eab308' } // Yellow
    ].filter(d => d.value > 0);

    return (
        <div className="space-y-6 p-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Ward Occupancy Report</h1>
                <p className="text-muted-foreground mt-1">Real-time analysis of bed utilization and capacity.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-6 md:grid-cols-4 mb-6">
                <Card className="card-accent-blue hover:shadow-lg transition-all hover:scale-105">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Capacity</p>
                            <h2 className="text-3xl font-bold text-blue-600">{summary.totalBeds}</h2>
                            <p className="text-xs text-muted-foreground mt-1">Total beds across all wards</p>
                        </div>
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Bed className="h-6 w-6 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="card-accent-green hover:shadow-lg transition-all hover:scale-105">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Occupied Beds</p>
                            <h2 className="text-3xl font-bold text-green-600">{summary.totalOccupied}</h2>
                            <p className="text-xs text-muted-foreground mt-1">Currently admitted</p>
                        </div>
                        <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                            <Users className="h-6 w-6 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="card-accent-orange hover:shadow-lg transition-all hover:scale-105">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Available Beds</p>
                            <h2 className="text-3xl font-bold text-orange-600">{summary.totalAvailable}</h2>
                            <p className="text-xs text-muted-foreground mt-1">Ready for admission</p>
                        </div>
                        <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                            <Activity className="h-6 w-6 text-orange-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="card-accent-purple hover:shadow-lg transition-all hover:scale-105">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Occupancy Rate</p>
                            <h2 className="text-3xl font-bold text-purple-600">{summary.overallOccupancy}%</h2>
                            <p className="text-xs text-muted-foreground mt-1">Overall utilization</p>
                        </div>
                        <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <Activity className="h-6 w-6 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Occupancy by Ward Chart */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Occupancy by Ward</CardTitle>
                        <CardDescription>Breakdown of occupied vs available beds per ward.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={details}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="wardName" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="occupied" name="Occupied" fill="#ef4444" stackId="a" />
                                    <Bar dataKey="available" name="Available" fill="#22c55e" stackId="a" />
                                    <Bar dataKey="maintenance" name="Maintenance" fill="#eab308" stackId="a" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Overall Status Pie Chart */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Bed Status Distribution</CardTitle>
                        <CardDescription>Overall hospital bed status.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
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
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Detailed Ward Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Ward Name</TableHead>
                                <TableHead className="text-right">Total Beds</TableHead>
                                <TableHead className="text-right">Occupied</TableHead>
                                <TableHead className="text-right">Available</TableHead>
                                <TableHead className="text-right">Maintenance</TableHead>
                                <TableHead className="text-right">Occupancy Rate</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {details.map((ward: any) => (
                                <TableRow key={ward.wardId}>
                                    <TableCell className="font-medium">{ward.wardName}</TableCell>
                                    <TableCell className="text-right">{ward.totalBeds}</TableCell>
                                    <TableCell className="text-right">{ward.occupied}</TableCell>
                                    <TableCell className="text-right">{ward.available}</TableCell>
                                    <TableCell className="text-right text-yellow-600">{ward.maintenance}</TableCell>
                                    <TableCell className="text-right">{ward.occupancyRate}%</TableCell>
                                    <TableCell className="text-right">
                                        <Badge variant={
                                            Number(ward.occupancyRate) > 90 ? 'destructive' :
                                                Number(ward.occupancyRate) > 75 ? 'secondary' : 'default' // Using secondary as warning-ish for shadcn default
                                        } className={
                                            Number(ward.occupancyRate) > 90 ? 'bg-red-100 text-red-800' :
                                                Number(ward.occupancyRate) > 75 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                        }>
                                            {Number(ward.occupancyRate) > 90 ? 'Critical' : Number(ward.occupancyRate) > 75 ? 'High' : 'Normal'}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
