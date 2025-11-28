"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceCodePicker = void 0;
var react_1 = require("react");
var nhisService_1 = require("@/services/nhisService");
var sonner_1 = require("sonner");
var lucide_react_1 = require("lucide-react");
var ServiceCodePicker = function (_a) {
    var onServiceSelect = _a.onServiceSelect, _b = _a.selectedServices, selectedServices = _b === void 0 ? [] : _b, hmoProviderId = _a.hmoProviderId;
    var _c = (0, react_1.useState)(''), searchQuery = _c[0], setSearchQuery = _c[1];
    var _d = (0, react_1.useState)(''), selectedCategory = _d[0], setSelectedCategory = _d[1];
    var _e = (0, react_1.useState)([]), serviceCodes = _e[0], setServiceCodes = _e[1];
    var _f = (0, react_1.useState)([]), filteredServices = _f[0], setFilteredServices = _f[1];
    var _g = (0, react_1.useState)([]), categories = _g[0], setCategories = _g[1];
    var _h = (0, react_1.useState)(true), loading = _h[0], setLoading = _h[1];
    var _j = (0, react_1.useState)(false), searching = _j[0], setSearching = _j[1];
    (0, react_1.useEffect)(function () {
        loadCategories();
        loadServiceCodes();
    }, []);
    (0, react_1.useEffect)(function () {
        filterServices();
    }, [searchQuery, selectedCategory, serviceCodes]);
    var loadCategories = function () { return __awaiter(void 0, void 0, void 0, function () {
        var cats, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, nhisService_1.default.getServiceCategories()];
                case 1:
                    cats = _a.sent();
                    setCategories(cats);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error loading categories:', error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var loadServiceCodes = function () { return __awaiter(void 0, void 0, void 0, function () {
        var codes, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    return [4 /*yield*/, nhisService_1.default.getServiceCodes({ is_active: true })];
                case 1:
                    codes = _a.sent();
                    setServiceCodes(codes);
                    return [3 /*break*/, 4];
                case 2:
                    error_2 = _a.sent();
                    console.error('Error loading service codes:', error_2);
                    sonner_1.toast.error('Failed to load service codes');
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var filterServices = function () {
        var filtered = __spreadArray([], serviceCodes, true);
        // Filter by category
        if (selectedCategory) {
            filtered = filtered.filter(function (s) { return s.category === selectedCategory; });
        }
        // Filter by search query
        if (searchQuery) {
            var query_1 = searchQuery.toLowerCase();
            filtered = filtered.filter(function (s) {
                return s.code.toLowerCase().includes(query_1) ||
                    s.description.toLowerCase().includes(query_1);
            });
        }
        setFilteredServices(filtered);
    };
    var handleSearch = function (query) { return __awaiter(void 0, void 0, void 0, function () {
        var results, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setSearchQuery(query);
                    if (!(query.length >= 2)) return [3 /*break*/, 5];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    setSearching(true);
                    return [4 /*yield*/, nhisService_1.default.searchServiceCodes(query)];
                case 2:
                    results = _a.sent();
                    setFilteredServices(results);
                    return [3 /*break*/, 5];
                case 3:
                    error_3 = _a.sent();
                    console.error('Error searching:', error_3);
                    return [3 /*break*/, 5];
                case 4:
                    setSearching(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var isServiceSelected = function (serviceId) {
        return selectedServices.some(function (s) { return s.id === serviceId; });
    };
    if (loading) {
        return (<div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>);
    }
    return (<div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <lucide_react_1.Search className="h-5 w-5 text-gray-400"/>
                </div>
                <input type="text" value={searchQuery} onChange={function (e) { return handleSearch(e.target.value); }} placeholder="Search by code or description..." className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"/>
                {searchQuery && (<button onClick={function () {
                setSearchQuery('');
                filterServices();
            }} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <lucide_react_1.X className="h-5 w-5 text-gray-400 hover:text-gray-600"/>
                    </button>)}
            </div>

            {/* Category Filter */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Category
                </label>
                <select value={selectedCategory} onChange={function (e) { return setSelectedCategory(e.target.value); }} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">All Categories</option>
                    {categories.map(function (category) { return (<option key={category} value={category}>
                            {category}
                        </option>); })}
                </select>
            </div>

            {/* Service List */}
            <div className="border border-gray-200 rounded-md max-h-96 overflow-y-auto">
                {filteredServices.length === 0 ? (<div className="p-8 text-center text-gray-500">
                        {searching ? (<div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                <span className="ml-2">Searching...</span>
                            </div>) : (<p>No services found</p>)}
                    </div>) : (<div className="divide-y divide-gray-200">
                        {filteredServices.map(function (service) {
                var selected = isServiceSelected(service.id);
                return (<div key={service.id} onClick={function () { return !selected && onServiceSelect(service); }} className={"p-4 cursor-pointer transition-colors ".concat(selected
                        ? 'bg-blue-50 border-l-4 border-blue-500'
                        : 'hover:bg-gray-50')}>
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2">
                                                <span className="font-mono text-sm font-semibold text-blue-600">
                                                    {service.code}
                                                </span>
                                                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                                                    {service.category}
                                                </span>
                                            </div>
                                            <p className="mt-1 text-sm text-gray-900">{service.description}</p>
                                            <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                                                <span>Base Tariff: ₦{service.base_tariff.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        {selected && (<div className="ml-4">
                                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500">
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                                                    </svg>
                                                </div>
                                            </div>)}
                                    </div>
                                </div>);
            })}
                    </div>)}
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-500 text-center">
                Showing {filteredServices.length} of {serviceCodes.length} services
            </div>
        </div>);
};
exports.ServiceCodePicker = ServiceCodePicker;
exports.default = exports.ServiceCodePicker;
