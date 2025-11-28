"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PrescriptionsPage;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var table_1 = require("@/components/ui/table");
var dropdown_menu_1 = require("@/components/ui/dropdown-menu");
var use_toast_1 = require("@/hooks/use-toast");
function PrescriptionsPage() {
    var toast = (0, use_toast_1.useToast)().toast;
    var _a = (0, react_1.useState)(''), searchQuery = _a[0], setSearchQuery = _a[1];
    var _b = (0, react_1.useState)('All'), statusFilter = _b[0], setStatusFilter = _b[1];
    var prescriptions = (0, react_1.useState)([
        {
            id: 'RX123456',
            patientName: 'John Doe',
            patientId: 'P-10542',
            medication: 'Atorvastatin',
            dosage: '20mg',
            frequency: 'Daily',
            doctor: 'Dr. Howard',
            date: '10:30 AM Today',
            status: 'Pending',
            priority: 'Urgent',
            ward: 'ICU - Room 12'
        },
        {
            id: 'RX123457',
            patientName: 'Sarah Miller',
            patientId: 'P-10398',
            medication: 'Metformin',
            dosage: '500mg',
            frequency: 'BID',
            doctor: 'Dr. Patel',
            date: '9:45 AM Today',
            status: 'Pending',
            priority: 'High',
            ward: 'Endocrinology - Room 5'
        },
        {
            id: 'RX123458',
            patientName: 'Robert Johnson',
            patientId: 'P-10687',
            medication: 'Amoxicillin',
            dosage: '500mg',
            frequency: 'TID',
            doctor: 'Dr. Garcia',
            date: '9:15 AM Today',
            status: 'Pending',
            priority: 'Normal',
            ward: 'General Medicine - Room 23'
        },
        {
            id: 'RX123459',
            patientName: 'Emily Wilson',
            patientId: 'P-10754',
            medication: 'Lisinopril',
            dosage: '10mg',
            frequency: 'Daily',
            doctor: 'Dr. Williams',
            date: '8:30 AM Today',
            status: 'Approved',
            priority: 'Normal',
            ward: 'Cardiology - Room 45'
        },
        {
            id: 'RX123460',
            patientName: 'Michael Davis',
            patientId: 'P-10892',
            medication: 'Albuterol',
            dosage: '90mcg',
            frequency: 'PRN',
            doctor: 'Dr. Martinez',
            date: 'Yesterday, 4:15 PM',
            status: 'Rejected',
            priority: 'High',
            ward: 'Pulmonology - Room 32'
        }
    ])[0];
    var getStatusColor = function (status) {
        switch (status) {
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'Approved':
                return 'bg-green-100 text-green-800';
            case 'Rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    var getPriorityColor = function (priority) {
        switch (priority) {
            case 'Urgent':
                return 'bg-red-500';
            case 'High':
                return 'bg-orange-500';
            case 'Normal':
                return 'bg-blue-500';
            default:
                return 'bg-gray-500';
        }
    };
    var getPriorityIcon = function (priority) {
        switch (priority) {
            case 'Urgent':
                return '!';
            case 'High':
                return 'H';
            case 'Normal':
                return 'N';
            default:
                return '';
        }
    };
    var handleSearch = function (e) {
        e.preventDefault();
        toast({
            title: "Searching prescriptions",
            description: "Query: ".concat(searchQuery),
        });
    };
    var handleStatusFilterChange = function (status) {
        setStatusFilter(status);
        toast({
            title: "Filter applied",
            description: "Status: ".concat(status),
            variant: "default",
        });
    };
    var handleApprove = function (id) {
        toast({
            title: "Prescription Approved",
            description: "Prescription ".concat(id, " has been approved"),
            variant: "default",
        });
    };
    var handleReject = function (id) {
        toast({
            title: "Prescription Rejected",
            description: "Prescription ".concat(id, " has been rejected"),
            variant: "destructive",
        });
    };
    var filteredPrescriptions = prescriptions.filter(function (prescription) {
        // Apply status filter
        if (statusFilter !== 'All' && prescription.status !== statusFilter) {
            return false;
        }
        // Apply search query
        if (searchQuery) {
            var query = searchQuery.toLowerCase();
            return (prescription.patientName.toLowerCase().includes(query) ||
                prescription.id.toLowerCase().includes(query) ||
                prescription.medication.toLowerCase().includes(query) ||
                prescription.patientId.toLowerCase().includes(query));
        }
        return true;
    });
    return (<div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Prescriptions</h1>
        <p className="text-gray-600">Review, verify and manage prescription orders</p>
      </div>
      
      <card_1.Card className="mb-6">
        <card_1.CardHeader className="pb-2">
          <card_1.CardTitle>Filter Prescriptions</card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <lucide_react_1.Search size={18} className="text-gray-500"/>
                  </div>
                  <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white" placeholder="Search by patient name, ID or medication..." value={searchQuery} onChange={function (e) { return setSearchQuery(e.target.value); }}/>
                </div>
              </form>
            </div>
            
            <div className="flex items-center">
              <span className="mr-2 text-gray-700">Status:</span>
              <dropdown_menu_1.DropdownMenu>
                <dropdown_menu_1.DropdownMenuTrigger asChild>
                  <button_1.Button variant="outline" className="flex items-center">
                    {statusFilter} <lucide_react_1.ChevronDown className="ml-2 h-4 w-4"/>
                  </button_1.Button>
                </dropdown_menu_1.DropdownMenuTrigger>
                <dropdown_menu_1.DropdownMenuContent>
                  <dropdown_menu_1.DropdownMenuItem onClick={function () { return handleStatusFilterChange('All'); }}>
                    All
                  </dropdown_menu_1.DropdownMenuItem>
                  <dropdown_menu_1.DropdownMenuSeparator />
                  <dropdown_menu_1.DropdownMenuItem onClick={function () { return handleStatusFilterChange('Pending'); }}>
                    Pending
                  </dropdown_menu_1.DropdownMenuItem>
                  <dropdown_menu_1.DropdownMenuItem onClick={function () { return handleStatusFilterChange('Approved'); }}>
                    Approved
                  </dropdown_menu_1.DropdownMenuItem>
                  <dropdown_menu_1.DropdownMenuItem onClick={function () { return handleStatusFilterChange('Rejected'); }}>
                    Rejected
                  </dropdown_menu_1.DropdownMenuItem>
                </dropdown_menu_1.DropdownMenuContent>
              </dropdown_menu_1.DropdownMenu>
              
              <button_1.Button variant="outline" className="ml-2 flex items-center">
                <lucide_react_1.Filter className="mr-2 h-4 w-4"/> More Filters
              </button_1.Button>
            </div>
          </div>
        </card_1.CardContent>
      </card_1.Card>
      
      <card_1.Card>
        <card_1.CardContent className="p-0">
          <div className="overflow-x-auto">
            <table_1.Table>
              <table_1.TableHeader>
                <table_1.TableRow>
                  <table_1.TableHead>Priority</table_1.TableHead>
                  <table_1.TableHead>Rx ID</table_1.TableHead>
                  <table_1.TableHead>Patient</table_1.TableHead>
                  <table_1.TableHead>Medication</table_1.TableHead>
                  <table_1.TableHead>Doctor</table_1.TableHead>
                  <table_1.TableHead>Time</table_1.TableHead>
                  <table_1.TableHead>Status</table_1.TableHead>
                  <table_1.TableHead className="text-right">Actions</table_1.TableHead>
                </table_1.TableRow>
              </table_1.TableHeader>
              <table_1.TableBody>
                {filteredPrescriptions.length === 0 ? (<table_1.TableRow>
                    <table_1.TableCell colSpan={8} className="text-center py-4">
                      No prescriptions found matching your criteria
                    </table_1.TableCell>
                  </table_1.TableRow>) : (filteredPrescriptions.map(function (prescription) { return (<table_1.TableRow key={prescription.id} className={prescription.priority === 'Urgent' ? 'bg-red-50' : prescription.priority === 'High' ? 'bg-orange-50' : ''}>
                      <table_1.TableCell>
                        <div className="flex items-center">
                          <span className={"h-6 w-6 rounded-full flex items-center justify-center text-xs text-white font-bold ".concat(getPriorityColor(prescription.priority))}>
                            {getPriorityIcon(prescription.priority)}
                          </span>
                        </div>
                      </table_1.TableCell>
                      <table_1.TableCell className="font-medium">{prescription.id}</table_1.TableCell>
                      <table_1.TableCell>
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                            {prescription.patientName.split(' ').map(function (name) { return name[0]; }).join('')}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{prescription.patientName}</div>
                            <div className="text-xs text-gray-500">{prescription.patientId} • {prescription.ward}</div>
                          </div>
                        </div>
                      </table_1.TableCell>
                      <table_1.TableCell>
                        <div className="text-sm font-medium text-gray-900">{prescription.medication}</div>
                        <div className="text-xs text-gray-500">{prescription.dosage} - {prescription.frequency}</div>
                      </table_1.TableCell>
                      <table_1.TableCell className="text-sm text-gray-900">
                        {prescription.doctor}
                      </table_1.TableCell>
                      <table_1.TableCell>
                        <div className="text-sm text-gray-900">{prescription.date}</div>
                      </table_1.TableCell>
                      <table_1.TableCell>
                        <span className={"px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ".concat(getStatusColor(prescription.status))}>
                          {prescription.status}
                        </span>
                      </table_1.TableCell>
                      <table_1.TableCell className="text-right">
                        {prescription.status === 'Pending' ? (<>
                            <button_1.Button variant="ghost" className="text-green-600 hover:text-green-900 mr-3" onClick={function () { return handleApprove(prescription.id); }}>
                              Approve
                            </button_1.Button>
                            <button_1.Button variant="ghost" className="text-red-600 hover:text-red-900" onClick={function () { return handleReject(prescription.id); }}>
                              Reject
                            </button_1.Button>
                          </>) : (<button_1.Button variant="outline" size="sm">
                            View Details
                          </button_1.Button>)}
                      </table_1.TableCell>
                    </table_1.TableRow>); }))}
              </table_1.TableBody>
            </table_1.Table>
          </div>
        </card_1.CardContent>
      </card_1.Card>
    </div>);
}
