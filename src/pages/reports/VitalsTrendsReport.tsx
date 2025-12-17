import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ApiService } from '@/services/apiService';
import { Loader2, Activity, Heart, Thermometer, Droplets } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function VitalsTrendsReport() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [dateRange, setDateRange] = useState('7d');

    useEffect(() => {
        loadData();
    }, [dateRange]);

    const loadData = async () => {
        try {
            setLoading(true);
            const endDate = new Date();
            const startDate = new Date();
            if (dateRange === '7d') startDate.setDate(endDate.getDate() - 7);
            if (dateRange === '30d') startDate.setDate(endDate.getDate() - 30);

            const report = await ApiService.getVitalsTrendsReport({
                date_from: startDate.toISOString().split('T')[0],
                date_to: endDate.toISOString().split('T')[0]
            });
            setData(report);
        } catch (error) {
            console.error('Error loading vitals report:', error);
            toast.error('Failed to load vitals data');
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

    const { summary, trends } = data;

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Vital Signs Trends</h1>
                    <p className="text-muted-foreground mt-1">Patient health metrics monitoring and analysis.</p>
                </div>
                <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Range" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="7d">Last 7 Days</SelectItem>
                        <SelectItem value="30d">Last 30 Days</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Readings</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summary.totalReadings}</div>
                        <p className="text-xs text-muted-foreground">Recorded in selected period</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Heart Rate</CardTitle>
                        <Heart className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summary.avgHeartRate} <span className="text-sm font-normal text-muted-foreground">bpm</span></div>
                        <p className="text-xs text-muted-foreground">Patient average</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg SpO2</CardTitle>
                        <Droplets className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summary.avgSpO2}<span className="text-sm font-normal text-muted-foreground">%</span></div>
                        <p className="text-xs text-muted-foreground">Oxygen saturation</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Abnormal Flags</CardTitle>
                        <Activity className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summary.abnormalReadings}</div>
                        <p className="text-xs text-muted-foreground">Readings outside normal range</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Blood Pressure Chart */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Blood Pressure Trend</CardTitle>
                        <CardDescription>Systolic vs Diastolic (Avg per day)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trends}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis domain={[40, 180]} />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="avgSystolic" stroke="#ef4444" name="Systolic" />
                                    <Line type="monotone" dataKey="avgDiastolic" stroke="#3b82f6" name="Diastolic" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Heart Rate & Temp Chart */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Heart Rate (BPM)</CardTitle>
                        <CardDescription>Average heart rate consistency</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trends}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Area type="monotone" dataKey="avgHeartRate" stroke="#ef4444" fill="#fee2e2" name="Heart Rate (BPM)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Temperature & SpO2</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={trends}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis yAxisId="left" domain={[35, 42]} />
                                <YAxis yAxisId="right" orientation="right" domain={[80, 100]} />
                                <Tooltip />
                                <Legend />
                                <Line yAxisId="left" type="monotone" dataKey="avgTemp" stroke="#f59e0b" name="Temp (°C)" />
                                <Line yAxisId="right" type="monotone" dataKey="avgSpO2" stroke="#06b6d4" name="SpO2 (%)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
