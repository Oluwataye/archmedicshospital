import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, AlertTriangle, Calendar, Wrench } from 'lucide-react';
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

const EquipmentPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Equipment data - would come from API in a real application
  const allEquipment = [
    {
      id: 'EQ-H001',
      name: 'Hematology Analyzer',
      model: 'HemaCount 5000',
      manufacturer: 'MediTech Systems',
      serialNumber: 'HC5-24689',
      location: 'Main Lab - Station 1',
      status: 'Operational',
      statusColor: 'bg-green-100 text-green-800',
      lastCalibration: 'Apr 20, 2025',
      nextCalibration: 'May 20, 2025',
      lastMaintenance: 'Mar 15, 2025',
      nextMaintenance: 'May 15, 2025',
      equipmentType: 'Analyzer'
    },
    {
      id: 'EQ-C001',
      name: 'Chemistry Analyzer',
      model: 'ChemPro X2',
      manufacturer: 'Laboratory Systems Inc.',
      serialNumber: 'CPX2-78521',
      location: 'Main Lab - Station 2',
      status: 'Operational',
      statusColor: 'bg-green-100 text-green-800',
      lastCalibration: 'Apr 22, 2025',
      nextCalibration: 'May 22, 2025',
      lastMaintenance: 'Apr 01, 2025',
      nextMaintenance: 'Jun 01, 2025',
      equipmentType: 'Analyzer'
    },
    {
      id: 'EQ-B001',
      name: 'Blood Gas Analyzer',
      model: 'GasCheck Plus',
      manufacturer: 'MediTech Systems',
      serialNumber: 'GCP-12475',
      location: 'Main Lab - Station 3',
      status: 'Needs Maintenance',
      statusColor: 'bg-yellow-100 text-yellow-800',
      lastCalibration: 'Apr 15, 2025',
      nextCalibration: 'May 15, 2025',
      lastMaintenance: 'Feb 10, 2025',
      nextMaintenance: 'Apr 25, 2025',
      equipmentType: 'Analyzer'
    },
    {
      id: 'EQ-M001',
      name: 'Laboratory Microscope',
      model: 'OptiFocus 2000',
      manufacturer: 'Vision Instruments',
      serialNumber: 'OF2-36542',
      location: 'Main Lab - Station 4',
      status: 'Operational',
      statusColor: 'bg-green-100 text-green-800',
      lastCalibration: 'Mar 10, 2025',
      nextCalibration: 'Sep 10, 2025',
      lastMaintenance: 'Mar 10, 2025',
      nextMaintenance: 'Jun 10, 2025',
      equipmentType: 'Microscope'
    },
    {
      id: 'EQ-C002',
      name: 'Centrifuge',
      model: 'SpinMax 3000',
      manufacturer: 'MedLab Systems',
      serialNumber: 'SM3-98237',
      location: 'Main Lab - Station 5',
      status: 'Out of Service',
      statusColor: 'bg-red-100 text-red-800',
      lastCalibration: 'Feb 15, 2025',
      nextCalibration: 'May 15, 2025',
      lastMaintenance: 'Feb 15, 2025',
      nextMaintenance: 'Apr 15, 2025',
      equipmentType: 'Centrifuge'
    },
    {
      id: 'EQ-I001',
      name: 'Incubator',
      model: 'TempControl Pro',
      manufacturer: 'BioSystems',
      serialNumber: 'TCP-45682',
      location: 'Microbiology Lab',
      status: 'Operational',
      statusColor: 'bg-green-100 text-green-800',
      lastCalibration: 'Apr 05, 2025',
      nextCalibration: 'Jul 05, 2025',
      lastMaintenance: 'Apr 05, 2025',
      nextMaintenance: 'Jul 05, 2025',
      equipmentType: 'Incubator'
    }
  ];

  // Upcoming maintenance data
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
    },
    {
      id: 'MAINT-002',
      equipmentId: 'EQ-C002',
      equipmentName: 'Centrifuge',
      scheduledDate: 'Apr 29, 2025',
      scheduledTime: '10:00 AM',
      type: 'Repair',
      technician: 'External - MedLab Support',
      notes: 'Fixing motor issue and calibration'
    },
    {
      id: 'MAINT-003',
      equipmentId: 'EQ-H001',
      equipmentName: 'Hematology Analyzer',
      scheduledDate: 'May 15, 2025',
      scheduledTime: '08:30 AM',
      type: 'Regular Maintenance',
      technician: 'Internal - James Wilson',
      notes: 'Routine monthly maintenance'
    }
  ];

  // Extract unique equipment types for filter
  const uniqueTypes = Array.from(new Set(allEquipment.map(eq => eq.equipmentType)));

  // Filter equipment based on search query and filters
  const filteredEquipment = allEquipment.filter(equipment => {
    const searchMatch = searchQuery === '' || 
      equipment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      equipment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      equipment.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      equipment.manufacturer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const statusMatch = statusFilter === 'all' || 
      equipment.status.toLowerCase() === statusFilter.toLowerCase();
    
    const typeMatch = typeFilter === 'all' || 
      equipment.equipmentType === typeFilter;
    
    return searchMatch && statusMatch && typeMatch;
  });

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

  // Handle adding new equipment
  const handleAddEquipment = () => {
    toast.info("Adding new equipment");
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
      {allEquipment.some(eq => eq.status === 'Out of Service') && (
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
          
          <Button 
            onClick={handleAddEquipment} 
            className="md:w-auto"
            style={{ backgroundColor: '#3B82F6' }}
          >
            Add Equipment
          </Button>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{equipment.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{equipment.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{equipment.model}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{equipment.location}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{equipment.nextMaintenance}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${equipment.statusColor}`}>
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
        
        {/* Pagination */}
        {filteredEquipment.length > 0 && (
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
            {allEquipment.filter(eq => eq.status === 'Operational').length}
          </p>
        </Card>
        <Card className="p-4 border border-yellow-200 bg-yellow-50">
          <h3 className="font-bold text-yellow-800 mb-1">Needs Maintenance</h3>
          <p className="text-2xl font-bold text-yellow-700">
            {allEquipment.filter(eq => eq.status === 'Needs Maintenance').length}
          </p>
        </Card>
        <Card className="p-4 border border-red-200 bg-red-50">
          <h3 className="font-bold text-red-800 mb-1">Out of Service</h3>
          <p className="text-2xl font-bold text-red-700">
            {allEquipment.filter(eq => eq.status === 'Out of Service').length}
          </p>
        </Card>
        <Card className="p-4 border border-blue-200 bg-blue-50">
          <h3 className="font-bold text-blue-800 mb-1">Total Equipment</h3>
          <p className="text-2xl font-bold text-blue-700">
            {allEquipment.length}
          </p>
        </Card>
      </div>
    </div>
  );
};

export default EquipmentPage;
