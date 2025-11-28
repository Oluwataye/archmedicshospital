
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, AlertCircle } from 'lucide-react';

const RefundsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<null | {
    id: string;
    patient: string;
    service: string;
    amount: number;
    date: string;
  }>(null);

  const [refundReason, setRefundReason] = useState('');
  
  const [searchResults, setSearchResults] = useState([
    { id: 'TR-10054', patient: 'John Smith', service: 'Consultation', amount: 75.00, date: '2025-05-03 09:15 AM' },
    { id: 'TR-10055', patient: 'Alice Johnson', service: 'X-Ray', amount: 120.00, date: '2025-05-03 10:20 AM' },
    { id: 'TR-10056', patient: 'Robert Brown', service: 'Blood Test', amount: 45.50, date: '2025-05-03 11:05 AM' },
  ]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would search the database
    console.log('Searching for transaction:', searchQuery);
  };

  const handleSelectTransaction = (transaction: any) => {
    setSelectedTransaction(transaction);
  };

  const handleProcessRefund = () => {
    if (!selectedTransaction || !refundReason) {
      alert('Please select a transaction and provide a refund reason');
      return;
    }
    
    // In a real application, this would process the refund
    console.log('Processing refund for:', selectedTransaction.id);
    console.log('Refund reason:', refundReason);
    
    // Reset form
    setSelectedTransaction(null);
    setRefundReason('');
    
    // Show success message
    alert(`Refund processed successfully for ${selectedTransaction.id}`);
  };

  return (
    <div className="flex-1 p-6 overflow-auto">
      {/* Breadcrumbs */}
      <div className="text-gray-500 text-sm mb-4">Cashier &gt; Refunds</div>
      
      {/* Page Header */}
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Process Refunds</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Search for Transaction</CardTitle>
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
                      <TableHead>Select</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchResults.map((item) => (
                      <TableRow key={item.id} className={selectedTransaction?.id === item.id ? 'bg-blue-50' : ''}>
                        <TableCell className="font-medium">{item.id}</TableCell>
                        <TableCell>{item.patient}</TableCell>
                        <TableCell>{item.service}</TableCell>
                        <TableCell>${item.amount.toFixed(2)}</TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            variant={selectedTransaction?.id === item.id ? "default" : "outline"}
                            onClick={() => handleSelectTransaction(item)}
                          >
                            Select
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
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Refund Details</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedTransaction ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Transaction ID</label>
                    <Input value={selectedTransaction.id} readOnly />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Patient</label>
                    <Input value={selectedTransaction.patient} readOnly />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Service</label>
                    <Input value={selectedTransaction.service} readOnly />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Amount</label>
                    <Input value={`$${selectedTransaction.amount.toFixed(2)}`} readOnly />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Refund Reason *</label>
                    <textarea 
                      className="w-full border border-gray-300 rounded-md p-2"
                      rows={4}
                      value={refundReason}
                      onChange={(e) => setRefundReason(e.target.value)}
                      placeholder="Please provide a reason for this refund"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Refund Method</label>
                    <select className="w-full border border-gray-300 rounded-md p-2">
                      <option>Original Payment Method</option>
                      <option>Cash</option>
                      <option>Credit Card</option>
                      <option>Bank Transfer</option>
                    </select>
                  </div>
                  
                  <Button 
                    className="w-full bg-red-500 hover:bg-red-600" 
                    onClick={handleProcessRefund}
                  >
                    Process Refund
                  </Button>
                  
                  <div className="flex p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800">
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    <p className="text-sm">Refunds require supervisor approval and will be logged in the system.</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                    </svg>
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No transaction selected</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Please search and select a transaction to process a refund.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RefundsPage;
