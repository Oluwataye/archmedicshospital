"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = PatientsPage;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var card_1 = require("@/components/ui/card");
var table_1 = require("@/components/ui/table");
var button_1 = require("@/components/ui/button");
function PatientsPage() {
    var _a = (0, react_1.useState)('All'), filterStatus = _a[0], setFilterStatus = _a[1];
    var _b = (0, react_1.useState)(''), searchQuery = _b[0], setSearchQuery = _b[1];
    var patients = [
        { id: 'P-10542', name: 'Alice Johnson', age: 65, room: '204', diagnosis: 'Stroke', status: 'Critical', lastVitals: '10:15 AM' },
        { id: 'P-10398', name: 'Robert Brown', age: 52, room: '210', diagnosis: 'Diabetes', status: 'Stable', lastVitals: '09:45 AM' },
        { id: 'P-10687', name: 'Emily Wilson', age: 78, room: '108', diagnosis: 'Pneumonia', status: 'Recovering', lastVitals: '10:00 AM' },
        { id: 'P-10754', name: 'Michael Davis', age: 43, room: '307', diagnosis: 'Post-Op Care', status: 'Stable', lastVitals: '08:30 AM' },
        { id: 'P-10892', name: 'Sarah Miller', age: 32, room: '215', diagnosis: 'Pregnancy', status: 'Monitoring', lastVitals: '09:15 AM' },
    ];
    var filteredPatients = patients.filter(function (patient) {
        var matchesFilter = filterStatus === 'All' || patient.status === filterStatus;
        var matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            patient.id.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });
    return (<div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admitted Patients</h1>
        <p className="text-gray-500">View and manage patient information</p>
      </div>

      <card_1.Card className="mb-6">
        <card_1.CardHeader className="pb-2">
          <card_1.CardTitle>Patient Search & Filters</card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <lucide_react_1.Search className="h-5 w-5 text-gray-500"/>
              </div>
              <input type="text" placeholder="Search by name or ID..." className="pl-10 pr-4 py-2 w-full border rounded-md" value={searchQuery} onChange={function (e) { return setSearchQuery(e.target.value); }}/>
            </div>
            <div className="flex gap-2">
              <button_1.Button variant={filterStatus === 'All' ? "default" : "outline"} onClick={function () { return setFilterStatus('All'); }}>
                All
              </button_1.Button>
              <button_1.Button variant={filterStatus === 'Stable' ? "default" : "outline"} onClick={function () { return setFilterStatus('Stable'); }}>
                Stable
              </button_1.Button>
              <button_1.Button variant={filterStatus === 'Critical' ? "default" : "outline"} onClick={function () { return setFilterStatus('Critical'); }}>
                Critical
              </button_1.Button>
              <button_1.Button variant={filterStatus === 'Recovering' ? "default" : "outline"} onClick={function () { return setFilterStatus('Recovering'); }}>
                Recovering
              </button_1.Button>
            </div>
          </div>
        </card_1.CardContent>
      </card_1.Card>

      <card_1.Card>
        <card_1.CardHeader className="pb-2">
          <card_1.CardTitle>Patient List</card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="overflow-x-auto">
            <table_1.Table>
              <table_1.TableHeader>
                <table_1.TableRow>
                  <table_1.TableHead>Patient ID</table_1.TableHead>
                  <table_1.TableHead>Name</table_1.TableHead>
                  <table_1.TableHead>Age</table_1.TableHead>
                  <table_1.TableHead>Room</table_1.TableHead>
                  <table_1.TableHead>Diagnosis</table_1.TableHead>
                  <table_1.TableHead>Status</table_1.TableHead>
                  <table_1.TableHead>Last Vitals</table_1.TableHead>
                  <table_1.TableHead>Actions</table_1.TableHead>
                </table_1.TableRow>
              </table_1.TableHeader>
              <table_1.TableBody>
                {filteredPatients.length === 0 ? (<table_1.TableRow>
                    <table_1.TableCell colSpan={8} className="text-center py-4">
                      No patients found matching your criteria
                    </table_1.TableCell>
                  </table_1.TableRow>) : (filteredPatients.map(function (patient) { return (<table_1.TableRow key={patient.id}>
                      <table_1.TableCell>{patient.id}</table_1.TableCell>
                      <table_1.TableCell>{patient.name}</table_1.TableCell>
                      <table_1.TableCell>{patient.age}</table_1.TableCell>
                      <table_1.TableCell>{patient.room}</table_1.TableCell>
                      <table_1.TableCell>{patient.diagnosis}</table_1.TableCell>
                      <table_1.TableCell>
                        <div className={"px-2 py-1 rounded-full text-xs inline-block font-medium\n                          ".concat(patient.status === 'Critical' ? 'bg-red-100 text-red-600' :
                patient.status === 'Stable' ? 'bg-green-100 text-green-600' :
                    patient.status === 'Recovering' ? 'bg-blue-100 text-blue-600' :
                        'bg-yellow-100 text-yellow-600')}>
                          {patient.status}
                        </div>
                      </table_1.TableCell>
                      <table_1.TableCell>{patient.lastVitals}</table_1.TableCell>
                      <table_1.TableCell>
                        <div className="flex gap-2">
                          <button_1.Button variant="outline" size="sm">View</button_1.Button>
                          <button_1.Button variant="outline" size="sm">Record Vitals</button_1.Button>
                        </div>
                      </table_1.TableCell>
                    </table_1.TableRow>); }))}
              </table_1.TableBody>
            </table_1.Table>
          </div>
        </card_1.CardContent>
      </card_1.Card>
    </div>);
}
