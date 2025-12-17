import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, Heart, Thermometer, Wind, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    getBPStatus,
    getHRStatus,
    getTempStatus,
    getO2Status,
    getVitalCardClasses,
    getVitalTextColor
} from '@/utils/vitalSignsUtils';

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
    // Calculate statuses using utility functions
    const bpStatus = getBPStatus(bloodPressure);
    const hrStatus = getHRStatus(heartRate);
    const tempStatus = getTempStatus(temperature);
    const o2Status = getO2Status(oxygenSaturation);

    return (
        <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <Activity className="h-5 w-5 text-primary mr-2" />
                Latest Vital Signs
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Blood Pressure Card */}
                <Card className={cn(getVitalCardClasses(bpStatus))}>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Activity className="h-4 w-4 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">Blood Pressure</span>
                            </div>
                            {(bpStatus === 'danger' || bpStatus === 'borderline') && (
                                <AlertTriangle className={cn("h-4 w-4", bpStatus === 'danger' ? "text-red-600" : "text-amber-600")} />
                            )}
                        </div>
                        <div className={cn('text-xl font-bold', getVitalTextColor(bpStatus))}>{bloodPressure}</div>
                        <span className="text-xs text-muted-foreground">mmHg</span>
                        <div className="text-xs mt-1 font-medium">
                            {bpStatus === 'normal' && <span className="text-green-600">Normal</span>}
                            {bpStatus === 'borderline' && <span className="text-amber-600">Borderline</span>}
                            {bpStatus === 'danger' && <span className="text-red-600">Abnormal</span>}
                        </div>
                    </CardContent>
                </Card>

                {/* Heart Rate Card */}
                <Card className={cn(getVitalCardClasses(hrStatus))}>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Heart className="h-4 w-4 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">Heart Rate</span>
                            </div>
                            {(hrStatus === 'danger' || hrStatus === 'borderline') && (
                                <AlertTriangle className={cn("h-4 w-4", hrStatus === 'danger' ? "text-red-600" : "text-amber-600")} />
                            )}
                        </div>
                        <div className={cn('text-xl font-bold', getVitalTextColor(hrStatus))}>{heartRate}</div>
                        <span className="text-xs text-muted-foreground">bpm</span>
                        <div className="text-xs mt-1 font-medium">
                            {hrStatus === 'normal' && <span className="text-green-600">Normal</span>}
                            {hrStatus === 'borderline' && <span className="text-amber-600">Borderline</span>}
                            {hrStatus === 'danger' && <span className="text-red-600">Abnormal</span>}
                        </div>
                    </CardContent>
                </Card>

                {/* Temperature Card */}
                <Card className={cn(getVitalCardClasses(tempStatus))}>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Thermometer className="h-4 w-4 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">Temperature</span>
                            </div>
                            {(tempStatus === 'danger' || tempStatus === 'borderline') && (
                                <AlertTriangle className={cn("h-4 w-4", tempStatus === 'danger' ? "text-red-600" : "text-amber-600")} />
                            )}
                        </div>
                        <div className={cn('text-xl font-bold', getVitalTextColor(tempStatus))}>{temperature}</div>
                        <span className="text-xs text-muted-foreground">°F</span>
                        <div className="text-xs mt-1 font-medium">
                            {tempStatus === 'normal' && <span className="text-green-600">Normal</span>}
                            {tempStatus === 'borderline' && <span className="text-amber-600">Borderline</span>}
                            {tempStatus === 'danger' && <span className="text-red-600">Abnormal</span>}
                        </div>
                    </CardContent>
                </Card>

                {/* O2 Saturation Card */}
                <Card className={cn(getVitalCardClasses(o2Status))}>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Wind className="h-4 w-4 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">O2 Saturation</span>
                            </div>
                            {(o2Status === 'danger' || o2Status === 'borderline') && (
                                <AlertTriangle className={cn("h-4 w-4", o2Status === 'danger' ? "text-red-600" : "text-amber-600")} />
                            )}
                        </div>
                        <div className={cn('text-xl font-bold', getVitalTextColor(o2Status))}>{oxygenSaturation}%</div>
                        <span className="text-xs text-muted-foreground">SpO2</span>
                        <div className="text-xs mt-1 font-medium">
                            {o2Status === 'normal' && <span className="text-green-600">Normal</span>}
                            {o2Status === 'borderline' && <span className="text-amber-600">Borderline</span>}
                            {o2Status === 'danger' && <span className="text-red-600">Critical</span>}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Last recorded: {recordedTime}</p>
        </div>
    );
};

export default PatientVitals;
