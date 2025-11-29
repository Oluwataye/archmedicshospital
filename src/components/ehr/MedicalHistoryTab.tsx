import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { History, Plus, FileClock, Activity } from 'lucide-react';

interface MedicalHistoryTabProps {
    medicalHistory: any[];
    onAddRecordClick: () => void;
}

const MedicalHistoryTab: React.FC<MedicalHistoryTabProps> = ({ medicalHistory, onAddRecordClick }) => {
    // Mock data
    const conditions = [
        { id: 1, name: 'Hypertension', diagnosed: '2015', status: 'Active', notes: 'Managed with medication' },
        { id: 2, name: 'Type 2 Diabetes', diagnosed: '2018', status: 'Active', notes: 'Diet controlled' },
        { id: 3, name: 'Asthma', diagnosed: 'Childhood', status: 'Controlled', notes: 'Occasional inhaler use' },
    ];

    const familyHistory = [
        { relation: 'Father', condition: 'Heart Disease', onset: 'Age 60' },
        { relation: 'Mother', condition: 'Breast Cancer', onset: 'Age 55' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <History className="h-5 w-5 text-primary" />
                    Medical History
                </h3>
                <Button onClick={onAddRecordClick} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add History
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <Activity className="h-4 w-4" /> Chronic Conditions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {conditions.map((condition) => (
                            <div key={condition.id} className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0">
                                <div>
                                    <h4 className="font-medium">{condition.name}</h4>
                                    <p className="text-sm text-muted-foreground">Diagnosed: {condition.diagnosed}</p>
                                    <p className="text-sm mt-1">{condition.notes}</p>
                                </div>
                                <Badge variant={condition.status === 'Active' ? 'default' : 'secondary'}>
                                    {condition.status}
                                </Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <FileClock className="h-4 w-4" /> Family History
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {familyHistory.map((item, index) => (
                                <div key={index} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                                    <div>
                                        <h4 className="font-medium">{item.condition}</h4>
                                        <p className="text-sm text-muted-foreground">{item.relation}</p>
                                    </div>
                                    <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                                        Onset: {item.onset}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default MedicalHistoryTab;
