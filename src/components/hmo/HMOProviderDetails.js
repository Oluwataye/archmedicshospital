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
exports.default = HMOProviderDetails;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var sonner_1 = require("sonner");
var hmoService_1 = require("@/services/hmoService");
var LoadingSpinner_1 = require("@/components/common/LoadingSpinner");
var HMOPackageModal_1 = require("./HMOPackageModal");
var HMOTariffModal_1 = require("./HMOTariffModal");
function HMOProviderDetails(_a) {
    var _this = this;
    var provider = _a.provider, onBack = _a.onBack;
    var _b = (0, react_1.useState)('packages'), activeTab = _b[0], setActiveTab = _b[1];
    var _c = (0, react_1.useState)([]), packages = _c[0], setPackages = _c[1];
    var _d = (0, react_1.useState)([]), tariffs = _d[0], setTariffs = _d[1];
    var _e = (0, react_1.useState)(false), loading = _e[0], setLoading = _e[1];
    // Package Modal State
    var _f = (0, react_1.useState)(false), isPackageModalOpen = _f[0], setIsPackageModalOpen = _f[1];
    var _g = (0, react_1.useState)(undefined), selectedPackage = _g[0], setSelectedPackage = _g[1];
    // Tariff Modal State
    var _h = (0, react_1.useState)(false), isTariffModalOpen = _h[0], setIsTariffModalOpen = _h[1];
    var _j = (0, react_1.useState)(undefined), selectedTariff = _j[0], setSelectedTariff = _j[1];
    (0, react_1.useEffect)(function () {
        loadData();
    }, [provider.id, activeTab]);
    var loadData = function () { return __awaiter(_this, void 0, void 0, function () {
        var data, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, 6, 7]);
                    setLoading(true);
                    if (!(activeTab === 'packages')) return [3 /*break*/, 2];
                    return [4 /*yield*/, hmoService_1.default.getHMOPackages(provider.id)];
                case 1:
                    data = _a.sent();
                    setPackages(data);
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, hmoService_1.default.getHMOTariffs(provider.id)];
                case 3:
                    data = _a.sent();
                    setTariffs(data);
                    _a.label = 4;
                case 4: return [3 /*break*/, 7];
                case 5:
                    error_1 = _a.sent();
                    console.error('Error loading data:', error_1);
                    sonner_1.toast.error('Failed to load data');
                    return [3 /*break*/, 7];
                case 6:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    // Package Handlers
    var handleCreatePackage = function () {
        setSelectedPackage(undefined);
        setIsPackageModalOpen(true);
    };
    var handleEditPackage = function (pkg) {
        setSelectedPackage(pkg);
        setIsPackageModalOpen(true);
    };
    var handleDeletePackage = function (pkg) { return __awaiter(_this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!window.confirm("Are you sure you want to delete ".concat(pkg.package_name, "?")))
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, hmoService_1.default.deleteHMOPackage(pkg.id)];
                case 2:
                    _a.sent();
                    sonner_1.toast.success('Package deleted');
                    loadData();
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    sonner_1.toast.error('Failed to delete package');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleSavePackage = function (data) { return __awaiter(_this, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    if (!selectedPackage) return [3 /*break*/, 2];
                    return [4 /*yield*/, hmoService_1.default.updateHMOPackage(selectedPackage.id, data)];
                case 1:
                    _a.sent();
                    sonner_1.toast.success('Package updated');
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, hmoService_1.default.createHMOPackage(data)];
                case 3:
                    _a.sent();
                    sonner_1.toast.success('Package created');
                    _a.label = 4;
                case 4:
                    loadData();
                    return [3 /*break*/, 6];
                case 5:
                    error_3 = _a.sent();
                    sonner_1.toast.error('Failed to save package');
                    throw error_3;
                case 6: return [2 /*return*/];
            }
        });
    }); };
    // Tariff Handlers
    var handleCreateTariff = function () {
        setSelectedTariff(undefined);
        setIsTariffModalOpen(true);
    };
    var handleEditTariff = function (tariff) {
        setSelectedTariff(tariff);
        setIsTariffModalOpen(true);
    };
    var handleDeleteTariff = function (tariff) { return __awaiter(_this, void 0, void 0, function () {
        var error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!window.confirm('Are you sure you want to delete this tariff?'))
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, hmoService_1.default.deleteHMOTariff(tariff.id)];
                case 2:
                    _a.sent();
                    sonner_1.toast.success('Tariff deleted');
                    loadData();
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _a.sent();
                    sonner_1.toast.error('Failed to delete tariff');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleSaveTariff = function (data) { return __awaiter(_this, void 0, void 0, function () {
        var error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    if (!selectedTariff) return [3 /*break*/, 2];
                    return [4 /*yield*/, hmoService_1.default.updateHMOTariff(selectedTariff.id, data)];
                case 1:
                    _a.sent();
                    sonner_1.toast.success('Tariff updated');
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, hmoService_1.default.createHMOTariff(data)];
                case 3:
                    _a.sent();
                    sonner_1.toast.success('Tariff created');
                    _a.label = 4;
                case 4:
                    loadData();
                    return [3 /*break*/, 6];
                case 5:
                    error_5 = _a.sent();
                    sonner_1.toast.error('Failed to save tariff');
                    throw error_5;
                case 6: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
                    <lucide_react_1.ArrowLeft size={24}/>
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{provider.name}</h1>
                    <p className="text-gray-500">Manage packages and tariffs</p>
                </div>
            </div>

            <div className="border-b flex gap-6">
                <button className={"pb-3 px-2 flex items-center gap-2 font-medium transition-colors ".concat(activeTab === 'packages'
            ? 'border-b-2 border-primary text-primary'
            : 'text-gray-500 hover:text-gray-700')} onClick={function () { return setActiveTab('packages'); }}>
                    <lucide_react_1.Package size={20}/>
                    Service Packages
                </button>
                <button className={"pb-3 px-2 flex items-center gap-2 font-medium transition-colors ".concat(activeTab === 'tariffs'
            ? 'border-b-2 border-primary text-primary'
            : 'text-gray-500 hover:text-gray-700')} onClick={function () { return setActiveTab('tariffs'); }}>
                    <lucide_react_1.Coins size={20}/>
                    Tariffs
                </button>
            </div>

            {loading ? (<LoadingSpinner_1.default />) : (<div className="bg-white rounded-lg border shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold">
                            {activeTab === 'packages' ? 'Service Packages' : 'Service Tariffs'}
                        </h2>
                        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2 hover:bg-primary/90 transition-colors" onClick={activeTab === 'packages' ? handleCreatePackage : handleCreateTariff}>
                            <lucide_react_1.Plus size={20}/>
                            Add {activeTab === 'packages' ? 'Package' : 'Tariff'}
                        </button>
                    </div>

                    {activeTab === 'packages' ? (<div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Annual Limit</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {packages.length === 0 ? (<tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No packages found</td></tr>) : (packages.map(function (pkg) { return (<tr key={pkg.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium">{pkg.package_name}</td>
                                                <td className="px-6 py-4 text-gray-500">{pkg.package_code}</td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    {pkg.annual_limit ? "\u20A6".concat(pkg.annual_limit.toLocaleString()) : 'Unlimited'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={"px-2 py-1 rounded-full text-xs font-medium ".concat(pkg.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800')}>
                                                        {pkg.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={function () { return handleEditPackage(pkg); }} className="p-1 text-gray-600 hover:bg-gray-100 rounded">
                                                            <lucide_react_1.Edit size={18}/>
                                                        </button>
                                                        <button onClick={function () { return handleDeletePackage(pkg); }} className="p-1 text-red-600 hover:bg-red-50 rounded">
                                                            <lucide_react_1.Trash2 size={18}/>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>); }))}
                                </tbody>
                            </table>
                        </div>) : (<div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service Code</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tariff Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Copay</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Effective From</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {tariffs.length === 0 ? (<tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No tariffs found</td></tr>) : (tariffs.map(function (tariff) { return (<tr key={tariff.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium">{tariff.service_code_id}</td>
                                                <td className="px-6 py-4 text-gray-500">₦{tariff.tariff_amount.toLocaleString()}</td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    {tariff.copay_amount ? "\u20A6".concat(tariff.copay_amount) : (tariff.copay_percentage ? "".concat(tariff.copay_percentage, "%") : '-')}
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">{new Date(tariff.effective_from).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={function () { return handleEditTariff(tariff); }} className="p-1 text-gray-600 hover:bg-gray-100 rounded">
                                                            <lucide_react_1.Edit size={18}/>
                                                        </button>
                                                        <button onClick={function () { return handleDeleteTariff(tariff); }} className="p-1 text-red-600 hover:bg-red-50 rounded">
                                                            <lucide_react_1.Trash2 size={18}/>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>); }))}
                                </tbody>
                            </table>
                        </div>)}
                </div>)}

            <HMOPackageModal_1.default isOpen={isPackageModalOpen} onClose={function () { return setIsPackageModalOpen(false); }} onSave={handleSavePackage} packageData={selectedPackage} providerId={provider.id}/>

            <HMOTariffModal_1.default isOpen={isTariffModalOpen} onClose={function () { return setIsTariffModalOpen(false); }} onSave={handleSaveTariff} tariffData={selectedTariff} providerId={provider.id}/>
        </div>);
}
