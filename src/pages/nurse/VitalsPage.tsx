
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

export default function VitalsPage() {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formData, setFormData] = useState({
    temperature: '',
    pulse: '',
    respiration: '',
    bloodPressure: '',
    oxygenSat: '',
    painLevel: '',
    notes: '',
  });

  const patients = [
    { id: 'P-10542', name: 'Alice Johnson', room: '204', lastVitalsTime: '10:15 AM' },
    { id: 'P-10398', name: 'Robert Brown', room: '210', lastVitalsTime: '09:45 AM' },
    { id: 'P-10687', name: 'Emily Wilson', room: '108', lastVitalsTime: '10:00 AM' },
    { id: 'P-10754', name: 'Michael Davis', room: '307', lastVitalsTime: '08:30 AM' },
    { id: 'P-10892', name: 'Sarah Miller', room: '215', lastVitalsTime: '09:15 AM' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would save the vitals data to the server
    alert(`Vitals recorded for patient ${selectedPatient.name}`);
    // Reset form and selected patient after submission
    setFormData({
      temperature: '',
      pulse: '',
      respiration: '',
      bloodPressure: '',
      oxygenSat: '',
      painLevel: '',
      notes: '',
    });
    setSelectedPatient(null);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Vital Signs Monitoring</h1>
        <p className="text-gray-500">Record and track patient vital signs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Select Patient</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Last Vitals</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => (
                    <TableRow key={patient.id} className={selectedPatient?.id === patient.id ? 'bg-blue-50' : ''}>
                      <TableCell>{patient.id}</TableCell>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>{patient.room}</TableCell>
                      <TableCell>{patient.lastVitalsTime}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedPatient(patient)}
                        >
                          Select
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {selectedPatient ? (
          <Card>
            <CardHeader>
              <CardTitle>Record Vitals: {selectedPatient.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°C)</label>
                    <input
                      type="text"
                      name="temperature"
                      value={formData.temperature}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pulse Rate (bpm)</label>
                    <input
                      type="text"
                      name="pulse"
                      value={formData.pulse}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Respiration Rate (bpm)</label>
                    <input
                      type="text"
                      name="respiration"
                      value={formData.respiration}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Blood Pressure (mmHg)</label>
                    <input
                      type="text"
                      name="bloodPressure"
                      value={formData.bloodPressure}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      placeholder="e.g. 120/80"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Oxygen Saturation (%)</label>
                    <input
                      type="text"
                      name="oxygenSat"
                      value={formData.oxygenSat}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pain Level (0-10)</label>
                    <input
                      type="number"
                      name="painLevel"
                      min="0"
                      max="10"
                      value={formData.painLevel}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md h-24"
                  ></textarea>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" type="button" className="mr-2" onClick={() => setSelectedPatient(null)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Record Vitals
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Record Vitals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-64">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="text-gray-500 text-center">Select a patient from the list to record vital signs</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
