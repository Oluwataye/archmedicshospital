import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface DepartmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
    department?: any;
}

export default function DepartmentModal({ isOpen, onClose, onSave, department }: DepartmentModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        head_of_department: '',
        is_active: true
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (department) {
            setFormData({
                name: department.name || '',
                description: department.description || '',
                head_of_department: department.head_of_department || '',
                is_active: department.is_active !== 0
            });
        } else {
            setFormData({
                name: '',
                description: '',
                head_of_department: '',
                is_active: true
            });
        }
    }, [department, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error('Error saving department:', error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{department ? 'Edit Department' : 'Add New Department'}</DialogTitle>
                    <DialogDescription>
                        {department ? 'Update department details.' : 'Create a new department.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Department Name *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Cardiology"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="head">Head of Department</Label>
                        <Input
                            id="head"
                            value={formData.head_of_department}
                            onChange={(e) => setFormData({ ...formData, head_of_department: e.target.value })}
                            placeholder="e.g. Dr. Smith"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Department description..."
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="active"
                            checked={formData.is_active}
                            onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                        />
                        <Label htmlFor="active">Active</Label>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={saving}>
                            {saving ? 'Saving...' : 'Save Department'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
