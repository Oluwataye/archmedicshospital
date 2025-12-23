import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface AddVitalsModalProps {
    isOpen: boolean;
    onClose: () => void;
    patientId: string;
    onSave: (data: any) => Promise<void>;
}

export default function AddVitalsModal({ isOpen, onClose, patientId, onSave }: AddVitalsModalProps) {
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        blood_pressure_systolic: '',
        blood_pressure_diastolic: '',
        heart_rate: '',
        temperature: '',
        respiratory_rate: '',
        oxygen_saturation: '',
        weight: '',
        height: '',
        bmi: '',
        notes: ''
    });

    const calculateBMI = (weight: string, height: string) => {
        const w = parseFloat(weight);
        const h = parseFloat(height) / 100; // convert cm to m
        if (w > 0 && h > 0) {
            const bmi = (w / (h * h)).toFixed(1);
            setFormData(prev => ({ ...prev, bmi }));
        }
    };

    const handleWeightChange = (value: string) => {
        setFormData(prev => ({ ...prev, weight: value }));
        calculateBMI(value, formData.height);
    };

    const handleHeightChange = (value: string) => {
        setFormData(prev => ({ ...prev, height: value }));
        calculateBMI(formData.weight, value);
    };

    const validateForm = () => {
        const hasAnyVital = formData.blood_pressure_systolic || formData.heart_rate ||
            formData.temperature || formData.oxygen_saturation;
        if (!hasAnyVital) {
            toast.error('Please enter at least one vital sign');
            return false;
        }
        return true;
    };

    const handleCancel = () => {
        const hasData = Object.values(formData).some(v => v !== '');
        if (hasData) {
            if (!window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
                return;
            }
        }
        setFormData({
            blood_pressure_systolic: '',
            blood_pressure_diastolic: '',
            heart_rate: '',
            temperature: '',
            respiratory_rate: '',
            oxygen_saturation: '',
            weight: '',
            height: '',
            bmi: '',
            notes: ''
        });
        onClose();
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        try {
            setSaving(true);
            await onSave(formData);
            toast.success('Vital signs recorded successfully');
            setFormData({
                blood_pressure_systolic: '',
                blood_pressure_diastolic: '',
                heart_rate: '',
                temperature: '',
                respiratory_rate: '',
                oxygen_saturation: '',
                weight: '',
                height: '',
                bmi: '',
                notes: ''
            });
            onClose();
        } catch (error) {
            console.error('Error saving vitals:', error);
            toast.error('Failed to save vital signs');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Record Vital Signs</DialogTitle>
                    <div className="sr-only">
                        <DialogDescription>
                            Enter current vital signs for the patient including blood pressure, heart rate, and temperature.
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Blood Pressure (Systolic)</Label>
                            <Input
                                type="number"
                                value={formData.blood_pressure_systolic}
                                onChange={(e) => setFormData({ ...formData, blood_pressure_systolic: e.target.value })}
                                placeholder="120"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Blood Pressure (Diastolic)</Label>
                            <Input
                                type="number"
                                value={formData.blood_pressure_diastolic}
                                onChange={(e) => setFormData({ ...formData, blood_pressure_diastolic: e.target.value })}
                                placeholder="80"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Heart Rate (bpm)</Label>
                            <Input
                                type="number"
                                value={formData.heart_rate}
                                onChange={(e) => setFormData({ ...formData, heart_rate: e.target.value })}
                                placeholder="72"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Temperature (°F)</Label>
                            <Input
                                type="number"
                                step="0.1"
                                value={formData.temperature}
                                onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                                placeholder="98.6"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Respiratory Rate (breaths/min)</Label>
                            <Input
                                type="number"
                                value={formData.respiratory_rate}
                                onChange={(e) => setFormData({ ...formData, respiratory_rate: e.target.value })}
                                placeholder="16"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>O2 Saturation (%)</Label>
                            <Input
                                type="number"
                                value={formData.oxygen_saturation}
                                onChange={(e) => setFormData({ ...formData, oxygen_saturation: e.target.value })}
                                placeholder="98"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Weight (kg)</Label>
                            <Input
                                type="number"
                                step="0.1"
                                value={formData.weight}
                                onChange={(e) => handleWeightChange(e.target.value)}
                                placeholder="70"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Height (cm)</Label>
                            <Input
                                type="number"
                                value={formData.height}
                                onChange={(e) => handleHeightChange(e.target.value)}
                                placeholder="170"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>BMI</Label>
                            <Input
                                value={formData.bmi}
                                readOnly
                                placeholder="Auto-calculated"
                                className="bg-muted"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Notes</Label>
                        <Input
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Additional observations..."
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
                        {saving ? 'Saving...' : 'Save Vitals'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
