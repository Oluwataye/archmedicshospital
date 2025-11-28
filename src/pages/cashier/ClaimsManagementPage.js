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
exports.default = ClaimsManagementPage;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var sonner_1 = require("sonner");
var claimsService_1 = require("@/services/claimsService");
var LoadingSpinner_1 = require("@/components/common/LoadingSpinner");
function ClaimsManagementPage() {
    var _this = this;
    var _a = (0, react_1.useState)([]), claims = _a[0], setClaims = _a[1];
    var _b = (0, react_1.useState)(null), statistics = _b[0], setStatistics = _b[1];
    var _c = (0, react_1.useState)(true), loading = _c[0], setLoading = _c[1];
    var _d = (0, react_1.useState)(''), searchQuery = _d[0], setSearchQuery = _d[1];
    var _e = (0, react_1.useState)('all'), statusFilter = _e[0], setStatusFilter = _e[1];
    (0, react_1.useEffect)(function () {
        loadClaims();
        loadStatistics();
    }, [statusFilter]);
    var loadClaims = function () { return __awaiter(_this, void 0, void 0, function () {
        var filters, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    filters = statusFilter !== 'all' ? { status: statusFilter } : undefined;
                    return [4 /*yield*/, claimsService_1.default.getClaims(filters)];
                case 1:
                    data = _a.sent();
                    setClaims(data);
                    return [3 /*break*/, 4];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error loading claims:', error_1);
                    sonner_1.toast.error('Failed to load claims');
                    return [3 /*break*/, 4];
                case 3:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var loadStatistics = function () { return __awaiter(_this, void 0, void 0, function () {
        var data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, claimsService_1.default.getClaimsStatistics()];
                case 1:
                    data = _a.sent();
                    setStatistics(data);
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error('Error loading statistics:', error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var handleSubmitClaim = function (claimId) { return __awaiter(_this, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, claimsService_1.default.submitClaim(claimId)];
                case 1:
                    _a.sent();
                    sonner_1.toast.success('Claim submitted successfully');
                    loadClaims();
                    loadStatistics();
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    console.error('Error submitting claim:', error_3);
                    sonner_1.toast.error('Failed to submit claim');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var filteredClaims = claims.filter(function (claim) {
        return claim.claim_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
            claim.patient_id.toLowerCase().includes(searchQuery.toLowerCase());
    });
    var getStatusBadge = function (status) {
        var styles = {
            pending: 'bg-yellow-100 text-yellow-800',
            submitted: 'bg-blue-100 text-blue-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
            paid: 'bg-purple-100 text-purple-800'
        };
        return styles[status] || 'bg-gray-100 text-gray-800';
    };
    if (loading && !statistics) {
        return <LoadingSpinner_1.default fullScreen/>;
    }
    return (<div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Claims Management</h1>
                    <p className="text-gray-500">Manage HMO claims and submissions</p>
                </div>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2 hover:bg-primary/90 transition-colors" onClick={function () { return sonner_1.toast.info('Create claim functionality - integrate with patient billing'); }}>
                    <lucide_react_1.Plus size={20}/>
                    New Claim
                </button>
            </div>

            {/* Statistics Cards */}
            {statistics && (<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <div className="text-sm text-gray-500">Total Claims</div>
                        <div className="text-2xl font-bold text-gray-900">{statistics.total_claims}</div>
                        <div className="text-xs text-gray-400 mt-1">₦{statistics.total_claim_amount.toLocaleString()}</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <div className="text-sm text-gray-500">Pending</div>
                        <div className="text-2xl font-bold text-yellow-600">{statistics.pending_claims}</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <div className="text-sm text-gray-500">Approved</div>
                        <div className="text-2xl font-bold text-green-600">{statistics.approved_claims}</div>
                        <div className="text-xs text-gray-400 mt-1">₦{statistics.total_approved_amount.toLocaleString()}</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <div className="text-sm text-gray-500">Paid</div>
                        <div className="text-2xl font-bold text-purple-600">{statistics.paid_claims}</div>
                        <div className="text-xs text-gray-400 mt-1">₦{statistics.total_paid_amount.toLocaleString()}</div>
                    </div>
                </div>)}

            <div className="bg-white rounded-lg border shadow-sm">
                <div className="p-4 border-b flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <lucide_react_1.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                        <input type="text" placeholder="Search by claim number or patient ID..." className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20" value={searchQuery} onChange={function (e) { return setSearchQuery(e.target.value); }}/>
                    </div>
                    <div className="flex items-center gap-2">
                        <lucide_react_1.Filter size={20} className="text-gray-400"/>
                        <select className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20" value={statusFilter} onChange={function (e) { return setStatusFilter(e.target.value); }}>
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="submitted">Submitted</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="paid">Paid</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Claim #</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Claim Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredClaims.length === 0 ? (<tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No claims found
                                    </td>
                                </tr>) : (filteredClaims.map(function (claim) { return (<tr key={claim.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{claim.claim_number}</td>
                                        <td className="px-6 py-4 text-gray-500">{claim.patient_id}</td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(claim.claim_date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-gray-900">
                                            ₦{claim.claim_amount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={"px-2 py-1 rounded-full text-xs font-medium ".concat(getStatusBadge(claim.status))}>
                                                {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-1 text-blue-600 hover:bg-blue-50 rounded" title="View Details" onClick={function () { return sonner_1.toast.info("View claim ".concat(claim.claim_number)); }}>
                                                    <lucide_react_1.Eye size={18}/>
                                                </button>
                                                {claim.status === 'pending' && (<button className="p-1 text-green-600 hover:bg-green-50 rounded" title="Submit Claim" onClick={function () { return handleSubmitClaim(claim.id); }}>
                                                        <lucide_react_1.Send size={18}/>
                                                    </button>)}
                                            </div>
                                        </td>
                                    </tr>); }))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>);
}
