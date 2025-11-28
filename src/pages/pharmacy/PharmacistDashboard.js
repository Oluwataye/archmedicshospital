"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PharmacistDashboard;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var table_1 = require("@/components/ui/table");
var use_toast_1 = require("@/hooks/use-toast");
function PharmacistDashboard() {
    var toast = (0, use_toast_1.useToast)().toast;
    var _a = (0, react_1.useState)(''), patientSearchQuery = _a[0], setPatientSearchQuery = _a[1];
    var recentPrescriptions = (0, react_1.useState)([
        {
            id: 'RX123456',
            patientName: 'John Doe',
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
            medication: 'Amoxicillin',
            dosage: '500mg',
            frequency: 'TID',
            doctor: 'Dr. Garcia',
            date: '9:15 AM Today',
            status: 'Pending',
            priority: 'Normal',
            ward: 'General Medicine - Room 23'
        }
    ])[0];
    var stats = (0, react_1.useState)({
        pendingVerifications: 12,
        readyToDispense: 8,
        inventoryAlerts: 3,
        totalPrescriptionsToday: 47
    })[0];
    var recentActivity = (0, react_1.useState)([
        { time: '10:15 AM', activity: 'Dr. Howard prescribed Morphine Sulfate for John Doe', type: 'New Prescription' },
        { time: '10:05 AM', activity: 'You approved Insulin Lispro for Sarah Miller', type: 'Approval' },
        { time: '9:50 AM', activity: 'Inventory alert: Amoxicillin suspension below threshold', type: 'Inventory' },
        { time: '9:30 AM', activity: 'Dr. Williams prescribed Amoxicillin for Lisa Martin', type: 'New Prescription' },
        { time: '9:15 AM', activity: 'Drug interaction detected: Warfarin + Aspirin', type: 'Alert' }
    ])[0];
    var handlePatientSearch = function (e) {
        e.preventDefault();
        toast({
            title: "Searching for patient",
            description: "Patient ID/Name: ".concat(patientSearchQuery),
        });
    };
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
    var getActivityIcon = function (type) {
        switch (type) {
            case 'New Prescription':
                return <lucide_react_1.PlusCircle size={16} className="text-blue-500"/>;
            case 'Approval':
                return <lucide_react_1.PlusCircle size={16} className="text-green-500"/>;
            case 'Inventory':
                return <lucide_react_1.Package size={16} className="text-orange-500"/>;
            case 'Alert':
                return <lucide_react_1.AlertTriangle size={16} className="text-red-500"/>;
            default:
                return <lucide_react_1.PlusCircle size={16} className="text-gray-500"/>;
        }
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
    return (<div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Pharmacist Dashboard</h1>
        <p className="text-gray-600">Welcome back. Here's your daily overview.</p>
      </div>
      
      {/* Patient ID Search Box */}
      <card_1.Card className="mb-6">
        <card_1.CardHeader className="pb-2">
          <card_1.CardTitle>Patient Quick Search</card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent>
          <form onSubmit={handlePatientSearch} className="flex items-center">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <lucide_react_1.Search size={18} className="text-gray-500"/>
              </div>
              <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white" placeholder="Enter Patient ID or Name" value={patientSearchQuery} onChange={function (e) { return setPatientSearchQuery(e.target.value); }}/>
            </div>
            <button_1.Button type="submit" className="ml-3">
              Search
            </button_1.Button>
          </form>
        </card_1.CardContent>
      </card_1.Card>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <card_1.Card>
          <card_1.CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-500">
                <lucide_react_1.PlusCircle size={24}/>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800">{stats.pendingVerifications}</h3>
                <p className="text-sm text-gray-600">Pending Verifications</p>
              </div>
            </div>
          </card_1.CardContent>
        </card_1.Card>
        
        <card_1.Card>
          <card_1.CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-500">
                <lucide_react_1.PlusCircle size={24}/>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800">{stats.readyToDispense}</h3>
                <p className="text-sm text-gray-600">Ready to Dispense</p>
              </div>
            </div>
          </card_1.CardContent>
        </card_1.Card>
        
        <card_1.Card>
          <card_1.CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 text-orange-500">
                <lucide_react_1.AlertTriangle size={24}/>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800">{stats.inventoryAlerts}</h3>
                <p className="text-sm text-gray-600">Inventory Alerts</p>
              </div>
            </div>
          </card_1.CardContent>
        </card_1.Card>
        
        <card_1.Card>
          <card_1.CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-500">
                <lucide_react_1.BarChart3 size={24}/>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800">{stats.totalPrescriptionsToday}</h3>
                <p className="text-sm text-gray-600">Today's Prescriptions</p>
              </div>
            </div>
          </card_1.CardContent>
        </card_1.Card>
      </div>
      
      {/* Recent Prescriptions */}
      <card_1.Card className="mb-6">
        <card_1.CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-6">
          <card_1.CardTitle>Recent Prescriptions</card_1.CardTitle>
          <button_1.Button variant="link" className="text-blue-500">View All</button_1.Button>
        </card_1.CardHeader>
        <card_1.CardContent className="px-0">
          <div className="overflow-x-auto">
            <table_1.Table>
              <table_1.TableHeader>
                <table_1.TableRow>
                  <table_1.TableHead>Priority</table_1.TableHead>
                  <table_1.TableHead>Patient</table_1.TableHead>
                  <table_1.TableHead>Medication</table_1.TableHead>
                  <table_1.TableHead>Doctor</table_1.TableHead>
                  <table_1.TableHead>Time</table_1.TableHead>
                  <table_1.TableHead>Status</table_1.TableHead>
                  <table_1.TableHead className="text-right">Actions</table_1.TableHead>
                </table_1.TableRow>
              </table_1.TableHeader>
              <table_1.TableBody>
                {recentPrescriptions.map(function (prescription) { return (<table_1.TableRow key={prescription.id} className={prescription.priority === 'Urgent' ? 'bg-red-50' : prescription.priority === 'High' ? 'bg-orange-50' : ''}>
                    <table_1.TableCell>
                      <div className="flex items-center">
                        <span className={"h-6 w-6 rounded-full flex items-center justify-center text-xs text-white font-bold ".concat(getPriorityColor(prescription.priority))}>
                          {getPriorityIcon(prescription.priority)}
                        </span>
                      </div>
                    </table_1.TableCell>
                    <table_1.TableCell>
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                          {prescription.patientName.split(' ').map(function (name) { return name[0]; }).join('')}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{prescription.patientName}</div>
                          <div className="text-xs text-gray-500">{prescription.ward}</div>
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
                      <button_1.Button variant="ghost" className="text-green-600 hover:text-green-900 mr-3" onClick={function () { return handleApprove(prescription.id); }}>
                        Approve
                      </button_1.Button>
                      <button_1.Button variant="ghost" className="text-red-600 hover:text-red-900" onClick={function () { return handleReject(prescription.id); }}>
                        Reject
                      </button_1.Button>
                    </table_1.TableCell>
                  </table_1.TableRow>); })}
              </table_1.TableBody>
            </table_1.Table>
          </div>
        </card_1.CardContent>
      </card_1.Card>
      
      {/* Recent Activity */}
      <card_1.Card>
        <card_1.CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-6">
          <card_1.CardTitle>Recent Activity</card_1.CardTitle>
          <button_1.Button variant="link" className="text-blue-500">View All</button_1.Button>
        </card_1.CardHeader>
        <card_1.CardContent>
          <ul className="divide-y divide-gray-200">
            {recentActivity.map(function (activity, index) { return (<li key={index} className="py-3 flex">
                <div className="mr-4">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{activity.activity}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </li>); })}
          </ul>
        </card_1.CardContent>
      </card_1.Card>
    </div>);
}
