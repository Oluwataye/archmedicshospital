import React from 'react';
import { format } from 'date-fns';
import { FlaskConical, Calendar, User, AlertTriangle, CheckCircle2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface LabResult {
    id: string;
    test_name: string;
    category: string;
    result_value: string;
    unit: string;
    reference_range: string;
    is_abnormal: boolean;
    test_date: string;
    ordered_by_name: string;
    status: 'pending' | 'completed' | 'cancelled';
    notes?: string;
}

interface LabResultsTabProps {
    labResults: LabResult[];
    onOrderLab?: () => void;
}

export default function LabResultsTab({ labResults, onOrderLab }: LabResultsTabProps) {

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>;
            case 'pending':
                return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
            case 'cancelled':
                return <Badge variant="destructive">Cancelled</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <FlaskConical className="h-5 w-5 text-blue-600" />
                        Laboratory Results
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        History of laboratory tests and results
                    </p>
                </div>
                {onOrderLab && (
                    <Button onClick={onOrderLab}>
                        <FlaskConical className="h-4 w-4 mr-2" />
                        Order Lab Test
                    </Button>
                )}
            </div>

            {labResults.length === 0 ? (
                <Card className="bg-muted/20 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <FlaskConical className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                        <h4 className="text-lg font-medium text-muted-foreground">No lab results found</h4>
                        <p className="text-sm text-muted-foreground max-w-sm mt-2">
                            This patient has no laboratory test history. Click "Order Lab Test" to create a new order.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Test Name</TableHead>
                                <TableHead>Result</TableHead>
                                <TableHead>Reference Range</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Ordered By</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {labResults.map((result) => (
                                <TableRow key={result.id} className={result.is_abnormal ? 'bg-red-50/50' : ''}>
                                    <TableCell>
                                        <div className="font-medium">{result.test_name}</div>
                                        <div className="text-xs text-muted-foreground">{result.category}</div>
                                    </TableCell>
                                    <TableCell>
                                        {result.status === 'completed' ? (
                                            <div className="flex items-center gap-2">
                                                <span className={`font-semibold ${result.is_abnormal ? 'text-red-600' : 'text-green-700'}`}>
                                                    {result.result_value} {result.unit}
                                                </span>
                                                {result.is_abnormal && (
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger>
                                                                <AlertTriangle className="h-4 w-4 text-red-500" />
                                                            </TooltipTrigger>
                                                            <TooltipContent>Abnormal Result</TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-muted-foreground italic">--</span>
                                        )}
                                    </TableCell>
                                    <TableCell>{result.reference_range || '--'}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                            {format(new Date(result.test_date), 'MMM d, yyyy')}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5">
                                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                                            {result.ordered_by_name}
                                        </div>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(result.status)}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
