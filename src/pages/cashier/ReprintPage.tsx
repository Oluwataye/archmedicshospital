
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from 'lucide-react';

const ReprintPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([
    { id: 'TR-10054', patient: 'John Smith', service: 'Consultation', amount: 75.00, date: '2025-05-03 09:15 AM' },
    { id: 'TR-10055', patient: 'Alice Johnson', service: 'X-Ray', amount: 120.00, date: '2025-05-03 10:20 AM' },
    { id: 'TR-10056', patient: 'Robert Brown', service: 'Blood Test', amount: 45.50, date: '2025-05-03 11:05 AM' }
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would search the database
    console.log('Searching for receipt:', searchQuery);
  };

  const handleReprint = (id: string) => {
    // In a real application, this would trigger receipt printing
    console.log('Reprinting receipt:', id);
  };

  return (
    <div className="flex-1 p-6 overflow-auto">
      {/* Breadcrumbs */}
      <div className="text-gray-500 text-sm mb-4">Cashier &gt; Reprint</div>
      
      {/* Page Header */}
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Receipt Reprint</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search for Receipt</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search by transaction ID, patient name or ID..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" className="bg-blue-500">Search</Button>
          </form>
          
          <div className="space-y-2 mb-4">
            <label className="block text-sm font-medium">Search by Date Range:</label>
            <div className="flex gap-4">
              <div className="w-1/2">
                <Input type="date" />
              </div>
              <div className="w-1/2">
                <Input type="date" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Search Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {searchResults.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id}</TableCell>
                    <TableCell>{item.patient}</TableCell>
                    <TableCell>{item.service}</TableCell>
                    <TableCell>${item.amount.toFixed(2)}</TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>
                      <Button size="sm" onClick={() => handleReprint(item.id)}>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Reprint
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReprintPage;
