import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Activity, Search, Save, AlertTriangle, Users, ArrowRight, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { ApiService } from '@/services/apiService';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { getBPStatus, getHRStatus, getTempStatus, getO2Status } from '@/utils/vitalSignsUtils';
import { cn } from '@/lib/utils';
import SendToDoctorModal from '@/components/nurse/SendToDoctorModal';

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  mrn: string;
}

interface VitalsData {
  patient_id: string;
  systolic_bp: string;
  diastolic_bp: string;
  heart_rate: string;
  temperature: string;
  respiratory_rate: string;
  oxygen_saturation: string;
  weight: string;
  height: string;
  notes: string;
}

export default function NurseVitalsPage() {
  const location = useLocation();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('single');

  // Single Entry State
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [singleVitals, setSingleVitals] = useState<VitalsData>({
    patient_id: '',
    systolic_bp: '',
    diastolic_bp: '',
    heart_rate: '',
    temperature: '',
    respiratory_rate: '',
    oxygen_saturation: '',
    weight: '',
    height: '',
    notes: ''
  });

  // Send to Doctor State
  const [isSendToDoctorModalOpen, setIsSendToDoctorModalOpen] = useState(false);
  const [patientForDoctor, setPatientForDoctor] = useState<Patient | null>(null);

  // Bulk Entry State
  const [selectedWard, setSelectedWard] = useState<string>('all');
  const [bulkVitals, setBulkVitals] = useState<Record<string, VitalsData>>({});

  useEffect(() => {
    loadPatients();

    // Check if patient was passed from navigation
    const navState = location.state as { selectedPatient?: Patient };
    if (navState?.selectedPatient) {
      setSelectedPatient(navState.selectedPatient);
      setActiveTab('single');
    }
  }, [location]);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getPatients();
      const patientsData = response.data || [];
      setPatients(patientsData);

      // Initialize bulk vitals state
      const initialBulk: Record<string, VitalsData> = {};
      patientsData.forEach((p: Patient) => {
        initialBulk[p.id] = {
          patient_id: p.id,
          systolic_bp: '',
          diastolic_bp: '',
          heart_rate: '',
          temperature: '',
          respiratory_rate: '',
          oxygen_saturation: '',
          weight: '',
          height: '',
          notes: ''
        };
      });
      setBulkVitals(initialBulk);
    } catch (error) {
      console.error('Error loading patients:', error);
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    try {
      await ApiService.createVitalSigns({
        ...singleVitals,
        patient_id: selectedPatient.id,
        recorded_at: new Date().toISOString()
      });

      const patientName = `${selectedPatient.first_name} ${selectedPatient.last_name}`;
      toast.success(`Vitals recorded for ${patientName}`, {
        action: {
          label: 'Send to Doctor',
          onClick: () => handleSendToDoctor(selectedPatient)
        },
        duration: 5000
      });

      setSingleVitals({
        patient_id: '',
        systolic_bp: '',
        diastolic_bp: '',
        heart_rate: '',
        temperature: '',
        respiratory_rate: '',
        oxygen_saturation: '',
        weight: '',
        height: '',
        notes: ''
      });
      // Don't clear selected patient immediately - let them send to doctor if needed
    } catch (error) {
      console.error('Error recording vitals:', error);
      toast.error('Failed to record vitals');
    }
  };

  const handleSendToDoctor = (patient: Patient) => {
    setPatientForDoctor(patient);
    setIsSendToDoctorModalOpen(true);
  };

  const handleAppointmentCreated = () => {
    setIsSendToDoctorModalOpen(false);
    setPatientForDoctor(null);
    setSelectedPatient(null);
    toast.success('Patient sent to doctor successfully');
  };

  const handleBulkChange = (patientId: string, field: keyof VitalsData, value: string) => {
    setBulkVitals(prev => ({
      ...prev,
      [patientId]: {
        ...prev[patientId],
        [field]: value
      }
    }));
  };

  const handleBulkSubmit = async () => {
    const filledVitals = Object.values(bulkVitals).filter(v =>
      v.systolic_bp || v.heart_rate || v.temperature || v.oxygen_saturation
    );

    if (filledVitals.length === 0) {
      toast.warning('No vitals entered');
      return;
    }

    try {
      // In a real app, we would have a bulk create endpoint
      // For now, we'll loop through and create them individually
      // This is not ideal for performance but works for now
      await Promise.all(filledVitals.map(v =>
        ApiService.createVitalSigns({
          ...v,
          recorded_at: new Date().toISOString()
        })
      ));

      toast.success(`Recorded vitals for ${filledVitals.length} patients`);

      // Reset forms
      const resetBulk: Record<string, VitalsData> = {};
      patients.forEach(p => {
        resetBulk[p.id] = {
          patient_id: p.id,
          systolic_bp: '',
          diastolic_bp: '',
          heart_rate: '',
          temperature: '',
          respiratory_rate: '',
          oxygen_saturation: '',
          weight: '',
          height: '',
          notes: ''
        };
      });
      setBulkVitals(resetBulk);
    } catch (error) {
      console.error('Error recording bulk vitals:', error);
      toast.error('Failed to record some vitals');
    }
  };

  const isAbnormal = (type: string, value: string, diastolicValue?: string) => {
    if (!value) return false;

    switch (type) {
      case 'temp':
        const tempStatus = getTempStatus(value);
        return tempStatus === 'danger' || tempStatus === 'borderline';
      case 'hr':
        const hrStatus = getHRStatus(value);
        return hrStatus === 'danger' || hrStatus === 'borderline';
      case 'bp':
        if (!diastolicValue) return false;
        const bpStatus = getBPStatus(`${value}/${diastolicValue}`);
        return bpStatus === 'danger' || bpStatus === 'borderline';
      case 'spo2':
        const o2Status = getO2Status(value);
        return o2Status === 'danger' || o2Status === 'borderline';
      default: return false;
    }
  };

  const filteredPatients = patients.filter(p =>
    p.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.mrn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vital Signs</h1>
          <p className="text-muted-foreground mt-1">Record and monitor patient vital signs</p>
        </div>
      </div>

      <Tabs defaultValue="single" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="single">Single Entry</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Entry</TabsTrigger>
        </TabsList>

        <TabsContent value="single" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Select Patient</CardTitle>
                <div className="relative mt-2">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search patients..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0 max-h-[600px] overflow-y-auto">
                <div className="divide-y">
                  {filteredPatients.map(patient => (
                    <div
                      key={patient.id}
                      className={`p-4 cursor-pointer hover:bg-accent transition-colors ${selectedPatient?.id === patient.id ? 'bg-accent' : ''}`}
                      onClick={() => setSelectedPatient(patient)}
                    >
                      <div className="font-medium">{patient.first_name} {patient.last_name}</div>
                      <div className="text-sm text-muted-foreground">MRN: {patient.mrn}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>
                  {selectedPatient ?
                    `Recording Vitals for ${selectedPatient.first_name} ${selectedPatient.last_name}` :
                    'Record Vitals'
                  }
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedPatient ? (
                  <form onSubmit={handleSingleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Blood Pressure (mmHg)</label>
                        <div className="flex gap-2 items-center">
                          <Input
                            placeholder="Systolic"
                            value={singleVitals.systolic_bp}
                            onChange={(e) => setSingleVitals(prev => ({ ...prev, systolic_bp: e.target.value }))}
                            className={isAbnormal('bp', singleVitals.systolic_bp, singleVitals.diastolic_bp) ? 'border-red-500' : ''}
                          />
                          <span className="text-xl">/</span>
                          <Input
                            placeholder="Diastolic"
                            value={singleVitals.diastolic_bp}
                            onChange={(e) => setSingleVitals(prev => ({ ...prev, diastolic_bp: e.target.value }))}
                            className={isAbnormal('bp', singleVitals.systolic_bp, singleVitals.diastolic_bp) ? 'border-red-500' : ''}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Heart Rate (bpm)</label>
                        <Input
                          type="number"
                          value={singleVitals.heart_rate}
                          onChange={(e) => setSingleVitals(prev => ({ ...prev, heart_rate: e.target.value }))}
                          className={isAbnormal('hr', singleVitals.heart_rate) ? 'border-red-500' : ''}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Temperature (°C)</label>
                        <Input
                          type="number"
                          step="0.1"
                          value={singleVitals.temperature}
                          onChange={(e) => setSingleVitals(prev => ({ ...prev, temperature: e.target.value }))}
                          className={isAbnormal('temp', singleVitals.temperature) ? 'border-red-500' : ''}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">SpO2 (%)</label>
                        <Input
                          type="number"
                          value={singleVitals.oxygen_saturation}
                          onChange={(e) => setSingleVitals(prev => ({ ...prev, oxygen_saturation: e.target.value }))}
                          className={isAbnormal('spo2', singleVitals.oxygen_saturation) ? 'border-red-500' : ''}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Respiratory Rate (bpm)</label>
                        <Input
                          type="number"
                          value={singleVitals.respiratory_rate}
                          onChange={(e) => setSingleVitals(prev => ({ ...prev, respiratory_rate: e.target.value }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Weight (kg)</label>
                        <Input
                          type="number"
                          step="0.1"
                          value={singleVitals.weight}
                          onChange={(e) => setSingleVitals(prev => ({ ...prev, weight: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Notes</label>
                      <Input
                        value={singleVitals.notes}
                        onChange={(e) => setSingleVitals(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Any additional observations..."
                      />
                    </div>

                    <div className="flex justify-between items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setSelectedPatient(null)}
                      >
                        Cancel
                      </Button>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => handleSendToDoctor(selectedPatient)}
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Send to Doctor
                        </Button>
                        <Button type="submit">Save Vitals</Button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
                    <Activity className="h-16 w-16 mb-4 opacity-20" />
                    <p>Select a patient to record vitals</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="bulk" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Bulk Entry</CardTitle>
              <Button onClick={handleBulkSubmit}>
                <Save className="h-4 w-4 mr-2" />
                Save All
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Patient</TableHead>
                    <TableHead>Temp (°C)</TableHead>
                    <TableHead>HR (bpm)</TableHead>
                    <TableHead>BP (mmHg)</TableHead>
                    <TableHead>SpO2 (%)</TableHead>
                    <TableHead>Resp (bpm)</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map(patient => (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">
                        {patient.first_name} {patient.last_name}
                        <div className="text-xs text-muted-foreground">{patient.mrn}</div>
                      </TableCell>
                      <TableCell>
                        <Input
                          className={`w-20 ${isAbnormal('temp', bulkVitals[patient.id]?.temperature) ? 'border-red-500 bg-red-50' : ''}`}
                          value={bulkVitals[patient.id]?.temperature || ''}
                          onChange={(e) => handleBulkChange(patient.id, 'temperature', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          className={`w-20 ${isAbnormal('hr', bulkVitals[patient.id]?.heart_rate) ? 'border-red-500 bg-red-50' : ''}`}
                          value={bulkVitals[patient.id]?.heart_rate || ''}
                          onChange={(e) => handleBulkChange(patient.id, 'heart_rate', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 w-32">
                          <Input
                            placeholder="Sys"
                            className={isAbnormal('bp', bulkVitals[patient.id]?.systolic_bp, bulkVitals[patient.id]?.diastolic_bp) ? 'border-red-500 bg-red-50' : ''}
                            value={bulkVitals[patient.id]?.systolic_bp || ''}
                            onChange={(e) => handleBulkChange(patient.id, 'systolic_bp', e.target.value)}
                          />
                          <Input
                            placeholder="Dia"
                            className={isAbnormal('bp', bulkVitals[patient.id]?.systolic_bp, bulkVitals[patient.id]?.diastolic_bp) ? 'border-red-500 bg-red-50' : ''}
                            value={bulkVitals[patient.id]?.diastolic_bp || ''}
                            onChange={(e) => handleBulkChange(patient.id, 'diastolic_bp', e.target.value)}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
                          className={`w-20 ${isAbnormal('spo2', bulkVitals[patient.id]?.oxygen_saturation) ? 'border-red-500 bg-red-50' : ''}`}
                          value={bulkVitals[patient.id]?.oxygen_saturation || ''}
                          onChange={(e) => handleBulkChange(patient.id, 'oxygen_saturation', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          className="w-20"
                          value={bulkVitals[patient.id]?.respiratory_rate || ''}
                          onChange={(e) => handleBulkChange(patient.id, 'respiratory_rate', e.target.value)}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          className="w-full"
                          value={bulkVitals[patient.id]?.notes || ''}
                          onChange={(e) => handleBulkChange(patient.id, 'notes', e.target.value)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Send to Doctor Modal */}
      {patientForDoctor && (
        <SendToDoctorModal
          patient={patientForDoctor}
          isOpen={isSendToDoctorModalOpen}
          onClose={() => {
            setIsSendToDoctorModalOpen(false);
            setPatientForDoctor(null);
          }}
          onSuccess={handleAppointmentCreated}
        />
      )}
    </div>
  );
}
