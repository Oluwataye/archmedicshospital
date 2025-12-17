import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, Package } from 'lucide-react';

interface RestockModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRestocked: (itemId: string, newStock: number) => void;
    item: any | null;
}

const RestockModal: React.FC<RestockModalProps> = ({
    isOpen,
    onClose,
    onRestocked,
    item,
}) => {
    const [loading, setLoading] = useState(false);
    const [quantity, setQuantity] = useState('');
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const qty = parseInt(quantity);

        if (!quantity || qty <= 0) {
            setError('Please enter a valid quantity');
            return;
        }

        setLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            const newStock = item.currentStock + qty;
            onRestocked(item.id, newStock);

            toast.success(`Successfully restocked +${qty} units`);
            handleClose();
        } catch (error) {
            console.error('Error restocking item:', error);
            toast.error('Failed to restock item');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setQuantity('');
        setReason('');
        setError('');
        onClose();
    };

    if (!item) return null;

    const newStock = item.currentStock + (parseInt(quantity) || 0);

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Restock Item
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Item Info */}
                    <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                        <div>
                            <p className="text-sm text-gray-600">Item</p>
                            <p className="font-semibold">{item.name}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Current Stock</p>
                                <p className="font-semibold text-lg">{item.currentStock}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Min Level</p>
                                <p className="font-semibold text-lg">{item.minLevel}</p>
                            </div>
                        </div>
                    </div>

                    {/* Quantity Input */}
                    <div className="space-y-2">
                        <Label htmlFor="quantity">
                            Quantity to Add <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="quantity"
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => {
                                setQuantity(e.target.value);
                                setError('');
                            }}
                            placeholder="Enter quantity"
                            className={error ? 'border-red-500' : ''}
                        />
                        {error && (
                            <p className="text-sm text-red-500">{error}</p>
                        )}
                    </div>

                    {/* New Stock Preview */}
                    {quantity && parseInt(quantity) > 0 && (
                        <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600">New Stock Level</p>
                            <p className="text-2xl font-bold text-green-700">{newStock}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                {newStock >= item.minLevel ? '✓ Above minimum level' : '⚠ Still below minimum level'}
                            </p>
                        </div>
                    )}

                    {/* Reason */}
                    <div className="space-y-2">
                        <Label htmlFor="reason">Reason (Optional)</Label>
                        <Textarea
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="e.g., Regular restock, Emergency order, etc."
                            rows={3}
                        />
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
                                    Restocking...
                                </>
                            ) : (
                                'Confirm Restock'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default RestockModal;
