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
exports.default = HMOTariffModal;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var sonner_1 = require("sonner");
function HMOTariffModal(_a) {
    var _this = this;
    var isOpen = _a.isOpen, onClose = _a.onClose, onSave = _a.onSave, tariffData = _a.tariffData, providerId = _a.providerId;
    var _b = (0, react_1.useState)({
        hmo_provider_id: providerId,
        service_code_id: '',
        tariff_amount: 0,
        copay_amount: 0,
        copay_percentage: 0,
        effective_from: new Date().toISOString().split('T')[0],
        effective_to: undefined
    }), formData = _b[0], setFormData = _b[1];
    var _c = (0, react_1.useState)(false), loading = _c[0], setLoading = _c[1];
    (0, react_1.useEffect)(function () {
        if (tariffData) {
            setFormData({
                hmo_provider_id: tariffData.hmo_provider_id,
                service_code_id: tariffData.service_code_id,
                tariff_amount: tariffData.tariff_amount,
                copay_amount: tariffData.copay_amount || 0,
                copay_percentage: tariffData.copay_percentage || 0,
                effective_from: tariffData.effective_from.split('T')[0],
                effective_to: tariffData.effective_to ? tariffData.effective_to.split('T')[0] : undefined
            });
        }
        else {
            setFormData({
                hmo_provider_id: providerId,
                service_code_id: '',
                tariff_amount: 0,
                copay_amount: 0,
                copay_percentage: 0,
                effective_from: new Date().toISOString().split('T')[0],
                effective_to: undefined
            });
        }
    }, [tariffData, isOpen, providerId]);
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!formData.service_code_id || formData.tariff_amount < 0) {
                        sonner_1.toast.error('Service Code and valid Tariff Amount are required');
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    setLoading(true);
                    return [4 /*yield*/, onSave(formData)];
                case 2:
                    _a.sent();
                    onClose();
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error saving tariff:', error_1);
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    if (!isOpen)
        return null;
    return (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-semibold">
                        {tariffData ? 'Edit Tariff' : 'Add Tariff'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <lucide_react_1.X size={24}/>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Service Code ID *</label>
                            <input type="text" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary" value={formData.service_code_id} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { service_code_id: e.target.value })); }} required placeholder="Enter Service Code ID"/>
                            {/* In a real app, this would be a search/select for service codes */}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Tariff Amount *</label>
                            <input type="number" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary" value={formData.tariff_amount} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { tariff_amount: Number(e.target.value) })); }} required min="0" step="0.01"/>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Copay Amount</label>
                                <input type="number" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary" value={formData.copay_amount} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { copay_amount: Number(e.target.value) })); }} min="0" step="0.01"/>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Copay %</label>
                                <input type="number" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary" value={formData.copay_percentage} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { copay_percentage: Number(e.target.value) })); }} min="0" max="100"/>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Effective From</label>
                                <input type="date" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary" value={formData.effective_from} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { effective_from: e.target.value })); }} required/>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Effective To</label>
                                <input type="date" className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/20 focus:border-primary" value={formData.effective_to || ''} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { effective_to: e.target.value || undefined })); }}/>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors" disabled={loading}>
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50" disabled={loading}>
                            {loading ? 'Saving...' : (tariffData ? 'Update Tariff' : 'Create Tariff')}
                        </button>
                    </div>
                </form>
            </div>
        </div>);
}
