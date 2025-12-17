import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ApiService } from '@/services/apiService';
import { Loader2, FileText, Calendar, User } from "lucide-react";

interface MedicalHistoryModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    patientId: string;
    patientName: string;
}

interface MedicalRecord {
    id: string;
    record_type: string;
    record_date: string;
    title: string;
    content: string;
    provider_first_name: string;
    provider_last_name: string;
    status: string;
}

const MedicalHistoryModal: React.FC<MedicalHistoryModalProps> = ({
    open,
    onOpenChange,
    patientId,
    patientName
}) => {
    const [records, setRecords] = useState<MedicalRecord[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && patientId) {
            fetchHistory();
        }
    }, [open, patientId]);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            // Fetch both medical records and vital signs
            const [medicalRecords, vitalSigns] = await Promise.all([
                ApiService.getMedicalRecords({ patient_id: patientId }),
                ApiService.getPatientVitalHistory(patientId)
            ]);

            // Ensure both are arrays
            const records = Array.isArray(medicalRecords) ? medicalRecords : [];
            const vitals = Array.isArray(vitalSigns) ? vitalSigns : [];

            // Transform vital signs to match medical record format
            const vitalRecords = vitals.map(v => ({
                id: `vital-${v.id}`,
                record_type: 'vital_signs',
                record_date: v.recorded_at,
                title: 'Vital Signs',
                content: `BP: ${v.systolic_bp}/${v.diastolic_bp} mmHg, HR: ${v.heart_rate} bpm, Temp: ${v.temperature}°F, SpO2: ${v.oxygen_saturation}%${v.weight ? `, Weight: ${v.weight} kg` : ''}`,
                provider_first_name: v.recorder_first_name || 'Unknown',
                provider_last_name: v.recorder_last_name || 'User',
                status: 'completed'
            }));

            // Combine and sort by date (most recent first)
            const combined = [...records, ...vitalRecords].sort((a, b) =>
                new Date(b.record_date).getTime() - new Date(a.record_date).getTime()
            );

            setRecords(combined);
        } catch (error) {
            console.error('Error fetching medical history:', error);
            setRecords([]);
        } finally {
            setLoading(false);
        }
    };

    const getTypeColor = (type: string) => {
        switch (type.toLowerCase()) {
            case 'diagnosis': return 'bg-red-100 text-red-800';
            case 'prescription': return 'bg-green-100 text-green-800';
            case 'lab_result': return 'bg-blue-100 text-blue-800';
            case 'procedure': return 'bg-purple-100 text-purple-800';
            case 'vital_signs': return 'bg-cyan-100 text-cyan-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle>Medical History - {patientName}</DialogTitle>
                    <div className="sr-only">
                        <DialogDescription>
                            A detailed list of medical records for {patientName}.
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <ScrollArea className="h-[60vh] pr-4">
                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : records.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            No medical records found for this patient.
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {records.map((record) => (
                                <div key={record.id} className="flex gap-4 border-b pb-4 last:border-0">
                                    <div className="flex-none w-32 text-sm text-muted-foreground pt-1">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {new Date(record.record_date).toLocaleDateString()}
                                        </div>
                                        <div className="mt-1 text-xs">
                                            {new Date(record.record_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-semibold text-lg">{record.title}</h4>
                                            <Badge className={getTypeColor(record.record_type)} variant="secondary">
                                                {record.record_type.replace('_', ' ')}
                                            </Badge>
                                        </div>

                                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                            {record.content}
                                        </p>

                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                                            <User className="h-3 w-3" />
                                            <span>Dr. {record.provider_first_name} {record.provider_last_name}</span>
                                            {record.status && (
                                                <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded-full">
                                                    {record.status}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default MedicalHistoryModal;
