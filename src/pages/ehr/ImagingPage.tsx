import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Image as ImageIcon, Loader2, Calendar, FileImage, Eye, Download, Check, ChevronsUpDown } from 'lucide-react';
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
import { useMedicalRecords } from '@/hooks/useMedicalRecords';
import { usePatientManagement } from '@/hooks/usePatientManagement';

const ImagingPage = () => {
  const { patients } = usePatientManagement();
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [openCombobox, setOpenCombobox] = useState(false);
  const { records, loading, getRecordsByType } = useMedicalRecords(selectedPatientId);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterModality, setFilterModality] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  // Get imaging records
  const imagingRecords = getRecordsByType('imaging');

  // Parse imaging content
  const parsedRecords = imagingRecords.map(record => {
    try {
      const content = JSON.parse(record.content);
      return { ...record, ...content };
    } catch {
      return record;
    }
  });

  // Get unique modalities
  const modalities = ['all', ...Array.from(new Set(parsedRecords.map(r => r.modality).filter(Boolean)))];

  // Filter records
  const filteredRecords = parsedRecords.filter(record => {
    const searchMatch = searchTerm === '' ||
      record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.studyType && record.studyType.toLowerCase().includes(searchTerm.toLowerCase()));

    const modalityMatch = filterModality === 'all' || record.modality === filterModality;

    const statusMatch = activeTab === 'all' || record.status === activeTab;

    return searchMatch && modalityMatch && statusMatch;
  });

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  const getModalityIcon = (modality: string) => {
    const icons: Record<string, string> = {
      'X-Ray': '🦴',
      'CT': '🔬',
      'MRI': '🧠',
      'Ultrasound': '👶',
      'Mammography': '🎗️',
      'PET': '⚡',
    };
    return icons[modality] || '📷';
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; label: string }> = {
      completed: { color: 'bg-green-100 text-green-800', label: 'Completed' },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      in_progress: { color: 'bg-blue-100 text-blue-800', label: 'In Progress' },
      reviewed: { color: 'bg-purple-100 text-purple-800', label: 'Reviewed' },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const pendingCount = parsedRecords.filter(r => r.status === 'pending').length;
  const completedCount = parsedRecords.filter(r => r.status === 'completed' || r.status === 'reviewed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Imaging & Radiology</h1>
          <div className="text-sm text-gray-500 flex items-center mt-1">
            <span>Health Records</span>
            <span className="mx-2">›</span>
            <span className="text-blue-500">Imaging</span>
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

      {/* Imaging Studies */}
      {selectedPatientId && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Imaging Studies</CardTitle>
          </CardHeader>

          <CardContent>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search by study type or title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select value={filterModality} onValueChange={setFilterModality}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by modality" />
                </SelectTrigger>
                <SelectContent>
                  {modalities.map((modality) => (
                    <SelectItem key={modality} value={modality}>
                      {modality === 'all' ? 'All Modalities' : modality}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(searchTerm || filterModality !== 'all') && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterModality('all');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="all">All ({parsedRecords.length})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({completedCount})</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab}>
                {loading ? (
                  <div className="flex items-center justify-center p-10">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    <span className="ml-2">Loading imaging studies...</span>
                  </div>
                ) : filteredRecords.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredRecords.map((record) => (
                      <Card key={record.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{getModalityIcon(record.modality)}</span>
                              <div>
                                <h3 className="font-semibold text-sm">{record.title}</h3>
                                {record.studyType && (
                                  <p className="text-xs text-gray-500">{record.studyType}</p>
                                )}
                              </div>
                            </div>
                            {getStatusBadge(record.status)}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {record.modality && (
                            <div className="flex items-center gap-2">
                              <FileImage className="h-4 w-4 text-gray-400" />
                              <span className="text-sm font-medium">{record.modality}</span>
                            </div>
                          )}

                          {record.bodyPart && (
                            <div>
                              <p className="text-xs text-gray-500">Body Part</p>
                              <p className="text-sm font-medium">{record.bodyPart}</p>
                            </div>
                          )}

                          {record.findings && (
                            <div>
                              <p className="text-xs text-gray-500">Findings</p>
                              <p className="text-sm line-clamp-2">{record.findings}</p>
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            {format(parseISO(record.record_date), 'MMM dd, yyyy')}
                          </div>

                          <div className="flex gap-2 pt-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            {record.status === 'completed' && (
                              <Button variant="outline" size="sm" className="flex-1">
                                <Download className="h-3 w-3 mr-1" />
                                Report
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-10 border rounded-md">
                    <ImageIcon className="h-10 w-10 mx-auto mb-3 text-gray-400" />
                    <h3 className="font-medium text-lg mb-2">No imaging studies found</h3>
                    <p className="text-gray-500">
                      {searchTerm || filterModality !== 'all'
                        ? 'No studies match your search criteria.'
                        : 'No imaging studies available for this patient.'}
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

export default ImagingPage;
