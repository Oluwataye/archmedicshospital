import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  FlaskConical, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
} from 'lucide-react';

const LabDashboard = () => {
  const navigate = useNavigate();

  // Statistics data - would come from API in a real application
  const stats = [
    { title: "Today's Tests", value: 24, icon: <FlaskConical className="h-5 w-5 text-blue-600" />, color: 'bg-blue-100' },
    { title: "Pending Tests", value: 12, icon: <Clock className="h-5 w-5 text-yellow-600" />, color: 'bg-yellow-100' },
    { title: "Completed Today", value: 10, icon: <CheckCircle className="h-5 w-5 text-green-600" />, color: 'bg-green-100' },
    { title: "Critical Results", value: 2, icon: <AlertTriangle className="h-5 w-5 text-red-600" />, color: 'bg-red-100' }
  ];

  // Recent activities - would come from API in a real application
  const recentActivities = [
    { 
      id: 1, 
      action: 'Completed CBC for Patient #P-10235', 
      time: '10 minutes ago',
      icon: <FlaskConical className="h-4 w-4 text-blue-600" />,
      iconBg: 'bg-blue-100'
    },
    { 
      id: 2, 
      action: 'Critical result for Troponin I (Patient #P-10239)', 
      time: '25 minutes ago',
      icon: <AlertTriangle className="h-4 w-4 text-red-600" />,
      iconBg: 'bg-red-100'
    },
    { 
      id: 3, 
      action: 'Verified Lipid Profile results for Patient #P-10238', 
      time: '1 hour ago',
      icon: <CheckCircle className="h-4 w-4 text-green-600" />,
      iconBg: 'bg-green-100'
    }
  ];

  // Test requests data - would come from API in a real application
  const testRequests = [
    {
      id: 'LAB-10245',
      patient: 'John Smith (P-10237)',
      testType: 'Complete Blood Count',
      requestedBy: 'Dr. Sarah Johnson',
      time: '09:15 AM',
      priority: 'Routine',
      priorityColor: 'bg-yellow-100 text-yellow-800',
      status: 'Pending',
      statusClass: 'bg-yellow-100 text-yellow-800',
      actions: ['Process', 'Details']
    },
    {
      id: 'LAB-10246',
      patient: 'Emily Davis (P-10238)',
      testType: 'Lipid Profile',
      requestedBy: 'Dr. Michael Brown',
      time: '09:30 AM',
      priority: 'Routine',
      priorityColor: 'bg-yellow-100 text-yellow-800',
      status: 'In Progress',
      statusClass: 'bg-blue-100 text-blue-800',
      actions: ['Complete', 'Details']
    },
    {
      id: 'LAB-10247',
      patient: 'Robert Wilson (P-10239)',
      testType: 'Troponin I',
      requestedBy: 'Dr. Lisa Taylor',
      time: '09:45 AM',
      priority: 'STAT',
      priorityColor: 'bg-red-100 text-red-800',
      status: 'Critical',
      statusClass: 'bg-red-100 text-red-800',
      actions: ['Verify', 'Details']
    },
    {
      id: 'LAB-10248',
      patient: 'Maria Garcia (P-10240)',
      testType: 'Liver Function Test',
      requestedBy: 'Dr. James Wilson',
      time: '10:00 AM',
      priority: 'Routine',
      priorityColor: 'bg-yellow-100 text-yellow-800',
      status: 'Completed',
      statusClass: 'bg-green-100 text-green-800',
      actions: ['Print', 'Details']
    }
  ];

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="text-gray-500 text-sm mb-4">Laboratory &gt; Dashboard</div>
      
      {/* Page Header with Date */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Laboratory Dashboard</h1>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center mr-3`}>
                  {stat.icon}
                </div>
                <div>
                  <div className="text-gray-500 text-sm">{stat.title}</div>
                  <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Main Panel */}
      <Card className="border border-gray-200 mb-6">
        {/* Quick Actions Tabs */}
        <div className="flex border-b border-gray-200">
          <div className="px-4 py-3 bg-blue-500 text-white font-semibold">Pending Tests</div>
          <div className="px-4 py-3 text-gray-500 cursor-pointer" onClick={() => navigate('/lab/results/completed')}>
            Completed Tests
          </div>
          <div className="px-4 py-3 text-gray-500 cursor-pointer" onClick={() => navigate('/lab/results/critical')}>
            Critical Results
          </div>
          <div className="px-4 py-3 text-gray-500 cursor-pointer">Test Catalog</div>
        </div>
        
        <div className="p-4">
          {/* Test Requests Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested By</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {testRequests.map((request) => (
                  <tr key={request.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.patient}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.testType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.requestedBy}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${request.priorityColor}`}>
                        {request.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${request.statusClass}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-blue-600 hover:text-blue-900 mr-2 p-0"
                      >
                        {request.actions[0]}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-600 hover:text-gray-900 p-0"
                      >
                        {request.actions[1]}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">1</span> to <span className="font-medium">4</span> of <span className="font-medium">12</span> results
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="text-sm">Previous</Button>
              <Button variant="default" size="sm" className="text-sm bg-blue-500">1</Button>
              <Button variant="outline" size="sm" className="text-sm">2</Button>
              <Button variant="outline" size="sm" className="text-sm">3</Button>
              <Button variant="outline" size="sm" className="text-sm">Next</Button>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Recent Activity */}
      <Card className="border border-gray-200 mb-6">
        <CardContent className="p-4">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start">
                <div className={`w-8 h-8 ${activity.iconBg} rounded-full flex items-center justify-center mr-3 mt-1`}>
                  {activity.icon}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-800">{activity.action}</div>
                  <div className="text-xs text-gray-500">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Floating Action Button */}
      <Button 
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full shadow-lg"
        style={{ backgroundColor: '#3B82F6' }}
      >
        <span className="text-xl font-bold">+</span>
      </Button>
    </div>
  );
};

export default LabDashboard;
