import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, TestTube, Loader2, Calendar, AlertTriangle, CheckCircle, Clock, Check, ChevronsUpDown } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import * as Pop from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, parseISO } from 'date-fns';
import { useLabResults } from '@/hooks/useLabHooks';
import { usePatientManagement } from '@/hooks/usePatientManagement';
import { LabResult } from '@/types/lab';

const LabResultsPage = () => {
  const { patients } = usePatientManagement();
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [openCombobox, setOpenCombobox] = useState(false);

  // Fix: Pass object as filter, destructure results as labResults, and handle undefined
  const { results: rawLabResults, loading } = useLabResults(
    selectedPatientId ? { patient_id: selectedPatientId } : undefined
  );

  const labResults = rawLabResults || [];

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  // Helper function missing from hook
  const getResultsByStatus = (status: string) => {
    return labResults.filter(r => r.status === status);
  };

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(labResults.map(r => r.test_category).filter(Boolean)))];

  // Filter results
  const filteredResults = labResults.filter(result => {
    const searchMatch = searchTerm === '' ||
      result.test_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.test_code?.toLowerCase().includes(searchTerm.toLowerCase());

    const categoryMatch = filterCategory === 'all' || result.test_category === filterCategory;

    const statusMatch = activeTab === 'all' || result.status === activeTab;

    return searchMatch && categoryMatch && statusMatch;
  });

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
      completed: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-3 w-3" /> },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="h-3 w-3" /> },
      in_progress: { color: 'bg-blue-100 text-blue-800', icon: <TestTube className="h-3 w-3" /> },
      cancelled: { color: 'bg-gray-100 text-gray-800', icon: <AlertTriangle className="h-3 w-3" /> },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        {config.icon}
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getAbnormalFlag = (flag?: string) => {
    if (!flag || flag === 'normal') return null;

    return (
      <Badge variant="destructive" className="ml-2">
        <AlertTriangle className="h-3 w-3 mr-1" />
        {flag.toUpperCase()}
      </Badge>
    );
  };

  const pendingCount = getResultsByStatus('pending').length;
  const completedCount = getResultsByStatus('completed').length;
  const inProgressCount = getResultsByStatus('in_progress').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Lab Results</h1>
          <div className="text-sm text-gray-500 flex items-center mt-1">
            <span>Health Records</span>
            <span className="mx-2">›</span>
            <span className="text-blue-500">Lab Results</span>
          </div>
        </div>
      </div>

      {/* Patient Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Patient</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <Pop.Popover open={openCombobox} onOpenChange={setOpenCombobox}>
              <Pop.PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCombobox}
                  className="w-full justify-between"
                >
                  {selectedPatientId
                    ? patients.find((patient) => String(patient.id) === selectedPatientId)
                      ? `${patients.find((patient) => String(patient.id) === selectedPatientId)?.first_name} ${patients.find((patient) => String(patient.id) === selectedPatientId)?.last_name} - ${patients.find((patient) => String(patient.id) === selectedPatientId)?.mrn}`
                      : "Select patient..."
                    : "Select patient..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </Pop.PopoverTrigger>
              <Pop.PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput placeholder="Search patient by name or MRN..." />
                  <CommandEmpty>No patient found.</CommandEmpty>
                  <CommandGroup>
                    <CommandList>
                      {patients.map((patient) => (
                        <CommandItem
                          key={patient.id}
                          value={`${patient.first_name} ${patient.last_name} ${patient.mrn}`}
                          onSelect={() => {
                            setSelectedPatientId(String(patient.id) === selectedPatientId ? "" : String(patient.id));
                            setOpenCombobox(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedPatientId === String(patient.id) ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div className="flex flex-col">
                            <span>{patient.first_name} {patient.last_name}</span>
                            <span className="text-xs text-muted-foreground">MRN: {patient.mrn}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandList>
                  </CommandGroup>
                </Command>
              </Pop.PopoverContent>
            </Pop.Popover>

            {selectedPatient && (
              <div className="p-4 bg-blue-50 rounded-lg animate-in fade-in-0">
                <h3 className="font-semibold text-blue-900">
                  {selectedPatient.first_name} {selectedPatient.last_name}
                </h3>
                <p className="text-sm text-blue-700">MRN: {selectedPatient.mrn}</p>
                <p className="text-sm text-blue-700">DOB: {format(parseISO(selectedPatient.date_of_birth), 'MMM dd, yyyy')}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lab Results */}
      {selectedPatientId && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Lab Results</CardTitle>
          </CardHeader>

          <CardContent>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search by test name or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(searchTerm || filterCategory !== 'all') && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterCategory('all');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="all">All ({labResults.length})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
                <TabsTrigger value="in_progress">In Progress ({inProgressCount})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({completedCount})</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab}>
                {loading ? (
                  <div className="flex items-center justify-center p-10">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    <span className="ml-2">Loading lab results...</span>
                  </div>
                ) : filteredResults.length > 0 ? (
                  <div className="rounded-md border">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50 border-b">
                            <th className="py-3 px-4 text-left">Test Name</th>
                            <th className="py-3 px-4 text-left">Category</th>
                            <th className="py-3 px-4 text-left">Order Date</th>
                            <th className="py-3 px-4 text-left">Result Date</th>
                            <th className="py-3 px-4 text-left">Result</th>
                            <th className="py-3 px-4 text-left">Reference Range</th>
                            <th className="py-3 px-4 text-left">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredResults.map((result) => (
                            <tr key={result.id} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-4">
                                <div>
                                  <p className="font-medium">{result.test_name}</p>
                                  {result.test_code && (
                                    <p className="text-xs text-gray-500">{result.test_code}</p>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                {result.test_category && (
                                  <Badge variant="outline">{result.test_category}</Badge>
                                )}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-1 text-gray-600">
                                  <Calendar className="h-3 w-3" />
                                  {format(parseISO(result.order_date), 'MMM dd, yyyy')}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                {result.result_date ? (
                                  <div className="flex items-center gap-1 text-gray-600">
                                    <Calendar className="h-3 w-3" />
                                    {format(parseISO(result.result_date), 'MMM dd, yyyy')}
                                  </div>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </td>
                              <td className="py-3 px-4">
                                {result.result_value ? (
                                  <div className="flex items-center">
                                    <span className="font-medium">
                                      {result.result_value} {result.result_unit}
                                    </span>
                                    {getAbnormalFlag(result.abnormal_flag)}
                                  </div>
                                ) : (
                                  <span className="text-gray-400">Pending</span>
                                )}
                              </td>
                              <td className="py-3 px-4">
                                {result.reference_range ? (
                                  <span className="text-gray-600 text-xs">
                                    {result.reference_range}
                                  </span>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </td>
                              <td className="py-3 px-4">
                                {getStatusBadge(result.status)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-10 border rounded-md">
                    <TestTube className="h-10 w-10 mx-auto mb-3 text-gray-400" />
                    <h3 className="font-medium text-lg mb-2">No lab results found</h3>
                    <p className="text-gray-500">
                      {searchTerm || filterCategory !== 'all'
                        ? 'No results match your search criteria.'
                        : 'No lab results available for this patient.'}
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LabResultsPage;
