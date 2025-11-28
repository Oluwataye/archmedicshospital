"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLabtechNavigation = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var getLabtechNavigation = function () { return [
    { name: 'Dashboard', icon: <lucide_react_1.LayoutDashboard size={20}/>, path: '/lab', isActive: true },
    { name: 'Test Requests', icon: <lucide_react_1.FlaskConical size={20}/>, path: '/lab/requests' },
    {
        name: 'Results',
        icon: <lucide_react_1.FileText size={20}/>,
        path: '/lab/results',
        children: [
            { name: 'Pending Results', path: '/lab/results/pending' },
            { name: 'Completed Results', path: '/lab/results/completed' },
            { name: 'Critical Results', path: '/lab/results/critical' },
        ]
    },
    { name: 'Inventory', icon: <lucide_react_1.Boxes size={20}/>, path: '/lab/inventory' },
    { name: 'Quality Control', icon: <lucide_react_1.ClipboardCheck size={20}/>, path: '/lab/quality' },
    { name: 'Equipment', icon: <lucide_react_1.Microscope size={20}/>, path: '/lab/equipment' },
]; };
exports.getLabtechNavigation = getLabtechNavigation;
