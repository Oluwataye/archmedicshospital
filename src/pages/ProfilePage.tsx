import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ApiService } from '@/services/apiService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { User, Building2, Mail, Shield, Phone, Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function ProfilePage() {
    const { user, updateProfile } = useAuth();
    const { theme, setTheme } = useTheme();
    const [loading, setLoading] = useState(false);
    const [departments, setDepartments] = useState<any[]>([]);
    const [units, setUnits] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        department_id: '',
        unit_id: ''
    });

    const canEditProfile = user && (user.role === 'doctor' || user.role === 'nurse');

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || user.firstName || '',
                last_name: user.last_name || user.lastName || '',
                email: user.email || '',
                phone: user.phone || '',
                department_id: user.department_id || '',
                unit_id: user.unit_id || ''
            });
        }
        if (canEditProfile) {
            loadDepartments();
        }
    }, [user, canEditProfile]);

    useEffect(() => {
        if (formData.department_id && canEditProfile) {
            loadUnits(formData.department_id);
        } else {
            setUnits([]);
            if (canEditProfile) {
                setFormData(prev => ({ ...prev, unit_id: '' }));
            }
        }
    }, [formData.department_id, canEditProfile]);

    const loadDepartments = async () => {
        try {
            const data = await ApiService.getDepartments();
            setDepartments(data);
        } catch (error) {
            console.error('Error loading departments:', error);
            toast.error('Failed to load departments');
        }
    };

    const loadUnits = async (departmentId: string) => {
        try {
            const data = await ApiService.getWards();
            const filtered = data.filter((ward: any) => ward.department_id === departmentId);
            setUnits(filtered);
        } catch (error) {
            console.error('Error loading units:', error);
            toast.error('Failed to load units');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const updatedUser = await ApiService.updateUserProfile(formData);
            updateProfile(updatedUser);
            toast.success('Profile updated successfully');
        } catch (error: any) {
            console.error('Error updating profile:', error);
            toast.error(error.response?.data?.error || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    // Read-only view for non-doctor/nurse roles
    if (!canEditProfile) {
        return (
            <div className="space-y-6 animate-in fade-in duration-500">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
                    <p className="text-muted-foreground mt-1">View your account information</p>
                </div>

                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-4 p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                                {(user.firstName || user.first_name || '')[0]}{(user.lastName || user.last_name || '')[0]}
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">{user.firstName || user.first_name} {user.lastName || user.last_name}</h3>
                                <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <div className="flex items-center h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                                    {user.email}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Role</Label>
                                <div className="flex items-center h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm capitalize">
                                    <Shield className="mr-2 h-4 w-4 text-muted-foreground" />
                                    {user.role}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="max-w-2xl">
                    <CardHeader>
                        <CardTitle>Appearance</CardTitle>
                        <CardDescription>Customize how the application looks on your device</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <button
                                onClick={() => setTheme('light')}
                                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${theme === 'light'
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:border-primary/50'
                                    }`}
                            >
                                <Sun className="h-6 w-6" />
                                <span className="text-sm font-medium">Light</span>
                            </button>

                            <button
                                onClick={() => setTheme('dark')}
                                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${theme === 'dark'
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:border-primary/50'
                                    }`}
                            >
                                <Moon className="h-6 w-6" />
                                <span className="text-sm font-medium">Dark</span>
                            </button>

                            <button
                                onClick={() => setTheme('system')}
                                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${theme === 'system'
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:border-primary/50'
                                    }`}
                            >
                                <Monitor className="h-6 w-6" />
                                <span className="text-sm font-medium">System</span>
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Editable view for doctor/nurse roles
    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Profile</h1>
                <p className="text-muted-foreground">Manage your profile and department assignments</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Personal Information
                        </CardTitle>
                        <CardDescription>Your basic profile information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="first_name">First Name</Label>
                                <Input
                                    id="first_name"
                                    value={formData.first_name}
                                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="last_name">Last Name</Label>
                                <Input
                                    id="last_name"
                                    value={formData.last_name}
                                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Role</Label>
                                <Input value={user.role.charAt(0).toUpperCase() + user.role.slice(1)} disabled />
                            </div>
                            <div className="space-y-2">
                                <Label>Username</Label>
                                <Input value={user.username} disabled />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Department & Unit Assignment */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            Department & Unit Assignment
                        </CardTitle>
                        <CardDescription>Manage your department and unit assignments</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
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

                        <div className="space-y-2">
                            <Label htmlFor="unit">Unit/Ward</Label>
                            <Select
                                value={formData.unit_id}
                                onValueChange={(value) => setFormData({ ...formData, unit_id: value })}
                                disabled={!formData.department_id}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder={formData.department_id ? "Select unit" : "Select department first"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {units.map((unit) => (
                                        <SelectItem key={unit.id} value={unit.id}>
                                            {unit.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {!formData.department_id && (
                                <p className="text-sm text-muted-foreground">
                                    Please select a department first
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Appearance</CardTitle>
                        <CardDescription>Customize how the application looks on your device</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <button
                                type="button"
                                onClick={() => setTheme('light')}
                                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${theme === 'light'
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:border-primary/50'
                                    }`}
                            >
                                <Sun className="h-6 w-6" />
                                <span className="text-sm font-medium">Light</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setTheme('dark')}
                                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${theme === 'dark'
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:border-primary/50'
                                    }`}
                            >
                                <Moon className="h-6 w-6" />
                                <span className="text-sm font-medium">Dark</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setTheme('system')}
                                className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${theme === 'system'
                                    ? 'border-primary bg-primary/5'
                                    : 'border-border hover:border-primary/50'
                                    }`}
                            >
                                <Monitor className="h-6 w-6" />
                                <span className="text-sm font-medium">System</span>
                            </button>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
