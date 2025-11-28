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
var express_1 = require("express");
var db_ts_1 = require("../db.ts");
var auth_ts_1 = require("../middleware/auth.ts");
var router = express_1.default.Router();
// GET /api/nhis/service-codes - List all service codes
router.get('/service-codes', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, category, search_1, is_active, min_tariff, max_tariff, query, serviceCodes, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query, category = _a.category, search_1 = _a.search, is_active = _a.is_active, min_tariff = _a.min_tariff, max_tariff = _a.max_tariff;
                query = (0, db_ts_1.default)('nhis_service_codes').select('*');
                if (category) {
                    query = query.where('category', category);
                }
                if (search_1) {
                    query = query.where(function () {
                        this.where('code', 'like', "%".concat(search_1, "%"))
                            .orWhere('description', 'like', "%".concat(search_1, "%"));
                    });
                }
                if (is_active !== undefined) {
                    query = query.where('is_active', is_active === 'true');
                }
                if (min_tariff) {
                    query = query.where('base_tariff', '>=', parseFloat(min_tariff));
                }
                if (max_tariff) {
                    query = query.where('base_tariff', '<=', parseFloat(max_tariff));
                }
                return [4 /*yield*/, query.orderBy('category', 'asc').orderBy('code', 'asc')];
            case 1:
                serviceCodes = _b.sent();
                res.json(serviceCodes);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                console.error('Error fetching service codes:', error_1);
                res.status(500).json({ error: 'Failed to fetch service codes' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/nhis/service-codes/search - Search service codes
router.get('/service-codes/search', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var q, serviceCodes, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                q = req.query.q;
                if (!q) {
                    return [2 /*return*/, res.status(400).json({ error: 'Search query is required' })];
                }
                return [4 /*yield*/, (0, db_ts_1.default)('nhis_service_codes')
                        .where('code', 'like', "%".concat(q, "%"))
                        .orWhere('description', 'like', "%".concat(q, "%"))
                        .where('is_active', true)
                        .limit(20)
                        .orderBy('code', 'asc')];
            case 1:
                serviceCodes = _a.sent();
                res.json(serviceCodes);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error('Error searching service codes:', error_2);
                res.status(500).json({ error: 'Failed to search service codes' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/nhis/service-codes/:id - Get single service code
router.get('/service-codes/:id', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, serviceCode, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, (0, db_ts_1.default)('nhis_service_codes')
                        .where('id', id)
                        .first()];
            case 1:
                serviceCode = _a.sent();
                if (!serviceCode) {
                    return [2 /*return*/, res.status(404).json({ error: 'Service code not found' })];
                }
                res.json(serviceCode);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error('Error fetching service code:', error_3);
                res.status(500).json({ error: 'Failed to fetch service code' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/nhis/service-codes/code/:code - Get service code by code
router.get('/service-codes/code/:code', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var code, serviceCode, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                code = req.params.code;
                return [4 /*yield*/, (0, db_ts_1.default)('nhis_service_codes')
                        .where('code', code)
                        .first()];
            case 1:
                serviceCode = _a.sent();
                if (!serviceCode) {
                    return [2 /*return*/, res.status(404).json({ error: 'Service code not found' })];
                }
                res.json(serviceCode);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.error('Error fetching service code:', error_4);
                res.status(500).json({ error: 'Failed to fetch service code' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// POST /api/nhis/service-codes - Create service code (Admin only)
router.post('/service-codes', auth_ts_1.auth, (0, auth_ts_1.authorize)(['admin']), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, code, description, category, base_tariff, _b, is_active, existing, serviceCode, error_5;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                _a = req.body, code = _a.code, description = _a.description, category = _a.category, base_tariff = _a.base_tariff, _b = _a.is_active, is_active = _b === void 0 ? true : _b;
                if (!code || !description || !category || base_tariff === undefined) {
                    return [2 /*return*/, res.status(400).json({ error: 'Code, description, category, and base_tariff are required' })];
                }
                return [4 /*yield*/, (0, db_ts_1.default)('nhis_service_codes').where('code', code).first()];
            case 1:
                existing = _c.sent();
                if (existing) {
                    return [2 /*return*/, res.status(409).json({ error: 'Service code already exists' })];
                }
                return [4 /*yield*/, (0, db_ts_1.default)('nhis_service_codes')
                        .insert({ code: code, description: description, category: category, base_tariff: base_tariff, is_active: is_active })
                        .returning('*')];
            case 2:
                serviceCode = (_c.sent())[0];
                res.status(201).json(serviceCode);
                return [3 /*break*/, 4];
            case 3:
                error_5 = _c.sent();
                console.error('Error creating service code:', error_5);
                res.status(500).json({ error: 'Failed to create service code' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// PUT /api/nhis/service-codes/:id - Update service code (Admin only)
router.put('/service-codes/:id', auth_ts_1.auth, (0, auth_ts_1.authorize)(['admin']), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, updateData, serviceCode, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                updateData = req.body;
                delete updateData.id;
                delete updateData.created_at;
                updateData.updated_at = new Date().toISOString();
                return [4 /*yield*/, (0, db_ts_1.default)('nhis_service_codes')
                        .where('id', id)
                        .update(updateData)
                        .returning('*')];
            case 1:
                serviceCode = (_a.sent())[0];
                if (!serviceCode) {
                    return [2 /*return*/, res.status(404).json({ error: 'Service code not found' })];
                }
                res.json(serviceCode);
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                console.error('Error updating service code:', error_6);
                res.status(500).json({ error: 'Failed to update service code' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/nhis/service-codes/:id/tariffs - Get tariffs for service
router.get('/service-codes/:id/tariffs', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, hmo_provider_id, query, tariffs, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                hmo_provider_id = req.query.hmo_provider_id;
                query = (0, db_ts_1.default)('hmo_tariffs')
                    .select('hmo_tariffs.*', 'hmo_providers.name as hmo_name', 'hmo_providers.code as hmo_code')
                    .join('hmo_providers', 'hmo_tariffs.hmo_provider_id', 'hmo_providers.id')
                    .where('hmo_tariffs.service_code_id', id)
                    .where('hmo_tariffs.effective_from', '<=', new Date().toISOString().split('T')[0])
                    .where(function () {
                    this.whereNull('hmo_tariffs.effective_to')
                        .orWhere('hmo_tariffs.effective_to', '>=', new Date().toISOString().split('T')[0]);
                });
                if (hmo_provider_id) {
                    query = query.where('hmo_tariffs.hmo_provider_id', hmo_provider_id);
                }
                return [4 /*yield*/, query];
            case 1:
                tariffs = _a.sent();
                res.json(tariffs);
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                console.error('Error fetching tariffs:', error_7);
                res.status(500).json({ error: 'Failed to fetch tariffs' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/nhis/tariff - Get specific tariff
router.get('/tariff', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, service_code_id, hmo_provider_id, tariff, error_8;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query, service_code_id = _a.service_code_id, hmo_provider_id = _a.hmo_provider_id;
                if (!service_code_id || !hmo_provider_id) {
                    return [2 /*return*/, res.status(400).json({ error: 'Service code ID and HMO provider ID are required' })];
                }
                return [4 /*yield*/, (0, db_ts_1.default)('hmo_tariffs')
                        .where('service_code_id', service_code_id)
                        .where('hmo_provider_id', hmo_provider_id)
                        .where('effective_from', '<=', new Date().toISOString().split('T')[0])
                        .where(function () {
                        this.whereNull('effective_to')
                            .orWhere('effective_to', '>=', new Date().toISOString().split('T')[0]);
                    })
                        .first()];
            case 1:
                tariff = _b.sent();
                res.json(tariff || null);
                return [3 /*break*/, 3];
            case 2:
                error_8 = _b.sent();
                console.error('Error fetching tariff:', error_8);
                res.status(500).json({ error: 'Failed to fetch tariff' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/nhis/service-codes/categories - Get all categories
router.get('/service-codes/categories', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var categories, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, db_ts_1.default)('nhis_service_codes')
                        .distinct('category')
                        .whereNotNull('category')
                        .orderBy('category', 'asc')];
            case 1:
                categories = _a.sent();
                res.json(categories.map(function (c) { return c.category; }));
                return [3 /*break*/, 3];
            case 2:
                error_9 = _a.sent();
                console.error('Error fetching categories:', error_9);
                res.status(500).json({ error: 'Failed to fetch categories' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
