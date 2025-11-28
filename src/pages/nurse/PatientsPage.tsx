
import { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

export default function PatientsPage() {
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const patients = [
    { id: 'P-10542', name: 'Alice Johnson', age: 65, room: '204', diagnosis: 'Stroke', status: 'Critical', lastVitals: '10:15 AM' },
    { id: 'P-10398', name: 'Robert Brown', age: 52, room: '210', diagnosis: 'Diabetes', status: 'Stable', lastVitals: '09:45 AM' },
    { id: 'P-10687', name: 'Emily Wilson', age: 78, room: '108', diagnosis: 'Pneumonia', status: 'Recovering', lastVitals: '10:00 AM' },
    { id: 'P-10754', name: 'Michael Davis', age: 43, room: '307', diagnosis: 'Post-Op Care', status: 'Stable', lastVitals: '08:30 AM' },
    { id: 'P-10892', name: 'Sarah Miller', age: 32, room: '215', diagnosis: 'Pregnancy', status: 'Monitoring', lastVitals: '09:15 AM' },
  ];

  const filteredPatients = patients.filter(patient => {
    const matchesFilter = filterStatus === 'All' || patient.status === filterStatus;
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          patient.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admitted Patients</h1>
        <p className="text-gray-500">View and manage patient information</p>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Patient Search & Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search by name or ID..."
                className="pl-10 pr-4 py-2 w-full border rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant={filterStatus === 'All' ? "default" : "outline"}
                onClick={() => setFilterStatus('All')}
              >
                All
              </Button>
              <Button 
                variant={filterStatus === 'Stable' ? "default" : "outline"}
                onClick={() => setFilterStatus('Stable')}
              >
                Stable
              </Button>
              <Button 
                variant={filterStatus === 'Critical' ? "default" : "outline"}
                onClick={() => setFilterStatus('Critical')}
              >
                Critical
              </Button>
              <Button 
                variant={filterStatus === 'Recovering' ? "default" : "outline"}
                onClick={() => setFilterStatus('Recovering')}
              >
                Recovering
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Patient List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Vitals</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      No patients found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>{patient.id}</TableCell>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>{patient.age}</TableCell>
                      <TableCell>{patient.room}</TableCell>
                      <TableCell>{patient.diagnosis}</TableCell>
                      <TableCell>
                        <div className={`px-2 py-1 rounded-full text-xs inline-block font-medium
                          ${patient.status === 'Critical' ? 'bg-red-100 text-red-600' : 
                            patient.status === 'Stable' ? 'bg-green-100 text-green-600' :
                            patient.status === 'Recovering' ? 'bg-blue-100 text-blue-600' :
                            'bg-yellow-100 text-yellow-600'}`}>
                          {patient.status}
                        </div>
                      </TableCell>
                      <TableCell>{patient.lastVitals}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="outline" size="sm">Record Vitals</Button>
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
    </div>
  );
}
