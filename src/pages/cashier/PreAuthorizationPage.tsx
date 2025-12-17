import React, { useState, useEffect } from 'react';
import { Plus, Search, Eye, CheckCircle, XCircle, Clock, Filter, FileText, LayoutDashboard } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import preAuthService from '@/services/preauthService';
import { HMOPreAuthorization } from '@/types/hmo';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PreAuthModal from '@/components/hmo/PreAuthModal';

export default function PreAuthorizationPage() {
    const [preAuths, setPreAuths] = useState<HMOPreAuthorization[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        loadPreAuths();
    }, [statusFilter]);

    const loadPreAuths = async () => {
        try {
            setLoading(true);
            const filters = statusFilter !== 'all' ? { status: statusFilter as any } : undefined;
            const data = await preAuthService.getPreAuthorizations(filters);
            setPreAuths(data);
        } catch (error) {
            console.error('Error loading pre-authorizations:', error);
            toast.error('Failed to load pre-authorizations');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        const amount = prompt('Enter approved amount:');
        if (!amount) return;

        try {
            await preAuthService.approvePreAuthorization(id, parseFloat(amount));
            toast.success('Pre-authorization approved');
            loadPreAuths();
        } catch (error) {
            console.error('Error approving pre-auth:', error);
            toast.error('Failed to approve pre-authorization');
        }
    };

    const handleReject = async (id: string) => {
        const reason = prompt('Enter rejection reason:');
        if (!reason) return;

        try {
            await preAuthService.rejectPreAuthorization(id, reason);
            toast.success('Pre-authorization rejected');
            loadPreAuths();
        } catch (error) {
            console.error('Error rejecting pre-auth:', error);
            toast.error('Failed to reject pre-authorization');
        }
    };

    const filteredPreAuths = preAuths.filter(preAuth =>
        preAuth.authorization_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        preAuth.patient_id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
            expired: 'bg-gray-100 text-gray-800'
        };
        return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved':
                return <CheckCircle size={16} className="text-green-600" />;
            case 'rejected':
                return <XCircle size={16} className="text-red-600" />;
            case 'pending':
                return <Clock size={16} className="text-yellow-600" />;
            default:
                return null;
        }
    };

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Pre-Authorization Management</h1>
                    <p className="text-gray-500">Manage HMO pre-authorization requests</p>
                </div>
                <button
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2 hover:bg-primary/90 transition-colors"
                    onClick={() => setShowModal(true)}
                >
                    <Plus size={20} />
                    New Pre-Auth Request
                </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="card-accent-blue hover:shadow-lg transition-all hover:scale-105">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                            <h2 className="text-3xl font-bold text-blue-600">{preAuths.length}</h2>
                            <p className="text-xs text-muted-foreground mt-1">All records</p>
                        </div>
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="card-accent-orange hover:shadow-lg transition-all hover:scale-105">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Pending</p>
                            <h2 className="text-3xl font-bold text-yellow-600">
                                {preAuths.filter(p => p.status === 'pending').length}
                            </h2>
                            <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
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
                                {preAuths.filter(p => p.status === 'approved').length}
                            </h2>
                            <p className="text-xs text-muted-foreground mt-1">Authorized</p>
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
                                {preAuths.filter(p => p.status === 'rejected').length}
                            </h2>
                            <p className="text-xs text-muted-foreground mt-1">Denied</p>
                        </div>
                        <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                            <XCircle className="h-6 w-6 text-red-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="bg-white rounded-lg border shadow-sm">
                <div className="p-4 border-b flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by authorization code or patient ID..."
                            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter size={20} className="text-gray-400" />
                        <select
                            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="expired">Expired</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Auth Code</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Request Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diagnosis</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredPreAuths.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No pre-authorization requests found
                                    </td>
                                </tr>
                            ) : (
                                filteredPreAuths.map((preAuth) => (
                                    <tr key={preAuth.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{preAuth.authorization_code}</td>
                                        <td className="px-6 py-4 text-gray-500">{preAuth.patient_id}</td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(preAuth.request_date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{preAuth.diagnosis || 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(preAuth.status)}
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(preAuth.status)}`}>
                                                    {preAuth.status.charAt(0).toUpperCase() + preAuth.status.slice(1)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                    title="View Details"
                                                    onClick={() => toast.info(`View pre-auth ${preAuth.authorization_code}`)}
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                {preAuth.status === 'pending' && (
                                                    <>
                                                        <button
                                                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                                                            title="Approve"
                                                            onClick={() => handleApprove(preAuth.id)}
                                                        >
                                                            <CheckCircle size={18} />
                                                        </button>
                                                        <button
                                                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                            title="Reject"
                                                            onClick={() => handleReject(preAuth.id)}
                                                        >
                                                            <XCircle size={18} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pre-Authorization Modal */}
            <PreAuthModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSuccess={loadPreAuths}
            />
        </div>
    );
}
