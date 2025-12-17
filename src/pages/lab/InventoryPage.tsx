
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, AlertTriangle, ShoppingCart, Edit, Trash2, Download } from 'lucide-react';
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddInventoryItemModal from '@/components/lab/AddInventoryItemModal';
import EditInventoryItemModal from '@/components/lab/EditInventoryItemModal';
import DeleteConfirmationDialog from '@/components/lab/DeleteConfirmationDialog';

const InventoryPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  // Inventory data - managed as state
  const [allInventoryItems, setAllInventoryItems] = useState([
    {
      id: 'INV-001',
      name: 'CBC Test Tubes',
      category: 'Collection Supplies',
      currentStock: 250,
      minLevel: 100,
      maxLevel: 500,
      location: 'Cabinet A1',
      expiryDate: 'Jan 15, 2026',
      status: 'In Stock',
      statusColor: 'bg-green-100 text-green-800',
      lastRestock: 'Apr 20, 2025'
    },
    {
      id: 'INV-002',
      name: 'Glucose Test Strips',
      category: 'Testing Supplies',
      currentStock: 80,
      minLevel: 75,
      maxLevel: 300,
      location: 'Cabinet B2',
      expiryDate: 'Sep 30, 2025',
      status: 'Low Stock',
      statusColor: 'bg-yellow-100 text-yellow-800',
      lastRestock: 'Mar 15, 2025'
    },
    {
      id: 'INV-003',
      name: 'Alcohol Swabs',
      category: 'Collection Supplies',
      currentStock: 450,
      minLevel: 200,
      maxLevel: 800,
      location: 'Cabinet A2',
      expiryDate: 'Dec 20, 2026',
      status: 'In Stock',
      statusColor: 'bg-green-100 text-green-800',
      lastRestock: 'Apr 10, 2025'
    },
    {
      id: 'INV-004',
      name: 'Urine Sample Cups',
      category: 'Collection Supplies',
      currentStock: 175,
      minLevel: 150,
      maxLevel: 500,
      location: 'Cabinet A3',
      expiryDate: 'Oct 15, 2026',
      status: 'In Stock',
      statusColor: 'bg-green-100 text-green-800',
      lastRestock: 'Apr 05, 2025'
    },
    {
      id: 'INV-005',
      name: 'Troponin Test Kits',
      category: 'Testing Supplies',
      currentStock: 25,
      minLevel: 30,
      maxLevel: 100,
      location: 'Cabinet C1',
      expiryDate: 'Jul 10, 2025',
      status: 'Critical Low',
      statusColor: 'bg-red-100 text-red-800',
      lastRestock: 'Feb 28, 2025'
    },
    {
      id: 'INV-006',
      name: 'Microscope Slides',
      category: 'Equipment Supplies',
      currentStock: 300,
      minLevel: 150,
      maxLevel: 600,
      location: 'Cabinet D2',
      expiryDate: 'N/A',
      status: 'In Stock',
      statusColor: 'bg-green-100 text-green-800',
      lastRestock: 'Mar 20, 2025'
    },
    {
      id: 'INV-007',
      name: 'Centrifuge Tubes',
      category: 'Equipment Supplies',
      currentStock: 200,
      minLevel: 150,
      maxLevel: 400,
      location: 'Cabinet D1',
      expiryDate: 'N/A',
      status: 'In Stock',
      statusColor: 'bg-green-100 text-green-800',
      lastRestock: 'Apr 12, 2025'
    },
    {
      id: 'INV-008',
      name: 'HbA1c Test Kit',
      category: 'Testing Supplies',
      currentStock: 40,
      minLevel: 50,
      maxLevel: 200,
      location: 'Cabinet C2',
      expiryDate: 'Sep 15, 2025',
      status: 'Low Stock',
      statusColor: 'bg-yellow-100 text-yellow-800',
      lastRestock: 'Mar 05, 2025'
    }
  ]);

  // Filter inventory items based on search query and category
  const filteredInventoryItems = allInventoryItems.filter(item => {
    const searchMatch = searchQuery === '' ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    const categoryMatch = categoryFilter === 'all' ||
      item.category === categoryFilter;

    return searchMatch && categoryMatch;
  });

  // Extract unique categories for filter
  const uniqueCategories = Array.from(new Set(allInventoryItems.map(item => item.category)));

  // Handle order item button
  const handleOrderItem = (itemId: string) => {
    toast.success(`Order placed for item ${itemId}`);
  };

  // Handle view details button
  const handleViewDetails = (itemId: string) => {
    toast.info(`Viewing details for item ${itemId}`);
  };

  // Handle adding a new inventory item
  const handleAddItem = () => {
    setIsAddModalOpen(true);
  };

  // Handle item added from modal
  const handleItemAdded = (newItem: any) => {
    setAllInventoryItems(prev => [newItem, ...prev]);
  };

  // Handle edit item
  const handleEditItem = (item: any) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  // Handle item updated from modal
  const handleItemUpdated = (updatedItem: any) => {
    setAllInventoryItems(prev =>
      prev.map(item => (item.id === updatedItem.id ? updatedItem : item))
    );
  };

  // Handle delete item
  const handleDeleteItem = (item: any) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (selectedItem) {
      setAllInventoryItems(prev => prev.filter(item => item.id !== selectedItem.id));
      toast.success(`${selectedItem.name} deleted successfully`);
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
    }
  };

  // Export to CSV
  const handleExportToCSV = () => {
    try {
      // Prepare CSV headers
      const headers = [
        'ID',
        'Name',
        'Category',
        'Current Stock',
        'Min Level',
        'Max Level',
        'Location',
        'Expiry Date',
        'Status',
        'Last Restock',
      ];

      // Prepare CSV rows
      const rows = filteredInventoryItems.map(item => [
        item.id,
        item.name,
        item.category,
        item.currentStock,
        item.minLevel,
        item.maxLevel,
        item.location,
        item.expiryDate,
        item.status,
        item.lastRestock,
      ]);

      // Combine headers and rows
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `lab_inventory_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Inventory exported successfully');
    } catch (error) {
      console.error('Error exporting inventory:', error);
      toast.error('Failed to export inventory');
    }
  };

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="text-gray-500 text-sm mb-4">Laboratory &gt; Inventory</div>

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Laboratory Inventory</h1>
        <Button
          onClick={handleExportToCSV}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export to CSV
        </Button>
      </div>

      {/* Alert for low stock items */}
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <span className="font-bold">Inventory Alert:</span> 3 items are at or below minimum stock levels.
              <Button
                variant="link"
                size="sm"
                className="text-yellow-800 p-0"
                onClick={() => setCategoryFilter('all')}
              >
                View all low stock items
              </Button>
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by item name or ID..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="md:w-1/5">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Filter by Category</SelectLabel>
                  <SelectItem value="all">All Categories</SelectItem>
                  {uniqueCategories.map((category, index) => (
                    <SelectItem key={index} value={category}>{category}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleAddItem}
            className="md:w-auto"
            style={{ backgroundColor: '#3B82F6' }}
          >
            Add New Item
          </Button>
        </div>
      </Card>

      {/* Inventory List */}
      <Card className="border border-gray-200 mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Level</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInventoryItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.currentStock}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.minLevel}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.expiryDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.statusColor}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      {(item.status === 'Low Stock' || item.status === 'Critical Low') && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-900 p-0"
                          onClick={() => handleOrderItem(item.id)}
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Order
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-green-600 hover:text-green-900 p-0"
                        onClick={() => handleEditItem(item)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-900 p-0"
                        onClick={() => handleDeleteItem(item)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state if no items */}
        {filteredInventoryItems.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            <p>No inventory items found matching your criteria.</p>
          </div>
        )}

        {/* Pagination */}
        {filteredInventoryItems.length > 0 && (
          <div className="flex items-center justify-between p-4">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredInventoryItems.length}</span> of{" "}
              <span className="font-medium">{filteredInventoryItems.length}</span> items
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="text-sm" disabled>Previous</Button>
              <Button variant="default" size="sm" className="text-sm bg-blue-500">1</Button>
              <Button variant="outline" size="sm" className="text-sm" disabled>Next</Button>
            </div>
          </div>
        )}
      </Card>

      {/* Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border border-green-200 bg-green-50">
          <h3 className="font-bold text-green-800 mb-1">In Stock Items</h3>
          <p className="text-2xl font-bold text-green-700">
            {allInventoryItems.filter(item => item.status === 'In Stock').length}
          </p>
        </Card>
        <Card className="p-4 border border-yellow-200 bg-yellow-50">
          <h3 className="font-bold text-yellow-800 mb-1">Low Stock Items</h3>
          <p className="text-2xl font-bold text-yellow-700">
            {allInventoryItems.filter(item => item.status === 'Low Stock').length}
          </p>
        </Card>
        <Card className="p-4 border border-red-200 bg-red-50">
          <h3 className="font-bold text-red-800 mb-1">Critical Low Items</h3>
          <p className="text-2xl font-bold text-red-700">
            {allInventoryItems.filter(item => item.status === 'Critical Low').length}
          </p>
        </Card>
        <Card className="p-4 border border-blue-200 bg-blue-50">
          <h3 className="font-bold text-blue-800 mb-1">Total Items</h3>
          <p className="text-2xl font-bold text-blue-700">
            {allInventoryItems.length}
          </p>
        </Card>
      </div>

      {/* Add Inventory Item Modal */}
      <AddInventoryItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onItemAdded={handleItemAdded}
      />

      {/* Edit Inventory Item Modal */}
      <EditInventoryItemModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onItemUpdated={handleItemUpdated}
        item={selectedItem}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        itemName={selectedItem?.name || ''}
      />
    </div>
  );
};

export default InventoryPage;
