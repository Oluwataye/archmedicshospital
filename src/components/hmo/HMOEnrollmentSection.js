"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.default = HMOEnrollmentSection;
var react_1 = require("react");
var sonner_1 = require("sonner");
var hmoService_1 = require("@/services/hmoService");
function HMOEnrollmentSection(_a) {
    var _this = this;
    var formData = _a.formData, setFormData = _a.setFormData;
    var _b = (0, react_1.useState)([]), hmoProviders = _b[0], setHmoProviders = _b[1];
    var _c = (0, react_1.useState)([]), packages = _c[0], setPackages = _c[1];
    var _d = (0, react_1.useState)(false), loading = _d[0], setLoading = _d[1];
    (0, react_1.useEffect)(function () {
        loadHMOProviders();
    }, []);
    (0, react_1.useEffect)(function () {
        if (formData.hmo_provider_id) {
            loadPackages(formData.hmo_provider_id);
        }
        else {
            setPackages([]);
        }
    }, [formData.hmo_provider_id]);
    var loadHMOProviders = function () { return __awaiter(_this, void 0, void 0, function () {
        var data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, hmoService_1.default.getHMOProviders(true)];
                case 1:
                    data = _a.sent();
                    setHmoProviders(data);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error loading HMO providers:', error_1);
                    sonner_1.toast.error('Failed to load HMO providers');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var loadPackages = function (providerId) { return __awaiter(_this, void 0, void 0, function () {
        var data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    return [4 /*yield*/, hmoService_1.default.getHMOPackages(providerId)];
                case 1:
                    data = _a.sent();
                    setPackages(data);
                    return [3 /*break*/, 4];
                case 2:
                    error_2 = _a.sent();
                    console.error('Error loading packages:', error_2);
                    sonner_1.toast.error('Failed to load packages');
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <input type="checkbox" id="has_hmo" className="rounded border-gray-300 text-primary focus:ring-primary" checked={formData.has_hmo || false} onChange={function (e) {
            setFormData(__assign(__assign({}, formData), { has_hmo: e.target.checked, hmo_provider_id: e.target.checked ? formData.hmo_provider_id : '', hmo_package_id: '', nhis_enrollment_number: '', policy_start_date: '', policy_end_date: '', principal_member_id: '', relationship_to_principal: '' }));
        }}/>
                <label htmlFor="has_hmo" className="text-sm font-medium text-gray-700">
                    Enroll in HMO/NHIS
                </label>
            </div>

            {formData.has_hmo && (<>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">HMO Provider *</label>
                            <select className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary" value={formData.hmo_provider_id || ''} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { hmo_provider_id: e.target.value, hmo_package_id: '' })); }} required={formData.has_hmo}>
                                <option value="">Select HMO Provider</option>
                                {hmoProviders.map(function (provider) { return (<option key={provider.id} value={provider.id}>
                                        {provider.name} ({provider.code})
                                    </option>); })}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Service Package</label>
                            <select className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary" value={formData.hmo_package_id || ''} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { hmo_package_id: e.target.value })); }} disabled={!formData.hmo_provider_id || loading}>
                                <option value="">Select Package (Optional)</option>
                                {packages.map(function (pkg) { return (<option key={pkg.id} value={pkg.id}>
                                        {pkg.package_name} ({pkg.package_code})
                                    </option>); })}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">NHIS Enrollment Number</label>
                            <input type="text" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary" value={formData.nhis_enrollment_number || ''} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { nhis_enrollment_number: e.target.value })); }} placeholder="e.g., NHIS-12345678"/>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Relationship to Principal</label>
                            <select className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary" value={formData.relationship_to_principal || ''} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { relationship_to_principal: e.target.value })); }}>
                                <option value="">Select Relationship</option>
                                <option value="self">Self (Principal)</option>
                                <option value="spouse">Spouse</option>
                                <option value="child">Child</option>
                                <option value="parent">Parent</option>
                                <option value="dependent">Other Dependent</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Policy Start Date</label>
                            <input type="date" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary" value={formData.policy_start_date || ''} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { policy_start_date: e.target.value })); }}/>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Policy End Date</label>
                            <input type="date" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary" value={formData.policy_end_date || ''} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { policy_end_date: e.target.value })); }}/>
                        </div>

                        <div className="col-span-2 space-y-2">
                            <label className="text-sm font-medium text-gray-700">Principal Member ID (if dependent)</label>
                            <input type="text" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary" value={formData.principal_member_id || ''} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { principal_member_id: e.target.value })); }} placeholder="Leave empty if this is the principal member"/>
                        </div>
                    </div>
                </>)}
        </div>);
}
