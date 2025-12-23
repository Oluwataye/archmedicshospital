import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface AddMedicalHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    patientId: string;
    onSave: (data: any) => Promise<void>;
}

export default function AddMedicalHistoryModal({ isOpen, onClose, patientId, onSave }: AddMedicalHistoryModalProps) {
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        condition_name: '',
        category: 'chronic_condition',
        diagnosed_date: '',
        status: 'active',
        treatment: '',
        notes: ''
    });

    const validateForm = () => {
        if (!formData.condition_name.trim()) {
            toast.error('Please enter condition name');
            return false;
        }
        return true;
    };

    const handleCancel = () => {
        if (formData.condition_name || formData.treatment) {
            if (!window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
                return;
            }
        }
        setFormData({
            condition_name: '',
            category: 'chronic_condition',
            diagnosed_date: '',
            status: 'active',
            treatment: '',
            notes: ''
        });
        onClose();
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        try {
            setSaving(true);
            await onSave(formData);
            toast.success('Medical history recorded successfully');
            setFormData({
                condition_name: '',
                category: 'chronic_condition',
                diagnosed_date: '',
                status: 'active',
                treatment: '',
                notes: ''
            });
            onClose();
        } catch (error) {
            console.error('Error saving medical history:', error);
            toast.error('Failed to save medical history');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add Medical History</DialogTitle>
                    <div className="sr-only">
                        <DialogDescription>
                            Record a new medical condition, past illness, or surgery.
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Condition Name *</Label>
                        <Input
                            value={formData.condition_name}
                            onChange={(e) => setFormData({ ...formData, condition_name: e.target.value })}
                            placeholder="e.g., Hypertension, Type 2 Diabetes"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="chronic_condition">Chronic Condition</SelectItem>
                                    <SelectItem value="past_illness">Past Illness</SelectItem>
                                    <SelectItem value="surgery">Surgery</SelectItem>
                                    <SelectItem value="family_history">Family History</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="controlled">Controlled</SelectItem>
                                    <SelectItem value="resolved">Resolved</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Diagnosed Date</Label>
                        <Input
                            type="date"
                            value={formData.diagnosed_date}
                            onChange={(e) => setFormData({ ...formData, diagnosed_date: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Treatment / Management</Label>
                        <Textarea
                            value={formData.treatment}
                            onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                            placeholder="Current treatment or management plan..."
                            rows={2}
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
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {saving ? 'Saving...' : 'Save History'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
