"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var AppointmentCalendar_1 = require("@/components/doctor/AppointmentCalendar");
var card_1 = require("@/components/ui/card");
var tabs_1 = require("@/components/ui/tabs");
var button_1 = require("@/components/ui/button");
var dialog_1 = require("@/components/ui/dialog");
var ConsultationForm_1 = require("@/components/doctor/ConsultationForm");
var lucide_react_1 = require("lucide-react");
// Enhanced mock appointment data
var mockAppointmentDetails = [
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
var AppointmentsPage = function () {
    var _a = (0, react_1.useState)(null), selectedAppointment = _a[0], setSelectedAppointment = _a[1];
    var _b = (0, react_1.useState)(false), isConsultationOpen = _b[0], setIsConsultationOpen = _b[1];
    var _c = (0, react_1.useState)('upcoming'), activeTab = _c[0], setActiveTab = _c[1];
    var handleAppointmentSelect = function (appointment) {
        var fullAppointment = mockAppointmentDetails.find(function (a) { return a.id === appointment.id; }) || appointment;
        setSelectedAppointment(fullAppointment);
    };
    var startConsultation = function () {
        setIsConsultationOpen(true);
    };
    return (<div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
        <button_1.Button>New Appointment</button_1.Button>
      </div>
      
      <tabs_1.Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
        <tabs_1.TabsList>
          <tabs_1.TabsTrigger value="upcoming">Upcoming</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="past">Past</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="all">All</tabs_1.TabsTrigger>
        </tabs_1.TabsList>
        
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <AppointmentCalendar_1.default onSelectAppointment={handleAppointmentSelect}/>
          
          <card_1.Card className="h-full">
            <card_1.CardHeader>
              <card_1.CardTitle>Appointment Details</card_1.CardTitle>
              <card_1.CardDescription>
                Selected patient information and appointment details
              </card_1.CardDescription>
            </card_1.CardHeader>
            <card_1.CardContent>
              {selectedAppointment ? (<div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 rounded-full bg-medical-primary/20 flex items-center justify-center">
                      <lucide_react_1.User className="h-8 w-8 text-medical-primary"/>
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
                      <lucide_react_1.Clock className="h-4 w-4 text-muted-foreground"/>
                      <span>{selectedAppointment.time} ({selectedAppointment.duration} mins)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <lucide_react_1.Calendar className="h-4 w-4 text-muted-foreground"/>
                      <span>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <lucide_react_1.Phone className="h-4 w-4 text-muted-foreground"/>
                      <span>{selectedAppointment.contact}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <lucide_react_1.Mail className="h-4 w-4 text-muted-foreground"/>
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
                    <button_1.Button variant="outline">View Patient Record</button_1.Button>
                    <button_1.Button onClick={startConsultation}>Start Consultation</button_1.Button>
                  </div>
                </div>) : (<div className="flex h-[300px] flex-col items-center justify-center text-center">
                  <lucide_react_1.Calendar className="h-10 w-10 text-muted-foreground mb-3"/>
                  <h3 className="text-lg font-medium">No appointment selected</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Select an appointment from the schedule to view details
                  </p>
                </div>)}
            </card_1.CardContent>
          </card_1.Card>
        </div>
      </tabs_1.Tabs>
      
      {/* Consultation Dialog */}
      <dialog_1.Dialog open={isConsultationOpen} onOpenChange={setIsConsultationOpen}>
        <dialog_1.DialogContent className="max-w-3xl">
          <dialog_1.DialogHeader>
            <dialog_1.DialogTitle>Patient Consultation</dialog_1.DialogTitle>
            <dialog_1.DialogDescription>
              Record consultation details for this appointment
            </dialog_1.DialogDescription>
          </dialog_1.DialogHeader>
          <ConsultationForm_1.default patientName={selectedAppointment === null || selectedAppointment === void 0 ? void 0 : selectedAppointment.patientName} patientId={selectedAppointment === null || selectedAppointment === void 0 ? void 0 : selectedAppointment.patientId} onClose={function () { return setIsConsultationOpen(false); }}/>
        </dialog_1.DialogContent>
      </dialog_1.Dialog>
    </div>);
};
exports.default = AppointmentsPage;
