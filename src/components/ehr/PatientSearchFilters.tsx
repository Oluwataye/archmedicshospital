import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

interface PatientSearchFiltersProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    department: string;
    setDepartment: (value: string) => void;
    patientStatus: string;
    setPatientStatus: (value: string) => void;
}

const PatientSearchFilters: React.FC<PatientSearchFiltersProps> = ({
    searchTerm,
    setSearchTerm,
    department,
    setDepartment,
    patientStatus,
    setPatientStatus
}) => {
    return (
        <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by name, ID, or phone..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
                <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger className="w-[180px]">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        <SelectItem value="cardiology">Cardiology</SelectItem>
                        <SelectItem value="neurology">Neurology</SelectItem>
                        <SelectItem value="pediatrics">Pediatrics</SelectItem>
                        <SelectItem value="orthopedics">Orthopedics</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={patientStatus} onValueChange={setPatientStatus}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Follow-up">Follow-up</SelectItem>
                        <SelectItem value="Discharged">Discharged</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default PatientSearchFilters;
