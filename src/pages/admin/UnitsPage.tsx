import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, BedDouble } from 'lucide-react';
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
import UnitModal from '@/components/admin/UnitModal';

export default function UnitsPage() {
    const [units, setUnits] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState<any>(undefined);
    const [unitToDelete, setUnitToDelete] = useState<any>(undefined);

    useEffect(() => {
        loadUnits();
    }, []);

    const loadUnits = async () => {
        try {
            setLoading(true);
            const data = await ApiService.getWards();
            setUnits(data);
        } catch (error) {
            console.error('Error loading units:', error);
            toast.error('Failed to load units');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setSelectedUnit(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (unit: any) => {
        setSelectedUnit(unit);
        setIsModalOpen(true);
    };

    const handleDelete = async () => {
        if (!unitToDelete) return;

        try {
            await ApiService.deleteWard(unitToDelete.id);
            toast.success('Unit deleted successfully');
            setUnitToDelete(undefined);
            loadUnits();
        } catch (error) {
            console.error('Error deleting unit:', error);
            toast.error('Failed to delete unit');
        }
    };

    const handleSave = async (data: any) => {
        try {
            if (selectedUnit) {
                await ApiService.updateWard(selectedUnit.id, data);
                toast.success('Unit updated successfully');
            } else {
                await ApiService.createWard(data);
                toast.success('Unit created successfully');
            }
            loadUnits();
            setIsModalOpen(false);
        } catch (error: any) {
            console.error('Error saving unit:', error);
            toast.error(error.response?.data?.error || 'Failed to save unit');
            throw error;
        }
    };

    const filteredUnits = units.filter(unit =>
        (unit.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (unit.type || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Units & Wards</h1>
                    <p className="text-muted-foreground mt-1">Manage hospital wards, units, and bed capacity</p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Unit
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="p-4 border-b flex items-center gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search units..."
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
                                <TableHead>Department</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Capacity</TableHead>
                                <TableHead>Occupancy</TableHead>
                                <TableHead>Gender Policy</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUnits.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                                        No units found matching your search.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUnits.map((unit) => (
                                    <TableRow key={unit.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <BedDouble className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <span className="font-medium">{unit.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{unit.department_name || '-'}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{unit.type}</Badge>
                                        </TableCell>
                                        <TableCell>{unit.capacity} Beds</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${(unit.occupied_beds / unit.capacity) > 0.9 ? 'bg-red-500' :
                                                                (unit.occupied_beds / unit.capacity) > 0.7 ? 'bg-amber-500' : 'bg-green-500'
                                                            }`}
                                                        style={{ width: `${Math.min((unit.occupied_beds / unit.capacity) * 100, 100)}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-muted-foreground">
                                                    {unit.occupied_beds || 0}/{unit.capacity}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{unit.gender}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    title="Edit"
                                                    onClick={() => handleEdit(unit)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    title="Delete"
                                                    onClick={() => setUnitToDelete(unit)}
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

            <UnitModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                unit={selectedUnit}
            />

            <AlertDialog open={!!unitToDelete} onOpenChange={() => setUnitToDelete(undefined)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Unit</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete {unitToDelete?.name}? This action cannot be undone.
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
