import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { 
  Activity, 
  Users, 
  Calendar, 
  FileText, 
  TestTube, 
  CreditCard,
  Search,
  Bell,
  Settings,
  User,
  Heart,
  Thermometer,
  Droplets,
  Wind,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus
} from 'lucide-react'
import './App.css'

// Enhanced color palette for healthcare
const healthcareColors = {
  primary: 'hsl(210, 100%, 50%)', // Medical blue
  secondary: 'hsl(142, 76%, 36%)', // Medical green
  accent: 'hsl(39, 100%, 57%)', // Warm amber
  critical: 'hsl(0, 84%, 60%)', // Alert red
  warning: 'hsl(38, 92%, 50%)', // Warning orange
  success: 'hsl(142, 76%, 36%)', // Success green
  muted: 'hsl(210, 40%, 98%)', // Light background
}

// Mock data for demonstration
const mockPatients = [
  {
    id: 'P-10237',
    name: 'John Smith',
    age: 42,
    gender: 'Male',
    status: 'Active',
    lastVisit: 'Apr 25, 2025',
    records: 3,
    vitals: {
      bloodPressure: '120/80',
      heartRate: 72,
      temperature: 98.6,
      oxygenSat: 98
    }
  },
  {
    id: 'P-10892',
    name: 'Emily Davis',
    age: 35,
    gender: 'Female',
    status: 'Follow-up',
    lastVisit: 'Apr 22, 2025',
    records: 5,
    vitals: {
      bloodPressure: '118/75',
      heartRate: 68,
      temperature: 98.4,
      oxygenSat: 99
    }
  },
  {
    id: 'P-10745',
    name: 'Michael Brown',
    age: 58,
    gender: 'Male',
    status: 'New',
    lastVisit: 'Today',
    records: 1,
    vitals: {
      bloodPressure: '135/85',
      heartRate: 78,
      temperature: 99.1,
      oxygenSat: 97
    }
  }
]

const mockLabResults = [
  {
    id: 'LAB-10245',
    patient: 'John Smith (P-10237)',
    testType: 'Complete Blood Count',
    requestedBy: 'Dr. Sarah Johnson',
    priority: 'Routine',
    status: 'Pending',
    time: '09:15 AM'
  },
  {
    id: 'LAB-10246',
    patient: 'Emily Davis (P-10238)',
    testType: 'Lipid Profile',
    requestedBy: 'Dr. Michael Brown',
    priority: 'Routine',
    status: 'In Progress',
    time: '09:30 AM'
  },
  {
    id: 'LAB-10247',
    patient: 'Robert Wilson (P-10239)',
    testType: 'Troponin I',
    requestedBy: 'Dr. Lisa Taylor',
    priority: 'STAT',
    status: 'Critical',
    time: '09:45 AM'
  }
]

// Enhanced Patient Card Component
function EnhancedPatientCard({ patient }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Follow-up': return 'bg-blue-100 text-blue-800'
      case 'New': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getVitalStatus = (vital, type) => {
    if (type === 'bloodPressure') {
      const [systolic] = vital.split('/').map(Number)
      return systolic > 130 ? 'text-red-600' : 'text-green-600'
    }
    if (type === 'heartRate') {
      return vital > 100 || vital < 60 ? 'text-red-600' : 'text-green-600'
    }
    if (type === 'temperature') {
      return vital > 99.5 ? 'text-red-600' : 'text-green-600'
    }
    if (type === 'oxygenSat') {
      return vital < 95 ? 'text-red-600' : 'text-green-600'
    }
    return 'text-gray-600'
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">{patient.name}</CardTitle>
            <CardDescription className="text-sm text-gray-600">
              MRN: {patient.id} | {patient.age} years, {patient.gender}
            </CardDescription>
          </div>
          <Badge className={`${getStatusColor(patient.status)} font-medium`}>
            {patient.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Last visit:</span>
            <p className="font-medium">{patient.lastVisit}</p>
          </div>
          <div>
            <span className="text-gray-500">Records:</span>
            <p className="font-medium">{patient.records} Records</p>
          </div>
        </div>
        
        {/* Enhanced Vital Signs Display */}
        <div className="border-t pt-3">
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Activity className="w-4 h-4 mr-1" />
            Latest Vitals
          </h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center space-x-2">
              <Heart className="w-3 h-3 text-red-500" />
              <div>
                <span className="text-gray-500">BP:</span>
                <span className={`ml-1 font-medium ${getVitalStatus(patient.vitals.bloodPressure, 'bloodPressure')}`}>
                  {patient.vitals.bloodPressure} mmHg
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="w-3 h-3 text-blue-500" />
              <div>
                <span className="text-gray-500">HR:</span>
                <span className={`ml-1 font-medium ${getVitalStatus(patient.vitals.heartRate, 'heartRate')}`}>
                  {patient.vitals.heartRate} bpm
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Thermometer className="w-3 h-3 text-orange-500" />
              <div>
                <span className="text-gray-500">Temp:</span>
                <span className={`ml-1 font-medium ${getVitalStatus(patient.vitals.temperature, 'temperature')}`}>
                  {patient.vitals.temperature}°F
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Wind className="w-3 h-3 text-cyan-500" />
              <div>
                <span className="text-gray-500">O2:</span>
                <span className={`ml-1 font-medium ${getVitalStatus(patient.vitals.oxygenSat, 'oxygenSat')}`}>
                  {patient.vitals.oxygenSat}%
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2 pt-2">
          <Button size="sm" variant="outline" className="flex-1">
            View Chart
          </Button>
          <Button size="sm" className="flex-1">
            New Record
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Enhanced Lab Results Component
function EnhancedLabResults() {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <Clock className="w-4 h-4 text-yellow-500" />
      case 'In Progress': return <Activity className="w-4 h-4 text-blue-500" />
      case 'Critical': return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'Completed': return <CheckCircle className="w-4 h-4 text-green-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'In Progress': return 'bg-blue-100 text-blue-800'
      case 'Critical': return 'bg-red-100 text-red-800'
      case 'Completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'STAT': return 'bg-red-500 text-white'
      case 'Urgent': return 'bg-orange-500 text-white'
      case 'Routine': return 'bg-gray-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold flex items-center">
          <TestTube className="w-5 h-5 mr-2 text-blue-600" />
          Lab Results
        </h3>
        <Button size="sm" className="flex items-center">
          <Plus className="w-4 h-4 mr-1" />
          New Test Request
        </Button>
      </div>
      
      <div className="space-y-3">
        {mockLabResults.map((result) => (
          <Card key={result.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {getStatusIcon(result.status)}
                    <span className="font-medium text-gray-900">{result.testType}</span>
                    <Badge className={`text-xs ${getPriorityColor(result.priority)}`}>
                      {result.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{result.patient}</p>
                  <p className="text-xs text-gray-500">Requested by {result.requestedBy} • {result.time}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={`${getStatusColor(result.status)}`}>
                    {result.status}
                  </Badge>
                  <Button size="sm" variant="outline">
                    {result.status === 'Pending' ? 'Process' : 'View'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Enhanced Dashboard Component
function EnhancedDashboard() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ARCHMEDICS HMS</h1>
          <p className="text-gray-600">Enhanced UI/UX Dashboard</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <Bell className="w-4 h-4 mr-1" />
            Notifications
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-1" />
            Settings
          </Button>
          <Button variant="outline" size="sm">
            <User className="w-4 h-4 mr-1" />
            Profile
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +12% from last month
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Appointments Today</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <Calendar className="w-3 h-3 mr-1" />
                  6 pending
                </p>
              </div>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Lab Tests</p>
                <p className="text-2xl font-bold text-gray-900">58</p>
                <p className="text-xs text-red-600 flex items-center mt-1">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  3 critical
                </p>
              </div>
              <TestTube className="w-8 h-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue Today</p>
                <p className="text-2xl font-bold text-gray-900">$12,450</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +8% from yesterday
                </p>
              </div>
              <CreditCard className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="patients" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="patients">Patient Management</TabsTrigger>
          <TabsTrigger value="lab">Lab Results</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="patients" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Recent Patients</h2>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Search patients..." className="pl-10 w-64" />
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-1" />
                Add Patient
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockPatients.map((patient) => (
              <EnhancedPatientCard key={patient.id} patient={patient} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="lab" className="space-y-4">
          <EnhancedLabResults />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Dashboard</CardTitle>
              <CardDescription>
                Comprehensive analytics and reporting features would be implemented here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                This section would include charts, graphs, and detailed analytics for:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
                <li>Patient demographics and trends</li>
                <li>Lab result patterns and critical values</li>
                <li>Appointment scheduling efficiency</li>
                <li>Revenue and billing analytics</li>
                <li>Staff productivity metrics</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<EnhancedDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
