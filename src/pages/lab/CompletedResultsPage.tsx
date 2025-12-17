import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Download, Printer } from 'lucide-react';
import { useCompletedLabResults } from '@/hooks/useLabHooks';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { format } from 'date-fns';
import { toast } from 'sonner';

const CompletedResultsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { results, loading } = useCompletedLabResults();

  const filteredResults = results.filter(result => {
    const searchMatch = searchQuery === '' ||
      String(result.id).toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${result.patient_first_name} ${result.patient_last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.test_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.patient_mrn?.toLowerCase().includes(searchQuery.toLowerCase());

    return searchMatch;
  });

  const handlePrint = (resultId: string) => {
    toast.info(`Printing result ${resultId}`);
  };

  const handleDownload = (resultId: string) => {
    toast.info(`Downloading result ${resultId}`);
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading completed results..." />;
  }

  return (
    <div className="p-6">
      <div className="text-gray-500 text-sm mb-4">Laboratory &gt; Completed Results</div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Completed Results</h1>
        <span className="text-sm text-gray-500">{filteredResults.length} completed tests</span>
      </div>

      {/* Search Bar */}
      <Card className="border border-gray-200 p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by patient name, MRN, test ID or type..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </Card>

      {/* Results Table */}
      <Card className="border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Test ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Test Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Result Value
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completed Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No completed results found
                  </td>
                </tr>
              ) : (
                filteredResults.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {result.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {result.patient_first_name} {result.patient_last_name}
                      <br />
                      <span className="text-xs text-gray-400">{result.patient_mrn}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {result.test_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={result.is_critical ? 'text-red-600 font-semibold' : ''}>
                        {result.result_value || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {result.result_date ? format(new Date(result.result_date), 'MMM dd, yyyy HH:mm') : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${result.is_critical
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                        }`}>
                        {result.is_critical ? 'Critical' : 'Normal'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePrint(String(result.id))}
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(String(result.id))}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                        >
                          View
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredResults.length > 0 && (
          <div className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">1</span> to{' '}
              <span className="font-medium">{Math.min(50, filteredResults.length)}</span> of{' '}
              <span className="font-medium">{filteredResults.length}</span> results
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="default" size="sm" className="bg-blue-500">
                1
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default CompletedResultsPage;
