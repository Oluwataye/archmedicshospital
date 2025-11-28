"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNurseNavigation = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var getNurseNavigation = function () { return [
    { name: 'Dashboard', icon: <lucide_react_1.LayoutDashboard size={20}/>, path: '/nurse', isActive: true },
    { name: 'Patients', icon: <lucide_react_1.User size={20}/>, path: '/nurse/patients' },
    { name: 'Vital Signs', icon: <lucide_react_1.Activity size={20}/>, path: '/nurse/vitals' },
    { name: 'Medication', icon: <lucide_react_1.Pill size={20}/>, path: '/nurse/medication' },
    { name: 'Tasks', icon: <lucide_react_1.ClipboardList size={20}/>, path: '/nurse/tasks' },
    { name: 'Wards', icon: <lucide_react_1.Users size={20}/>, path: '/nurse/wards' },
    { name: 'Alerts', icon: <lucide_react_1.AlertTriangle size={20}/>, path: '/nurse/alerts' },
    { name: 'Communication', icon: <lucide_react_1.MessageSquare size={20}/>, path: '/nurse/communication' },
]; };
exports.getNurseNavigation = getNurseNavigation;
