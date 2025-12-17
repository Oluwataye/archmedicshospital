import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, AlertTriangle, Package, History } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ApiService } from '@/services/apiService';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import StockAlerts from '@/components/pharmacy/StockAlerts';

interface InventoryItem {
  id: string;
  name: string;
  generic_name: string;
  category: string;
  sku: string;
  current_stock: number;
  reorder_level: number;
  unit_measure: string;
  expiry_date?: string; // From batches
  supplier_name?: string;
  is_active: boolean;
}

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [alerts, setAlerts] = useState({ lowStock: [], expiringBatches: [] });

  // Restock Modal
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [restockForm, setRestockForm] = useState({
    quantity: '',
    type: 'IN',
    notes: ''
  });

  // Add Item Modal
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [addItemForm, setAddItemForm] = useState({
    name: '',
    generic_name: '',
    category: '',
    sku: '',
    reorder_level: '',
    unit_measure: 'tablets'
  });

  // History Modal
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [stockHistory, setStockHistory] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [itemsData, alertsData] = await Promise.all([
        ApiService.getInventoryItems(),
        ApiService.getInventoryAlerts()
      ]);
      setItems(itemsData);
      setAlerts(alertsData);
    } catch (error) {
      console.error('Error loading inventory:', error);
      toast.error('Failed to load inventory data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await ApiService.getInventoryItems({ search: searchQuery });
      setItems(data);
    } catch (error) {
      console.error('Error searching inventory:', error);
      toast.error('Failed to search inventory');
    } finally {
      setLoading(false);
    }
  };

  const openRestockModal = (item: any) => {
    setSelectedItem(item);
    setRestockForm({
      quantity: '',
      type: 'IN',
      notes: ''
    });
    setIsRestockModalOpen(true);
  };

  const handleRestockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    try {
      await ApiService.recordStockMovement({
        item_id: selectedItem.id,
        type: restockForm.type,
        quantity: parseInt(restockForm.quantity),
        notes: restockForm.notes,
        reference_type: 'Manual Adjustment'
      });

      toast.success('Stock updated successfully');
      setIsRestockModalOpen(false);
      loadData(); // Refresh data
    } catch (error) {
      console.error('Error updating stock:', error);
      toast.error('Failed to update stock');
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ApiService.createInventoryItem({
        ...addItemForm,
        reorder_level: parseInt(addItemForm.reorder_level),
        current_stock: 0,
        is_active: true
      });
      toast.success('Item added successfully');
      setIsAddItemModalOpen(false);
      setAddItemForm({
        name: '',
        generic_name: '',
        category: '',
        sku: '',
        reorder_level: '',
        unit_measure: 'tablets'
      });
      loadData();
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error('Failed to add item');
    }
  };

  const handleViewHistory = async () => {
    try {
      setIsHistoryModalOpen(true);
      // Fetch stock movement history
      const history = await ApiService.getStockMovements();
      setStockHistory(history);
    } catch (error) {
      console.error('Error loading history:', error);
      toast.error('Failed to load history');
    }
  };

  const getStatusColor = (current: number, reorder: number) => {
    if (current <= reorder) return 'text-red-600 bg-red-50';
    if (current <= reorder * 1.5) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getProgressColor = (current: number, reorder: number) => {
    if (current <= reorder) return 'bg-red-500';
    if (current <= reorder * 1.5) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (loading && items.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground mt-1">Track stock levels, manage suppliers, and handle reorders</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleViewHistory}>
            <History className="mr-2 h-4 w-4" /> History
          </Button>
          <Button onClick={() => setIsAddItemModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Item
          </Button>
        </div>
      </div>

      {/* Alerts Section */}
      <StockAlerts
        lowStock={alerts.lowStock}
        expiringBatches={alerts.expiringBatches}
        onRestock={openRestockModal}
      />

      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="relative flex-1">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    className="pl-10"
                    placeholder="Search by name, SKU, or generic name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" className="flex items-center">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Details</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Stock Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No inventory items found
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.generic_name}</p>
                        </div>
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="font-mono text-xs">{item.sku}</TableCell>
                      <TableCell className="w-[200px]">
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>{item.current_stock} {item.unit_measure}</span>
                            <span className="text-muted-foreground">Reorder: {item.reorder_level}</span>
                          </div>
                          <Progress
                            value={Math.min(100, (item.current_stock / (item.reorder_level * 3)) * 100)}
                            className={`h-2 ${getProgressColor(item.current_stock, item.reorder_level)}`}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.current_stock, item.reorder_level)}`}>
                          {item.current_stock <= item.reorder_level ? 'Low Stock' : 'In Stock'}
                        </span>
                      </TableCell>
                      <TableCell>{item.supplier_name || '-'}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openRestockModal(item)}
                        >
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Restock/Manage Modal */}
      <Dialog open={isRestockModalOpen} onOpenChange={setIsRestockModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Stock: {selectedItem?.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRestockSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Action Type</Label>
              <Select
                value={restockForm.type}
                onValueChange={(value) => setRestockForm(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IN">Restock (Add Stock)</SelectItem>
                  <SelectItem value="OUT">Remove Stock</SelectItem>
                  <SelectItem value="ADJUSTMENT">Correction/Adjustment</SelectItem>
                  <SelectItem value="EXPIRED">Remove Expired</SelectItem>
                  <SelectItem value="DAMAGED">Remove Damaged</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Quantity ({selectedItem?.unit_measure})</Label>
              <Input
                type="number"
                min="1"
                required
                value={restockForm.quantity}
                onChange={(e) => setRestockForm(prev => ({ ...prev, quantity: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Input
                placeholder="Reason for adjustment, PO number, etc."
                value={restockForm.notes}
                onChange={(e) => setRestockForm(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsRestockModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Update Stock
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Item Modal */}
      <Dialog open={isAddItemModalOpen} onOpenChange={setIsAddItemModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Inventory Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddItem} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Item Name *</Label>
                <Input
                  required
                  value={addItemForm.name}
                  onChange={(e) => setAddItemForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Paracetamol"
                />
              </div>
              <div className="space-y-2">
                <Label>Generic Name</Label>
                <Input
                  value={addItemForm.generic_name}
                  onChange={(e) => setAddItemForm(prev => ({ ...prev, generic_name: e.target.value }))}
                  placeholder="e.g., Acetaminophen"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={addItemForm.category}
                  onValueChange={(value) => setAddItemForm(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Analgesics">Analgesics</SelectItem>
                    <SelectItem value="Antibiotics">Antibiotics</SelectItem>
                    <SelectItem value="Antihistamines">Antihistamines</SelectItem>
                    <SelectItem value="Cardiovascular">Cardiovascular</SelectItem>
                    <SelectItem value="Diabetes">Diabetes</SelectItem>
                    <SelectItem value="Gastrointestinal">Gastrointestinal</SelectItem>
                    <SelectItem value="Respiratory">Respiratory</SelectItem>
                    <SelectItem value="Vitamins">Vitamins</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>SKU *</Label>
                <Input
                  required
                  value={addItemForm.sku}
                  onChange={(e) => setAddItemForm(prev => ({ ...prev, sku: e.target.value }))}
                  placeholder="e.g., MED-001"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Reorder Level *</Label>
                <Input
                  type="number"
                  min="1"
                  required
                  value={addItemForm.reorder_level}
                  onChange={(e) => setAddItemForm(prev => ({ ...prev, reorder_level: e.target.value }))}
                  placeholder="e.g., 100"
                />
              </div>
              <div className="space-y-2">
                <Label>Unit of Measure *</Label>
                <Select
                  value={addItemForm.unit_measure}
                  onValueChange={(value) => setAddItemForm(prev => ({ ...prev, unit_measure: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tablets">Tablets</SelectItem>
                    <SelectItem value="capsules">Capsules</SelectItem>
                    <SelectItem value="ml">Milliliters (ml)</SelectItem>
                    <SelectItem value="mg">Milligrams (mg)</SelectItem>
                    <SelectItem value="bottles">Bottles</SelectItem>
                    <SelectItem value="boxes">Boxes</SelectItem>
                    <SelectItem value="units">Units</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddItemModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <Plus className="mr-2 h-4 w-4" /> Add Item
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* History Modal */}
      <Dialog open={isHistoryModalOpen} onOpenChange={setIsHistoryModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Stock Movement History</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-md border max-h-[60vh] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Performed By</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockHistory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No stock movements found
                      </TableCell>
                    </TableRow>
                  ) : (
                    stockHistory.map((movement: any) => (
                      <TableRow key={movement.id}>
                        <TableCell className="whitespace-nowrap">
                          {new Date(movement.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell>{movement.item_name || '-'}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${movement.type === 'IN' ? 'bg-green-100 text-green-700' :
                              movement.type === 'OUT' ? 'bg-red-100 text-red-700' :
                                'bg-blue-100 text-blue-700'
                            }`}>
                            {movement.type}
                          </span>
                        </TableCell>
                        <TableCell>{movement.quantity}</TableCell>
                        <TableCell>{movement.performed_by_name || '-'}</TableCell>
                        <TableCell className="max-w-xs truncate">{movement.notes || '-'}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsHistoryModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
