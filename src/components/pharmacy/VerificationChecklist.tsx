import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface VerificationChecklistProps {
    checks: { [key: string]: boolean };
    onCheckChange: (key: string, checked: boolean) => void;
}

export default function VerificationChecklist({ checks, onCheckChange }: VerificationChecklistProps) {
    const items = [
        { id: 'right_patient', label: 'Right Patient (Name & DOB/MRN verified)' },
        { id: 'right_medication', label: 'Right Medication (Label matches prescription)' },
        { id: 'right_dose', label: 'Right Dose (Strength and quantity verified)' },
        { id: 'right_route', label: 'Right Route (Oral, Topical, etc.)' },
        { id: 'right_time', label: 'Right Frequency/Time instructions' },
        { id: 'expiry_check', label: 'Expiry Date Checked' },
        { id: 'allergy_check', label: 'Allergy Check Performed' },
    ];

    return (
        <div className="space-y-3 border p-4 rounded-md bg-slate-50">
            <h3 className="font-medium mb-2">Safety Verification (5 Rights +)</h3>
            {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                    <Checkbox
                        id={item.id}
                        checked={checks[item.id] || false}
                        onCheckedChange={(checked) => onCheckChange(item.id, checked as boolean)}
                    />
                    <Label htmlFor={item.id} className="cursor-pointer">{item.label}</Label>
                </div>
            ))}
        </div>
    );
}
