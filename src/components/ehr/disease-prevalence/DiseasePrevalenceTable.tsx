import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const DiseasePrevalenceTable: React.FC = () => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Disease</TableHead>
                    <TableHead>Cases</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell colSpan={2} className="text-center">No data available</TableCell>
                </TableRow>
            </TableBody>
        </Table>
    );
};

export default DiseasePrevalenceTable;
