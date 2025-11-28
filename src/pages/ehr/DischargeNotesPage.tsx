
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, FileText, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const DischargeNotesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const isMobile = useIsMobile();

  // Sample discharge notes data
  const dischargeNotes = [
    { 
      id: 1, 
      patientName: 'Robert Chen', 
      date: '2025-04-28', 
      doctor: 'Dr. Jennifer Lopez', 
      status: 'Completed',
      summary: 'Patient discharged in stable condition. Follow-up appointment scheduled in two weeks. Prescribed medication for pain management.'
    },
    { 
      id: 2, 
      patientName: 'Lisa Johnson', 
      date: '2025-04-27', 
      doctor: 'Dr. Michael Roberts', 
      status: 'Pending',
      summary: 'Pending final review by attending physician. Patient ready for discharge tomorrow morning.'
    },
    { 
      id: 3, 
      patientName: 'Thomas Wright', 
      date: '2025-04-25', 
      doctor: 'Dr. Sarah Wilson', 
      status: 'Completed',
      summary: 'Patient discharged with home care instructions. Needs follow-up with specialist in one week.'
    },
    { 
      id: 4, 
      patientName: 'Emma Garcia', 
      date: '2025-04-22', 
      doctor: 'Dr. James Peterson', 
      status: 'Completed',
      summary: 'Successful recovery from procedure. Discharged with prescription medication and rehabilitation plan.'
    },
  ];

  const filteredNotes = dischargeNotes.filter(note => 
    note.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-4 px-4 md:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Discharge Notes</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64 md:w-80">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search discharge notes..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="whitespace-nowrap">
            <PlusCircle className="h-4 w-4 mr-2" />
            New Discharge Note
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <Card key={note.id}>
              <CardHeader className="bg-gray-50 pb-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-lg">{note.patientName}</CardTitle>
                    <CardDescription>{note.doctor}</CardDescription>
                  </div>
                  <Badge 
                    variant={note.status === "Completed" ? "default" : "secondary"} 
                    className={note.status === "Completed" ? "bg-green-100 text-green-800" : ""}
                  >
                    {note.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm mb-2 text-muted-foreground">
                  Discharge Date: {new Date(note.date).toLocaleDateString()}
                </p>
                <p className="text-sm line-clamp-2">{note.summary}</p>
              </CardContent>
              <CardFooter className="flex justify-between pt-2 flex-wrap gap-2">
                <Button variant="outline" size={isMobile ? "sm" : "default"} className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button variant="ghost" size={isMobile ? "sm" : "default"} className="flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex justify-center py-8">
            <p className="text-lg text-muted-foreground">No discharge notes found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DischargeNotesPage;
