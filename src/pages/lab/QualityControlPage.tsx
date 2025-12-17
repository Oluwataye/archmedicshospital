
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, AlertTriangle, CheckCircle, ChartBar, Loader2, Plus } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const QualityControlPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [equipmentFilter, setEquipmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [loading, setLoading] = useState(true);
  const [qcRecords, setQcRecords] = useState<any[]>([]);
  const [equipmentList, setEquipmentList] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRecord, setNewRecord] = useState({
    equipment_id: '',
    test_date: new Date().toISOString().split('T')[0],
    control_material: '',
    result_value: '',
    status: 'Pass',
    performed_by: 'Current User', // Should ideally come from auth context
    notes: ''
  });

  // Fetch data on mount
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [records, equipment] = await Promise.all([
          apiService.getQCRecords({
            equipment_id: equipmentFilter,
            status: statusFilter,
            search: searchQuery
          }),
          apiService.getLabEquipment()
        ]);
        setQcRecords(records);
        setEquipmentList(equipment);
      } catch (error) {
        console.error('Error fetching QC data:', error);
        toast.error('Failed to load quality control data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [equipmentFilter, statusFilter]);

  // Handle search with debounce
  React.useEffect(() => {
    const timer = setTimeout(() => {
      // Re-fetch with search query
      const fetchSearchResults = async () => {
        try {
          const records = await apiService.getQCRecords({
            equipment_id: equipmentFilter,
            status: statusFilter,
            search: searchQuery
          });
          setQcRecords(records);
        } catch (error) {
          console.error('Error searching QC records:', error);
        }
      };
      if (!loading) fetchSearchResults();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleCreateRecord = async () => {
    try {
      if (!newRecord.equipment_id) {
        toast.error('Please select equipment');
        return;
      }
      await apiService.createQCRecord(newRecord);
      toast.success('QC Record added successfully');
      setShowAddModal(false);
      // Refresh list
      const records = await apiService.getQCRecords({
        equipment_id: equipmentFilter,
        status: statusFilter,
        search: searchQuery
      });
      setQcRecords(records);
      // Reset form
      setNewRecord({
        equipment_id: '',
        test_date: new Date().toISOString().split('T')[0],
        control_material: '',
        result_value: '',
        status: 'Pass',
        performed_by: 'Current User',
        notes: ''
      });
    } catch (error) {
      console.error('Error creating QC record:', error);
      toast.error('Failed to create QC record');
    }
  };

  // Handle verify QC button
  const handleVerifyQc = async (recordId: string) => {
    try {
      await apiService.verifyQCRecord(recordId);
      toast.success(`Verified QC record ${recordId}`);
      // Update local state
      setQcRecords(qcRecords.map(r =>
        r.id === recordId ? { ...r, verified: true, verified_at: new Date().toISOString() } : r
      ));
    } catch (error) {
      console.error('Error verifying record:', error);
      toast.error('Failed to verify record');
    }
  };

  // Mock schedule data for now
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
    }
  ];

  // Extract unique equipment for filter (using state now)
  const uniqueEquipment = equipmentList.map(e => e.name);

  // Filter is handled by API, using direct state
  const filteredQcRecords = qcRecords;

  // Handle view details button
  const handleViewDetails = (recordId: string) => {
    toast.info(`Viewing details for QC record ${recordId}`);
  };



  // Handle view trend button
  const handleViewTrend = (equipmentId: string) => {
    toast.info(`Viewing trend analysis for equipment ${equipmentId}`);
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
      {qcRecords.some((record: any) => record.status === 'Fail') && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                <span className="font-bold">Alert:</span> Quality control failures detected.
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
                      {equipmentList.map((equipment: any) => (
                        <SelectItem key={equipment.id} value={equipment.id}>{equipment.name}</SelectItem>
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

              <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                <DialogTrigger asChild>
                  <Button
                    className="md:w-auto"
                    style={{ backgroundColor: '#3B82F6' }}
                  >
                    <Plus className="mr-2 h-4 w-4" /> New QC Record
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add Quality Control Record</DialogTitle>
                    <DialogDescription>
                      Enter the details for the new quality control record.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="equipment" className="text-right">Equipment</Label>
                      <Select
                        value={newRecord.equipment_id}
                        onValueChange={(val) => setNewRecord({ ...newRecord, equipment_id: val })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select Equipment" />
                        </SelectTrigger>
                        <SelectContent>
                          {equipmentList.map((e: any) => (
                            <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="date" className="text-right">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newRecord.test_date}
                        onChange={(e) => setNewRecord({ ...newRecord, test_date: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="material" className="text-right">Control</Label>
                      <Input
                        id="material"
                        value={newRecord.control_material}
                        placeholder="e.g. Level 1"
                        onChange={(e) => setNewRecord({ ...newRecord, control_material: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="result" className="text-right">Result</Label>
                      <Input
                        id="result"
                        value={newRecord.result_value}
                        placeholder="Result value or description"
                        onChange={(e) => setNewRecord({ ...newRecord, result_value: e.target.value })}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="status" className="text-right">Status</Label>
                      <Select
                        value={newRecord.status}
                        onValueChange={(val) => setNewRecord({ ...newRecord, status: val })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pass">Pass</SelectItem>
                          <SelectItem value="Warning">Warning</SelectItem>
                          <SelectItem value="Fail">Fail</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleCreateRecord}>Save Record</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(record.test_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.equipment_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.control_material}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.performed_by}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${record.status === 'Pass' ? 'bg-green-100 text-green-800' :
                          record.status === 'Fail' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
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

            {/* Loading State */}
            {loading && (
              <div className="py-8 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            )}

            {/* Pagination */}
            {!loading && filteredQcRecords.length > 0 && (
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
            {qcRecords.filter((qc: any) => qc.status === 'Pass').length}
          </p>
        </Card>
        <Card className="p-4 border border-yellow-200 bg-yellow-50">
          <h3 className="font-bold text-yellow-800 mb-1">Warning QC</h3>
          <p className="text-2xl font-bold text-yellow-700">
            {qcRecords.filter((qc: any) => qc.status === 'Warning').length}
          </p>
        </Card>
        <Card className="p-4 border border-red-200 bg-red-50">
          <h3 className="font-bold text-red-800 mb-1">Failed QC</h3>
          <p className="text-2xl font-bold text-red-700">
            {qcRecords.filter((qc: any) => qc.status === 'Fail').length}
          </p>
        </Card>
        <Card className="p-4 border border-blue-200 bg-blue-50">
          <h3 className="font-bold text-blue-800 mb-1">Total QC Records</h3>
          <p className="text-2xl font-bold text-blue-700">
            {qcRecords.length}
          </p>
        </Card>
      </div>
    </div>
  );
};

export default QualityControlPage;
