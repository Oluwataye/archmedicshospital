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
exports.default = HMOManagementPage;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var sonner_1 = require("sonner");
var hmoService_1 = require("@/services/hmoService");
var LoadingSpinner_1 = require("@/components/common/LoadingSpinner");
var HMOProviderModal_1 = require("@/components/hmo/HMOProviderModal");
var HMOProviderDetails_1 = require("@/components/hmo/HMOProviderDetails");
function HMOManagementPage() {
    var _this = this;
    var _a = (0, react_1.useState)([]), providers = _a[0], setProviders = _a[1];
    var _b = (0, react_1.useState)(true), loading = _b[0], setLoading = _b[1];
    var _c = (0, react_1.useState)(''), searchQuery = _c[0], setSearchQuery = _c[1];
    var _d = (0, react_1.useState)(false), isModalOpen = _d[0], setIsModalOpen = _d[1];
    var _e = (0, react_1.useState)(undefined), selectedProvider = _e[0], setSelectedProvider = _e[1];
    var _f = (0, react_1.useState)(undefined), viewingProvider = _f[0], setViewingProvider = _f[1];
    (0, react_1.useEffect)(function () {
        if (!viewingProvider) {
            loadProviders();
        }
    }, [viewingProvider]);
    var loadProviders = function () { return __awaiter(_this, void 0, void 0, function () {
        var data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    setLoading(true);
                    return [4 /*yield*/, hmoService_1.default.getHMOProviders(false)];
                case 1:
                    data = _a.sent();
                    setProviders(data);
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
    var handleCreate = function () {
        setSelectedProvider(undefined);
        setIsModalOpen(true);
    };
    var handleEdit = function (provider) {
        setSelectedProvider(provider);
        setIsModalOpen(true);
    };
    var handleDelete = function (provider) { return __awaiter(_this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!window.confirm("Are you sure you want to delete ".concat(provider.name, "?")))
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, hmoService_1.default.deleteHMOProvider(provider.id)];
                case 2:
                    _a.sent();
                    sonner_1.toast.success('Provider deleted successfully');
                    loadProviders();
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error('Error deleting provider:', error_2);
                    sonner_1.toast.error('Failed to delete provider');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleSave = function (data) { return __awaiter(_this, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    if (!selectedProvider) return [3 /*break*/, 2];
                    return [4 /*yield*/, hmoService_1.default.updateHMOProvider(selectedProvider.id, data)];
                case 1:
                    _a.sent();
                    sonner_1.toast.success('Provider updated successfully');
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, hmoService_1.default.createHMOProvider(data)];
                case 3:
                    _a.sent();
                    sonner_1.toast.success('Provider created successfully');
                    _a.label = 4;
                case 4:
                    loadProviders();
                    return [3 /*break*/, 6];
                case 5:
                    error_3 = _a.sent();
                    console.error('Error saving provider:', error_3);
                    sonner_1.toast.error('Failed to save provider');
                    throw error_3; // Re-throw to let modal know it failed
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var filteredProviders = providers.filter(function (provider) {
        return provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            provider.code.toLowerCase().includes(searchQuery.toLowerCase());
    });
    if (viewingProvider) {
        return (<div className="p-6">
                <HMOProviderDetails_1.default provider={viewingProvider} onBack={function () { return setViewingProvider(undefined); }}/>
            </div>);
    }
    if (loading) {
        return <LoadingSpinner_1.default fullScreen/>;
    }
    return (<div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">HMO Management</h1>
                    <p className="text-gray-500">Manage HMO providers, packages, and tariffs</p>
                </div>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2 hover:bg-primary/90 transition-colors" onClick={handleCreate}>
                    <lucide_react_1.Plus size={20}/>
                    Add Provider
                </button>
            </div>

            <div className="bg-white rounded-lg border shadow-sm">
                <div className="p-4 border-b flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <lucide_react_1.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                        <input type="text" placeholder="Search providers..." className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20" value={searchQuery} onChange={function (e) { return setSearchQuery(e.target.value); }}/>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredProviders.length === 0 ? (<tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No providers found matching your search.
                                    </td>
                                </tr>) : (filteredProviders.map(function (provider) { return (<tr key={provider.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                                    {provider.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{provider.name}</div>
                                                    <div className="text-xs text-gray-500">Accreditation: {provider.nhia_accreditation_number || 'N/A'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                                                {provider.code}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div>{provider.contact_email}</div>
                                            <div>{provider.contact_phone}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={"px-2 py-1 rounded-full text-xs font-medium ".concat(provider.is_active
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800')}>
                                                {provider.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-1 text-blue-600 hover:bg-blue-50 rounded" title="View Packages & Tariffs" onClick={function () { return setViewingProvider(provider); }}>
                                                    <lucide_react_1.Package size={18}/>
                                                </button>
                                                <button className="p-1 text-gray-600 hover:bg-gray-100 rounded" title="Edit Provider" onClick={function () { return handleEdit(provider); }}>
                                                    <lucide_react_1.Edit size={18}/>
                                                </button>
                                                <button className="p-1 text-red-600 hover:bg-red-50 rounded" title="Delete" onClick={function () { return handleDelete(provider); }}>
                                                    <lucide_react_1.Trash2 size={18}/>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>); }))}
                        </tbody>
                    </table>
                </div>
            </div>

            <HMOProviderModal_1.default isOpen={isModalOpen} onClose={function () { return setIsModalOpen(false); }} onSave={handleSave} provider={selectedProvider}/>
        </div>);
}
