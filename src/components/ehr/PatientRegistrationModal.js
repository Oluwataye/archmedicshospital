"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var dialog_1 = require("@/components/ui/dialog");
var PatientRegistrationModal = function (_a) {
    var open = _a.open, onOpenChange = _a.onOpenChange, onSave = _a.onSave;
    return (<dialog_1.Dialog open={open} onOpenChange={onOpenChange}>
            <dialog_1.DialogTrigger asChild>
                <button_1.Button>Register Patient</button_1.Button>
            </dialog_1.DialogTrigger>
            <dialog_1.DialogContent>
                <dialog_1.DialogHeader>
                    <dialog_1.DialogTitle>Register New Patient</dialog_1.DialogTitle>
                </dialog_1.DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <label_1.Label htmlFor="name" className="text-right">Name</label_1.Label>
                        <input_1.Input id="name" className="col-span-3"/>
                    </div>
                </div>
                <button_1.Button onClick={function () { return onSave === null || onSave === void 0 ? void 0 : onSave({}); }}>Save</button_1.Button>
            </dialog_1.DialogContent>
        </dialog_1.Dialog>);
};
exports.default = PatientRegistrationModal;
