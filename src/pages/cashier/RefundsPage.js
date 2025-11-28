"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var table_1 = require("@/components/ui/table");
var lucide_react_1 = require("lucide-react");
var RefundsPage = function () {
    var _a = (0, react_1.useState)(''), searchQuery = _a[0], setSearchQuery = _a[1];
    var _b = (0, react_1.useState)(null), selectedTransaction = _b[0], setSelectedTransaction = _b[1];
    var _c = (0, react_1.useState)(''), refundReason = _c[0], setRefundReason = _c[1];
    var _d = (0, react_1.useState)([
        { id: 'TR-10054', patient: 'John Smith', service: 'Consultation', amount: 75.00, date: '2025-05-03 09:15 AM' },
        { id: 'TR-10055', patient: 'Alice Johnson', service: 'X-Ray', amount: 120.00, date: '2025-05-03 10:20 AM' },
        { id: 'TR-10056', patient: 'Robert Brown', service: 'Blood Test', amount: 45.50, date: '2025-05-03 11:05 AM' },
    ]), searchResults = _d[0], setSearchResults = _d[1];
    var handleSearch = function (e) {
        e.preventDefault();
        // In a real application, this would search the database
        console.log('Searching for transaction:', searchQuery);
    };
    var handleSelectTransaction = function (transaction) {
        setSelectedTransaction(transaction);
    };
    var handleProcessRefund = function () {
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
        alert("Refund processed successfully for ".concat(selectedTransaction.id));
    };
    return (<div className="flex-1 p-6 overflow-auto">
      {/* Breadcrumbs */}
      <div className="text-gray-500 text-sm mb-4">Cashier &gt; Refunds</div>
      
      {/* Page Header */}
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Process Refunds</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <card_1.Card className="mb-6">
            <card_1.CardHeader>
              <card_1.CardTitle>Search for Transaction</card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent>
              <form onSubmit={handleSearch} className="flex gap-4 mb-4">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <lucide_react_1.Search className="h-5 w-5 text-gray-400"/>
                  </div>
                  <input_1.Input type="text" placeholder="Search by transaction ID, patient name or ID..." className="pl-10" value={searchQuery} onChange={function (e) { return setSearchQuery(e.target.value); }}/>
                </div>
                <button_1.Button type="submit" className="bg-blue-500">Search</button_1.Button>
              </form>
            </card_1.CardContent>
          </card_1.Card>
          
          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle>Search Results</card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent>
              <div className="rounded-md border">
                <table_1.Table>
                  <table_1.TableHeader>
                    <table_1.TableRow>
                      <table_1.TableHead>Transaction ID</table_1.TableHead>
                      <table_1.TableHead>Patient</table_1.TableHead>
                      <table_1.TableHead>Service</table_1.TableHead>
                      <table_1.TableHead>Amount</table_1.TableHead>
                      <table_1.TableHead>Date & Time</table_1.TableHead>
                      <table_1.TableHead>Select</table_1.TableHead>
                    </table_1.TableRow>
                  </table_1.TableHeader>
                  <table_1.TableBody>
                    {searchResults.map(function (item) { return (<table_1.TableRow key={item.id} className={(selectedTransaction === null || selectedTransaction === void 0 ? void 0 : selectedTransaction.id) === item.id ? 'bg-blue-50' : ''}>
                        <table_1.TableCell className="font-medium">{item.id}</table_1.TableCell>
                        <table_1.TableCell>{item.patient}</table_1.TableCell>
                        <table_1.TableCell>{item.service}</table_1.TableCell>
                        <table_1.TableCell>${item.amount.toFixed(2)}</table_1.TableCell>
                        <table_1.TableCell>{item.date}</table_1.TableCell>
                        <table_1.TableCell>
                          <button_1.Button size="sm" variant={(selectedTransaction === null || selectedTransaction === void 0 ? void 0 : selectedTransaction.id) === item.id ? "default" : "outline"} onClick={function () { return handleSelectTransaction(item); }}>
                            Select
                          </button_1.Button>
                        </table_1.TableCell>
                      </table_1.TableRow>); })}
                  </table_1.TableBody>
                </table_1.Table>
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </div>
        
        <div>
          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle>Refund Details</card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent>
              {selectedTransaction ? (<div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Transaction ID</label>
                    <input_1.Input value={selectedTransaction.id} readOnly/>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Patient</label>
                    <input_1.Input value={selectedTransaction.patient} readOnly/>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Service</label>
                    <input_1.Input value={selectedTransaction.service} readOnly/>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Amount</label>
                    <input_1.Input value={"$".concat(selectedTransaction.amount.toFixed(2))} readOnly/>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Refund Reason *</label>
                    <textarea className="w-full border border-gray-300 rounded-md p-2" rows={4} value={refundReason} onChange={function (e) { return setRefundReason(e.target.value); }} placeholder="Please provide a reason for this refund" required/>
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
                  
                  <button_1.Button className="w-full bg-red-500 hover:bg-red-600" onClick={handleProcessRefund}>
                    Process Refund
                  </button_1.Button>
                  
                  <div className="flex p-3 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800">
                    <lucide_react_1.AlertCircle className="h-5 w-5 mr-2 flex-shrink-0"/>
                    <p className="text-sm">Refunds require supervisor approval and will be logged in the system.</p>
                  </div>
                </div>) : (<div className="text-center py-8">
                  <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"/>
                    </svg>
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No transaction selected</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Please search and select a transaction to process a refund.
                  </p>
                </div>)}
            </card_1.CardContent>
          </card_1.Card>
        </div>
      </div>
    </div>);
};
exports.default = RefundsPage;
