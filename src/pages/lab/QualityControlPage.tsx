
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, AlertTriangle, CheckCircle, ChartBar } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const QualityControlPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [equipmentFilter, setEquipmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Quality control data - would come from API in a real application
  const allQualityControlRecords = [
    {
      id: 'QC-001',
      date: 'Apr 27, 2025',
      equipmentName: 'Hematology Analyzer',
      equipmentId: 'EQ-H001',
      controlMaterial: 'Control Level 1',
      performedBy: 'James Wilson',
      status: 'Pass',
      statusColor: 'bg-green-100 text-green-800',
      results: 'All parameters within range',
      verified: true,
      verifiedBy: 'Susan Clark',
      verifiedAt: 'Apr 27, 2025 09:15 AM'
    },
    {
      id: 'QC-002',
      date: 'Apr 27, 2025',
      equipmentName: 'Hematology Analyzer',
      equipmentId: 'EQ-H001',
      controlMaterial: 'Control Level 2',
      performedBy: 'James Wilson',
      status: 'Fail',
      statusColor: 'bg-red-100 text-red-800',
      results: 'WBC count outside acceptable range',
      verified: true,
      verifiedBy: 'Susan Clark',
      verifiedAt: 'Apr 27, 2025 09:20 AM'
    },
    {
      id: 'QC-003',
      date: 'Apr 27, 2025',
      equipmentName: 'Chemistry Analyzer',
      equipmentId: 'EQ-C001',
      controlMaterial: 'Control Level 1',
      performedBy: 'Susan Clark',
      status: 'Pass',
      statusColor: 'bg-green-100 text-green-800',
      results: 'All parameters within range',
      verified: true,
      verifiedBy: 'James Wilson',
      verifiedAt: 'Apr 27, 2025 10:30 AM'
    },
    {
      id: 'QC-004',
      date: 'Apr 27, 2025',
      equipmentName: 'Chemistry Analyzer',
      equipmentId: 'EQ-C001',
      controlMaterial: 'Control Level 2',
      performedBy: 'Susan Clark',
      status: 'Pass',
      statusColor: 'bg-green-100 text-green-800',
      results: 'All parameters within range',
      verified: false,
      verifiedBy: '',
      verifiedAt: ''
    },
    {
      id: 'QC-005',
      date: 'Apr 27, 2025',
      equipmentName: 'Blood Gas Analyzer',
      equipmentId: 'EQ-B001',
      controlMaterial: 'Control Level 1',
      performedBy: 'Robert Adams',
      status: 'Warning',
      statusColor: 'bg-yellow-100 text-yellow-800',
      results: 'pH borderline high',
      verified: true,
      verifiedBy: 'James Wilson',
      verifiedAt: 'Apr 27, 2025 11:15 AM'
    }
  ];

  // Schedule data
  const upcomingQcSchedule = [
    {
      id: 'SCH-001',
      equipmentName: 'Hematology Analyzer',
      equipmentId: 'EQ-H001',
      scheduledDate: 'Apr 28, 2025',
      scheduledTime: '08:00 AM',
      assignedTo: 'James Wilson',
      controlMaterials: 'Level 1, Level 2',
      status: 'Scheduled',
      statusColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'SCH-002',
      equipmentName: 'Chemistry Analyzer',
      equipmentId: 'EQ-C001',
      scheduledDate: 'Apr 28, 2025',
      scheduledTime: '09:00 AM',
      assignedTo: 'Susan Clark',
      controlMaterials: 'Level 1, Level 2',
      status: 'Scheduled',
      statusColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'SCH-003',
      equipmentName: 'Coagulation Analyzer',
      equipmentId: 'EQ-CA001',
      scheduledDate: 'Apr 28, 2025',
      scheduledTime: '10:00 AM',
      assignedTo: 'Robert Adams',
      controlMaterials: 'Level 1, Level 2',
      status: 'Scheduled',
      statusColor: 'bg-blue-100 text-blue-800'
    }
  ];

  // Extract unique equipment for filter
  const uniqueEquipment = Array.from(new Set(allQualityControlRecords.map(qc => qc.equipmentName)));

  // Filter QC records based on search query, equipment, and status
  const filteredQcRecords = allQualityControlRecords.filter(record => {
    const searchMatch = searchQuery === '' || 
      record.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.equipmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.performedBy.toLowerCase().includes(searchQuery.toLowerCase());
    
    const equipmentMatch = equipmentFilter === 'all' || 
      record.equipmentName === equipmentFilter;
    
    const statusMatch = statusFilter === 'all' || 
      record.status.toLowerCase() === statusFilter.toLowerCase();
    
    return searchMatch && equipmentMatch && statusMatch;
  });

  // Handle view details button
  const handleViewDetails = (recordId: string) => {
    toast.info(`Viewing details for QC record ${recordId}`);
  };

  // Handle verify QC button
  const handleVerifyQc = (recordId: string) => {
    toast.success(`Verified QC record ${recordId}`);
  };

  // Handle view trend button
  const handleViewTrend = (equipmentId: string) => {
    toast.info(`Viewing trend analysis for equipment ${equipmentId}`);
  };

  // Handle creating new QC record
  const handleAddQcRecord = () => {
    toast.info("Creating new QC record");
  };

  // Handle perform QC schedule
  const handlePerformQc = (scheduleId: string) => {
    toast.info(`Performing scheduled QC ${scheduleId}`);
  };

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="text-gray-500 text-sm mb-4">Laboratory &gt; Quality Control</div>
      
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quality Control</h1>
      </div>
      
      {/* QC Failures Alert */}
      {allQualityControlRecords.some(record => record.status === 'Fail') && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                <span className="font-bold">Alert:</span> Quality control failures detected today. 
                Please review and take corrective actions.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Tabs */}
      <Tabs defaultValue="records" className="w-full mb-6">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="records">QC Records</TabsTrigger>
          <TabsTrigger value="schedule">QC Schedule</TabsTrigger>
        </TabsList>
        
        {/* QC Records Tab */}
        <TabsContent value="records" className="pt-4">
          {/* Filters and Search */}
          <Card className="border border-gray-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by ID, equipment or technician..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="md:w-1/5">
                <Select value={equipmentFilter} onValueChange={setEquipmentFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Equipment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Filter by Equipment</SelectLabel>
                      <SelectItem value="all">All Equipment</SelectItem>
                      {uniqueEquipment.map((equipment, index) => (
                        <SelectItem key={index} value={equipment}>{equipment}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
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
                      <SelectItem value="pass">Pass</SelectItem>
                      <SelectItem value="fail">Fail</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={handleAddQcRecord} 
                className="md:w-auto"
                style={{ backgroundColor: '#3B82F6' }}
              >
                New QC Record
              </Button>
            </div>
          </Card>
          
          {/* QC Records List */}
          <Card className="border border-gray-200 mb-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipment</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Control Material</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performed By</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verified</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredQcRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{record.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.equipmentName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.controlMaterial}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.performedBy}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${record.statusColor}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.verified ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <span className="text-yellow-500">Pending</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {!record.verified && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-blue-600 hover:text-blue-900 mr-2 p-0"
                            onClick={() => handleVerifyQc(record.id)}
                          >
                            Verify
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-600 hover:text-gray-900 mr-2 p-0"
                          onClick={() => handleViewDetails(record.id)}
                        >
                          Details
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-purple-600 hover:text-purple-900 p-0"
                          onClick={() => handleViewTrend(record.equipmentId)}
                        >
                          <ChartBar className="h-4 w-4 mr-1" />
                          Trend
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Empty state if no records */}
            {filteredQcRecords.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                <p>No QC records found matching your criteria.</p>
              </div>
            )}
            
            {/* Pagination */}
            {filteredQcRecords.length > 0 && (
              <div className="flex items-center justify-between p-4">
                <div className="text-sm text-gray-500">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredQcRecords.length}</span> of{" "}
                  <span className="font-medium">{filteredQcRecords.length}</span> records
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="text-sm" disabled>Previous</Button>
                  <Button variant="default" size="sm" className="text-sm bg-blue-500">1</Button>
                  <Button variant="outline" size="sm" className="text-sm" disabled>Next</Button>
                </div>
              </div>
            )}
          </Card>
        </TabsContent>
        
        {/* QC Schedule Tab */}
        <TabsContent value="schedule" className="pt-4">
          <Card className="border border-gray-200 mb-6">
            <h2 className="text-lg font-bold text-gray-800 p-4 border-b border-gray-200">Upcoming QC Schedule</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipment</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Control Materials</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {upcomingQcSchedule.map((schedule) => (
                    <tr key={schedule.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{schedule.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.equipmentName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.scheduledDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.scheduledTime}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.assignedTo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.controlMaterials}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${schedule.statusColor}`}>
                          {schedule.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-blue-600 hover:text-blue-900 mr-2 p-0"
                          onClick={() => handlePerformQc(schedule.id)}
                        >
                          Perform QC
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-600 hover:text-gray-900 p-0"
                          onClick={() => handleViewDetails(schedule.id)}
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
          
          {/* QC Calendar Preview */}
          <Card className="border border-gray-200 p-4">
            <h2 className="text-lg font-bold text-gray-800 mb-3">Monthly QC Calendar</h2>
            <p className="text-gray-600 mb-4">
              View the complete QC schedule for all laboratory equipment. Daily, weekly, and monthly checks
              are scheduled according to manufacturer and regulatory requirements.
            </p>
            <Button style={{ backgroundColor: '#3B82F6' }}>View Full Calendar</Button>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 border border-green-200 bg-green-50">
          <h3 className="font-bold text-green-800 mb-1">Passed QC</h3>
          <p className="text-2xl font-bold text-green-700">
            {allQualityControlRecords.filter(qc => qc.status === 'Pass').length}
          </p>
        </Card>
        <Card className="p-4 border border-yellow-200 bg-yellow-50">
          <h3 className="font-bold text-yellow-800 mb-1">Warning QC</h3>
          <p className="text-2xl font-bold text-yellow-700">
            {allQualityControlRecords.filter(qc => qc.status === 'Warning').length}
          </p>
        </Card>
        <Card className="p-4 border border-red-200 bg-red-50">
          <h3 className="font-bold text-red-800 mb-1">Failed QC</h3>
          <p className="text-2xl font-bold text-red-700">
            {allQualityControlRecords.filter(qc => qc.status === 'Fail').length}
          </p>
        </Card>
        <Card className="p-4 border border-blue-200 bg-blue-50">
          <h3 className="font-bold text-blue-800 mb-1">Total QC Records</h3>
          <p className="text-2xl font-bold text-blue-700">
            {allQualityControlRecords.length}
          </p>
        </Card>
      </div>
    </div>
  );
};

export default QualityControlPage;
