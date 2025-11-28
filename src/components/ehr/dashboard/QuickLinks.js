"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var QuickLinks = function () {
    return (<card_1.Card>
            <card_1.CardHeader>
                <card_1.CardTitle>Quick Links</card_1.CardTitle>
            </card_1.CardHeader>
            <card_1.CardContent>
                <div className="grid gap-2">
                    {/* Add links here */}
                </div>
            </card_1.CardContent>
        </card_1.Card>);
};
exports.default = QuickLinks;
