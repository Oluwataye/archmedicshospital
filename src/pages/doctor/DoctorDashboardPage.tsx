import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import {
  Search,
  ChevronRight,
  Calendar,
  Clock,
  User,
  Activity
} from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import { useAppointments } from '@/hooks/useAppointments';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format, isToday, parseISO, differenceInYears } from 'date-fns';
import { getBPStatus, getHRStatus, getTempStatus, getO2Status, getVitalTextColor } from '@/utils/vitalSignsUtils';
import { cn } from '@/lib/utils';

const DoctorDashboardPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { appointments, loading, loadAppointments } = useAppointments();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showUrgentOnly, setShowUrgentOnly] = useState(false);

  useEffect(() => {
    loadAppointments();
  }, []);

  // Filter appointments for today
  const todayAppointments = appointments.filter(apt => {
    try {
      return isToday(parseISO(apt.appointment_date));
    } catch (e) {
      return false;
    }
  });

  // Filter by search query and urgent filter
  const filteredAppointments = todayAppointments.filter(apt => {
    const matchesSearch = (apt.patient_first_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (apt.patient_last_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (apt.id || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesUrgent = !showUrgentOnly || apt.type === 'emergency' || apt.type === 'urgent';

    return matchesSearch && matchesUrgent;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats calculations
  const stats = {
    inQueue: todayAppointments.filter(a => a.status === 'scheduled' || a.status === 'checked-in').length,
    seenToday: todayAppointments.filter(a => a.status === 'completed').length,
    urgentCases: todayAppointments.filter(a => a.type === 'emergency' || a.type === 'urgent').length,
    upcoming: todayAppointments.filter(a => a.status === 'scheduled').length
  };

  const scrollToQueue = () => {
    const queueSection = document.getElementById('patient-queue');
    if (queueSection) {
      queueSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setShowUrgentOnly(false);
  };

  const scrollToUrgent = () => {
    const queueSection = document.getElementById('patient-queue');
    if (queueSection) {
      queueSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setShowUrgentOnly(true);
  };

  const handleStartConsult = (patientId: string) => {
    navigate('/doctor/medical-records', {
      state: {
        patientId,
        action: 'create_note'
      }
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled': return 'secondary';
      case 'checked-in': return 'default';
      case 'in-progress': return 'default';
      case 'completed': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Doctor Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, Dr. {localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).firstName : 'User'}</p>
        </div>
        <div className="text-right text-sm text-muted-foreground">
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card
          className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 card-accent-blue"
          onClick={scrollToQueue}
        >
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Patients in Queue</p>
              <h2 className="text-3xl font-bold text-blue-600">{stats.inQueue}</h2>
              <p className="text-xs text-muted-foreground mt-1">View queue below ↓</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 card-accent-green"
          onClick={() => navigate('/doctor/patients')}
        >
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Patients Seen Today</p>
              <h2 className="text-3xl font-bold text-green-600">{stats.seenToday}</h2>
              <p className="text-xs text-muted-foreground mt-1">View patients →</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 card-accent-purple"
          onClick={scrollToUrgent}
        >
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Urgent Cases</p>
              <h2 className="text-3xl font-bold text-red-600">{stats.urgentCases}</h2>
              <p className="text-xs text-muted-foreground mt-1">View urgent below ↓</p>
            </div>
            <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
              <Activity className="h-6 w-6 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 card-accent-orange"
          onClick={() => navigate('/doctor/appointments?filter=upcoming')}
        >
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
              <h2 className="text-3xl font-bold text-yellow-600">{stats.upcoming}</h2>
              <p className="text-xs text-muted-foreground mt-1">View schedule →</p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Patient Queue */}
      <Card className="mb-6" id="patient-queue">
        <div className="p-6 flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Patient Queue (Today)</h2>
            {showUrgentOnly && (
              <Badge variant="destructive" className="mt-2">Showing Urgent Cases Only</Badge>
            )}
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full md:w-64 pl-10 pr-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Search patients..."
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Patient Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">MRN</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Age/Gender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Last Visit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedAppointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No appointments found for today.
                  </td>
                </tr>
              ) : (
                paginatedAppointments.map((apt) => {
                  const isUrgent = apt.type === 'emergency' || apt.type === 'urgent';
                  const age = apt.patient_dob ? differenceInYears(new Date(), parseISO(apt.patient_dob)) : 'N/A';
                  const gender = apt.patient_gender ? apt.patient_gender.charAt(0).toUpperCase() + apt.patient_gender.slice(1) : 'N/A';
                  const lastVisit = apt.last_visit ? format(parseISO(apt.last_visit), 'MMM d, yyyy') : 'First Visit';

                  return (
                    <tr
                      key={apt.id}
                      className={`hover:bg-gray-50 transition-colors ${isUrgent ? 'bg-red-50 border-l-4 border-l-red-500' : ''}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold mr-3 ${isUrgent ? 'bg-red-100 text-red-600' : 'bg-primary/10 text-primary'}`}>
                            {apt.patient_first_name?.[0]}{apt.patient_last_name?.[0]}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                              {apt.patient_first_name} {apt.patient_last_name}
                              {isUrgent && (
                                <Badge variant="destructive" className="text-xs">URGENT</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {apt.patient_mrn || apt.patient_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {age !== 'N/A' ? `${age} yrs` : 'N/A'} / {gender}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {lastVisit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {apt.appointment_time}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          size="sm"
                          onClick={() => handleStartConsult(apt.patient_id)}
                          disabled={apt.status === 'completed' || apt.status === 'cancelled'}
                        >
                          Start Consult
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 flex items-center justify-between border-t">
            <span className="text-muted-foreground text-sm">
              Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredAppointments.length)} of {filteredAppointments.length} patients
            </span>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={currentPage === page}
                      onClick={() => setCurrentPage(page)}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DoctorDashboardPage;
