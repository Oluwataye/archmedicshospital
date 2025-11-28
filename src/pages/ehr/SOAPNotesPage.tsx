
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, FileText, Calendar } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Define filter options
const FILTER_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "initial visit", label: "Initial Visit" },
  { value: "follow-up", label: "Follow-up" },
  { value: "urgent care", label: "Urgent Care" }
];

const SOAPNotesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const isMobile = useIsMobile();

  // Sample SOAP notes data
  const soapNotes = [
    {
      id: 1,
      patientName: 'Emily Parker',
      date: '2025-05-01',
      provider: 'Dr. Michael Williams',
      type: 'Follow-up',
      subjective: 'Patient reports continued headaches, but less frequent than before.',
      objective: 'BP 120/80, HR 72, RR 16, Temp 98.6°F',
      assessment: 'Improving tension headaches',
      plan: 'Continue current medication regimen. Schedule follow-up in 2 weeks.'
    },
    {
      id: 2,
      patientName: 'James Wilson',
      date: '2025-04-29',
      provider: 'Dr. Sarah Johnson',
      type: 'Initial Visit',
      subjective: 'New patient with complaints of lower back pain for 2 weeks.',
      objective: 'BP 130/85, HR 80, RR 18, Temp 98.4°F. Limited range of motion in lumbar spine.',
      assessment: 'Acute lumbar strain',
      plan: 'Prescribe anti-inflammatory medication. Refer to physical therapy.'
    },
    {
      id: 3,
      patientName: 'Sophia Martinez',
      date: '2025-04-28',
      provider: 'Dr. David Lee',
      type: 'Urgent Care',
      subjective: 'Patient presents with sore throat and fever for 3 days.',
      objective: 'BP 118/78, HR 88, RR 18, Temp 101.2°F. Pharyngeal erythema noted.',
      assessment: 'Acute pharyngitis, possible strep',
      plan: 'Rapid strep test performed. Start empiric antibiotic therapy.'
    },
    {
      id: 4,
      patientName: 'William Thomas',
      date: '2025-04-27',
      provider: 'Dr. Jennifer Adams',
      type: 'Follow-up',
      subjective: 'Patient reports improved glucose readings on new medication regimen.',
      objective: 'BP 126/82, HR 76, RR 16, Temp 98.2°F. Weight decreased by 2kg since last visit.',
      assessment: 'Type 2 diabetes mellitus, improving control',
      plan: 'Continue current medications. Schedule lab work in 3 months.'
    },
  ];

  const filteredNotes = soapNotes
    .filter(note => 
      (filter === 'all' || note.type.toLowerCase() === filter.toLowerCase()) &&
      (
        note.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.subjective.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.objective.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.assessment.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.plan.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

  return (
    <div className="container mx-auto py-4 px-4 md:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">SOAP Notes</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64 md:w-80">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search SOAP notes..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              {FILTER_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button className="whitespace-nowrap">
            <PlusCircle className="h-4 w-4 mr-2" />
            New SOAP Note
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
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(note.date).toLocaleDateString()}
                    <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {note.type}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="font-semibold">S: Subjective</p>
                    <p className="line-clamp-1">{note.subjective}</p>
                  </div>
                  <div>
                    <p className="font-semibold">O: Objective</p>
                    <p className="line-clamp-1">{note.objective}</p>
                  </div>
                  <div>
                    <p className="font-semibold">A: Assessment</p>
                    <p className="line-clamp-1">{note.assessment}</p>
                  </div>
                  <div>
                    <p className="font-semibold">P: Plan</p>
                    <p className="line-clamp-1">{note.plan}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button variant="outline" size={isMobile ? "sm" : "default"} className="w-full flex items-center justify-center">
                  <FileText className="h-4 w-4 mr-2" />
                  View Complete Note
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full flex justify-center py-8">
            <p className="text-lg text-muted-foreground">No SOAP notes found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SOAPNotesPage;
