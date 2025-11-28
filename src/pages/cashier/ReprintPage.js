"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var table_1 = require("@/components/ui/table");
var lucide_react_1 = require("lucide-react");
var ReprintPage = function () {
    var _a = (0, react_1.useState)(''), searchQuery = _a[0], setSearchQuery = _a[1];
    var _b = (0, react_1.useState)([
        { id: 'TR-10054', patient: 'John Smith', service: 'Consultation', amount: 75.00, date: '2025-05-03 09:15 AM' },
        { id: 'TR-10055', patient: 'Alice Johnson', service: 'X-Ray', amount: 120.00, date: '2025-05-03 10:20 AM' },
        { id: 'TR-10056', patient: 'Robert Brown', service: 'Blood Test', amount: 45.50, date: '2025-05-03 11:05 AM' }
    ]), searchResults = _b[0], setSearchResults = _b[1];
    var handleSearch = function (e) {
        e.preventDefault();
        // In a real application, this would search the database
        console.log('Searching for receipt:', searchQuery);
    };
    var handleReprint = function (id) {
        // In a real application, this would trigger receipt printing
        console.log('Reprinting receipt:', id);
    };
    return (<div className="flex-1 p-6 overflow-auto">
      {/* Breadcrumbs */}
      <div className="text-gray-500 text-sm mb-4">Cashier &gt; Reprint</div>
      
      {/* Page Header */}
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Receipt Reprint</h1>
      
      <card_1.Card className="mb-6">
        <card_1.CardHeader>
          <card_1.CardTitle>Search for Receipt</card_1.CardTitle>
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
          
          <div className="space-y-2 mb-4">
            <label className="block text-sm font-medium">Search by Date Range:</label>
            <div className="flex gap-4">
              <div className="w-1/2">
                <input_1.Input type="date"/>
              </div>
              <div className="w-1/2">
                <input_1.Input type="date"/>
              </div>
            </div>
          </div>
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
                  <table_1.TableHead>Actions</table_1.TableHead>
                </table_1.TableRow>
              </table_1.TableHeader>
              <table_1.TableBody>
                {searchResults.map(function (item) { return (<table_1.TableRow key={item.id}>
                    <table_1.TableCell className="font-medium">{item.id}</table_1.TableCell>
                    <table_1.TableCell>{item.patient}</table_1.TableCell>
                    <table_1.TableCell>{item.service}</table_1.TableCell>
                    <table_1.TableCell>${item.amount.toFixed(2)}</table_1.TableCell>
                    <table_1.TableCell>{item.date}</table_1.TableCell>
                    <table_1.TableCell>
                      <button_1.Button size="sm" onClick={function () { return handleReprint(item.id); }}>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                        </svg>
                        Reprint
                      </button_1.Button>
                    </table_1.TableCell>
                  </table_1.TableRow>); })}
              </table_1.TableBody>
            </table_1.Table>
          </div>
        </card_1.CardContent>
      </card_1.Card>
    </div>);
};
exports.default = ReprintPage;
