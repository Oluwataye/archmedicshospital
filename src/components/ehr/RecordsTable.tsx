import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Eye, Download } from 'lucide-react';

interface Record {
    id: string;
    date: string;
    type: string;
    doctor: string;
    description: string;
    status?: string;
}

interface RecordsTableProps {
    records: Record[];
}

const RecordsTable: React.FC<RecordsTableProps> = ({ records }) => {
    if (!records || records.length === 0) {
        return (
            <div className="text-center py-8 border rounded-lg bg-muted/10">
                <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No records found for this patient.</p>
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {records.map((record) => (
                        <TableRow key={record.id}>
                            <TableCell className="font-medium">
                                {new Date(record.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="capitalize">{record.type}</TableCell>
                            <TableCell className="max-w-[300px] truncate" title={record.description}>
                                {record.description}
                            </TableCell>
                            <TableCell>{record.doctor}</TableCell>
                            <TableCell>
                                {record.status && (
                                    <Badge variant="outline" className="capitalize">
                                        {record.status}
                                    </Badge>
                                )}
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button variant="ghost" size="icon" title="View Details">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" title="Download">
                                        <Download className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default RecordsTable;
