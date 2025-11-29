import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Activity, Plus, Thermometer, Heart, Wind } from 'lucide-react';

interface VitalSignsTabProps {
    patientId: string;
    patientName: string;
    vitalSigns: any; // In a real app, this would be a history array
    onAddRecordClick: () => void;
}

const VitalSignsTab: React.FC<VitalSignsTabProps> = ({ patientId, patientName, vitalSigns, onAddRecordClick }) => {
    // Mock history data since the prop passed is just the latest
    const history = [
        { date: 'Today, 10:30 AM', bp: '120/80', hr: '72', temp: '98.6', o2: '98%', weight: '70 kg' },
        { date: 'Apr 22, 2025', bp: '118/78', hr: '70', temp: '98.4', o2: '99%', weight: '70.5 kg' },
        { date: 'Mar 15, 2025', bp: '122/82', hr: '75', temp: '98.7', o2: '97%', weight: '71 kg' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Vital Signs History
                </h3>
                <Button onClick={onAddRecordClick} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Vitals
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Blood Pressure</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{vitalSigns.bloodPressure || '--/--'}</div>
                        <p className="text-xs text-muted-foreground">mmHg</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Heart className="h-4 w-4" /> Heart Rate
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{vitalSigns.heartRate || '--'}</div>
                        <p className="text-xs text-muted-foreground">bpm</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Thermometer className="h-4 w-4" /> Temperature
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{vitalSigns.temperature || '--'}</div>
                        <p className="text-xs text-muted-foreground">°F</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Wind className="h-4 w-4" /> O2 Saturation
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{vitalSigns.oxygenSaturation || '--'}%</div>
                        <p className="text-xs text-muted-foreground">SpO2</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date & Time</TableHead>
                                <TableHead>Blood Pressure</TableHead>
                                <TableHead>Heart Rate</TableHead>
                                <TableHead>Temperature</TableHead>
                                <TableHead>O2 Saturation</TableHead>
                                <TableHead>Weight</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {history.map((record, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{record.date}</TableCell>
                                    <TableCell>{record.bp}</TableCell>
                                    <TableCell>{record.hr} bpm</TableCell>
                                    <TableCell>{record.temp} °F</TableCell>
                                    <TableCell>{record.o2}</TableCell>
                                    <TableCell>{record.weight}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default VitalSignsTab;
