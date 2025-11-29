import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, Heart, Thermometer, Wind } from 'lucide-react';

interface PatientVitalsProps {
    patientId: string;
    patientName: string;
    bloodPressure: string;
    heartRate: string;
    temperature: string;
    oxygenSaturation: string;
    recordedTime: string;
}

const PatientVitals: React.FC<PatientVitalsProps> = ({
    patientId,
    patientName,
    bloodPressure,
    heartRate,
    temperature,
    oxygenSaturation,
    recordedTime
}) => {
    return (
        <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Activity className="h-5 w-5 text-primary mr-2" />
                Latest Vital Signs
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Activity className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Blood Pressure</span>
                        </div>
                        <div className="text-xl font-bold">{bloodPressure}</div>
                        <span className="text-xs text-muted-foreground">mmHg</span>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Heart className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Heart Rate</span>
                        </div>
                        <div className="text-xl font-bold">{heartRate}</div>
                        <span className="text-xs text-muted-foreground">bpm</span>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Thermometer className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Temperature</span>
                        </div>
                        <div className="text-xl font-bold">{temperature}</div>
                        <span className="text-xs text-muted-foreground">°F</span>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <Wind className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">O2 Saturation</span>
                        </div>
                        <div className="text-xl font-bold">{oxygenSaturation}%</div>
                        <span className="text-xs text-muted-foreground">SpO2</span>
                    </CardContent>
                </Card>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Last recorded: {recordedTime}</p>
        </div>
    );
};

export default PatientVitals;
