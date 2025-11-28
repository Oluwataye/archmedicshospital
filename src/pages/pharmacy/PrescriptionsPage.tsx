
import { useState } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

export default function PrescriptionsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const [prescriptions] = useState([
    {
      id: 'RX123456',
      patientName: 'John Doe',
      patientId: 'P-10542',
      medication: 'Atorvastatin',
      dosage: '20mg',
      frequency: 'Daily',
      doctor: 'Dr. Howard',
      date: '10:30 AM Today',
      status: 'Pending',
      priority: 'Urgent',
      ward: 'ICU - Room 12'
    },
    {
      id: 'RX123457',
      patientName: 'Sarah Miller',
      patientId: 'P-10398',
      medication: 'Metformin',
      dosage: '500mg',
      frequency: 'BID',
      doctor: 'Dr. Patel',
      date: '9:45 AM Today',
      status: 'Pending',
      priority: 'High',
      ward: 'Endocrinology - Room 5'
    },
    {
      id: 'RX123458',
      patientName: 'Robert Johnson',
      patientId: 'P-10687',
      medication: 'Amoxicillin',
      dosage: '500mg',
      frequency: 'TID',
      doctor: 'Dr. Garcia',
      date: '9:15 AM Today',
      status: 'Pending',
      priority: 'Normal',
      ward: 'General Medicine - Room 23'
    },
    {
      id: 'RX123459',
      patientName: 'Emily Wilson',
      patientId: 'P-10754',
      medication: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Daily',
      doctor: 'Dr. Williams',
      date: '8:30 AM Today',
      status: 'Approved',
      priority: 'Normal',
      ward: 'Cardiology - Room 45'
    },
    {
      id: 'RX123460',
      patientName: 'Michael Davis',
      patientId: 'P-10892',
      medication: 'Albuterol',
      dosage: '90mcg',
      frequency: 'PRN',
      doctor: 'Dr. Martinez',
      date: 'Yesterday, 4:15 PM',
      status: 'Rejected',
      priority: 'High',
      ward: 'Pulmonology - Room 32'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-red-500';
      case 'High':
        return 'bg-orange-500';
      case 'Normal':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return '!';
      case 'High':
        return 'H';
      case 'Normal':
        return 'N';
      default:
        return '';
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Searching prescriptions",
      description: `Query: ${searchQuery}`,
    });
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    toast({
      title: "Filter applied",
      description: `Status: ${status}`,
      variant: "default",
    });
  };

  const handleApprove = (id: string) => {
    toast({
      title: "Prescription Approved",
      description: `Prescription ${id} has been approved`,
      variant: "default",
    });
  };

  const handleReject = (id: string) => {
    toast({
      title: "Prescription Rejected",
      description: `Prescription ${id} has been rejected`,
      variant: "destructive",
    });
  };

  const filteredPrescriptions = prescriptions.filter(prescription => {
    // Apply status filter
    if (statusFilter !== 'All' && prescription.status !== statusFilter) {
      return false;
    }
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        prescription.patientName.toLowerCase().includes(query) ||
        prescription.id.toLowerCase().includes(query) ||
        prescription.medication.toLowerCase().includes(query) ||
        prescription.patientId.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Prescriptions</h1>
        <p className="text-gray-600">Review, verify and manage prescription orders</p>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Filter Prescriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white"
                    placeholder="Search by patient name, ID or medication..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
            </div>
            
            <div className="flex items-center">
              <span className="mr-2 text-gray-700">Status:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center">
                    {statusFilter} <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleStatusFilterChange('All')}>
                    All
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleStatusFilterChange('Pending')}>
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusFilterChange('Approved')}>
                    Approved
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusFilterChange('Rejected')}>
                    Rejected
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button variant="outline" className="ml-2 flex items-center">
                <Filter className="mr-2 h-4 w-4" /> More Filters
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
                  <TableHead>Priority</TableHead>
                  <TableHead>Rx ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Medication</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrescriptions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      No prescriptions found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPrescriptions.map((prescription) => (
                    <TableRow 
                      key={prescription.id} 
                      className={prescription.priority === 'Urgent' ? 'bg-red-50' : prescription.priority === 'High' ? 'bg-orange-50' : ''}
                    >
                      <TableCell>
                        <div className="flex items-center">
                          <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs text-white font-bold ${getPriorityColor(prescription.priority)}`}>
                            {getPriorityIcon(prescription.priority)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{prescription.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                            {prescription.patientName.split(' ').map(name => name[0]).join('')}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{prescription.patientName}</div>
                            <div className="text-xs text-gray-500">{prescription.patientId} • {prescription.ward}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium text-gray-900">{prescription.medication}</div>
                        <div className="text-xs text-gray-500">{prescription.dosage} - {prescription.frequency}</div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-900">
                        {prescription.doctor}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-900">{prescription.date}</div>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(prescription.status)}`}>
                          {prescription.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {prescription.status === 'Pending' ? (
                          <>
                            <Button 
                              variant="ghost" 
                              className="text-green-600 hover:text-green-900 mr-3"
                              onClick={() => handleApprove(prescription.id)}
                            >
                              Approve
                            </Button>
                            <Button 
                              variant="ghost" 
                              className="text-red-600 hover:text-red-900"
                              onClick={() => handleReject(prescription.id)}
                            >
                              Reject
                            </Button>
                          </>
                        ) : (
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
