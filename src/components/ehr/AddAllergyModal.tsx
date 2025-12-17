import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface AddAllergyModalProps {
    isOpen: boolean;
    onClose: () => void;
    patientId: string;
    onSave: (data: any) => Promise<void>;
}

export default function AddAllergyModal({ isOpen, onClose, patientId, onSave }: AddAllergyModalProps) {
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        allergen: '',
        allergy_type: 'medication',
        reaction: '',
        severity: 'moderate',
        onset_date: '',
        notes: ''
    });

    const validateForm = () => {
        if (!formData.allergen.trim()) {
            toast.error('Please enter allergen name');
            return false;
        }
        if (!formData.reaction.trim()) {
            toast.error('Please enter reaction');
            return false;
        }
        return true;
    };

    const handleCancel = () => {
        if (formData.allergen || formData.reaction) {
            if (!window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
                return;
            }
        }
        setFormData({
            allergen: '',
            allergy_type: 'medication',
            reaction: '',
            severity: 'moderate',
            onset_date: '',
            notes: ''
        });
        onClose();
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        try {
            setSaving(true);
            await onSave(formData);
            toast.success('Allergy recorded successfully');
            setFormData({
                allergen: '',
                allergy_type: 'medication',
                reaction: '',
                severity: 'moderate',
                onset_date: '',
                notes: ''
            });
            onClose();
        } catch (error) {
            console.error('Error saving allergy:', error);
            toast.error('Failed to save allergy');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add Allergy / Intolerance</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Allergen *</Label>
                        <Input
                            value={formData.allergen}
                            onChange={(e) => setFormData({ ...formData, allergen: e.target.value })}
                            placeholder="e.g., Penicillin, Peanuts, Latex"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Type</Label>
                            <Select value={formData.allergy_type} onValueChange={(value) => setFormData({ ...formData, allergy_type: value })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="medication">Medication</SelectItem>
                                    <SelectItem value="food">Food</SelectItem>
                                    <SelectItem value="environmental">Environmental</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Severity</Label>
                            <Select value={formData.severity} onValueChange={(value) => setFormData({ ...formData, severity: value })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="mild">Mild</SelectItem>
                                    <SelectItem value="moderate">Moderate</SelectItem>
                                    <SelectItem value="severe">Severe</SelectItem>
                                    <SelectItem value="life-threatening">Life-Threatening</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Reaction *</Label>
                        <Textarea
                            value={formData.reaction}
                            onChange={(e) => setFormData({ ...formData, reaction: e.target.value })}
                            placeholder="Describe the reaction (e.g., Hives, Swelling, Anaphylaxis)"
                            rows={2}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Onset Date</Label>
                        <Input
                            type="date"
                            value={formData.onset_date}
                            onChange={(e) => setFormData({ ...formData, onset_date: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Additional Notes</Label>
                        <Textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Any additional information..."
                            rows={2}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleCancel} disabled={saving}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {saving ? 'Saving...' : 'Save Allergy'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
