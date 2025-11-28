
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, User, FileText, Calendar, Clock } from 'lucide-react';

// Mock patients data
const mockPatients = [
  { 
    id: 'P1001', 
    name: 'Jane Smith', 
    age: 45, 
    gender: 'Female',
    contact: '+234 801 234 5678',
    email: 'jane.smith@example.com',
    lastVisit: '2023-05-01',
    diagnoses: ['Hypertension', 'Type 2 Diabetes'],
    status: 'Active'
  },
  { 
    id: 'P1002', 
    name: 'Robert Johnson', 
    age: 52, 
    gender: 'Male',
    contact: '+234 802 345 6789',
    email: 'robert.johnson@example.com',
    lastVisit: null,
    diagnoses: [],
    status: 'New'
  },
  { 
    id: 'P1003', 
    name: 'Mary Williams', 
    age: 68, 
    gender: 'Female',
    contact: '+234 803 456 7890',
    email: 'mary.williams@example.com',
    lastVisit: '2023-04-15',
    diagnoses: ['Type 2 Diabetes', 'Osteoarthritis'],
    status: 'Active'
  },
  { 
    id: 'P1004', 
    name: 'David Brown', 
    age: 37, 
    gender: 'Male',
    contact: '+234 804 567 8901',
    email: 'david.brown@example.com',
    lastVisit: '2023-03-12',
    diagnoses: ['Post-surgical recovery - Appendectomy'],
    status: 'Active'
  },
  { 
    id: 'P1005', 
    name: 'Elizabeth Taylor', 
    age: 41, 
    gender: 'Female',
    contact: '+234 805 678 9012',
    email: 'elizabeth.taylor@example.com',
    lastVisit: null,
    diagnoses: [],
    status: 'New'
  },
  { 
    id: 'P1006', 
    name: 'Michael Davis', 
    age: 29, 
    gender: 'Male',
    contact: '+234 806 789 0123',
    email: 'michael.davis@example.com',
    lastVisit: '2023-04-28',
    diagnoses: ['Asthma', 'Seasonal allergies'],
    status: 'Active'
  },
  { 
    id: 'P1007', 
    name: 'Sarah Johnson', 
    age: 33, 
    gender: 'Female',
    contact: '+234 807 890 1234',
    email: 'sarah.johnson@example.com',
    lastVisit: '2023-02-15',
    diagnoses: ['Migraine', 'Anxiety'],
    status: 'Active'
  },
  { 
    id: 'P1008', 
    name: 'James Wilson', 
    age: 58, 
    gender: 'Male',
    contact: '+234 808 901 2345',
    email: 'james.wilson@example.com',
    lastVisit: '2023-04-05',
    diagnoses: ['Hypertension', 'Hyperlipidemia'],
    status: 'Active'
  }
];

const PatientsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('all');
  
  const filteredPatients = mockPatients.filter(patient => {
    // Apply tab filters
    if (activeTab === 'new' && patient.status !== 'New') return false;
    if (activeTab === 'active' && patient.status !== 'Active') return false;
    
    // Apply search filter
    if (searchTerm === '') return true;
    
    return (
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  
  const handlePatientSelect = (patient: any) => {
    setSelectedPatient(patient);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Patient
        </Button>
      </div>
      
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patients by name or ID..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Patients</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
        </TabsList>
        
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Patient List</CardTitle>
              <CardDescription>
                {filteredPatients.length} patients found
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className={`p-3 rounded-md cursor-pointer flex items-center justify-between border ${
                      selectedPatient?.id === patient.id ? 'bg-medical-primary/10 border-medical-primary' : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => handlePatientSelect(patient)}
                  >
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mr-3">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="font-medium">{patient.name}</h4>
                        <div className="text-sm text-muted-foreground">ID: {patient.id}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">
                        {patient.age} yrs, {patient.gender}
                      </div>
                      <div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          patient.status === 'New' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {patient.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredPatients.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Search className="h-10 w-10 text-muted-foreground mb-3" />
                    <h3 className="text-lg font-medium">No patients found</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Try adjusting your search or filters
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Patient Details</CardTitle>
              <CardDescription>
                Medical information and history
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedPatient ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 rounded-full bg-medical-primary/20 flex items-center justify-center">
                      <User className="h-8 w-8 text-medical-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{selectedPatient.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Patient ID: {selectedPatient.id}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Age:</span>
                      <p>{selectedPatient.age} years</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Gender:</span>
                      <p>{selectedPatient.gender}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Contact:</span>
                      <p>{selectedPatient.contact}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Email:</span>
                      <p>{selectedPatient.email}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Medical History</h4>
                      {selectedPatient.diagnoses.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1">
                          {selectedPatient.diagnoses.map((diagnosis: string, index: number) => (
                            <li key={index}>{diagnosis}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">No medical history recorded</p>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Last Visit</h4>
                      {selectedPatient.lastVisit ? (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          {new Date(selectedPatient.lastVisit).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No previous visits</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-end space-x-2">
                    <Button variant="outline">Full Medical Record</Button>
                    <Button>Start Consultation</Button>
                  </div>
                </div>
              ) : (
                <div className="flex h-[300px] flex-col items-center justify-center text-center">
                  <FileText className="h-10 w-10 text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium">No patient selected</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Select a patient from the list to view their details
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </Tabs>
    </div>
  );
};

export default PatientsPage;
