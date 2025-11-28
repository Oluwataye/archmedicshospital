
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';

const ProgressNotesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const isMobile = useIsMobile();
  
  // Sample progress notes data
  const progressNotes = [
    { id: 1, patientName: 'John Smith', date: '2025-04-30', provider: 'Dr. Sarah Wilson', content: 'Patient reports improvement in symptoms. Continue current treatment plan.' },
    { id: 2, patientName: 'Maria Garcia', date: '2025-04-29', provider: 'Dr. James Lee', content: 'Follow-up appointment scheduled in two weeks. Patient showing good response to medication.' },
    { id: 3, patientName: 'David Johnson', date: '2025-04-28', provider: 'Dr. Emily Chen', content: 'Discussed dietary recommendations. Patient will return in one month for reassessment.' },
    { id: 4, patientName: 'Sarah Williams', date: '2025-04-27', provider: 'Dr. Michael Brown', content: 'Reviewed lab results with patient. All values within normal range.' },
  ];

  const filteredNotes = progressNotes.filter(note => 
    note.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-4 px-4 md:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Progress Notes</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64 md:w-80">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="whitespace-nowrap">
            <PlusCircle className="h-4 w-4 mr-2" />
            New Note
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <Card key={note.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50 pb-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-lg">{note.patientName}</CardTitle>
                    <CardDescription>{note.provider}</CardDescription>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(note.date).toLocaleDateString()}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm line-clamp-3">{note.content}</p>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size={isMobile ? "sm" : "default"} className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex justify-center py-8">
            <p className="text-lg text-muted-foreground">No progress notes found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressNotesPage;
