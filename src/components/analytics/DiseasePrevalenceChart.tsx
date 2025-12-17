import React from 'react';
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, PieChart as PieChartIcon } from 'lucide-react';

interface DiseasePrevalenceChartProps {
    data: any[];
    chartType?: 'bar' | 'pie';
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

const DiseasePrevalenceChart: React.FC<DiseasePrevalenceChartProps> = ({
    data,
    chartType = 'bar'
}) => {
    // Prepare data for charts
    const topDiseases = [...data]
        .sort((a, b) => b.cases - a.cases)
        .slice(0, 8)
        .map(item => ({
            name: item.disease,
            cases: item.cases,
            department: item.department
        }));

    // Prepare age group distribution
    const ageGroupData = data.reduce((acc: any[], item) => {
        const existing = acc.find(a => a.name === item.ageGroup);
        if (existing) {
            existing.value += item.cases;
        } else {
            acc.push({ name: item.ageGroup, value: item.cases });
        }
        return acc;
    }, []);

    if (chartType === 'bar') {
        return (
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-blue-500" />
                        <CardTitle>Top Diseases by Case Count</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={topDiseases}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="name"
                                angle={-45}
                                textAnchor="end"
                                height={100}
                                interval={0}
                            />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="cases" fill="#3B82F6" name="Cases" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-blue-500" />
                    <CardTitle>Distribution by Age Group</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={ageGroupData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {ageGroupData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default DiseasePrevalenceChart;
