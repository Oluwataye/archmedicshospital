"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var tabs_1 = require("@/components/ui/tabs");
var RecordTabs = function (_a) {
    var activeTab = _a.activeTab, onTabChange = _a.onTabChange, children = _a.children;
    return (<tabs_1.Tabs value={activeTab} onValueChange={onTabChange}>
            <tabs_1.TabsList>
                <tabs_1.TabsTrigger value="all">All Records</tabs_1.TabsTrigger>
                <tabs_1.TabsTrigger value="vital-signs">Vital Signs</tabs_1.TabsTrigger>
                <tabs_1.TabsTrigger value="procedures">Procedures</tabs_1.TabsTrigger>
                <tabs_1.TabsTrigger value="allergies">Allergies</tabs_1.TabsTrigger>
                <tabs_1.TabsTrigger value="history">Medical History</tabs_1.TabsTrigger>
            </tabs_1.TabsList>
            {children}
        </tabs_1.Tabs>);
};
exports.default = RecordTabs;
