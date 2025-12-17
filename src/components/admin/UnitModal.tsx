import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ApiService } from '@/services/apiService';

interface UnitModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
    unit?: any;
}

export default function UnitModal({ isOpen, onClose, onSave, unit }: UnitModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        type: 'General',
        capacity: '10',
        gender: 'Mixed',
        description: '',
        department_id: ''
    });
    const [departments, setDepartments] = useState<any[]>([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadDepartments();
    }, []);

    useEffect(() => {
        if (unit) {
            setFormData({
                name: unit.name || '',
                type: unit.type || 'General',
                capacity: unit.capacity?.toString() || '10',
                gender: unit.gender || 'Mixed',
                description: unit.description || '',
                department_id: unit.department_id || ''
            });
        } else {
            setFormData({
                name: '',
                type: 'General',
                capacity: '10',
                gender: 'Mixed',
                description: '',
                department_id: ''
            });
        }
    }, [unit, isOpen]);

    const loadDepartments = async () => {
        try {
            const data = await ApiService.getDepartments();
            setDepartments(data);
        } catch (error) {
            console.error('Error loading departments:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            await onSave({
                ...formData,
                capacity: parseInt(formData.capacity)
            });
            onClose();
        } catch (error) {
            console.error('Error saving unit:', error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{unit ? 'Edit Unit/Ward' : 'Add New Unit/Ward'}</DialogTitle>
                    <DialogDescription>
                        {unit ? 'Update unit details and department assignment.' : 'Create a new unit and assign it to a department.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Unit Name *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Ward A"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Select
                            value={formData.department_id}
                            onValueChange={(value) => setFormData({ ...formData, department_id: value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                                {departments.map((dept) => (
                                    <SelectItem key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="type">Type</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value) => setFormData({ ...formData, type: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="General">General</SelectItem>
                                    <SelectItem value="ICU">ICU</SelectItem>
                                    <SelectItem value="Emergency">Emergency</SelectItem>
                                    <SelectItem value="Maternity">Maternity</SelectItem>
                                    <SelectItem value="Pediatric">Pediatric</SelectItem>
                                    <SelectItem value="Surgical">Surgical</SelectItem>
                                    <SelectItem value="Private">Private</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="gender">Gender Policy</Label>
                            <Select
                                value={formData.gender}
                                onValueChange={(value) => setFormData({ ...formData, gender: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Mixed">Mixed</SelectItem>
                                    <SelectItem value="Male">Male Only</SelectItem>
                                    <SelectItem value="Female">Female Only</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="capacity">Bed Capacity</Label>
                        <Input
                            id="capacity"
                            type="number"
                            min="1"
                            value={formData.capacity}
                            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Unit description..."
                        />
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={saving}>
                            {saving ? 'Saving...' : 'Save Unit'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
