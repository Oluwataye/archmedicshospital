"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var PatientInfoCard = function (_a) {
    var patient = _a.patient;
    return (<div className="p-4 border rounded">
            <h2 className="text-xl">{patient === null || patient === void 0 ? void 0 : patient.name}</h2>
            <p>ID: {patient === null || patient === void 0 ? void 0 : patient.id}</p>
        </div>);
};
exports.default = PatientInfoCard;
