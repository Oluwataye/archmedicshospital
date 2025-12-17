import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import {
    History,
    Plus,
    FileText,
    User,
    Calendar,
    Clock,
    Stethoscope,
    ChevronRight,
    Pill,
    TestTube,
    Activity,
    Eye,
    AlertTriangle
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface MedicalHistoryTabProps {
    medicalHistory: any[];
    onAddRecordClick: () => void;
}

const MedicalHistoryTab: React.FC<MedicalHistoryTabProps> = ({ medicalHistory, onAddRecordClick }) => {
    const [viewRecord, setViewRecord] = useState<any | null>(null);

    // Sort history by date desc just in case
    const sortedHistory = [...medicalHistory].sort((a, b) =>
        new Date(b.record_date).getTime() - new Date(a.record_date).getTime()
    );

    const getRecordIcon = (type: string) => {
        switch (type?.toLowerCase()) {
            case 'prescription': return <Pill className="h-4 w-4" />;
            case 'lab_result': return <TestTube className="h-4 w-4" />;
            case 'vital-signs': return <Activity className="h-4 w-4" />;
            case 'allergy': return <AlertTriangle className="h-4 w-4" />;
            case 'progress_note': return <FileText className="h-4 w-4" />;
            case 'diagnosis': return <Stethoscope className="h-4 w-4" />;
            default: return <FileText className="h-4 w-4" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'final':
            case 'completed':
            case 'dispensed':
                return 'default'; // primary/black
            case 'active':
            case 'ordered':
            case 'draft':
                return 'secondary'; // gray
            case 'amended':
            case 'cancelled':
            case 'critical': // for labs
            case 'severe': // for allergies
                return 'destructive'; // red
            default: return 'outline';
        }
    };

    const renderContent = (record: any) => {
        let contentDisplay = record.content;

        // Allergy
        if (record.record_type === 'allergy') {
            try {
                const allergy = JSON.parse(record.content);
                return (
                    <div className="grid gap-1">
                        <div>
                            <span className="font-semibold text-xs uppercase text-muted-foreground mr-2">Allergen:</span>
                            <span className="font-medium">{allergy.allergen}</span>
                        </div>
                        {allergy.severity && (
                            <div>
                                <span className="font-semibold text-xs uppercase text-muted-foreground mr-2">Severity:</span>
                                <Badge variant={allergy.severity.toLowerCase() === 'severe' ? 'destructive' : 'outline'} className="text-[10px] h-5 px-1 py-0">
                                    {allergy.severity}
                                </Badge>
                            </div>
                        )}
                        {allergy.reaction && (
                            <div>
                                <span className="font-semibold text-xs uppercase text-muted-foreground mr-2">Reaction:</span>
                                <span className="text-sm">{allergy.reaction}</span>
                            </div>
                        )}
                        {allergy.notes && (
                            <div className="text-xs text-muted-foreground mt-1 italic">
                                "{allergy.notes}"
                            </div>
                        )}
                    </div>
                );
            } catch (e) { /* fallback */ }
        }

        // Custom handling based on record type
        if (record.record_type === 'prescription') {
            try {
                const meds = JSON.parse(record.content);
                if (Array.isArray(meds)) {
                    return (
                        <div className="space-y-1">
                            <span className="font-medium text-xs uppercase text-muted-foreground block mb-1">Prescribed Medications:</span>
                            <ul className="list-disc pl-4 space-y-1">
                                {meds.map((med: any, i: number) => (
                                    <li key={i} className="text-sm">
                                        <span className="font-medium">{med.name}</span>
                                        {med.dosage && <span className="text-muted-foreground"> - {med.dosage}</span>}
                                        {med.frequency && <span className="text-muted-foreground"> ({med.frequency})</span>}
                                        {med.duration && <span className="text-muted-foreground"> for {med.duration}</span>}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                }
            } catch (e) { /* fallback to string */ }
        }

        // Try to parse JSON content if it affects readability (some notes are JSON stringified)
        try {
            const parsed = JSON.parse(record.content);
            if (typeof parsed === 'object' && parsed !== null) {
                // If it's a structured note (e.g. SOAP), format it nicely
                if (parsed.subjective || parsed.objective || parsed.assessment || parsed.plan) {
                    return (
                        <div className="grid gap-2 mt-2">
                            {parsed.subjective && <div><span className="font-semibold text-xs uppercase text-muted-foreground">Subjective:</span> <span className="text-sm">{parsed.subjective}</span></div>}
                            {parsed.objective && <div><span className="font-semibold text-xs uppercase text-muted-foreground">Objective:</span> <span className="text-sm">{parsed.objective}</span></div>}
                            {parsed.assessment && <div><span className="font-semibold text-xs uppercase text-muted-foreground">Assessment:</span> <span className="text-sm">{parsed.assessment}</span></div>}
                            {parsed.plan && <div><span className="font-semibold text-xs uppercase text-muted-foreground">Plan:</span> <span className="text-sm">{parsed.plan}</span></div>}
                        </div>
                    );
                } else if (Array.isArray(parsed)) {
                    // Generic array list
                    return (
                        <ul className="list-disc pl-4">
                            {parsed.map((item: any, i: number) => (
                                <li key={i}>{typeof item === 'object' ? JSON.stringify(item) : item}</li>
                            ))}
                        </ul>
                    );
                } else {
                    // Fallback for other objects
                    return <pre className="text-xs bg-muted p-2 rounded overflow-auto">{JSON.stringify(parsed, null, 2)}</pre>;
                }
            } else {
                contentDisplay = parsed; // It was just a quoted string
            }
        } catch (e) {
            // Content is plain text, keep as is
        }

        return typeof contentDisplay === 'string' ? (
            <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                {contentDisplay}
            </div>
        ) : contentDisplay;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        <History className="h-5 w-5 text-primary" />
                        Patient Encounter History
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Comprehensive timeline including notes, prescriptions, labs, and vitals.
                    </p>
                </div>
            </div>

            {sortedHistory.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                        <History className="h-12 w-12 text-muted-foreground/30 mb-4" />
                        <h3 className="text-lg font-medium text-muted-foreground">No medical history records found</h3>
                        <p className="text-sm text-muted-foreground/70 mt-1">
                            New consultations, prescriptions, and lab results will appear here.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="relative pl-6 border-l-2 border-muted space-y-8">
                    {sortedHistory.map((record, index) => {
                        return (
                            <div key={record.id || index} className="relative">
                                {/* Timeline Dot */}
                                <div className={`absolute -left-[31px] top-2 h-4 w-4 rounded-full border-4 border-background ${record.record_type === 'vital-signs' ? 'bg-green-500' :
                                    record.record_type === 'prescription' ? 'bg-blue-500' :
                                        record.record_type === 'lab_result' ? 'bg-purple-500' :
                                            'bg-primary'
                                    }`} />

                                <Card className="hover:shadow-md transition-shadow duration-200">
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="flex items-center gap-1">
                                                        {getRecordIcon(record.record_type)}
                                                        <span className="capitalize">{record.record_type?.replace('_', ' ').replace('-', ' ') || 'Record'}</span>
                                                    </Badge>
                                                    <Badge variant={getStatusColor(record.status)} className="capitalize">
                                                        {record.status}
                                                    </Badge>
                                                </div>
                                                <CardTitle className="text-lg text-primary mt-2">
                                                    {record.title || 'Untitled Record'}
                                                </CardTitle>
                                                <CardDescription className="flex items-center gap-4 text-xs">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        {record.record_date ? format(parseISO(record.record_date), 'MMMM d, yyyy') : 'Unknown Date'}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {record.record_date ? format(parseISO(record.record_date), 'h:mm a') : ''}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-primary/80">
                                                        <User className="h-3 w-3" />
                                                        {record.provider_first_name ? `Dr. ${record.provider_first_name} ${record.provider_last_name}` : 'Unknown Provider'}
                                                    </span>
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <Separator />
                                    <CardContent className="pt-4 text-sm leading-relaxed">
                                        <div className="line-clamp-3">
                                            {renderContent(record)}
                                        </div>

                                        {record.amendment_reason && (
                                            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-xs">
                                                <span className="font-bold text-yellow-800">Amendment Note:</span>
                                                <span className="text-yellow-700 ml-2">{record.amendment_reason}</span>
                                            </div>
                                        )}

                                        <div className="mt-4 flex justify-end">
                                            <Button variant="outline" size="sm" onClick={() => setViewRecord(record)}>
                                                <Eye className="h-4 w-4 mr-2" />
                                                View Details
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* View Details Dialog */}
            <Dialog open={!!viewRecord} onOpenChange={(open) => !open && setViewRecord(null)}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="flex items-center gap-1">
                                {viewRecord && getRecordIcon(viewRecord.record_type)}
                                <span className="capitalize">{viewRecord?.record_type?.replace('_', ' ').replace('-', ' ') || 'Record'}</span>
                            </Badge>
                            <Badge variant={viewRecord ? getStatusColor(viewRecord.status) : 'default'} className="capitalize">
                                {viewRecord?.status}
                            </Badge>
                        </div>
                        <DialogTitle>{viewRecord?.title}</DialogTitle>
                        <DialogDescription className="flex items-center gap-4 text-sm mt-2">
                            <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {viewRecord?.record_date ? format(parseISO(viewRecord.record_date), 'MMMM d, yyyy') : 'Unknown Date'}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {viewRecord?.record_date ? format(parseISO(viewRecord.record_date), 'h:mm a') : ''}
                            </span>
                            <span className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {viewRecord?.provider_first_name ? `Dr. ${viewRecord.provider_first_name} ${viewRecord.provider_last_name}` : 'Unknown Provider'}
                            </span>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        {viewRecord && (
                            <div className="space-y-4">
                                <div className="p-4 bg-muted/30 rounded-lg border">
                                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-primary" />
                                        Record Content
                                    </h4>
                                    <div className="text-sm">
                                        {renderContent(viewRecord)}
                                    </div>
                                </div>

                                {/* Raw Vitals Display if applicable */}
                                {viewRecord.record_type === 'vital-signs' && viewRecord.raw_vitals && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {Object.entries(viewRecord.raw_vitals).map(([key, value]) => {
                                            if (['id', 'patient_id', 'recorded_by', 'recorded_at', 'created_at', 'notes'].includes(key)) return null;
                                            if (!value) return null;
                                            return (
                                                <div key={key} className="p-3 border rounded-md bg-card">
                                                    <span className="text-xs text-muted-foreground uppercase font-semibold block mb-1">
                                                        {key.replace(/_/g, ' ')}
                                                    </span>
                                                    <span className="text-lg font-medium">
                                                        {String(value)}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {viewRecord.amendment_reason && (
                                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-xs">
                                        <span className="font-bold text-yellow-800">Amendment Note:</span>
                                        <span className="text-yellow-700 ml-2">{viewRecord.amendment_reason}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setViewRecord(null)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default MedicalHistoryTab;
