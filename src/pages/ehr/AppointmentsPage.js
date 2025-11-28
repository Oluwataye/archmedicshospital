"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var tabs_1 = require("@/components/ui/tabs");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var select_1 = require("@/components/ui/select");
var lucide_react_1 = require("lucide-react");
var date_fns_1 = require("date-fns");
var calendar_1 = require("@/components/ui/calendar");
var popover_1 = require("@/components/ui/popover");
var utils_1 = require("@/lib/utils");
var sonner_1 = require("sonner");
var AppointmentForm_1 = require("@/components/ehr/AppointmentForm");
// Mock appointment data
var upcomingAppointments = [
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
var pastAppointments = [
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
var statusColors = {
    confirmed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    cancelled: "bg-red-100 text-red-800",
    completed: "bg-blue-100 text-blue-800",
    "no-show": "bg-gray-100 text-gray-800",
};
var AppointmentsPage = function () {
    var _a = (0, react_1.useState)("upcoming"), activeTab = _a[0], setActiveTab = _a[1];
    var _b = (0, react_1.useState)(""), searchTerm = _b[0], setSearchTerm = _b[1];
    var _c = (0, react_1.useState)(undefined), filterDate = _c[0], setFilterDate = _c[1];
    var _d = (0, react_1.useState)("all"), filterDoctor = _d[0], setFilterDoctor = _d[1];
    var _e = (0, react_1.useState)("all"), filterAppointmentType = _e[0], setFilterAppointmentType = _e[1];
    var _f = (0, react_1.useState)(false), isNewAppointmentOpen = _f[0], setIsNewAppointmentOpen = _f[1];
    // Filter appointments based on search and filters
    var filterAppointments = function (appointments) {
        return appointments.filter(function (appointment) {
            // Search filter
            var searchMatch = searchTerm === "" ||
                appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                appointment.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase());
            // Date filter
            var dateMatch = !filterDate ||
                (0, date_fns_1.format)(appointment.date, "yyyy-MM-dd") === (0, date_fns_1.format)(filterDate, "yyyy-MM-dd");
            // Doctor filter
            var doctorMatch = filterDoctor === "all" ||
                appointment.doctor === filterDoctor;
            // Appointment type filter
            var typeMatch = filterAppointmentType === "all" ||
                appointment.type === filterAppointmentType;
            return searchMatch && dateMatch && doctorMatch && typeMatch;
        });
    };
    var filteredUpcoming = filterAppointments(upcomingAppointments);
    var filteredPast = filterAppointments(pastAppointments);
    // Unique doctors for filter
    var doctors = __spreadArray(["all"], Array.from(new Set(__spreadArray(__spreadArray([], upcomingAppointments.map(function (a) { return a.doctor; }), true), pastAppointments.map(function (a) { return a.doctor; }), true))), true);
    // Unique appointment types for filter
    var appointmentTypes = __spreadArray(["all"], Array.from(new Set(__spreadArray(__spreadArray([], upcomingAppointments.map(function (a) { return a.type; }), true), pastAppointments.map(function (a) { return a.type; }), true))), true);
    // Handle creating a new appointment
    var handleCreateAppointment = function (data) {
        console.log("Creating new appointment:", data);
        // In a real app, this would send the data to an API
    };
    // Handle viewing appointment details
    var handleViewAppointment = function (id) {
        sonner_1.toast.info("Viewing appointment ".concat(id, " details"));
        // In a real app, this might open a modal with appointment details
    };
    return (<div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
          <div className="text-sm text-gray-500 flex items-center mt-1">
            <span>Health Records</span>
            <span className="mx-2">›</span>
            <span className="text-blue-500">Appointments</span>
          </div>
        </div>
        <button_1.Button onClick={function () { return setIsNewAppointmentOpen(true); }} className="flex items-center gap-2">
          <lucide_react_1.Plus className="h-4 w-4"/> New Appointment
        </button_1.Button>
      </div>
      
      <card_1.Card>
        <card_1.CardHeader className="pb-3">
          <card_1.CardTitle>Appointment Management</card_1.CardTitle>
        </card_1.CardHeader>
        
        <card_1.CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <lucide_react_1.Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500"/>
              <input_1.Input placeholder="Search by patient, ID, or doctor" value={searchTerm} onChange={function (e) { return setSearchTerm(e.target.value); }} className="pl-9"/>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <popover_1.Popover>
                <popover_1.PopoverTrigger asChild>
                  <button_1.Button variant="outline" className={(0, utils_1.cn)("w-[240px] justify-start text-left font-normal", !filterDate && "text-muted-foreground")}>
                    <lucide_react_1.Calendar className="mr-2 h-4 w-4"/>
                    {filterDate ? (0, date_fns_1.format)(filterDate, "PPP") : "Filter by date"}
                  </button_1.Button>
                </popover_1.PopoverTrigger>
                <popover_1.PopoverContent className="w-auto p-0" align="start">
                  <calendar_1.Calendar mode="single" selected={filterDate} onSelect={setFilterDate} initialFocus/>
                </popover_1.PopoverContent>
              </popover_1.Popover>
              
              <select_1.Select value={filterDoctor} onValueChange={setFilterDoctor}>
                <select_1.SelectTrigger className="w-[200px]">
                  <select_1.SelectValue placeholder="Filter by doctor"/>
                </select_1.SelectTrigger>
                <select_1.SelectContent>
                  {doctors.map(function (doctor) { return (<select_1.SelectItem key={doctor} value={doctor}>
                      {doctor === "all" ? "All Doctors" : doctor}
                    </select_1.SelectItem>); })}
                </select_1.SelectContent>
              </select_1.Select>
              
              <select_1.Select value={filterAppointmentType} onValueChange={setFilterAppointmentType}>
                <select_1.SelectTrigger className="w-[200px]">
                  <select_1.SelectValue placeholder="Filter by type"/>
                </select_1.SelectTrigger>
                <select_1.SelectContent>
                  {appointmentTypes.map(function (type) { return (<select_1.SelectItem key={type} value={type}>
                      {type === "all" ? "All Types" : type}
                    </select_1.SelectItem>); })}
                </select_1.SelectContent>
              </select_1.Select>
              
              {(filterDate || filterDoctor !== "all" || filterAppointmentType !== "all" || searchTerm) && (<button_1.Button variant="ghost" onClick={function () {
                setFilterDate(undefined);
                setFilterDoctor("all");
                setFilterAppointmentType("all");
                setSearchTerm("");
            }}>
                  Clear Filters
                </button_1.Button>)}
            </div>
          </div>
          
          {/* Appointments Tabs */}
          <tabs_1.Tabs value={activeTab} onValueChange={setActiveTab}>
            <tabs_1.TabsList className="grid w-full grid-cols-2 mb-6">
              <tabs_1.TabsTrigger value="upcoming">Upcoming Appointments</tabs_1.TabsTrigger>
              <tabs_1.TabsTrigger value="past">Past Appointments</tabs_1.TabsTrigger>
            </tabs_1.TabsList>
            
            <tabs_1.TabsContent value="upcoming">
              {filteredUpcoming.length > 0 ? (<div className="rounded-md border">
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
                        {filteredUpcoming.map(function (appointment) { return (<tr key={appointment.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div>
                                <p className="font-medium">{appointment.patientName}</p>
                                <p className="text-gray-500 text-xs">{appointment.patientId}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div>
                                <p>{(0, date_fns_1.format)(appointment.date, "MMM dd, yyyy")}</p>
                                <p className="text-gray-500 text-xs">
                                  {(0, date_fns_1.format)(appointment.date, "h:mm a")} • {appointment.duration}
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
                              <span className={"px-2 py-1 rounded-full text-xs font-medium ".concat(statusColors[appointment.status])}>
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button_1.Button variant="ghost" size="sm" onClick={function () { return handleViewAppointment(appointment.id); }}>
                                View Details
                              </button_1.Button>
                            </td>
                          </tr>); })}
                      </tbody>
                    </table>
                  </div>
                </div>) : (<div className="text-center p-10 border rounded-md">
                  <lucide_react_1.Clock className="h-10 w-10 mx-auto mb-3 text-gray-400"/>
                  <h3 className="font-medium text-lg mb-2">No upcoming appointments</h3>
                  <p className="text-gray-500 mb-4">No appointments match your current search criteria.</p>
                  <button_1.Button onClick={function () { return setIsNewAppointmentOpen(true); }}>
                    Schedule New Appointment
                  </button_1.Button>
                </div>)}
            </tabs_1.TabsContent>
            
            <tabs_1.TabsContent value="past">
              {filteredPast.length > 0 ? (<div className="rounded-md border">
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
                        {filteredPast.map(function (appointment) { return (<tr key={appointment.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <div>
                                <p className="font-medium">{appointment.patientName}</p>
                                <p className="text-gray-500 text-xs">{appointment.patientId}</p>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div>
                                <p>{(0, date_fns_1.format)(appointment.date, "MMM dd, yyyy")}</p>
                                <p className="text-gray-500 text-xs">
                                  {(0, date_fns_1.format)(appointment.date, "h:mm a")} • {appointment.duration}
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
                              <span className={"px-2 py-1 rounded-full text-xs font-medium ".concat(statusColors[appointment.status])}>
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button_1.Button variant="ghost" size="sm" onClick={function () { return handleViewAppointment(appointment.id); }}>
                                View Details
                              </button_1.Button>
                            </td>
                          </tr>); })}
                      </tbody>
                    </table>
                  </div>
                </div>) : (<div className="text-center p-10 border rounded-md">
                  <lucide_react_1.FileText className="h-10 w-10 mx-auto mb-3 text-gray-400"/>
                  <h3 className="font-medium text-lg mb-2">No past appointments found</h3>
                  <p className="text-gray-500">No appointments match your current search criteria.</p>
                </div>)}
            </tabs_1.TabsContent>
          </tabs_1.Tabs>
        </card_1.CardContent>
      </card_1.Card>
      
      <AppointmentForm_1.default open={isNewAppointmentOpen} onOpenChange={setIsNewAppointmentOpen} onSubmit={handleCreateAppointment}/>
    </div>);
};
exports.default = AppointmentsPage;
