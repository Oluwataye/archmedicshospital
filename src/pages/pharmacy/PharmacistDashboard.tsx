
import { useState } from 'react';
import { Search, Bell, Package, PlusCircle, AlertTriangle, ShoppingCart, BarChart3 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

export default function PharmacistDashboard() {
  const { toast } = useToast();
  const [patientSearchQuery, setPatientSearchQuery] = useState('');
  const [recentPrescriptions] = useState([
    {
      id: 'RX123456',
      patientName: 'John Doe',
      medication: 'Atorvastatin',
      dosage: '20mg',
      frequency: 'Daily',
      doctor: 'Dr. Howard',
      date: '10:30 AM Today',
      status: 'Pending',
      priority: 'Urgent',
      ward: 'ICU - Room 12'
    },
    {
      id: 'RX123457',
      patientName: 'Sarah Miller',
      medication: 'Metformin',
      dosage: '500mg',
      frequency: 'BID',
      doctor: 'Dr. Patel',
      date: '9:45 AM Today',
      status: 'Pending',
      priority: 'High',
      ward: 'Endocrinology - Room 5'
    },
    {
      id: 'RX123458',
      patientName: 'Robert Johnson',
      medication: 'Amoxicillin',
      dosage: '500mg',
      frequency: 'TID',
      doctor: 'Dr. Garcia',
      date: '9:15 AM Today',
      status: 'Pending',
      priority: 'Normal',
      ward: 'General Medicine - Room 23'
    }
  ]);
  
  const [stats] = useState({
    pendingVerifications: 12,
    readyToDispense: 8,
    inventoryAlerts: 3,
    totalPrescriptionsToday: 47
  });
  
  const [recentActivity] = useState([
    { time: '10:15 AM', activity: 'Dr. Howard prescribed Morphine Sulfate for John Doe', type: 'New Prescription' },
    { time: '10:05 AM', activity: 'You approved Insulin Lispro for Sarah Miller', type: 'Approval' },
    { time: '9:50 AM', activity: 'Inventory alert: Amoxicillin suspension below threshold', type: 'Inventory' },
    { time: '9:30 AM', activity: 'Dr. Williams prescribed Amoxicillin for Lisa Martin', type: 'New Prescription' },
    { time: '9:15 AM', activity: 'Drug interaction detected: Warfarin + Aspirin', type: 'Alert' }
  ]);

  const handlePatientSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Searching for patient",
      description: `Patient ID/Name: ${patientSearchQuery}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-red-500';
      case 'High':
        return 'bg-orange-500';
      case 'Normal':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return '!';
      case 'High':
        return 'H';
      case 'Normal':
        return 'N';
      default:
        return '';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'New Prescription':
        return <PlusCircle size={16} className="text-blue-500" />;
      case 'Approval':
        return <PlusCircle size={16} className="text-green-500" />;
      case 'Inventory':
        return <Package size={16} className="text-orange-500" />;
      case 'Alert':
        return <AlertTriangle size={16} className="text-red-500" />;
      default:
        return <PlusCircle size={16} className="text-gray-500" />;
    }
  };

  const handleApprove = (id: string) => {
    toast({
      title: "Prescription Approved",
      description: `Prescription ${id} has been approved`,
      variant: "default",
    });
  };

  const handleReject = (id: string) => {
    toast({
      title: "Prescription Rejected",
      description: `Prescription ${id} has been rejected`,
      variant: "destructive",
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Pharmacist Dashboard</h1>
        <p className="text-gray-600">Welcome back. Here's your daily overview.</p>
      </div>
      
      {/* Patient ID Search Box */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Patient Quick Search</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePatientSearch} className="flex items-center">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-500" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white"
                placeholder="Enter Patient ID or Name"
                value={patientSearchQuery}
                onChange={(e) => setPatientSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" className="ml-3">
              Search
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-500">
                <PlusCircle size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800">{stats.pendingVerifications}</h3>
                <p className="text-sm text-gray-600">Pending Verifications</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-500">
                <PlusCircle size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800">{stats.readyToDispense}</h3>
                <p className="text-sm text-gray-600">Ready to Dispense</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 text-orange-500">
                <AlertTriangle size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800">{stats.inventoryAlerts}</h3>
                <p className="text-sm text-gray-600">Inventory Alerts</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-500">
                <BarChart3 size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800">{stats.totalPrescriptionsToday}</h3>
                <p className="text-sm text-gray-600">Today's Prescriptions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Prescriptions */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-6">
          <CardTitle>Recent Prescriptions</CardTitle>
          <Button variant="link" className="text-blue-500">View All</Button>
        </CardHeader>
        <CardContent className="px-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Priority</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Medication</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPrescriptions.map((prescription) => (
                  <TableRow key={prescription.id} className={prescription.priority === 'Urgent' ? 'bg-red-50' : prescription.priority === 'High' ? 'bg-orange-50' : ''}>
                    <TableCell>
                      <div className="flex items-center">
                        <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs text-white font-bold ${getPriorityColor(prescription.priority)}`}>
                          {getPriorityIcon(prescription.priority)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                          {prescription.patientName.split(' ').map(name => name[0]).join('')}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{prescription.patientName}</div>
                          <div className="text-xs text-gray-500">{prescription.ward}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium text-gray-900">{prescription.medication}</div>
                      <div className="text-xs text-gray-500">{prescription.dosage} - {prescription.frequency}</div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-900">
                      {prescription.doctor}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900">{prescription.date}</div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(prescription.status)}`}>
                        {prescription.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        className="text-green-600 hover:text-green-900 mr-3"
                        onClick={() => handleApprove(prescription.id)}
                      >
                        Approve
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleReject(prescription.id)}
                      >
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-6">
          <CardTitle>Recent Activity</CardTitle>
          <Button variant="link" className="text-blue-500">View All</Button>
        </CardHeader>
        <CardContent>
          <ul className="divide-y divide-gray-200">
            {recentActivity.map((activity, index) => (
              <li key={index} className="py-3 flex">
                <div className="mr-4">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{activity.activity}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
