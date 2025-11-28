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
// Generate unique authorization code
var generateAuthCode = function () {
    var timestamp = Date.now().toString(36);
    var random = Math.random().toString(36).substring(2, 9);
    return "AUTH-".concat(timestamp, "-").concat(random).toUpperCase();
};
// GET /api/preauth - List pre-authorizations
router.get('/', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, patient_id, hmo_provider_id, status_1, from_date, to_date, requested_by, user, query, preauths, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query, patient_id = _a.patient_id, hmo_provider_id = _a.hmo_provider_id, status_1 = _a.status, from_date = _a.from_date, to_date = _a.to_date, requested_by = _a.requested_by;
                user = req.user;
                query = (0, db_ts_1.default)('hmo_preauthorizations')
                    .select('hmo_preauthorizations.*', 'patients.first_name', 'patients.last_name', 'hmo_providers.name as hmo_name', 'nhis_service_codes.code as service_code', 'nhis_service_codes.description as service_description')
                    .join('patients', 'hmo_preauthorizations.patient_id', 'patients.id')
                    .join('hmo_providers', 'hmo_preauthorizations.hmo_provider_id', 'hmo_providers.id')
                    .leftJoin('nhis_service_codes', 'hmo_preauthorizations.requested_service_code_id', 'nhis_service_codes.id');
                // Role-based filtering
                if (user.role !== 'admin') {
                    query = query.where('hmo_preauthorizations.requested_by', user.id);
                }
                if (patient_id)
                    query = query.where('hmo_preauthorizations.patient_id', patient_id);
                if (hmo_provider_id)
                    query = query.where('hmo_preauthorizations.hmo_provider_id', hmo_provider_id);
                if (status_1)
                    query = query.where('hmo_preauthorizations.status', status_1);
                if (requested_by)
                    query = query.where('hmo_preauthorizations.requested_by', requested_by);
                if (from_date) {
                    query = query.where('hmo_preauthorizations.request_date', '>=', from_date);
                }
                if (to_date) {
                    query = query.where('hmo_preauthorizations.request_date', '<=', to_date);
                }
                return [4 /*yield*/, query.orderBy('hmo_preauthorizations.created_at', 'desc')];
            case 1:
                preauths = _b.sent();
                res.json(preauths);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                console.error('Error fetching pre-authorizations:', error_1);
                res.status(500).json({ error: 'Failed to fetch pre-authorizations' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/preauth/:id - Get pre-authorization details
router.get('/:id', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, preauth, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, (0, db_ts_1.default)('hmo_preauthorizations')
                        .select('hmo_preauthorizations.*', 'patients.first_name', 'patients.last_name', 'hmo_providers.name as hmo_name', 'nhis_service_codes.code as service_code', 'nhis_service_codes.description as service_description')
                        .join('patients', 'hmo_preauthorizations.patient_id', 'patients.id')
                        .join('hmo_providers', 'hmo_preauthorizations.hmo_provider_id', 'hmo_providers.id')
                        .leftJoin('nhis_service_codes', 'hmo_preauthorizations.requested_service_code_id', 'nhis_service_codes.id')
                        .where('hmo_preauthorizations.id', id)
                        .first()];
            case 1:
                preauth = _a.sent();
                if (!preauth) {
                    return [2 /*return*/, res.status(404).json({ error: 'Pre-authorization not found' })];
                }
                res.json(preauth);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error('Error fetching pre-authorization:', error_2);
                res.status(500).json({ error: 'Failed to fetch pre-authorization' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/preauth/code/:authCode - Get by authorization code
router.get('/code/:authCode', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authCode, preauth, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                authCode = req.params.authCode;
                return [4 /*yield*/, (0, db_ts_1.default)('hmo_preauthorizations')
                        .where('authorization_code', authCode)
                        .first()];
            case 1:
                preauth = _a.sent();
                if (!preauth) {
                    return [2 /*return*/, res.status(404).json({ error: 'Pre-authorization not found' })];
                }
                res.json(preauth);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error('Error fetching pre-authorization:', error_3);
                res.status(500).json({ error: 'Failed to fetch pre-authorization' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// POST /api/preauth - Create pre-authorization request
router.post('/', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, patient_id, hmo_provider_id, requested_service_code_id, diagnosis, expiry_date, notes, user, expiryDate, preauth, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, patient_id = _a.patient_id, hmo_provider_id = _a.hmo_provider_id, requested_service_code_id = _a.requested_service_code_id, diagnosis = _a.diagnosis, expiry_date = _a.expiry_date, notes = _a.notes;
                user = req.user;
                if (!patient_id || !hmo_provider_id) {
                    return [2 /*return*/, res.status(400).json({ error: 'Patient and HMO provider are required' })];
                }
                expiryDate = expiry_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                return [4 /*yield*/, (0, db_ts_1.default)('hmo_preauthorizations')
                        .insert({
                        authorization_code: generateAuthCode(),
                        patient_id: patient_id,
                        hmo_provider_id: hmo_provider_id,
                        requested_service_code_id: requested_service_code_id,
                        diagnosis: diagnosis,
                        requested_by: user.id,
                        request_date: new Date().toISOString(),
                        expiry_date: expiryDate,
                        status: 'pending',
                        notes: notes,
                    })
                        .returning('*')];
            case 1:
                preauth = (_b.sent())[0];
                res.status(201).json(preauth);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _b.sent();
                console.error('Error creating pre-authorization:', error_4);
                res.status(500).json({ error: 'Failed to create pre-authorization' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// PUT /api/preauth/:id - Update pre-authorization
router.put('/:id', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, updateData, preauth, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                updateData = req.body;
                delete updateData.id;
                delete updateData.authorization_code;
                delete updateData.created_at;
                updateData.updated_at = new Date().toISOString();
                return [4 /*yield*/, (0, db_ts_1.default)('hmo_preauthorizations')
                        .where('id', id)
                        .update(updateData)
                        .returning('*')];
            case 1:
                preauth = (_a.sent())[0];
                if (!preauth) {
                    return [2 /*return*/, res.status(404).json({ error: 'Pre-authorization not found' })];
                }
                res.json(preauth);
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error('Error updating pre-authorization:', error_5);
                res.status(500).json({ error: 'Failed to update pre-authorization' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// PUT /api/preauth/:id/approve - Approve pre-authorization
router.put('/:id/approve', auth_ts_1.auth, (0, auth_ts_1.authorize)(['admin', 'doctor']), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, approved_amount, expiry_date, updateData, preauth, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                id = req.params.id;
                _a = req.body, approved_amount = _a.approved_amount, expiry_date = _a.expiry_date;
                if (!approved_amount) {
                    return [2 /*return*/, res.status(400).json({ error: 'Approved amount is required' })];
                }
                updateData = {
                    status: 'approved',
                    approval_date: new Date().toISOString(),
                    approved_amount: approved_amount,
                    updated_at: new Date().toISOString(),
                };
                if (expiry_date) {
                    updateData.expiry_date = expiry_date;
                }
                return [4 /*yield*/, (0, db_ts_1.default)('hmo_preauthorizations')
                        .where('id', id)
                        .update(updateData)
                        .returning('*')];
            case 1:
                preauth = (_b.sent())[0];
                if (!preauth) {
                    return [2 /*return*/, res.status(404).json({ error: 'Pre-authorization not found' })];
                }
                res.json(preauth);
                return [3 /*break*/, 3];
            case 2:
                error_6 = _b.sent();
                console.error('Error approving pre-authorization:', error_6);
                res.status(500).json({ error: 'Failed to approve pre-authorization' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// PUT /api/preauth/:id/reject - Reject pre-authorization
router.put('/:id/reject', auth_ts_1.auth, (0, auth_ts_1.authorize)(['admin', 'doctor']), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, notes, preauth, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                notes = req.body.notes;
                return [4 /*yield*/, (0, db_ts_1.default)('hmo_preauthorizations')
                        .where('id', id)
                        .update({
                        status: 'rejected',
                        notes: notes || db_ts_1.default.raw('notes'),
                        updated_at: new Date().toISOString(),
                    })
                        .returning('*')];
            case 1:
                preauth = (_a.sent())[0];
                if (!preauth) {
                    return [2 /*return*/, res.status(404).json({ error: 'Pre-authorization not found' })];
                }
                res.json(preauth);
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                console.error('Error rejecting pre-authorization:', error_7);
                res.status(500).json({ error: 'Failed to reject pre-authorization' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/preauth/verify/:authCode - Verify authorization code
router.get('/verify/:authCode', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var authCode, preauth, today, expiryDate, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                authCode = req.params.authCode;
                return [4 /*yield*/, (0, db_ts_1.default)('hmo_preauthorizations')
                        .where('authorization_code', authCode)
                        .first()];
            case 1:
                preauth = _a.sent();
                if (!preauth) {
                    return [2 /*return*/, res.json({
                            valid: false,
                            message: 'Authorization code not found',
                        })];
                }
                today = new Date();
                expiryDate = new Date(preauth.expiry_date);
                if (preauth.status !== 'approved') {
                    return [2 /*return*/, res.json({
                            valid: false,
                            preauth: preauth,
                            message: "Authorization is ".concat(preauth.status),
                        })];
                }
                if (!(expiryDate < today)) return [3 /*break*/, 3];
                // Update status to expired
                return [4 /*yield*/, (0, db_ts_1.default)('hmo_preauthorizations')
                        .where('id', preauth.id)
                        .update({ status: 'expired', updated_at: new Date().toISOString() })];
            case 2:
                // Update status to expired
                _a.sent();
                return [2 /*return*/, res.json({
                        valid: false,
                        preauth: __assign(__assign({}, preauth), { status: 'expired' }),
                        message: 'Authorization has expired',
                    })];
            case 3:
                res.json({
                    valid: true,
                    preauth: preauth,
                    message: 'Authorization is valid',
                });
                return [3 /*break*/, 5];
            case 4:
                error_8 = _a.sent();
                console.error('Error verifying authorization:', error_8);
                res.status(500).json({ error: 'Failed to verify authorization' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// GET /api/preauth/patient/:patientId - Get patient pre-authorizations
router.get('/patient/:patientId', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var patientId, preauths, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                patientId = req.params.patientId;
                return [4 /*yield*/, (0, db_ts_1.default)('hmo_preauthorizations')
                        .select('hmo_preauthorizations.*', 'hmo_providers.name as hmo_name')
                        .join('hmo_providers', 'hmo_preauthorizations.hmo_provider_id', 'hmo_providers.id')
                        .where('hmo_preauthorizations.patient_id', patientId)
                        .orderBy('hmo_preauthorizations.created_at', 'desc')];
            case 1:
                preauths = _a.sent();
                res.json(preauths);
                return [3 /*break*/, 3];
            case 2:
                error_9 = _a.sent();
                console.error('Error fetching patient pre-authorizations:', error_9);
                res.status(500).json({ error: 'Failed to fetch patient pre-authorizations' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// POST /api/preauth/check-required - Check if pre-auth required
router.post('/check-required', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, hmo_provider_id, service_code_id, service, requiresPreAuth, error_10;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, hmo_provider_id = _a.hmo_provider_id, service_code_id = _a.service_code_id;
                if (!hmo_provider_id || !service_code_id) {
                    return [2 /*return*/, res.status(400).json({ error: 'HMO provider and service code are required' })];
                }
                return [4 /*yield*/, (0, db_ts_1.default)('nhis_service_codes')
                        .where('id', service_code_id)
                        .first()];
            case 1:
                service = _b.sent();
                if (!service) {
                    return [2 /*return*/, res.status(404).json({ error: 'Service not found' })];
                }
                requiresPreAuth = service.base_tariff > 50000;
                res.json({
                    required: requiresPreAuth,
                    reason: requiresPreAuth ? 'High-cost service requires pre-authorization' : 'Pre-authorization not required',
                    service_tariff: service.base_tariff,
                });
                return [3 /*break*/, 3];
            case 2:
                error_10 = _b.sent();
                console.error('Error checking pre-auth requirement:', error_10);
                res.status(500).json({ error: 'Failed to check pre-auth requirement' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
