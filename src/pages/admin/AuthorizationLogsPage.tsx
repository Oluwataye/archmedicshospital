import React, { useState, useEffect } from 'react';
import { FileText, Download, Filter, Calendar, User, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import PreAuthService, { VerificationLog } from '@/services/preauthService';

export default function AuthorizationLogsPage() {
    const [logs, setLogs] = useState<VerificationLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        from_date: '',
        to_date: '',
        status: '',
        verified_by: ''
    });

    useEffect(() => {
        loadLogs();
    }, []);

    const loadLogs = async () => {
        setLoading(true);
        try {
            const data = await PreAuthService.getVerificationLogs(filters);
            setLogs(data);
        } catch (error: any) {
            console.error('Error loading logs:', error);
            toast.error('Failed to load verification logs');
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = () => {
        loadLogs();
    };

    const handleClearFilters = () => {
        setFilters({
            from_date: '',
            to_date: '',
            status: '',
            verified_by: ''
        });
        setTimeout(() => loadLogs(), 100);
    };

    const handleExport = () => {
        // Convert logs to CSV
        const headers = ['Date', 'Patient', 'Auth Code', 'Verified By', 'Status', 'Category', 'Notes'];
        const rows = logs.map(log => [
            new Date(log.verification_date).toLocaleString(),
            log.patient_name || 'N/A',
            log.authorization_code,
            log.verified_by_name || 'N/A',
            log.verification_status,
            log.service_category || 'N/A',
            log.notes || ''
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `authorization_logs_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);

        toast.success('Logs exported successfully');
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            verified: { icon: CheckCircle, color: 'bg-green-100 text-green-700', label: 'Verified' },
            rejected: { icon: XCircle, color: 'bg-red-100 text-red-700', label: 'Rejected' },
            expired: { icon: Clock, color: 'bg-orange-100 text-orange-700', label: 'Expired' },
            invalid: { icon: AlertTriangle, color: 'bg-gray-100 text-gray-700', label: 'Invalid' }
        };

        const badge = badges[status as keyof typeof badges] || badges.invalid;
        const Icon = badge.icon;

        return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                <Icon className="h-3 w-3" />
                {badge.label}
            </span>
        );
    };

    const getStats = () => {
        const total = logs.length;
        const verified = logs.filter(l => l.verification_status === 'verified').length;
        const rejected = logs.filter(l => l.verification_status === 'rejected').length;
        const expired = logs.filter(l => l.verification_status === 'expired').length;
        const invalid = logs.filter(l => l.verification_status === 'invalid').length;

        return { total, verified, rejected, expired, invalid };
    };

    const stats = getStats();

    return (
        <div className="flex-1 p-6 overflow-auto">
            {/* Page Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-8 w-8 text-primary" />
                            <h1 className="text-3xl font-bold">Authorization Verification Logs</h1>
                        </div>
                        <p className="text-muted-foreground">
                            Audit trail of all HMO authorization verifications
                        </p>
                    </div>
                    <Button onClick={handleExport} variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                    </Button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
                <Card className="card-accent-blue hover:shadow-lg transition-all hover:scale-105">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total</p>
                            <h2 className="text-3xl font-bold text-blue-600">{stats.total}</h2>
                            <p className="text-xs text-muted-foreground mt-1">Verifications</p>
                        </div>
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="card-accent-green hover:shadow-lg transition-all hover:scale-105">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Verified</p>
                            <h2 className="text-3xl font-bold text-green-600">{stats.verified}</h2>
                            <p className="text-xs text-muted-foreground mt-1">Successful</p>
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
                            <h2 className="text-3xl font-bold text-red-600">{stats.rejected}</h2>
                            <p className="text-xs text-muted-foreground mt-1">Denied</p>
                        </div>
                        <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                            <XCircle className="h-6 w-6 text-red-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="card-accent-orange hover:shadow-lg transition-all hover:scale-105">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Expired</p>
                            <h2 className="text-3xl font-bold text-orange-600">{stats.expired}</h2>
                            <p className="text-xs text-muted-foreground mt-1">Timed out</p>
                        </div>
                        <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                            <Clock className="h-6 w-6 text-orange-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="card-accent-gray hover:shadow-lg transition-all hover:scale-105">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Invalid</p>
                            <h2 className="text-3xl font-bold text-gray-600">{stats.invalid}</h2>
                            <p className="text-xs text-muted-foreground mt-1">Errors</p>
                        </div>
                        <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <AlertTriangle className="h-6 w-6 text-gray-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filters
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">From Date</label>
                            <Input
                                type="date"
                                value={filters.from_date}
                                onChange={(e) => setFilters({ ...filters, from_date: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">To Date</label>
                            <Input
                                type="date"
                                value={filters.to_date}
                                onChange={(e) => setFilters({ ...filters, to_date: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Status</label>
                            <select
                                value={filters.status}
                                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                                className="w-full border rounded-md px-3 py-2"
                            >
                                <option value="">All Statuses</option>
                                <option value="verified">Verified</option>
                                <option value="rejected">Rejected</option>
                                <option value="expired">Expired</option>
                                <option value="invalid">Invalid</option>
                            </select>
                        </div>
                        <div className="flex items-end gap-2">
                            <Button onClick={handleFilter} className="flex-1">
                                Apply Filters
                            </Button>
                            <Button onClick={handleClearFilters} variant="outline">
                                Clear
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Logs Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Verification History</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Loading logs...
                        </div>
                    ) : (!logs || logs.length === 0) ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No verification logs found
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date & Time</TableHead>
                                        <TableHead>Patient</TableHead>
                                        <TableHead>Auth Code</TableHead>
                                        <TableHead>Verified By</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Notes</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {logs.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell className="font-medium">
                                                {new Date(log.verification_date).toLocaleString()}
                                            </TableCell>
                                            <TableCell>{log.patient_name || 'N/A'}</TableCell>
                                            <TableCell className="font-mono text-sm">{log.authorization_code}</TableCell>
                                            <TableCell>{log.verified_by_name || 'N/A'}</TableCell>
                                            <TableCell>{getStatusBadge(log.verification_status)}</TableCell>
                                            <TableCell>
                                                {log.service_category ? (
                                                    <span className="capitalize text-sm">{log.service_category}</span>
                                                ) : (
                                                    'N/A'
                                                )}
                                            </TableCell>
                                            <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                                                {log.notes || '-'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
