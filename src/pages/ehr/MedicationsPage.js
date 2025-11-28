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
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var lucide_react_1 = require("lucide-react");
var select_1 = require("@/components/ui/select");
var sonner_1 = require("sonner");
var badge_1 = require("@/components/ui/badge");
var label_1 = require("@/components/ui/label");
var lucide_react_2 = require("lucide-react");
// Sample enhanced medications data with patient info
var medicationsData = [
    {
        id: 'MED-1024',
        patientId: 'P-10237',
        patientName: 'John Smith',
        medication: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        startDate: '2025-04-10',
        endDate: '2025-07-10',
        prescribedBy: 'Dr. Sarah Johnson',
        status: 'Active',
        instructions: 'Take in the morning with food',
        interactions: ['Potassium supplements', 'NSAIDs'],
        sideEffects: ['Cough', 'Dizziness']
    },
    {
        id: 'MED-1025',
        patientId: 'P-10237',
        patientName: 'John Smith',
        medication: 'Atorvastatin',
        dosage: '20mg',
        frequency: 'Once daily',
        startDate: '2025-04-10',
        endDate: '2025-10-10',
        prescribedBy: 'Dr. Sarah Johnson',
        status: 'Active',
        instructions: 'Take in the evening',
        interactions: ['Grapefruit juice', 'Erythromycin'],
        sideEffects: ['Muscle pain', 'Headache']
    },
    {
        id: 'MED-1026',
        patientId: 'P-10892',
        patientName: 'Emily Davis',
        medication: 'Metformin',
        dosage: '500mg',
        frequency: 'Twice daily',
        startDate: '2025-04-15',
        endDate: '2025-07-15',
        prescribedBy: 'Dr. Michael Brown',
        status: 'Active',
        instructions: 'Take with meals',
        interactions: ['Alcohol', 'Contrast dyes'],
        sideEffects: ['Nausea', 'Diarrhea']
    },
    {
        id: 'MED-1027',
        patientId: 'P-10745',
        patientName: 'Michael Brown',
        medication: 'Amoxicillin',
        dosage: '500mg',
        frequency: 'Every 8 hours',
        startDate: '2025-04-20',
        endDate: '2025-04-30',
        prescribedBy: 'Dr. James Wilson',
        status: 'Completed',
        instructions: 'Take until completed, even if feeling better',
        interactions: ['Alcohol'],
        sideEffects: ['Nausea', 'Diarrhea', 'Rash']
    },
    {
        id: 'MED-1028',
        patientId: 'P-10745',
        patientName: 'Michael Brown',
        medication: 'Prednisone',
        dosage: '20mg tapering',
        frequency: 'Once daily',
        startDate: '2025-04-22',
        endDate: '2025-05-12',
        prescribedBy: 'Dr. Anna Martinez',
        status: 'Active',
        instructions: 'Taper dose as directed',
        interactions: ['NSAIDs', 'Live vaccines'],
        sideEffects: ['Increased appetite', 'Mood changes', 'Insomnia']
    },
    {
        id: 'MED-1029',
        patientId: 'P-10239',
        patientName: 'Robert Wilson',
        medication: 'Furosemide',
        dosage: '40mg',
        frequency: 'Once daily',
        startDate: '2025-04-15',
        endDate: '2025-06-15',
        prescribedBy: 'Dr. Lisa Taylor',
        status: 'Discontinued',
        instructions: 'Take in the morning',
        interactions: ['Digoxin', 'Lithium'],
        sideEffects: ['Dehydration', 'Electrolyte imbalance']
    },
    {
        id: 'MED-1030',
        patientId: 'P-10237',
        patientName: 'John Smith',
        medication: 'Aspirin',
        dosage: '81mg',
        frequency: 'Once daily',
        startDate: '2025-03-10',
        endDate: '2025-06-10',
        prescribedBy: 'Dr. Sarah Johnson',
        status: 'Active',
        instructions: 'Take with food to minimize stomach irritation',
        interactions: ['Anticoagulants', 'NSAIDs'],
        sideEffects: ['Stomach upset', 'Easy bruising']
    },
    {
        id: 'MED-1031',
        patientId: 'P-10454',
        patientName: 'Sarah Thompson',
        medication: 'Levothyroxine',
        dosage: '50mcg',
        frequency: 'Once daily',
        startDate: '2025-01-05',
        endDate: '2025-07-05',
        prescribedBy: 'Dr. Jennifer Adams',
        status: 'Active',
        instructions: 'Take on empty stomach in the morning',
        interactions: ['Calcium supplements', 'Iron supplements'],
        sideEffects: ['Insomnia', 'Heart palpitations']
    }
];
var MedicationsPage = function () {
    var _a = (0, react_1.useState)(medicationsData), medications = _a[0], setMedications = _a[1];
    var _b = (0, react_1.useState)(''), searchTerm = _b[0], setSearchTerm = _b[1];
    var _c = (0, react_1.useState)('all'), statusFilter = _c[0], setStatusFilter = _c[1];
    var _d = (0, react_1.useState)('all'), doctorFilter = _d[0], setDoctorFilter = _d[1];
    var _e = (0, react_1.useState)({
        patientId: '',
        medication: '',
        dosage: '',
        frequency: '',
        instructions: ''
    }), newMedication = _e[0], setNewMedication = _e[1];
    var _f = (0, react_1.useState)(false), showAddForm = _f[0], setShowAddForm = _f[1];
    var _g = (0, react_1.useState)(null), viewMedicationDetails = _g[0], setViewMedicationDetails = _g[1];
    // Get all unique doctors for filter
    var uniqueDoctors = Array.from(new Set(medications.map(function (med) { return med.prescribedBy; })))
        .sort(function (a, b) { return a.localeCompare(b); });
    // Filter medications based on search term and filters
    var filteredMedications = medications.filter(function (med) {
        var matchesSearch = med.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            med.medication.toLowerCase().includes(searchTerm.toLowerCase()) ||
            med.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            med.prescribedBy.toLowerCase().includes(searchTerm.toLowerCase());
        var matchesStatus = statusFilter === 'all' ? true : med.status === statusFilter;
        var matchesDoctor = doctorFilter === 'all' ? true : med.prescribedBy === doctorFilter;
        return matchesSearch && matchesStatus && matchesDoctor;
    });
    // Get status badge color
    var getStatusBadge = function (status) {
        switch (status) {
            case 'Active':
                return {
                    color: 'bg-green-100 text-green-800',
                    icon: <lucide_react_1.CheckCircle className="h-3 w-3 mr-1"/>
                };
            case 'Completed':
                return {
                    color: 'bg-blue-100 text-blue-800',
                    icon: <lucide_react_1.CheckCircle className="h-3 w-3 mr-1"/>
                };
            case 'Discontinued':
                return {
                    color: 'bg-red-100 text-red-800',
                    icon: <lucide_react_1.X className="h-3 w-3 mr-1"/>
                };
            default:
                return {
                    color: 'bg-gray-100 text-gray-800',
                    icon: null
                };
        }
    };
    // Handle medication actions
    var handleEditMedication = function (id) {
        sonner_1.toast.info("Edit medication ".concat(id));
    };
    var handleDiscontinueMedication = function (id) {
        var updatedMedications = medications.map(function (med) {
            return med.id === id ? __assign(__assign({}, med), { status: 'Discontinued' }) : med;
        });
        setMedications(updatedMedications);
        sonner_1.toast.success("Medication ".concat(id, " discontinued successfully"));
    };
    var toggleMedicationDetails = function (id) {
        if (viewMedicationDetails === id) {
            setViewMedicationDetails(null);
        }
        else {
            setViewMedicationDetails(id);
        }
    };
    // Advanced search feature
    var handleAdvancedSearch = function () {
        sonner_1.toast.info("Advanced search functionality to be implemented");
    };
    // Export function for medications list
    var handleExportMedications = function () {
        sonner_1.toast.success("Medications list exported successfully");
    };
    var handleAddMedication = function () {
        var requiredFields = ['patientId', 'medication', 'dosage', 'frequency'];
        var missingFields = requiredFields.filter(function (field) { return !newMedication[field]; });
        if (missingFields.length > 0) {
            sonner_1.toast.error("Please fill in all required fields: ".concat(missingFields.join(', ')));
            return;
        }
        sonner_1.toast.success('Medication added successfully');
        setNewMedication({
            patientId: '',
            medication: '',
            dosage: '',
            frequency: '',
            instructions: ''
        });
        setShowAddForm(false);
    };
    // Get active vs. total medication count
    var activeMedicationsCount = medications.filter(function (med) { return med.status === 'Active'; }).length;
    return (<div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Medications Database</h1>
          <div className="text-sm text-gray-500 flex items-center mt-1">
            <span>Health Records</span>
            <span className="mx-2">›</span>
            <span className="text-blue-500">Medications</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button_1.Button variant="outline" onClick={handleExportMedications} className="flex items-center gap-2">
            <lucide_react_2.Download size={16}/>
            Export
          </button_1.Button>
          <button_1.Button onClick={function () { return setShowAddForm(!showAddForm); }} className="flex items-center gap-2">
            {showAddForm ? (<>
                <lucide_react_1.X className="h-4 w-4"/> Cancel
              </>) : (<>
                <lucide_react_1.PlusCircle className="h-4 w-4"/> Add Medication
              </>)}
          </button_1.Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <card_1.Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <card_1.CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">Total Medications</p>
              <p className="text-3xl font-bold text-blue-900">{medications.length}</p>
            </div>
            <div className="bg-blue-200 p-3 rounded-full">
              <lucide_react_1.Pill className="h-6 w-6 text-blue-700"/>
            </div>
          </card_1.CardContent>
        </card_1.Card>
        <card_1.Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <card_1.CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">Active Medications</p>
              <p className="text-3xl font-bold text-green-900">{activeMedicationsCount}</p>
            </div>
            <div className="bg-green-200 p-3 rounded-full">
              <lucide_react_1.CheckCircle className="h-6 w-6 text-green-700"/>
            </div>
          </card_1.CardContent>
        </card_1.Card>
        <card_1.Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <card_1.CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-800">Unique Patients</p>
              <p className="text-3xl font-bold text-yellow-900">
                {new Set(medications.map(function (m) { return m.patientId; })).size}
              </p>
            </div>
            <div className="bg-yellow-200 p-3 rounded-full">
              <lucide_react_1.User className="h-6 w-6 text-yellow-700"/>
            </div>
          </card_1.CardContent>
        </card_1.Card>
        <card_1.Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <card_1.CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-800">Unique Prescribers</p>
              <p className="text-3xl font-bold text-purple-900">{uniqueDoctors.length}</p>
            </div>
            <div className="bg-purple-200 p-3 rounded-full">
              <lucide_react_1.User className="h-6 w-6 text-purple-700"/>
            </div>
          </card_1.CardContent>
        </card_1.Card>
      </div>

      {/* Add Medication Form */}
      {showAddForm && (<card_1.Card>
          <card_1.CardContent className="pt-6">
            <h2 className="text-lg font-semibold mb-4">Add New Medication</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label_1.Label htmlFor="patient-id">Patient ID</label_1.Label>
                <input_1.Input id="patient-id" placeholder="Enter patient ID" value={newMedication.patientId} onChange={function (e) { return setNewMedication(__assign(__assign({}, newMedication), { patientId: e.target.value })); }}/>
              </div>
              <div>
                <label_1.Label htmlFor="medication">Medication</label_1.Label>
                <input_1.Input id="medication" placeholder="Enter medication name" value={newMedication.medication} onChange={function (e) { return setNewMedication(__assign(__assign({}, newMedication), { medication: e.target.value })); }}/>
              </div>
              <div>
                <label_1.Label htmlFor="dosage">Dosage</label_1.Label>
                <input_1.Input id="dosage" placeholder="Enter dosage" value={newMedication.dosage} onChange={function (e) { return setNewMedication(__assign(__assign({}, newMedication), { dosage: e.target.value })); }}/>
              </div>
              <div>
                <label_1.Label htmlFor="frequency">Frequency</label_1.Label>
                <select_1.Select value={newMedication.frequency} onValueChange={function (value) { return setNewMedication(__assign(__assign({}, newMedication), { frequency: value })); }}>
                  <select_1.SelectTrigger id="frequency">
                    <select_1.SelectValue placeholder="Select frequency"/>
                  </select_1.SelectTrigger>
                  <select_1.SelectContent>
                    <select_1.SelectItem value="Once daily">Once daily</select_1.SelectItem>
                    <select_1.SelectItem value="Twice daily">Twice daily</select_1.SelectItem>
                    <select_1.SelectItem value="Three times daily">Three times daily</select_1.SelectItem>
                    <select_1.SelectItem value="Four times daily">Four times daily</select_1.SelectItem>
                    <select_1.SelectItem value="Every 4 hours">Every 4 hours</select_1.SelectItem>
                    <select_1.SelectItem value="Every 6 hours">Every 6 hours</select_1.SelectItem>
                    <select_1.SelectItem value="Every 8 hours">Every 8 hours</select_1.SelectItem>
                    <select_1.SelectItem value="Every 12 hours">Every 12 hours</select_1.SelectItem>
                    <select_1.SelectItem value="As needed">As needed</select_1.SelectItem>
                  </select_1.SelectContent>
                </select_1.Select>
              </div>
              <div className="md:col-span-2">
                <label_1.Label htmlFor="instructions">Instructions</label_1.Label>
                <input_1.Input id="instructions" placeholder="Enter instructions for patient" value={newMedication.instructions} onChange={function (e) { return setNewMedication(__assign(__assign({}, newMedication), { instructions: e.target.value })); }}/>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button_1.Button onClick={handleAddMedication}>Add Medication</button_1.Button>
            </div>
          </card_1.CardContent>
        </card_1.Card>)}

      {/* Enhanced Filters and Search */}
      <card_1.Card>
        <card_1.CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative w-full md:w-64">
              <lucide_react_1.Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500"/>
              <input_1.Input placeholder="Search medications, patients, doctors..." className="pl-8" value={searchTerm} onChange={function (e) { return setSearchTerm(e.target.value); }}/>
            </div>
            <div className="w-full md:w-40">
              <select_1.Select value={statusFilter} onValueChange={setStatusFilter}>
                <select_1.SelectTrigger>
                  <select_1.SelectValue placeholder="Status"/>
                </select_1.SelectTrigger>
                <select_1.SelectContent>
                  <select_1.SelectItem value="all">All Status</select_1.SelectItem>
                  <select_1.SelectItem value="Active">Active</select_1.SelectItem>
                  <select_1.SelectItem value="Completed">Completed</select_1.SelectItem>
                  <select_1.SelectItem value="Discontinued">Discontinued</select_1.SelectItem>
                </select_1.SelectContent>
              </select_1.Select>
            </div>
            <div className="w-full md:w-60">
              <select_1.Select value={doctorFilter} onValueChange={setDoctorFilter}>
                <select_1.SelectTrigger>
                  <select_1.SelectValue placeholder="Prescriber"/>
                </select_1.SelectTrigger>
                <select_1.SelectContent>
                  <select_1.SelectItem value="all">All Prescribers</select_1.SelectItem>
                  {uniqueDoctors.map(function (doctor) { return (<select_1.SelectItem key={doctor} value={doctor}>{doctor}</select_1.SelectItem>); })}
                </select_1.SelectContent>
              </select_1.Select>
            </div>
            <div className="ml-auto">
              <button_1.Button variant="outline" onClick={handleAdvancedSearch} className="flex items-center gap-2">
                <lucide_react_2.Filter size={16}/>
                Advanced Filters
              </button_1.Button>
            </div>
          </div>

          {/* Medications List */}
          <div className="mt-6">
            {filteredMedications.length === 0 ? (<div className="text-center py-8 text-gray-500">
                No medications found matching your search criteria.
              </div>) : (<div className="space-y-4">
                {filteredMedications.map(function (med) { return (<card_1.Card key={med.id} className="overflow-hidden">
                    <div className="border-l-4 border-blue-500 hover:bg-gray-50">
                      <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <lucide_react_1.Pill className="h-5 w-5 text-blue-500"/>
                            <h3 className="font-semibold text-lg">{med.medication}</h3>
                            <span className={"px-2 py-1 rounded-full text-xs font-medium ".concat(getStatusBadge(med.status).color, " flex items-center")}>
                              {getStatusBadge(med.status).icon}
                              {med.status}
                            </span>
                          </div>
                          <div className="mt-1 text-sm text-gray-500">
                            <span>{med.dosage}, {med.frequency}</span>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2 text-sm">
                            <div className="flex items-center text-gray-600">
                              <lucide_react_1.User className="h-3.5 w-3.5 mr-1"/>
                              <span>{med.patientName}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <lucide_react_1.Calendar className="h-3.5 w-3.5 mr-1"/>
                              <span>{med.startDate} to {med.endDate}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <lucide_react_1.User className="h-3.5 w-3.5 mr-1"/>
                              <span>{med.prescribedBy}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <button_1.Button variant="ghost" size="sm" onClick={function () { return toggleMedicationDetails(med.id); }}>
                            {viewMedicationDetails === med.id ? 'Hide Details' : 'View Details'}
                          </button_1.Button>
                          <button_1.Button variant="ghost" size="icon" onClick={function () { return handleEditMedication(med.id); }} title="Edit medication">
                            <lucide_react_1.Edit className="h-4 w-4"/>
                          </button_1.Button>
                          {med.status === 'Active' && (<button_1.Button variant="ghost" size="icon" onClick={function () { return handleDiscontinueMedication(med.id); }} title="Discontinue medication" className="text-red-500 hover:text-red-700">
                              <lucide_react_1.Trash className="h-4 w-4"/>
                            </button_1.Button>)}
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {viewMedicationDetails === med.id && (<div className="p-4 bg-gray-50 border-t border-gray-100">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium mb-2">Instructions</h4>
                              <p className="text-sm text-gray-700">{med.instructions}</p>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Potential Interactions</h4>
                              <div className="flex flex-wrap gap-1">
                                {med.interactions.map(function (item, idx) { return (<badge_1.Badge key={idx} variant="outline" className="bg-yellow-50">{item}</badge_1.Badge>); })}
                              </div>
                              <h4 className="font-medium mb-2 mt-3">Possible Side Effects</h4>
                              <div className="flex flex-wrap gap-1">
                                {med.sideEffects.map(function (item, idx) { return (<badge_1.Badge key={idx} variant="outline" className="bg-red-50">{item}</badge_1.Badge>); })}
                              </div>
                            </div>
                          </div>
                        </div>)}
                    </div>
                  </card_1.Card>); })}
              </div>)}

            {/* Pagination */}
            {filteredMedications.length > 0 && (<div className="flex justify-between items-center mt-4 text-sm">
                <div className="text-gray-500">
                  Showing <span className="font-medium">1</span> to{" "}
                  <span className="font-medium">{filteredMedications.length}</span> of{" "}
                  <span className="font-medium">{filteredMedications.length}</span> medications
                </div>
                <div className="flex space-x-1">
                  <button_1.Button variant="outline" size="sm" disabled>Previous</button_1.Button>
                  <button_1.Button variant="outline" size="sm" className="bg-blue-50 border-blue-200">1</button_1.Button>
                  <button_1.Button variant="outline" size="sm" disabled>Next</button_1.Button>
                </div>
              </div>)}
          </div>
        </card_1.CardContent>
      </card_1.Card>
    </div>);
};
exports.default = MedicationsPage;
