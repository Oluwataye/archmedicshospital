
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, Search, Plus, FileText, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import AppointmentForm from '@/components/ehr/AppointmentForm';

// Mock appointment data
const upcomingAppointments = [
  {
    id: "A001",
    patientId: "P-10237",
    patientName: "John Smith",
    date: new Date(2025, 4, 10, 9, 0),
    duration: "30 minutes",
    type: "General Consultation",
    doctor: "Dr. Emily Johnson",
    status: "confirmed"
  },
  {
    id: "A002",
    patientId: "P-10892",
    patientName: "Emily Davis",
    date: new Date(2025, 4, 12, 10, 30),
    duration: "45 minutes",
    type: "Follow-up",
    doctor: "Dr. Michael Chen",
    status: "pending"
  },
  {
    id: "A003",
    patientId: "P-10745",
    patientName: "Michael Brown",
    date: new Date(2025, 4, 15, 14, 0),
    duration: "1 hour",
    type: "Specialist Referral",
    doctor: "Dr. Sarah Wilson",
    status: "confirmed"
  }
];

const pastAppointments = [
  {
    id: "A004",
    patientId: "P-10237",
    patientName: "John Smith",
    date: new Date(2025, 4, 2, 11, 0),
    duration: "30 minutes",
    type: "Follow-up",
    doctor: "Dr. Emily Johnson",
    status: "completed"
  },
  {
    id: "A005",
    patientId: "P-10892",
    patientName: "Emily Davis",
    date: new Date(2025, 3, 28, 15, 30),
    duration: "45 minutes",
    type: "General Consultation",
    doctor: "Dr. Michael Chen",
    status: "completed"
  },
  {
    id: "A006",
    patientId: "P-11023",
    patientName: "David Garcia",
    date: new Date(2025, 3, 25, 9, 30),
    duration: "1 hour",
    type: "Emergency",
    doctor: "Dr. Sarah Wilson",
    status: "no-show"
  }
];

// Appointment status colors
const statusColors: Record<string, string> = {
  confirmed: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  cancelled: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
  "no-show": "bg-gray-100 text-gray-800",
};

const AppointmentsPage = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
  const [filterDoctor, setFilterDoctor] = useState("all");
  const [filterAppointmentType, setFilterAppointmentType] = useState("all");
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  
  // Filter appointments based on search and filters
  const filterAppointments = (appointments: any[]) => {
    return appointments.filter(appointment => {
      // Search filter
      const searchMatch = searchTerm === "" || 
        appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Date filter
      const dateMatch = !filterDate || 
        format(appointment.date, "yyyy-MM-dd") === format(filterDate, "yyyy-MM-dd");
      
      // Doctor filter
      const doctorMatch = filterDoctor === "all" || 
        appointment.doctor === filterDoctor;
      
      // Appointment type filter
      const typeMatch = filterAppointmentType === "all" || 
        appointment.type === filterAppointmentType;
      
      return searchMatch && dateMatch && doctorMatch && typeMatch;
    });
  };
  
  const filteredUpcoming = filterAppointments(upcomingAppointments);
  const filteredPast = filterAppointments(pastAppointments);
  
  // Unique doctors for filter
  const doctors = ["all", ...Array.from(new Set([
    ...upcomingAppointments.map(a => a.doctor),
    ...pastAppointments.map(a => a.doctor)
  ]))];
  
  // Unique appointment types for filter
  const appointmentTypes = ["all", ...Array.from(new Set([
    ...upcomingAppointments.map(a => a.type),
    ...pastAppointments.map(a => a.type)
  ]))];
  
  // Handle creating a new appointment
  const handleCreateAppointment = (data: any) => {
    console.log("Creating new appointment:", data);
    // In a real app, this would send the data to an API
  };
  
  // Handle viewing appointment details
  const handleViewAppointment = (id: string) => {
    toast.info(`Viewing appointment ${id} details`);
    // In a real app, this might open a modal with appointment details
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
          <div className="text-sm text-gray-500 flex items-center mt-1">
            <span>Health Records</span>
            <span className="mx-2">›</span>
            <span className="text-blue-500">Appointments</span>
          </div>
        </div>
        <Button 
          onClick={() => setIsNewAppointmentOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> New Appointment
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Appointment Management</CardTitle>
        </CardHeader>
        
        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by patient, ID, or doctor"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !filterDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filterDate ? format(filterDate, "PPP") : "Filter by date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filterDate}
                    onSelect={setFilterDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              <Select value={filterDoctor} onValueChange={setFilterDoctor}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by doctor" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor} value={doctor}>
                      {doctor === "all" ? "All Doctors" : doctor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={filterAppointmentType} onValueChange={setFilterAppointmentType}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  {appointmentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === "all" ? "All Types" : type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {(filterDate || filterDoctor !== "all" || filterAppointmentType !== "all" || searchTerm) && (
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setFilterDate(undefined);
                    setFilterDoctor("all");
                    setFilterAppointmentType("all");
                    setSearchTerm("");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
          
          {/* Appointments Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="upcoming">Upcoming Appointments</TabsTrigger>
              <TabsTrigger value="past">Past Appointments</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming">
              {filteredUpcoming.length > 0 ? (
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          <th className="py-3 px-4 text-left">Patient</th>
                          <th className="py-3 px-4 text-left">Date & Time</th>
                          <th className="py-3 px-4 text-left">Doctor</th>
                          <th className="py-3 px-4 text-left">Type</th>
                          <th className="py-3 px-4 text-left">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUpcoming.map((appointment) => (
                          <tr key={appointment.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div>
                                <p className="font-medium">{appointment.patientName}</p>
                                <p className="text-gray-500 text-xs">{appointment.patientId}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div>
                                <p>{format(appointment.date, "MMM dd, yyyy")}</p>
                                <p className="text-gray-500 text-xs">
                                  {format(appointment.date, "h:mm a")} • {appointment.duration}
                                </p>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              {appointment.doctor}
                            </td>
                            <td className="py-3 px-4">
                              {appointment.type}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[appointment.status]}`}>
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewAppointment(appointment.id)}
                              >
                                View Details
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center p-10 border rounded-md">
                  <Clock className="h-10 w-10 mx-auto mb-3 text-gray-400" />
                  <h3 className="font-medium text-lg mb-2">No upcoming appointments</h3>
                  <p className="text-gray-500 mb-4">No appointments match your current search criteria.</p>
                  <Button onClick={() => setIsNewAppointmentOpen(true)}>
                    Schedule New Appointment
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="past">
              {filteredPast.length > 0 ? (
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          <th className="py-3 px-4 text-left">Patient</th>
                          <th className="py-3 px-4 text-left">Date & Time</th>
                          <th className="py-3 px-4 text-left">Doctor</th>
                          <th className="py-3 px-4 text-left">Type</th>
                          <th className="py-3 px-4 text-left">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPast.map((appointment) => (
                          <tr key={appointment.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div>
                                <p className="font-medium">{appointment.patientName}</p>
                                <p className="text-gray-500 text-xs">{appointment.patientId}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div>
                                <p>{format(appointment.date, "MMM dd, yyyy")}</p>
                                <p className="text-gray-500 text-xs">
                                  {format(appointment.date, "h:mm a")} • {appointment.duration}
                                </p>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              {appointment.doctor}
                            </td>
                            <td className="py-3 px-4">
                              {appointment.type}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[appointment.status]}`}>
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewAppointment(appointment.id)}
                              >
                                View Details
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center p-10 border rounded-md">
                  <FileText className="h-10 w-10 mx-auto mb-3 text-gray-400" />
                  <h3 className="font-medium text-lg mb-2">No past appointments found</h3>
                  <p className="text-gray-500">No appointments match your current search criteria.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <AppointmentForm 
        open={isNewAppointmentOpen}
        onOpenChange={setIsNewAppointmentOpen}
        onSubmit={handleCreateAppointment}
      />
    </div>
  );
};

export default AppointmentsPage;
