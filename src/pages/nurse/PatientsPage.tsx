import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Activity, UserPlus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ApiService } from '@/services/apiService';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import SendToDoctorModal from '@/components/nurse/SendToDoctorModal';

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  mrn: string;
  date_of_birth?: string;
  gender?: string;
  phone?: string;
  email?: string;
}

export default function PatientsPage() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isSendToDoctorModalOpen, setIsSendToDoctorModalOpen] = useState(false);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getPatients();
      // Handle both array and object with data property
      const patientsData = Array.isArray(response) ? response : (response.data || []);
      setPatients(patientsData);
    } catch (error) {
      console.error('Error loading patients:', error);
      toast.error('Failed to load patients');
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordVitals = (patient: Patient) => {
    // Navigate to vitals page with patient pre-selected
    navigate('/nurse/vitals', { state: { selectedPatient: patient } });
  };

  const handleSendToDoctor = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsSendToDoctorModalOpen(true);
  };

  const handleAppointmentCreated = () => {
    setIsSendToDoctorModalOpen(false);
    setSelectedPatient(null);
    toast.success('Patient sent to doctor successfully');
  };

  const filteredPatients = patients.filter(patient => {
    const searchLower = searchQuery.toLowerCase();
    return (
      patient.first_name?.toLowerCase().includes(searchLower) ||
      patient.last_name?.toLowerCase().includes(searchLower) ||
      patient.mrn?.toLowerCase().includes(searchLower) ||
      `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
          <p className="text-muted-foreground mt-1">View and manage all registered patients</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Patient Search</CardTitle>
          <div className="relative mt-2">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name or MRN..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>MRN</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Date of Birth</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      {searchQuery ? 'No patients found matching your search' : 'No patients registered yet'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPatients.map((patient) => (
                    <TableRow key={patient.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{patient.mrn}</TableCell>
                      <TableCell>
                        <div className="font-medium">{patient.first_name} {patient.last_name}</div>
                      </TableCell>
                      <TableCell>
                        {patient.gender ? (
                          <Badge variant="outline">{patient.gender}</Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {patient.date_of_birth || <span className="text-muted-foreground text-sm">-</span>}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {patient.phone && <div>{patient.phone}</div>}
                          {patient.email && <div className="text-muted-foreground">{patient.email}</div>}
                          {!patient.phone && !patient.email && <span className="text-muted-foreground">-</span>}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRecordVitals(patient)}
                          >
                            <Activity className="h-4 w-4 mr-1" />
                            Record Vitals
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleSendToDoctor(patient)}
                          >
                            <UserPlus className="h-4 w-4 mr-1" />
                            Send to Doctor
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {filteredPatients.length > 0 && (
            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredPatients.length} of {patients.length} patients
            </div>
          )}
        </CardContent>
      </Card>

      {/* Send to Doctor Modal */}
      {selectedPatient && (
        <SendToDoctorModal
          patient={selectedPatient}
          isOpen={isSendToDoctorModalOpen}
          onClose={() => {
            setIsSendToDoctorModalOpen(false);
            setSelectedPatient(null);
          }}
          onSuccess={handleAppointmentCreated}
        />
      )}
    </div>
  );
}
