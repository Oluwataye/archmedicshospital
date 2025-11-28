import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  AlertTriangle, 
  Search 
} from 'lucide-react';
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LabRequestsPage = () => {
  // State for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Test requests data - would come from API in a real application
  const allTestRequests = [
    {
      id: 'LAB-10245',
      patient: 'John Smith (P-10237)',
      testType: 'Complete Blood Count',
      department: 'Internal Medicine',
      requestedBy: 'Dr. Sarah Johnson',
      time: '09:15 AM',
      date: 'Apr 27, 2025',
      priority: 'Routine',
      priorityColor: 'bg-yellow-100 text-yellow-800',
      status: 'Pending',
      statusClass: 'bg-yellow-100 text-yellow-800',
      notes: 'Patient has reported fatigue and weakness',
      specimenType: 'Blood',
      specimenCollected: true,
      collectedAt: 'Apr 27, 2025, 08:45 AM',
      collectedBy: 'Nurse Emma Davis'
    },
    {
      id: 'LAB-10246',
      patient: 'Emily Davis (P-10238)',
      testType: 'Lipid Profile',
      department: 'Cardiology',
      requestedBy: 'Dr. Michael Brown',
      time: '09:30 AM',
      date: 'Apr 27, 2025',
      priority: 'Routine',
      priorityColor: 'bg-yellow-100 text-yellow-800',
      status: 'In Progress',
      statusClass: 'bg-blue-100 text-blue-800',
      notes: 'Annual checkup',
      specimenType: 'Blood',
      specimenCollected: true,
      collectedAt: 'Apr 27, 2025, 09:00 AM',
      collectedBy: 'Nurse Robert Johnson'
    },
    {
      id: 'LAB-10247',
      patient: 'Robert Wilson (P-10239)',
      testType: 'Troponin I',
      department: 'Emergency',
      requestedBy: 'Dr. Lisa Taylor',
      time: '09:45 AM',
      date: 'Apr 27, 2025',
      priority: 'STAT',
      priorityColor: 'bg-red-100 text-red-800',
      status: 'Critical',
      statusClass: 'bg-red-100 text-red-800',
      notes: 'Patient with severe chest pain',
      specimenType: 'Blood',
      specimenCollected: true,
      collectedAt: 'Apr 27, 2025, 09:30 AM',
      collectedBy: 'Nurse William Chen'
    },
    {
      id: 'LAB-10248',
      patient: 'Maria Garcia (P-10240)',
      testType: 'Liver Function Test',
      department: 'Gastroenterology',
      requestedBy: 'Dr. James Wilson',
      time: '10:00 AM',
      date: 'Apr 27, 2025',
      priority: 'Routine',
      priorityColor: 'bg-yellow-100 text-yellow-800',
      status: 'Completed',
      statusClass: 'bg-green-100 text-green-800',
      notes: 'Follow-up for medication adjustment',
      specimenType: 'Blood',
      specimenCollected: true,
      collectedAt: 'Apr 27, 2025, 09:45 AM',
      collectedBy: 'Nurse Emma Davis'
    },
    {
      id: 'LAB-10249',
      patient: 'David Lee (P-10241)',
      testType: 'Urinalysis',
      department: 'Nephrology',
      requestedBy: 'Dr. Anna Martinez',
      time: '10:15 AM',
      date: 'Apr 27, 2025',
      priority: 'Routine',
      priorityColor: 'bg-yellow-100 text-yellow-800',
      status: 'Pending',
      statusClass: 'bg-yellow-100 text-yellow-800',
      notes: 'Suspected UTI',
      specimenType: 'Urine',
      specimenCollected: false,
      collectedAt: '',
      collectedBy: ''
    },
    {
      id: 'LAB-10250',
      patient: 'Jennifer Adams (P-10242)',
      testType: 'Thyroid Panel',
      department: 'Endocrinology',
      requestedBy: 'Dr. Robert Kim',
      time: '10:30 AM',
      date: 'Apr 27, 2025',
      priority: 'Urgent',
      priorityColor: 'bg-orange-100 text-orange-800',
      status: 'Pending',
      statusClass: 'bg-yellow-100 text-yellow-800',
      notes: 'Patient with symptoms of hypothyroidism',
      specimenType: 'Blood',
      specimenCollected: true,
      collectedAt: 'Apr 27, 2025, 10:15 AM',
      collectedBy: 'Nurse Robert Johnson'
    }
  ];

  // Filter test requests based on search query and filters
  const filteredTestRequests = allTestRequests.filter(request => {
    // Search filter
    const searchMatch = searchQuery === '' || 
      request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.testType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.requestedBy.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const statusMatch = statusFilter === 'all' || 
      request.status.toLowerCase() === statusFilter.toLowerCase();
    
    // Priority filter
    const priorityMatch = priorityFilter === 'all' || 
      request.priority.toLowerCase() === priorityFilter.toLowerCase();
    
    return searchMatch && statusMatch && priorityMatch;
  });

  // Handle process test button
  const handleProcessTest = (testId: string) => {
    toast.success(`Started processing test ${testId}`);
  };

  // Handle view details button
  const handleViewDetails = (testId: string) => {
    toast.info(`Viewing details for test ${testId}`);
  };

  // Handle complete test button
  const handleCompleteTest = (testId: string) => {
    toast.success(`Test ${testId} marked as completed`);
  };

  // Handle verify test button
  const handleVerifyTest = (testId: string) => {
    toast.success(`Test ${testId} has been verified`);
  };

  // Handle adding a new test request
  const handleAddNewTest = () => {
    toast.info("Creating a new test request");
  };

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="text-gray-500 text-sm mb-4">Laboratory &gt; Test Requests</div>
      
      {/* Page Header with Date */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Test Requests</h1>
      </div>
      
      {/* Filters and Search */}
      <Card className="border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by patient name, test ID or type..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="md:w-1/6">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Filter by Status</SelectLabel>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <div className="md:w-1/6">
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Filter by Priority</SelectLabel>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="routine">Routine</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="stat">STAT</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={handleAddNewTest} 
            className="md:w-auto"
            style={{ backgroundColor: '#3B82F6' }}
          >
            New Test Request
          </Button>
        </div>
      </Card>
      
      {/* Test Requests List */}
      <Card className="border border-gray-200 mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested By</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Time</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTestRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.patient}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.testType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.requestedBy}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.date}, {request.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${request.priorityColor}`}>
                      {request.priority}
                    </span>
                    {request.priority === 'STAT' && (
                      <span className="ml-1">
                        <AlertTriangle className="h-4 w-4 text-red-500 inline" />
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${request.statusClass}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.status === 'Pending' && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-blue-600 hover:text-blue-900 mr-2 p-0"
                        onClick={() => handleProcessTest(request.id)}
                      >
                        Process
                      </Button>
                    )}
                    {request.status === 'In Progress' && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-blue-600 hover:text-blue-900 mr-2 p-0"
                        onClick={() => handleCompleteTest(request.id)}
                      >
                        Complete
                      </Button>
                    )}
                    {request.status === 'Critical' && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-blue-600 hover:text-blue-900 mr-2 p-0"
                        onClick={() => handleVerifyTest(request.id)}
                      >
                        Verify
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-600 hover:text-gray-900 p-0"
                      onClick={() => handleViewDetails(request.id)}
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty state if no results */}
        {filteredTestRequests.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            <p>No test requests found matching your criteria.</p>
          </div>
        )}
        
        {/* Pagination */}
        {filteredTestRequests.length > 0 && (
          <div className="flex items-center justify-between p-4">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredTestRequests.length}</span> of{" "}
              <span className="font-medium">{filteredTestRequests.length}</span> results
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="text-sm" disabled>Previous</Button>
              <Button variant="default" size="sm" className="text-sm bg-blue-500">1</Button>
              <Button variant="outline" size="sm" className="text-sm" disabled>Next</Button>
            </div>
          </div>
        )}
      </Card>
      
      {/* Floating Action Button */}
      <Button 
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full shadow-lg"
        style={{ backgroundColor: '#3B82F6' }}
        onClick={handleAddNewTest}
      >
        <span className="text-xl font-bold">+</span>
      </Button>
    </div>
  );
};

export default LabRequestsPage;
