
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, AlertTriangle, Phone } from 'lucide-react';
import { toast } from "sonner";

const CriticalResultsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Critical results data - would come from API in a real application
  const allCriticalResults = [
    {
      id: 'LAB-10247',
      patient: 'Robert Wilson (P-10239)',
      testType: 'Troponin I',
      department: 'Emergency',
      requestedBy: 'Dr. Lisa Taylor',
      completedAt: 'Apr 27, 2025, 09:45 AM',
      verifiedBy: 'Lab Tech James Wilson',
      priority: 'STAT',
      priorityColor: 'bg-red-100 text-red-800',
      criticalValue: 'Troponin I: 2.5 ng/mL (Ref: <0.04)',
      reportedTo: '',
      reportedAt: ''
    },
    {
      id: 'LAB-10252',
      patient: 'Susan Miller (P-10244)',
      testType: 'Potassium Level',
      department: 'Internal Medicine',
      requestedBy: 'Dr. Michael Brown',
      completedAt: 'Apr 27, 2025, 10:30 AM',
      verifiedBy: 'Lab Tech Susan Clark',
      priority: 'STAT',
      priorityColor: 'bg-red-100 text-red-800',
      criticalValue: 'Potassium: 6.8 mmol/L (Ref: 3.5-5.0)',
      reportedTo: 'Dr. Michael Brown',
      reportedAt: 'Apr 27, 2025, 10:35 AM'
    }
  ];

  // Filter results based on search query
  const filteredResults = allCriticalResults.filter(result => 
    searchQuery === '' || 
    result.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    result.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
    result.testType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    result.requestedBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle report critical result button
  const handleReportCriticalResult = (testId: string) => {
    toast.info(`Reporting critical result for test ${testId}`);
  };

  // Handle view details button
  const handleViewDetails = (testId: string) => {
    toast.info(`Viewing details for test ${testId}`);
  };

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="text-gray-500 text-sm mb-4">Laboratory &gt; Results &gt; Critical</div>
      
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Critical Results</h1>
      </div>
      
      {/* Alert Banner */}
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              <span className="font-bold">Critical Alert:</span> These results require immediate notification to the requesting physician or care team.
            </p>
          </div>
        </div>
      </div>
      
      {/* Search */}
      <Card className="border border-gray-200 p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-grow relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by patient name, test ID or type..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button 
            onClick={() => setSearchQuery('')}
            variant="outline"
          >
            Clear
          </Button>
        </div>
      </Card>
      
      {/* Critical Results List */}
      <Card className="border border-gray-200 mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Critical Value</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed At</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reported Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredResults.map((result) => (
                <tr key={result.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{result.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.patient}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.testType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">{result.criticalValue}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.completedAt}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {result.reportedTo ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Reported to {result.reportedTo}
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Not Reported
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {!result.reportedTo && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-900 mr-2 p-0"
                        onClick={() => handleReportCriticalResult(result.id)}
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        Report
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-600 hover:text-gray-900 p-0"
                      onClick={() => handleViewDetails(result.id)}
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
        {filteredResults.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            <p>No critical results found matching your criteria.</p>
          </div>
        )}
        
        {/* Pagination */}
        {filteredResults.length > 0 && (
          <div className="flex items-center justify-between p-4">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredResults.length}</span> of{" "}
              <span className="font-medium">{filteredResults.length}</span> results
            </div>
          </div>
        )}
      </Card>
      
      {/* Information Card */}
      <Card className="border border-gray-200 p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Critical Result Protocol</h3>
        <p className="text-gray-700 text-sm mb-4">
          As per hospital policy, all critical values must be reported to the requesting physician or care team 
          immediately by phone. Document the name of the person receiving the notification and the time reported.
        </p>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <span className="font-bold">Critical values require reporting within 30 minutes of verification.</span> 
                If unable to reach the primary care provider, follow the escalation procedure.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CriticalResultsPage;
