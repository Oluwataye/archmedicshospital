"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MedicationPage;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var table_1 = require("@/components/ui/table");
var button_1 = require("@/components/ui/button");
var lucide_react_1 = require("lucide-react");
function MedicationPage() {
    var _a = (0, react_1.useState)([
        {
            id: 'M-1001',
            patientId: 'P-10542',
            patientName: 'Alice Johnson',
            room: '204',
            medication: 'Amoxicillin 500mg',
            route: 'Oral',
            schedule: 'Every 8 hours',
            nextDue: '10:30 AM',
            status: 'pending',
        },
        {
            id: 'M-1002',
            patientId: 'P-10398',
            patientName: 'Robert Brown',
            room: '210',
            medication: 'Insulin Regular 10 units',
            route: 'Subcutaneous',
            schedule: 'Before meals',
            nextDue: '11:00 AM',
            status: 'pending',
        },
        {
            id: 'M-1003',
            patientId: 'P-10687',
            patientName: 'Emily Wilson',
            room: '108',
            medication: 'Furosemide 20mg',
            route: 'Oral',
            schedule: 'Once daily',
            nextDue: '09:00 AM',
            status: 'completed',
        },
        {
            id: 'M-1004',
            patientId: 'P-10754',
            patientName: 'Michael Davis',
            room: '307',
            medication: 'Morphine 2mg',
            route: 'IV',
            schedule: 'Every 4 hours PRN',
            nextDue: '12:30 PM',
            status: 'pending',
        },
        {
            id: 'M-1005',
            patientId: 'P-10542',
            patientName: 'Alice Johnson',
            room: '204',
            medication: 'Aspirin 81mg',
            route: 'Oral',
            schedule: 'Once daily',
            nextDue: '09:00 AM',
            status: 'completed',
        },
    ]), medications = _a[0], setMedications = _a[1];
    var _b = (0, react_1.useState)(null), selectedMedication = _b[0], setSelectedMedication = _b[1];
    var _c = (0, react_1.useState)(false), showAdministerForm = _c[0], setShowAdministerForm = _c[1];
    var _d = (0, react_1.useState)({
        actualTime: '',
        notes: '',
    }), adminFormData = _d[0], setAdminFormData = _d[1];
    var handleInputChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value;
        setAdminFormData(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[name] = value, _a)));
        });
    };
    var handleAdminister = function (med) {
        setSelectedMedication(med);
        setShowAdministerForm(true);
        // Pre-populate the form with current time
        var now = new Date();
        var hours = now.getHours().toString().padStart(2, '0');
        var minutes = now.getMinutes().toString().padStart(2, '0');
        setAdminFormData({
            actualTime: "".concat(hours, ":").concat(minutes),
            notes: '',
        });
    };
    var handleSubmitAdminister = function (e) {
        e.preventDefault();
        // Update the medication status
        setMedications(function (prevMeds) { return prevMeds.map(function (med) {
            return med.id === selectedMedication.id
                ? __assign(__assign({}, med), { status: 'completed' }) : med;
        }); });
        // Reset form
        setSelectedMedication(null);
        setShowAdministerForm(false);
        setAdminFormData({
            actualTime: '',
            notes: '',
        });
        // Show confirmation (in a real app, this would be a toast notification)
        alert("Medication ".concat(selectedMedication.medication, " administered to ").concat(selectedMedication.patientName));
    };
    return (<div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Medication Administration</h1>
        <p className="text-gray-500">Track and administer scheduled medications</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <card_1.Card>
          <card_1.CardHeader>
            <card_1.CardTitle>Due Soon</card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="flex items-center justify-center p-6">
              <div className="text-center">
                <div className="rounded-full w-20 h-20 bg-yellow-100 text-yellow-600 flex items-center justify-center mx-auto mb-4">
                  <lucide_react_1.Clock className="h-10 w-10"/>
                </div>
                <p className="text-4xl font-bold">3</p>
                <p className="text-gray-500">Medications due within 30 minutes</p>
              </div>
            </div>
          </card_1.CardContent>
        </card_1.Card>

        <card_1.Card>
          <card_1.CardHeader>
            <card_1.CardTitle>Administered</card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="flex items-center justify-center p-6">
              <div className="text-center">
                <div className="rounded-full w-20 h-20 bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
                  <lucide_react_1.CheckCircle className="h-10 w-10"/>
                </div>
                <p className="text-4xl font-bold">
                  {medications.filter(function (med) { return med.status === 'completed'; }).length}
                </p>
                <p className="text-gray-500">Medications administered today</p>
              </div>
            </div>
          </card_1.CardContent>
        </card_1.Card>

        <card_1.Card>
          <card_1.CardHeader>
            <card_1.CardTitle>Issues</card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="flex items-center justify-center p-6">
              <div className="text-center">
                <div className="rounded-full w-20 h-20 bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                  <lucide_react_1.AlertTriangle className="h-10 w-10"/>
                </div>
                <p className="text-4xl font-bold">0</p>
                <p className="text-gray-500">Missed or delayed medications</p>
              </div>
            </div>
          </card_1.CardContent>
        </card_1.Card>
      </div>

      {showAdministerForm ? (<card_1.Card>
          <card_1.CardHeader>
            <card_1.CardTitle>Administer Medication</card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent>
            <form onSubmit={handleSubmitAdminister} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-md">
                <div>
                  <p className="text-sm font-medium text-gray-700">Patient</p>
                  <p className="text-base">{selectedMedication.patientName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Room</p>
                  <p className="text-base">{selectedMedication.room}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Medication</p>
                  <p className="text-base">{selectedMedication.medication}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Route</p>
                  <p className="text-base">{selectedMedication.route}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Scheduled Time</p>
                  <p className="text-base">{selectedMedication.nextDue}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Schedule</p>
                  <p className="text-base">{selectedMedication.schedule}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Actual Administration Time</label>
                <input type="time" name="actualTime" value={adminFormData.actualTime} onChange={handleInputChange} className="w-full p-2 border rounded-md" required/>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea name="notes" value={adminFormData.notes} onChange={handleInputChange} className="w-full p-2 border rounded-md h-24" placeholder="Document any relevant observations or patient reactions"></textarea>
              </div>

              <div className="flex justify-end gap-2">
                <button_1.Button variant="outline" type="button" onClick={function () {
                setSelectedMedication(null);
                setShowAdministerForm(false);
            }}>
                  Cancel
                </button_1.Button>
                <button_1.Button type="submit">
                  Confirm Administration
                </button_1.Button>
              </div>
            </form>
          </card_1.CardContent>
        </card_1.Card>) : (<card_1.Card>
          <card_1.CardHeader>
            <card_1.CardTitle>Medication Schedule</card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="overflow-x-auto">
              <table_1.Table>
                <table_1.TableHeader>
                  <table_1.TableRow>
                    <table_1.TableHead>Patient</table_1.TableHead>
                    <table_1.TableHead>Room</table_1.TableHead>
                    <table_1.TableHead>Medication</table_1.TableHead>
                    <table_1.TableHead>Route</table_1.TableHead>
                    <table_1.TableHead>Schedule</table_1.TableHead>
                    <table_1.TableHead>Next Due</table_1.TableHead>
                    <table_1.TableHead>Status</table_1.TableHead>
                    <table_1.TableHead>Action</table_1.TableHead>
                  </table_1.TableRow>
                </table_1.TableHeader>
                <table_1.TableBody>
                  {medications.map(function (med) { return (<table_1.TableRow key={med.id}>
                      <table_1.TableCell>{med.patientName}</table_1.TableCell>
                      <table_1.TableCell>{med.room}</table_1.TableCell>
                      <table_1.TableCell>{med.medication}</table_1.TableCell>
                      <table_1.TableCell>{med.route}</table_1.TableCell>
                      <table_1.TableCell>{med.schedule}</table_1.TableCell>
                      <table_1.TableCell>{med.nextDue}</table_1.TableCell>
                      <table_1.TableCell>
                        <div className={"px-2 py-1 rounded-full text-xs inline-block font-medium\n                          ".concat(med.status === 'completed' ? 'bg-green-100 text-green-600' :
                    med.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-red-100 text-red-600')}>
                          {med.status === 'completed' ? 'Administered' :
                    med.status === 'pending' ? 'Pending' : 'Missed'}
                        </div>
                      </table_1.TableCell>
                      <table_1.TableCell>
                        {med.status === 'pending' && (<button_1.Button size="sm" onClick={function () { return handleAdminister(med); }}>
                            Administer
                          </button_1.Button>)}
                        {med.status === 'completed' && (<button_1.Button size="sm" variant="outline">
                            View Details
                          </button_1.Button>)}
                      </table_1.TableCell>
                    </table_1.TableRow>); })}
                </table_1.TableBody>
              </table_1.Table>
            </div>
          </card_1.CardContent>
        </card_1.Card>)}
    </div>);
}
