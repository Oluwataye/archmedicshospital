import React from 'react';
import { format } from 'date-fns';
import { Pill, Calendar, User, AlertCircle, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Prescription {
    id: string;
    medication_name: string;
    dosage: string;
    frequency: string;
    duration: string;
    start_date: string;
    end_date?: string;
    status: 'active' | 'completed' | 'cancelled' | 'dispensed';
    prescribed_by_name: string;
    notes?: string;
}

interface PrescriptionsTabProps {
    prescriptions: Prescription[];
    onAddPrescription?: () => void;
}

export default function PrescriptionsTab({ prescriptions, onAddPrescription }: PrescriptionsTabProps) {

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-blue-500 hover:bg-blue-600">Active</Badge>;
            case 'completed':
                return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>;
            case 'dispensed':
                return <Badge className="bg-purple-500 hover:bg-purple-600">Dispensed</Badge>;
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
                        <Pill className="h-5 w-5 text-blue-600" />
                        Prescription History
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        List of all medications prescribed to the patient
                    </p>
                </div>
                {onAddPrescription && (
                    <Button onClick={onAddPrescription}>
                        <Pill className="h-4 w-4 mr-2" />
                        New Prescription
                    </Button>
                )}
            </div>

            {prescriptions.length === 0 ? (
                <Card className="bg-muted/20 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <Pill className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                        <h4 className="text-lg font-medium text-muted-foreground">No prescriptions found</h4>
                        <p className="text-sm text-muted-foreground max-w-sm mt-2">
                            This patient has no prescription history. Click "New Prescription" to add one.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="border rounded-lg overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Medication</TableHead>
                                <TableHead>Dosage & Frequency</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Date Prescribed</TableHead>
                                <TableHead>Prescriber</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {prescriptions.map((prescription) => (
                                <TableRow key={prescription.id}>
                                    <TableCell>
                                        <div className="font-medium text-blue-700">{prescription.medication_name}</div>
                                        {prescription.notes && (
                                            <div className="text-xs text-muted-foreground mt-1 max-w-[200px] truncate">
                                                {prescription.notes}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{prescription.dosage}</div>
                                        <div className="text-xs text-muted-foreground">{prescription.frequency}</div>
                                    </TableCell>
                                    <TableCell>{prescription.duration}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                            {format(new Date(prescription.start_date), 'MMM d, yyyy')}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1.5">
                                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                                            {prescription.prescribed_by_name}
                                        </div>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(prescription.status)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
