
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardStats from '@/components/dashboard/DashboardStats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{currentDate}</span>
          <Clock className="ml-2 h-4 w-4" />
          <span>{new Date().toLocaleTimeString()}</span>
        </div>
      </div>
      
      <Card className="bg-medical-primary/10 border-none">
        <CardContent className="p-6">
          <h2 className="text-xl font-medium text-medical-primary">
            {welcomeMessage}
          </h2>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Overview</h2>
        <DashboardStats userRole={role} />
      </div>

      {/* Recent Activity Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest actions in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((_, index) => (
                <div key={index} className="flex items-center gap-4 border-b border-border pb-4 last:border-0 last:pb-0">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {role === 'doctor' && 'Patient consultation completed'}
                      {role === 'nurse' && 'Vitals recorded'}
                      {role === 'pharmacist' && 'Prescription filled'}
                      {role === 'labtech' && 'Test result uploaded'}
                      {role === 'cashier' && 'Payment processed'}
                      {role === 'ehr' && 'Record updated'}
                      {role === 'admin' && 'System update completed'}
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
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for your role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {role === 'doctor' && (
                <>
                  <button className="medical-card">New Consultation</button>
                  <button className="medical-card">Write Prescription</button>
                  <button className="medical-card">Request Lab Test</button>
                  <button className="medical-card">View Patient History</button>
                </>
              )}
              
              {role === 'nurse' && (
                <>
                  <button className="medical-card">Record Vitals</button>
                  <button className="medical-card">Administer Medication</button>
                  <button className="medical-card">Patient Rounds</button>
                  <button className="medical-card">Update Patient Status</button>
                </>
              )}
              
              {role === 'pharmacist' && (
                <>
                  <button className="medical-card">Fill Prescription</button>
                  <button className="medical-card">Check Inventory</button>
                  <button className="medical-card">Record Sale</button>
                  <button className="medical-card">Order Supplies</button>
                </>
              )}
              
              {role === 'labtech' && (
                <>
                  <button className="medical-card">Process Sample</button>
                  <button className="medical-card">Record Result</button>
                  <button className="medical-card">View Test Queue</button>
                  <button className="medical-card">Inventory Check</button>
                </>
              )}
              
              {role === 'cashier' && (
                <>
                  <button className="medical-card">New Transaction</button>
                  <button className="medical-card">Print Receipt</button>
                  <button className="medical-card">Daily Report</button>
                  <button className="medical-card">Close Register</button>
                </>
              )}
              
              {role === 'ehr' && (
                <>
                  <button className="medical-card">Search Records</button>
                  <button className="medical-card">Add New Patient</button>
                  <button className="medical-card">Update Record</button>
                  <button className="medical-card">Generate Report</button>
                </>
              )}
              
              {role === 'admin' && (
                <>
                  <button className="medical-card">User Management</button>
                  <button className="medical-card">Generate Reports</button>
                  <button className="medical-card">System Settings</button>
                  <button className="medical-card">View Logs</button>
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
