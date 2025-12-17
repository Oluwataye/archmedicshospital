import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { FileText, User, Calendar, Clock } from 'lucide-react';

interface ConsultNote {
    id: string;
    patient_id: string;
    provider_id: string;
    provider_name: string;
    record_date: string;
    title: string;
    content: string | {
        subjective: string;
        objective: string;
        assessment: string;
        plan: string;
    };
    status: 'draft' | 'final' | 'amended';
    created_at: string;
    updated_at: string;
    amendment_reason?: string;
    attachments?: Array<{ name: string; url: string; type: string }>;
}

interface ViewConsultNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    note: ConsultNote | null;
}

export default function ViewConsultNoteModal({
    isOpen,
    onClose,
    note
}: ViewConsultNoteModalProps) {
    if (!note) return null;

    const content = typeof note.content === 'string'
        ? JSON.parse(note.content)
        : note.content;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {note.title}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Metadata */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <Label className="text-xs text-muted-foreground">Provider</Label>
                                <p className="font-medium">{note.provider_name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <Label className="text-xs text-muted-foreground">Date</Label>
                                <p className="font-medium">
                                    {format(new Date(note.record_date), 'MMM d, yyyy h:mm a')}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <Label className="text-xs text-muted-foreground">Last Updated</Label>
                                <p className="font-medium">
                                    {format(new Date(note.updated_at), 'MMM d, yyyy h:mm a')}
                                </p>
                            </div>
                        </div>
                        <div>
                            <Label className="text-xs text-muted-foreground">Status</Label>
                            <div className="mt-1">
                                <Badge
                                    variant={
                                        note.status === 'final' ? 'default' :
                                            note.status === 'draft' ? 'secondary' :
                                                'outline'
                                    }
                                >
                                    {note.status}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* SOAP Note Content */}
                    <div className="space-y-4">
                        {/* Subjective */}
                        <div className="border-l-4 border-blue-500 pl-4">
                            <Label className="text-sm font-semibold text-blue-700">
                                S - Subjective
                            </Label>
                            <p className="mt-2 text-sm whitespace-pre-wrap">
                                {content.subjective}
                            </p>
                        </div>

                        {/* Objective */}
                        <div className="border-l-4 border-green-500 pl-4">
                            <Label className="text-sm font-semibold text-green-700">
                                O - Objective
                            </Label>
                            <p className="mt-2 text-sm whitespace-pre-wrap">
                                {content.objective}
                            </p>
                        </div>

                        {/* Assessment */}
                        <div className="border-l-4 border-orange-500 pl-4">
                            <Label className="text-sm font-semibold text-orange-700">
                                A - Assessment
                            </Label>
                            <p className="mt-2 text-sm whitespace-pre-wrap">
                                {content.assessment}
                            </p>
                        </div>

                        {/* Plan */}
                        <div className="border-l-4 border-purple-500 pl-4">
                            <Label className="text-sm font-semibold text-purple-700">
                                P - Plan
                            </Label>
                            <p className="mt-2 text-sm whitespace-pre-wrap">
                                {content.plan}
                            </p>
                        </div>
                    </div>

                    {/* Attachments */}
                    {note.attachments && note.attachments.length > 0 && (
                        <div className="space-y-2 border-t pt-4">
                            <Label className="text-sm font-semibold">Attachments</Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {note.attachments.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-md border">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                            <span className="text-sm truncate">{file.name}</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 text-xs"
                                            onClick={() => window.open(file.url, '_blank')}
                                        >
                                            View
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Amendment Reason (if amended) */}
                    {note.status === 'amended' && note.amendment_reason && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <Label className="text-sm font-semibold text-yellow-800">
                                Amendment Reason
                            </Label>
                            <p className="mt-2 text-sm text-yellow-900">
                                {note.amendment_reason}
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button onClick={onClose}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    );
}
