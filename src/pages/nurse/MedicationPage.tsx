import React, { useState, useEffect } from 'react';
import { Pill, Clock, CheckCircle, AlertTriangle, Search, Scan, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { ApiService } from '@/services/apiService';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, isToday, parseISO } from 'date-fns';

interface Prescription {
  id: string;
  patient_id: string;
  patient_name: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  start_date: string;
  end_date: string;
  status: string;
  notes: string;
}

interface Administration {
  id: string;
  prescription_id: string;
  administered_at: string;
  administered_by: string;
  status: string; // Administered, Missed, Refused
  notes: string;
}

export default function NurseMedicationPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');

  // Administration Modal
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [isAdministerModalOpen, setIsAdministerModalOpen] = useState(false);
  const [administerForm, setAdministerForm] = useState({
    status: 'Administered',
    notes: '',
    pain_score: ''
  });

  useEffect(() => {
    loadPrescriptions();
  }, []);

  const loadPrescriptions = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getPrescriptions();
      // Filter for active prescriptions only
      const active = data.filter((p: any) => p.status === 'active');
      setPrescriptions(active);
    } catch (error) {
      console.error('Error loading prescriptions:', error);
      toast.error('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleAdministerClick = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setAdministerForm({
      status: 'Administered',
      notes: '',
      pain_score: ''
    });
    setIsAdministerModalOpen(true);
  };

  const handleAdministerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPrescription) return;

    try {
      // In a real app, we would call an endpoint to record administration
      // await ApiService.recordAdministration({ ... });

      // For now, we'll just simulate it
      toast.success(`Medication ${selectedPrescription.medication_name} recorded as ${administerForm.status}`);
      setIsAdministerModalOpen(false);

      // Ideally we would refresh the list or update local state to show it was given today
    } catch (error) {
      console.error('Error recording administration:', error);
      toast.error('Failed to record administration');
    }
  };

  const handleBarcodeScan = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate barcode scanning logic
    // In reality, this would look up the medication by barcode
    const found = prescriptions.find(p =>
      p.id === barcodeInput ||
      (p.medication_name && p.medication_name.toLowerCase().includes(barcodeInput.toLowerCase()))
    );

    if (found) {
      handleAdministerClick(found);
      setBarcodeInput('');
    } else {
      toast.error('Medication not found');
    }
  };

  const filteredPrescriptions = prescriptions.filter(p =>
    p.patient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.medication_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Medication Administration</h1>
          <p className="text-muted-foreground mt-1">Track and administer patient medications (MAR)</p>
        </div>

        {/* Barcode Scanner Simulation */}
        <form onSubmit={handleBarcodeScan} className="flex gap-2">
          <div className="relative">
            <Scan className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Scan Medication Barcode..."
              className="pl-9 w-[250px]"
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
            />
          </div>
          <Button type="submit">Scan</Button>
        </form>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="card-accent-blue hover:shadow-lg transition-all hover:scale-105">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Due Now</p>
              <h2 className="text-3xl font-bold text-blue-600">{filteredPrescriptions.length}</h2>
              <p className="text-xs text-muted-foreground mt-1">Scheduled for this shift</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-accent-green hover:shadow-lg transition-all hover:scale-105">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Administered</p>
              <h2 className="text-3xl font-bold text-green-600">0</h2>
              <p className="text-xs text-muted-foreground mt-1">Doses given today</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-accent-red hover:shadow-lg transition-all hover:scale-105">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Missed/Late</p>
              <h2 className="text-3xl font-bold text-red-600">0</h2>
              <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
            </div>
            <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Active Prescriptions</CardTitle>
            <div className="relative w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search patient or medication..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Medication</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Next Due</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrescriptions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    No active prescriptions found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPrescriptions.map((prescription) => (
                  <TableRow key={prescription.id}>
                    <TableCell className="font-medium">
                      {prescription.patient_name}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Pill className="h-4 w-4 text-blue-500" />
                        {prescription.medication_name}
                      </div>
                    </TableCell>
                    <TableCell>{prescription.dosage}</TableCell>
                    <TableCell>{prescription.frequency}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        Due Now
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" onClick={() => handleAdministerClick(prescription)}>
                        Administer
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Administer Modal */}
      <Dialog open={isAdministerModalOpen} onOpenChange={setIsAdministerModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Administer Medication</DialogTitle>
            <DialogDescription>
              Record administration details for this medication.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAdministerSubmit} className="space-y-4">
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Patient:</span>
                <span className="font-medium">{selectedPrescription?.patient_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Medication:</span>
                <span className="font-medium">{selectedPrescription?.medication_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Dosage:</span>
                <span className="font-medium">{selectedPrescription?.dosage}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={administerForm.status}
                onValueChange={(value) => setAdministerForm(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Administered">Administered</SelectItem>
                  <SelectItem value="Missed">Missed</SelectItem>
                  <SelectItem value="Refused">Refused by Patient</SelectItem>
                  <SelectItem value="Held">Held (Clinical Reason)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={administerForm.notes}
                onChange={(e) => setAdministerForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any observations, reactions, or reasons..."
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAdministerModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Confirm
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
