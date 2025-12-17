import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface AddInventoryItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onItemAdded: (item: any) => void;
}

const AddInventoryItemModal: React.FC<AddInventoryItemModalProps> = ({
    isOpen,
    onClose,
    onItemAdded,
}) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        currentStock: '',
        minLevel: '',
        maxLevel: '',
        location: '',
        expiryDate: '',
        unitCost: '',
        supplier: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const categories = [
        'Collection Supplies',
        'Testing Supplies',
        'Equipment Supplies',
        'Reagents',
        'Consumables',
        'Other',
    ];

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Item name is required';
        }

        if (!formData.category) {
            newErrors.category = 'Category is required';
        }

        if (!formData.currentStock || parseInt(formData.currentStock) < 0) {
            newErrors.currentStock = 'Valid current stock is required';
        }

        if (!formData.minLevel || parseInt(formData.minLevel) < 0) {
            newErrors.minLevel = 'Valid minimum level is required';
        }

        if (!formData.maxLevel || parseInt(formData.maxLevel) < 0) {
            newErrors.maxLevel = 'Valid maximum level is required';
        }

        if (parseInt(formData.minLevel) > parseInt(formData.maxLevel)) {
            newErrors.minLevel = 'Minimum level cannot exceed maximum level';
        }

        if (!formData.location.trim()) {
            newErrors.location = 'Location is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        setLoading(true);

        try {
            // Simulate API call - replace with actual API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            const currentStock = parseInt(formData.currentStock);
            const minLevel = parseInt(formData.minLevel);

            // Determine status based on stock levels
            let status = 'In Stock';
            let statusColor = 'bg-green-100 text-green-800';

            if (currentStock === 0) {
                status = 'Out of Stock';
                statusColor = 'bg-red-100 text-red-800';
            } else if (currentStock < minLevel) {
                status = 'Critical Low';
                statusColor = 'bg-red-100 text-red-800';
            } else if (currentStock <= minLevel * 1.2) {
                status = 'Low Stock';
                statusColor = 'bg-yellow-100 text-yellow-800';
            }

            const newItem = {
                id: `INV-${Date.now()}`,
                name: formData.name,
                category: formData.category,
                currentStock: parseInt(formData.currentStock),
                minLevel: parseInt(formData.minLevel),
                maxLevel: parseInt(formData.maxLevel),
                location: formData.location,
                expiryDate: formData.expiryDate || 'N/A',
                status,
                statusColor,
                lastRestock: new Date().toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                }),
                unitCost: formData.unitCost ? parseFloat(formData.unitCost) : 0,
                supplier: formData.supplier || 'N/A',
            };

            onItemAdded(newItem);
            toast.success('Inventory item added successfully');
            handleClose();
        } catch (error) {
            console.error('Error adding inventory item:', error);
            toast.error('Failed to add inventory item');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            name: '',
            category: '',
            currentStock: '',
            minLevel: '',
            maxLevel: '',
            location: '',
            expiryDate: '',
            unitCost: '',
            supplier: '',
        });
        setErrors({});
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Inventory Item</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Item Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Item Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="e.g., CBC Test Tubes"
                                className={errors.name ? 'border-red-500' : ''}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name}</p>
                            )}
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <Label htmlFor="category">
                                Category <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={formData.category}
                                onValueChange={(value) => handleInputChange('category', value)}
                            >
                                <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat} value={cat}>
                                            {cat}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.category && (
                                <p className="text-sm text-red-500">{errors.category}</p>
                            )}
                        </div>

                        {/* Current Stock */}
                        <div className="space-y-2">
                            <Label htmlFor="currentStock">
                                Current Stock <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="currentStock"
                                type="number"
                                min="0"
                                value={formData.currentStock}
                                onChange={(e) => handleInputChange('currentStock', e.target.value)}
                                placeholder="e.g., 250"
                                className={errors.currentStock ? 'border-red-500' : ''}
                            />
                            {errors.currentStock && (
                                <p className="text-sm text-red-500">{errors.currentStock}</p>
                            )}
                        </div>

                        {/* Minimum Level */}
                        <div className="space-y-2">
                            <Label htmlFor="minLevel">
                                Minimum Level <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="minLevel"
                                type="number"
                                min="0"
                                value={formData.minLevel}
                                onChange={(e) => handleInputChange('minLevel', e.target.value)}
                                placeholder="e.g., 100"
                                className={errors.minLevel ? 'border-red-500' : ''}
                            />
                            {errors.minLevel && (
                                <p className="text-sm text-red-500">{errors.minLevel}</p>
                            )}
                        </div>

                        {/* Maximum Level */}
                        <div className="space-y-2">
                            <Label htmlFor="maxLevel">
                                Maximum Level <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="maxLevel"
                                type="number"
                                min="0"
                                value={formData.maxLevel}
                                onChange={(e) => handleInputChange('maxLevel', e.target.value)}
                                placeholder="e.g., 500"
                                className={errors.maxLevel ? 'border-red-500' : ''}
                            />
                            {errors.maxLevel && (
                                <p className="text-sm text-red-500">{errors.maxLevel}</p>
                            )}
                        </div>

                        {/* Location */}
                        <div className="space-y-2">
                            <Label htmlFor="location">
                                Location <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="location"
                                value={formData.location}
                                onChange={(e) => handleInputChange('location', e.target.value)}
                                placeholder="e.g., Cabinet A1"
                                className={errors.location ? 'border-red-500' : ''}
                            />
                            {errors.location && (
                                <p className="text-sm text-red-500">{errors.location}</p>
                            )}
                        </div>

                        {/* Expiry Date */}
                        <div className="space-y-2">
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input
                                id="expiryDate"
                                type="date"
                                value={formData.expiryDate}
                                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                            />
                        </div>

                        {/* Unit Cost */}
                        <div className="space-y-2">
                            <Label htmlFor="unitCost">Unit Cost</Label>
                            <Input
                                id="unitCost"
                                type="number"
                                step="0.01"
                                min="0"
                                value={formData.unitCost}
                                onChange={(e) => handleInputChange('unitCost', e.target.value)}
                                placeholder="e.g., 15.50"
                            />
                        </div>

                        {/* Supplier */}
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="supplier">Supplier</Label>
                            <Input
                                id="supplier"
                                value={formData.supplier}
                                onChange={(e) => handleInputChange('supplier', e.target.value)}
                                placeholder="e.g., MedSupply Inc."
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                'Add Item'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddInventoryItemModal;
