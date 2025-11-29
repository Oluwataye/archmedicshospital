import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Stethoscope, Plus, FileText } from 'lucide-react';

interface ProceduresTabProps {
    patientId: string;
    procedures: any[];
    onAddRecordClick: () => void;
}

const ProceduresTab: React.FC<ProceduresTabProps> = ({ patientId, procedures, onAddRecordClick }) => {
    // Mock data
    const displayProcedures = procedures && procedures.length > 0 ? procedures : [
        { id: 1, name: 'Appendectomy', date: '2019-08-15', doctor: 'Dr. Smith', hospital: 'General Hospital', notes: 'Routine laparoscopic appendectomy.' },
        { id: 2, name: 'Knee Arthroscopy', date: '2022-03-10', doctor: 'Dr. Jones', hospital: 'Ortho Center', notes: 'Meniscus repair, left knee.' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Stethoscope className="h-5 w-5 text-primary" />
                    Surgical & Medical Procedures
                </h3>
                <Button onClick={onAddRecordClick} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Procedure
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Procedure Name</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Provider</TableHead>
                                <TableHead>Facility</TableHead>
                                <TableHead>Notes</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {displayProcedures.map((proc) => (
                                <TableRow key={proc.id}>
                                    <TableCell className="font-medium">{proc.name}</TableCell>
                                    <TableCell>{proc.date}</TableCell>
                                    <TableCell>{proc.doctor}</TableCell>
                                    <TableCell>{proc.hospital}</TableCell>
                                    <TableCell className="max-w-[300px] truncate" title={proc.notes}>{proc.notes}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProceduresTab;
