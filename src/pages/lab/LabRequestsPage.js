"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var lucide_react_1 = require("lucide-react");
var sonner_1 = require("sonner");
var select_1 = require("@/components/ui/select");
var LabRequestsPage = function () {
    // State for filters
    var _a = (0, react_1.useState)(''), searchQuery = _a[0], setSearchQuery = _a[1];
    var _b = (0, react_1.useState)('all'), statusFilter = _b[0], setStatusFilter = _b[1];
    var _c = (0, react_1.useState)('all'), priorityFilter = _c[0], setPriorityFilter = _c[1];
    // Test requests data - would come from API in a real application
    var allTestRequests = [
        {
            id: 'LAB-10245',
            patient: 'John Smith (P-10237)',
            testType: 'Complete Blood Count',
            department: 'Internal Medicine',
            requestedBy: 'Dr. Sarah Johnson',
            time: '09:15 AM',
            date: 'Apr 27, 2025',
            priority: 'Routine',
            priorityColor: 'bg-yellow-100 text-yellow-800',
            status: 'Pending',
            statusClass: 'bg-yellow-100 text-yellow-800',
            notes: 'Patient has reported fatigue and weakness',
            specimenType: 'Blood',
            specimenCollected: true,
            collectedAt: 'Apr 27, 2025, 08:45 AM',
            collectedBy: 'Nurse Emma Davis'
        },
        {
            id: 'LAB-10246',
            patient: 'Emily Davis (P-10238)',
            testType: 'Lipid Profile',
            department: 'Cardiology',
            requestedBy: 'Dr. Michael Brown',
            time: '09:30 AM',
            date: 'Apr 27, 2025',
            priority: 'Routine',
            priorityColor: 'bg-yellow-100 text-yellow-800',
            status: 'In Progress',
            statusClass: 'bg-blue-100 text-blue-800',
            notes: 'Annual checkup',
            specimenType: 'Blood',
            specimenCollected: true,
            collectedAt: 'Apr 27, 2025, 09:00 AM',
            collectedBy: 'Nurse Robert Johnson'
        },
        {
            id: 'LAB-10247',
            patient: 'Robert Wilson (P-10239)',
            testType: 'Troponin I',
            department: 'Emergency',
            requestedBy: 'Dr. Lisa Taylor',
            time: '09:45 AM',
            date: 'Apr 27, 2025',
            priority: 'STAT',
            priorityColor: 'bg-red-100 text-red-800',
            status: 'Critical',
            statusClass: 'bg-red-100 text-red-800',
            notes: 'Patient with severe chest pain',
            specimenType: 'Blood',
            specimenCollected: true,
            collectedAt: 'Apr 27, 2025, 09:30 AM',
            collectedBy: 'Nurse William Chen'
        },
        {
            id: 'LAB-10248',
            patient: 'Maria Garcia (P-10240)',
            testType: 'Liver Function Test',
            department: 'Gastroenterology',
            requestedBy: 'Dr. James Wilson',
            time: '10:00 AM',
            date: 'Apr 27, 2025',
            priority: 'Routine',
            priorityColor: 'bg-yellow-100 text-yellow-800',
            status: 'Completed',
            statusClass: 'bg-green-100 text-green-800',
            notes: 'Follow-up for medication adjustment',
            specimenType: 'Blood',
            specimenCollected: true,
            collectedAt: 'Apr 27, 2025, 09:45 AM',
            collectedBy: 'Nurse Emma Davis'
        },
        {
            id: 'LAB-10249',
            patient: 'David Lee (P-10241)',
            testType: 'Urinalysis',
            department: 'Nephrology',
            requestedBy: 'Dr. Anna Martinez',
            time: '10:15 AM',
            date: 'Apr 27, 2025',
            priority: 'Routine',
            priorityColor: 'bg-yellow-100 text-yellow-800',
            status: 'Pending',
            statusClass: 'bg-yellow-100 text-yellow-800',
            notes: 'Suspected UTI',
            specimenType: 'Urine',
            specimenCollected: false,
            collectedAt: '',
            collectedBy: ''
        },
        {
            id: 'LAB-10250',
            patient: 'Jennifer Adams (P-10242)',
            testType: 'Thyroid Panel',
            department: 'Endocrinology',
            requestedBy: 'Dr. Robert Kim',
            time: '10:30 AM',
            date: 'Apr 27, 2025',
            priority: 'Urgent',
            priorityColor: 'bg-orange-100 text-orange-800',
            status: 'Pending',
            statusClass: 'bg-yellow-100 text-yellow-800',
            notes: 'Patient with symptoms of hypothyroidism',
            specimenType: 'Blood',
            specimenCollected: true,
            collectedAt: 'Apr 27, 2025, 10:15 AM',
            collectedBy: 'Nurse Robert Johnson'
        }
    ];
    // Filter test requests based on search query and filters
    var filteredTestRequests = allTestRequests.filter(function (request) {
        // Search filter
        var searchMatch = searchQuery === '' ||
            request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            request.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
            request.testType.toLowerCase().includes(searchQuery.toLowerCase()) ||
            request.requestedBy.toLowerCase().includes(searchQuery.toLowerCase());
        // Status filter
        var statusMatch = statusFilter === 'all' ||
            request.status.toLowerCase() === statusFilter.toLowerCase();
        // Priority filter
        var priorityMatch = priorityFilter === 'all' ||
            request.priority.toLowerCase() === priorityFilter.toLowerCase();
        return searchMatch && statusMatch && priorityMatch;
    });
    // Handle process test button
    var handleProcessTest = function (testId) {
        sonner_1.toast.success("Started processing test ".concat(testId));
    };
    // Handle view details button
    var handleViewDetails = function (testId) {
        sonner_1.toast.info("Viewing details for test ".concat(testId));
    };
    // Handle complete test button
    var handleCompleteTest = function (testId) {
        sonner_1.toast.success("Test ".concat(testId, " marked as completed"));
    };
    // Handle verify test button
    var handleVerifyTest = function (testId) {
        sonner_1.toast.success("Test ".concat(testId, " has been verified"));
    };
    // Handle adding a new test request
    var handleAddNewTest = function () {
        sonner_1.toast.info("Creating a new test request");
    };
    return (<div>
      {/* Breadcrumbs */}
      <div className="text-gray-500 text-sm mb-4">Laboratory &gt; Test Requests</div>
      
      {/* Page Header with Date */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Test Requests</h1>
      </div>
      
      {/* Filters and Search */}
      <card_1.Card className="border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <div className="relative">
              <lucide_react_1.Search className="absolute left-3 top-3 h-4 w-4 text-gray-400"/>
              <input_1.Input placeholder="Search by patient name, test ID or type..." className="pl-9" value={searchQuery} onChange={function (e) { return setSearchQuery(e.target.value); }}/>
            </div>
          </div>
          
          <div className="md:w-1/6">
            <select_1.Select value={statusFilter} onValueChange={setStatusFilter}>
              <select_1.SelectTrigger>
                <select_1.SelectValue placeholder="Status"/>
              </select_1.SelectTrigger>
              <select_1.SelectContent>
                <select_1.SelectGroup>
                  <select_1.SelectLabel>Filter by Status</select_1.SelectLabel>
                  <select_1.SelectItem value="all">All Statuses</select_1.SelectItem>
                  <select_1.SelectItem value="pending">Pending</select_1.SelectItem>
                  <select_1.SelectItem value="in_progress">In Progress</select_1.SelectItem>
                  <select_1.SelectItem value="completed">Completed</select_1.SelectItem>
                  <select_1.SelectItem value="critical">Critical</select_1.SelectItem>
                </select_1.SelectGroup>
              </select_1.SelectContent>
            </select_1.Select>
          </div>
          
          <div className="md:w-1/6">
            <select_1.Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <select_1.SelectTrigger>
                <select_1.SelectValue placeholder="Priority"/>
              </select_1.SelectTrigger>
              <select_1.SelectContent>
                <select_1.SelectGroup>
                  <select_1.SelectLabel>Filter by Priority</select_1.SelectLabel>
                  <select_1.SelectItem value="all">All Priorities</select_1.SelectItem>
                  <select_1.SelectItem value="routine">Routine</select_1.SelectItem>
                  <select_1.SelectItem value="urgent">Urgent</select_1.SelectItem>
                  <select_1.SelectItem value="stat">STAT</select_1.SelectItem>
                </select_1.SelectGroup>
              </select_1.SelectContent>
            </select_1.Select>
          </div>
          
          <button_1.Button onClick={handleAddNewTest} className="md:w-auto" style={{ backgroundColor: '#3B82F6' }}>
            New Test Request
          </button_1.Button>
        </div>
      </card_1.Card>
      
      {/* Test Requests List */}
      <card_1.Card className="border border-gray-200 mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested By</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Time</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTestRequests.map(function (request) { return (<tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.patient}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.testType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.requestedBy}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.date}, {request.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={"px-2 inline-flex text-xs leading-5 font-semibold rounded-full ".concat(request.priorityColor)}>
                      {request.priority}
                    </span>
                    {request.priority === 'STAT' && (<span className="ml-1">
                        <lucide_react_1.AlertTriangle className="h-4 w-4 text-red-500 inline"/>
                      </span>)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={"px-2 inline-flex text-xs leading-5 font-semibold rounded-full ".concat(request.statusClass)}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {request.status === 'Pending' && (<button_1.Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-900 mr-2 p-0" onClick={function () { return handleProcessTest(request.id); }}>
                        Process
                      </button_1.Button>)}
                    {request.status === 'In Progress' && (<button_1.Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-900 mr-2 p-0" onClick={function () { return handleCompleteTest(request.id); }}>
                        Complete
                      </button_1.Button>)}
                    {request.status === 'Critical' && (<button_1.Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-900 mr-2 p-0" onClick={function () { return handleVerifyTest(request.id); }}>
                        Verify
                      </button_1.Button>)}
                    <button_1.Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 p-0" onClick={function () { return handleViewDetails(request.id); }}>
                      Details
                    </button_1.Button>
                  </td>
                </tr>); })}
            </tbody>
          </table>
        </div>
        
        {/* Empty state if no results */}
        {filteredTestRequests.length === 0 && (<div className="py-8 text-center text-gray-500">
            <p>No test requests found matching your criteria.</p>
          </div>)}
        
        {/* Pagination */}
        {filteredTestRequests.length > 0 && (<div className="flex items-center justify-between p-4">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredTestRequests.length}</span> of{" "}
              <span className="font-medium">{filteredTestRequests.length}</span> results
            </div>
            <div className="flex space-x-2">
              <button_1.Button variant="outline" size="sm" className="text-sm" disabled>Previous</button_1.Button>
              <button_1.Button variant="default" size="sm" className="text-sm bg-blue-500">1</button_1.Button>
              <button_1.Button variant="outline" size="sm" className="text-sm" disabled>Next</button_1.Button>
            </div>
          </div>)}
      </card_1.Card>
      
      {/* Floating Action Button */}
      <button_1.Button className="fixed bottom-8 right-8 w-14 h-14 rounded-full shadow-lg" style={{ backgroundColor: '#3B82F6' }} onClick={handleAddNewTest}>
        <span className="text-xl font-bold">+</span>
      </button_1.Button>
    </div>);
};
exports.default = LabRequestsPage;
