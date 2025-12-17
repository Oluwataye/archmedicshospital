import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, CreditCard, FileText, RefreshCw, DollarSign, TrendingUp, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import ApiService from '@/services/apiService';
import claimsService from '@/services/claimsService';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ReceiptModal from '@/components/cashier/ReceiptModal';
import CashierHistory from '../../components/cashier/CashierHistory';
import PaymentWorkspace from '@/components/cashier/PaymentWorkspace';
import { ServiceSearchCombobox } from '@/components/common/ServiceSearchCombobox';

const CashierDashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('New Payment');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todayRevenue: 0,
    pendingPayments: 0,
    hmoClaims: 0,
    refundRequests: 0
  });


  // Handle URL tab parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      if (tabParam.toLowerCase() === 'pending') setActiveTab('Pending');
      else if (tabParam.toLowerCase() === 'daily-close') setActiveTab('Daily Close');
      else if (tabParam.toLowerCase() === 'new-payment') setActiveTab('New Payment');
      else if (tabParam.toLowerCase() === 'history') setActiveTab('History');
    }
  }, [searchParams]);


  const [selectedPatientId, setSelectedPatientId] = useState<string | undefined>(undefined);
  const [financialReport, setFinancialReport] = useState<any>(null);
  const [pendingInvoices, setPendingInvoices] = useState<any[]>([]);

  // Date formatting for current date and time
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  // Fetch real-time stats
  const fetchStats = async () => {
    try {
      setLoading(true);
      // Calculate local date string (YYYY-MM-DD) to ensure server queries correct day in local time
      const localDate = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0];
      const [paymentStats, pendingInvoicesList, pendingRegistrations, claimsStats, refunds, dailyReport] = await Promise.all([
        ApiService.getPaymentStatistics(),
        ApiService.getInvoices({ status: 'pending' }),
        ApiService.getPatients({ status: 'pending_payment' }), // Fetch pending registrations
        claimsService.getClaimsStatistics(),
        ApiService.getRefunds({ status: 'pending' }),
        ApiService.getFinancialReports('daily-sales', { date: localDate })
      ]);


      if (dailyReport && dailyReport.summary) {
        setFinancialReport(dailyReport.summary);
      }

      // Format Pending Registrations to match Invoice structure for display
      const formattedRegistrations = (Array.isArray(pendingRegistrations?.data) ? pendingRegistrations.data : []).map((p: any) => ({
        id: `REG - ${p.id} `,
        invoice_number: 'REGISTRATION',
        created_at: p.created_at,
        patient_name: `${p.first_name} ${p.last_name} `,
        patient_mrn: p.mrn, // MRN might be temp or actual depending on logic
        patient_id: p.id,
        total_amount: 1000, // Default Reg Fee - visual only, actual comes from billing check
        type: 'Registration'
      }));

      // Combine invoices and registrations
      const allPendingItems = [...formattedRegistrations, ...pendingInvoicesList.map((inv: any) => ({ ...inv, type: 'Invoice' }))];

      // Sort by date desc
      allPendingItems.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setPendingInvoices(allPendingItems);

      setStats({
        todayRevenue: paymentStats.todayRevenue || 0,
        pendingPayments: allPendingItems.length || 0,
        hmoClaims: claimsStats.pending_claims || 0,
        refundRequests: refunds.length || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Update URL without navigation to keep state
    const newParams = new URLSearchParams(searchParams);
    if (tab === 'New Payment') newParams.delete('tab');
    else newParams.set('tab', tab.replace("'", "").replace(" ", "-").toLowerCase());
    setSearchParams(newParams);
  };

  // Stats data






  if (loading) {
    return <LoadingSpinner fullScreen text="Loading dashboard..." />;
  }

  return (
    <div className="animate-in fade-in duration-500">
      {/* Breadcrumbs */}
      <div className="text-muted-foreground text-sm mb-4">Cashier &gt; Dashboard</div>

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cashier Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage payments, billing, and financial transactions</p>
        </div>
        <div className="text-sm text-muted-foreground">
          {currentDate} - {currentTime}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card
          className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 card-accent-green"
          onClick={() => navigate('/cashier/reports')}
        >
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Today's Revenue</p>
              <h2 className="text-3xl font-bold text-green-600">₦{stats.todayRevenue.toLocaleString()}</h2>
              <p className="text-xs text-muted-foreground mt-1">View reports →</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 card-accent-blue"
          onClick={() => setActiveTab('Pending')}
        >
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Payments</p>
              <h2 className="text-3xl font-bold text-blue-600">{stats.pendingPayments}</h2>
              <p className="text-xs text-muted-foreground mt-1">Awaiting processing</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 card-accent-purple"
          onClick={() => navigate('/cashier/claims')}
        >
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">HMO Claims</p>
              <h2 className="text-3xl font-bold text-purple-600">{stats.hmoClaims}</h2>
              <p className="text-xs text-muted-foreground mt-1">Pending approval</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 card-accent-red"
          onClick={() => navigate('/cashier/refunds')}
        >
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Refund Requests</p>
              <h2 className="text-3xl font-bold text-red-600">{stats.refundRequests}</h2>
              <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
            </div>
            <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Panel */}
      <Card className="mb-6">
        {/* Quick Actions Tabs */}
        <div className="flex border-b border-border">
          <button
            className={`px-4 py-3 font-semibold transition-colors ${activeTab === 'New Payment' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => handleTabChange('New Payment')}
          >
            New Payment
          </button>
          <button
            className={`px-4 py-3 font-semibold transition-colors ${activeTab === 'Pending' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => handleTabChange('Pending')}
          >
            Pending
          </button>
          <button
            className={`px-4 py-3 font-semibold transition-colors ${activeTab === 'History' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => handleTabChange('History')}
          >
            History
          </button>
          <button
            className={`px-4 py-3 font-semibold transition-colors ${activeTab === "Today's Summary" ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => handleTabChange("Today's Summary")}
          >
            Today's Summary
          </button>
          <button
            className={`px - 4 py - 3 font - semibold transition - colors ${activeTab === 'Daily Close' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'} `}
            onClick={() => handleTabChange('Daily Close')}
          >
            Daily Close
          </button>
          <button
            className={`px - 4 py - 3 font - semibold transition - colors ${activeTab === 'Help' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'} `}
            onClick={() => handleTabChange('Help')}
          >
            Help
          </button>
        </div>

        <CardContent className="p-6">
          {activeTab === 'History' && <CashierHistory />}
          {activeTab === 'New Payment' && (
            <PaymentWorkspace
              initialPatientId={selectedPatientId}
              onPaymentComplete={() => {
                fetchStats();
                setSelectedPatientId(undefined); // Reset selection
              }}
            />
          )}



          {
            activeTab === 'Today\'s Summary' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Cash Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">₦{financialReport?.cash_total?.toLocaleString() || '0'}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">POS / Card Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">₦{financialReport?.card_total?.toLocaleString() || '0'}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Transfer Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">₦{financialReport?.transfer_total?.toLocaleString() || '0'}</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="rounded-md border p-4 bg-muted/50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Total Transactions</span>
                    <span className="font-bold">{financialReport?.total_transactions || 0}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-bold">Total Revenue</span>
                    <span className="font-bold text-green-600">₦{financialReport?.total_revenue?.toLocaleString() || '0'}</span>
                  </div>
                </div>
              </div>
            )
          }

          {
            activeTab === 'Daily Close' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-muted/50 p-4 rounded-lg">
                  <h3 className="text-xl font-bold">Daily Close Summary</h3>
                  <div className="text-sm text-muted-foreground">Date: {currentDate}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Revenue Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between border-b pb-2">
                        <span>Cash</span>
                        <span className="font-bold">₦{financialReport?.cash_total?.toLocaleString() || '0'}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span>Card / POS</span>
                        <span className="font-bold">₦{financialReport?.card_total?.toLocaleString() || '0'}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span>Bank Transfer</span>
                        <span className="font-bold">₦{financialReport?.transfer_total?.toLocaleString() || '0'}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span>HMO (To Claim)</span>
                        <span className="font-bold">₦{financialReport?.hmo_total?.toLocaleString() || '0'}</span>
                      </div>
                      <div className="flex justify-between pt-2">
                        <span className="font-bold text-lg">Total Revenue</span>
                        <span className="font-bold text-lg text-primary">₦{financialReport?.total_revenue?.toLocaleString() || '0'}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Transaction Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between border-b pb-2">
                        <span>Total Transactions</span>
                        <span className="font-bold">{financialReport?.total_transactions || 0}</span>
                      </div>

                      <div className="bg-amber-50 border border-amber-200 p-4 rounded-md mt-6">
                        <div className="flex items-center gap-2 mb-2 text-amber-800">
                          <AlertCircle className="h-4 w-4" />
                          <span className="font-bold">Reconciliation Action</span>
                        </div>
                        <p className="text-sm text-amber-700">
                          Please verify physical cash matches the cash revenue amount: <strong>₦{financialReport?.cash_total?.toLocaleString() || '0'}</strong>.
                        </p>
                      </div>

                      <Button className="w-full mt-4" variant="outline" onClick={() => window.print()}>
                        <FileText className="mr-2 h-4 w-4" /> Print Daily Report
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )
          }

          {
            activeTab === 'Pending' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">Pending Invoices</h3>
                  <Button variant="outline" size="sm" onClick={fetchStats}>
                    <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                  </Button>
                </div>

                {loading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : pendingInvoices.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-muted/50">
                          <tr className="border-b">
                            <th className="p-4 font-medium">Type</th>
                            <th className="p-4 font-medium">Ref #</th>
                            <th className="p-4 font-medium">Date</th>
                            <th className="p-4 font-medium">Patient</th>
                            <th className="p-4 font-medium">Amount</th>
                            <th className="p-4 font-medium text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {pendingInvoices.map((item: any) => (
                            <tr key={item.id} className="hover:bg-muted/5">
                              <td className="p-4">
                                <span className={`text-xs px-2 py-1 rounded-full ${item.type === 'Registration' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                                  {item.type}
                                </span>
                              </td>
                              <td className="p-4 font-medium">{item.invoice_number}</td>
                              <td className="p-4 text-muted-foreground">{new Date(item.created_at).toLocaleDateString()}</td>
                              <td className="p-4">{item.patient_name || item.patient_id}</td>
                              <td className="p-4 font-bold max-w-xs truncate">
                                {item.type === 'Registration' ? 'TBD' : `₦${Number(item.net_amount || item.total_amount).toLocaleString()} `}
                              </td>
                              <td className="p-4 text-right">
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setSelectedPatientId(item.patient_id);
                                    setActiveTab('New Payment');
                                  }}
                                >
                                  Process
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 border rounded-md bg-muted/10">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                    <h3 className="text-lg font-medium">All Caught Up!</h3>
                    <p className="text-muted-foreground">No pending payments found.</p>
                  </div>
                )}
              </div>
            )
          }

          {
            activeTab === 'Help' && (
              <div className="flex items-center justify-center p-8 text-muted-foreground">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Help Center</h3>
                  <p>Contact support or view the cashier manual for assistance.</p>
                </div>
              </div>
            )
          }
        </CardContent >
      </Card >


    </div >
  );
};

export default CashierDashboard;
