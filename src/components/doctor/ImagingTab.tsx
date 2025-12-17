import React from 'react';
import { format } from 'date-fns';
import { Scan, Calendar, User, FileText, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface ImagingResult {
    id: string;
    exam_type: string; // X-Ray, MRI, CT, Ultrasound
    body_part: string;
    findings_summary: string;
    exam_date: string;
    ordered_by_name: string;
    radiologist_name?: string;
    status: 'pending' | 'completed' | 'cancelled';
    image_url?: string;
    report_url?: string;
}

interface ImagingTabProps {
    imagingResults: ImagingResult[];
    onOrderImaging?: () => void;
}

export default function ImagingTab({ imagingResults, onOrderImaging }: ImagingTabProps) {

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
                        <Scan className="h-5 w-5 text-blue-600" />
                        Imaging & Radiology
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        History of X-rays, CT scans, MRIs, and ultrasounds
                    </p>
                </div>
                {onOrderImaging && (
                    <Button onClick={onOrderImaging}>
                        <Scan className="h-4 w-4 mr-2" />
                        Order Imaging
                    </Button>
                )}
            </div>

            {imagingResults.length === 0 ? (
                <Card className="bg-muted/20 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <Scan className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                        <h4 className="text-lg font-medium text-muted-foreground">No imaging records found</h4>
                        <p className="text-sm text-muted-foreground max-w-sm mt-2">
                            This patient has no imaging history. Click "Order Imaging" to create a new request.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Exam Type</TableHead>
                                <TableHead>Body Part</TableHead>
                                <TableHead>Findings Summary</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Ordered By</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {imagingResults.map((result) => (
                                <TableRow key={result.id}>
                                    <TableCell>
                                        <div className="font-medium">{result.exam_type}</div>
                                    </TableCell>
                                    <TableCell>{result.body_part}</TableCell>
                                    <TableCell>
                                        <div className="max-w-[300px] truncate" title={result.findings_summary}>
                                            {result.findings_summary || '--'}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                            {format(new Date(result.exam_date), 'MMM d, yyyy')}
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
                                        <div className="flex justify-end gap-2">
                                            {result.image_url && (
                                                <Button variant="ghost" size="icon" title="View Images">
                                                    <ImageIcon className="h-4 w-4 text-blue-600" />
                                                </Button>
                                            )}
                                            {result.report_url && (
                                                <Button variant="ghost" size="icon" title="View Report">
                                                    <FileText className="h-4 w-4 text-muted-foreground" />
                                                </Button>
                                            )}
                                        </div>
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
