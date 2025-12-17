import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Activity, Pill, AlertTriangle, Clock, TrendingUp } from 'lucide-react';

export default function NurseDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 p-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nurse Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} • Day Shift (7:00 AM - 7:00 PM)
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card
          className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 card-accent-blue"
          onClick={() => navigate('/nurse/patients')}
        >
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
              <h2 className="text-3xl font-bold text-blue-600">25</h2>
              <p className="text-xs text-muted-foreground mt-1">View patients →</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 card-accent-purple"
          onClick={() => navigate('/nurse/patients?status=critical')}
        >
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Critical Alerts</p>
              <h2 className="text-3xl font-bold text-red-600">5</h2>
              <p className="text-xs text-muted-foreground mt-1">View alerts ↓</p>
            </div>
            <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 card-accent-green"
          onClick={() => navigate('/nurse/vitals')}
        >
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Vitals Due</p>
              <h2 className="text-3xl font-bold text-green-600">12</h2>
              <p className="text-xs text-muted-foreground mt-1">View vitals →</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 card-accent-orange"
          onClick={() => navigate('/nurse/medications')}
        >
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Medications Due</p>
              <h2 className="text-3xl font-bold text-yellow-600">8</h2>
              <p className="text-xs text-muted-foreground mt-1">View medications →</p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Pill className="h-6 w-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Shift Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Shift Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm">Stable</span>
                </div>
                <span className="text-sm font-medium">12 patients</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <span className="text-sm">Critical</span>
                </div>
                <span className="text-sm font-medium">5 patients</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">Recovering</span>
                </div>
                <span className="text-sm font-medium">8 patients</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Critical Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Critical Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200 cursor-pointer hover:bg-red-100 transition-colors" onClick={() => navigate('/nurse/patients/P-10542')}>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium text-red-700">Code Blue - Room 312</span>
              </div>
              <span className="text-xs text-red-600">2m ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200 cursor-pointer hover:bg-yellow-100 transition-colors" onClick={() => navigate('/nurse/patients/P-10542')}>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium text-yellow-700">Low BP - P-10542</span>
              </div>
              <span className="text-xs text-yellow-600">15m ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200 cursor-pointer hover:bg-green-100 transition-colors" onClick={() => navigate('/nurse/patients/P-10476')}>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-green-700">Med Verification - P-10476</span>
              </div>
              <span className="text-xs text-green-600">21m ago</span>
            </div>
          </CardContent>
        </Card>

        {/* Today's Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="cursor-pointer hover:bg-accent/5 p-2 rounded-md transition-colors" onClick={() => navigate('/nurse/medications')}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Medication Administration</span>
                <span className="text-sm text-muted-foreground">70%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
            <div className="cursor-pointer hover:bg-accent/5 p-2 rounded-md transition-colors" onClick={() => navigate('/nurse/vitals')}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Vital Signs Recording</span>
                <span className="text-sm text-muted-foreground">80%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
            <div className="cursor-pointer hover:bg-accent/5 p-2 rounded-md transition-colors" onClick={() => navigate('/nurse/patients')}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Patient Assessments</span>
                <span className="text-sm text-muted-foreground">50%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '50%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Medications */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Medications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-muted rounded-lg border">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-sm">Amoxicillin 500mg</h4>
                <Button size="sm" variant="default" onClick={() => navigate('/nurse/medications')}>Give</Button>
              </div>
              <p className="text-xs text-muted-foreground">Patient: Alice Johnson (P-10542) • Room 204</p>
              <p className="text-xs text-muted-foreground">Due in: 15 minutes</p>
            </div>
            <div className="p-3 bg-muted rounded-lg border">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-sm">Insulin Regular 10 units</h4>
                <Button size="sm" variant="default" onClick={() => navigate('/nurse/medications')}>Give</Button>
              </div>
              <p className="text-xs text-muted-foreground">Patient: Robert Brown (P-10398) • Room 210</p>
              <p className="text-xs text-muted-foreground">Due in: 30 minutes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admitted Patients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Admitted Patients Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium">Patient Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Room</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Diagnosis</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Next Assessment</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">
                        AJ
                      </div>
                      <div>
                        <p className="text-sm font-medium">Alice Johnson</p>
                        <p className="text-xs text-muted-foreground">ID: P-10542</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">204</td>
                  <td className="py-3 px-4 text-sm">Stroke</td>
                  <td className="py-3 px-4">
                    <Badge variant="destructive">Critical</Badge>
                  </td>
                  <td className="py-3 px-4 text-sm">10:30 AM</td>
                  <td className="py-3 px-4">
                    <Button size="sm" variant="outline" onClick={() => navigate('/nurse/patients/P-10542')}>View</Button>
                  </td>
                </tr>
                <tr className="hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
                        RB
                      </div>
                      <div>
                        <p className="text-sm font-medium">Robert Brown</p>
                        <p className="text-xs text-muted-foreground">ID: P-10398</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">210</td>
                  <td className="py-3 px-4 text-sm">Diabetes</td>
                  <td className="py-3 px-4">
                    <Badge variant="secondary" className="bg-green-100 text-green-700">Stable</Badge>
                  </td>
                  <td className="py-3 px-4 text-sm">11:15 AM</td>
                  <td className="py-3 px-4">
                    <Button size="sm" variant="outline" onClick={() => navigate('/nurse/patients/P-10398')}>View</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
