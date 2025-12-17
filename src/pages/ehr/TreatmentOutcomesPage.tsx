
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Download,
  Search,
  FileText,
  BarChart2,
  Loader2
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';
import ApiService from '@/services/apiService';

const TreatmentOutcomesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [treatmentType, setTreatmentType] = useState('all');
  const [timeRange, setTimeRange] = useState('all');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await ApiService.getTreatmentOutcomes({
          treatmentType: treatmentType !== 'all' ? treatmentType : undefined,
          timeRange: timeRange !== 'all' ? timeRange : undefined,
          search: searchTerm || undefined,
        });
        setData(response.data || []);
      } catch (error) {
        console.error('Error fetching treatment outcomes:', error);
        toast.error('Failed to fetch treatment outcomes data');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [treatmentType, timeRange, searchTerm]);

  // Handle export report
  const handleExportReport = () => {
    toast.success('Treatment outcomes report exported successfully');
    // In a real application, this would generate a PDF or CSV file
  };

  // Handle view details
  const handleViewDetails = (id: string) => {
    toast.info(`Viewing details for treatment outcome ${id}`);
    // In a real application, this would open a modal or navigate to a details page
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-1">Treatment Outcomes</h1>
          <p className="text-gray-500 text-sm">View and analyze treatment outcome data</p>
        </div>
        <Button
          onClick={handleExportReport}
          className="flex items-center gap-2"
        >
          <Download size={16} />
          Export Report
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Filter Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search by treatment, condition, or patient..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Select value={treatmentType} onValueChange={setTreatmentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Treatment Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Treatment Types</SelectItem>
                  <SelectItem value="medication">Medication</SelectItem>
                  <SelectItem value="procedure">Procedure</SelectItem>
                  <SelectItem value="behavioral">Behavioral</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time Ranges</SelectItem>
                  <SelectItem value="ongoing">Ongoing Treatments</SelectItem>
                  <SelectItem value="completed">Completed Treatments</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Treatment Outcomes Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center">
            <BarChart2 size={18} className="mr-2 text-blue-500" />
            <CardTitle>Treatment Outcomes</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <span className="ml-2">Loading treatment outcomes...</span>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Treatment</TableHead>
                    <TableHead>Condition</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Outcome</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.length > 0 ? (
                    data.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.id}</TableCell>
                        <TableCell>{item.treatment}</TableCell>
                        <TableCell>{item.condition}</TableCell>
                        <TableCell>{item.patient}</TableCell>
                        <TableCell>{item.startDate}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${item.endDate === 'Ongoing'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                            }`}>
                            {item.endDate === 'Ongoing' ? 'Ongoing' : 'Completed'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${item.outcome === 'Successful'
                              ? 'bg-green-100 text-green-800'
                              : item.outcome === 'Partially Successful'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                            {item.outcome}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-blue-600"
                            onClick={() => handleViewDetails(item.id)}
                          >
                            <FileText size={14} className="mr-1" />
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                        No treatment outcomes found matching your criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {data.length > 0 && (
                <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                  <div>
                    Showing <span className="font-medium">{data.length}</span> treatment outcomes
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TreatmentOutcomesPage;
