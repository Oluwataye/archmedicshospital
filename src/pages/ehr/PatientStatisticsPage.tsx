
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  FileText, 
  Users, 
  Clock,
  Calendar,
  Filter
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ResponsiveContainer,
  BarChart as RechartBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const PatientStatisticsPage = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [department, setDepartment] = useState('all');

  // Sample data for charts
  const patientAdmissionsData = [
    { name: 'Jan', admissions: 120 },
    { name: 'Feb', admissions: 135 },
    { name: 'Mar', admissions: 145 },
    { name: 'Apr', admissions: 130 },
    { name: 'May', admissions: 150 },
    { name: 'Jun', admissions: 158 },
    { name: 'Jul', admissions: 162 },
    { name: 'Aug', admissions: 145 },
    { name: 'Sep', admissions: 140 },
    { name: 'Oct', admissions: 155 },
    { name: 'Nov', admissions: 165 },
    { name: 'Dec', admissions: 170 },
  ];

  const averageLengthOfStayData = [
    { name: 'Jan', days: 5.2 },
    { name: 'Feb', days: 4.9 },
    { name: 'Mar', days: 5.1 },
    { name: 'Apr', days: 4.8 },
    { name: 'May', days: 5.0 },
    { name: 'Jun', days: 4.7 },
    { name: 'Jul', days: 4.5 },
    { name: 'Aug', days: 4.6 },
    { name: 'Sep', days: 4.8 },
    { name: 'Oct', days: 5.0 },
    { name: 'Nov', days: 4.9 },
    { name: 'Dec', days: 5.2 },
  ];

  const patientDemographicsData = [
    { name: '0-18', value: 15 },
    { name: '19-35', value: 25 },
    { name: '36-50', value: 30 },
    { name: '51-65', value: 20 },
    { name: '66+', value: 10 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Patient Statistics</h1>
          <div className="text-sm text-gray-500 flex items-center mt-1">
            <span>Health Records</span>
            <span className="mx-2">›</span>
            <span>Reports</span>
            <span className="mx-2">›</span>
            <span className="text-blue-500">Patient Statistics</span>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Time Period:</span>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-center gap-2 ml-0 md:ml-4">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Department:</span>
          </div>
          <Select value={department} onValueChange={setDepartment}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="cardiology">Cardiology</SelectItem>
              <SelectItem value="neurology">Neurology</SelectItem>
              <SelectItem value="pediatrics">Pediatrics</SelectItem>
              <SelectItem value="orthopedics">Orthopedics</SelectItem>
              <SelectItem value="oncology">Oncology</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Patient Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-4 flex flex-col items-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-3xl font-bold text-center">1,247</h3>
            <p className="text-gray-500 text-center mt-2">Total Patients</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <Users className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-3xl font-bold text-center">85</h3>
            <p className="text-gray-500 text-center mt-2">New Patients This Month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col items-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-4">
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
            <h3 className="text-3xl font-bold text-center">4.8</h3>
            <p className="text-gray-500 text-center mt-2">Average Length of Stay (Days)</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Admissions Chart */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <BarChart className="h-5 w-5 text-blue-500 mr-2" />
              Patient Admissions
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RechartBarChart data={patientAdmissionsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="admissions" fill="#3B82F6" />
                </RechartBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Average Length of Stay Chart */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <Clock className="h-5 w-5 text-purple-500 mr-2" />
              Average Length of Stay
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={averageLengthOfStayData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="days" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Age Demographics Chart */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg mb-4 flex items-center">
              <Users className="h-5 w-5 text-green-500 mr-2" />
              Age Demographics
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={patientDemographicsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {patientDemographicsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientStatisticsPage;
