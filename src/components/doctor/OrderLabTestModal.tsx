import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface OrderLabTestModalProps {
    isOpen: boolean;
    onClose: () => void;
    patientId: string;
    onSave: (data: any) => Promise<void>;
}

export default function OrderLabTestModal({ isOpen, onClose, patientId, onSave }: OrderLabTestModalProps) {
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        test_name: '',
        test_type: 'blood',
        priority: 'routine',
        clinical_indication: '',
        special_instructions: '',
        fasting_required: 'no'
    });

    const validateForm = () => {
        if (!formData.test_name.trim()) {
            toast.error('Please enter test name');
            return false;
        }
        if (!formData.clinical_indication.trim()) {
            toast.error('Please enter clinical indication');
            return false;
        }
        return true;
    };

    const handleCancel = () => {
        if (formData.test_name || formData.clinical_indication) {
            if (!window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
                return;
            }
        }
        setFormData({
            test_name: '',
            test_type: 'blood',
            priority: 'routine',
            clinical_indication: '',
            special_instructions: '',
            fasting_required: 'no'
        });
        onClose();
    };

    const handleSave = async (status: 'draft' | 'final') => {
        if (!validateForm()) return;

        try {
            setSaving(true);
            await onSave({ ...formData, status });
            toast.success(`Lab test order ${status === 'final' ? 'created' : 'saved as draft'} successfully`);
            setFormData({
                test_name: '',
                test_type: 'blood',
                priority: 'routine',
                clinical_indication: '',
                special_instructions: '',
                fasting_required: 'no'
            });
            onClose();
        } catch (error) {
            console.error('Error saving lab order:', error);
            toast.error('Failed to save lab order');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Order Lab Test</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Test Name *</Label>
                        <Input
                            value={formData.test_name}
                            onChange={(e) => setFormData({ ...formData, test_name: e.target.value })}
                            placeholder="e.g., Complete Blood Count (CBC)"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Test Type</Label>
                            <Select value={formData.test_type} onValueChange={(value) => setFormData({ ...formData, test_type: value })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="blood">Blood Test</SelectItem>
                                    <SelectItem value="urine">Urine Test</SelectItem>
                                    <SelectItem value="stool">Stool Test</SelectItem>
                                    <SelectItem value="culture">Culture</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

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
                    </div>

                    <div className="space-y-2">
                        <Label>Fasting Required</Label>
                        <Select value={formData.fasting_required} onValueChange={(value) => setFormData({ ...formData, fasting_required: value })}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="no">No</SelectItem>
                                <SelectItem value="yes">Yes (8-12 hours)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Clinical Indication *</Label>
                        <Textarea
                            value={formData.clinical_indication}
                            onChange={(e) => setFormData({ ...formData, clinical_indication: e.target.value })}
                            placeholder="Reason for ordering this test..."
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Special Instructions</Label>
                        <Textarea
                            value={formData.special_instructions}
                            onChange={(e) => setFormData({ ...formData, special_instructions: e.target.value })}
                            placeholder="Any special handling or collection instructions..."
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
