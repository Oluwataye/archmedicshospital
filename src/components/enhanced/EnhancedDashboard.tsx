import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Activity, 
  Users, 
  Calendar, 
  TestTube, 
  CreditCard,
  Search,
  Bell,
  Settings,
  User,
  TrendingUp,
  AlertTriangle,
  Plus
} from 'lucide-react';

interface DashboardStats {
  totalPatients: number;
  patientsGrowth: string;
  appointmentsToday: number;
  pendingAppointments: number;
  labTests: number;
  criticalResults: number;
  revenueToday: number;
  revenueGrowth: string;
}

interface EnhancedDashboardProps {
  stats?: DashboardStats;
  userRole?: string;
  userName?: string;
}

const defaultStats: DashboardStats = {
  totalPatients: 1247,
  patientsGrowth: '+12%',
  appointmentsToday: 24,
  pendingAppointments: 6,
  labTests: 58,
  criticalResults: 3,
  revenueToday: 12450,
  revenueGrowth: '+8%'
};

export function EnhancedDashboard({ 
  stats = defaultStats, 
  userRole = 'EHR Manager',
  userName = 'Dr. Smith'
}: EnhancedDashboardProps) {
  
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ARCHMEDICS HMS</h1>
          <p className="text-gray-600">Enhanced Dashboard - Welcome, {userName}</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" className="hover:bg-gray-100">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </Button>
          <Button variant="outline" size="sm" className="hover:bg-gray-100">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" size="sm" className="hover:bg-gray-100">
            <User className="w-4 h-4 mr-2" />
            Profile
          </Button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPatients.toLocaleString()}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {stats.patientsGrowth} from last month
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Appointments Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats.appointmentsToday}</p>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <Calendar className="w-3 h-3 mr-1" />
                  {stats.pendingAppointments} pending
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Lab Tests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.labTests}</p>
                <p className="text-xs text-red-600 flex items-center mt-1">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {stats.criticalResults} critical
                </p>
              </div>
              <div className="p-3 bg-amber-100 rounded-full">
                <TestTube className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue Today</p>
                <p className="text-2xl font-bold text-gray-900">${stats.revenueToday.toLocaleString()}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {stats.revenueGrowth} from yesterday
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-600" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Frequently used actions for {userRole}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button className="h-20 flex-col space-y-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="w-5 h-5" />
              <span className="text-sm">Add Patient</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-gray-50">
              <Calendar className="w-5 h-5" />
              <span className="text-sm">Schedule</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-gray-50">
              <TestTube className="w-5 h-5" />
              <span className="text-sm">Lab Order</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-gray-50">
              <Activity className="w-5 h-5" />
              <span className="text-sm">Vitals</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates and notifications</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-full">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">New patient registered</p>
                <p className="text-xs text-gray-500">John Doe (P-10248) - 2 minutes ago</p>
              </div>
              <Badge variant="secondary">New</Badge>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-red-50 rounded-lg">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Critical lab result</p>
                <p className="text-xs text-gray-500">Troponin I - Patient: Emily Davis - 5 minutes ago</p>
              </div>
              <Badge variant="destructive">Critical</Badge>
            </div>
            
            <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
              <div className="p-2 bg-green-100 rounded-full">
                <Calendar className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Appointment completed</p>
                <p className="text-xs text-gray-500">Dr. Johnson with Michael Brown - 10 minutes ago</p>
              </div>
              <Badge className="bg-green-100 text-green-800">Completed</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default EnhancedDashboard;
