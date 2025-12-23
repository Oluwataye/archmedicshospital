
import { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, Eye, Check, X, CreditCard } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ApiService } from '@/services/apiService';
import LoadingSpinner from '@/components/common/LoadingSpinner';

import { useLocation } from 'react-router-dom';

export default function PrescriptionsPage() {
  const { toast } = useToast();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get('search') || '';

  const [loading, setLoading] = useState(true);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [statusFilter, setStatusFilter] = useState('All');

  // View Details Modal
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    loadPrescriptions();
  }, [statusFilter]);

  const loadPrescriptions = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (statusFilter !== 'All') {
        params.status = statusFilter.toLowerCase();
      }
      const data = await ApiService.getPrescriptions(params);
      setPrescriptions(data);
    } catch (error) {
      console.error('Error loading prescriptions:', error);
      toast({
        title: "Error",
        description: "Failed to load prescriptions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-red-500';
      case 'High':
        return 'bg-orange-500';
      case 'Normal':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return '!';
      case 'High':
        return 'H';
      case 'Normal':
        return 'N';
      default:
        return '';
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Searching prescriptions",
      description: `Query: ${searchQuery}`,
    });
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    toast({
      title: "Filter applied",
      description: `Status: ${status}`,
      variant: "default",
    });
  };

  const handleApprove = async (id: string) => {
    try {
      await ApiService.updatePrescription(id, { status: 'approved' });
      toast({
        title: "Prescription Approved",
        description: "Prescription has been approved successfully",
        variant: "default",
      });
      loadPrescriptions();
    } catch (error) {
      console.error('Error approving prescription:', error);
      toast({
        title: "Error",
        description: "Failed to approve prescription",
        variant: "destructive",
      });
    }
  };

  const handleSendToCashier = async (id: string) => {
    try {
      // Instead of 'approved', we might want a distinct status or just treat approved as ready for cashier?
      // Based on plan: Doctor -> Pending. Pharmacist -> Approved (Sent to Cashier).
      // If status is 'approved', we assume it's viewable by cashier if we change backend logic...
      // BUT my billing route looks for 'pending_payment'.
      // So I must update status to 'pending_payment'.
      await ApiService.updatePrescription(id, { status: 'pending_payment' });
      toast({
        title: "Sent to Cashier",
        description: "Prescription marked as ready for payment",
        variant: "default",
      });
      loadPrescriptions();
    } catch (error) {
      console.error('Error sending to cashier:', error);
      toast({
        title: "Error",
        description: "Failed to send to cashier",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      await ApiService.updatePrescription(id, { status: 'rejected' });
      toast({
        title: "Prescription Rejected",
        description: "Prescription has been rejected",
        variant: "destructive",
      });
      loadPrescriptions();
    } catch (error) {
      console.error('Error rejecting prescription:', error);
      toast({
        title: "Error",
        description: "Failed to reject prescription",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (prescription: any) => {
    setSelectedPrescription(prescription);
    setIsDetailsModalOpen(true);
  };

  const formatMedications = (meds: any) => {
    if (!meds) return '-';
    try {
      const parsed = typeof meds === 'string' ? JSON.parse(meds) : meds;
      if (Array.isArray(parsed)) {
        return parsed.map((m: any) => `${m.name} (${m.dosage})`).join(', ');
      }
      return String(parsed);
    } catch (e) {
      return String(meds);
    }
  };

  const filteredPrescriptions = prescriptions.filter(prescription => {
    // Search query filtering
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const patientName = `${prescription.patient_first_name} ${prescription.patient_last_name}`.toLowerCase();
      return (
        patientName.includes(query) ||
        prescription.id.toLowerCase().includes(query)
      );
    }
    return true;
  });

  if (loading && prescriptions.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Prescriptions</h1>
        <p className="text-gray-600">Review, verify and manage prescription orders</p>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Filter Prescriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white"
                    placeholder="Search by patient name, ID or medication..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
            </div>

            <div className="flex items-center">
              <span className="mr-2 text-gray-700">Status:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center">
                    {statusFilter} <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleStatusFilterChange('All')}>
                    All
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleStatusFilterChange('Pending')}>
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusFilterChange('Approved')}>
                    Approved
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusFilterChange('Rejected')}>
                    Rejected
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" className="ml-2 flex items-center">
                <Filter className="mr-2 h-4 w-4" /> More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rx ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Medications</TableHead>
                  <TableHead>Prescriber</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrescriptions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      No prescriptions found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPrescriptions.map((prescription) => (
                    <TableRow key={prescription.id}>
                      <TableCell className="font-medium text-xs">{prescription.id.slice(0, 8)}...</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs">
                            {prescription.patient_first_name?.[0]}{prescription.patient_last_name?.[0]}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {prescription.patient_first_name} {prescription.patient_last_name}
                            </div>
                            <div className="text-xs text-gray-500">MRN: {prescription.patient_mrn}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {formatMedications(prescription.medications)}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-900">
                        Dr. {prescription.prescriber_first_name} {prescription.prescriber_last_name}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-900">
                          {new Date(prescription.prescription_date).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(prescription.prescription_date).toLocaleTimeString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(prescription.status)}>
                          {prescription.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {(prescription.status === 'active' || prescription.status === 'pending') && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              onClick={() => handleSendToCashier(prescription.id)}
                              title="Send to Cashier"
                            >
                              <CreditCard className="h-4 w-4" />
                            </Button>
                          )}
                          {prescription.status === 'active' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => handleApprove(prescription.id)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => handleReject(prescription.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(prescription)}
                          >
                            <Eye className="h-4 w-4 mr-1" /> Details
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Prescription Details</DialogTitle>
            <DialogDescription>
              View detailed information about this prescription including patient, medications, and prescriber.
            </DialogDescription>
          </DialogHeader>

          {selectedPrescription && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Patient</h4>
                  <p className="font-medium text-lg">
                    {selectedPrescription.patient_first_name} {selectedPrescription.patient_last_name}
                  </p>
                  <p className="text-sm text-muted-foreground">MRN: {selectedPrescription.patient_mrn}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Prescriber</h4>
                  <p className="font-medium">
                    Dr. {selectedPrescription.prescriber_first_name} {selectedPrescription.prescriber_last_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedPrescription.prescription_date).toLocaleString()}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Medications</h4>
                <div className="border rounded-md divide-y">
                  {(() => {
                    try {
                      const meds = typeof selectedPrescription.medications === 'string'
                        ? JSON.parse(selectedPrescription.medications)
                        : selectedPrescription.medications;

                      return Array.isArray(meds) ? meds.map((med: any, i: number) => (
                        <div key={i} className="p-3 flex justify-between items-center">
                          <div>
                            <p className="font-medium">{med.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {med.dosage} • {med.frequency} • {med.duration}
                            </p>
                          </div>
                          <Badge variant="outline">{med.quantity} units</Badge>
                        </div>
                      )) : <p className="p-3">No medications listed</p>;
                    } catch (e) {
                      return <p className="p-3 text-red-500">Error parsing medications</p>;
                    }
                  })()}
                </div>
              </div>

              {selectedPrescription.notes && (
                <div>
                  <h4 className="font-medium mb-2">Notes</h4>
                  <div className="p-3 bg-yellow-50 text-yellow-900 rounded-md border border-yellow-200 text-sm">
                    {selectedPrescription.notes}
                  </div>
                </div>
              )}

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setIsDetailsModalOpen(false)}>
                  Close
                </Button>
                {selectedPrescription.status === 'active' && (
                  <>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        handleReject(selectedPrescription.id);
                        setIsDetailsModalOpen(false);
                      }}
                    >
                      Reject
                    </Button>
                    <Button
                      onClick={() => {
                        handleApprove(selectedPrescription.id);
                        setIsDetailsModalOpen(false);
                      }}
                    >
                      Approve
                    </Button>
                  </>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
