import React, { useState, useEffect } from 'react';
import { Search, Check, Clock, History, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ApiService } from '@/services/apiService';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import DispenseModal from '@/components/pharmacy/DispenseModal';
import { useNavigate, useLocation } from 'react-router-dom';

export default function DispensaryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get('search') || '';

  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);

  // Dispense Modal
  const [isDispenseModalOpen, setIsDispenseModalOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null);

  useEffect(() => {
    loadPrescriptions();
  }, [activeTab]);

  useEffect(() => {
    if (initialSearch) {
      setSearchQuery(initialSearch);
    }
  }, [initialSearch]);

  const loadPrescriptions = async () => {
    try {
      setLoading(true);
      let data;
      if (activeTab === 'pending') {
        data = await ApiService.getActivePrescriptions();
      } else {
        // For dispensed, we filter by status 'dispensed'
        // Ideally we'd have a specific endpoint, but we can reuse getPrescriptions with status filter
        data = await ApiService.getPrescriptions({ status: 'dispensed' });
      }
      setPrescriptions(data);
    } catch (error) {
      console.error('Error loading prescriptions:', error);
      toast.error('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Client-side search for now
  };

  const openDispenseModal = (prescription: any) => {
    setSelectedPrescription(prescription);
    setIsDispenseModalOpen(true);
  };

  const filteredPrescriptions = prescriptions.filter(p => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      p.patient_first_name?.toLowerCase().includes(query) ||
      p.patient_last_name?.toLowerCase().includes(query) ||
      p.patient_mrn?.toLowerCase().includes(query) ||
      p.id.toLowerCase().includes(query)
    );
  });

  const formatMedications = (meds: any) => {
    if (!meds) return '-';
    try {
      const parsed = typeof meds === 'string' ? JSON.parse(meds) : meds;
      if (Array.isArray(parsed)) {
        return parsed.map((m: any) => m.name || m).join(', ');
      }
      return String(parsed);
    } catch (error) {
      console.error('Error parsing medications:', error);
      return String(meds); // Return raw value if JSON parsing fails
    }
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dispensary</h1>
          <p className="text-muted-foreground mt-1">Prepare and dispense medications to patients</p>
        </div>
        <Button variant="outline" onClick={loadPrescriptions}>
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Search Prescriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                className="pl-10"
                placeholder="Search by prescription ID, patient name or MRN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6 w-[400px]">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="dispensed">Dispensed History</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Medications</TableHead>
                      <TableHead>Prescriber</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          <LoadingSpinner />
                        </TableCell>
                      </TableRow>
                    ) : filteredPrescriptions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                          No pending prescriptions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPrescriptions.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="whitespace-nowrap">
                            {new Date(item.prescription_date).toLocaleDateString()}
                            <br />
                            <span className="text-xs text-muted-foreground">
                              {new Date(item.prescription_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{item.patient_first_name} {item.patient_last_name}</div>
                              <div className="text-xs text-muted-foreground">{item.patient_mrn}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[300px] truncate" title={formatMedications(item.medications)}>
                              {formatMedications(item.medications)}
                            </div>
                          </TableCell>
                          <TableCell>Dr. {item.prescriber_last_name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-orange-600 bg-orange-50 border-orange-200">
                              Pending
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              onClick={() => openDispenseModal(item)}
                            >
                              <Check className="mr-2 h-4 w-4" /> Dispense
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dispensed">
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dispensed Date</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Medications</TableHead>
                      <TableHead>Prescriber</TableHead>
                      <TableHead>Dispensed By</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          <LoadingSpinner />
                        </TableCell>
                      </TableRow>
                    ) : filteredPrescriptions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                          No dispensed prescriptions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPrescriptions.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="whitespace-nowrap">
                            {item.dispensed_at ? new Date(item.dispensed_at).toLocaleDateString() : '-'}
                            <br />
                            <span className="text-xs text-muted-foreground">
                              {item.dispensed_at ? new Date(item.dispensed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{item.patient_first_name} {item.patient_last_name}</div>
                              <div className="text-xs text-muted-foreground">{item.patient_mrn}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[300px] truncate" title={formatMedications(item.medications)}>
                              {formatMedications(item.medications)}
                            </div>
                          </TableCell>
                          <TableCell>Dr. {item.prescriber_last_name}</TableCell>
                          <TableCell>
                            {/* Ideally fetch user name, but for now just ID or placeholder */}
                            <span className="text-sm">Pharmacist</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <DispenseModal
        isOpen={isDispenseModalOpen}
        onClose={() => setIsDispenseModalOpen(false)}
        prescription={selectedPrescription}
        onDispenseComplete={loadPrescriptions}
      />
    </div>
  );
}
