import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus, BarChart2 } from "lucide-react";

interface PatientManagementHeaderProps {
    onAddPatient: () => void;
    onViewStatistics: () => void;
}

const PatientManagementHeader: React.FC<PatientManagementHeaderProps> = ({
    onAddPatient,
    onViewStatistics
}) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Patient Management</h2>
                <p className="text-muted-foreground">
                    Manage patient records, admissions, and medical history.
                </p>
            </div>
            <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={onViewStatistics}>
                    <BarChart2 className="mr-2 h-4 w-4" />
                    Statistics
                </Button>
                <Button onClick={onAddPatient}>
                    <Plus className="mr-2 h-4 w-4" />
                    Register Patient
                </Button>
            </div>
        </div>
    );
};

export default PatientManagementHeader;
