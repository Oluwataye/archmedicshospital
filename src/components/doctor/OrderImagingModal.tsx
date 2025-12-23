import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface OrderImagingModalProps {
    isOpen: boolean;
    onClose: () => void;
    patientId: string;
    onSave: (data: any) => Promise<void>;
}

export default function OrderImagingModal({ isOpen, onClose, patientId, onSave }: OrderImagingModalProps) {
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        exam_type: 'X-Ray',
        body_part: '',
        priority: 'routine',
        clinical_indication: '',
        special_instructions: '',
        contrast_required: 'no'
    });

    const validateForm = () => {
        if (!formData.body_part.trim()) {
            toast.error('Please enter body part');
            return false;
        }
        if (!formData.clinical_indication.trim()) {
            toast.error('Please enter clinical indication');
            return false;
        }
        return true;
    };

    const handleCancel = () => {
        if (formData.body_part || formData.clinical_indication) {
            if (!window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
                return;
            }
        }
        setFormData({
            exam_type: 'X-Ray',
            body_part: '',
            priority: 'routine',
            clinical_indication: '',
            special_instructions: '',
            contrast_required: 'no'
        });
        onClose();
    };

    const handleSave = async (status: 'draft' | 'final') => {
        if (!validateForm()) return;

        try {
            setSaving(true);
            await onSave({ ...formData, status });
            toast.success(`Imaging order ${status === 'final' ? 'created' : 'saved as draft'} successfully`);
            setFormData({
                exam_type: 'X-Ray',
                body_part: '',
                priority: 'routine',
                clinical_indication: '',
                special_instructions: '',
                contrast_required: 'no'
            });
            onClose();
        } catch (error) {
            console.error('Error saving imaging order:', error);
            toast.error('Failed to save imaging order');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Order Imaging Study</DialogTitle>
                    <div className="sr-only">
                        <DialogDescription>
                            Create a new imaging order. Select exam type, body part, and clinical indication.
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Exam Type</Label>
                            <Select value={formData.exam_type} onValueChange={(value) => setFormData({ ...formData, exam_type: value })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="X-Ray">X-Ray</SelectItem>
                                    <SelectItem value="CT Scan">CT Scan</SelectItem>
                                    <SelectItem value="MRI">MRI</SelectItem>
                                    <SelectItem value="Ultrasound">Ultrasound</SelectItem>
                                    <SelectItem value="Mammogram">Mammogram</SelectItem>
                                    <SelectItem value="PET Scan">PET Scan</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Body Part *</Label>
                            <Input
                                value={formData.body_part}
                                onChange={(e) => setFormData({ ...formData, body_part: e.target.value })}
                                placeholder="e.g., Chest, Abdomen, Left Knee"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Priority</Label>
                            <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="routine">Routine</SelectItem>
                                    <SelectItem value="urgent">Urgent</SelectItem>
                                    <SelectItem value="stat">STAT</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Contrast Required</Label>
                            <Select value={formData.contrast_required} onValueChange={(value) => setFormData({ ...formData, contrast_required: value })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="no">No</SelectItem>
                                    <SelectItem value="yes">Yes</SelectItem>
                                    <SelectItem value="unknown">Unknown</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Clinical Indication *</Label>
                        <Textarea
                            value={formData.clinical_indication}
                            onChange={(e) => setFormData({ ...formData, clinical_indication: e.target.value })}
                            placeholder="Reason for ordering this imaging study..."
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Special Instructions</Label>
                        <Textarea
                            value={formData.special_instructions}
                            onChange={(e) => setFormData({ ...formData, special_instructions: e.target.value })}
                            placeholder="Any special positioning or protocol requirements..."
                            rows={2}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleCancel} disabled={saving}>
                        Cancel
                    </Button>
                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            onClick={() => handleSave('draft')}
                            disabled={saving}
                        >
                            {saving ? 'Saving...' : 'Save as Draft'}
                        </Button>
                        <Button
                            onClick={() => handleSave('final')}
                            disabled={saving}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {saving ? 'Saving...' : 'Create Order'}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
