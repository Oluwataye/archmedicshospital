import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface ConsultNote {
    id?: string;
    patient_id: string;
    title: string;
    content: {
        subjective: string;
        objective: string;
        assessment: string;
        plan: string;
    };
    status: 'draft' | 'final';
    amendment_reason?: string;
    attachments?: Array<{ name: string; url: string; type: string }>;
}

interface ConsultNoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (note: ConsultNote) => Promise<void>;
    patientId: string;
    patientName: string;
    editingNote?: ConsultNote | null;
    isEditMode?: boolean;
}

export default function ConsultNoteModal({
    isOpen,
    onClose,
    onSave,
    patientId,
    patientName,
    editingNote,
    isEditMode = false
}: ConsultNoteModalProps) {
    const [formData, setFormData] = useState<ConsultNote>({
        patient_id: patientId,
        title: '',
        content: {
            subjective: '',
            objective: '',
            assessment: '',
            plan: ''
        },
        status: 'draft',
        amendment_reason: '',
        attachments: []
    });

    const [saving, setSaving] = useState(false);

    // Load editing note data when modal opens in edit mode
    useEffect(() => {
        if (isEditMode && editingNote) {
            setFormData({
                id: editingNote.id,
                patient_id: editingNote.patient_id,
                title: editingNote.title,
                content: typeof editingNote.content === 'string'
                    ? JSON.parse(editingNote.content)
                    : editingNote.content,
                status: editingNote.status,
                amendment_reason: '',
                attachments: editingNote.attachments || []
            });
        } else {
            // Reset form for new note
            setFormData({
                patient_id: patientId,
                title: '',
                content: {
                    subjective: '',
                    objective: '',
                    assessment: '',
                    plan: ''
                },
                status: 'draft',
                amendment_reason: '',
                attachments: []
            });
        }
    }, [isEditMode, editingNote, patientId, isOpen]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleContentChange = (field: keyof ConsultNote['content'], value: string) => {
        setFormData(prev => ({
            ...prev,
            content: {
                ...prev.content,
                [field]: value
            }
        }));
    };

    const validateForm = (): boolean => {
        if (!formData.title.trim()) {
            toast.error('Please enter a title for the consult note');
            return false;
        }

        if (!formData.content.subjective.trim()) {
            toast.error('Please enter subjective findings');
            return false;
        }

        if (!formData.content.objective.trim()) {
            toast.error('Please enter objective findings');
            return false;
        }

        if (!formData.content.assessment.trim()) {
            toast.error('Please enter assessment');
            return false;
        }

        if (!formData.content.plan.trim()) {
            toast.error('Please enter treatment plan');
            return false;
        }

        if (isEditMode && editingNote?.status === 'final' && !formData.amendment_reason?.trim()) {
            toast.error('Please provide a reason for amending this final note');
            return false;
        }

        return true;
    };

    const handleSave = async (status: 'draft' | 'final') => {
        if (!validateForm()) return;

        try {
            setSaving(true);
            const noteToSave = {
                ...formData,
                status
            };

            await onSave(noteToSave);

            toast.success(
                isEditMode
                    ? `Consult note updated as ${status}`
                    : `Consult note created as ${status}`
            );

            onClose();
        } catch (error) {
            console.error('Error saving consult note:', error);
            toast.error('Failed to save consult note');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEditMode ? 'Edit Consult Note' : 'New Consult Note'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditMode
                            ? `Editing consult note for ${patientName}`
                            : `Create a new SOAP-formatted consult note for ${patientName}`}
                    </DialogDescription>
                </DialogHeader>

                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    {/* Patient Name (Read-only) */}
                    <div className="space-y-2">
                        <Label>Patient</Label>
                        <Input value={patientName} disabled className="bg-muted" />
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">
                            Title / Chief Complaint <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            placeholder="e.g., Follow-up Visit, Initial Consultation, Hypertension Review"
                            required
                        />
                    </div>

                    {/* SOAP Note Sections */}
                    <div className="border-t pt-4">
                        <h4 className="font-semibold mb-4">SOAP Note</h4>

                        {/* Subjective */}
                        <div className="space-y-2 mb-4">
                            <Label htmlFor="subjective">
                                S - Subjective <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="subjective"
                                value={formData.content.subjective}
                                onChange={(e) => handleContentChange('subjective', e.target.value)}
                                placeholder="Patient's complaints, symptoms, history of present illness, review of systems..."
                                rows={4}
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                What the patient tells you (symptoms, concerns, medical history)
                            </p>
                        </div>

                        {/* Objective */}
                        <div className="space-y-2 mb-4">
                            <Label htmlFor="objective">
                                O - Objective <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="objective"
                                value={formData.content.objective}
                                onChange={(e) => handleContentChange('objective', e.target.value)}
                                placeholder="Physical examination findings, vital signs, lab results, imaging findings..."
                                rows={4}
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                What you observe (physical exam, vital signs, test results)
                            </p>
                        </div>

                        {/* Assessment */}
                        <div className="space-y-2 mb-4">
                            <Label htmlFor="assessment">
                                A - Assessment <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="assessment"
                                value={formData.content.assessment}
                                onChange={(e) => handleContentChange('assessment', e.target.value)}
                                placeholder="Diagnosis, differential diagnosis, clinical impression, problem list..."
                                rows={4}
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                Your medical judgment (diagnosis, clinical impression)
                            </p>
                        </div>

                        {/* Plan */}
                        <div className="space-y-2 mb-4">
                            <Label htmlFor="plan">
                                P - Plan <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="plan"
                                value={formData.content.plan}
                                onChange={(e) => handleContentChange('plan', e.target.value)}
                                placeholder="Treatment plan, medications, tests ordered, follow-up instructions, patient education..."
                                rows={4}
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                What you will do (treatment, medications, follow-up)
                            </p>
                        </div>
                    </div>

                    {/* Amendment Reason (only for editing final notes) */}
                    {isEditMode && editingNote?.status === 'final' && (
                        <div className="space-y-2 border-t pt-4">
                            <Label htmlFor="amendment_reason">
                                Reason for Amendment <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id="amendment_reason"
                                value={formData.amendment_reason}
                                onChange={(e) => handleInputChange('amendment_reason', e.target.value)}
                                placeholder="Explain why this final note is being amended..."
                                rows={2}
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                Required when amending a final note for audit trail purposes
                            </p>
                        </div>
                    )}

                    {/* File Attachments */}
                    <div className="space-y-2 border-t pt-4">
                        <Label>Attachments</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                type="file"
                                multiple
                                className="cursor-pointer"
                                onChange={(e) => {
                                    if (e.target.files) {
                                        const newAttachments = Array.from(e.target.files).map(file => ({
                                            name: file.name,
                                            url: URL.createObjectURL(file), // Temporary local URL
                                            type: file.type
                                        }));
                                        setFormData(prev => ({
                                            ...prev,
                                            attachments: [...(prev.attachments || []), ...newAttachments]
                                        }));
                                    }
                                }}
                            />
                        </div>
                        {formData.attachments && formData.attachments.length > 0 && (
                            <div className="mt-2 space-y-1">
                                {formData.attachments.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md text-sm">
                                        <span className="truncate max-w-[200px]">{file.name}</span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    attachments: prev.attachments?.filter((_, i) => i !== index)
                                                }));
                                            }}
                                            className="h-6 w-6 p-0 text-red-500"
                                        >
                                            &times;
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </form>

                <DialogFooter className="flex gap-2 sm:gap-0">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={saving}
                    >
                        Cancel
                    </Button>
                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => handleSave('draft')}
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save as Draft'}
                        </Button>
                        <Button
                            type="button"
                            onClick={() => handleSave('final')}
                            disabled={saving}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {saving ? 'Saving...' : 'Save as Final'}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
