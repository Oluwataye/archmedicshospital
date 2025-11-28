"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var input_1 = require("@/components/ui/input");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var tabs_1 = require("@/components/ui/tabs");
var lucide_react_1 = require("lucide-react");
// Mock patients data
var mockPatients = [
    {
        id: 'P1001',
        name: 'Jane Smith',
        age: 45,
        gender: 'Female',
        contact: '+234 801 234 5678',
        email: 'jane.smith@example.com',
        lastVisit: '2023-05-01',
        diagnoses: ['Hypertension', 'Type 2 Diabetes'],
        status: 'Active'
    },
    {
        id: 'P1002',
        name: 'Robert Johnson',
        age: 52,
        gender: 'Male',
        contact: '+234 802 345 6789',
        email: 'robert.johnson@example.com',
        lastVisit: null,
        diagnoses: [],
        status: 'New'
    },
    {
        id: 'P1003',
        name: 'Mary Williams',
        age: 68,
        gender: 'Female',
        contact: '+234 803 456 7890',
        email: 'mary.williams@example.com',
        lastVisit: '2023-04-15',
        diagnoses: ['Type 2 Diabetes', 'Osteoarthritis'],
        status: 'Active'
    },
    {
        id: 'P1004',
        name: 'David Brown',
        age: 37,
        gender: 'Male',
        contact: '+234 804 567 8901',
        email: 'david.brown@example.com',
        lastVisit: '2023-03-12',
        diagnoses: ['Post-surgical recovery - Appendectomy'],
        status: 'Active'
    },
    {
        id: 'P1005',
        name: 'Elizabeth Taylor',
        age: 41,
        gender: 'Female',
        contact: '+234 805 678 9012',
        email: 'elizabeth.taylor@example.com',
        lastVisit: null,
        diagnoses: [],
        status: 'New'
    },
    {
        id: 'P1006',
        name: 'Michael Davis',
        age: 29,
        gender: 'Male',
        contact: '+234 806 789 0123',
        email: 'michael.davis@example.com',
        lastVisit: '2023-04-28',
        diagnoses: ['Asthma', 'Seasonal allergies'],
        status: 'Active'
    },
    {
        id: 'P1007',
        name: 'Sarah Johnson',
        age: 33,
        gender: 'Female',
        contact: '+234 807 890 1234',
        email: 'sarah.johnson@example.com',
        lastVisit: '2023-02-15',
        diagnoses: ['Migraine', 'Anxiety'],
        status: 'Active'
    },
    {
        id: 'P1008',
        name: 'James Wilson',
        age: 58,
        gender: 'Male',
        contact: '+234 808 901 2345',
        email: 'james.wilson@example.com',
        lastVisit: '2023-04-05',
        diagnoses: ['Hypertension', 'Hyperlipidemia'],
        status: 'Active'
    }
];
var PatientsPage = function () {
    var _a = (0, react_1.useState)(''), searchTerm = _a[0], setSearchTerm = _a[1];
    var _b = (0, react_1.useState)(null), selectedPatient = _b[0], setSelectedPatient = _b[1];
    var _c = (0, react_1.useState)('all'), activeTab = _c[0], setActiveTab = _c[1];
    var filteredPatients = mockPatients.filter(function (patient) {
        // Apply tab filters
        if (activeTab === 'new' && patient.status !== 'New')
            return false;
        if (activeTab === 'active' && patient.status !== 'Active')
            return false;
        // Apply search filter
        if (searchTerm === '')
            return true;
        return (patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.id.toLowerCase().includes(searchTerm.toLowerCase()));
    });
    var handlePatientSelect = function (patient) {
        setSelectedPatient(patient);
    };
    return (<div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
        <button_1.Button>
          <lucide_react_1.Plus className="mr-2 h-4 w-4"/>
          New Patient
        </button_1.Button>
      </div>
      
      <div className="flex items-center">
        <div className="relative flex-1">
          <lucide_react_1.Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"/>
          <input_1.Input placeholder="Search patients by name or ID..." className="pl-8" value={searchTerm} onChange={function (e) { return setSearchTerm(e.target.value); }}/>
        </div>
      </div>
      
      <tabs_1.Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <tabs_1.TabsList>
          <tabs_1.TabsTrigger value="all">All Patients</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="active">Active</tabs_1.TabsTrigger>
          <tabs_1.TabsTrigger value="new">New</tabs_1.TabsTrigger>
        </tabs_1.TabsList>
        
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle>Patient List</card_1.CardTitle>
              <card_1.CardDescription>
                {filteredPatients.length} patients found
              </card_1.CardDescription>
            </card_1.CardHeader>
            <card_1.CardContent>
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                {filteredPatients.map(function (patient) { return (<div key={patient.id} className={"p-3 rounded-md cursor-pointer flex items-center justify-between border ".concat((selectedPatient === null || selectedPatient === void 0 ? void 0 : selectedPatient.id) === patient.id ? 'bg-medical-primary/10 border-medical-primary' : 'border-gray-200 hover:bg-gray-50')} onClick={function () { return handlePatientSelect(patient); }}>
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mr-3">
                        <lucide_react_1.User className="h-5 w-5 text-muted-foreground"/>
                      </div>
                      <div>
                        <h4 className="font-medium">{patient.name}</h4>
                        <div className="text-sm text-muted-foreground">ID: {patient.id}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">
                        {patient.age} yrs, {patient.gender}
                      </div>
                      <div>
                        <span className={"text-xs px-2 py-1 rounded-full ".concat(patient.status === 'New' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800')}>
                          {patient.status}
                        </span>
                      </div>
                    </div>
                  </div>); })}
                
                {filteredPatients.length === 0 && (<div className="flex flex-col items-center justify-center py-8 text-center">
                    <lucide_react_1.Search className="h-10 w-10 text-muted-foreground mb-3"/>
                    <h3 className="text-lg font-medium">No patients found</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Try adjusting your search or filters
                    </p>
                  </div>)}
              </div>
            </card_1.CardContent>
          </card_1.Card>
          
          <card_1.Card className="h-full">
            <card_1.CardHeader>
              <card_1.CardTitle>Patient Details</card_1.CardTitle>
              <card_1.CardDescription>
                Medical information and history
              </card_1.CardDescription>
            </card_1.CardHeader>
            <card_1.CardContent>
              {selectedPatient ? (<div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 rounded-full bg-medical-primary/20 flex items-center justify-center">
                      <lucide_react_1.User className="h-8 w-8 text-medical-primary"/>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{selectedPatient.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Patient ID: {selectedPatient.id}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Age:</span>
                      <p>{selectedPatient.age} years</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Gender:</span>
                      <p>{selectedPatient.gender}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Contact:</span>
                      <p>{selectedPatient.contact}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Email:</span>
                      <p>{selectedPatient.email}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Medical History</h4>
                      {selectedPatient.diagnoses.length > 0 ? (<ul className="list-disc list-inside space-y-1">
                          {selectedPatient.diagnoses.map(function (diagnosis, index) { return (<li key={index}>{diagnosis}</li>); })}
                        </ul>) : (<p className="text-sm text-muted-foreground">No medical history recorded</p>)}
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Last Visit</h4>
                      {selectedPatient.lastVisit ? (<div className="flex items-center">
                          <lucide_react_1.Calendar className="h-4 w-4 mr-2 text-muted-foreground"/>
                          {new Date(selectedPatient.lastVisit).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}
                        </div>) : (<p className="text-sm text-muted-foreground">No previous visits</p>)}
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-end space-x-2">
                    <button_1.Button variant="outline">Full Medical Record</button_1.Button>
                    <button_1.Button>Start Consultation</button_1.Button>
                  </div>
                </div>) : (<div className="flex h-[300px] flex-col items-center justify-center text-center">
                  <lucide_react_1.FileText className="h-10 w-10 text-muted-foreground mb-3"/>
                  <h3 className="text-lg font-medium">No patient selected</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Select a patient from the list to view their details
                  </p>
                </div>)}
            </card_1.CardContent>
          </card_1.Card>
        </div>
      </tabs_1.Tabs>
    </div>);
};
exports.default = PatientsPage;
