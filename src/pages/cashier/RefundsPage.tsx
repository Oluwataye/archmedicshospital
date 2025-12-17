import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import ApiService from '@/services/apiService';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface Refund {
  id: number;
  patient_first_name: string;
  patient_last_name: string;
  patient_mrn: string;
  payment_amount: number;
  amount: number;
  reason: string;
  status: string;
  payment_method: string;
  reference_number: string;
  created_at: string;
  refund_date?: string;
  approver_first_name?: string;
  approver_last_name?: string;
}

const RefundsPage = () => {
  const navigate = useNavigate();
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRefund, setSelectedRefund] = useState<Refund | null>(null);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');

  useEffect(() => {
    fetchRefunds();
  }, [statusFilter]);

  const fetchRefunds = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (statusFilter !== 'all') filters.status = statusFilter;

      const data = await ApiService.getRefunds(filters);
      setRefunds(data);
    } catch (error) {
      console.error('Error fetching refunds:', error);
      toast.error('Failed to load refunds');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'rejected':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const filteredRefunds = refunds.filter(refund => {
    const searchLower = searchQuery.toLowerCase();
    return (
      refund.patient_first_name?.toLowerCase().includes(searchLower) ||
      refund.patient_last_name?.toLowerCase().includes(searchLower) ||
      refund.patient_mrn?.toLowerCase().includes(searchLower) ||
      refund.reference_number?.toLowerCase().includes(searchLower)
    );
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleApproveRefund = async () => {
    if (!selectedRefund) return;

    try {
      if (actionType === 'approve') {
        await ApiService.approveRefund(selectedRefund.id);
        toast.success('Refund approved successfully');
      } else {
        await ApiService.rejectRefund(selectedRefund.id);
        toast.success('Refund rejected');
      }

      setShowApprovalDialog(false);
      setSelectedRefund(null);
      fetchRefunds();
    } catch (error) {
      console.error('Error processing refund:', error);
      toast.error(`Failed to ${actionType} refund`);
    }
  };

  const openApprovalDialog = (refund: Refund, action: 'approve' | 'reject') => {
    setSelectedRefund(refund);
    setActionType(action);
    setShowApprovalDialog(true);
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading refunds..." />;
  }

  return (
    <div className="animate-in fade-in duration-500">
      {/* Breadcrumbs */}
      <div className="text-muted-foreground text-sm mb-4">
        Cashier &gt; Refunds
      </div>

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Refund Management</h1>
          <p className="text-muted-foreground mt-1">Process and approve refund requests</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/cashier')}>
          Back to Dashboard
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="card-accent-orange hover:shadow-lg transition-all hover:scale-105">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending</p>
              <h2 className="text-3xl font-bold text-yellow-600">
                {refunds.filter(r => r.status === 'pending').length}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">Awaiting action</p>
            </div>
            <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-accent-green hover:shadow-lg transition-all hover:scale-105">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Approved</p>
              <h2 className="text-3xl font-bold text-green-600">
                {refunds.filter(r => r.status === 'approved').length}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">Processed refunds</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-accent-red hover:shadow-lg transition-all hover:scale-105">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Rejected</p>
              <h2 className="text-3xl font-bold text-red-600">
                {refunds.filter(r => r.status === 'rejected').length}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">Denied requests</p>
            </div>
            <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-accent-blue hover:shadow-lg transition-all hover:scale-105">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Processed</p>
              <h2 className="text-3xl font-bold text-blue-600">
                {formatCurrency(
                  refunds
                    .filter(r => r.status === 'approved')
                    .reduce((sum, r) => sum + r.amount, 0)
                )}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">Total approved amount</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search refunds..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Refunds Table */}
      <Card>
        <CardHeader>
          <CardTitle>Refund Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>MRN</TableHead>
                  <TableHead>Payment Amount</TableHead>
                  <TableHead>Refund Amount</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRefunds.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No refund requests found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRefunds.map((refund) => (
                    <TableRow key={refund.id} className="hover:bg-muted/50">
                      <TableCell>{formatDate(refund.created_at)}</TableCell>
                      <TableCell>
                        {refund.patient_first_name} {refund.patient_last_name}
                      </TableCell>
                      <TableCell>{refund.patient_mrn}</TableCell>
                      <TableCell>{formatCurrency(refund.payment_amount)}</TableCell>
                      <TableCell className="font-semibold text-red-600">
                        {formatCurrency(refund.amount)}
                      </TableCell>
                      <TableCell className="max-w-xs truncate" title={refund.reason}>
                        {refund.reason || '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(refund.status)}
                          <Badge className={getStatusColor(refund.status)}>
                            {refund.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {refund.status === 'pending' ? (
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600 hover:text-green-700"
                              onClick={() => openApprovalDialog(refund, 'approve')}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => openApprovalDialog(refund, 'reject')}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            {refund.status === 'approved' && refund.refund_date
                              ? `Processed on ${formatDate(refund.refund_date)}`
                              : refund.status}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' ? 'Approve' : 'Reject'} Refund Request
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve'
                ? 'Are you sure you want to approve this refund request?'
                : 'Are you sure you want to reject this refund request?'}
            </DialogDescription>
          </DialogHeader>
          {selectedRefund && (
            <div className="py-4 space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Patient:</div>
                <div className="font-medium">
                  {selectedRefund.patient_first_name} {selectedRefund.patient_last_name}
                </div>
                <div className="text-muted-foreground">Payment Amount:</div>
                <div>{formatCurrency(selectedRefund.payment_amount)}</div>
                <div className="text-muted-foreground">Refund Amount:</div>
                <div className="font-semibold text-red-600">
                  {formatCurrency(selectedRefund.amount)}
                </div>
                <div className="text-muted-foreground">Reason:</div>
                <div className="col-span-1">{selectedRefund.reason || '-'}</div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleApproveRefund}
              className={actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
            >
              {actionType === 'approve' ? 'Approve Refund' : 'Reject Refund'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RefundsPage;
