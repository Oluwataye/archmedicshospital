import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Activity, Plus, Thermometer, Heart, Wind, AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ApiService } from '@/services/apiService';
import { toast } from 'sonner';

interface VitalSignsTabProps {
    patientId: string;
    patientName: string;
    vitalSigns: any;
    onAddRecordClick: () => void;
}

interface VitalRecord {
    id: string;
    recorded_at: string;
    systolic_bp: number;
    diastolic_bp: number;
    heart_rate: number;
    temperature: number;
    oxygen_saturation: number;
    weight?: number;
    respiratory_rate?: number;
    recorder_first_name?: string;
    recorder_last_name?: string;
}

// Vital sign ranges for color-coding
const VITAL_RANGES = {
    bloodPressure: {
        systolic: {
            normal: { min: 90, max: 120 },
            borderline: { min: 121, max: 139 },
            // < 90 or >= 140 is danger
        },
        diastolic: {
            normal: { min: 60, max: 80 },
            borderline: { min: 81, max: 89 },
            // < 60 or >= 90 is danger
        }
    },
    heartRate: {
        normal: { min: 60, max: 100 },
        borderline: { min: 50, max: 110 },
        // < 50 or > 110 is danger
    },
    temperature: {
        normal: { min: 97.0, max: 99.0 },
        borderline: { min: 96.0, max: 100.4 },
        // < 96.0 or > 100.4 is danger
    },
    oxygenSaturation: {
        normal: { min: 95, max: 100 },
        borderline: { min: 90, max: 94 },
        // < 90 is danger
    }
};

const VitalSignsTab: React.FC<VitalSignsTabProps> = ({ patientId, patientName, vitalSigns, onAddRecordClick }) => {
    const [history, setHistory] = useState<VitalRecord[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (patientId) {
            fetchVitalHistory();
        }
    }, [patientId]);

    const fetchVitalHistory = async () => {
        try {
            setLoading(true);
            const data = await ApiService.getPatientVitalHistory(patientId);
            setHistory(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching vital history:', error);
            toast.error('Failed to load vital signs history');
            setHistory([]);
        } finally {
            setLoading(false);
        }
    };
    const parseBP = (bp: string) => {
        if (!bp || bp === '--/--') return { systolic: null, diastolic: null };
        const parts = bp.split('/');
        return {
            systolic: parseInt(parts[0]),
            diastolic: parseInt(parts[1])
        };
    };

    // Get status for blood pressure
    const getBPStatus = (bp: string): 'normal' | 'borderline' | 'danger' => {
        const { systolic, diastolic } = parseBP(bp);
        if (!systolic || !diastolic) return 'normal';

        const systolicDanger = systolic < 90 || systolic >= 140;
        const diastolicDanger = diastolic < 60 || diastolic >= 90;

        if (systolicDanger || diastolicDanger) return 'danger';

        const systolicBorderline = systolic >= VITAL_RANGES.bloodPressure.systolic.borderline.min &&
            systolic <= VITAL_RANGES.bloodPressure.systolic.borderline.max;
        const diastolicBorderline = diastolic >= VITAL_RANGES.bloodPressure.diastolic.borderline.min &&
            diastolic <= VITAL_RANGES.bloodPressure.diastolic.borderline.max;

        if (systolicBorderline || diastolicBorderline) return 'borderline';

        return 'normal';
    };

    // Get status for heart rate
    const getHRStatus = (hr: string): 'normal' | 'borderline' | 'danger' => {
        const value = parseInt(hr);
        if (!value || isNaN(value)) return 'normal';

        if (value < 50 || value > 110) return 'danger';
        if ((value >= 50 && value < 60) || (value > 100 && value <= 110)) return 'borderline';
        return 'normal';
    };

    // Get status for temperature
    const getTempStatus = (temp: string): 'normal' | 'borderline' | 'danger' => {
        const value = parseFloat(temp);
        if (!value || isNaN(value)) return 'normal';

        if (value < 96.0 || value > 100.4) return 'danger';
        if ((value >= 96.0 && value < 97.0) || (value > 99.0 && value <= 100.4)) return 'borderline';
        return 'normal';
    };

    // Get status for oxygen saturation
    const getO2Status = (o2: string): 'normal' | 'borderline' | 'danger' => {
        const value = parseInt(o2);
        if (!value || isNaN(value)) return 'normal';

        if (value < 90) return 'danger';
        if (value >= 90 && value < 95) return 'borderline';
        return 'normal';
    };

    // Get card styling based on status
    const getCardClasses = (status: 'normal' | 'borderline' | 'danger') => {
        switch (status) {
            case 'danger':
                return 'border-red-500 bg-red-50 dark:bg-red-950/20';
            case 'borderline':
                return 'border-amber-500 bg-amber-50 dark:bg-amber-950/20';
            case 'normal':
                return 'border-green-500 bg-green-50 dark:bg-green-950/20';
            default:
                return '';
        }
    };

    // Get text color based on status
    const getTextColor = (status: 'normal' | 'borderline' | 'danger') => {
        switch (status) {
            case 'danger':
                return 'text-red-700 dark:text-red-400';
            case 'borderline':
                return 'text-amber-700 dark:text-amber-400';
            case 'normal':
                return 'text-green-700 dark:text-green-400';
            default:
                return '';
        }
    };

    // Calculate statuses
    const bpStatus = getBPStatus(vitalSigns.bloodPressure);
    const hrStatus = getHRStatus(vitalSigns.heartRate);
    const tempStatus = getTempStatus(vitalSigns.temperature);
    const o2Status = getO2Status(vitalSigns.oxygenSaturation);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Vital Signs History
                </h3>
                {onAddRecordClick && (
                    <Button onClick={onAddRecordClick} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Vitals
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Blood Pressure Card */}
                <Card className={cn('border-2', getCardClasses(bpStatus))}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                            Blood Pressure
                            {bpStatus === 'danger' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                            {bpStatus === 'borderline' && <AlertTriangle className="h-4 w-4 text-amber-600" />}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={cn('text-2xl font-bold', getTextColor(bpStatus))}>
                            {vitalSigns.bloodPressure || '--/--'}
                        </div>
                        <p className="text-xs text-muted-foreground">mmHg</p>
                        <p className="text-xs mt-1 font-medium">
                            {bpStatus === 'normal' && <span className="text-green-600">Normal</span>}
                            {bpStatus === 'borderline' && <span className="text-amber-600">Borderline</span>}
                            {bpStatus === 'danger' && <span className="text-red-600">Abnormal</span>}
                        </p>
                    </CardContent>
                </Card>

                {/* Heart Rate Card */}
                <Card className={cn('border-2', getCardClasses(hrStatus))}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <Heart className="h-4 w-4" /> Heart Rate
                            </span>
                            {hrStatus === 'danger' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                            {hrStatus === 'borderline' && <AlertTriangle className="h-4 w-4 text-amber-600" />}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={cn('text-2xl font-bold', getTextColor(hrStatus))}>
                            {vitalSigns.heartRate || '--'}
                        </div>
                        <p className="text-xs text-muted-foreground">bpm</p>
                        <p className="text-xs mt-1 font-medium">
                            {hrStatus === 'normal' && <span className="text-green-600">Normal</span>}
                            {hrStatus === 'borderline' && <span className="text-amber-600">Borderline</span>}
                            {hrStatus === 'danger' && <span className="text-red-600">Abnormal</span>}
                        </p>
                    </CardContent>
                </Card>

                {/* Temperature Card */}
                <Card className={cn('border-2', getCardClasses(tempStatus))}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <Thermometer className="h-4 w-4" /> Temperature
                            </span>
                            {tempStatus === 'danger' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                            {tempStatus === 'borderline' && <AlertTriangle className="h-4 w-4 text-amber-600" />}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={cn('text-2xl font-bold', getTextColor(tempStatus))}>
                            {vitalSigns.temperature || '--'}
                        </div>
                        <p className="text-xs text-muted-foreground">°F</p>
                        <p className="text-xs mt-1 font-medium">
                            {tempStatus === 'normal' && <span className="text-green-600">Normal</span>}
                            {tempStatus === 'borderline' && <span className="text-amber-600">Borderline</span>}
                            {tempStatus === 'danger' && <span className="text-red-600">Abnormal</span>}
                        </p>
                    </CardContent>
                </Card>

                {/* O2 Saturation Card */}
                <Card className={cn('border-2', getCardClasses(o2Status))}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <Wind className="h-4 w-4" /> O2 Saturation
                            </span>
                            {o2Status === 'danger' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                            {o2Status === 'borderline' && <AlertTriangle className="h-4 w-4 text-amber-600" />}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={cn('text-2xl font-bold', getTextColor(o2Status))}>
                            {vitalSigns.oxygenSaturation || '--'}%
                        </div>
                        <p className="text-xs text-muted-foreground">SpO2</p>
                        <p className="text-xs mt-1 font-medium">
                            {o2Status === 'normal' && <span className="text-green-600">Normal</span>}
                            {o2Status === 'borderline' && <span className="text-amber-600">Borderline</span>}
                            {o2Status === 'danger' && <span className="text-red-600">Critical</span>}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : history.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Activity className="h-12 w-12 mx-auto mb-3 opacity-20" />
                            <p>No vital signs recorded yet</p>
                            <p className="text-sm mt-1">Click "Add Vitals" to record the first entry</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date & Time</TableHead>
                                    <TableHead>Blood Pressure</TableHead>
                                    <TableHead>Heart Rate</TableHead>
                                    <TableHead>Temperature</TableHead>
                                    <TableHead>O2 Saturation</TableHead>
                                    <TableHead>Weight</TableHead>
                                    <TableHead>Recorded By</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {history.map((record) => (
                                    <TableRow key={record.id}>
                                        <TableCell className="font-medium">
                                            <div>{new Date(record.recorded_at).toLocaleDateString()}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {new Date(record.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {record.systolic_bp && record.diastolic_bp
                                                ? `${record.systolic_bp}/${record.diastolic_bp} mmHg`
                                                : '--'}
                                        </TableCell>
                                        <TableCell>
                                            {record.heart_rate ? `${record.heart_rate} bpm` : '--'}
                                        </TableCell>
                                        <TableCell>
                                            {record.temperature ? `${record.temperature} °F` : '--'}
                                        </TableCell>
                                        <TableCell>
                                            {record.oxygen_saturation ? `${record.oxygen_saturation}%` : '--'}
                                        </TableCell>
                                        <TableCell>
                                            {record.weight ? `${record.weight} kg` : '--'}
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {record.recorder_first_name && record.recorder_last_name
                                                ? `${record.recorder_first_name} ${record.recorder_last_name}`
                                                : 'Unknown'}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default VitalSignsTab;
