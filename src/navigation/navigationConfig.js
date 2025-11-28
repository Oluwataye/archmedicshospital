"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNavigationItems = exports.navigationItems = void 0;
var adminNavigation_1 = require("./adminNavigation");
var doctorNavigation_1 = require("./doctorNavigation");
var nurseNavigation_1 = require("./nurseNavigation");
var pharmacistNavigation_1 = require("./pharmacistNavigation");
var labtechNavigation_1 = require("./labtechNavigation");
var cashierNavigation_1 = require("./cashierNavigation");
var ehrNavigation_1 = require("./ehrNavigation");
exports.navigationItems = {
    admin: (0, adminNavigation_1.getAdminNavigation)(),
    doctor: (0, doctorNavigation_1.getDoctorNavigation)(),
    nurse: (0, nurseNavigation_1.getNurseNavigation)(),
    pharmacist: (0, pharmacistNavigation_1.getPharmacistNavigation)(),
    labtech: (0, labtechNavigation_1.getLabtechNavigation)(),
    cashier: (0, cashierNavigation_1.getCashierNavigation)(),
    ehr: (0, ehrNavigation_1.getEHRNavigation)(),
};
var getNavigationItems = function (role) {
    if (!role)
        return [];
    return exports.navigationItems[role] || [];
};
exports.getNavigationItems = getNavigationItems;
