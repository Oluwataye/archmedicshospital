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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HMOSelector = void 0;
var react_1 = require("react");
var hmoService_1 = require("@/services/hmoService");
var sonner_1 = require("sonner");
var HMOSelector = function (_a) {
    var selectedHMOId = _a.selectedHMOId, selectedPackageId = _a.selectedPackageId, onHMOChange = _a.onHMOChange, onPackageChange = _a.onPackageChange, _b = _a.disabled, disabled = _b === void 0 ? false : _b;
    var _c = (0, react_1.useState)([]), hmoProviders = _c[0], setHMOProviders = _c[1];
    var _d = (0, react_1.useState)([]), packages = _d[0], setPackages = _d[1];
    var _e = (0, react_1.useState)(true), loading = _e[0], setLoading = _e[1];
    var _f = (0, react_1.useState)(false), loadingPackages = _f[0], setLoadingPackages = _f[1];
    // Load HMO providers on mount
    (0, react_1.useEffect)(function () {
        loadHMOProviders();
    }, []);
    // Load packages when HMO is selected
    (0, react_1.useEffect)(function () {
        if (selectedHMOId) {
            loadPackages(selectedHMOId);
        }
        else {
            setPackages([]);
        }
    }, [selectedHMOId]);
    var loadHMOProviders = function () { return __awaiter(void 0, void 0, void 0, function () {
        var providers, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    return [4 /*yield*/, hmoService_1.default.getHMOProviders(true)];
                case 1:
                    providers = _a.sent();
                    setHMOProviders(providers);
                    return [3 /*break*/, 4];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error loading HMO providers:', error_1);
                    sonner_1.toast.error('Failed to load HMO providers');
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var loadPackages = function (hmoId) { return __awaiter(void 0, void 0, void 0, function () {
        var pkgs, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoadingPackages(true);
                    return [4 /*yield*/, hmoService_1.default.getHMOPackages(hmoId)];
                case 1:
                    pkgs = _a.sent();
                    setPackages(pkgs);
                    return [3 /*break*/, 4];
                case 2:
                    error_2 = _a.sent();
                    console.error('Error loading packages:', error_2);
                    sonner_1.toast.error('Failed to load HMO packages');
                    return [3 /*break*/, 4];
                case 3:
                    setLoadingPackages(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleHMOChange = function (e) {
        var hmoId = e.target.value;
        onHMOChange(hmoId);
        onPackageChange(''); // Reset package selection
    };
    var handlePackageChange = function (e) {
        onPackageChange(e.target.value);
    };
    if (loading) {
        return (<div className="space-y-4">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                </div>
            </div>);
    }
    return (<div className="space-y-4">
            {/* HMO Provider Selection */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    HMO Provider
                </label>
                <select value={selectedHMOId || ''} onChange={handleHMOChange} disabled={disabled} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed">
                    <option value="">Select HMO Provider</option>
                    {hmoProviders.map(function (hmo) { return (<option key={hmo.id} value={hmo.id}>
                            {hmo.name} ({hmo.code})
                        </option>); })}
                </select>
            </div>

            {/* Package Selection */}
            {selectedHMOId && (<div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Coverage Package
                    </label>
                    {loadingPackages ? (<div className="animate-pulse">
                            <div className="h-10 bg-gray-200 rounded"></div>
                        </div>) : (<select value={selectedPackageId || ''} onChange={handlePackageChange} disabled={disabled || packages.length === 0} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed">
                            <option value="">Select Package</option>
                            {packages.map(function (pkg) {
                    var _a;
                    return (<option key={pkg.id} value={pkg.id}>
                                    {pkg.package_name} - ₦{(_a = pkg.annual_limit) === null || _a === void 0 ? void 0 : _a.toLocaleString()} annual limit
                                </option>);
                })}
                        </select>)}
                    {!loadingPackages && packages.length === 0 && (<p className="mt-1 text-sm text-gray-500">
                            No packages available for this HMO
                        </p>)}
                </div>)}

            {/* Package Details */}
            {selectedPackageId && packages.length > 0 && (<div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                    {(function () {
                var _a;
                var selectedPackage = packages.find(function (p) { return p.id === selectedPackageId; });
                if (!selectedPackage)
                    return null;
                return (<div className="space-y-2">
                                <h4 className="font-semibold text-blue-900">Package Details</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <span className="text-gray-600">Annual Limit:</span>
                                        <span className="ml-2 font-medium">
                                            ₦{(_a = selectedPackage.annual_limit) === null || _a === void 0 ? void 0 : _a.toLocaleString()}
                                        </span>
                                    </div>
                                    {selectedPackage.copay_percentage && (<div>
                                            <span className="text-gray-600">Co-pay:</span>
                                            <span className="ml-2 font-medium">
                                                {selectedPackage.copay_percentage}%
                                            </span>
                                        </div>)}
                                </div>
                            </div>);
            })()}
                </div>)}
        </div>);
};
exports.HMOSelector = HMOSelector;
exports.default = exports.HMOSelector;
