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
exports.default = VitalsPage;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var table_1 = require("@/components/ui/table");
var button_1 = require("@/components/ui/button");
function VitalsPage() {
    var _a = (0, react_1.useState)(null), selectedPatient = _a[0], setSelectedPatient = _a[1];
    var _b = (0, react_1.useState)({
        temperature: '',
        pulse: '',
        respiration: '',
        bloodPressure: '',
        oxygenSat: '',
        painLevel: '',
        notes: '',
    }), formData = _b[0], setFormData = _b[1];
    var patients = [
        { id: 'P-10542', name: 'Alice Johnson', room: '204', lastVitalsTime: '10:15 AM' },
        { id: 'P-10398', name: 'Robert Brown', room: '210', lastVitalsTime: '09:45 AM' },
        { id: 'P-10687', name: 'Emily Wilson', room: '108', lastVitalsTime: '10:00 AM' },
        { id: 'P-10754', name: 'Michael Davis', room: '307', lastVitalsTime: '08:30 AM' },
        { id: 'P-10892', name: 'Sarah Miller', room: '215', lastVitalsTime: '09:15 AM' },
    ];
    var handleInputChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value;
        setFormData(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[name] = value, _a)));
        });
    };
    var handleSubmit = function (e) {
        e.preventDefault();
        // In a real app, this would save the vitals data to the server
        alert("Vitals recorded for patient ".concat(selectedPatient.name));
        // Reset form and selected patient after submission
        setFormData({
            temperature: '',
            pulse: '',
            respiration: '',
            bloodPressure: '',
            oxygenSat: '',
            painLevel: '',
            notes: '',
        });
        setSelectedPatient(null);
    };
    return (<div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Vital Signs Monitoring</h1>
        <p className="text-gray-500">Record and track patient vital signs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <card_1.Card>
          <card_1.CardHeader>
            <card_1.CardTitle>Select Patient</card_1.CardTitle>
          </card_1.CardHeader>
          <card_1.CardContent>
            <div className="overflow-x-auto">
              <table_1.Table>
                <table_1.TableHeader>
                  <table_1.TableRow>
                    <table_1.TableHead>Patient ID</table_1.TableHead>
                    <table_1.TableHead>Name</table_1.TableHead>
                    <table_1.TableHead>Room</table_1.TableHead>
                    <table_1.TableHead>Last Vitals</table_1.TableHead>
                    <table_1.TableHead>Action</table_1.TableHead>
                  </table_1.TableRow>
                </table_1.TableHeader>
                <table_1.TableBody>
                  {patients.map(function (patient) { return (<table_1.TableRow key={patient.id} className={(selectedPatient === null || selectedPatient === void 0 ? void 0 : selectedPatient.id) === patient.id ? 'bg-blue-50' : ''}>
                      <table_1.TableCell>{patient.id}</table_1.TableCell>
                      <table_1.TableCell>{patient.name}</table_1.TableCell>
                      <table_1.TableCell>{patient.room}</table_1.TableCell>
                      <table_1.TableCell>{patient.lastVitalsTime}</table_1.TableCell>
                      <table_1.TableCell>
                        <button_1.Button variant="outline" size="sm" onClick={function () { return setSelectedPatient(patient); }}>
                          Select
                        </button_1.Button>
                      </table_1.TableCell>
                    </table_1.TableRow>); })}
                </table_1.TableBody>
              </table_1.Table>
            </div>
          </card_1.CardContent>
        </card_1.Card>

        {selectedPatient ? (<card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle>Record Vitals: {selectedPatient.name}</card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°C)</label>
                    <input type="text" name="temperature" value={formData.temperature} onChange={handleInputChange} className="w-full p-2 border rounded-md" required/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pulse Rate (bpm)</label>
                    <input type="text" name="pulse" value={formData.pulse} onChange={handleInputChange} className="w-full p-2 border rounded-md" required/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Respiration Rate (bpm)</label>
                    <input type="text" name="respiration" value={formData.respiration} onChange={handleInputChange} className="w-full p-2 border rounded-md" required/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Blood Pressure (mmHg)</label>
                    <input type="text" name="bloodPressure" value={formData.bloodPressure} onChange={handleInputChange} className="w-full p-2 border rounded-md" placeholder="e.g. 120/80" required/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Oxygen Saturation (%)</label>
                    <input type="text" name="oxygenSat" value={formData.oxygenSat} onChange={handleInputChange} className="w-full p-2 border rounded-md" required/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pain Level (0-10)</label>
                    <input type="number" name="painLevel" min="0" max="10" value={formData.painLevel} onChange={handleInputChange} className="w-full p-2 border rounded-md" required/>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                  <textarea name="notes" value={formData.notes} onChange={handleInputChange} className="w-full p-2 border rounded-md h-24"></textarea>
                </div>
                <div className="flex justify-end">
                  <button_1.Button variant="outline" type="button" className="mr-2" onClick={function () { return setSelectedPatient(null); }}>
                    Cancel
                  </button_1.Button>
                  <button_1.Button type="submit">
                    Record Vitals
                  </button_1.Button>
                </div>
              </form>
            </card_1.CardContent>
          </card_1.Card>) : (<card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle>Record Vitals</card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent>
              <div className="flex flex-col items-center justify-center h-64">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                  </svg>
                </div>
                <p className="text-gray-500 text-center">Select a patient from the list to record vital signs</p>
              </div>
            </card_1.CardContent>
          </card_1.Card>)}
      </div>
    </div>);
}
