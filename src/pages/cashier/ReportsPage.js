"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var table_1 = require("@/components/ui/table");
var ReportsPage = function () {
    var _a = (0, react_1.useState)('daily'), reportType = _a[0], setReportType = _a[1];
    var _b = (0, react_1.useState)('today'), dateRange = _b[0], setDateRange = _b[1];
    // Sample data for demonstration
    var salesData = [
        { id: 'TR-10054', patient: 'John Smith', service: 'Consultation', amount: 75.00, paymentType: 'Cash', date: '2025-05-03 09:15 AM' },
        { id: 'TR-10055', patient: 'Alice Johnson', service: 'X-Ray', amount: 120.00, paymentType: 'Insurance', date: '2025-05-03 10:20 AM' },
        { id: 'TR-10056', patient: 'Robert Brown', service: 'Blood Test', amount: 45.50, paymentType: 'Credit Card', date: '2025-05-03 11:05 AM' },
        { id: 'TR-10057', patient: 'Emily Davis', service: 'Consultation', amount: 75.00, paymentType: 'Cash', date: '2025-05-03 11:30 AM' },
        { id: 'TR-10058', patient: 'Michael Wilson', service: 'MRI Scan', amount: 350.00, paymentType: 'Insurance', date: '2025-05-03 01:45 PM' },
    ];
    return (<div className="flex-1 p-6 overflow-auto">
      {/* Breadcrumbs */}
      <div className="text-gray-500 text-sm mb-4">Cashier &gt; Reports</div>
      
      {/* Page Header */}
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Financial Reports</h1>
      
      <card_1.Card className="mb-6">
        <card_1.CardHeader>
          <card_1.CardTitle>Report Parameters</card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
              <select className="w-full border border-gray-300 rounded-md p-2" value={reportType} onChange={function (e) { return setReportType(e.target.value); }}>
                <option value="daily">Daily Sales</option>
                <option value="weekly">Weekly Sales</option>
                <option value="monthly">Monthly Sales</option>
                <option value="discounts">Discounts</option>
                <option value="refunds">Refunds</option>
                <option value="payment-methods">Payment Methods</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
              <select className="w-full border border-gray-300 rounded-md p-2" value={dateRange} onChange={function (e) { return setDateRange(e.target.value); }}>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="this-week">This Week</option>
                <option value="last-week">Last Week</option>
                <option value="this-month">This Month</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button_1.Button className="bg-blue-500 w-full">Generate Report</button_1.Button>
            </div>
          </div>
        </card_1.CardContent>
      </card_1.Card>
      
      <card_1.Card>
        <card_1.CardHeader className="flex flex-row items-center justify-between pb-2">
          <card_1.CardTitle>Daily Sales Report</card_1.CardTitle>
          <div className="flex space-x-2">
            <button_1.Button variant="outline" size="sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
              </svg>
              Export
            </button_1.Button>
            <button_1.Button variant="outline" size="sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
              </svg>
              Print
            </button_1.Button>
          </div>
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
                  <table_1.TableHead>Payment Type</table_1.TableHead>
                  <table_1.TableHead>Date & Time</table_1.TableHead>
                </table_1.TableRow>
              </table_1.TableHeader>
              <table_1.TableBody>
                {salesData.map(function (item) { return (<table_1.TableRow key={item.id}>
                    <table_1.TableCell className="font-medium">{item.id}</table_1.TableCell>
                    <table_1.TableCell>{item.patient}</table_1.TableCell>
                    <table_1.TableCell>{item.service}</table_1.TableCell>
                    <table_1.TableCell>${item.amount.toFixed(2)}</table_1.TableCell>
                    <table_1.TableCell>{item.paymentType}</table_1.TableCell>
                    <table_1.TableCell>{item.date}</table_1.TableCell>
                  </table_1.TableRow>); })}
              </table_1.TableBody>
            </table_1.Table>
          </div>
          
          <div className="mt-4 bg-gray-50 p-4 rounded-md border border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-medium">Summary</p>
                <p className="text-sm text-gray-500">Total Transactions: 5</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Sales</p>
                <p className="text-xl font-bold text-gray-800">$665.50</p>
              </div>
            </div>
          </div>
        </card_1.CardContent>
      </card_1.Card>
    </div>);
};
exports.default = ReportsPage;
