"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DispensaryPage;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var table_1 = require("@/components/ui/table");
var tabs_1 = require("@/components/ui/tabs");
var use_toast_1 = require("@/hooks/use-toast");
function DispensaryPage() {
    var toast = (0, use_toast_1.useToast)().toast;
    var _a = (0, react_1.useState)(''), searchQuery = _a[0], setSearchQuery = _a[1];
    var pendingDispensations = (0, react_1.useState)([
        {
            id: 'RX123456',
            patientName: 'John Doe',
            patientId: 'P-10542',
            medication: 'Atorvastatin',
            dosage: '20mg',
            quantity: '30 tablets',
            frequency: 'Once daily',
            doctor: 'Dr. Howard',
            date: 'Today, 10:30 AM',
            ward: 'ICU - Room 12',
            status: 'Ready to Dispense'
        },
        {
            id: 'RX123457',
            patientName: 'Sarah Miller',
            patientId: 'P-10398',
            medication: 'Metformin',
            dosage: '500mg',
            quantity: '60 tablets',
            frequency: 'Twice daily',
            doctor: 'Dr. Patel',
            date: 'Today, 9:45 AM',
            ward: 'Endocrinology - Room 5',
            status: 'Ready to Dispense'
        },
        {
            id: 'RX123458',
            patientName: 'Robert Johnson',
            patientId: 'P-10687',
            medication: 'Amoxicillin',
            dosage: '500mg',
            quantity: '21 capsules',
            frequency: 'Three times daily for 7 days',
            doctor: 'Dr. Garcia',
            date: 'Today, 9:15 AM',
            ward: 'General Medicine - Room 23',
            status: 'Preparing'
        },
    ])[0];
    var dispensedItems = (0, react_1.useState)([
        {
            id: 'RX123455',
            patientName: 'Emily Wilson',
            patientId: 'P-10754',
            medication: 'Lisinopril',
            dosage: '10mg',
            quantity: '30 tablets',
            frequency: 'Once daily',
            doctor: 'Dr. Williams',
            dispensedDate: 'Today, 8:30 AM',
            dispensedBy: 'Jane Pharmacist'
        },
        {
            id: 'RX123454',
            patientName: 'Michael Davis',
            patientId: 'P-10892',
            medication: 'Albuterol',
            dosage: '90mcg',
            quantity: '1 inhaler',
            frequency: 'As needed',
            doctor: 'Dr. Martinez',
            dispensedDate: 'Yesterday, 4:15 PM',
            dispensedBy: 'Jane Pharmacist'
        }
    ])[0];
    var handleSearch = function (e) {
        e.preventDefault();
        toast({
            title: "Searching dispensary",
            description: "Query: ".concat(searchQuery),
        });
    };
    var markAsDispensed = function (id) {
        toast({
            title: "Prescription Dispensed",
            description: "Prescription ".concat(id, " has been marked as dispensed"),
            variant: "default",
        });
    };
    var getStatusIcon = function (status) {
        switch (status) {
            case 'Ready to Dispense':
                return <lucide_react_1.Check size={16} className="text-green-500 mr-2"/>;
            case 'Preparing':
                return <lucide_react_1.Clock size={16} className="text-orange-500 mr-2"/>;
            default:
                return null;
        }
    };
    var filteredPendingItems = pendingDispensations.filter(function (item) {
        if (searchQuery) {
            var query = searchQuery.toLowerCase();
            return (item.patientName.toLowerCase().includes(query) ||
                item.id.toLowerCase().includes(query) ||
                item.medication.toLowerCase().includes(query) ||
                item.patientId.toLowerCase().includes(query));
        }
        return true;
    });
    var filteredDispensedItems = dispensedItems.filter(function (item) {
        if (searchQuery) {
            var query = searchQuery.toLowerCase();
            return (item.patientName.toLowerCase().includes(query) ||
                item.id.toLowerCase().includes(query) ||
                item.medication.toLowerCase().includes(query) ||
                item.patientId.toLowerCase().includes(query));
        }
        return true;
    });
    return (<div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dispensary</h1>
        <p className="text-gray-600">Prepare and dispense medications to patients</p>
      </div>
      
      <card_1.Card className="mb-6">
        <card_1.CardHeader className="pb-2">
          <card_1.CardTitle>Search Prescriptions</card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent>
          <form onSubmit={handleSearch}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <lucide_react_1.Search size={18} className="text-gray-500"/>
              </div>
              <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white" placeholder="Search by prescription ID, patient name or medication..." value={searchQuery} onChange={function (e) { return setSearchQuery(e.target.value); }}/>
            </div>
          </form>
        </card_1.CardContent>
      </card_1.Card>
      
      <tabs_1.Tabs defaultValue="pending" className="w-full">
        <tabs_1.TabsList className="grid grid-cols-2 mb-6">
          <tabs_1.TabsTrigger value="pending" className="text-center py-2">
            Pending ({pendingDispensations.length})
          </tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="dispensed" className="text-center py-2">
            Recently Dispensed
          </tabs_1.TabsTrigger>
        </tabs_1.TabsList>
        
        <tabs_1.TabsContent value="pending">
          <card_1.Card>
            <card_1.CardContent className="p-0">
              <div className="overflow-x-auto">
                <table_1.Table>
                  <table_1.TableHeader>
                    <table_1.TableRow>
                      <table_1.TableHead>Rx ID</table_1.TableHead>
                      <table_1.TableHead>Patient</table_1.TableHead>
                      <table_1.TableHead>Medication</table_1.TableHead>
                      <table_1.TableHead>Doctor</table_1.TableHead>
                      <table_1.TableHead>Quantity</table_1.TableHead>
                      <table_1.TableHead>Status</table_1.TableHead>
                      <table_1.TableHead>Actions</table_1.TableHead>
                    </table_1.TableRow>
                  </table_1.TableHeader>
                  <table_1.TableBody>
                    {filteredPendingItems.length === 0 ? (<table_1.TableRow>
                        <table_1.TableCell colSpan={7} className="text-center py-4">
                          No pending prescriptions found
                        </table_1.TableCell>
                      </table_1.TableRow>) : (filteredPendingItems.map(function (item) { return (<table_1.TableRow key={item.id}>
                          <table_1.TableCell className="font-medium">{item.id}</table_1.TableCell>
                          <table_1.TableCell>
                            <div>
                              <div className="font-medium">{item.patientName}</div>
                              <div className="text-xs text-gray-500">{item.patientId} • {item.ward}</div>
                            </div>
                          </table_1.TableCell>
                          <table_1.TableCell>
                            <div>
                              <div className="font-medium">{item.medication} {item.dosage}</div>
                              <div className="text-xs text-gray-500">{item.quantity} • {item.frequency}</div>
                            </div>
                          </table_1.TableCell>
                          <table_1.TableCell>{item.doctor}</table_1.TableCell>
                          <table_1.TableCell>{item.quantity}</table_1.TableCell>
                          <table_1.TableCell>
                            <div className="flex items-center">
                              {getStatusIcon(item.status)}
                              <span className={item.status === 'Ready to Dispense' ? 'text-green-500' : 'text-orange-500'}>
                                {item.status}
                              </span>
                            </div>
                          </table_1.TableCell>
                          <table_1.TableCell>
                            <button_1.Button variant="outline" size="sm" className="mr-2" onClick={function () { return markAsDispensed(item.id); }} disabled={item.status !== 'Ready to Dispense'}>
                              <lucide_react_1.Check size={16} className="mr-1"/> Dispense
                            </button_1.Button>
                            <button_1.Button variant="outline" size="sm" className="text-gray-500">
                              View
                            </button_1.Button>
                          </table_1.TableCell>
                        </table_1.TableRow>); }))}
                  </table_1.TableBody>
                </table_1.Table>
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </tabs_1.TabsContent>
        
        <tabs_1.TabsContent value="dispensed">
          <card_1.Card>
            <card_1.CardContent className="p-0">
              <div className="overflow-x-auto">
                <table_1.Table>
                  <table_1.TableHeader>
                    <table_1.TableRow>
                      <table_1.TableHead>Rx ID</table_1.TableHead>
                      <table_1.TableHead>Patient</table_1.TableHead>
                      <table_1.TableHead>Medication</table_1.TableHead>
                      <table_1.TableHead>Doctor</table_1.TableHead>
                      <table_1.TableHead>Dispensed At</table_1.TableHead>
                      <table_1.TableHead>Dispensed By</table_1.TableHead>
                      <table_1.TableHead>Actions</table_1.TableHead>
                    </table_1.TableRow>
                  </table_1.TableHeader>
                  <table_1.TableBody>
                    {filteredDispensedItems.length === 0 ? (<table_1.TableRow>
                        <table_1.TableCell colSpan={7} className="text-center py-4">
                          No dispensed items found
                        </table_1.TableCell>
                      </table_1.TableRow>) : (filteredDispensedItems.map(function (item) { return (<table_1.TableRow key={item.id}>
                          <table_1.TableCell className="font-medium">{item.id}</table_1.TableCell>
                          <table_1.TableCell>
                            <div>
                              <div className="font-medium">{item.patientName}</div>
                              <div className="text-xs text-gray-500">{item.patientId}</div>
                            </div>
                          </table_1.TableCell>
                          <table_1.TableCell>
                            <div>
                              <div className="font-medium">{item.medication} {item.dosage}</div>
                              <div className="text-xs text-gray-500">{item.quantity} • {item.frequency}</div>
                            </div>
                          </table_1.TableCell>
                          <table_1.TableCell>{item.doctor}</table_1.TableCell>
                          <table_1.TableCell>{item.dispensedDate}</table_1.TableCell>
                          <table_1.TableCell>{item.dispensedBy}</table_1.TableCell>
                          <table_1.TableCell>
                            <button_1.Button variant="outline" size="sm">
                              View Details
                            </button_1.Button>
                          </table_1.TableCell>
                        </table_1.TableRow>); }))}
                  </table_1.TableBody>
                </table_1.Table>
              </div>
            </card_1.CardContent>
          </card_1.Card>
        </tabs_1.TabsContent>
      </tabs_1.Tabs>
    </div>);
}
