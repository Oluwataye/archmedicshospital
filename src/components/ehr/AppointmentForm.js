"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var AppointmentForm = function (_a) {
    var open = _a.open, onOpenChange = _a.onOpenChange, onSubmit = _a.onSubmit;
    return (<form className="space-y-4">
            <div>
                <label_1.Label htmlFor="date">Date</label_1.Label>
                <input_1.Input id="date" type="date"/>
            </div>
            <button_1.Button type="submit">Schedule Appointment</button_1.Button>
        </form>);
};
exports.default = AppointmentForm;
