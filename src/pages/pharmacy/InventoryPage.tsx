
import { useState } from 'react';
import { Search, Filter, Plus, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

export default function InventoryPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [inventoryItems] = useState([
    {
      id: 'MED001',
      name: 'Amoxicillin',
      type: 'Antibiotic',
      form: 'Tablet',
      strength: '500mg',
      quantity: 120,
      threshold: 50,
      supplier: 'PharmSource Inc.',
      expiryDate: '2026-12-31',
      location: 'Cabinet A-3'
    },
    {
      id: 'MED002',
      name: 'Lisinopril',
      type: 'Antihypertensive',
      form: 'Tablet',
      strength: '10mg',
      quantity: 75,
      threshold: 30,
      supplier: 'MediPharm Ltd.',
      expiryDate: '2025-09-15',
      location: 'Cabinet B-2'
    },
    {
      id: 'MED003',
      name: 'Insulin Lispro',
      type: 'Antidiabetic',
      form: 'Solution',
      strength: '100U/mL',
      quantity: 15,
      threshold: 20,
      supplier: 'DiaCare Solutions',
      expiryDate: '2025-04-30',
      location: 'Refrigerator R-1'
    },
    {
      id: 'MED004',
      name: 'Atorvastatin',
      type: 'Statin',
      form: 'Tablet',
      strength: '20mg',
      quantity: 200,
      threshold: 80,
      supplier: 'PharmSource Inc.',
      expiryDate: '2026-08-25',
      location: 'Cabinet A-5'
    },
    {
      id: 'MED005',
      name: 'Morphine Sulfate',
      type: 'Analgesic',
      form: 'Solution',
      strength: '10mg/mL',
      quantity: 12,
      threshold: 15,
      supplier: 'PainCare Solutions',
      expiryDate: '2025-05-20',
      location: 'Controlled Substances Safe'
    }
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Searching inventory",
      description: `Query: ${searchQuery}`,
    });
  };

  const requestRestock = (id: string, name: string) => {
    toast({
      title: "Restock Requested",
      description: `A restock request has been sent for ${name} (${id})`,
      variant: "default",
    });
  };

  const getBgColorForQuantity = (quantity: number, threshold: number) => {
    if (quantity <= threshold * 0.5) {
      return "bg-red-50";
    } else if (quantity <= threshold) {
      return "bg-yellow-50";
    }
    return "";
  };

  const getStatusForQuantity = (quantity: number, threshold: number) => {
    if (quantity <= threshold * 0.5) {
      return { status: "Critical Low", color: "text-red-500", icon: <AlertTriangle size={16} className="mr-1" /> };
    } else if (quantity <= threshold) {
      return { status: "Low", color: "text-yellow-500", icon: <AlertTriangle size={16} className="mr-1" /> };
    }
    return { status: "Normal", color: "text-green-500", icon: null };
  };

  const getProgressColor = (quantity: number, threshold: number) => {
    if (quantity <= threshold * 0.5) {
      return "bg-red-500";
    } else if (quantity <= threshold) {
      return "bg-yellow-500";
    }
    return "bg-green-500";
  };

  const calculateProgressPercentage = (quantity: number) => {
    // Assume 250 is the max capacity for visualization purposes
    const maxCapacity = 250;
    return Math.min(100, (quantity / maxCapacity) * 100);
  };

  const filteredItems = inventoryItems.filter(item => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Drug Inventory</h1>
        <p className="text-gray-600">Manage and track pharmaceutical inventory</p>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Inventory Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-1">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white"
                    placeholder="Search medications..."
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
              <Button className="flex items-center">
                <Plus className="mr-2 h-4 w-4" /> Add Medication
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medication ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Form/Strength</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-4">
                      No medications found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((item) => {
                    const { status, color, icon } = getStatusForQuantity(item.quantity, item.threshold);
                    return (
                      <TableRow key={item.id} className={getBgColorForQuantity(item.quantity, item.threshold)}>
                        <TableCell className="font-medium">{item.id}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>{item.form}, {item.strength}</TableCell>
                        <TableCell>
                          <div className="flex flex-col space-y-1">
                            <div className="text-sm">{item.quantity} units</div>
                            <Progress 
                              value={calculateProgressPercentage(item.quantity)} 
                              className={`h-2 ${getProgressColor(item.quantity, item.threshold)}`}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`flex items-center ${color}`}>
                            {icon}
                            <span>{status}</span>
                          </div>
                        </TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>{new Date(item.expiryDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {item.quantity <= item.threshold && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-primary"
                              onClick={() => requestRestock(item.id, item.name)}
                            >
                              Restock
                            </Button>
                          )}
                          {item.quantity > item.threshold && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-gray-500"
                            >
                              View
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
