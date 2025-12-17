import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Shield, User as UserIcon, Key, ToggleLeft, ToggleRight } from 'lucide-react';
import { toast } from 'sonner';
import { ApiService } from '@/services/apiService';
import { User } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import UserModal from '@/components/admin/UserModal';

export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
    const [userToDelete, setUserToDelete] = useState<User | undefined>(undefined);
    const [userToToggle, setUserToToggle] = useState<User | undefined>(undefined);
    const [resetPasswordUser, setResetPasswordUser] = useState<User | undefined>(undefined);
    const [newPassword, setNewPassword] = useState('');
    const [resettingPassword, setResettingPassword] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await ApiService.getUsers();
            setUsers(data);
        } catch (error) {
            console.error('Error loading users:', error);
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedUser(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        if (!userToDelete) return;

        try {
            await ApiService.deactivateUser(userToDelete.id);
            toast.success('User deactivated successfully');
            setUserToDelete(undefined);
            loadUsers();
        } catch (error) {
            console.error('Error deactivating user:', error);
            toast.error('Failed to deactivate user');
        }
    };

    const handleToggleActive = async () => {
        if (!userToToggle) return;

        try {
            if (userToToggle.isActive) {
                await ApiService.deactivateUser(userToToggle.id);
                toast.success('User deactivated successfully');
            } else {
                await ApiService.activateUser(userToToggle.id);
                toast.success('User activated successfully');
            }
            setUserToToggle(undefined);
            loadUsers();
        } catch (error) {
            console.error('Error toggling user status:', error);
            toast.error('Failed to update user status');
        }
    };

    const handleResetPassword = async () => {
        if (!resetPasswordUser || !newPassword) {
            toast.error('Please enter a new password');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        try {
            setResettingPassword(true);
            await ApiService.resetUserPassword(resetPasswordUser.id, newPassword);
            toast.success('Password reset successfully');
            setResetPasswordUser(undefined);
            setNewPassword('');
        } catch (error) {
            console.error('Error resetting password:', error);
            toast.error('Failed to reset password');
        } finally {
            setResettingPassword(false);
        }
    };

    const handleSave = async (data: any) => {
        try {
            if (selectedUser) {
                await ApiService.updateUser(selectedUser.id, data);
                toast.success('User updated successfully');
            } else {
                await ApiService.createUser(data);
                toast.success('User created successfully');
            }
            loadUsers();
            setIsModalOpen(false);
        } catch (error: any) {
            console.error('Error saving user:', error);
            toast.error(error.response?.data?.error || 'Failed to save user');
            throw error;
        }
    };

    const filteredUsers = users.filter(user =>
        (user.firstName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.lastName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (user.username || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                    <p className="text-muted-foreground mt-1">Manage system users, roles, and permissions</p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add User
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="p-4 border-b flex items-center gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search users..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Department</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                        No users found matching your search.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                                        {(user.firstName || '?')[0]}{(user.lastName || '?')[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium">{user.firstName} {user.lastName}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="capitalize">{user.role}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            {user.department || '-'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={user.isActive !== false ? 'default' : 'secondary'}>
                                                {user.isActive !== false ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    title="Edit User"
                                                    onClick={() => handleEdit(user)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    title="Reset Password"
                                                    onClick={() => setResetPasswordUser(user)}
                                                >
                                                    <Key className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    title={user.isActive !== false ? "Deactivate User" : "Activate User"}
                                                    onClick={() => setUserToToggle(user)}
                                                >
                                                    {user.isActive !== false ? (
                                                        <ToggleRight className="h-4 w-4 text-green-600" />
                                                    ) : (
                                                        <ToggleLeft className="h-4 w-4 text-gray-400" />
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    title="Delete User"
                                                    onClick={() => setUserToDelete(user)}
                                                    className="text-destructive hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                user={selectedUser}
            />

            {/* Delete User Confirmation */}
            <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(undefined)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete User</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to deactivate {userToDelete?.firstName} {userToDelete?.lastName}?
                            This action will prevent them from logging into the system.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Deactivate
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Toggle Active Status Confirmation */}
            <AlertDialog open={!!userToToggle} onOpenChange={() => setUserToToggle(undefined)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {userToToggle?.isActive !== false ? 'Deactivate' : 'Activate'} User
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to {userToToggle?.isActive !== false ? 'deactivate' : 'activate'} {userToToggle?.firstName} {userToToggle?.lastName}?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleToggleActive}>
                            {userToToggle?.isActive !== false ? 'Deactivate' : 'Activate'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Reset Password Dialog */}
            <Dialog open={!!resetPasswordUser} onOpenChange={() => {
                setResetPasswordUser(undefined);
                setNewPassword('');
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reset Password</DialogTitle>
                        <DialogDescription>
                            Enter a new password for {resetPasswordUser?.firstName} {resetPasswordUser?.lastName}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input
                                id="new-password"
                                type="password"
                                placeholder="Enter new password (min 6 characters)"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleResetPassword();
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => {
                            setResetPasswordUser(undefined);
                            setNewPassword('');
                        }}>
                            Cancel
                        </Button>
                        <Button onClick={handleResetPassword} disabled={resettingPassword}>
                            {resettingPassword ? 'Resetting...' : 'Reset Password'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
