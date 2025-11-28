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
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Clear existing HMO data
                return [4 /*yield*/, knex('hmo_tariffs').del()];
                case 1:
                    // Clear existing HMO data
                    _a.sent();
                    return [4 /*yield*/, knex('hmo_service_packages').del()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, knex('hmo_providers').del()];
                case 3:
                    _a.sent();
                    // Insert major Nigerian HMO providers
                    return [4 /*yield*/, knex('hmo_providers').insert([
                            {
                                name: 'AIICO Multishield Limited',
                                code: 'AIICO',
                                nhia_accreditation_number: 'NHIA/HMO/001',
                                contact_email: 'info@aiico.com',
                                contact_phone: '+234-1-2701030',
                                address: 'AIICO Plaza, Plot 2, Oba Akran Avenue, Ikeja, Lagos',
                                coverage_type: 'individual',
                                is_active: true,
                            },
                            {
                                name: 'Hygeia HMO Limited',
                                code: 'HYGEIA',
                                nhia_accreditation_number: 'NHIA/HMO/002',
                                contact_email: 'claims@hygeiahmo.com',
                                contact_phone: '+234-1-2806000',
                                address: '21/25 Broad Street, Lagos Island, Lagos',
                                coverage_type: 'individual',
                                is_active: true,
                            },
                            {
                                name: 'Reliance HMO Limited',
                                code: 'RELIANCE',
                                nhia_accreditation_number: 'NHIA/HMO/003',
                                contact_email: 'info@reliancehmo.com',
                                contact_phone: '+234-1-2806543',
                                address: '4th Floor, UBA House, 57 Marina, Lagos',
                                coverage_type: 'individual',
                                is_active: true,
                            },
                            {
                                name: 'AXA Mansard Health Limited',
                                code: 'AXA',
                                nhia_accreditation_number: 'NHIA/HMO/004',
                                contact_email: 'health@axamansard.com',
                                contact_phone: '+234-1-2701030',
                                address: 'Churchgate Tower 1, 30 Afribank Street, Victoria Island, Lagos',
                                coverage_type: 'individual',
                                is_active: true,
                            },
                            {
                                name: 'Total Health Trust Limited',
                                code: 'TOTAL',
                                nhia_accreditation_number: 'NHIA/HMO/005',
                                contact_email: 'info@totalhealthtrust.com',
                                contact_phone: '+234-1-4617912',
                                address: '142 Adetokunbo Ademola Crescent, Wuse II, Abuja',
                                coverage_type: 'individual',
                                is_active: true,
                            },
                            {
                                name: 'Clearline HMO Limited',
                                code: 'CLEARLINE',
                                nhia_accreditation_number: 'NHIA/HMO/006',
                                contact_email: 'info@clearlinehmo.com',
                                contact_phone: '+234-1-2806789',
                                address: 'Plot 1665, Oyin Jolayemi Street, Victoria Island, Lagos',
                                coverage_type: 'individual',
                                is_active: true,
                            },
                            {
                                name: 'Integrated Healthcare Limited',
                                code: 'INTEGRATED',
                                nhia_accreditation_number: 'NHIA/HMO/007',
                                contact_email: 'info@integratedhealthcare.com.ng',
                                contact_phone: '+234-1-2806234',
                                address: '23 Jimmy Carter Street, Asokoro, Abuja',
                                coverage_type: 'individual',
                                is_active: true,
                            },
                            {
                                name: 'Songhai Health Trust HMO Limited',
                                code: 'SONGHAI',
                                nhia_accreditation_number: 'NHIA/HMO/008',
                                contact_email: 'info@songhaihealthtrust.com',
                                contact_phone: '+234-1-2806456',
                                address: 'Plot 1548, Adetokunbo Ademola Street, Victoria Island, Lagos',
                                coverage_type: 'individual',
                                is_active: true,
                            },
                            {
                                name: 'Healthcare International HMO Limited',
                                code: 'HEALTHCARE_INTL',
                                nhia_accreditation_number: 'NHIA/HMO/009',
                                contact_email: 'info@healthcareinternational.com.ng',
                                contact_phone: '+234-1-2806678',
                                address: '15 Kofo Abayomi Street, Victoria Island, Lagos',
                                coverage_type: 'individual',
                                is_active: true,
                            },
                            {
                                name: 'Novo Health Africa',
                                code: 'NOVO',
                                nhia_accreditation_number: 'NHIA/HMO/010',
                                contact_email: 'info@novohealthafrica.com',
                                contact_phone: '+234-1-2806890',
                                address: '12A Akin Adesola Street, Victoria Island, Lagos',
                                coverage_type: 'individual',
                                is_active: true,
                            },
                        ])];
                case 4:
                    // Insert major Nigerian HMO providers
                    _a.sent();
                    console.log('HMO providers seeded successfully!');
                    return [2 /*return*/];
            }
        });
    });
}
