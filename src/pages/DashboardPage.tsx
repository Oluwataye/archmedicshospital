import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardStats from '@/components/dashboard/DashboardStats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Clock,
  Plus,
  FileText,
  Search,
  UserPlus,
  Stethoscope,
  Pill,
  TestTube,
  CreditCard,
  Settings,
  FileBarChart,
  Activity
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const role = user?.role || 'admin';
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Role-specific welcome messages
  const welcomeMessages = {
    admin: "Welcome to the administration dashboard. Monitor hospital-wide metrics and manage operations.",
    doctor: "Welcome, Doctor. View your appointments and patient information for today.",
    nurse: "Welcome to the Nurse dashboard. Check patients requiring attention and your daily tasks.",
    pharmacist: "Welcome to the Pharmacy dashboard. Manage prescriptions and inventory.",
    labtech: "Welcome to the Lab dashboard. Manage test requests and results.",
    cashier: "Welcome to the Billing dashboard. Process payments and view financial metrics.",
    ehr: "Welcome to the Records dashboard. Manage patient records and documentation."
  };

  const welcomeMessage = welcomeMessages[role as keyof typeof welcomeMessages] || welcomeMessages.admin;

  const QuickActionButton = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick?: () => void }) => (
    <Button
      variant="outline"
      className="h-auto flex-col items-center justify-center p-4 gap-2 hover:bg-primary/5 hover:text-primary transition-all"
      onClick={onClick}
    >
      <Icon className="h-6 w-6" />
      <span className="font-medium">{label}</span>
    </Button>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            {welcomeMessage}
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm bg-muted/50 px-3 py-1 rounded-full border">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span>{currentDate}</span>
          <span className="text-muted-foreground">|</span>
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      <div className="space-y-4">
        <DashboardStats userRole={role} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest actions in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[1, 2, 3, 4].map((_, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {role === 'doctor' && 'Completed consultation with Patient #1234'}
                      {role === 'nurse' && 'Recorded vitals for John Doe'}
                      {role === 'pharmacist' && 'Dispensed prescription #RX-998'}
                      {role === 'labtech' && 'Uploaded hematology results'}
                      {role === 'cashier' && 'Processed payment for Invoice #INV-001'}
                      {role === 'ehr' && 'Updated medical history for Sarah Smith'}
                      {role === 'admin' && 'System backup completed successfully'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {index === 0 ? '10 minutes ago' :
                        index === 1 ? '1 hour ago' :
                          index === 2 ? '3 hours ago' : 'Yesterday'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Role-specific quick actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common tasks for your role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {role === 'doctor' && (
                <>
                  <QuickActionButton icon={Stethoscope} label="New Consultation" />
                  <QuickActionButton icon={Pill} label="Write Prescription" />
                  <QuickActionButton icon={TestTube} label="Request Lab Test" />
                  <QuickActionButton icon={FileText} label="Patient History" />
                </>
              )}

              {role === 'nurse' && (
                <>
                  <QuickActionButton icon={Activity} label="Record Vitals" />
                  <QuickActionButton icon={Pill} label="Administer Meds" />
                  <QuickActionButton icon={UserPlus} label="Admit Patient" />
                  <QuickActionButton icon={FileText} label="Update Status" />
                </>
              )}

              {role === 'pharmacist' && (
                <>
                  <QuickActionButton icon={Pill} label="Fill Prescription" />
                  <QuickActionButton icon={Search} label="Check Inventory" />
                  <QuickActionButton icon={CreditCard} label="Record Sale" />
                  <QuickActionButton icon={FileText} label="Order Supplies" />
                </>
              )}

              {role === 'labtech' && (
                <>
                  <QuickActionButton icon={TestTube} label="Process Sample" />
                  <QuickActionButton icon={FileText} label="Record Result" />
                  <QuickActionButton icon={Search} label="View Queue" />
                  <QuickActionButton icon={FileBarChart} label="Inventory" />
                </>
              )}

              {role === 'cashier' && (
                <>
                  <QuickActionButton icon={CreditCard} label="New Transaction" />
                  <QuickActionButton icon={FileText} label="Print Receipt" />
                  <QuickActionButton icon={FileBarChart} label="Daily Report" />
                  <QuickActionButton icon={Settings} label="Close Register" />
                </>
              )}

              {role === 'ehr' && (
                <>
                  <QuickActionButton icon={Search} label="Search Records" />
                  <QuickActionButton icon={UserPlus} label="New Patient" />
                  <QuickActionButton icon={FileText} label="Update Record" />
                  <QuickActionButton icon={FileBarChart} label="Generate Report" />
                </>
              )}

              {role === 'admin' && (
                <>
                  <QuickActionButton icon={UserPlus} label="User Management" />
                  <QuickActionButton icon={FileBarChart} label="Reports" />
                  <QuickActionButton icon={Settings} label="Settings" />
                  <QuickActionButton icon={Activity} label="View Logs" />
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
