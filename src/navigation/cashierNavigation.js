"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCashierNavigation = void 0;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var getCashierNavigation = function () { return [
    { name: 'Dashboard', icon: <lucide_react_1.LayoutDashboard size={20}/>, path: '/cashier', isActive: true },
    { name: 'Claims Management', icon: <lucide_react_1.FileCheck size={20}/>, path: '/cashier/claims' },
    { name: 'Pre-Authorization', icon: <lucide_react_1.Shield size={20}/>, path: '/cashier/preauth' },
    { name: 'Reports', icon: <lucide_react_1.FileText size={20}/>, path: '/cashier/reports' },
    { name: 'Receipt Reprint', icon: <lucide_react_1.RefreshCw size={20}/>, path: '/cashier/reprint' },
    { name: 'Refunds', icon: <lucide_react_1.ArrowRight size={20}/>, path: '/cashier/refunds' },
    { name: 'Billing', icon: <lucide_react_1.CreditCard size={20}/>, path: '/billing' },
    { name: 'Payments', icon: <lucide_react_1.CreditCard size={20}/>, path: '/payments' },
]; };
exports.getCashierNavigation = getCashierNavigation;
