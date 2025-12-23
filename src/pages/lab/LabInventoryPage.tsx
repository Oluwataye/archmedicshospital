import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Package, AlertTriangle, RefreshCw, History, Upload } from 'lucide-react';
import BulkUploadModal from '@/components/common/BulkUploadModal';
import { ApiService } from '@/services/apiService';
import { useLabInventory } from '@/hooks/useLabInventory';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';

const LabInventoryPage = () => {
    const { items: inventory, loading, refetch, restockItem, addItem: createItem } = useLabInventory();
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
    const [isBulkUploadModalOpen, setIsBulkUploadModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    // Form States
    const [newItem, setNewItem] = useState({
        name: '',
        category: 'reagent',
        currentStock: 0,
        minLevel: 10,
        maxLevel: 100,
        location: '',
        unitCost: 0,
        supplier: ''
    });

    const [restockAmount, setRestockAmount] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const filteredInventory = inventory.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreateItem = async () => {
        try {
            setIsSubmitting(true);
            await createItem(newItem);
            toast.success('Item added successfully');
            setIsAddModalOpen(false);
            refetch();
        } catch (error) {
            toast.error('Failed to add item');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRestock = async () => {
        if (restockAmount <= 0) {
            toast.error('Invalid amount');
            return;
        }
        try {
            setIsSubmitting(true);
            await restockItem(selectedItem.id, restockAmount, 'Manual Restock');
            toast.success('Restocked successfully');
            setIsRestockModalOpen(false);
            refetch();
        } catch (error) {
            toast.error('Failed to restock');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBulkUpload = async (data: any[]) => {
        const formattedData = data.map(item => ({
            ...item,
            currentStock: parseInt(item.currentStock) || 0,
            minLevel: parseInt(item.minLevel) || 10,
            maxLevel: parseInt(item.maxLevel) || 100,
            unitCost: parseFloat(item.unitCost) || 0
        }));
        await ApiService.bulkCreateLabInventoryItems(formattedData);
        refetch();
    };

    const openRestockModal = (item: any) => {
        setSelectedItem(item);
        setRestockAmount(0);
        setIsRestockModalOpen(true);
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Lab Inventory</h1>
                    <p className="text-gray-500">Manage reagents and supplies</p>
                </div>
                <div className="flex gap-2">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                            placeholder="Search inventory..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" onClick={() => setIsBulkUploadModalOpen(true)}>
                        <Upload className="h-4 w-4 mr-2" />
                        Bulk Upload
                    </Button>
                    <Button onClick={() => setIsAddModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Item
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-700 uppercase font-medium">
                                <tr>
                                    <th className="px-6 py-3">Item Name</th>
                                    <th className="px-6 py-3">Category</th>
                                    <th className="px-6 py-3">Stock Level</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Location</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                            Loading inventory...
                                        </td>
                                    </tr>
                                ) : filteredInventory.length > 0 ? (
                                    filteredInventory.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                                            <td className="px-6 py-4 capitalize text-gray-500">{item.category}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold">{item.currentStock}</span>
                                                    <span className="text-gray-400 text-xs">/ {item.maxLevel}</span>
                                                </div>
                                                <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${item.status === 'Critical Low' ? 'bg-red-500' :
                                                            item.status === 'Low Stock' ? 'bg-yellow-500' : 'bg-green-500'
                                                            }`}
                                                        style={{ width: `${Math.min((item.currentStock / item.maxLevel) * 100, 100)}%` }}
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge className={`${item.statusColor} border-0`}>
                                                    {item.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">{item.location}</td>
                                            <td className="px-6 py-4 text-right">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => openRestockModal(item)}
                                                    className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                                                >
                                                    <RefreshCw className="h-3 w-3 mr-1" />
                                                    Restock
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            No items found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Add Item Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Inventory Item</DialogTitle>
                        <DialogDescription>
                            Create a new entry in the laboratory inventory.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label>Item Name</Label>
                            <Input
                                value={newItem.name}
                                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                placeholder="e.g. Glucose Reagent"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select
                                    value={newItem.category}
                                    onValueChange={(val) => setNewItem({ ...newItem, category: val })}
                                >
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="reagent">Reagent</SelectItem>
                                        <SelectItem value="consumable">Consumable</SelectItem>
                                        <SelectItem value="equipment">Equipment</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Location</Label>
                                <Input
                                    value={newItem.location}
                                    onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                                    placeholder="e.g. Shelf A1"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Current Stock</Label>
                                <Input
                                    type="number"
                                    value={newItem.currentStock}
                                    onChange={(e) => setNewItem({ ...newItem, currentStock: parseInt(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Min Level</Label>
                                <Input
                                    type="number"
                                    value={newItem.minLevel}
                                    onChange={(e) => setNewItem({ ...newItem, minLevel: parseInt(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Max Level</Label>
                                <Input
                                    type="number"
                                    value={newItem.maxLevel}
                                    onChange={(e) => setNewItem({ ...newItem, maxLevel: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreateItem} disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700">
                            Add Item
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Restock Modal */}
            <Dialog open={isRestockModalOpen} onOpenChange={setIsRestockModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Restock {selectedItem?.name}</DialogTitle>
                        <DialogDescription>
                            Add more quantity to the selected item.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <span className="text-sm text-gray-500">Current Stock:</span>
                            <span className="font-bold text-lg">{selectedItem?.currentStock}</span>
                        </div>
                        <div className="space-y-2">
                            <Label>Quantity to Add</Label>
                            <Input
                                type="number"
                                value={restockAmount}
                                onChange={(e) => setRestockAmount(parseInt(e.target.value))}
                                autoFocus
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRestockModalOpen(false)}>Cancel</Button>
                        <Button onClick={handleRestock} disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700">
                            Confirm Restock
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <BulkUploadModal
                isOpen={isBulkUploadModalOpen}
                onClose={() => setIsBulkUploadModalOpen(false)}
                onUpload={handleBulkUpload}
                title="Bulk Upload Lab Inventory"
                templateFileName="lab_inventory_template.csv"
                templateData="name,category,currentStock,minLevel,maxLevel,location,unitCost,supplier\nBeaker 500ml,glassware,20,5,50,Shelf B2,15.5,LabSupplies Co\nNitric Acid,reagent,10,2,20,Acid Cabinet,45.0,Chemical Corp"
                expectedFields={['name', 'category', 'currentStock', 'minLevel', 'maxLevel', 'location', 'unitCost', 'supplier']}
            />
        </div>
    );
};

export default LabInventoryPage;
