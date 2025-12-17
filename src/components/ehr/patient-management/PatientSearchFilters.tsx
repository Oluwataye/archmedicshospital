import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, Filter } from "lucide-react";

interface PatientSearchFiltersProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    statusFilter: string;
    setStatusFilter: (status: string) => void;
    genderFilter: string;
    setGenderFilter: (gender: string) => void;
    onExport: () => void;
}

const PatientSearchFilters: React.FC<PatientSearchFiltersProps> = ({
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    genderFilter,
    setGenderFilter,
    onExport
}) => {
    return (
        <div className="flex flex-col md:flex-row gap-4 items-end md:items-center justify-between">
            <div className="flex flex-1 items-center space-x-2 w-full md:w-auto">
                <div className="relative flex-1 md:max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search patients..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select
                    value={statusFilter || "all"}
                    onValueChange={(val) => setStatusFilter(val === "all" ? "" : val)}
                >
                    <SelectTrigger className="w-[140px]">
                        <div className="flex items-center">
                            <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                            <SelectValue placeholder="Status" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Follow-up">Follow-up</SelectItem>
                        <SelectItem value="Discharged">Discharged</SelectItem>
                    </SelectContent>
                </Select>
                <Select
                    value={genderFilter || "all"}
                    onValueChange={(val) => setGenderFilter(val === "all" ? "" : val)}
                >
                    <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Genders</SelectItem>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button variant="outline" onClick={onExport}>
                <Download className="mr-2 h-4 w-4" />
                Export List
            </Button>
        </div>
    );
};

export default PatientSearchFilters;
