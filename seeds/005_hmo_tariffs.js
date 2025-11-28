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
exports.seed = seed;
function seed(knex) {
    return __awaiter(this, void 0, void 0, function () {
        var hmoProviders, serviceCodes, tariffs, today, _i, hmoProviders_1, hmo, _a, serviceCodes_1, service, tariffMultiplier, tariffAmount, copayAmount, copayPercentage, batchSize, i, batch;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, knex('hmo_providers').select('*')];
                case 1:
                    hmoProviders = _b.sent();
                    return [4 /*yield*/, knex('nhis_service_codes').select('*')];
                case 2:
                    serviceCodes = _b.sent();
                    // Clear existing tariffs
                    return [4 /*yield*/, knex('hmo_tariffs').del()];
                case 3:
                    // Clear existing tariffs
                    _b.sent();
                    tariffs = [];
                    today = new Date().toISOString().split('T')[0];
                    // Create tariffs for each HMO
                    for (_i = 0, hmoProviders_1 = hmoProviders; _i < hmoProviders_1.length; _i++) {
                        hmo = hmoProviders_1[_i];
                        for (_a = 0, serviceCodes_1 = serviceCodes; _a < serviceCodes_1.length; _a++) {
                            service = serviceCodes_1[_a];
                            tariffMultiplier = 1.0;
                            switch (hmo.code) {
                                case 'AIICO':
                                    tariffMultiplier = 1.05; // 5% above base
                                    break;
                                case 'HYGEIA':
                                    tariffMultiplier = 1.10; // 10% above base
                                    break;
                                case 'RELIANCE':
                                    tariffMultiplier = 1.00; // Same as base
                                    break;
                                case 'AXA':
                                    tariffMultiplier = 1.15; // 15% above base
                                    break;
                                case 'TOTAL':
                                    tariffMultiplier = 0.95; // 5% below base
                                    break;
                                case 'CLEARLINE':
                                    tariffMultiplier = 1.00;
                                    break;
                                case 'INTEGRATED':
                                    tariffMultiplier = 1.05;
                                    break;
                                case 'SONGHAI':
                                    tariffMultiplier = 1.00;
                                    break;
                                case 'HEALTHCARE_INTL':
                                    tariffMultiplier = 1.08;
                                    break;
                                case 'NOVO':
                                    tariffMultiplier = 1.12;
                                    break;
                                default:
                                    tariffMultiplier = 1.00;
                            }
                            tariffAmount = parseFloat((service.base_tariff * tariffMultiplier).toFixed(2));
                            copayAmount = 0;
                            copayPercentage = null;
                            switch (service.category) {
                                case 'Consultation':
                                    copayAmount = 500.00; // Fixed copay for consultations
                                    break;
                                case 'Laboratory':
                                    copayPercentage = 10.00; // 10% copay for lab tests
                                    break;
                                case 'Radiology':
                                    copayPercentage = 15.00; // 15% copay for radiology
                                    break;
                                case 'Procedure':
                                    copayPercentage = 20.00; // 20% copay for procedures
                                    break;
                                case 'Inpatient':
                                    copayAmount = 5000.00; // Fixed daily copay for inpatient
                                    break;
                                case 'Pharmacy':
                                    copayPercentage = 10.00;
                                    break;
                                case 'Maternity':
                                    copayAmount = 0.00; // No copay for maternity
                                    break;
                                case 'Dental':
                                    copayPercentage = 25.00; // 25% copay for dental
                                    break;
                                case 'Optical':
                                    copayPercentage = 30.00; // 30% copay for optical
                                    break;
                                case 'Physiotherapy':
                                    copayPercentage = 15.00;
                                    break;
                                case 'Emergency':
                                    copayAmount = 0.00; // No copay for emergency
                                    break;
                                default:
                                    copayPercentage = 10.00;
                            }
                            tariffs.push({
                                hmo_provider_id: hmo.id,
                                service_code_id: service.id,
                                tariff_amount: tariffAmount,
                                copay_amount: copayAmount > 0 ? copayAmount : null,
                                copay_percentage: copayPercentage,
                                effective_from: today,
                                effective_to: null, // Open-ended
                            });
                        }
                    }
                    batchSize = 100;
                    i = 0;
                    _b.label = 4;
                case 4:
                    if (!(i < tariffs.length)) return [3 /*break*/, 7];
                    batch = tariffs.slice(i, i + batchSize);
                    return [4 /*yield*/, knex('hmo_tariffs').insert(batch)];
                case 5:
                    _b.sent();
                    _b.label = 6;
                case 6:
                    i += batchSize;
                    return [3 /*break*/, 4];
                case 7:
                    console.log("Created ".concat(tariffs.length, " tariff mappings for ").concat(hmoProviders.length, " HMOs and ").concat(serviceCodes.length, " service codes"));
                    return [2 /*return*/];
            }
        });
    });
}
