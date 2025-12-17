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
import { useLabResults } from '@/hooks/useLabHooks';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { format } from 'date-fns';

const LabRequestsPage = () => {
  // State for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Fetch lab results with filters
  const filters = {
    status: statusFilter !== 'all' ? statusFilter : undefined,
  };

  const { results, loading, updateResult } = useLabResults(filters);

  // Filter test requests based on search query
  const filteredTestRequests = results.filter(request => {
    // Search filter
    const searchMatch = searchQuery === '' ||
      String(request.id).toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${request.patient_first_name} ${request.patient_last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.test_name.toLowerCase().includes(searchQuery.toLowerCase());

    return searchMatch;
  });

  // Handle process test button
  const handleProcessTest = async (testId: string) => {
    try {
      await updateResult(testId, { status: 'in_progress' });
      toast.success(`Started processing test ${testId}`);
    } catch (error) {
      // Error already handled in hook
    }
  };

  // Handle view details button
  const handleViewDetails = (testId: string) => {
    toast.info(`Viewing details for test ${testId}`);
  };

  // Handle complete test button
  const handleCompleteTest = async (testId: string) => {
    try {
      await updateResult(testId, { status: 'completed' });
      toast.success(`Test ${testId} marked as completed`);
    } catch (error) {
      // Error already handled in hook
    }
  };

  // Handle verify test button
  const handleVerifyTest = async (testId: string) => {
    try {
      await updateResult(testId, { status: 'verified' });
      toast.success(`Test ${testId} has been verified`);
    } catch (error) {
      // Error already handled in hook
    }
  };

  // Handle adding a new test request
  const handleAddNewTest = () => {
    toast.info("Creating a new test request");
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading test requests..." />;
  }

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
                  <SelectItem value="ordered">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Time</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTestRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.patient_first_name} {request.patient_last_name} ({request.patient_mrn})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.test_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(request.order_date), 'MMM dd, yyyy HH:mm')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${request.status === 'ordered' ? 'bg-yellow-100 text-yellow-800' :
                      request.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        request.status === 'completed' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                      }`}>
                      {request.status}
                    </span>
                    {request.is_critical && (
                      <span className="ml-1">
                        <AlertTriangle className="h-4 w-4 text-red-500 inline" />
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.status === 'ordered' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-900 mr-2 p-0"
                        onClick={() => handleProcessTest(String(request.id))}
                      >
                        Process
                      </Button>
                    )}
                    {request.status === 'in_progress' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-900 mr-2 p-0"
                        onClick={() => handleCompleteTest(String(request.id))}
                      >
                        Complete
                      </Button>
                    )}
                    {request.is_critical && request.status === 'completed' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-900 mr-2 p-0"
                        onClick={() => handleVerifyTest(String(request.id))}
                      >
                        Verify
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-gray-900 p-0"
                      onClick={() => handleViewDetails(String(request.id))}
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
