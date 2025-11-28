"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var lucide_react_1 = require("lucide-react");
var sonner_1 = require("sonner");
var PendingResultsPage = function () {
    var _a = (0, react_1.useState)(''), searchQuery = _a[0], setSearchQuery = _a[1];
    // Pending results data - would come from API in a real application
    var allPendingResults = [
        {
            id: 'LAB-10245',
            patient: 'John Smith (P-10237)',
            testType: 'Complete Blood Count',
            department: 'Internal Medicine',
            requestedBy: 'Dr. Sarah Johnson',
            processedAt: 'Apr 27, 2025, 09:30 AM',
            processedBy: 'Lab Tech James Wilson',
            priority: 'Routine',
            priorityColor: 'bg-yellow-100 text-yellow-800',
            verificationRequired: true
        },
        {
            id: 'LAB-10246',
            patient: 'Emily Davis (P-10238)',
            testType: 'Lipid Profile',
            department: 'Cardiology',
            requestedBy: 'Dr. Michael Brown',
            processedAt: 'Apr 27, 2025, 10:15 AM',
            processedBy: 'Lab Tech James Wilson',
            priority: 'Routine',
            priorityColor: 'bg-yellow-100 text-yellow-800',
            verificationRequired: true
        },
        {
            id: 'LAB-10249',
            patient: 'David Lee (P-10241)',
            testType: 'Urinalysis',
            department: 'Nephrology',
            requestedBy: 'Dr. Anna Martinez',
            processedAt: 'Apr 27, 2025, 11:30 AM',
            processedBy: 'Lab Tech Susan Clark',
            priority: 'Routine',
            priorityColor: 'bg-yellow-100 text-yellow-800',
            verificationRequired: false
        },
        {
            id: 'LAB-10250',
            patient: 'Jennifer Adams (P-10242)',
            testType: 'Thyroid Panel',
            department: 'Endocrinology',
            requestedBy: 'Dr. Robert Kim',
            processedAt: 'Apr 27, 2025, 12:00 PM',
            processedBy: 'Lab Tech James Wilson',
            priority: 'Urgent',
            priorityColor: 'bg-orange-100 text-orange-800',
            verificationRequired: true
        }
    ];
    // Filter results based on search query
    var filteredResults = allPendingResults.filter(function (result) {
        return searchQuery === '' ||
            result.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            result.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
            result.testType.toLowerCase().includes(searchQuery.toLowerCase()) ||
            result.requestedBy.toLowerCase().includes(searchQuery.toLowerCase());
    });
    // Handle entering results button
    var handleEnterResults = function (testId) {
        sonner_1.toast.info("Entering results for test ".concat(testId));
    };
    // Handle view details button
    var handleViewDetails = function (testId) {
        sonner_1.toast.info("Viewing details for test ".concat(testId));
    };
    // Handle verify results button
    var handleVerifyResults = function (testId) {
        sonner_1.toast.success("Results for test ".concat(testId, " have been verified"));
    };
    return (<div>
      {/* Breadcrumbs */}
      <div className="text-gray-500 text-sm mb-4">Laboratory &gt; Results &gt; Pending</div>
      
      {/* Page Header with Date */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Pending Results</h1>
      </div>
      
      {/* Search */}
      <card_1.Card className="border border-gray-200 p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-grow relative">
            <lucide_react_1.Search className="absolute left-3 top-3 h-4 w-4 text-gray-400"/>
            <input_1.Input placeholder="Search by patient name, test ID or type..." className="pl-9" value={searchQuery} onChange={function (e) { return setSearchQuery(e.target.value); }}/>
          </div>
          
          <button_1.Button onClick={function () { return setSearchQuery(''); }} variant="outline">
            Clear
          </button_1.Button>
        </div>
      </card_1.Card>
      
      {/* Results List */}
      <card_1.Card className="border border-gray-200 mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested By</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Processed At</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredResults.map(function (result) { return (<tr key={result.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{result.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.patient}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.testType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.requestedBy}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{result.processedAt}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={"px-2 inline-flex text-xs leading-5 font-semibold rounded-full ".concat(result.priorityColor)}>
                      {result.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button_1.Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-900 mr-2 p-0" onClick={function () { return handleEnterResults(result.id); }}>
                      Enter Results
                    </button_1.Button>
                    {result.verificationRequired && (<button_1.Button variant="ghost" size="sm" className="text-green-600 hover:text-green-900 mr-2 p-0" onClick={function () { return handleVerifyResults(result.id); }}>
                        Verify
                      </button_1.Button>)}
                    <button_1.Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 p-0" onClick={function () { return handleViewDetails(result.id); }}>
                      Details
                    </button_1.Button>
                  </td>
                </tr>); })}
            </tbody>
          </table>
        </div>
        
        {/* Empty state if no results */}
        {filteredResults.length === 0 && (<div className="py-8 text-center text-gray-500">
            <p>No pending results found matching your criteria.</p>
          </div>)}
        
        {/* Pagination */}
        {filteredResults.length > 0 && (<div className="flex items-center justify-between p-4">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredResults.length}</span> of{" "}
              <span className="font-medium">{filteredResults.length}</span> results
            </div>
            <div className="flex space-x-2">
              <button_1.Button variant="outline" size="sm" className="text-sm" disabled>Previous</button_1.Button>
              <button_1.Button variant="default" size="sm" className="text-sm bg-blue-500">1</button_1.Button>
              <button_1.Button variant="outline" size="sm" className="text-sm" disabled>Next</button_1.Button>
            </div>
          </div>)}
      </card_1.Card>
    </div>);
};
exports.default = PendingResultsPage;
