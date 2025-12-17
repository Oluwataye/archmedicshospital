import { useState, useEffect } from 'react';
import ApiService from '@/services/apiService';
import { toast } from 'sonner';

export interface LabInventoryItem {
    id: string;
    name: string;
    category: string;
    currentStock: number;
    minLevel: number;
    maxLevel: number;
    location: string;
    expiryDate?: string;
    status: string;
    statusColor: string;
    lastRestock?: string;
    unitCost?: number;
    supplier?: string;
}

export function useLabInventory(filters?: any) {
    const [items, setItems] = useState<LabInventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const data = await ApiService.getLabInventory(filters);
            setItems(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch lab inventory');
            toast.error('Failed to load lab inventory');
        } finally {
            setLoading(false);
        }
    };

    const addItem = async (itemData: any) => {
        try {
            const newItem = await ApiService.createLabInventoryItem(itemData);
            setItems(prev => [newItem, ...prev]);
            toast.success('Inventory item added successfully');
            return newItem;
        } catch (err: any) {
            toast.error('Failed to add inventory item');
            throw err;
        }
    };

    const updateItem = async (id: string, updates: any) => {
        try {
            const updatedItem = await ApiService.updateLabInventoryItem(id, updates);
            setItems(prev =>
                prev.map(item => (item.id === id ? updatedItem : item))
            );
            toast.success('Inventory item updated successfully');
            return updatedItem;
        } catch (err: any) {
            toast.error('Failed to update inventory item');
            throw err;
        }
    };

    const deleteItem = async (id: string) => {
        try {
            await ApiService.deleteLabInventoryItem(id);
            setItems(prev => prev.filter(item => item.id !== id));
            toast.success('Inventory item deleted successfully');
        } catch (err: any) {
            toast.error('Failed to delete inventory item');
            throw err;
        }
    };

    const restockItem = async (id: string, quantity: number, reason?: string) => {
        try {
            const updatedItem = await ApiService.restockLabInventoryItem(id, quantity, reason);
            setItems(prev =>
                prev.map(item => (item.id === id ? { ...item, ...updatedItem } : item))
            );
            toast.success(`Restocked +${quantity} units`);
            return updatedItem;
        } catch (err: any) {
            toast.error('Failed to restock item');
            throw err;
        }
    };

    useEffect(() => {
        fetchItems();
    }, [JSON.stringify(filters)]);

    return {
        items,
        loading,
        error,
        refetch: fetchItems,
        addItem,
        updateItem,
        deleteItem,
        restockItem
    };
}

export function useLabInventoryStats() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const data = await ApiService.getLabInventoryStats();
            setStats(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch inventory statistics');
            toast.error('Failed to load inventory statistics');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return { stats, loading, error, refetch: fetchStats };
}
