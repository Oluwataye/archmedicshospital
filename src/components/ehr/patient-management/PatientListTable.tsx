import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    MoreHorizontal,
    FileText,
    Edit,
    Share2,
    BedDouble,
    Trash2
} from "lucide-react";
import { Patient } from '@/hooks/usePatientManagement';

interface PatientListTableProps {
    patients: Patient[];
    onViewMedicalHistory: (patient: Patient) => void;
    onEditPatient: (id: string) => void;
    onShareRecords: (patient: Patient) => void;
    onWardAssignment: (patient: Patient) => void;
    onDeletePatient: (id: string) => void;
}

const PatientListTable: React.FC<PatientListTableProps> = ({
    patients,
    onViewMedicalHistory,
    onEditPatient,
    onShareRecords,
    onWardAssignment,
    onDeletePatient
}) => {
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'bg-green-100 text-green-800 hover:bg-green-100 border-green-200';
            case 'pending_payment':
                return 'bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200';
            case 'discharged':
                return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
            case 'new':
                return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
            case 'follow-up':
                return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
            default:
                return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
        }
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Patient ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Age/Gender</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Insurance</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Visit</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {patients.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className="h-24 text-center">
                                No patients found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        patients.map((patient) => (
                            <TableRow key={patient.id}>
                                <TableCell className="font-medium">{patient.mrn || patient.id}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{patient.name}</span>
                                        <span className="text-xs text-muted-foreground">{patient.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{patient.age} / {patient.gender}</TableCell>
                                <TableCell>{patient.contact}</TableCell>
                                <TableCell>{patient.insurance}</TableCell>
                                <TableCell>
                                    <Badge className={getStatusColor(patient.status)} variant="secondary">
                                        {patient.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{patient.lastVisit}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem onClick={() => onViewMedicalHistory(patient)}>
                                                <FileText className="mr-2 h-4 w-4" /> View Medical History
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onEditPatient(String(patient.id))}>
                                                <Edit className="mr-2 h-4 w-4" /> Edit Details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onShareRecords(patient)}>
                                                <Share2 className="mr-2 h-4 w-4" /> Share Records
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => onWardAssignment(patient)}>
                                                <BedDouble className="mr-2 h-4 w-4" /> Ward Assignment
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() => onDeletePatient(String(patient.id))}
                                                className="text-red-600 focus:text-red-600"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" /> Delete Patient
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default PatientListTable;
