import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Pill, Loader2, Calendar, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { format, parseISO, isBefore, isAfter } from 'date-fns';
import { usePrescriptions } from '@/hooks/usePrescriptions';
import { usePatientManagement } from '@/hooks/usePatientManagement';
import { Patient } from '@/types/patient';
import PatientSearchSelect from '@/components/common/PatientSearchSelect';

const MedicationsPage = () => {
  const { patients, loading: patientsLoading } = usePatientManagement();
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const { prescriptions, loading, getActivePrescriptions, getPrescriptionsByStatus } = usePrescriptions(selectedPatientId);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('active');

  // Categorize prescriptions
  const activePrescriptions = prescriptions.filter(rx => {
    const isActive = rx.status === 'active' || rx.status === 'pending';
    if (rx.end_date) {
      return isActive && isAfter(parseISO(rx.end_date), new Date());
    }
    return isActive;
  });

  const completedPrescriptions = prescriptions.filter(rx =>
    rx.status === 'completed' || (rx.end_date && isBefore(parseISO(rx.end_date), new Date()))
  );

  const cancelledPrescriptions = getPrescriptionsByStatus('cancelled');

  // Filter prescriptions based on tab
  let displayPrescriptions = prescriptions;
  if (activeTab === 'active') {
    displayPrescriptions = activePrescriptions;
  } else if (activeTab === 'completed') {
    displayPrescriptions = completedPrescriptions;
  } else if (activeTab === 'cancelled') {
    displayPrescriptions = cancelledPrescriptions;
  }

  // Apply search filter
  const filteredPrescriptions = displayPrescriptions.filter(rx =>
    rx.medication_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rx.dosage.toLowerCase().includes(searchTerm.toLowerCase())
  );



  const getStatusBadge = (prescription: any) => {
    if (prescription.status === 'cancelled') {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Cancelled
        </Badge>
      );
    }

    if (prescription.status === 'completed' || (prescription.end_date && isBefore(parseISO(prescription.end_date), new Date()))) {
      return (
        <Badge className="bg-gray-100 text-gray-800 flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" />
          Completed
        </Badge>
      );
    }

    if (prescription.status === 'pending') {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      );
    }

    return (
      <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
        <CheckCircle2 className="h-3 w-3" />
        Active
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Medication Management</h1>
          <div className="text-sm text-gray-500 flex items-center mt-1">
            <span>Health Records</span>
            <span className="mx-2">›</span>
            <span className="text-blue-500">Medications</span>
          </div>
        </div>
      </div>

      {/* Patient Selection */}
      <PatientSearchSelect
        patients={patients}
        selectedPatientId={selectedPatientId}
        onSelectPatient={setSelectedPatientId}
        loading={patientsLoading}
      />

      {/* Medications List */}
      {selectedPatientId && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Medication History</CardTitle>
          </CardHeader>

          <CardContent>
            {/* Search */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search medications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              {searchTerm && (
                <Button
                  variant="ghost"
                  onClick={() => setSearchTerm('')}
                >
                  Clear
                </Button>
              )}
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="all">All ({prescriptions.length})</TabsTrigger>
                <TabsTrigger value="active">Active ({activePrescriptions.length})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({completedPrescriptions.length})</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled ({cancelledPrescriptions.length})</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab}>
                {loading ? (
                  <div className="flex items-center justify-center p-10">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    <span className="ml-2">Loading medications...</span>
                  </div>
                ) : filteredPrescriptions.length > 0 ? (
                  <div className="space-y-4">
                    {filteredPrescriptions.map((prescription) => (
                      <div key={prescription.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Pill className="h-5 w-5 text-blue-500" />
                              <h3 className="font-semibold text-lg text-gray-900">
                                {prescription.medication_name}
                              </h3>
                              {getStatusBadge(prescription)}
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                              <div>
                                <p className="text-xs text-gray-500">Dosage</p>
                                <p className="font-medium">{prescription.dosage}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Frequency</p>
                                <p className="font-medium">{prescription.frequency}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Duration</p>
                                <p className="font-medium">{prescription.duration}</p>
                              </div>
                              {prescription.quantity && (
                                <div>
                                  <p className="text-xs text-gray-500">Quantity</p>
                                  <p className="font-medium">{prescription.quantity}</p>
                                </div>
                              )}
                            </div>

                            {prescription.instructions && (
                              <div className="mb-3">
                                <p className="text-xs text-gray-500">Instructions</p>
                                <p className="text-sm text-gray-700">{prescription.instructions}</p>
                              </div>
                            )}

                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Prescribed: {format(parseISO(prescription.prescribed_date), 'MMM dd, yyyy')}
                              </span>
                              {prescription.start_date && (
                                <span className="flex items-center gap-1">
                                  Start: {format(parseISO(prescription.start_date), 'MMM dd, yyyy')}
                                </span>
                              )}
                              {prescription.end_date && (
                                <span className="flex items-center gap-1">
                                  End: {format(parseISO(prescription.end_date), 'MMM dd, yyyy')}
                                </span>
                              )}
                              {prescription.refills !== undefined && prescription.refills > 0 && (
                                <Badge variant="outline">
                                  {prescription.refills} refill{prescription.refills > 1 ? 's' : ''} remaining
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-10 border rounded-md">
                    <Pill className="h-10 w-10 mx-auto mb-3 text-gray-400" />
                    <h3 className="font-medium text-lg mb-2">No medications found</h3>
                    <p className="text-gray-500">
                      {searchTerm
                        ? 'No medications match your search criteria.'
                        : `No ${activeTab} medications for this patient.`}
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

export default MedicationsPage;
