import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Plus, ShieldAlert } from 'lucide-react';

interface AllergiesTabProps {
    allergies: any[];
    onAddRecordClick: () => void;
}

const AllergiesTab: React.FC<AllergiesTabProps> = ({ allergies, onAddRecordClick }) => {
    // Mock data if empty
    const displayAllergies = allergies && allergies.length > 0 ? allergies : [
        { id: 1, allergen: 'Penicillin', reaction: 'Hives, Swelling', severity: 'High', date: '2020-05-10', status: 'Active' },
        { id: 2, allergen: 'Peanuts', reaction: 'Anaphylaxis', severity: 'Critical', date: '2018-02-15', status: 'Active' },
        { id: 3, allergen: 'Latex', reaction: 'Rash', severity: 'Moderate', date: '2021-11-20', status: 'Active' },
    ];

    const getSeverityColor = (severity: string) => {
        switch (severity.toLowerCase()) {
            case 'critical': return 'destructive';
            case 'high': return 'destructive';
            case 'moderate': return 'secondary'; // orange-ish in some themes, or just secondary
            default: return 'outline';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-destructive" />
                    Allergies & Intolerances
                </h3>
                <Button onClick={onAddRecordClick} size="sm" variant="outline" className="border-destructive/50 hover:bg-destructive/10 text-destructive">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Allergy
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Allergen</TableHead>
                                <TableHead>Reaction</TableHead>
                                <TableHead>Severity</TableHead>
                                <TableHead>Date Identified</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {displayAllergies.map((allergy) => (
                                <TableRow key={allergy.id}>
                                    <TableCell className="font-medium">{allergy.allergen}</TableCell>
                                    <TableCell>{allergy.reaction}</TableCell>
                                    <TableCell>
                                        <Badge variant={getSeverityColor(allergy.severity) as any}>
                                            {allergy.severity}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{allergy.date}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                                            {allergy.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default AllergiesTab;
