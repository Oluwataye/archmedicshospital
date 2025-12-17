import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import * as Pop from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Loader2, Users, Activity, FileText, TestTube, Pill, Calendar, TrendingUp, AlertCircle, Check, ChevronsUpDown } from 'lucide-react';
import { usePatientManagement } from '@/hooks/usePatientManagement';
import { useMedicalRecords } from '@/hooks/useMedicalRecords';
import { useVitalSigns } from '@/hooks/useVitalSigns';
import { useLabResults } from '@/hooks/useLabHooks';
import { usePrescriptions } from '@/hooks/usePrescriptions';
import { useAppointments } from '@/hooks/useAppointments';
import { format, subDays, isAfter } from 'date-fns';

const PatientStatisticsPage = () => {
  const { patients, loading: patientsLoading } = usePatientManagement();
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [openCombobox, setOpenCombobox] = useState(false);

  const { records, loading: recordsLoading } = useMedicalRecords(selectedPatientId);
  const { vitalSigns, loading: vitalsLoading } = useVitalSigns(selectedPatientId);
  const { results: labResults, loading: labsLoading } = useLabResults(selectedPatientId);
  const { prescriptions, loading: rxLoading } = usePrescriptions(selectedPatientId);
  const { appointments, loading: apptLoading } = useAppointments();

  const selectedPatient = patients.find(p => p.id === selectedPatientId);
  const loading = recordsLoading || vitalsLoading || labsLoading || rxLoading || apptLoading;

  // Calculate statistics
  const stats = {
    totalRecords: records.length,
    totalVitals: vitalSigns.length,
    totalLabs: labResults.length,
    totalPrescriptions: prescriptions.length,
    totalAppointments: selectedPatientId
      ? appointments.filter(a => a.patient_id === selectedPatientId).length
      : 0,

    // Recent activity (last 30 days)
    recentRecords: records.filter(r => {
      const recordDate = new Date(r.record_date);
      return isAfter(recordDate, subDays(new Date(), 30));
    }).length,

    recentVitals: vitalSigns.filter(v => {
      const vitalDate = new Date(v.recorded_at);
      return isAfter(vitalDate, subDays(new Date(), 30));
    }).length,

    // Record types breakdown
    progressNotes: records.filter(r => r.record_type === 'progress').length,
    soapNotes: records.filter(r => r.record_type === 'soap').length,
    dischargeNotes: records.filter(r => r.record_type === 'discharge').length,
    imagingStudies: records.filter(r => r.record_type === 'imaging').length,

    // Lab status
    pendingLabs: labResults.filter(l => l.status === 'pending').length,
    completedLabs: labResults.filter(l => l.status === 'completed').length,
    abnormalLabs: labResults.filter(l => l.abnormal_flag && l.abnormal_flag !== 'normal').length,

    // Prescription status
    activePrescriptions: prescriptions.filter(rx => rx.status === 'active').length,
    completedPrescriptions: prescriptions.filter(rx => rx.status === 'completed').length,

    // Appointment status
    upcomingAppointments: selectedPatientId
      ? appointments.filter(a =>
        a.patient_id === selectedPatientId &&
        (a.status === 'scheduled' || a.status === 'confirmed')
      ).length
      : 0,
  };

  // Overall patient statistics (all patients)
  const overallStats = {
    totalPatients: patients.length,
    activePatients: patients.filter(p => p.status === 'active').length,
    newPatients: patients.filter(p => {
      const createdDate = new Date(p.created_at || '');
      return isAfter(createdDate, subDays(new Date(), 30));
    }).length,
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue' }: any) => (
    <Card className={`card-accent-${color} hover:shadow-lg transition-all hover:scale-105`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h2 className={`text-3xl font-bold text-${color}-600`}>{value}</h2>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          <div className={`h-12 w-12 bg-${color}-100 rounded-full flex items-center justify-center`}>
            <Icon className={`h-6 w-6 text-${color}-600`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Patient Analytics & Statistics</h1>
        <div className="text-sm text-gray-500 flex items-center mt-1">
          <span>Health Records</span>
          <span className="mx-2">›</span>
          <span className="text-blue-500">Analytics</span>
        </div>
      </div>

      {/* Overall Statistics */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Overall Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            icon={Users}
            title="Total Patients"
            value={overallStats.totalPatients}
            subtitle="In the system"
            color="blue"
          />
          <StatCard
            icon={Activity}
            title="Active Patients"
            value={overallStats.activePatients}
            subtitle="Currently active"
            color="green"
          />
          <StatCard
            icon={TrendingUp}
            title="New Patients"
            value={overallStats.newPatients}
            subtitle="Last 30 days"
            color="purple"
          />
        </div>
      </div>

      {/* Patient Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Patient for Detailed Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <Pop.Popover open={openCombobox} onOpenChange={setOpenCombobox}>
              <Pop.PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCombobox}
                  className="w-full justify-between"
                >
                  {selectedPatientId
                    ? patients.find((patient) => String(patient.id) === selectedPatientId)
                      ? `${patients.find((patient) => String(patient.id) === selectedPatientId)?.first_name} ${patients.find((patient) => String(patient.id) === selectedPatientId)?.last_name} - ${patients.find((patient) => String(patient.id) === selectedPatientId)?.mrn}`
                      : "Select patient..."
                    : "Select patient..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </Pop.PopoverTrigger>
              <Pop.PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput placeholder="Search patient by name or MRN..." />
                  <CommandEmpty>No patient found.</CommandEmpty>
                  <CommandGroup>
                    <CommandList>
                      {patients.map((patient) => (
                        <CommandItem
                          key={patient.id}
                          value={`${patient.first_name} ${patient.last_name} ${patient.mrn}`}
                          onSelect={() => {
                            setSelectedPatientId(String(patient.id) === selectedPatientId ? "" : String(patient.id));
                            setOpenCombobox(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedPatientId === String(patient.id) ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div className="flex flex-col">
                            <span>{patient.first_name} {patient.last_name}</span>
                            <span className="text-xs text-muted-foreground">MRN: {patient.mrn}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandList>
                  </CommandGroup>
                </Command>
              </Pop.PopoverContent>
            </Pop.Popover>

            {selectedPatient && (
              <div className="p-4 bg-blue-50 rounded-lg animate-in fade-in-0">
                <h3 className="font-semibold text-blue-900">
                  {selectedPatient.first_name} {selectedPatient.last_name}
                </h3>
                <p className="text-sm text-blue-700">MRN: {selectedPatient.mrn}</p>
                <p className="text-sm text-blue-700">
                  DOB: {format(new Date(selectedPatient.date_of_birth), 'MMM dd, yyyy')}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Patient-Specific Statistics */}
      {selectedPatientId && (
        <>
          {loading ? (
            <div className="flex items-center justify-center p-10">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <span className="ml-2">Loading patient statistics...</span>
            </div>
          ) : (
            <>
              {/* Overview Stats */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Patient Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <StatCard
                    icon={FileText}
                    title="Medical Records"
                    value={stats.totalRecords}
                    subtitle={`${stats.recentRecords} in last 30 days`}
                    color="blue"
                  />
                  <StatCard
                    icon={Activity}
                    title="Vital Signs"
                    value={stats.totalVitals}
                    subtitle={`${stats.recentVitals} recent readings`}
                    color="green"
                  />
                  <StatCard
                    icon={TestTube}
                    title="Lab Results"
                    value={stats.totalLabs}
                    subtitle={`${stats.pendingLabs} pending`}
                    color="purple"
                  />
                  <StatCard
                    icon={Pill}
                    title="Prescriptions"
                    value={stats.totalPrescriptions}
                    subtitle={`${stats.activePrescriptions} active`}
                    color="orange"
                  />
                  <StatCard
                    icon={Calendar}
                    title="Appointments"
                    value={stats.totalAppointments}
                    subtitle={`${stats.upcomingAppointments} upcoming`}
                    color="indigo"
                  />
                  {stats.abnormalLabs > 0 && (
                    <StatCard
                      icon={AlertCircle}
                      title="Abnormal Labs"
                      value={stats.abnormalLabs}
                      subtitle="Requires attention"
                      color="red"
                    />
                  )}
                </div>
              </div>

              {/* Clinical Documentation Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Clinical Documentation Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{stats.progressNotes}</p>
                      <p className="text-sm text-gray-600 mt-1">Progress Notes</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{stats.soapNotes}</p>
                      <p className="text-sm text-gray-600 mt-1">SOAP Notes</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{stats.dischargeNotes}</p>
                      <p className="text-sm text-gray-600 mt-1">Discharge Notes</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">{stats.imagingStudies}</p>
                      <p className="text-sm text-gray-600 mt-1">Imaging Studies</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Lab & Medication Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Lab Results Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Completed</span>
                        <span className="font-semibold text-green-600">{stats.completedLabs}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Pending</span>
                        <span className="font-semibold text-yellow-600">{stats.pendingLabs}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Abnormal</span>
                        <span className="font-semibold text-red-600">{stats.abnormalLabs}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Medication Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Active</span>
                        <span className="font-semibold text-green-600">{stats.activePrescriptions}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Completed</span>
                        <span className="font-semibold text-gray-600">{stats.completedPrescriptions}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total</span>
                        <span className="font-semibold text-blue-600">{stats.totalPrescriptions}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default PatientStatisticsPage;
