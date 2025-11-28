"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnhancedPatientCard = EnhancedPatientCard;
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var badge_1 = require("@/components/ui/badge");
var button_1 = require("@/components/ui/button");
var lucide_react_1 = require("lucide-react");
function EnhancedPatientCard(_a) {
    var patient = _a.patient, onViewChart = _a.onViewChart, onNewRecord = _a.onNewRecord;
    var getStatusColor = function (status) {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-800 border-green-200';
            case 'Follow-up': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'New': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'Discharged': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };
    var getVitalStatus = function (vital, type) {
        if (type === 'bloodPressure') {
            var systolic = String(vital).split('/').map(Number)[0];
            return systolic > 130 ? 'text-red-600' : 'text-green-600';
        }
        if (type === 'heartRate') {
            var hr = Number(vital);
            return hr > 100 || hr < 60 ? 'text-red-600' : 'text-green-600';
        }
        if (type === 'temperature') {
            var temp = Number(vital);
            return temp > 99.5 ? 'text-red-600' : 'text-green-600';
        }
        if (type === 'oxygenSat') {
            var o2 = Number(vital);
            return o2 < 95 ? 'text-red-600' : 'text-green-600';
        }
        return 'text-gray-600';
    };
    return (<card_1.Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500 bg-white">
      <card_1.CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <card_1.CardTitle className="text-lg font-semibold text-gray-900 mb-1">
              {patient.name}
            </card_1.CardTitle>
            <card_1.CardDescription className="text-sm text-gray-600">
              MRN: {patient.id} | {patient.age} years, {patient.gender}
            </card_1.CardDescription>
          </div>
          <badge_1.Badge className={"".concat(getStatusColor(patient.status), " font-medium border")}>
            {patient.status}
          </badge_1.Badge>
        </div>
      </card_1.CardHeader>
      
      <card_1.CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500 font-medium">Last visit:</span>
            <p className="font-semibold text-gray-900">{patient.lastVisit}</p>
          </div>
          <div>
            <span className="text-gray-500 font-medium">Records:</span>
            <p className="font-semibold text-gray-900">{patient.records} Records</p>
          </div>
        </div>
        
        {/* Enhanced Vital Signs Display */}
        {patient.vitals && (<div className="border-t pt-3">
            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
              <lucide_react_1.Activity className="w-4 h-4 mr-2 text-blue-600"/>
              Latest Vitals
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center space-x-2">
                <lucide_react_1.Heart className="w-3 h-3 text-red-500 flex-shrink-0"/>
                <div className="min-w-0">
                  <span className="text-gray-500">BP:</span>
                  <span className={"ml-1 font-semibold ".concat(getVitalStatus(patient.vitals.bloodPressure, 'bloodPressure'))}>
                    {patient.vitals.bloodPressure} mmHg
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <lucide_react_1.Activity className="w-3 h-3 text-blue-500 flex-shrink-0"/>
                <div className="min-w-0">
                  <span className="text-gray-500">HR:</span>
                  <span className={"ml-1 font-semibold ".concat(getVitalStatus(patient.vitals.heartRate, 'heartRate'))}>
                    {patient.vitals.heartRate} bpm
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <lucide_react_1.Thermometer className="w-3 h-3 text-orange-500 flex-shrink-0"/>
                <div className="min-w-0">
                  <span className="text-gray-500">Temp:</span>
                  <span className={"ml-1 font-semibold ".concat(getVitalStatus(patient.vitals.temperature, 'temperature'))}>
                    {patient.vitals.temperature}°F
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <lucide_react_1.Wind className="w-3 h-3 text-cyan-500 flex-shrink-0"/>
                <div className="min-w-0">
                  <span className="text-gray-500">O2:</span>
                  <span className={"ml-1 font-semibold ".concat(getVitalStatus(patient.vitals.oxygenSat, 'oxygenSat'))}>
                    {patient.vitals.oxygenSat}%
                  </span>
                </div>
              </div>
            </div>
          </div>)}
        
        <div className="flex space-x-2 pt-2">
          <button_1.Button size="sm" variant="outline" className="flex-1 hover:bg-gray-50" onClick={onViewChart}>
            View Chart
          </button_1.Button>
          <button_1.Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={onNewRecord}>
            New Record
          </button_1.Button>
        </div>
      </card_1.CardContent>
    </card_1.Card>);
}
exports.default = EnhancedPatientCard;
