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
exports.usePatientManagement = void 0;
var react_1 = require("react");
var sonner_1 = require("sonner");
// Sample patient data
var patientsData = [
    {
        id: 'P-10237',
        name: 'John Smith',
        age: 42,
        gender: 'Male',
        contact: '(555) 123-4567',
        email: 'john.smith@example.com',
        address: '123 Main St, Cityville',
        dob: '1983-05-12',
        insurance: 'Blue Cross',
        status: 'Active',
        lastVisit: 'Apr 25, 2025'
    },
    {
        id: 'P-10892',
        name: 'Emily Davis',
        age: 35,
        gender: 'Female',
        contact: '(555) 987-6543',
        email: 'emily.davis@example.com',
        address: '456 Oak Ave, Townsville',
        dob: '1990-08-23',
        insurance: 'Aetna',
        status: 'Follow-up',
        lastVisit: 'Apr 22, 2025'
    },
    {
        id: 'P-10745',
        name: 'Michael Brown',
        age: 58,
        gender: 'Male',
        contact: '(555) 456-7890',
        email: 'michael.brown@example.com',
        address: '789 Pine Rd, Villagetown',
        dob: '1967-11-30',
        insurance: 'Medicare',
        status: 'New',
        lastVisit: 'Apr 27, 2025'
    },
    {
        id: 'P-10478',
        name: 'Sarah Johnson',
        age: 29,
        gender: 'Female',
        contact: '(555) 321-7654',
        email: 'sarah.johnson@example.com',
        address: '234 Elm St, Hamletville',
        dob: '1996-02-15',
        insurance: 'Cigna',
        status: 'Active',
        lastVisit: 'Apr 20, 2025'
    },
    {
        id: 'P-10356',
        name: 'David Wilson',
        age: 64,
        gender: 'Male',
        contact: '(555) 234-5678',
        email: 'david.wilson@example.com',
        address: '567 Maple Dr, Boroughville',
        dob: '1961-07-03',
        insurance: 'AARP',
        status: 'Discharged',
        lastVisit: 'Apr 15, 2025'
    },
    {
        id: 'P-10589',
        name: 'Jennifer Lee',
        age: 41,
        gender: 'Female',
        contact: '(555) 876-5432',
        email: 'jennifer.lee@example.com',
        address: '890 Cedar Ln, Districtville',
        dob: '1984-09-28',
        insurance: 'UnitedHealth',
        status: 'Active',
        lastVisit: 'Apr 23, 2025'
    }
];
var usePatientManagement = function () {
    var _a = (0, react_1.useState)(patientsData), patients = _a[0], setPatients = _a[1];
    var _b = (0, react_1.useState)(''), searchTerm = _b[0], setSearchTerm = _b[1];
    var _c = (0, react_1.useState)(''), statusFilter = _c[0], setStatusFilter = _c[1];
    var _d = (0, react_1.useState)(''), genderFilter = _d[0], setGenderFilter = _d[1];
    var _e = (0, react_1.useState)(null), selectedPatient = _e[0], setSelectedPatient = _e[1];
    // Filter patients based on search term and filters
    var filteredPatients = patients.filter(function (patient) {
        // Search by name, ID or email
        var matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.email.toLowerCase().includes(searchTerm.toLowerCase());
        // Filter by status
        var matchesStatus = statusFilter ? patient.status === statusFilter : true;
        // Filter by gender
        var matchesGender = genderFilter ? patient.gender === genderFilter : true;
        return matchesSearch && matchesStatus && matchesGender;
    });
    // Handle adding a new patient
    var handleNewPatientSave = function (data) {
        // Generate a new patient ID
        var newPatientId = "P-".concat(Math.floor(10000 + Math.random() * 90000));
        // Create a new patient object
        var newPatient = {
            id: newPatientId,
            name: data.name,
            age: parseInt(data.age),
            gender: data.gender,
            dob: data.dob,
            address: data.address,
            contact: data.phone,
            email: data.email,
            insurance: data.insurance || 'Not provided',
            status: data.status,
            lastVisit: 'Today'
        };
        // Add the new patient to the list
        setPatients(__spreadArray([newPatient], patients, true));
        // Show success message
        sonner_1.toast.success("Patient ".concat(data.name, " registered successfully with ID: ").concat(newPatientId));
    };
    // Handle patient deletion
    var handleDeletePatient = function (id) {
        setPatients(patients.filter(function (patient) { return patient.id !== id; }));
        sonner_1.toast.success("Patient ".concat(id, " removed successfully"));
    };
    // Handle patient edit
    var handleEditPatient = function (id) {
        sonner_1.toast.info("Edit patient ".concat(id, " details would open in a modal"));
    };
    // Handle export patient list
    var handleExportPatientList = function () {
        sonner_1.toast.success('Patient list exported successfully');
        // In a real app, this would generate a CSV or PDF
    };
    return {
        patients: patients,
        filteredPatients: filteredPatients,
        searchTerm: searchTerm,
        setSearchTerm: setSearchTerm,
        statusFilter: statusFilter,
        setStatusFilter: setStatusFilter,
        genderFilter: genderFilter,
        setGenderFilter: setGenderFilter,
        selectedPatient: selectedPatient,
        setSelectedPatient: setSelectedPatient,
        handleNewPatientSave: handleNewPatientSave,
        handleDeletePatient: handleDeletePatient,
        handleEditPatient: handleEditPatient,
        handleExportPatientList: handleExportPatientList
    };
};
exports.usePatientManagement = usePatientManagement;
