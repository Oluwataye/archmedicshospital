import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Stethoscope, ArrowRightLeft, BedDouble, FileText, User, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { usePatientManagement } from '@/hooks/usePatientManagement';
import { format, parseISO } from 'date-fns';

const PatientsPage = () => {
  const navigate = useNavigate();
  const { patients, loading } = usePatientManagement();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [actionType, setActionType] = useState<'transfer' | 'admit' | null>(null);
  const [transferDepartment, setTransferDepartment] = useState('');
  const [admitWard, setAdmitWard] = useState('');
  const [admitReason, setAdmitReason] = useState('');
  const [consultNotes, setConsultNotes] = useState('');

  const filteredPatients = patients.filter(patient => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      patient.first_name?.toLowerCase().includes(searchLower) ||
      patient.last_name?.toLowerCase().includes(searchLower) ||
      patient.mrn?.toLowerCase().includes(searchLower) ||
      patient.email?.toLowerCase().includes(searchLower)
    );
  });

  const handleConsult = (patient: any) => {
    console.log('🔍 ===== CONSULT BUTTON CLICKED =====');
    console.log('📋 Full patient object:', patient);
    console.log('🆔 Patient ID:', patient.id);
    console.log('📝 Patient properties:', Object.keys(patient));

    // Check for ID in different possible property names
    const patientId = patient.id || patient.patient_id || patient.patientId;
    console.log('🎯 Resolved Patient ID:', patientId);

    if (!patientId) {
      console.error('❌ ERROR: Patient ID is missing!');
      console.error('Available properties:', Object.keys(patient));
      toast.error('Cannot open patient record: ID is missing');
      return;
    }

    const targetUrl = `/doctor/patient-emr/${patientId}`;
    console.log('🚀 Navigating to:', targetUrl);

    try {
      navigate(targetUrl);
      console.log('✅ Navigation command executed');
    } catch (error) {
      console.error('❌ Navigation failed:', error);
      toast.error('Failed to open patient record');
    }
  };

  const handleTransfer = (patient: any) => {
    setSelectedPatient(patient);
    setActionType('transfer');
    setTransferDepartment('');
  };

  const handleAdmit = (patient: any) => {
    setSelectedPatient(patient);
    setActionType('admit');
    setAdmitWard('');
    setAdmitReason('');
  };

  const handleSubmitConsult = () => {
    if (!consultNotes.trim()) {
      toast.error('Please enter consultation notes');
      return;
    }
    toast.success(`Consultation notes saved for ${selectedPatient.first_name} ${selectedPatient.last_name}`);
    navigate(`/doctor/medical-records?patientId=${selectedPatient.id}`);
    closeDialog();
  };

  const handleSubmitTransfer = () => {
    if (!transferDepartment) {
      toast.error('Please select a department');
      return;
    }
    toast.success(`Transfer request submitted for ${selectedPatient.first_name} ${selectedPatient.last_name} to ${transferDepartment}`);
    closeDialog();
  };

  const handleSubmitAdmit = () => {
    if (!admitWard || !admitReason.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    toast.success(`Admission request submitted for ${selectedPatient.first_name} ${selectedPatient.last_name} to ${admitWard}`);
    closeDialog();
  };

  const closeDialog = () => {
    setSelectedPatient(null);
    setActionType(null);
    setTransferDepartment('');
    setAdmitWard('');
    setAdmitReason('');
    setConsultNotes('');
  };

  const getPatientAge = (dob: string) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Patients</h1>
          <p className="text-muted-foreground mt-1">Patients under your care</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Patient Records</CardTitle>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, MRN, or email..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>MRN</TableHead>
                  <TableHead>Age/Gender</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Loading patients...
                    </TableCell>
                  </TableRow>
                ) : filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <TableRow key={patient.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div>
                            <div className="font-medium">{patient.first_name} {patient.last_name}</div>
                            <div className="text-xs text-muted-foreground">{patient.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">{patient.mrn}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {getPatientAge(patient.date_of_birth)} yrs
                        </div>
                        <div className="text-xs text-muted-foreground">{patient.gender}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{patient.phone}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {(() => {
                            try {
                              if (patient.lastVisit && patient.lastVisit !== 'null') {
                                const date = new Date(patient.lastVisit);
                                if (!isNaN(date.getTime())) {
                                  return format(date, 'MMM d, yyyy');
                                }
                              }
                              return 'No visits';
                            } catch {
                              return 'No visits';
                            }
                          })()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleConsult(patient)}
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          >
                            <Stethoscope className="h-3 w-3 mr-1" />
                            Consult
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTransfer(patient)}
                            className="text-orange-600 border-orange-200 hover:bg-orange-50"
                          >
                            <ArrowRightLeft className="h-3 w-3 mr-1" />
                            Transfer
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAdmit(patient)}
                            className="text-green-600 border-green-200 hover:bg-green-50"
                          >
                            <BedDouble className="h-3 w-3 mr-1" />
                            Admit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/doctor/medical-records?patientId=${patient.id}`)}
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            Records
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center justify-center">
                        <Search className="h-12 w-12 text-muted-foreground mb-3" />
                        <p className="font-medium">No patients found</p>
                        <p className="text-sm text-muted-foreground">Try adjusting your search</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>


      {/* Transfer Dialog */}
      <Dialog open={actionType === 'transfer'} onOpenChange={() => closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer Patient</DialogTitle>
            <DialogDescription>
              Transfer {selectedPatient?.first_name} {selectedPatient?.last_name} to another department
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Department</Label>
              <Select value={transferDepartment} onValueChange={setTransferDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cardiology">Cardiology</SelectItem>
                  <SelectItem value="neurology">Neurology</SelectItem>
                  <SelectItem value="orthopedics">Orthopedics</SelectItem>
                  <SelectItem value="pediatrics">Pediatrics</SelectItem>
                  <SelectItem value="surgery">Surgery</SelectItem>
                  <SelectItem value="icu">ICU</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button onClick={handleSubmitTransfer} className="bg-orange-600 hover:bg-orange-700">
              Submit Transfer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Admit Dialog */}
      <Dialog open={actionType === 'admit'} onOpenChange={() => closeDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Admit Patient</DialogTitle>
            <DialogDescription>
              Admit {selectedPatient?.first_name} {selectedPatient?.last_name} to a ward
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Ward</Label>
              <Select value={admitWard} onValueChange={setAdmitWard}>
                <SelectTrigger>
                  <SelectValue placeholder="Select ward" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general-ward">General Ward</SelectItem>
                  <SelectItem value="private-ward">Private Ward</SelectItem>
                  <SelectItem value="icu">ICU</SelectItem>
                  <SelectItem value="maternity">Maternity</SelectItem>
                  <SelectItem value="pediatric">Pediatric Ward</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Reason for Admission</Label>
              <Textarea
                placeholder="Enter reason for admission..."
                value={admitReason}
                onChange={(e) => setAdmitReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>Cancel</Button>
            <Button onClick={handleSubmitAdmit} className="bg-green-600 hover:bg-green-700">
              Submit Admission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientsPage;
