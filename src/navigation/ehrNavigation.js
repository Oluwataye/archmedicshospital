"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEHRNavigation = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var getEHRNavigation = function () { return [
    { name: 'Dashboard', icon: <lucide_react_1.LayoutDashboard size={20}/>, path: '/ehr', isActive: true },
    { name: 'Patient Records', icon: <lucide_react_1.FileText size={20}/>, path: '/ehr/records' },
    { name: 'Patient Management', icon: <lucide_react_1.Users size={20}/>, path: '/ehr/patients' },
    { name: 'Appointments', icon: <lucide_react_1.Calendar size={20}/>, path: '/ehr/appointments' },
    {
        name: 'Clinical Notes',
        icon: <lucide_react_1.NotebookPen size={20}/>,
        path: '/ehr/notes',
        children: [
            { name: 'Progress Notes', path: '/ehr/notes/progress' },
            { name: 'SOAP Notes', path: '/ehr/notes/soap' },
            { name: 'Discharge Notes', path: '/ehr/notes/discharge' },
        ]
    },
    { name: 'Lab Results', icon: <lucide_react_1.TestTube size={20}/>, path: '/ehr/lab-results' },
    { name: 'Imaging', icon: <lucide_react_1.FileText size={20}/>, path: '/ehr/imaging' },
    { name: 'Medications', icon: <lucide_react_1.Pill size={20}/>, path: '/ehr/medications' },
    {
        name: 'Reports & Analytics',
        icon: <lucide_react_1.BarChart2 size={20}/>,
        path: '/ehr/analytics',
        children: [
            { name: 'Patient Statistics', path: '/ehr/analytics/statistics' },
            { name: 'Disease Prevalence', path: '/ehr/analytics/disease' },
            { name: 'Treatment Outcomes', path: '/ehr/analytics/outcomes' },
        ]
    },
]; };
exports.getEHRNavigation = getEHRNavigation;
