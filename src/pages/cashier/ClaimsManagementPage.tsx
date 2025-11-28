import React, { useState, useEffect } from 'react';
import { Plus, Search, Eye, Send, CheckCircle, XCircle, Filter } from 'lucide-react';
import { toast } from 'sonner';
import claimsService from '@/services/claimsService';
import { HMOClaim, ClaimsStatistics } from '@/types/hmo';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function ClaimsManagementPage() {
    const [claims, setClaims] = useState<HMOClaim[]>([]);
    const [statistics, setStatistics] = useState<ClaimsStatistics | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    useEffect(() => {
        loadClaims();
        loadStatistics();
    }, [statusFilter]);

    const loadClaims = async () => {
        try {
            setLoading(true);
            const filters = statusFilter !== 'all' ? { status: statusFilter as any } : undefined;
            const data = await claimsService.getClaims(filters);
            setClaims(data);
        } catch (error) {
            console.error('Error loading claims:', error);
            toast.error('Failed to load claims');
        } finally {
            setLoading(false);
        }
    };

    const loadStatistics = async () => {
        try {
            const data = await claimsService.getClaimsStatistics();
            setStatistics(data);
        } catch (error) {
            console.error('Error loading statistics:', error);
        }
    };

    const handleSubmitClaim = async (claimId: string) => {
        try {
            await claimsService.submitClaim(claimId);
            toast.success('Claim submitted successfully');
            loadClaims();
            loadStatistics();
        } catch (error) {
            console.error('Error submitting claim:', error);
            toast.error('Failed to submit claim');
        }
    };

    const filteredClaims = claims.filter(claim =>
        claim.claim_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        claim.patient_id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800',
            submitted: 'bg-blue-100 text-blue-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
            paid: 'bg-purple-100 text-purple-800'
        };
        return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
    };

    if (loading && !statistics) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Claims Management</h1>
                    <p className="text-gray-500">Manage HMO claims and submissions</p>
                </div>
                <button
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2 hover:bg-primary/90 transition-colors"
                    onClick={() => toast.info('Create claim functionality - integrate with patient billing')}
                >
                    <Plus size={20} />
                    New Claim
                </button>
            </div>

            {/* Statistics Cards */}
            {statistics && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <div className="text-sm text-gray-500">Total Claims</div>
                        <div className="text-2xl font-bold text-gray-900">{statistics.total_claims}</div>
                        <div className="text-xs text-gray-400 mt-1">₦{statistics.total_claim_amount.toLocaleString()}</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <div className="text-sm text-gray-500">Pending</div>
                        <div className="text-2xl font-bold text-yellow-600">{statistics.pending_claims}</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <div className="text-sm text-gray-500">Approved</div>
                        <div className="text-2xl font-bold text-green-600">{statistics.approved_claims}</div>
                        <div className="text-xs text-gray-400 mt-1">₦{statistics.total_approved_amount.toLocaleString()}</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <div className="text-sm text-gray-500">Paid</div>
                        <div className="text-2xl font-bold text-purple-600">{statistics.paid_claims}</div>
                        <div className="text-xs text-gray-400 mt-1">₦{statistics.total_paid_amount.toLocaleString()}</div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-lg border shadow-sm">
                <div className="p-4 border-b flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by claim number or patient ID..."
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
                            <option value="submitted">Submitted</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="paid">Paid</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Claim #</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Claim Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredClaims.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No claims found
                                    </td>
                                </tr>
                            ) : (
                                filteredClaims.map((claim) => (
                                    <tr key={claim.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{claim.claim_number}</td>
                                        <td className="px-6 py-4 text-gray-500">{claim.patient_id}</td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(claim.claim_date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-gray-900">
                                            ₦{claim.claim_amount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(claim.status)}`}>
                                                {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                    title="View Details"
                                                    onClick={() => toast.info(`View claim ${claim.claim_number}`)}
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                {claim.status === 'pending' && (
                                                    <button
                                                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                                                        title="Submit Claim"
                                                        onClick={() => handleSubmitClaim(claim.id)}
                                                    >
                                                        <Send size={18} />
                                                    </button>
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
        </div>
    );
}
