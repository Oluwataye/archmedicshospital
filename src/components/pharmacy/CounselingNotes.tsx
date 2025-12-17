import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

interface CounselingNotesProps {
    notes: string;
    onNotesChange: (notes: string) => void;
    pointsCovered: { [key: string]: boolean };
    onPointChange: (key: string, checked: boolean) => void;
}

export default function CounselingNotes({ notes, onNotesChange, pointsCovered, onPointChange }: CounselingNotesProps) {
    const counselingPoints = [
        { id: 'dosage', label: 'Dosage and Administration explained' },
        { id: 'side_effects', label: 'Common side effects discussed' },
        { id: 'storage', label: 'Storage instructions provided' },
        { id: 'interactions', label: 'Food/Drug interactions warned' },
        { id: 'teach_back', label: 'Patient demonstrated understanding (Teach-back)' },
    ];

    return (
        <div className="space-y-4">
            <div className="border p-4 rounded-md bg-blue-50/50">
                <h3 className="font-medium mb-2 text-blue-900">Counseling Checklist</h3>
                <div className="space-y-2">
                    {counselingPoints.map((point) => (
                        <div key={point.id} className="flex items-center space-x-2">
                            <Checkbox
                                id={point.id}
                                checked={pointsCovered[point.id] || false}
                                onCheckedChange={(checked) => onPointChange(point.id, checked as boolean)}
                            />
                            <Label htmlFor={point.id} className="cursor-pointer text-blue-800">{point.label}</Label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <Label>Additional Notes</Label>
                <Textarea
                    placeholder="Enter detailed counseling notes..."
                    value={notes}
                    onChange={(e) => onNotesChange(e.target.value)}
                    rows={4}
                />
            </div>
        </div>
    );
}
