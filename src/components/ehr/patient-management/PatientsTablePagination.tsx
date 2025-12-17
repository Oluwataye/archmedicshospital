import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PatientsTablePaginationProps {
    totalCount: number;
    currentPage: number;
}

const PatientsTablePagination: React.FC<PatientsTablePaginationProps> = ({ totalCount, currentPage }) => {
    return (
        <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
                Showing {totalCount} patients
            </div>
            <div className="space-x-2">
                <Button variant="outline" size="sm" disabled>
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                    Next
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export default PatientsTablePagination;
