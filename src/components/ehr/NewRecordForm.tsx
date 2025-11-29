import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Save } from 'lucide-react';

interface NewRecordFormProps {
    patientId: string;
    patientName: string;
    onSave: (record: any) => void;
    onCancel: () => void;
}

const NewRecordForm: React.FC<NewRecordFormProps> = ({ patientId, patientName, onSave, onCancel }) => {
    const [recordType, setRecordType] = useState('vital-signs');
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        doctor: '',
        description: '',
        // Vital signs
        bloodPressure: '',
        heartRate: '',
        temperature: '',
        oxygenSaturation: '',
        // Allergies
        allergen: '',
        reaction: '',
        severity: 'Moderate',
        // Procedures
        procedureName: '',
        hospital: '',
        // History
        condition: '',
        diagnosedDate: '',
        status: 'Active'
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const baseRecord = {
            id: `REC-${Date.now()}`,
            patientId,
            recordType,
            date: formData.date,
            doctor: formData.doctor,
            description: formData.description,
        };

        let specificData = {};

        if (recordType === 'vital-signs') {
            specificData = {
                bloodPressure: formData.bloodPressure,
                heartRate: formData.heartRate,
                temperature: formData.temperature,
                oxygenSaturation: formData.oxygenSaturation,
            };
        } else if (recordType === 'allergies') {
            specificData = {
                allergen: formData.allergen,
                reaction: formData.reaction,
                severity: formData.severity,
                status: 'Active',
            };
        } else if (recordType === 'procedures') {
            specificData = {
                name: formData.procedureName,
                hospital: formData.hospital,
                notes: formData.description,
            };
        } else if (recordType === 'history') {
            specificData = {
                condition: formData.condition,
                diagnosed: formData.diagnosedDate,
                status: formData.status,
                notes: formData.description,
            };
        }

        onSave({ ...baseRecord, ...specificData });
    };

    return (
        <Card className="border-2 border-primary/20">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>New Medical Record</CardTitle>
                        <CardDescription>Patient: {patientName} (ID: {patientId})</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onCancel}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="recordType">Record Type</Label>
                            <Select value={recordType} onValueChange={setRecordType}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="vital-signs">Vital Signs</SelectItem>
                                    <SelectItem value="allergies">Allergy</SelectItem>
                                    <SelectItem value="procedures">Procedure</SelectItem>
                                    <SelectItem value="history">Medical History</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                                id="date"
                                type="date"
                                value={formData.date}
                                onChange={(e) => handleInputChange('date', e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="doctor">Doctor/Provider</Label>
                            <Input
                                id="doctor"
                                placeholder="Dr. Smith"
                                value={formData.doctor}
                                onChange={(e) => handleInputChange('doctor', e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {/* Vital Signs Fields */}
                    {recordType === 'vital-signs' && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                            <div className="space-y-2">
                                <Label htmlFor="bp">Blood Pressure</Label>
                                <Input
                                    id="bp"
                                    placeholder="120/80"
                                    value={formData.bloodPressure}
                                    onChange={(e) => handleInputChange('bloodPressure', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="hr">Heart Rate (bpm)</Label>
                                <Input
                                    id="hr"
                                    type="number"
                                    placeholder="72"
                                    value={formData.heartRate}
                                    onChange={(e) => handleInputChange('heartRate', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="temp">Temperature (°F)</Label>
                                <Input
                                    id="temp"
                                    type="number"
                                    step="0.1"
                                    placeholder="98.6"
                                    value={formData.temperature}
                                    onChange={(e) => handleInputChange('temperature', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="o2">O2 Saturation (%)</Label>
                                <Input
                                    id="o2"
                                    type="number"
                                    placeholder="98"
                                    value={formData.oxygenSaturation}
                                    onChange={(e) => handleInputChange('oxygenSaturation', e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {/* Allergy Fields */}
                    {recordType === 'allergies' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                            <div className="space-y-2">
                                <Label htmlFor="allergen">Allergen</Label>
                                <Input
                                    id="allergen"
                                    placeholder="Penicillin"
                                    value={formData.allergen}
                                    onChange={(e) => handleInputChange('allergen', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="reaction">Reaction</Label>
                                <Input
                                    id="reaction"
                                    placeholder="Hives, Swelling"
                                    value={formData.reaction}
                                    onChange={(e) => handleInputChange('reaction', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="severity">Severity</Label>
                                <Select value={formData.severity} onValueChange={(val) => handleInputChange('severity', val)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Low">Low</SelectItem>
                                        <SelectItem value="Moderate">Moderate</SelectItem>
                                        <SelectItem value="High">High</SelectItem>
                                        <SelectItem value="Critical">Critical</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    {/* Procedure Fields */}
                    {recordType === 'procedures' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                            <div className="space-y-2">
                                <Label htmlFor="procedureName">Procedure Name</Label>
                                <Input
                                    id="procedureName"
                                    placeholder="Appendectomy"
                                    value={formData.procedureName}
                                    onChange={(e) => handleInputChange('procedureName', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="hospital">Facility</Label>
                                <Input
                                    id="hospital"
                                    placeholder="General Hospital"
                                    value={formData.hospital}
                                    onChange={(e) => handleInputChange('hospital', e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {/* Medical History Fields */}
                    {recordType === 'history' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                            <div className="space-y-2">
                                <Label htmlFor="condition">Condition</Label>
                                <Input
                                    id="condition"
                                    placeholder="Hypertension"
                                    value={formData.condition}
                                    onChange={(e) => handleInputChange('condition', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="diagnosedDate">Diagnosed Date</Label>
                                <Input
                                    id="diagnosedDate"
                                    placeholder="2015"
                                    value={formData.diagnosedDate}
                                    onChange={(e) => handleInputChange('diagnosedDate', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select value={formData.status} onValueChange={(val) => handleInputChange('status', val)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Active">Active</SelectItem>
                                        <SelectItem value="Controlled">Controlled</SelectItem>
                                        <SelectItem value="Resolved">Resolved</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="description">Notes / Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Additional notes..."
                            rows={4}
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 justify-end pt-4">
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            <Save className="h-4 w-4 mr-2" />
                            Save Record
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default NewRecordForm;
