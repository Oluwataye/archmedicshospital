"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var AppLayout = function () {
    return (<div className="min-h-screen bg-background">
            <main className="container mx-auto p-4">
                <react_router_dom_1.Outlet />
            </main>
        </div>);
};
exports.default = AppLayout;
