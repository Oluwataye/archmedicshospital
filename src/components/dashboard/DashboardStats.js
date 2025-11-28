"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var card_1 = require("@/components/ui/card");
var DashboardStats = function (_a) {
    var userRole = _a.userRole;
    return (<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <card_1.Card>
                <card_1.CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <card_1.CardTitle className="text-sm font-medium">Total Patients</card_1.CardTitle>
                </card_1.CardHeader>
                <card_1.CardContent>
                    <div className="text-2xl font-bold">0</div>
                </card_1.CardContent>
            </card_1.Card>
            {/* Add more stats as needed */}
        </div>);
};
exports.default = DashboardStats;
