import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { ApiService } from '@/services/apiService';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
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
import DepartmentModal from '@/components/admin/DepartmentModal';

export default function DepartmentsPage() {
    const [departments, setDepartments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<any>(undefined);
    const [departmentToDelete, setDepartmentToDelete] = useState<any>(undefined);

    useEffect(() => {
        loadDepartments();
    }, []);

    const loadDepartments = async () => {
        try {
            setLoading(true);
            const data = await ApiService.getDepartments();
            setDepartments(data);
        } catch (error) {
            console.error('Error loading departments:', error);
            toast.error('Failed to load departments');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedDepartment(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (department: any) => {
        setSelectedDepartment(department);
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        if (!departmentToDelete) return;

        try {
            await ApiService.deleteDepartment(departmentToDelete.id);
            toast.success('Department deleted successfully');
            setDepartmentToDelete(undefined);
            loadDepartments();
        } catch (error) {
            console.error('Error deleting department:', error);
            toast.error('Failed to delete department');
        }
    };

    const handleSave = async (data: any) => {
        try {
            if (selectedDepartment) {
                await ApiService.updateDepartment(selectedDepartment.id, data);
                toast.success('Department updated successfully');
            } else {
                await ApiService.createDepartment(data);
                toast.success('Department created successfully');
            }
            loadDepartments();
            setIsModalOpen(false);
        } catch (error: any) {
            console.error('Error saving department:', error);
            toast.error(error.response?.data?.error || 'Failed to save department');
            throw error;
        }
    };

    const filteredDepartments = departments.filter(dept =>
        (dept.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (dept.head_of_department || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
                    <p className="text-muted-foreground mt-1">Manage hospital departments and heads</p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Department
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="p-4 border-b flex items-center gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search departments..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Head of Department</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredDepartments.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                                        No departments found matching your search.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredDepartments.map((dept) => (
                                    <TableRow key={dept.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <Building2 className="h-4 w-4 text-primary" />
                                                </div>
                                                <span className="font-medium">{dept.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{dept.head_of_department || '-'}</TableCell>
                                        <TableCell className="max-w-xs truncate" title={dept.description}>
                                            {dept.description || '-'}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={dept.is_active ? 'default' : 'secondary'}>
                                                {dept.is_active ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    title="Edit"
                                                    onClick={() => handleEdit(dept)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    title="Delete"
                                                    onClick={() => setDepartmentToDelete(dept)}
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

            <DepartmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                department={selectedDepartment}
            />

            <AlertDialog open={!!departmentToDelete} onOpenChange={() => setDepartmentToDelete(undefined)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Department</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete {departmentToDelete?.name}? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
