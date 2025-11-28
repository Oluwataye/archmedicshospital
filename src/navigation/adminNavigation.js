"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminNavigation = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var getAdminNavigation = function () { return [
    { name: 'Dashboard', icon: <lucide_react_1.LayoutDashboard size={20}/>, path: '/dashboard', isActive: true },
    {
        name: 'Staff Management',
        icon: <lucide_react_1.Users size={20}/>,
        path: '/staff',
        children: [
            { name: 'All Staff', path: '/staff' },
            { name: 'Roles & Permissions', path: '/staff/roles' },
            { name: 'Schedule', path: '/staff/schedule' }
        ]
    },
    { name: 'Reports', icon: <lucide_react_1.FileText size={20}/>, path: '/reports' },
    { name: 'HMO Management', icon: <lucide_react_1.Shield size={20}/>, path: '/admin/hmo' },
    { name: 'Settings', icon: <lucide_react_1.Settings size={20}/>, path: '/settings' },
]; };
exports.getAdminNavigation = getAdminNavigation;
