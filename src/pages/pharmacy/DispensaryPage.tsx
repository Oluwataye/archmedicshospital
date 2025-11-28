
import { useState } from 'react';
import { Search, Check, Clock, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from '@/hooks/use-toast';

export default function DispensaryPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  
  const [pendingDispensations] = useState([
    {
      id: 'RX123456',
      patientName: 'John Doe',
      patientId: 'P-10542',
      medication: 'Atorvastatin',
      dosage: '20mg',
      quantity: '30 tablets',
      frequency: 'Once daily',
      doctor: 'Dr. Howard',
      date: 'Today, 10:30 AM',
      ward: 'ICU - Room 12',
      status: 'Ready to Dispense'
    },
    {
      id: 'RX123457',
      patientName: 'Sarah Miller',
      patientId: 'P-10398',
      medication: 'Metformin',
      dosage: '500mg',
      quantity: '60 tablets',
      frequency: 'Twice daily',
      doctor: 'Dr. Patel',
      date: 'Today, 9:45 AM',
      ward: 'Endocrinology - Room 5',
      status: 'Ready to Dispense'
    },
    {
      id: 'RX123458',
      patientName: 'Robert Johnson',
      patientId: 'P-10687',
      medication: 'Amoxicillin',
      dosage: '500mg',
      quantity: '21 capsules',
      frequency: 'Three times daily for 7 days',
      doctor: 'Dr. Garcia',
      date: 'Today, 9:15 AM',
      ward: 'General Medicine - Room 23',
      status: 'Preparing'
    },
  ]);
  
  const [dispensedItems] = useState([
    {
      id: 'RX123455',
      patientName: 'Emily Wilson',
      patientId: 'P-10754',
      medication: 'Lisinopril',
      dosage: '10mg',
      quantity: '30 tablets',
      frequency: 'Once daily',
      doctor: 'Dr. Williams',
      dispensedDate: 'Today, 8:30 AM',
      dispensedBy: 'Jane Pharmacist'
    },
    {
      id: 'RX123454',
      patientName: 'Michael Davis',
      patientId: 'P-10892',
      medication: 'Albuterol',
      dosage: '90mcg',
      quantity: '1 inhaler',
      frequency: 'As needed',
      doctor: 'Dr. Martinez',
      dispensedDate: 'Yesterday, 4:15 PM',
      dispensedBy: 'Jane Pharmacist'
    }
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Searching dispensary",
      description: `Query: ${searchQuery}`,
    });
  };

  const markAsDispensed = (id: string) => {
    toast({
      title: "Prescription Dispensed",
      description: `Prescription ${id} has been marked as dispensed`,
      variant: "default",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Ready to Dispense':
        return <Check size={16} className="text-green-500 mr-2" />;
      case 'Preparing':
        return <Clock size={16} className="text-orange-500 mr-2" />;
      default:
        return null;
    }
  };

  const filteredPendingItems = pendingDispensations.filter(item => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        item.patientName.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query) ||
        item.medication.toLowerCase().includes(query) ||
        item.patientId.toLowerCase().includes(query)
      );
    }
    return true;
  });
  
  const filteredDispensedItems = dispensedItems.filter(item => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        item.patientName.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query) ||
        item.medication.toLowerCase().includes(query) ||
        item.patientId.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dispensary</h1>
        <p className="text-gray-600">Prepare and dispense medications to patients</p>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Search Prescriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-500" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white"
                placeholder="Search by prescription ID, patient name or medication..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="pending" className="text-center py-2">
            Pending ({pendingDispensations.length})
          </TabsTrigger>
          <TabsTrigger value="dispensed" className="text-center py-2">
            Recently Dispensed
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rx ID</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Medication</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPendingItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          No pending prescriptions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPendingItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{item.patientName}</div>
                              <div className="text-xs text-gray-500">{item.patientId} • {item.ward}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{item.medication} {item.dosage}</div>
                              <div className="text-xs text-gray-500">{item.quantity} • {item.frequency}</div>
                            </div>
                          </TableCell>
                          <TableCell>{item.doctor}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getStatusIcon(item.status)}
                              <span className={item.status === 'Ready to Dispense' ? 'text-green-500' : 'text-orange-500'}>
                                {item.status}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="outline"
                              size="sm"
                              className="mr-2"
                              onClick={() => markAsDispensed(item.id)}
                              disabled={item.status !== 'Ready to Dispense'}
                            >
                              <Check size={16} className="mr-1" /> Dispense
                            </Button>
                            <Button 
                              variant="outline"
                              size="sm"
                              className="text-gray-500"
                            >
                              View
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
        </TabsContent>
        
        <TabsContent value="dispensed">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rx ID</TableHead>
                      <TableHead>Patient</TableHead>
                      <TableHead>Medication</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Dispensed At</TableHead>
                      <TableHead>Dispensed By</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDispensedItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-4">
                          No dispensed items found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDispensedItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{item.patientName}</div>
                              <div className="text-xs text-gray-500">{item.patientId}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{item.medication} {item.dosage}</div>
                              <div className="text-xs text-gray-500">{item.quantity} • {item.frequency}</div>
                            </div>
                          </TableCell>
                          <TableCell>{item.doctor}</TableCell>
                          <TableCell>{item.dispensedDate}</TableCell>
                          <TableCell>{item.dispensedBy}</TableCell>
                          <TableCell>
                            <Button 
                              variant="outline"
                              size="sm"
                            >
                              View Details
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
