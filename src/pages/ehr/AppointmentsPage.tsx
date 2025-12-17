import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, Search, Plus, FileText, Clock, Loader2 } from 'lucide-react';
import { format, parseISO, isBefore, startOfDay } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import AppointmentForm from '@/components/ehr/AppointmentForm';
import { useAppointments } from '@/hooks/useAppointments';

// Appointment status colors
const statusColors: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-800",
  confirmed: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  cancelled: "bg-red-100 text-red-800",
  completed: "bg-gray-100 text-gray-800",
  "no-show": "bg-orange-100 text-orange-800",
};

const AppointmentsPage = () => {
  const {
    appointments,
    loading,
    createAppointment,
    updateAppointment,
    cancelAppointment,
  } = useAppointments();

  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState<Date | undefined>(undefined);
  const [filterDoctor, setFilterDoctor] = useState("all");
  const [filterAppointmentType, setFilterAppointmentType] = useState("all");
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  // Separate appointments into upcoming and past
  const { upcomingAppointments, pastAppointments } = useMemo(() => {
    const now = startOfDay(new Date());
    const upcoming: any[] = [];
    const past: any[] = [];

    appointments.forEach((apt) => {
      const aptDate = parseISO(apt.appointment_date);
      if (isBefore(aptDate, now) || apt.status === 'completed' || apt.status === 'cancelled' || apt.status === 'no-show') {
        past.push(apt);
      } else {
        upcoming.push(apt);
      }
    });

    return { upcomingAppointments: upcoming, pastAppointments: past };
  }, [appointments]);

  // Filter appointments based on search and filters
  const filterAppointments = (appointmentList: any[]) => {
    return appointmentList.filter(appointment => {
      const patientName = `${appointment.patient_first_name || ''} ${appointment.patient_last_name || ''}`.toLowerCase();
      const doctorName = `${appointment.doctor_first_name || ''} ${appointment.doctor_last_name || ''}`.toLowerCase();

      // Search filter
      const searchMatch = searchTerm === "" || 
      patientName.includes(searchTerm.toLowerCase()) ||
        appointment.patient_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctorName.includes(searchTerm.toLowerCase());

      // Date filter
      const dateMatch = !filterDate ||
        format(parseISO(appointment.appointment_date), "yyyy-MM-dd") === format(filterDate, "yyyy-MM-dd");

      // Doctor filter
      const doctorMatch = filterDoctor === "all" || 
      doctorName === filterDoctor.toLowerCase();

      // Appointment type filter
      const typeMatch = filterAppointmentType === "all" || 
      appointment.type === filterAppointmentType;

      return searchMatch && dateMatch && doctorMatch && typeMatch;
    });
  };

  const filteredUpcoming = filterAppointments(upcomingAppointments);
  const filteredPast = filterAppointments(pastAppointments);

  // Unique doctors for filter
  const doctors = useMemo(() => {
    const doctorSet = new Set<string>();
    appointments.forEach(apt => {
      const doctorName = `${apt.doctor_first_name || ''} ${apt.doctor_last_name || ''}`;
      if (doctorName.trim()) doctorSet.add(doctorName);
    });
    return ["all", ...Array.from(doctorSet)];
  }, [appointments]);

  // Unique appointment types for filter
  const appointmentTypes = useMemo(() => {
    const typeSet = new Set<string>();
    appointments.forEach(apt => {
      if (apt.type) typeSet.add(apt.type);
    });
    return ["all", ...Array.from(typeSet)];
  }, [appointments]);

  // Handle creating a new appointment
  const handleCreateAppointment = async (data: any) => {
    try {
      await createAppointment(data);
      setIsNewAppointmentOpen(false);
    } catch (error) {
      // Error already handled in hook
    }
  };

  // Handle viewing appointment details
  const handleViewAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
    toast.info(`Viewing appointment details`);
    // Could open a detailed modal here
  };

  // Handle cancelling appointment
  const handleCancelAppointment = async (id: string) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await cancelAppointment(id);
      } catch (error) {
        // Error already handled in hook
      }
    }
  };

  return (
    <div className="space-y-6">
      < div className ="flex items-center justify-between">
        < div >
        <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
          < div className ="text-sm text-gray-500 flex items-center mt-1">
            < span > Health Records</span >
              <span className="mx-2">›</span>
                < span className ="text-blue-500">Appointments</span>
          </div >
        </div >
  <Button
    onClick={() => setIsNewAppointmentOpen(true)}
    className="flex items-center gap-2"
      >
      <Plus className="h-4 w-4" /> New Appointment
        </Button >
      </div >
      
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
  < Popover >
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
                </PopoverTrigger >
  <PopoverContent className="w-auto p-0" align="start">
    < Calendar
mode ="single"
selected = { filterDate }
onSelect = { setFilterDate }
initialFocus
  />
                </PopoverContent >
              </Popover >
              
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
              </Select >
              
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
              </Select >

  {(filterDate || filterDoctor !== "all" || filterAppointmentType !== "all" || searchTerm) && (
    < Button 
                  variant ="ghost" 
                  onClick = {() => {
    setFilterDate(undefined);
                    setFilterDoctor("all");
      setFilterAppointmentType("all");
                    setSearchTerm("");
                  }}
                >
        Clear Filters
                </Button >
              )}
            </div >
          </div >

        {
          loading?(
            <div className ="flex items-center justify-center p-10">
              <Loader2 className ="h-8 w-8 animate-spin text-blue-500" />
              <span className ="ml-2">Loading appointments...</span>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="upcoming">
                  Upcoming Appointments ({filteredUpcoming.length})
                </TabsTrigger>
                <TabsTrigger value="past">
                  Past Appointments({ filteredPast.length })
                </TabsTrigger >
              </TabsList >

    <TabsContent value="upcoming">
                {
      filteredUpcoming.length > 0 ? (
        <div className="rounded-md border">
        <div className ="overflow-x-auto">
        <table className ="w-full text-sm">
        <thead>
                          < tr className ="bg-gray-50 border-b">
  < th className ="py-3 px-4 text-left">Patient</th>
  < th className ="py-3 px-4 text-left">Date & Time</th>
  < th className ="py-3 px-4 text-left">Doctor</th>
  < th className ="py-3 px-4 text-left">Type</th>
  < th className ="py-3 px-4 text-left">Status</th>
  < th className ="py-3 px-4 text-right">Actions</th>
                          </tr >
                        </thead >
    <tbody>
      {filteredUpcoming.map((appointment) => (
        <tr key={appointment.id} className="border-b hover:bg-gray-50">
      <td className="py-3 px-4">
      <div>
        <p className="font-medium">
        {appointment.patient_first_name} {appointment.patient_last_name}
      </p>
      <p className="text-gray-500 text-xs">{appointment.patient_id}</p>
                                </div >
                              </td >
    <td className="py-3 px-4">
    < div >
                                  <p>{format(parseISO(appointment.appointment_date), "MMM dd, yyyy")}</p>
                                  <p className="text-gray-500 text-xs">
                                    { appointment.appointment_time } • { appointment.duration } min
                                  </p >
                                </div >
                              </td >
    <td className="py-3 px-4">
                                { appointment.doctor_first_name } { appointment.doctor_last_name }
                              </td >
    <td className="py-3 px-4">
                                { appointment.type }
                              </td >
    <td className="py-3 px-4">
  < span className = {`px-2 py-1 rounded-full text-xs font-medium ${statusColors[appointment.status] || 'bg-gray-100 text-gray-800'}`}>
  { appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1) }
                                </span >
                              </td >
    <td className="py-3 px-4 text-right space-x-2">
  < Button
                                  variant ="ghost"
                                  size ="sm"
                                  onClick = {() => handleViewAppointment(appointment)}
                                >
    View
                                </Button >
    <Button
      variant="ghost"
                                  size ="sm"
                                  onClick = {() => handleCancelAppointment(appointment.id)}
    className ="text-red-600 hover:text-red-700"
  >
  Cancel
                                </Button >
                              </td >
                            </tr >
                          ))}
                        </tbody >
                      </table >
                    </div >
                  </div >
                ) : (
  <div className="text-center p-10 border rounded-md">
    < Clock className ="h-10 w-10 mx-auto mb-3 text-gray-400" />
      < h3 className ="font-medium text-lg mb-2">No upcoming appointments</h3>
        < p className ="text-gray-500 mb-4">No appointments match your current search criteria.</p>
          < Button onClick = {() => setIsNewAppointmentOpen(true)}>
            Schedule New Appointment
                    </Button >
                  </div >
                )}
              </TabsContent >

  <TabsContent value="past">
{
  filteredPast.length > 0 ? (
    <div className="rounded-md border">
      < div className ="overflow-x-auto">
        < table className ="w-full text-sm">
          < thead >
          <tr className="bg-gray-50 border-b">
            < th className ="py-3 px-4 text-left">Patient</th>
              < th className ="py-3 px-4 text-left">Date & Time</th>
                < th className ="py-3 px-4 text-left">Doctor</th>
                  < th className ="py-3 px-4 text-left">Type</th>
                    < th className ="py-3 px-4 text-left">Status</th>
                      < th className ="py-3 px-4 text-right">Actions</th>
                          </tr >
                        </thead >
    <tbody>
      {filteredPast.map((appointment) => (
        <tr key={appointment.id} className="border-b hover:bg-gray-50">
      <td className="py-3 px-4">
      <div>
        <p className="font-medium">
        {appointment.patient_first_name} {appointment.patient_last_name}
      </p>
      <p className="text-gray-500 text-xs">{appointment.patient_id}</p>
                                </div >
                              </td >
    <td className="py-3 px-4">
      < div >
                                  <p>{format(parseISO(appointment.appointment_date), "MMM dd, yyyy")}</p>
                                  <p className="text-gray-500 text-xs">
  { appointment.appointment_time } • { appointment.duration } min
                                  </p >
                                </div >
                              </td >
    <td className="py-3 px-4">
  { appointment.doctor_first_name } { appointment.doctor_last_name }
                              </td >
    <td className="py-3 px-4">
  { appointment.type }
                              </td >
    <td className="py-3 px-4">
      < span className = {`px-2 py-1 rounded-full text-xs font-medium ${statusColors[appointment.status] || 'bg-gray-100 text-gray-800'}`
}>
  { appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1) }
                                </span >
                              </td >
  <td className="py-3 px-4 text-right">
    < Button
variant ="ghost"
size ="sm"
onClick = {() => handleViewAppointment(appointment)}
                                >
  View Details
                                </Button >
                              </td >
                            </tr >
                          ))}
                        </tbody >
                      </table >
                    </div >
                  </div >
                ) : (
  <div className="text-center p-10 border rounded-md">
    < FileText className ="h-10 w-10 mx-auto mb-3 text-gray-400" />
      < h3 className ="font-medium text-lg mb-2">No past appointments found</h3>
        < p className ="text-gray-500">No appointments match your current search criteria.</p>
                  </div >
                )}
              </TabsContent >
            </Tabs >
          )}
        </CardContent >
      </Card >

  <AppointmentForm
    open={isNewAppointmentOpen}
    onOpenChange={setIsNewAppointmentOpen}
    onSubmit={handleCreateAppointment}
  />
    </div >
  );
};

export default AppointmentsPage;


