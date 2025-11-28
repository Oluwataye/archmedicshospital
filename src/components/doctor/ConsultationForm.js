"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var button_1 = require("@/components/ui/button");
var input_1 = require("@/components/ui/input");
var label_1 = require("@/components/ui/label");
var textarea_1 = require("@/components/ui/textarea");
var ConsultationForm = function (_a) {
    var patientName = _a.patientName, patientId = _a.patientId, onClose = _a.onClose;
    return (<form className="space-y-4">
            <div>
                <label_1.Label htmlFor="symptoms">Symptoms</label_1.Label>
                <textarea_1.Textarea id="symptoms" placeholder="Patient symptoms..."/>
            </div>
            <div>
                <label_1.Label htmlFor="diagnosis">Diagnosis</label_1.Label>
                <input_1.Input id="diagnosis" placeholder="Diagnosis..."/>
            </div>
            <button_1.Button type="submit">Save Consultation</button_1.Button>
        </form>);
};
exports.default = ConsultationForm;
