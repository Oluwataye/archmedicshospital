import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  Download,
  Printer,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Phone,
  Mail
} from 'lucide-react';
import {
  useLabResults,
  usePendingLabOrders,
  useCompletedLabResults,
  useCriticalLabResults
} from '@/hooks/useLabHooks';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ResultsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch data from all hooks
  const { results: allResults, loading: allLoading, updateResult } = useLabResults();
  const { orders: pendingOrders, loading: pendingLoading } = usePendingLabOrders();
  const { results: completedResults, loading: completedLoading } = useCompletedLabResults();
  const { results: criticalResults, loading: criticalLoading } = useCriticalLabResults();

  const loading = allLoading || pendingLoading || completedLoading || criticalLoading;

  // Filter function
  const filterResults = (results: any[]) => {
    return results.filter(result => {
      const searchMatch = searchQuery === '' ||
        result.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${result.patient_first_name} ${result.patient_last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.test_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.patient_mrn?.toLowerCase().includes(searchQuery.toLowerCase());

      const statusMatch = statusFilter === 'all' || result.status === statusFilter;

      return searchMatch && statusMatch;
    });
  };

  const handleProcessTest = async (testId: string) => {
    try {
      await updateResult(testId, { status: 'in_progress' });
      toast.success('Test processing started');
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleCompleteTest = async (testId: string) => {
    try {
      await updateResult(testId, { status: 'completed' });
      toast.success('Test marked as completed');
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleNotifyDoctor = (resultId: string, doctorName: string) => {
    toast.success(`Notification sent to ${doctorName}`);
  };

  const handlePrint = (resultId: string) => {
    toast.info(`Printing result ${resultId}`);
  };

  const handleDownload = (resultId: string) => {
    toast.info(`Downloading result ${resultId}`);
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading lab results..." />;
  }

  // Get filtered results based on active tab
  const getDisplayResults = () => {
    switch (activeTab) {
      case 'pending':
        return filterResults(pendingOrders);
      case 'completed':
        return filterResults(completedResults);
      case 'critical':
        return filterResults(criticalResults);
      default:
        return filterResults(allResults);
    }
  };

  const displayResults = getDisplayResults();

  return (
    <div className="p-6">
      {/* Breadcrumbs */}
      <div className="text-gray-500 text-sm mb-4">Laboratory &gt; Results Management</div>

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Lab Results Management</h1>
          <p className="text-sm text-gray-500 mt-1">View, manage, and process all laboratory test results</p>
        </div>
        <Button
          onClick={() => navigate('/lab/results/entry')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <FileText className="h-4 w-4 mr-2" />
          Enter Results
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Results</p>
                <p className="text-2xl font-bold text-gray-800">{allResults.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingOrders.length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-green-600">{completedResults.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Critical</p>
                <p className="text-2xl font-bold text-red-600">{criticalResults.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by patient name, MRN, test ID or type..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="ordered">Ordered</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Tabs */}
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <CardHeader className="pb-3">
            <TabsList className="grid grid-cols-4 w-full max-w-2xl">
              <TabsTrigger value="all">
                All Results ({allResults.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({pendingOrders.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({completedResults.length})
              </TabsTrigger>
              <TabsTrigger value="critical">
                Critical ({criticalResults.length})
              </TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent>
            {/* All Results Tab */}
            <TabsContent value="all" className="mt-0">
              <ResultsTable
                results={displayResults}
                onProcess={handleProcessTest}
                onComplete={handleCompleteTest}
                onNotify={handleNotifyDoctor}
                onPrint={handlePrint}
                onDownload={handleDownload}
                showAllActions
              />
            </TabsContent>

            {/* Pending Tab */}
            <TabsContent value="pending" className="mt-0">
              <ResultsTable
                results={displayResults}
                onProcess={handleProcessTest}
                onComplete={handleCompleteTest}
                onPrint={handlePrint}
                type="pending"
              />
            </TabsContent>

            {/* Completed Tab */}
            <TabsContent value="completed" className="mt-0">
              <ResultsTable
                results={displayResults}
                onPrint={handlePrint}
                onDownload={handleDownload}
                type="completed"
              />
            </TabsContent>

            {/* Critical Tab */}
            <TabsContent value="critical" className="mt-0">
              <ResultsTable
                results={displayResults}
                onNotify={handleNotifyDoctor}
                onPrint={handlePrint}
                onDownload={handleDownload}
                type="critical"
              />
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
};

// Reusable Results Table Component
interface ResultsTableProps {
  results: any[];
  onProcess?: (id: string) => void;
  onComplete?: (id: string) => void;
  onNotify?: (id: string, doctorName: string) => void;
  onPrint?: (id: string) => void;
  onDownload?: (id: string) => void;
  type?: 'pending' | 'completed' | 'critical' | 'all';
  showAllActions?: boolean;
}

const ResultsTable: React.FC<ResultsTableProps> = ({
  results,
  onProcess,
  onComplete,
  onNotify,
  onPrint,
  onDownload,
  type,
  showAllActions = false
}) => {
  if (results.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p>No results found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Test ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Patient
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Test Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Result
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {results.map((result) => (
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
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={result.is_critical ? 'text-red-600 font-semibold' : 'text-gray-500'}>
                  {result.result_value || 'Pending'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {result.result_date
                  ? format(new Date(result.result_date), 'MMM dd, yyyy')
                  : format(new Date(result.order_date), 'MMM dd, yyyy')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${result.status === 'ordered' ? 'bg-yellow-100 text-yellow-800' :
                  result.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    result.status === 'completed' ? 'bg-green-100 text-green-800' :
                      result.is_critical ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                  }`}>
                  {result.is_critical && result.status === 'completed' ? 'Critical' : result.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex gap-2">
                  {(type === 'pending' || showAllActions) && result.status === 'ordered' && onProcess && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onProcess(result.id)}
                    >
                      Process
                    </Button>
                  )}
                  {(type === 'pending' || showAllActions) && result.status === 'in_progress' && onComplete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onComplete(result.id)}
                    >
                      Complete
                    </Button>
                  )}
                  {type === 'critical' && onNotify && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600"
                      onClick={() => onNotify(result.id, `${result.orderer_first_name} ${result.orderer_last_name}`)}
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Notify
                    </Button>
                  )}
                  {(type === 'completed' || type === 'critical' || showAllActions) && onPrint && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onPrint(result.id)}
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                  )}
                  {(type === 'completed' || type === 'critical' || showAllActions) && onDownload && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDownload(result.id)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsPage;
