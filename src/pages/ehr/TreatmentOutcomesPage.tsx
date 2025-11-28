
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Download,
  Search,
  FileText,
  BarChart2
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'sonner';

const TreatmentOutcomesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [treatmentType, setTreatmentType] = useState('all');
  const [timeRange, setTimeRange] = useState('all');
  
  // Sample treatment outcomes data
  const treatmentOutcomesData = [
    {
      id: 'TO-2025-001',
      treatment: 'Antibiotic Therapy (Amoxicillin)',
      condition: 'Bacterial Pneumonia',
      patient: 'Edwards, Michael',
      startDate: '2025-03-15',
      endDate: '2025-03-25',
      outcome: 'Successful',
      notes: 'Complete resolution of symptoms after 10-day course',
      department: 'Pulmonology'
    },
    {
      id: 'TO-2025-002',
      treatment: 'ACE Inhibitor (Lisinopril)',
      condition: 'Hypertension',
      patient: 'Johnson, Sarah',
      startDate: '2025-01-10',
      endDate: 'Ongoing',
      outcome: 'Partially Successful',
      notes: 'Blood pressure reduced but not yet at target level',
      department: 'Cardiology'
    },
    {
      id: 'TO-2025-003',
      treatment: 'Cognitive Behavioral Therapy',
      condition: 'Generalized Anxiety Disorder',
      patient: 'Wilson, Emma',
      startDate: '2025-02-05',
      endDate: '2025-04-15',
      outcome: 'Successful',
      notes: 'Significant reduction in anxiety symptoms and improved coping strategies',
      department: 'Psychiatry'
    },
    {
      id: 'TO-2025-004',
      treatment: 'Physical Therapy',
      condition: 'Lumbar Disc Herniation',
      patient: 'Martinez, Carlos',
      startDate: '2025-03-01',
      endDate: '2025-05-01',
      outcome: 'Successful',
      notes: 'Pain resolved, mobility restored to normal levels',
      department: 'Orthopedics'
    },
    {
      id: 'TO-2025-005',
      treatment: 'Metformin',
      condition: 'Type 2 Diabetes',
      patient: 'Thompson, Robert',
      startDate: '2025-01-15',
      endDate: 'Ongoing',
      outcome: 'Partially Successful',
      notes: 'Blood glucose improved but still above target',
      department: 'Endocrinology'
    }
  ];

  // Filter data based on selected filters and search term
  const filteredData = treatmentOutcomesData.filter(item => {
    const matchesSearch = 
      item.treatment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTreatmentType = treatmentType === 'all' || 
      (treatmentType === 'medication' && (item.treatment.includes('Therapy') || item.treatment.includes('Inhibitor') || item.treatment.includes('Metformin'))) ||
      (treatmentType === 'procedure' && (item.treatment.includes('Physical Therapy') || item.treatment.includes('Surgery'))) ||
      (treatmentType === 'behavioral' && item.treatment.includes('Behavioral'));
    
    const matchesTimeRange = timeRange === 'all' || 
      (timeRange === 'ongoing' && item.endDate === 'Ongoing') ||
      (timeRange === 'completed' && item.endDate !== 'Ongoing');
    
    return matchesSearch && matchesTreatmentType && matchesTimeRange;
  });

  // Handle export report
  const handleExportReport = () => {
    toast.success('Treatment outcomes report exported successfully');
    // In a real application, this would generate a PDF or CSV file
  };

  // Handle view details
  const handleViewDetails = (id: string) => {
    toast.info(`Viewing details for treatment outcome ${id}`);
    // In a real application, this would open a modal or navigate to a details page
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-1">Treatment Outcomes</h1>
          <p className="text-gray-500 text-sm">View and analyze treatment outcome data</p>
        </div>
        <Button 
          onClick={handleExportReport}
          className="flex items-center gap-2"
        >
          <Download size={16} />
          Export Report
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Filter Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search by treatment, condition, or patient..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Select value={treatmentType} onValueChange={setTreatmentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Treatment Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Treatment Types</SelectItem>
                  <SelectItem value="medication">Medication</SelectItem>
                  <SelectItem value="procedure">Procedure</SelectItem>
                  <SelectItem value="behavioral">Behavioral</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time Ranges</SelectItem>
                  <SelectItem value="ongoing">Ongoing Treatments</SelectItem>
                  <SelectItem value="completed">Completed Treatments</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Treatment Outcomes Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center">
            <BarChart2 size={18} className="mr-2 text-blue-500" />
            <CardTitle>Treatment Outcomes</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Treatment</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Outcome</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.treatment}</TableCell>
                    <TableCell>{item.condition}</TableCell>
                    <TableCell>{item.patient}</TableCell>
                    <TableCell>{item.startDate}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.endDate === 'Ongoing' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {item.endDate === 'Ongoing' ? 'Ongoing' : 'Completed'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.outcome === 'Successful' 
                          ? 'bg-green-100 text-green-800'
                          : item.outcome === 'Partially Successful'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {item.outcome}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2 text-blue-600"
                        onClick={() => handleViewDetails(item.id)}
                      >
                        <FileText size={14} className="mr-1" />
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                    No treatment outcomes found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {filteredData.length > 0 && (
            <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
              <div>
                Showing <span className="font-medium">{filteredData.length}</span> of{" "}
                <span className="font-medium">{treatmentOutcomesData.length}</span> treatment outcomes
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TreatmentOutcomesPage;
