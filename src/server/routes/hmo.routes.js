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
var express_1 = require("express");
var db_ts_1 = require("../db.ts");
var auth_ts_1 = require("../middleware/auth.ts");
var router = express_1.default.Router();
// GET /api/hmo/providers - List all HMO providers
router.get('/providers', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var active, query, providers, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                active = req.query.active;
                query = (0, db_ts_1.default)('hmo_providers').select('*');
                if (active !== undefined) {
                    query = query.where('is_active', active === 'true');
                }
                return [4 /*yield*/, query.orderBy('name', 'asc')];
            case 1:
                providers = _a.sent();
                return [2 /*return*/, res.json(providers)];
            case 2:
                error_1 = _a.sent();
                console.error('Error fetching HMO providers:', error_1);
                res.status(500).json({ error: 'Failed to fetch HMO providers' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/hmo/providers/:id - Get single HMO provider
router.get('/providers/:id', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, provider, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, (0, db_ts_1.default)('hmo_providers')
                        .where('id', id)
                        .first()];
            case 1:
                provider = _a.sent();
                if (!provider) {
                    return [2 /*return*/, res.status(404).json({ error: 'HMO provider not found' })];
                }
                return [2 /*return*/, res.json(provider)];
            case 2:
                error_2 = _a.sent();
                console.error('Error fetching HMO provider:', error_2);
                res.status(500).json({ error: 'Failed to fetch HMO provider' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// POST /api/hmo/providers - Create HMO provider (Admin only)
router.post('/providers', auth_ts_1.auth, (0, auth_ts_1.authorize)(['admin']), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_1, code, nhia_accreditation_number, contact_email, contact_phone, address, coverage_type, _b, is_active, existing, provider, error_3;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                _a = req.body, name_1 = _a.name, code = _a.code, nhia_accreditation_number = _a.nhia_accreditation_number, contact_email = _a.contact_email, contact_phone = _a.contact_phone, address = _a.address, coverage_type = _a.coverage_type, _b = _a.is_active, is_active = _b === void 0 ? true : _b;
                // Validation
                if (!name_1 || !code) {
                    return [2 /*return*/, res.status(400).json({ error: 'Name and code are required' })];
                }
                return [4 /*yield*/, (0, db_ts_1.default)('hmo_providers').where('code', code).first()];
            case 1:
                existing = _c.sent();
                if (existing) {
                    return [2 /*return*/, res.status(409).json({ error: 'HMO provider with this code already exists' })];
                }
                return [4 /*yield*/, (0, db_ts_1.default)('hmo_providers')
                        .insert({
                        name: name_1,
                        code: code,
                        nhia_accreditation_number: nhia_accreditation_number,
                        contact_email: contact_email,
                        contact_phone: contact_phone,
                        address: address,
                        coverage_type: coverage_type,
                        is_active: is_active,
                    })
                        .returning('*')];
            case 2:
                provider = (_c.sent())[0];
                return [2 /*return*/, res.status(201).json(provider)];
            case 3:
                error_3 = _c.sent();
                console.error('Error creating HMO provider:', error_3);
                res.status(500).json({ error: 'Failed to create HMO provider' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// PUT /api/hmo/providers/:id - Update HMO provider (Admin only)
router.put('/providers/:id', auth_ts_1.auth, (0, auth_ts_1.authorize)(['admin']), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, updateData, provider, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                updateData = req.body;
                // Remove id from update data if present
                delete updateData.id;
                delete updateData.created_at;
                updateData.updated_at = new Date().toISOString();
                return [4 /*yield*/, (0, db_ts_1.default)('hmo_providers')
                        .where('id', id)
                        .update(updateData)
                        .returning('*')];
            case 1:
                provider = (_a.sent())[0];
                if (!provider) {
                    return [2 /*return*/, res.status(404).json({ error: 'HMO provider not found' })];
                }
                return [2 /*return*/, res.json(provider)];
            case 2:
                error_4 = _a.sent();
                console.error('Error updating HMO provider:', error_4);
                res.status(500).json({ error: 'Failed to update HMO provider' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// DELETE /api/hmo/providers/:id - Deactivate HMO provider (Admin only)
router.delete('/providers/:id', auth_ts_1.auth, (0, auth_ts_1.authorize)(['admin']), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, provider, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, (0, db_ts_1.default)('hmo_providers')
                        .where('id', id)
                        .update({ is_active: false, updated_at: new Date().toISOString() })
                        .returning('*')];
            case 1:
                provider = (_a.sent())[0];
                if (!provider) {
                    return [2 /*return*/, res.status(404).json({ error: 'HMO provider not found' })];
                }
                return [2 /*return*/, res.json({ message: 'HMO provider deactivated successfully', provider: provider })];
            case 2:
                error_5 = _a.sent();
                console.error('Error deactivating HMO provider:', error_5);
                res.status(500).json({ error: 'Failed to deactivate HMO provider' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/hmo/providers/:id/packages - Get packages for HMO
router.get('/providers/:id/packages', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, packages, parsedPackages, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, (0, db_ts_1.default)('hmo_service_packages')
                        .where('hmo_provider_id', id)
                        .where('is_active', true)
                        .orderBy('package_name', 'asc')];
            case 1:
                packages = _a.sent();
                parsedPackages = packages.map(function (pkg) { return (__assign(__assign({}, pkg), { services_covered: pkg.services_covered ? JSON.parse(pkg.services_covered) : [], exclusions: pkg.exclusions ? JSON.parse(pkg.exclusions) : [] })); });
                return [2 /*return*/, res.json(parsedPackages)];
            case 2:
                error_6 = _a.sent();
                console.error('Error fetching HMO packages:', error_6);
                res.status(500).json({ error: 'Failed to fetch HMO packages' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/hmo/packages/:id - Get single package
router.get('/packages/:id', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, pkg, parsedPackage, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, (0, db_ts_1.default)('hmo_service_packages')
                        .where('id', id)
                        .first()];
            case 1:
                pkg = _a.sent();
                if (!pkg) {
                    return [2 /*return*/, res.status(404).json({ error: 'Package not found' })];
                }
                parsedPackage = __assign(__assign({}, pkg), { services_covered: pkg.services_covered ? JSON.parse(pkg.services_covered) : [], exclusions: pkg.exclusions ? JSON.parse(pkg.exclusions) : [] });
                return [2 /*return*/, res.json(parsedPackage)];
            case 2:
                error_7 = _a.sent();
                console.error('Error fetching package:', error_7);
                res.status(500).json({ error: 'Failed to fetch package' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// POST /api/hmo/packages - Create package (Admin only)
router.post('/packages', auth_ts_1.auth, (0, auth_ts_1.authorize)(['admin']), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, hmo_provider_id, package_name, package_code, annual_limit, services_covered, exclusions, copay_percentage, _b, is_active, pkg, error_8;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                _a = req.body, hmo_provider_id = _a.hmo_provider_id, package_name = _a.package_name, package_code = _a.package_code, annual_limit = _a.annual_limit, services_covered = _a.services_covered, exclusions = _a.exclusions, copay_percentage = _a.copay_percentage, _b = _a.is_active, is_active = _b === void 0 ? true : _b;
                if (!hmo_provider_id || !package_name || !package_code) {
                    return [2 /*return*/, res.status(400).json({ error: 'Provider ID, name and code are required' })];
                }
                return [4 /*yield*/, (0, db_ts_1.default)('hmo_service_packages')
                        .insert({
                        hmo_provider_id: hmo_provider_id,
                        package_name: package_name,
                        package_code: package_code,
                        annual_limit: annual_limit,
                        services_covered: JSON.stringify(services_covered || []),
                        exclusions: JSON.stringify(exclusions || []),
                        copay_percentage: copay_percentage,
                        is_active: is_active
                    })
                        .returning('*')];
            case 1:
                pkg = (_c.sent())[0];
                return [2 /*return*/, res.status(201).json(pkg)];
            case 2:
                error_8 = _c.sent();
                console.error('Error creating package:', error_8);
                res.status(500).json({ error: 'Failed to create package' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// PUT /api/hmo/packages/:id - Update package (Admin only)
router.put('/packages/:id', auth_ts_1.auth, (0, auth_ts_1.authorize)(['admin']), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, updateData, pkg, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                updateData = req.body;
                // Handle JSON fields
                if (updateData.services_covered) {
                    updateData.services_covered = JSON.stringify(updateData.services_covered);
                }
                if (updateData.exclusions) {
                    updateData.exclusions = JSON.stringify(updateData.exclusions);
                }
                delete updateData.id;
                delete updateData.created_at;
                updateData.updated_at = new Date().toISOString();
                return [4 /*yield*/, (0, db_ts_1.default)('hmo_service_packages')
                        .where('id', id)
                        .update(updateData)
                        .returning('*')];
            case 1:
                pkg = (_a.sent())[0];
                if (!pkg) {
                    return [2 /*return*/, res.status(404).json({ error: 'Package not found' })];
                }
                return [2 /*return*/, res.json(pkg)];
            case 2:
                error_9 = _a.sent();
                console.error('Error updating package:', error_9);
                res.status(500).json({ error: 'Failed to update package' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// DELETE /api/hmo/packages/:id - Delete package (Admin only)
router.delete('/packages/:id', auth_ts_1.auth, (0, auth_ts_1.authorize)(['admin']), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, deleted, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, (0, db_ts_1.default)('hmo_service_packages')
                        .where('id', id)
                        .del()];
            case 1:
                deleted = _a.sent();
                if (!deleted) {
                    return [2 /*return*/, res.status(404).json({ error: 'Package not found' })];
                }
                return [2 /*return*/, res.json({ message: 'Package deleted successfully' })];
            case 2:
                error_10 = _a.sent();
                console.error('Error deleting package:', error_10);
                res.status(500).json({ error: 'Failed to delete package' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/hmo/providers/:id/tariffs - Get tariffs for HMO
router.get('/providers/:id/tariffs', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, tariffs, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, (0, db_ts_1.default)('hmo_tariffs')
                        .where('hmo_provider_id', id)
                        .orderBy('created_at', 'desc')];
            case 1:
                tariffs = _a.sent();
                return [2 /*return*/, res.json(tariffs)];
            case 2:
                error_11 = _a.sent();
                console.error('Error fetching tariffs:', error_11);
                res.status(500).json({ error: 'Failed to fetch tariffs' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// POST /api/hmo/tariffs - Create tariff (Admin only)
router.post('/tariffs', auth_ts_1.auth, (0, auth_ts_1.authorize)(['admin']), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, hmo_provider_id, service_code_id, tariff_amount, copay_amount, copay_percentage, effective_from, effective_to, tariff, error_12;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, hmo_provider_id = _a.hmo_provider_id, service_code_id = _a.service_code_id, tariff_amount = _a.tariff_amount, copay_amount = _a.copay_amount, copay_percentage = _a.copay_percentage, effective_from = _a.effective_from, effective_to = _a.effective_to;
                if (!hmo_provider_id || !service_code_id || tariff_amount === undefined) {
                    return [2 /*return*/, res.status(400).json({ error: 'Provider ID, service code and tariff amount are required' })];
                }
                return [4 /*yield*/, (0, db_ts_1.default)('hmo_tariffs')
                        .insert({
                        hmo_provider_id: hmo_provider_id,
                        service_code_id: service_code_id,
                        tariff_amount: tariff_amount,
                        copay_amount: copay_amount,
                        copay_percentage: copay_percentage,
                        effective_from: effective_from,
                        effective_to: effective_to
                    })
                        .returning('*')];
            case 1:
                tariff = (_b.sent())[0];
                return [2 /*return*/, res.status(201).json(tariff)];
            case 2:
                error_12 = _b.sent();
                console.error('Error creating tariff:', error_12);
                res.status(500).json({ error: 'Failed to create tariff' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// PUT /api/hmo/tariffs/:id - Update tariff (Admin only)
router.put('/tariffs/:id', auth_ts_1.auth, (0, auth_ts_1.authorize)(['admin']), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, updateData, tariff, error_13;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                updateData = req.body;
                delete updateData.id;
                delete updateData.created_at;
                updateData.updated_at = new Date().toISOString();
                return [4 /*yield*/, (0, db_ts_1.default)('hmo_tariffs')
                        .where('id', id)
                        .update(updateData)
                        .returning('*')];
            case 1:
                tariff = (_a.sent())[0];
                if (!tariff) {
                    return [2 /*return*/, res.status(404).json({ error: 'Tariff not found' })];
                }
                return [2 /*return*/, res.json(tariff)];
            case 2:
                error_13 = _a.sent();
                console.error('Error updating tariff:', error_13);
                res.status(500).json({ error: 'Failed to update tariff' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// DELETE /api/hmo/tariffs/:id - Delete tariff (Admin only)
router.delete('/tariffs/:id', auth_ts_1.auth, (0, auth_ts_1.authorize)(['admin']), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, deleted, error_14;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, (0, db_ts_1.default)('hmo_tariffs')
                        .where('id', id)
                        .del()];
            case 1:
                deleted = _a.sent();
                if (!deleted) {
                    return [2 /*return*/, res.status(404).json({ error: 'Tariff not found' })];
                }
                return [2 /*return*/, res.json({ message: 'Tariff deleted successfully' })];
            case 2:
                error_14 = _a.sent();
                console.error('Error deleting tariff:', error_14);
                res.status(500).json({ error: 'Failed to delete tariff' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/hmo/eligibility/:patientId - Check patient eligibility
router.get('/eligibility/:patientId', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var patientId, patient, hmoProvider, hmoPackage, _a, today, policyStart, policyEnd, policyStatus, isEligible, message, error_15;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                patientId = req.params.patientId;
                return [4 /*yield*/, (0, db_ts_1.default)('patients')
                        .where('id', patientId)
                        .first()];
            case 1:
                patient = _b.sent();
                if (!patient) {
                    return [2 /*return*/, res.status(404).json({ error: 'Patient not found' })];
                }
                // Check if patient has HMO
                if (!patient.hmo_provider_id) {
                    return [2 /*return*/, res.json({
                            is_eligible: false,
                            patient_id: patientId,
                            policy_status: 'not_enrolled',
                            message: 'Patient is not enrolled in any HMO',
                        })];
                }
                return [4 /*yield*/, (0, db_ts_1.default)('hmo_providers')
                        .where('id', patient.hmo_provider_id)
                        .first()];
            case 2:
                hmoProvider = _b.sent();
                if (!patient.hmo_package_id) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, db_ts_1.default)('hmo_service_packages')
                        .where('id', patient.hmo_package_id)
                        .first()];
            case 3:
                _a = _b.sent();
                return [3 /*break*/, 5];
            case 4:
                _a = null;
                _b.label = 5;
            case 5:
                hmoPackage = _a;
                today = new Date();
                policyStart = patient.policy_start_date ? new Date(patient.policy_start_date) : null;
                policyEnd = patient.policy_end_date ? new Date(patient.policy_end_date) : null;
                policyStatus = 'active';
                isEligible = true;
                message = 'Patient is eligible for HMO services';
                if (policyEnd && policyEnd < today) {
                    policyStatus = 'expired';
                    isEligible = false;
                    message = 'Patient policy has expired';
                }
                else if (policyStart && policyStart > today) {
                    policyStatus = 'not_active';
                    isEligible = false;
                    message = 'Patient policy has not started yet';
                }
                return [2 /*return*/, res.json({
                        is_eligible: isEligible,
                        patient_id: patientId,
                        hmo_provider: hmoProvider,
                        package: hmoPackage ? __assign(__assign({}, hmoPackage), { services_covered: hmoPackage.services_covered ? JSON.parse(hmoPackage.services_covered) : [], exclusions: hmoPackage.exclusions ? JSON.parse(hmoPackage.exclusions) : [] }) : null,
                        policy_status: policyStatus,
                        coverage_remaining: (hmoPackage === null || hmoPackage === void 0 ? void 0 : hmoPackage.annual_limit) || 0,
                        message: message,
                    })];
            case 6:
                error_15 = _b.sent();
                console.error('Error checking eligibility:', error_15);
                res.status(500).json({ error: 'Failed to check eligibility' });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
// POST /api/hmo/check-coverage - Check if service is covered
router.post('/check-coverage', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, patient_id, service_code_id, patient, tariff, error_16;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, patient_id = _a.patient_id, service_code_id = _a.service_code_id;
                if (!patient_id || !service_code_id) {
                    return [2 /*return*/, res.status(400).json({ error: 'Patient ID and service code ID are required' })];
                }
                return [4 /*yield*/, (0, db_ts_1.default)('patients').where('id', patient_id).first()];
            case 1:
                patient = _b.sent();
                if (!patient || !patient.hmo_provider_id) {
                    return [2 /*return*/, res.json({ covered: false, message: 'Patient not enrolled in HMO' })];
                }
                return [4 /*yield*/, (0, db_ts_1.default)('hmo_tariffs')
                        .where('hmo_provider_id', patient.hmo_provider_id)
                        .where('service_code_id', service_code_id)
                        .where('effective_from', '<=', new Date().toISOString().split('T')[0])
                        .where(function () {
                        this.whereNull('effective_to')
                            .orWhere('effective_to', '>=', new Date().toISOString().split('T')[0]);
                    })
                        .first()];
            case 2:
                tariff = _b.sent();
                if (!tariff) {
                    return [2 /*return*/, res.json({ covered: false, message: 'Service not covered by HMO' })];
                }
                return [2 /*return*/, res.json({
                        covered: true,
                        copay_amount: tariff.copay_amount,
                        copay_percentage: tariff.copay_percentage,
                        tariff_amount: tariff.tariff_amount,
                    })];
            case 3:
                error_16 = _b.sent();
                console.error('Error checking coverage:', error_16);
                res.status(500).json({ error: 'Failed to check coverage' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
