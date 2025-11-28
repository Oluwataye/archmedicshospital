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
exports.EligibilityChecker = void 0;
var react_1 = require("react");
var hmoService_1 = require("@/services/hmoService");
var sonner_1 = require("sonner");
var lucide_react_1 = require("lucide-react");
var EligibilityChecker = function (_a) {
    var _b;
    var patientId = _a.patientId, onEligibilityChecked = _a.onEligibilityChecked;
    var _c = (0, react_1.useState)(false), checking = _c[0], setChecking = _c[1];
    var _d = (0, react_1.useState)(null), result = _d[0], setResult = _d[1];
    var checkEligibility = function () { return __awaiter(void 0, void 0, void 0, function () {
        var eligibility, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setChecking(true);
                    return [4 /*yield*/, hmoService_1.default.verifyEligibility(patientId)];
                case 1:
                    eligibility = _a.sent();
                    setResult(eligibility);
                    if (onEligibilityChecked) {
                        onEligibilityChecked(eligibility);
                    }
                    if (eligibility.is_eligible) {
                        sonner_1.toast.success('Patient is eligible for HMO services');
                    }
                    else {
                        sonner_1.toast.warning(eligibility.message);
                    }
                    return [3 /*break*/, 4];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error checking eligibility:', error_1);
                    sonner_1.toast.error('Failed to check eligibility');
                    return [3 /*break*/, 4];
                case 3:
                    setChecking(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var getStatusIcon = function () {
        if (!result)
            return null;
        if (result.is_eligible) {
            return <lucide_react_1.CheckCircle className="w-6 h-6 text-green-500"/>;
        }
        else if (result.policy_status === 'expired') {
            return <lucide_react_1.XCircle className="w-6 h-6 text-red-500"/>;
        }
        else {
            return <lucide_react_1.AlertCircle className="w-6 h-6 text-yellow-500"/>;
        }
    };
    var getStatusColor = function () {
        if (!result)
            return 'gray';
        if (result.is_eligible)
            return 'green';
        if (result.policy_status === 'expired')
            return 'red';
        return 'yellow';
    };
    return (<div className="space-y-4">
            {/* Check Button */}
            <button onClick={checkEligibility} disabled={checking || !patientId} className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2">
                {checking ? (<>
                        <lucide_react_1.Loader className="w-4 h-4 animate-spin"/>
                        <span>Checking Eligibility...</span>
                    </>) : (<span>Check HMO Eligibility</span>)}
            </button>

            {/* Results */}
            {result && (<div className={"p-4 rounded-lg border-2 ".concat(result.is_eligible
                ? 'bg-green-50 border-green-200'
                : result.policy_status === 'expired'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-yellow-50 border-yellow-200')}>
                    {/* Status Header */}
                    <div className="flex items-center space-x-3 mb-4">
                        {getStatusIcon()}
                        <div>
                            <h3 className="font-semibold text-lg">
                                {result.is_eligible ? 'Eligible' : 'Not Eligible'}
                            </h3>
                            <p className="text-sm text-gray-600">{result.message}</p>
                        </div>
                    </div>

                    {/* HMO Details */}
                    {result.hmo_provider && (<div className="space-y-3">
                            <div className="border-t pt-3">
                                <h4 className="font-medium text-gray-900 mb-2">HMO Provider</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <span className="text-gray-600">Name:</span>
                                        <span className="ml-2 font-medium">{result.hmo_provider.name}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Code:</span>
                                        <span className="ml-2 font-medium">{result.hmo_provider.code}</span>
                                    </div>
                                    {result.hmo_provider.contact_phone && (<div>
                                            <span className="text-gray-600">Phone:</span>
                                            <span className="ml-2 font-medium">
                                                {result.hmo_provider.contact_phone}
                                            </span>
                                        </div>)}
                                    {result.hmo_provider.contact_email && (<div>
                                            <span className="text-gray-600">Email:</span>
                                            <span className="ml-2 font-medium">
                                                {result.hmo_provider.contact_email}
                                            </span>
                                        </div>)}
                                </div>
                            </div>

                            {/* Package Details */}
                            {result.package && (<div className="border-t pt-3">
                                    <h4 className="font-medium text-gray-900 mb-2">Coverage Package</h4>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <span className="text-gray-600">Package:</span>
                                            <span className="ml-2 font-medium">{result.package.package_name}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Annual Limit:</span>
                                            <span className="ml-2 font-medium">
                                                ₦{(_b = result.package.annual_limit) === null || _b === void 0 ? void 0 : _b.toLocaleString()}
                                            </span>
                                        </div>
                                        {result.package.copay_percentage && (<div>
                                                <span className="text-gray-600">Co-pay:</span>
                                                <span className="ml-2 font-medium">
                                                    {result.package.copay_percentage}%
                                                </span>
                                            </div>)}
                                        {result.coverage_remaining !== undefined && (<div>
                                                <span className="text-gray-600">Remaining:</span>
                                                <span className="ml-2 font-medium">
                                                    ₦{result.coverage_remaining.toLocaleString()}
                                                </span>
                                            </div>)}
                                    </div>
                                </div>)}

                            {/* Policy Status */}
                            <div className="border-t pt-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Policy Status:</span>
                                    <span className={"px-3 py-1 rounded-full text-xs font-medium ".concat(result.policy_status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : result.policy_status === 'expired'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800')}>
                                        {result.policy_status.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>)}

                    {/* Not Enrolled Message */}
                    {result.policy_status === 'not_enrolled' && (<div className="mt-3 p-3 bg-white rounded border border-gray-200">
                            <p className="text-sm text-gray-700">
                                This patient is not currently enrolled in any HMO plan. Please enroll the
                                patient before proceeding with HMO services.
                            </p>
                        </div>)}
                </div>)}
        </div>);
};
exports.EligibilityChecker = EligibilityChecker;
exports.default = exports.EligibilityChecker;
