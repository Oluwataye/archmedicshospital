import React from 'react';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, TrendingUp } from 'lucide-react';

interface TreatmentOutcomesChartProps {
    data: any[];
    chartType?: 'bar' | 'line' | 'area';
}

const COLORS = {
    successful: '#10B981',
    partiallySuccessful: '#F59E0B',
    unsuccessful: '#EF4444'
};

const TreatmentOutcomesChart: React.FC<TreatmentOutcomesChartProps> = ({
    data,
    chartType = 'bar'
}) => {
    // Aggregate outcomes by treatment type
    const outcomesByTreatment = data.reduce((acc: any[], item) => {
        const existing = acc.find(a => a.treatment === item.treatment);
        if (existing) {
            if (item.outcome === 'Successful') existing.successful++;
            else if (item.outcome === 'Partially Successful') existing.partiallySuccessful++;
            else existing.unsuccessful++;
        } else {
            acc.push({
                treatment: item.treatment,
                successful: item.outcome === 'Successful' ? 1 : 0,
                partiallySuccessful: item.outcome === 'Partially Successful' ? 1 : 0,
                unsuccessful: item.outcome === 'Unsuccessful' ? 1 : 0
            });
        }
        return acc;
    }, []).slice(0, 10);

    // Calculate success rates over time (by month)
    const successRatesByMonth = data.reduce((acc: any[], item) => {
        const month = item.startDate ? new Date(item.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Unknown';
        const existing = acc.find(a => a.month === month);

        if (existing) {
            existing.total++;
            if (item.outcome === 'Successful') existing.successful++;
        } else {
            acc.push({
                month,
                total: 1,
                successful: item.outcome === 'Successful' ? 1 : 0,
                successRate: 0
            });
        }
        return acc;
    }, []);

    // Calculate success rate percentage
    successRatesByMonth.forEach(item => {
        item.successRate = item.total > 0 ? (item.successful / item.total) * 100 : 0;
    });

    if (chartType === 'bar') {
        return (
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-blue-500" />
                        <CardTitle>Outcomes by Treatment Type</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={outcomesByTreatment}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="treatment"
                                angle={-45}
                                textAnchor="end"
                                height={100}
                                interval={0}
                            />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="successful" stackId="a" fill={COLORS.successful} name="Successful" />
                            <Bar dataKey="partiallySuccessful" stackId="a" fill={COLORS.partiallySuccessful} name="Partially Successful" />
                            <Bar dataKey="unsuccessful" stackId="a" fill={COLORS.unsuccessful} name="Unsuccessful" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        );
    }

    if (chartType === 'line') {
        return (
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-blue-500" />
                        <CardTitle>Success Rate Trend</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={successRatesByMonth}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="successRate"
                                stroke="#3B82F6"
                                strokeWidth={2}
                                name="Success Rate (%)"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    <CardTitle>Success Rate Trend (Area)</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={successRatesByMonth}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
                        <Legend />
                        <Area
                            type="monotone"
                            dataKey="successRate"
                            stroke="#3B82F6"
                            fill="#3B82F6"
                            fillOpacity={0.3}
                            name="Success Rate (%)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default TreatmentOutcomesChart;
