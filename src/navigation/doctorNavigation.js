"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDoctorNavigation = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var getDoctorNavigation = function () { return [
    { name: 'Dashboard', icon: <lucide_react_1.LayoutDashboard size={20}/>, path: '/dashboard', isActive: true },
    { name: 'Consultations', icon: <lucide_react_1.FilePlus size={20}/>, path: '/consultations' },
    { name: 'Seen Patients', icon: <lucide_react_1.FileCheck size={20}/>, path: '/patients' },
    { name: 'Appointments', icon: <lucide_react_1.Calendar size={20}/>, path: '/appointments' },
    { name: 'Prescriptions', icon: <lucide_react_1.Pill size={20}/>, path: '/prescriptions' },
]; };
exports.getDoctorNavigation = getDoctorNavigation;
