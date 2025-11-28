
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search,
  ChevronRight
} from 'lucide-react';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink,
  PaginationNext 
} from '@/components/ui/pagination';

const DoctorDashboardPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock data
  const patientQueue = [
    {
      id: 'P-2451',
      name: 'James Wilson',
      arrivalTime: '10:15 AM',
      waitTime: '4h 15m',
      status: 'waiting',
      priority: 'high'
    },
    {
      id: 'P-2452',
      name: 'Maria Garcia',
      arrivalTime: '11:20 AM',
      waitTime: '3h 10m',
      status: 'in-prep',
      priority: 'normal'
    },
    {
      id: 'P-2453',
      name: 'Robert Johnson',
      arrivalTime: '11:45 AM',
      waitTime: '2h 45m',
      status: 'urgent',
      priority: 'urgent'
    },
    {
      id: 'P-2454',
      name: 'Emily Chen',
      arrivalTime: '12:30 PM',
      waitTime: '2h 00m',
      status: 'waiting',
      priority: 'normal'
    }
  ];
  
  const activities = [
    {
      id: 1,
      action: 'Prescription updated for Sarah Miller',
      time: '2:15 PM',
      type: 'prescription',
      color: 'blue'
    },
    {
      id: 2,
      action: 'Consultation completed with John Davis',
      time: '1:45 PM',
      type: 'consultation',
      color: 'green'
    },
    {
      id: 3,
      action: 'Lab results received for Emma Thompson',
      time: '12:30 PM',
      type: 'lab',
      color: 'red'
    }
  ];
  
  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'waiting':
        return 'px-4 py-1 text-yellow-600 bg-yellow-100 rounded-full text-xs';
      case 'in-prep':
        return 'px-4 py-1 text-green-600 bg-green-100 rounded-full text-xs';
      case 'urgent':
        return 'px-4 py-1 text-red-600 bg-red-100 rounded-full text-xs';
      default:
        return 'px-4 py-1 text-gray-600 bg-gray-100 rounded-full text-xs';
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'waiting':
        return 'Waiting';
      case 'in-prep':
        return 'In Prep';
      case 'urgent':
        return 'Urgent';
      default:
        return status;
    }
  };
  
  const getButtonClass = (priority: string) => {
    return priority === 'urgent' 
      ? 'bg-red-500 text-white px-4 py-1 rounded'
      : 'bg-blue-500 text-white px-4 py-1 rounded';
  };
  
  const getRowClass = (index: number, priority: string) => {
    if (index === 0) return 'border-b border-t border-2 border-blue-500';
    if (priority === 'urgent') return 'border-b border-gray-100';
    if (index % 2 === 1) return 'bg-blue-50 border-b border-blue-100';
    return 'border-b border-gray-100';
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-3xl font-bold text-blue-500">12</h2>
          <p className="text-gray-500">Patients in Queue</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-3xl font-bold text-green-500">28</h2>
          <p className="text-gray-500">Patients Seen Today</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-3xl font-bold text-red-500">5</h2>
          <p className="text-gray-500">Urgent Cases</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-3xl font-bold text-yellow-500">8</h2>
          <p className="text-gray-500">Upcoming Appointments</p>
        </div>
      </div>

      {/* Patient Queue */}
      <Card className="mb-6">
        <div className="p-6 flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
          <h2 className="text-xl font-bold text-gray-800">Patient Queue</h2>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full md:w-64 pl-10 pr-3 py-2 rounded-full bg-gray-100 border border-gray-200"
              placeholder="Search patients..."
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Patient Name</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">ID</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Arrival Time</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Wait Time</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {patientQueue.map((patient, index) => (
                <tr key={patient.id} className={getRowClass(index, patient.priority)}>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-800">{patient.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{patient.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{patient.arrivalTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-red-500">{patient.waitTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadgeClass(patient.status)}>
                      {getStatusLabel(patient.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className={getButtonClass(patient.priority)}>
                      Start Consult
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 flex items-center justify-between">
          <span className="text-gray-500 text-sm">Showing 1-4 of 12 patients</span>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationLink 
                  isActive 
                  className="w-10 h-10 flex items-center justify-center rounded bg-blue-500 text-white"
                >
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink 
                  className="w-10 h-10 flex items-center justify-center rounded border border-gray-200 text-gray-500"
                >
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink 
                  className="w-10 h-10 flex items-center justify-center rounded border border-gray-200 text-gray-500"
                >
                  3
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext 
                  className="w-10 h-10 flex items-center justify-center rounded border border-gray-200 text-gray-500"
                >
                  <ChevronRight className="h-4 w-4" />
                </PaginationNext>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
          <div className="ml-4 relative border-l-2 border-gray-200 pl-6">
            {activities.map((activity) => (
              <div key={activity.id} className="mb-6 last:mb-0 relative">
                <div className={`absolute -left-10 top-0 w-4 h-4 rounded-full bg-${activity.color}-500`}></div>
                <p className="text-sm text-gray-800">{activity.action}</p>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorDashboardPage;
