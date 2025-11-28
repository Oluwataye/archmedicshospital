"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPharmacistNavigation = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var getPharmacistNavigation = function () { return [
    { name: 'Dashboard', icon: <lucide_react_1.LayoutDashboard size={20}/>, path: '/pharmacy', isActive: true },
    { name: 'Prescriptions', icon: <lucide_react_1.FileText size={20}/>, path: '/pharmacy/prescriptions' },
    { name: 'Drug Inventory', icon: <lucide_react_1.Package size={20}/>, path: '/pharmacy/inventory' },
    { name: 'Dispensary', icon: <lucide_react_1.PlusCircle size={20}/>, path: '/pharmacy/dispensary' },
    { name: 'Interactions & Alerts', icon: <lucide_react_1.AlertTriangle size={20}/>, path: '/pharmacy/alerts' },
    { name: 'Purchase Orders', icon: <lucide_react_1.ShoppingCart size={20}/>, path: '/pharmacy/orders' },
    { name: 'Sales', icon: <lucide_react_1.CreditCard size={20}/>, path: '/pharmacy/sales' },
    { name: 'Reports', icon: <lucide_react_1.BarChart3 size={20}/>, path: '/pharmacy/reports' },
]; };
exports.getPharmacistNavigation = getPharmacistNavigation;
