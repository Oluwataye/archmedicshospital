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
        var hmoProviders, packages, _i, hmoProviders_1, hmo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, knex('hmo_providers').select('*')];
                case 1:
                    hmoProviders = _a.sent();
                    // Clear existing service packages
                    return [4 /*yield*/, knex('hmo_service_packages').del()];
                case 2:
                    // Clear existing service packages
                    _a.sent();
                    packages = [];
                    for (_i = 0, hmoProviders_1 = hmoProviders; _i < hmoProviders_1.length; _i++) {
                        hmo = hmoProviders_1[_i];
                        // Basic Individual Package
                        packages.push({
                            hmo_provider_id: hmo.id,
                            package_name: "".concat(hmo.name, " - Basic Individual"),
                            package_code: "".concat(hmo.code, "-BASIC-IND"),
                            annual_limit: 500000.00,
                            services_covered: JSON.stringify([
                                'CONS-GP-001', 'LAB-BLOOD-001', 'LAB-BLOOD-002', 'LAB-URINE-001',
                                'RAD-XRAY-001', 'PROC-MINOR-001', 'PHARM-DRUG-001'
                            ]),
                            exclusions: JSON.stringify([
                                'RAD-MRI-001', 'PROC-SURG-003', 'OPT-GLASS-001'
                            ]),
                            copay_percentage: 10.00,
                            is_active: true,
                        });
                        // Premium Individual Package
                        packages.push({
                            hmo_provider_id: hmo.id,
                            package_name: "".concat(hmo.name, " - Premium Individual"),
                            package_code: "".concat(hmo.code, "-PREM-IND"),
                            annual_limit: 1500000.00,
                            services_covered: JSON.stringify([
                                'CONS-GP-001', 'CONS-SPEC-001', 'CONS-SPEC-002', 'CONS-SPEC-003',
                                'LAB-BLOOD-001', 'LAB-BLOOD-002', 'LAB-BLOOD-003', 'LAB-BLOOD-004',
                                'RAD-XRAY-001', 'RAD-ULTRA-001', 'RAD-CT-001',
                                'PROC-MINOR-001', 'PROC-MINOR-002', 'PROC-SURG-001',
                                'INPT-WARD-001', 'PHARM-DRUG-001', 'PHARM-DRUG-002'
                            ]),
                            exclusions: JSON.stringify([
                                'RAD-MRI-001', 'OPT-GLASS-001'
                            ]),
                            copay_percentage: 5.00,
                            is_active: true,
                        });
                        // Family Package
                        packages.push({
                            hmo_provider_id: hmo.id,
                            package_name: "".concat(hmo.name, " - Family Package"),
                            package_code: "".concat(hmo.code, "-FAM"),
                            annual_limit: 3000000.00,
                            services_covered: JSON.stringify([
                                'CONS-GP-001', 'CONS-SPEC-001', 'CONS-SPEC-004',
                                'LAB-BLOOD-001', 'LAB-BLOOD-002', 'LAB-MICRO-001',
                                'RAD-XRAY-001', 'RAD-ULTRA-001', 'RAD-ULTRA-003',
                                'MAT-ANC-001', 'MAT-DEL-001', 'MAT-PNC-001',
                                'PROC-MINOR-001', 'INPT-WARD-001', 'PHARM-DRUG-001'
                            ]),
                            exclusions: JSON.stringify([
                                'RAD-MRI-001', 'PROC-SURG-003'
                            ]),
                            copay_percentage: 10.00,
                            is_active: true,
                        });
                        // Corporate Package
                        packages.push({
                            hmo_provider_id: hmo.id,
                            package_name: "".concat(hmo.name, " - Corporate Package"),
                            package_code: "".concat(hmo.code, "-CORP"),
                            annual_limit: 2000000.00,
                            services_covered: JSON.stringify([
                                'CONS-GP-001', 'CONS-SPEC-001', 'CONS-SPEC-002',
                                'LAB-BLOOD-001', 'LAB-BLOOD-002', 'LAB-BLOOD-003',
                                'RAD-XRAY-001', 'RAD-ULTRA-001', 'RAD-CT-001',
                                'PROC-MINOR-001', 'PROC-MINOR-002',
                                'INPT-WARD-001', 'INPT-WARD-002',
                                'PHARM-DRUG-001', 'PHARM-DRUG-002',
                                'PHYSIO-SESS-001'
                            ]),
                            exclusions: JSON.stringify([
                                'RAD-MRI-001', 'OPT-GLASS-001', 'DENT-FILL-001'
                            ]),
                            copay_percentage: 0.00,
                            is_active: true,
                        });
                    }
                    return [4 /*yield*/, knex('hmo_service_packages').insert(packages)];
                case 3:
                    _a.sent();
                    console.log("Created ".concat(packages.length, " service packages for ").concat(hmoProviders.length, " HMO providers"));
                    return [2 /*return*/];
            }
        });
    });
}
