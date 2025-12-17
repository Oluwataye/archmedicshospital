import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar as CalendarIcon, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { ApiService } from '@/services/apiService';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface AuditLog {
    id: string;
    user_id: string;
    username: string;
    firstName: string;
    lastName: string;
    action: string;
    resource_type: string;
    resource_id: string;
    ip_address: string;
    created_at: string;
}

export default function AuditLogsPage() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
    const [filters, setFilters] = useState({
        action: '',
        resource_type: 'all',
        start_date: undefined as Date | undefined,
        end_date: undefined as Date | undefined
    });

    useEffect(() => {
        loadLogs();
    }, [page, filters]);

    const loadLogs = async () => {
        try {
            setLoading(true);
            const params: any = {
                page,
                limit: 20,
                action: filters.action || undefined,
                resource_type: filters.resource_type !== 'all' ? filters.resource_type : undefined,
                start_date: filters.start_date ? filters.start_date.toISOString() : undefined,
                end_date: filters.end_date ? filters.end_date.toISOString() : undefined
            };

            const response = await ApiService.getAuditLogs(params);
            setLogs(response.data);
            setPagination(response.pagination);
        } catch (error) {
            console.error('Error loading audit logs:', error);
            toast.error('Failed to load audit logs');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key: string, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(1); // Reset to first page on filter change
    };

    const clearFilters = () => {
        setFilters({
            action: '',
            resource_type: 'all',
            start_date: undefined,
            end_date: undefined
        });
        setPage(1);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
                    <p className="text-muted-foreground mt-1">Monitor system activity and security events</p>
                </div>
                <Button variant="outline" onClick={loadLogs}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Input
                                placeholder="Search by action..."
                                value={filters.action}
                                onChange={(e) => handleFilterChange('action', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Select
                                value={filters.resource_type}
                                onValueChange={(value) => handleFilterChange('resource_type', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Resource Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Resources</SelectItem>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="patient">Patient</SelectItem>
                                    <SelectItem value="appointment">Appointment</SelectItem>
                                    <SelectItem value="medical_record">Medical Record</SelectItem>
                                    <SelectItem value="prescription">Prescription</SelectItem>
                                    <SelectItem value="lab_result">Lab Result</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !filters.start_date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {filters.start_date ? format(filters.start_date, "PPP") : <span>Start Date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={filters.start_date}
                                        onSelect={(date) => handleFilterChange('start_date', date)}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="space-y-2">
                            <Button variant="ghost" onClick={clearFilters} className="w-full">
                                Clear Filters
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date & Time</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead>Resource</TableHead>
                                <TableHead>IP Address</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        <LoadingSpinner />
                                    </TableCell>
                                </TableRow>
                            ) : logs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                        No logs found matching your criteria.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                logs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell className="whitespace-nowrap">
                                            {format(new Date(log.created_at), 'MMM d, yyyy HH:mm:ss')}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{log.firstName} {log.lastName}</span>
                                                <span className="text-xs text-muted-foreground">@{log.username}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{log.action}</Badge>
                                        </TableCell>
                                        <TableCell className="capitalize">
                                            {log.resource_type.replace('_', ' ')}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs">
                                            {log.ip_address || '-'}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="flex items-center justify-end space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1 || loading}
                >
                    Previous
                </Button>
                <div className="text-sm text-muted-foreground">
                    Page {page} of {pagination.totalPages}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages || loading}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
