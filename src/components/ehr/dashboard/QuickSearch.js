"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var input_1 = require("@/components/ui/input");
var QuickSearch = function (_a) {
    var searchQuery = _a.searchQuery, setSearchQuery = _a.setSearchQuery;
    return (<div>
            <input_1.Input placeholder="Search patients..." className="w-[300px]"/>
        </div>);
};
exports.default = QuickSearch;
