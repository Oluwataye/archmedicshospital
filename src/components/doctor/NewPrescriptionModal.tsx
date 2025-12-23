import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface NewPrescriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    patientId: string;
    onSave: (data: any) => Promise<void>;
}

export default function NewPrescriptionModal({ isOpen, onClose, patientId, onSave }: NewPrescriptionModalProps) {
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        medication_name: '',
        dosage: '',
        frequency: '',
        duration: '',
        route: 'oral',
        instructions: '',
        refills: '0',
        notes: ''
    });

    const validateForm = () => {
        if (!formData.medication_name.trim()) {
            toast.error('Please enter medication name');
            return false;
        }
        if (!formData.dosage.trim()) {
            toast.error('Please enter dosage');
            return false;
        }
        if (!formData.frequency.trim()) {
            toast.error('Please enter frequency');
            return false;
        }
        return true;
    };

    const handleCancel = () => {
        if (formData.medication_name || formData.dosage) {
            if (!window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
                return;
            }
        }
        setFormData({
            medication_name: '',
            dosage: '',
            frequency: '',
            duration: '',
            route: 'oral',
            instructions: '',
            refills: '0',
            notes: ''
        });
        onClose();
    };

    const handleSave = async (status: 'draft' | 'final') => {
        if (!validateForm()) return;

        try {
            setSaving(true);
            await onSave({ ...formData, status });
            toast.success(`Prescription ${status === 'final' ? 'created' : 'saved as draft'} successfully`);
            setFormData({
                medication_name: '',
                dosage: '',
                frequency: '',
                duration: '',
                route: 'oral',
                instructions: '',
                refills: '0',
                notes: ''
            });
            onClose();
        } catch (error) {
            console.error('Error saving prescription:', error);
            toast.error('Failed to save prescription');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>New Prescription</DialogTitle>
                    <div className="sr-only">
                        <DialogDescription>
                            Create a new prescription for the patient. Fill in medication details, dosage, and instructions.
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 space-y-2">
                            <Label>Medication Name *</Label>
                            <Input
                                value={formData.medication_name}
                                onChange={(e) => setFormData({ ...formData, medication_name: e.target.value })}
                                placeholder="e.g., Amoxicillin"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Dosage *</Label>
                            <Input
                                value={formData.dosage}
                                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                                placeholder="e.g., 500mg"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Frequency *</Label>
                            <Input
                                value={formData.frequency}
                                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                                placeholder="e.g., 3 times daily"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Duration</Label>
                            <Input
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                placeholder="e.g., 7 days"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Route</Label>
                            <Select value={formData.route} onValueChange={(value) => setFormData({ ...formData, route: value })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="oral">Oral</SelectItem>
                                    <SelectItem value="topical">Topical</SelectItem>
                                    <SelectItem value="injection">Injection</SelectItem>
                                    <SelectItem value="inhalation">Inhalation</SelectItem>
                                    <SelectItem value="sublingual">Sublingual</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="col-span-2 space-y-2">
                            <Label>Instructions</Label>
                            <Textarea
                                value={formData.instructions}
                                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                                placeholder="Special instructions for the patient..."
                                rows={2}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Refills Authorized</Label>
                            <Input
                                type="number"
                                min="0"
                                value={formData.refills}
                                onChange={(e) => setFormData({ ...formData, refills: e.target.value })}
                            />
                        </div>

                        <div className="col-span-2 space-y-2">
                            <Label>Notes (Internal)</Label>
                            <Textarea
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="Internal notes..."
                                rows={2}
                            />
                        </div>
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
                            {saving ? 'Saving...' : 'Create Prescription'}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
