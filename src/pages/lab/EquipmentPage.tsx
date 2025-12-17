import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, AlertTriangle, Calendar, Wrench, Loader2, Plus } from 'lucide-react';
import { toast } from "sonner";
import apiService from '@/services/apiService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EquipmentPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const [loading, setLoading] = useState(true);
  const [equipmentList, setEquipmentList] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEquipment, setNewEquipment] = useState({
    name: '',
    model: '',
    manufacturer: '',
    serial_number: '',
    location: '',
    equipment_type: 'Analyzer',
    status: 'Operational'
  });

  // Fetch equipment on mount
  React.useEffect(() => {
    fetchEquipment();
  }, [statusFilter, typeFilter]);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const data = await apiService.getLabEquipment({
        status: statusFilter,
        type: typeFilter,
        search: searchQuery
      });
      setEquipmentList(data);
    } catch (error) {
      console.error('Error fetching equipment:', error);
      toast.error('Failed to load equipment list');
    } finally {
      setLoading(false);
    }
  };

  // Handle search with debounce
  React.useEffect(() => {
    const timer = setTimeout(() => {
      fetchEquipment();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleCreateEquipment = async () => {
    try {
      await apiService.createLabEquipment(newEquipment);
      toast.success('Equipment added successfully');
      setShowAddModal(false);
      fetchEquipment();
      // Reset form
      setNewEquipment({
        name: '',
        model: '',
        manufacturer: '',
        serial_number: '',
        location: '',
        equipment_type: 'Analyzer',
        status: 'Operational'
      });
    } catch (error) {
      console.error('Error creating equipment:', error);
      toast.error('Failed to create equipment');
    }
  };

  // Mock upcoming maintenance for now (backend endpoint needed for global view)
  const upcomingMaintenance = [
    {
      id: 'MAINT-001',
      equipmentId: 'EQ-B001',
      equipmentName: 'Blood Gas Analyzer',
      scheduledDate: 'Apr 28, 2025',
      scheduledTime: '09:00 AM',
      type: 'Regular Maintenance',
      technician: 'External - MediTech Services',
      notes: 'Monthly cleaning and sensor replacement'
    }
  ];

  const uniqueTypes = ['Analyzer', 'Microscope', 'Centrifuge', 'Incubator', 'Refrigerator', 'Other'];

  // Filter is handled by API now, but we keep this for local filtering if needed
  const filteredEquipment = equipmentList;



  // Handle schedule maintenance button
  const handleScheduleMaintenance = (equipmentId: string) => {
    toast.info(`Scheduling maintenance for equipment ${equipmentId}`);
  };

  // Handle view logs button
  const handleViewLogs = (equipmentId: string) => {
    toast.info(`Viewing logs for equipment ${equipmentId}`);
  };

  // Handle view details button
  const handleViewDetails = (equipmentId: string) => {
    toast.info(`Viewing details for equipment ${equipmentId}`);
  };



  return (
    <div>
      {/* Breadcrumbs */}
      <div className="text-gray-500 text-sm mb-4">Laboratory &gt; Equipment</div>

      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Laboratory Equipment</h1>
      </div>

      {/* Out of Service Alert */}
      {equipmentList.some((eq: any) => eq.status === 'Out of Service') && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                <span className="font-bold">Equipment Alert:</span> One or more devices are currently out of service.
                Please check the maintenance schedule.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <Card className="border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, ID or model..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="md:w-1/5">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Filter by Status</SelectLabel>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="needs maintenance">Needs Maintenance</SelectItem>
                  <SelectItem value="out of service">Out of Service</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="md:w-1/5">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Equipment Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Filter by Type</SelectLabel>
                  <SelectItem value="all">All Types</SelectItem>
                  {uniqueTypes.map((type, index) => (
                    <SelectItem key={index} value={type}>{type}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
            <DialogTrigger asChild>
              <Button
                className="md:w-auto"
                style={{ backgroundColor: '#3B82F6' }}
              >
                <Plus className="mr-2 h-4 w-4" /> Add Equipment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Equipment</DialogTitle>
                <DialogDescription>
                  Enter the details for the new laboratory equipment.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input
                    id="name"
                    value={newEquipment.name}
                    onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="model" className="text-right">Model</Label>
                  <Input
                    id="model"
                    value={newEquipment.model}
                    onChange={(e) => setNewEquipment({ ...newEquipment, model: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="serial" className="text-right">Serial #</Label>
                  <Input
                    id="serial"
                    value={newEquipment.serial_number}
                    onChange={(e) => setNewEquipment({ ...newEquipment, serial_number: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="sn" className="text-right">Type</Label>
                  <Select
                    value={newEquipment.equipment_type}
                    onValueChange={(val) => setNewEquipment({ ...newEquipment, equipment_type: val })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueTypes.map(t => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateEquipment}>Save Equipment</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      {/* Equipment List */}
      <Card className="border border-gray-200 mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipment Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Maintenance</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEquipment.map((equipment) => (
                <tr key={equipment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {equipment.serial_number ? equipment.serial_number.substring(0, 8) : equipment.id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{equipment.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{equipment.model}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{equipment.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {equipment.next_maintenance ? new Date(equipment.next_maintenance).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${equipment.status === 'Operational' ? 'bg-green-100 text-green-800' :
                      equipment.status === 'Out of Service' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {equipment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-900 mr-2 p-0"
                      onClick={() => handleScheduleMaintenance(equipment.id)}
                    >
                      <Calendar className="h-4 w-4 mr-1" />
                      Schedule
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-green-600 hover:text-green-900 mr-2 p-0"
                      onClick={() => handleViewLogs(equipment.id)}
                    >
                      Logs
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-gray-900 p-0"
                      onClick={() => handleViewDetails(equipment.id)}
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state if no equipment */}
        {filteredEquipment.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            <p>No equipment found matching your criteria.</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="py-8 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredEquipment.length > 0 && (
          <div className="flex items-center justify-between p-4">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredEquipment.length}</span> of{" "}
              <span className="font-medium">{filteredEquipment.length}</span> items
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="text-sm" disabled>Previous</Button>
              <Button variant="default" size="sm" className="text-sm bg-blue-500">1</Button>
              <Button variant="outline" size="sm" className="text-sm" disabled>Next</Button>
            </div>
          </div>
        )}
      </Card>

      {/* Upcoming Maintenance */}
      <Card className="border border-gray-200 mb-6">
        <h2 className="text-lg font-bold text-gray-800 p-4 border-b border-gray-200">Upcoming Maintenance</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipment</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technician</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {upcomingMaintenance.map((maintenance) => (
                <tr key={maintenance.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{maintenance.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{maintenance.equipmentName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {maintenance.scheduledDate}, {maintenance.scheduledTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{maintenance.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{maintenance.technician}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{maintenance.notes}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-900 mr-2 p-0"
                    >
                      <Wrench className="h-4 w-4 mr-1" />
                      Record
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:text-gray-900 p-0"
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border border-green-200 bg-green-50">
          <h3 className="font-bold text-green-800 mb-1">Operational</h3>
          <p className="text-2xl font-bold text-green-700">
            {equipmentList.filter((eq: any) => eq.status === 'Operational').length}
          </p>
        </Card>
        <Card className="p-4 border border-yellow-200 bg-yellow-50">
          <h3 className="font-bold text-yellow-800 mb-1">Needs Maintenance</h3>
          <p className="text-2xl font-bold text-yellow-700">
            {equipmentList.filter((eq: any) => eq.status === 'Needs Maintenance').length}
          </p>
        </Card>
        <Card className="p-4 border border-red-200 bg-red-50">
          <h3 className="font-bold text-red-800 mb-1">Out of Service</h3>
          <p className="text-2xl font-bold text-red-700">
            {equipmentList.filter((eq: any) => eq.status === 'Out of Service').length}
          </p>
        </Card>
        <Card className="p-4 border border-blue-200 bg-blue-50">
          <h3 className="font-bold text-blue-800 mb-1">Total Equipment</h3>
          <p className="text-2xl font-bold text-blue-700">
            {equipmentList.length}
          </p>
        </Card>
      </div>
    </div>
  );
};

export default EquipmentPage;
