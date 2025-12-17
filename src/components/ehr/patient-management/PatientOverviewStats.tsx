import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, Clock, CheckCircle } from "lucide-react";
import { Patient } from '@/hooks/usePatientManagement';

interface PatientOverviewStatsProps {
  patients: Patient[];
  onViewStatistics: () => void;
}

const PatientOverviewStats: React.FC<PatientOverviewStatsProps> = ({ patients, onViewStatistics }) => {
  const totalPatients = patients.length;
  const newPatients = patients.filter(p => p.status === 'New').length;
  const activePatients = patients.filter(p => p.status === 'Active').length;
  const followUpPatients = patients.filter(p => p.status === 'Follow-up').length;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card className="card-accent-blue hover:shadow-lg transition-all hover:scale-105">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
            <h2 className="text-3xl font-bold text-blue-600">{totalPatients}</h2>
            <p className="text-xs text-muted-foreground mt-1">Registered in system</p>
          </div>
          <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="card-accent-green hover:shadow-lg transition-all hover:scale-105">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Active Patients</p>
            <h2 className="text-3xl font-bold text-green-600">{activePatients}</h2>
            <p className="text-xs text-muted-foreground mt-1">Currently admitted/active</p>
          </div>
          <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="card-accent-purple hover:shadow-lg transition-all hover:scale-105">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">New Registrations</p>
            <h2 className="text-3xl font-bold text-purple-600">{newPatients}</h2>
            <p className="text-xs text-muted-foreground mt-1">Added this month</p>
          </div>
          <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
            <UserPlus className="h-6 w-6 text-purple-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="card-accent-orange hover:shadow-lg transition-all hover:scale-105">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Follow-ups</p>
            <h2 className="text-3xl font-bold text-orange-600">{followUpPatients}</h2>
            <p className="text-xs text-muted-foreground mt-1">Scheduled for return</p>
          </div>
          <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
            <Clock className="h-6 w-6 text-orange-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientOverviewStats;
