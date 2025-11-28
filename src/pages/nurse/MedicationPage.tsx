
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export default function MedicationPage() {
  const [medications, setMedications] = useState([
    { 
      id: 'M-1001', 
      patientId: 'P-10542',
      patientName: 'Alice Johnson',
      room: '204',
      medication: 'Amoxicillin 500mg',
      route: 'Oral',
      schedule: 'Every 8 hours',
      nextDue: '10:30 AM',
      status: 'pending',
    },
    { 
      id: 'M-1002', 
      patientId: 'P-10398',
      patientName: 'Robert Brown',
      room: '210',
      medication: 'Insulin Regular 10 units',
      route: 'Subcutaneous',
      schedule: 'Before meals',
      nextDue: '11:00 AM',
      status: 'pending',
    },
    { 
      id: 'M-1003', 
      patientId: 'P-10687',
      patientName: 'Emily Wilson',
      room: '108',
      medication: 'Furosemide 20mg',
      route: 'Oral',
      schedule: 'Once daily',
      nextDue: '09:00 AM',
      status: 'completed',
    },
    { 
      id: 'M-1004', 
      patientId: 'P-10754',
      patientName: 'Michael Davis',
      room: '307',
      medication: 'Morphine 2mg',
      route: 'IV',
      schedule: 'Every 4 hours PRN',
      nextDue: '12:30 PM',
      status: 'pending',
    },
    { 
      id: 'M-1005', 
      patientId: 'P-10542',
      patientName: 'Alice Johnson',
      room: '204',
      medication: 'Aspirin 81mg',
      route: 'Oral',
      schedule: 'Once daily',
      nextDue: '09:00 AM',
      status: 'completed',
    },
  ]);

  const [selectedMedication, setSelectedMedication] = useState(null);
  const [showAdministerForm, setShowAdministerForm] = useState(false);
  const [adminFormData, setAdminFormData] = useState({
    actualTime: '',
    notes: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAdminister = (med) => {
    setSelectedMedication(med);
    setShowAdministerForm(true);
    // Pre-populate the form with current time
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    setAdminFormData({
      actualTime: `${hours}:${minutes}`,
      notes: '',
    });
  };

  const handleSubmitAdminister = (e) => {
    e.preventDefault();
    // Update the medication status
    setMedications(prevMeds => prevMeds.map(med => 
      med.id === selectedMedication.id 
        ? { ...med, status: 'completed' } 
        : med
    ));
    
    // Reset form
    setSelectedMedication(null);
    setShowAdministerForm(false);
    setAdminFormData({
      actualTime: '',
      notes: '',
    });
    
    // Show confirmation (in a real app, this would be a toast notification)
    alert(`Medication ${selectedMedication.medication} administered to ${selectedMedication.patientName}`);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Medication Administration</h1>
        <p className="text-gray-500">Track and administer scheduled medications</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Due Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center p-6">
              <div className="text-center">
                <div className="rounded-full w-20 h-20 bg-yellow-100 text-yellow-600 flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-10 w-10" />
                </div>
                <p className="text-4xl font-bold">3</p>
                <p className="text-gray-500">Medications due within 30 minutes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Administered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center p-6">
              <div className="text-center">
                <div className="rounded-full w-20 h-20 bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-10 w-10" />
                </div>
                <p className="text-4xl font-bold">
                  {medications.filter(med => med.status === 'completed').length}
                </p>
                <p className="text-gray-500">Medications administered today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center p-6">
              <div className="text-center">
                <div className="rounded-full w-20 h-20 bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-10 w-10" />
                </div>
                <p className="text-4xl font-bold">0</p>
                <p className="text-gray-500">Missed or delayed medications</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {showAdministerForm ? (
        <Card>
          <CardHeader>
            <CardTitle>Administer Medication</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitAdminister} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-md">
                <div>
                  <p className="text-sm font-medium text-gray-700">Patient</p>
                  <p className="text-base">{selectedMedication.patientName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Room</p>
                  <p className="text-base">{selectedMedication.room}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Medication</p>
                  <p className="text-base">{selectedMedication.medication}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Route</p>
                  <p className="text-base">{selectedMedication.route}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Scheduled Time</p>
                  <p className="text-base">{selectedMedication.nextDue}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Schedule</p>
                  <p className="text-base">{selectedMedication.schedule}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Actual Administration Time</label>
                <input
                  type="time"
                  name="actualTime"
                  value={adminFormData.actualTime}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={adminFormData.notes}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md h-24"
                  placeholder="Document any relevant observations or patient reactions"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => {
                  setSelectedMedication(null);
                  setShowAdministerForm(false);
                }}>
                  Cancel
                </Button>
                <Button type="submit">
                  Confirm Administration
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Medication Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Medication</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Next Due</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {medications.map((med) => (
                    <TableRow key={med.id}>
                      <TableCell>{med.patientName}</TableCell>
                      <TableCell>{med.room}</TableCell>
                      <TableCell>{med.medication}</TableCell>
                      <TableCell>{med.route}</TableCell>
                      <TableCell>{med.schedule}</TableCell>
                      <TableCell>{med.nextDue}</TableCell>
                      <TableCell>
                        <div className={`px-2 py-1 rounded-full text-xs inline-block font-medium
                          ${med.status === 'completed' ? 'bg-green-100 text-green-600' : 
                            med.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-red-100 text-red-600'}`}>
                          {med.status === 'completed' ? 'Administered' : 
                            med.status === 'pending' ? 'Pending' : 'Missed'}
                        </div>
                      </TableCell>
                      <TableCell>
                        {med.status === 'pending' && (
                          <Button size="sm" onClick={() => handleAdminister(med)}>
                            Administer
                          </Button>
                        )}
                        {med.status === 'completed' && (
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
