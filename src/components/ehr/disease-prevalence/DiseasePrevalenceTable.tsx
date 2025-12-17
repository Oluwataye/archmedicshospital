import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Loader2 } from "lucide-react";
import TrendIndicator from "@/components/analytics/TrendIndicator";

interface DiseasePrevalenceTableProps {
    filteredData: any[];
    totalCount: number;
    onViewDetails: (id: string) => void;
    loading?: boolean;
}

const DiseasePrevalenceTable: React.FC<DiseasePrevalenceTableProps> = ({
    filteredData,
    totalCount,
    onViewDetails,
    loading = false
}) => {
    if (loading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    <span className="ml-2">Loading disease prevalence data...</span>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Disease Prevalence Data</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Disease</TableHead>
                            <TableHead>Cases</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Age Group</TableHead>
                            <TableHead>Gender</TableHead>
                            <TableHead>Period</TableHead>
                            <TableHead>Trend</TableHead>
                            <TableHead>Risk</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.length > 0 ? (
                            filteredData.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.id}</TableCell>
                                    <TableCell className="font-semibold">{item.disease}</TableCell>
                                    <TableCell>{item.cases}</TableCell>
                                    <TableCell>
                                        <span className="px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700">
                                            {item.department}
                                        </span>
                                    </TableCell>
                                    <TableCell>{item.ageGroup}</TableCell>
                                    <TableCell>{item.gender}</TableCell>
                                    <TableCell>{item.period}</TableCell>
                                    <TableCell>
                                        {item.trend !== undefined && (
                                            <TrendIndicator value={item.trend} />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs ${item.riskFactor === 'High'
                                                ? 'bg-red-100 text-red-800'
                                                : item.riskFactor === 'Medium'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-green-100 text-green-800'
                                            }`}>
                                            {item.riskFactor}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 px-2 text-blue-600"
                                            onClick={() => onViewDetails(item.id)}
                                        >
                                            <FileText size={14} className="mr-1" />
                                            Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={10} className="text-center py-4 text-gray-500">
                                    No disease prevalence data found matching your criteria.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                {filteredData.length > 0 && (
                    <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                        <div>
                            Showing <span className="font-medium">{filteredData.length}</span> of{" "}
                            <span className="font-medium">{totalCount}</span> diseases
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default DiseasePrevalenceTable;
