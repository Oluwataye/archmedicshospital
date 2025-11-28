
import React, { useState } from 'react';
import AppointmentCalendar from '@/components/doctor/AppointmentCalendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import ConsultationForm from '@/components/doctor/ConsultationForm';
import { User, Clock, Calendar, Phone, Mail } from 'lucide-react';

interface Appointment {
  id: number;
  patientName: string;
  time: string;
  type: string;
  status: string;
  duration: number;
  patientId?: string;
  reason?: string;
  contact?: string;
  email?: string;
  age?: number;
  gender?: string;
  lastVisit?: string;
}

// Enhanced mock appointment data
const mockAppointmentDetails: Appointment[] = [
  { 
    id: 1, 
    patientName: 'Jane Smith', 
    patientId: 'P1001',
    time: '09:00 AM',
    type: 'Follow-up',
    status: 'Confirmed',
    duration: 30,
    reason: 'Follow-up on hypertension medication',
    contact: '+234 801 234 5678',
    email: 'jane.smith@example.com',
    age: 45,
    gender: 'Female',
    lastVisit: '2 weeks ago'
  },
  { 
    id: 2, 
    patientName: 'Robert Johnson', 
    patientId: 'P1002',
    time: '10:00 AM',
    type: 'New Patient',
    status: 'Confirmed',
    duration: 45,
    reason: 'Persistent headaches and fatigue',
    contact: '+234 802 345 6789',
    email: 'robert.johnson@example.com',
    age: 52,
    gender: 'Male',
    lastVisit: 'First visit'
  },
  { 
    id: 3, 
    patientName: 'Mary Williams', 
    patientId: 'P1003',
    time: '11:15 AM',
    type: 'Follow-up',
    status: 'Confirmed',
    duration: 30,
    reason: 'Diabetes management review',
    contact: '+234 803 456 7890',
    email: 'mary.williams@example.com',
    age: 68,
    gender: 'Female',
    lastVisit: '1 month ago'
  },
  { 
    id: 4, 
    patientName: 'David Brown', 
    patientId: 'P1004',
    time: '01:30 PM',
    type: 'Follow-up',
    status: 'Confirmed',
    duration: 30,
    reason: 'Post-surgical check-up',
    contact: '+234 804 567 8901',
    email: 'david.brown@example.com',
    age: 37,
    gender: 'Male',
    lastVisit: '2 months ago'
  },
  { 
    id: 5, 
    patientName: 'Elizabeth Taylor', 
    patientId: 'P1005',
    time: '02:15 PM',
    type: 'New Patient',
    status: 'Confirmed',
    duration: 45,
    reason: 'Chronic back pain assessment',
    contact: '+234 805 678 9012',
    email: 'elizabeth.taylor@example.com',
    age: 41,
    gender: 'Female',
    lastVisit: 'First visit'
  },
  { 
    id: 6, 
    patientName: 'Michael Davis', 
    patientId: 'P1006',
    time: '03:30 PM',
    type: 'Follow-up',
    status: 'Confirmed',
    duration: 30,
    reason: 'Asthma medication review',
    contact: '+234 806 789 0123',
    email: 'michael.davis@example.com',
    age: 29,
    gender: 'Male',
    lastVisit: '3 weeks ago'
  }
];

const AppointmentsPage = () => {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');
  
  const handleAppointmentSelect = (appointment: any) => {
    const fullAppointment = mockAppointmentDetails.find(a => a.id === appointment.id) || appointment;
    setSelectedAppointment(fullAppointment);
  };

  const startConsultation = () => {
    setIsConsultationOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
        <Button>New Appointment</Button>
      </div>
      
      <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
        
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <AppointmentCalendar onSelectAppointment={handleAppointmentSelect} />
          
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Appointment Details</CardTitle>
              <CardDescription>
                Selected patient information and appointment details
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedAppointment ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 rounded-full bg-medical-primary/20 flex items-center justify-center">
                      <User className="h-8 w-8 text-medical-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{selectedAppointment.patientName}</h3>
                      <p className="text-sm text-muted-foreground">
                        Patient ID: {selectedAppointment.patientId}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedAppointment.time} ({selectedAppointment.duration} mins)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedAppointment.contact}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{selectedAppointment.email}</span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-muted rounded-md">
                    <h4 className="font-medium mb-2">Reason for Visit</h4>
                    <p className="text-sm">{selectedAppointment.reason}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Age:</span> {selectedAppointment.age}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Gender:</span> {selectedAppointment.gender}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Type:</span> {selectedAppointment.type}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Last Visit:</span> {selectedAppointment.lastVisit}
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-end space-x-2">
                    <Button variant="outline">View Patient Record</Button>
                    <Button onClick={startConsultation}>Start Consultation</Button>
                  </div>
                </div>
              ) : (
                <div className="flex h-[300px] flex-col items-center justify-center text-center">
                  <Calendar className="h-10 w-10 text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium">No appointment selected</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Select an appointment from the schedule to view details
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </Tabs>
      
      {/* Consultation Dialog */}
      <Dialog open={isConsultationOpen} onOpenChange={setIsConsultationOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Patient Consultation</DialogTitle>
            <DialogDescription>
              Record consultation details for this appointment
            </DialogDescription>
          </DialogHeader>
          <ConsultationForm 
            patientName={selectedAppointment?.patientName}
            patientId={selectedAppointment?.patientId}
            onClose={() => setIsConsultationOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentsPage;
