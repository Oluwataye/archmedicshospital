"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AlertsPage;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var tabs_1 = require("@/components/ui/tabs");
var use_toast_1 = require("@/hooks/use-toast");
var dropdown_menu_1 = require("@/components/ui/dropdown-menu");
function AlertsPage() {
    var toast = (0, use_toast_1.useToast)().toast;
    var _a = (0, react_1.useState)(''), searchQuery = _a[0], setSearchQuery = _a[1];
    var _b = (0, react_1.useState)('All'), alertTypeFilter = _b[0], setAlertTypeFilter = _b[1];
    var alerts = (0, react_1.useState)([
        {
            id: 'ALT001',
            type: 'Drug Interaction',
            severity: 'High',
            title: 'Warfarin + Aspirin Interaction',
            description: 'Increased risk of bleeding when these medications are used together',
            patients: ['John Doe (P-10542)'],
            medications: ['Warfarin 2mg', 'Aspirin 81mg'],
            dateDetected: '2025-05-02T10:15:00',
            resolved: false
        },
        {
            id: 'ALT002',
            type: 'Allergy',
            severity: 'Critical',
            title: 'Patient allergic to prescribed medication',
            description: 'Patient has documented allergy to penicillin but was prescribed amoxicillin',
            patients: ['Robert Johnson (P-10687)'],
            medications: ['Amoxicillin 500mg'],
            dateDetected: '2025-05-02T09:30:00',
            resolved: false
        },
        {
            id: 'ALT003',
            type: 'Dosage',
            severity: 'Medium',
            title: 'Dosage exceeds recommendation',
            description: 'Prescribed dosage exceeds maximum recommendation for patient weight',
            patients: ['Sarah Miller (P-10398)'],
            medications: ['Metformin 1000mg'],
            dateDetected: '2025-05-02T08:45:00',
            resolved: true
        },
        {
            id: 'ALT004',
            type: 'Drug Interaction',
            severity: 'Low',
            title: 'Potential minor interaction',
            description: 'Potential minor interaction between metoprolol and escitalopram',
            patients: ['Emily Wilson (P-10754)'],
            medications: ['Metoprolol 50mg', 'Escitalopram 10mg'],
            dateDetected: '2025-05-01T14:30:00',
            resolved: true
        },
        {
            id: 'ALT005',
            type: 'Duplicate Therapy',
            severity: 'Medium',
            title: 'Duplicate medication class',
            description: 'Patient is receiving two medications from the same therapeutic class',
            patients: ['Michael Davis (P-10892)'],
            medications: ['Lisinopril 10mg', 'Enalapril 5mg'],
            dateDetected: '2025-05-01T11:45:00',
            resolved: false
        }
    ])[0];
    var handleSearch = function (e) {
        e.preventDefault();
        toast({
            title: "Searching alerts",
            description: "Query: ".concat(searchQuery),
        });
    };
    var resolveAlert = function (id) {
        toast({
            title: "Alert Resolved",
            description: "Alert ".concat(id, " has been marked as resolved"),
            variant: "default",
        });
    };
    var dismissAlert = function (id) {
        toast({
            title: "Alert Dismissed",
            description: "Alert ".concat(id, " has been dismissed"),
            variant: "default",
        });
    };
    var getSeverityIcon = function (severity) {
        switch (severity) {
            case 'Critical':
                return <lucide_react_1.AlertOctagon size={16} className="text-red-500 mr-2"/>;
            case 'High':
                return <lucide_react_1.AlertTriangle size={16} className="text-orange-500 mr-2"/>;
            case 'Medium':
                return <lucide_react_1.AlertTriangle size={16} className="text-yellow-500 mr-2"/>;
            case 'Low':
                return <lucide_react_1.Info size={16} className="text-blue-500 mr-2"/>;
            default:
                return null;
        }
    };
    var getSeverityColor = function (severity) {
        switch (severity) {
            case 'Critical':
                return 'bg-red-100 text-red-800';
            case 'High':
                return 'bg-orange-100 text-orange-800';
            case 'Medium':
                return 'bg-yellow-100 text-yellow-800';
            case 'Low':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    var filteredAlerts = alerts.filter(function (alert) {
        // Filter by type
        if (alertTypeFilter !== 'All' && alert.type !== alertTypeFilter) {
            return false;
        }
        // Filter by search query
        if (searchQuery) {
            var query_1 = searchQuery.toLowerCase();
            return (alert.title.toLowerCase().includes(query_1) ||
                alert.description.toLowerCase().includes(query_1) ||
                alert.id.toLowerCase().includes(query_1) ||
                alert.patients.some(function (patient) { return patient.toLowerCase().includes(query_1); }) ||
                alert.medications.some(function (med) { return med.toLowerCase().includes(query_1); }));
        }
        return true;
    });
    var activeAlerts = filteredAlerts.filter(function (alert) { return !alert.resolved; });
    var resolvedAlerts = filteredAlerts.filter(function (alert) { return alert.resolved; });
    var formatDate = function (dateString) {
        var date = new Date(dateString);
        return date.toLocaleString();
    };
    return (<div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Interactions & Alerts</h1>
        <p className="text-gray-600">Manage medication interactions, allergies, and other clinical alerts</p>
      </div>
      
      <card_1.Card className="mb-6">
        <card_1.CardHeader className="pb-2">
          <card_1.CardTitle>Search & Filter Alerts</card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <lucide_react_1.Search size={18} className="text-gray-500"/>
                  </div>
                  <input type="text" className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white" placeholder="Search alerts..." value={searchQuery} onChange={function (e) { return setSearchQuery(e.target.value); }}/>
                </div>
              </form>
            </div>
            
            <div className="flex items-center">
              <span className="mr-2 text-gray-700">Alert Type:</span>
              <dropdown_menu_1.DropdownMenu>
                <dropdown_menu_1.DropdownMenuTrigger asChild>
                  <button_1.Button variant="outline" className="flex items-center">
                    {alertTypeFilter} <lucide_react_1.ChevronDown className="ml-2 h-4 w-4"/>
                  </button_1.Button>
                </dropdown_menu_1.DropdownMenuTrigger>
                <dropdown_menu_1.DropdownMenuContent>
                  <dropdown_menu_1.DropdownMenuItem onClick={function () { return setAlertTypeFilter('All'); }}>
                    All
                  </dropdown_menu_1.DropdownMenuItem>
                  <dropdown_menu_1.DropdownMenuSeparator />
                  <dropdown_menu_1.DropdownMenuItem onClick={function () { return setAlertTypeFilter('Drug Interaction'); }}>
                    Drug Interaction
                  </dropdown_menu_1.DropdownMenuItem>
                  <dropdown_menu_1.DropdownMenuItem onClick={function () { return setAlertTypeFilter('Allergy'); }}>
                    Allergy
                  </dropdown_menu_1.DropdownMenuItem>
                  <dropdown_menu_1.DropdownMenuItem onClick={function () { return setAlertTypeFilter('Dosage'); }}>
                    Dosage
                  </dropdown_menu_1.DropdownMenuItem>
                  <dropdown_menu_1.DropdownMenuItem onClick={function () { return setAlertTypeFilter('Duplicate Therapy'); }}>
                    Duplicate Therapy
                  </dropdown_menu_1.DropdownMenuItem>
                </dropdown_menu_1.DropdownMenuContent>
              </dropdown_menu_1.DropdownMenu>
            </div>
          </div>
        </card_1.CardContent>
      </card_1.Card>
      
      <tabs_1.Tabs defaultValue="active" className="w-full">
        <tabs_1.TabsList className="grid grid-cols-2 mb-6">
          <tabs_1.TabsTrigger value="active" className="text-center py-2">
            Active Alerts ({activeAlerts.length})
          </tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="resolved" className="text-center py-2">
            Resolved Alerts
          </tabs_1.TabsTrigger>
        </tabs_1.TabsList>
        
        <tabs_1.TabsContent value="active">
          {activeAlerts.length === 0 ? (<card_1.Card>
              <card_1.CardContent className="flex flex-col items-center justify-center py-12">
                <lucide_react_1.Check size={64} className="text-green-500 mb-4"/>
                <h3 className="text-xl font-semibold text-gray-800">No Active Alerts</h3>
                <p className="text-gray-500">There are no active alerts matching your criteria</p>
              </card_1.CardContent>
            </card_1.Card>) : (<div className="space-y-4">
              {activeAlerts.map(function (alert) { return (<card_1.Card key={alert.id} className="overflow-hidden">
                  <div className={"px-6 py-4 flex justify-between items-center border-b ".concat(alert.severity === 'Critical' ? 'bg-red-50' : alert.severity === 'High' ? 'bg-orange-50' : alert.severity === 'Medium' ? 'bg-yellow-50' : 'bg-blue-50')}>
                    <div className="flex items-center">
                      {getSeverityIcon(alert.severity)}
                      <span className="font-semibold">{alert.title}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={"px-2 py-1 rounded-full text-xs font-semibold ".concat(getSeverityColor(alert.severity))}>
                        {alert.severity} {alert.type}
                      </span>
                      <span className="text-xs text-gray-500">{formatDate(alert.dateDetected)}</span>
                    </div>
                  </div>
                  <card_1.CardContent className="pt-4">
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-700">Description</h4>
                      <p className="text-gray-600">{alert.description}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-700">Affected Patients</h4>
                        <ul className="list-disc pl-5 text-gray-600">
                          {alert.patients.map(function (patient, index) { return (<li key={index}>{patient}</li>); })}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-700">Medications</h4>
                        <ul className="list-disc pl-5 text-gray-600">
                          {alert.medications.map(function (med, index) { return (<li key={index}>{med}</li>); })}
                        </ul>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button_1.Button variant="outline" className="flex items-center" onClick={function () { return dismissAlert(alert.id); }}>
                        <lucide_react_1.X className="mr-1 h-4 w-4"/> Dismiss
                      </button_1.Button>
                      <button_1.Button className="flex items-center" onClick={function () { return resolveAlert(alert.id); }}>
                        <lucide_react_1.Check className="mr-1 h-4 w-4"/> Resolve
                      </button_1.Button>
                    </div>
                  </card_1.CardContent>
                </card_1.Card>); })}
            </div>)}
        </tabs_1.TabsContent>
        
        <tabs_1.TabsContent value="resolved">
          {resolvedAlerts.length === 0 ? (<card_1.Card>
              <card_1.CardContent className="flex flex-col items-center justify-center py-12">
                <lucide_react_1.Info size={64} className="text-blue-500 mb-4"/>
                <h3 className="text-xl font-semibold text-gray-800">No Resolved Alerts</h3>
                <p className="text-gray-500">There are no resolved alerts matching your criteria</p>
              </card_1.CardContent>
            </card_1.Card>) : (<div className="space-y-4">
              {resolvedAlerts.map(function (alert) { return (<card_1.Card key={alert.id} className="overflow-hidden opacity-75">
                  <div className="px-6 py-4 flex justify-between items-center border-b">
                    <div className="flex items-center">
                      {getSeverityIcon(alert.severity)}
                      <span className="font-semibold">{alert.title}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={"px-2 py-1 rounded-full text-xs font-semibold ".concat(getSeverityColor(alert.severity))}>
                        {alert.severity} {alert.type}
                      </span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">Resolved</span>
                      <span className="text-xs text-gray-500">{formatDate(alert.dateDetected)}</span>
                    </div>
                  </div>
                  <card_1.CardContent className="pt-4">
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-700">Description</h4>
                      <p className="text-gray-600">{alert.description}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-700">Affected Patients</h4>
                        <ul className="list-disc pl-5 text-gray-600">
                          {alert.patients.map(function (patient, index) { return (<li key={index}>{patient}</li>); })}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-700">Medications</h4>
                        <ul className="list-disc pl-5 text-gray-600">
                          {alert.medications.map(function (med, index) { return (<li key={index}>{med}</li>); })}
                        </ul>
                      </div>
                    </div>
                  </card_1.CardContent>
                </card_1.Card>); })}
            </div>)}
        </tabs_1.TabsContent>
      </tabs_1.Tabs>
    </div>);
}
