"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var sonner_1 = require("sonner");
var healthRecordsService_1 = require("@/services/healthRecordsService");
var lucide_react_1 = require("lucide-react");
var tabs_1 = require("@/components/ui/tabs");
// Import refactored components
var PageHeader_1 = require("@/components/ehr/PageHeader");
var PatientSearchFilters_1 = require("@/components/ehr/PatientSearchFilters");
var PatientCardsList_1 = require("@/components/ehr/PatientCardsList");
var PatientInfoCard_1 = require("@/components/ehr/PatientInfoCard");
var PatientVitals_1 = require("@/components/ehr/PatientVitals");
var RecordTabs_1 = require("@/components/ehr/RecordTabs");
var RecordsTable_1 = require("@/components/ehr/RecordsTable");
var NewRecordForm_1 = require("@/components/ehr/NewRecordForm");
var VitalSignsTab_1 = require("@/components/ehr/VitalSignsTab");
var ProceduresTab_1 = require("@/components/ehr/ProceduresTab");
var AllergiesTab_1 = require("@/components/ehr/AllergiesTab");
var MedicalHistoryTab_1 = require("@/components/ehr/MedicalHistoryTab");
// Sample patients data
var patientsData = [
    {
        id: 'P-10237',
        name: 'John Smith',
        age: 42,
        gender: 'Male',
        dob: '10/15/1982',
        address: '123 Main St, Anytown, CA',
        phone: '(555) 123-4567',
        email: 'john.smith@email.com',
        status: 'Active',
        lastVisit: 'Apr 25, 2025',
        doctor: 'Dr. Johnson',
        records: 3
    },
    {
        id: 'P-10892',
        name: 'Emily Davis',
        age: 35,
        gender: 'Female',
        dob: '03/22/1990',
        address: '456 Oak Ave, Somewhere, CA',
        phone: '(555) 987-6543',
        email: 'emily.davis@email.com',
        status: 'Follow-up',
        lastVisit: 'Apr 22, 2025',
        doctor: 'Dr. Chen',
        records: 5
    },
    {
        id: 'P-10745',
        name: 'Michael Brown',
        age: 58,
        gender: 'Male',
        dob: '11/07/1966',
        address: '789 Pine Rd, Nowhere, CA',
        phone: '(555) 456-7890',
        email: 'michael.brown@email.com',
        status: 'New',
        lastVisit: 'Today',
        doctor: 'Dr. Wilson',
        records: 1
    },
];
// Sample vital signs data - this will be replaced by records from our service
var defaultVitalSigns = {
    bloodPressure: '120/80',
    heartRate: '72',
    temperature: '98.6',
    oxygenSaturation: '98',
    recordedTime: 'Today, 10:30 AM'
};
var PatientRecordsPage = function () {
    var _a = (0, react_1.useState)(''), searchTerm = _a[0], setSearchTerm = _a[1];
    var _b = (0, react_1.useState)('all'), department = _b[0], setDepartment = _b[1];
    var _c = (0, react_1.useState)('all'), patientStatus = _c[0], setPatientStatus = _c[1];
    var _d = (0, react_1.useState)(patientsData[0]), selectedPatient = _d[0], setSelectedPatient = _d[1];
    var _e = (0, react_1.useState)('all'), activeTab = _e[0], setActiveTab = _e[1];
    var _f = (0, react_1.useState)(false), isNewRecordFormOpen = _f[0], setIsNewRecordFormOpen = _f[1];
    var _g = (0, react_1.useState)([]), patientRecords = _g[0], setPatientRecords = _g[1];
    var _h = (0, react_1.useState)(defaultVitalSigns), vitalSigns = _h[0], setVitalSigns = _h[1];
    var _j = (0, react_1.useState)([]), allergies = _j[0], setAllergies = _j[1];
    var _k = (0, react_1.useState)([]), procedures = _k[0], setProcedures = _k[1];
    var _l = (0, react_1.useState)([]), medicalHistory = _l[0], setMedicalHistory = _l[1];
    // Load patient records when selected patient changes
    (0, react_1.useEffect)(function () {
        if (selectedPatient) {
            var records = healthRecordsService_1.healthRecordsService.getRecordsByPatient(selectedPatient.id);
            setPatientRecords(records);
            // Get vital signs records
            var vitals = healthRecordsService_1.healthRecordsService.getRecordsByType(selectedPatient.id, 'vital-signs');
            if (vitals.length > 0) {
                var latestVital = vitals[vitals.length - 1];
                setVitalSigns({
                    bloodPressure: latestVital.bloodPressure || defaultVitalSigns.bloodPressure,
                    heartRate: latestVital.heartRate || defaultVitalSigns.heartRate,
                    temperature: latestVital.temperature || defaultVitalSigns.temperature,
                    oxygenSaturation: latestVital.oxygenSaturation || defaultVitalSigns.oxygenSaturation,
                    recordedTime: latestVital.date ? new Date(latestVital.date).toLocaleString() : defaultVitalSigns.recordedTime
                });
            }
            else {
                setVitalSigns(defaultVitalSigns);
            }
            // Get allergies records
            var allergyRecords = healthRecordsService_1.healthRecordsService.getRecordsByType(selectedPatient.id, 'allergies');
            setAllergies(allergyRecords);
            // Get procedures records
            var procedureRecords = healthRecordsService_1.healthRecordsService.getRecordsByType(selectedPatient.id, 'procedures');
            setProcedures(procedureRecords);
            // Get medical history records
            var historyRecords = healthRecordsService_1.healthRecordsService.getRecordsByType(selectedPatient.id, 'history');
            setMedicalHistory(historyRecords);
        }
    }, [selectedPatient]);
    var handleSaveRecord = function (record) {
        var savedRecord = healthRecordsService_1.healthRecordsService.addRecord(record);
        // Update local state based on record type
        setPatientRecords(__spreadArray(__spreadArray([], patientRecords, true), [savedRecord], false));
        // Close the form
        setIsNewRecordFormOpen(false);
        // Refresh specific record type data
        if (record.recordType === 'vital-signs') {
            setVitalSigns({
                bloodPressure: record.bloodPressure || defaultVitalSigns.bloodPressure,
                heartRate: record.heartRate || defaultVitalSigns.heartRate,
                temperature: record.temperature || defaultVitalSigns.temperature,
                oxygenSaturation: record.oxygenSaturation || defaultVitalSigns.oxygenSaturation,
                recordedTime: new Date(record.date).toLocaleString()
            });
        }
        else if (record.recordType === 'allergies') {
            setAllergies(__spreadArray(__spreadArray([], allergies, true), [savedRecord], false));
        }
        else if (record.recordType === 'procedures') {
            setProcedures(__spreadArray(__spreadArray([], procedures, true), [savedRecord], false));
        }
        else if (record.recordType === 'history') {
            setMedicalHistory(__spreadArray(__spreadArray([], medicalHistory, true), [savedRecord], false));
        }
    };
    var handleNewRecordClick = function () {
        setIsNewRecordFormOpen(true);
    };
    var handleAddTabSpecificRecord = function () {
        setActiveTab("all");
        setIsNewRecordFormOpen(true);
    };
    return (<div className="space-y-6">
      <PageHeader_1.default onNewRecordClick={handleNewRecordClick}/>

      {/* Main Panel */}
      <card_1.Card>
        {/* Filters and Search */}
        <div className="p-4 border-b border-gray-200">
          <PatientSearchFilters_1.default searchTerm={searchTerm} setSearchTerm={setSearchTerm} department={department} setDepartment={setDepartment} patientStatus={patientStatus} setPatientStatus={setPatientStatus}/>
        </div>

        {/* Patient Records Content */}
        <div className="p-4">
          {isNewRecordFormOpen ? (<NewRecordForm_1.default patientId={selectedPatient.id} patientName={selectedPatient.name} onSave={handleSaveRecord} onCancel={function () { return setIsNewRecordFormOpen(false); }}/>) : (<>
              <RecordTabs_1.default activeTab={activeTab} onTabChange={setActiveTab}>
                {/* All Records Tab Content */}
                <tabs_1.TabsContent value="all" className="space-y-6">
                  {/* Patient Cards Grid */}
                  <PatientCardsList_1.default patients={patientsData} selectedPatient={selectedPatient} onSelectPatient={setSelectedPatient}/>

                  {/* Selected Patient Record Details */}
                  {selectedPatient && (<card_1.Card>
                      {/* Patient Header */}
                      <PatientInfoCard_1.default patient={selectedPatient} onEdit={function () { return sonner_1.toast.info("Edit patient information"); }} onPrint={function () { return sonner_1.toast.info("Print patient records"); }} onShare={function () { return sonner_1.toast.info("Share patient records"); }}/>

                      {/* Record Content */}
                      <card_1.CardContent className="p-4">
                        {/* Vital Signs Summary */}
                        <PatientVitals_1.default patientId={selectedPatient.id} patientName={selectedPatient.name} bloodPressure={vitalSigns.bloodPressure} heartRate={vitalSigns.heartRate} temperature={vitalSigns.temperature} oxygenSaturation={vitalSigns.oxygenSaturation} recordedTime={vitalSigns.recordedTime}/>

                        {/* Recent Records */}
                        <div className="mb-6">
                          <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                            <lucide_react_1.FileText className="h-5 w-5 text-blue-500 mr-2"/> Recent Records
                          </h4>
                          <RecordsTable_1.default records={patientRecords}/>
                        </div>
                      </card_1.CardContent>
                    </card_1.Card>)}
                </tabs_1.TabsContent>

                {/* Vital Signs Tab Content */}
                <tabs_1.TabsContent value="vital-signs">
                  <VitalSignsTab_1.default patientId={selectedPatient.id} patientName={selectedPatient.name} vitalSigns={vitalSigns} onAddRecordClick={handleAddTabSpecificRecord}/>
                </tabs_1.TabsContent>

                {/* Procedures Tab Content */}
                <tabs_1.TabsContent value="procedures">
                  <ProceduresTab_1.default patientId={selectedPatient.id} procedures={procedures} onAddRecordClick={handleAddTabSpecificRecord}/>
                </tabs_1.TabsContent>

                {/* Allergies Tab Content */}
                <tabs_1.TabsContent value="allergies">
                  <AllergiesTab_1.default allergies={allergies} onAddRecordClick={handleAddTabSpecificRecord}/>
                </tabs_1.TabsContent>

                {/* Medical History Tab Content */}
                <tabs_1.TabsContent value="history">
                  <MedicalHistoryTab_1.default medicalHistory={medicalHistory} onAddRecordClick={handleAddTabSpecificRecord}/>
                </tabs_1.TabsContent>
              </RecordTabs_1.default>
            </>)}
        </div>
      </card_1.Card>
    </div>);
};
exports.default = PatientRecordsPage;
