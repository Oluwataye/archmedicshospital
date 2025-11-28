"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var FeaturedPatientVitals = function () {
    return (<card_1.Card>
            <card_1.CardHeader>
                <card_1.CardTitle>Recent Vitals</card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent>
                <p>No recent vitals recorded.</p>
            </card_1.CardContent>
        </card_1.Card>);
};
exports.default = FeaturedPatientVitals;
