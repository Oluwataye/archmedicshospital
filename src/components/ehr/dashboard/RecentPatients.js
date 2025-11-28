"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var RecentPatients = function (_a) {
    var patients = _a.patients, filteredPatients = _a.filteredPatients;
    return (<card_1.Card>
            <card_1.CardHeader>
                <card_1.CardTitle>Recent Patients</card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent>
                <p>No recent patients.</p>
            </card_1.CardContent>
        </card_1.Card>);
};
exports.default = RecentPatients;
