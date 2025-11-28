"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var PageHeader = function (props) {
    return (<div className="p-4 border-b">
            <h1 className="text-2xl font-bold">Patient Records</h1>
            <button onClick={props.onNewRecordClick} className="bg-blue-500 text-white px-4 py-2 rounded">New Record</button>
        </div>);
};
exports.default = PageHeader;
