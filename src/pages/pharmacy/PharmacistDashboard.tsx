
import { useState } from 'react';
import { Search, Bell, Package, PlusCircle, AlertTriangle, ShoppingCart, BarChart3, RefreshCw, Eye, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { usePharmacy } from '@/hooks/usePharmacy';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function PharmacistDashboard() {
  const navigate = useNavigate();
  const {
    stats,
    recentPrescriptions,
    recentActivity,
    loading,
    refresh,
    approvePrescription,
    rejectPrescription
  } = usePharmacy();

  const [patientSearchQuery, setPatientSearchQuery] = useState('');

  const handlePatientSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (patientSearchQuery.trim()) {
      navigate(`/pharmacy/dispensary?search=${encodeURIComponent(patientSearchQuery)}`);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'active':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Active</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>;
      case 'dispensed':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Dispensed</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'New Prescription':
        return <PlusCircle size={16} className="text-blue-500" />;
      case 'Approval':
        return <CheckCircle2 size={16} className="text-green-500" />;
      case 'Inventory':
        return <Package size={16} className="text-orange-500" />;
      case 'Alert':
        return <AlertTriangle size={16} className="text-red-500" />;
      default:
        return <Bell size={16} className="text-gray-500" />;
    }
  };

  const formatMedications = (meds: any) => {
    if (!meds) return '-';
    try {
      const parsed = typeof meds === 'string' ? JSON.parse(meds) : meds;
      if (Array.isArray(parsed)) {
        return parsed.map((m: any) => m.name || m).join(', ');
      }
      return String(parsed);
    } catch (error) {
      return String(meds);
    }
  };

  if (loading && recentPrescriptions.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 font-outfit">Pharmacist Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage prescriptions, inventory, and dispensing workflows.</p>
        </div>
        <Button variant="outline" size="sm" onClick={refresh} className="bg-white hover:bg-gray-50">
          <RefreshCw className={loading ? "animate-spin mr-2 h-4 w-4" : "mr-2 h-4 w-4"} />
          Sync Data
        </Button>
      </div>

      {/* Quick Search & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-sm border-gray-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Quick Patient Search</CardTitle>
            <CardDescription>Enter patient MRN or Name to quickly view their prescriptions.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePatientSearch} className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-10 h-11 border-gray-200 focus:ring-primary shadow-none"
                  placeholder="Patient MRN, First Name or Last Name..."
                  value={patientSearchQuery}
                  onChange={(e) => setPatientSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" className="h-11 px-6 shadow-md shadow-primary/20 transition-all hover:translate-y-[-1px]">
                Search
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-100 bg-primary/5 border-primary/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="bg-white h-auto py-4 flex-col gap-2" onClick={() => navigate('/pharmacy/dispensary')}>
              <PlusCircle className="h-5 w-5 text-blue-600" />
              <span className="text-xs">Dispense</span>
            </Button>
            <Button variant="outline" className="bg-white h-auto py-4 flex-col gap-2" onClick={() => navigate('/pharmacy/inventory')}>
              <Package className="h-5 w-5 text-orange-600" />
              <span className="text-xs">Stock Up</span>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Pending Verifications', val: stats.pendingVerifications, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100', accentClass: 'card-accent-orange', onClick: () => navigate('/pharmacy/prescriptions') },
          { label: 'Ready to Dispense', val: stats.readyToDispense, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-100', accentClass: 'card-accent-green', onClick: () => navigate('/pharmacy/dispensary') },
          { label: 'Inventory Alerts', val: stats.inventoryAlerts, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100', accentClass: 'card-accent-red', onClick: () => navigate('/pharmacy/inventory') },
          { label: "Today's Volume", val: stats.totalPrescriptionsToday, icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-100', accentClass: 'card-accent-blue' }
        ].map((s, i) => (
          <Card
            key={i}
            className={`cursor-pointer hover:shadow-lg transition-all hover:scale-105 border-none shadow-sm ${s.accentClass || ''}`}
            onClick={s.onClick}
          >
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{s.label}</p>
                <h3 className={`text-3xl font-bold mt-1 ${s.color}`}>{s.val}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  View details {s.onClick && '→'}
                </p>
              </div>
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${s.bg}`}>
                <s.icon className={`h-6 w-6 ${s.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Prescriptions Table */}
      <Card className="shadow-sm border-gray-100 overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-gray-50 bg-gray-50/30 px-6 py-4">
          <div>
            <CardTitle className="text-lg">Recent Prescriptions</CardTitle>
            <CardDescription>Latest prescriptions awaiting your action.</CardDescription>
          </div>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80" onClick={() => navigate('/pharmacy/prescriptions')}>
            View All
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent bg-gray-50/30">
                  <TableHead className="w-[150px]">Date</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Medications</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPrescriptions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      No recent prescriptions found
                    </TableCell>
                  </TableRow>
                ) : (
                  recentPrescriptions.map((px) => (
                    <TableRow key={px.id} className="hover:bg-gray-50/50">
                      <TableCell className="text-sm">
                        <div className="font-medium">{new Date(px.prescription_date).toLocaleDateString()}</div>
                        <div className="text-xs text-muted-foreground">{new Date(px.prescription_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                            {(px.patient_first_name?.[0] || '') + (px.patient_last_name?.[0] || '')}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{px.patient_first_name} {px.patient_last_name}</div>
                            <div className="text-xs text-muted-foreground">{px.patient_mrn}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-700 max-w-[250px] truncate" title={formatMedications(px.medications)}>
                          {formatMedications(px.medications)}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        Dr. {px.prescriber_last_name}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(px.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          {px.status === 'pending' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => approvePrescription(px.id)}
                                title="Approve"
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => rejectPrescription(px.id)}
                                title="Reject"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-500 hover:text-gray-700"
                            onClick={() => navigate(`/pharmacy/dispensary?id=${px.id}`)}
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Activity and Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between border-b border-gray-50 px-6 py-4">
            <CardTitle className="text-lg">Recent Pharmacy Activity</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">View Log</Button>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No recent activity recorded.</p>
              ) : (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex gap-4 group">
                    <div className="mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm text-gray-800 leading-tight">{activity.activity}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-100">
          <CardHeader className="flex flex-row items-center justify-between border-b border-gray-50 px-6 py-4">
            <CardTitle className="text-lg">Quick Inventory Overview</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80" onClick={() => navigate('/pharmacy/inventory')}>Check Stock</Button>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                    <Package className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Critical Stock Items</p>
                    <p className="text-xs text-muted-foreground">Items below reorder level</p>
                  </div>
                </div>
                <Badge variant="destructive" className="rounded-full px-2">{stats.inventoryAlerts}</Badge>
              </div>

              <div className="p-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50">
                <p className="text-sm text-muted-foreground mb-3 font-medium italic text-center">
                  Dispensed 42 medications this morning. Keep up the great work!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
