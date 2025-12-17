import React, { useState, useEffect } from 'react';
import { Plus, Search, Eye, Send, Filter } from 'lucide-react';
import { toast } from 'sonner';
import claimsService from '@/services/claimsService';
import { HMOClaim, ClaimsStatistics } from '@/types/hmo';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ClaimsModal from '@/components/hmo/ClaimsModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileText, TrendingUp, CheckCircle, Clock } from 'lucide-react';

export default function ClaimsManagementPage() {
    const [claims, setClaims] = useState<HMOClaim[]>([]);
    const [statistics, setStatistics] = useState<ClaimsStatistics | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [showModal, setShowModal] = useState(false);

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

    const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
        const variants = {
            pending: 'secondary' as const,
            submitted: 'outline' as const,
            approved: 'default' as const,
            rejected: 'destructive' as const,
            paid: 'default' as const
        };
        return variants[status as keyof typeof variants] || 'outline';
    };

    if (loading && !statistics) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Claims Management</h1>
                    <p className="text-muted-foreground mt-1">Manage HMO claims and submissions</p>
                </div>
                <Button onClick={() => setShowModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Claim
                </Button>
            </div>

            {/* Statistics Cards */}
            {statistics && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="card-accent-blue hover:shadow-lg transition-all hover:scale-105">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Claims</p>
                                <h2 className="text-3xl font-bold text-blue-600">{statistics.total_claims}</h2>
                                <p className="text-xs text-muted-foreground mt-1">
                                    ₦{(statistics.total_claim_amount || 0).toLocaleString()}
                                </p>
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
                                <h2 className="text-3xl font-bold text-yellow-600">{statistics.pending_claims}</h2>
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
                                <h2 className="text-3xl font-bold text-green-600">{statistics.approved_claims}</h2>
                                <p className="text-xs text-muted-foreground mt-1">
                                    ₦{(statistics.total_approved_amount || 0).toLocaleString()}
                                </p>
                            </div>
                            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="card-accent-purple hover:shadow-lg transition-all hover:scale-105">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Paid</p>
                                <h2 className="text-3xl font-bold text-purple-600">{statistics.paid_claims}</h2>
                                <p className="text-xs text-muted-foreground mt-1">
                                    ₦{(statistics.total_paid_amount || 0).toLocaleString()}
                                </p>
                            </div>
                            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <TrendingUp className="h-6 w-6 text-purple-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            <Card>
                <CardContent className="p-0">
                    <div className="p-4 border-b flex flex-col md:flex-row items-center gap-4">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search by claim number or patient ID..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="submitted">Submitted</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                    <SelectItem value="paid">Paid</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Claim #</TableHead>
                                <TableHead>Patient</TableHead>
                                <TableHead>Claim Date</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredClaims.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                                        No claims found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredClaims.map((claim) => (
                                    <TableRow key={claim.id}>
                                        <TableCell className="font-medium">{claim.claim_number}</TableCell>
                                        <TableCell className="text-muted-foreground">{claim.patient_id}</TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {new Date(claim.claim_date).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            ₦{claim.claim_amount.toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusVariant(claim.status)}>
                                                {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    title="View Details"
                                                    onClick={() => toast.info(`View claim ${claim.claim_number}`)}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                {claim.status === 'pending' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        title="Submit Claim"
                                                        onClick={() => handleSubmitClaim(claim.id)}
                                                        className="text-green-600 hover:text-green-600"
                                                    >
                                                        <Send className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Claims Modal */}
            <ClaimsModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSuccess={() => {
                    loadClaims();
                    loadStatistics();
                }}
            />
        </div>
    );
}
