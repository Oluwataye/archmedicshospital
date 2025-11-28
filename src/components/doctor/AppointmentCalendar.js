"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var calendar_1 = require("@/components/ui/calendar");
var AppointmentCalendar = function (_a) {
    var onSelectAppointment = _a.onSelectAppointment;
    var _b = react_1.default.useState(new Date()), date = _b[0], setDate = _b[1];
    return (<calendar_1.Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border"/>);
};
exports.default = AppointmentCalendar;
