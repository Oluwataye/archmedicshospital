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
// Generate unique claim number
var generateClaimNumber = function () {
    var timestamp = Date.now().toString(36);
    var random = Math.random().toString(36).substring(2, 7);
    return "CLM-".concat(timestamp, "-").concat(random).toUpperCase();
};
// GET /api/claims - List claims (filtered by role)
router.get('/', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, patient_id, hmo_provider_id, status_1, from_date, to_date, created_by, user, query, claims, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query, patient_id = _a.patient_id, hmo_provider_id = _a.hmo_provider_id, status_1 = _a.status, from_date = _a.from_date, to_date = _a.to_date, created_by = _a.created_by;
                user = req.user;
                query = (0, db_ts_1.default)('hmo_claims')
                    .select('hmo_claims.*', 'patients.first_name', 'patients.last_name', 'hmo_providers.name as hmo_name')
                    .join('patients', 'hmo_claims.patient_id', 'patients.id')
                    .join('hmo_providers', 'hmo_claims.hmo_provider_id', 'hmo_providers.id');
                // Role-based filtering
                if (user.role !== 'admin') {
                    query = query.where('hmo_claims.created_by', user.id);
                }
                if (patient_id)
                    query = query.where('hmo_claims.patient_id', patient_id);
                if (hmo_provider_id)
                    query = query.where('hmo_claims.hmo_provider_id', hmo_provider_id);
                if (status_1)
                    query = query.where('hmo_claims.status', status_1);
                if (created_by)
                    query = query.where('hmo_claims.created_by', created_by);
                if (from_date) {
                    query = query.where('hmo_claims.claim_date', '>=', from_date);
                }
                if (to_date) {
                    query = query.where('hmo_claims.claim_date', '<=', to_date);
                }
                return [4 /*yield*/, query.orderBy('hmo_claims.created_at', 'desc')];
            case 1:
                claims = _b.sent();
                return [2 /*return*/, res.json(claims)];
            case 2:
                error_1 = _b.sent();
                console.error('Error fetching claims:', error_1);
                res.status(500).json({ error: 'Failed to fetch claims' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/claims/:id - Get claim details with items
router.get('/:id', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, claim, items, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = req.params.id;
                return [4 /*yield*/, (0, db_ts_1.default)('hmo_claims')
                        .select('hmo_claims.*', 'patients.first_name', 'patients.last_name', 'hmo_providers.name as hmo_name')
                        .join('patients', 'hmo_claims.patient_id', 'patients.id')
                        .join('hmo_providers', 'hmo_claims.hmo_provider_id', 'hmo_providers.id')
                        .where('hmo_claims.id', id)
                        .first()];
            case 1:
                claim = _a.sent();
                if (!claim) {
                    return [2 /*return*/, res.status(404).json({ error: 'Claim not found' })];
                }
                return [4 /*yield*/, (0, db_ts_1.default)('hmo_claim_items')
                        .select('hmo_claim_items.*', 'nhis_service_codes.code', 'nhis_service_codes.description')
                        .join('nhis_service_codes', 'hmo_claim_items.service_code_id', 'nhis_service_codes.id')
                        .where('hmo_claim_items.claim_id', id)];
            case 2:
                items = _a.sent();
                return [2 /*return*/, res.json(__assign(__assign({}, claim), { items: items }))];
            case 3:
                error_2 = _a.sent();
                console.error('Error fetching claim:', error_2);
                res.status(500).json({ error: 'Failed to fetch claim' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// GET /api/claims/number/:claimNumber - Get claim by number
router.get('/number/:claimNumber', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var claimNumber, claim, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                claimNumber = req.params.claimNumber;
                return [4 /*yield*/, (0, db_ts_1.default)('hmo_claims')
                        .where('claim_number', claimNumber)
                        .first()];
            case 1:
                claim = _a.sent();
                if (!claim) {
                    return [2 /*return*/, res.status(404).json({ error: 'Claim not found' })];
                }
                return [2 /*return*/, res.json(claim)];
            case 2:
                error_3 = _a.sent();
                console.error('Error fetching claim:', error_3);
                res.status(500).json({ error: 'Failed to fetch claim' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// POST /api/claims - Create new claim
router.post('/', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, patient_id, hmo_provider_id, claim_date, service_date, items, user_1, total_amount, copay_amount, claim_amount, claim_1, claimItems, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, patient_id = _a.patient_id, hmo_provider_id = _a.hmo_provider_id, claim_date = _a.claim_date, service_date = _a.service_date, items = _a.items;
                user_1 = req.user;
                if (!patient_id || !hmo_provider_id || !items || items.length === 0) {
                    return [2 /*return*/, res.status(400).json({ error: 'Patient, HMO provider, and items are required' })];
                }
                total_amount = items.reduce(function (sum, item) { return sum + item.total_price; }, 0);
                copay_amount = items.reduce(function (sum, item) { return sum + (item.copay || 0); }, 0);
                claim_amount = total_amount - copay_amount;
                return [4 /*yield*/, (0, db_ts_1.default)('hmo_claims')
                        .insert({
                        claim_number: generateClaimNumber(),
                        patient_id: patient_id,
                        hmo_provider_id: hmo_provider_id,
                        claim_date: claim_date || new Date().toISOString().split('T')[0],
                        service_date: service_date || new Date().toISOString().split('T')[0],
                        total_amount: total_amount,
                        copay_amount: copay_amount,
                        claim_amount: claim_amount,
                        status: 'pending',
                        created_by: user_1.id,
                    })
                        .returning('*')];
            case 1:
                claim_1 = (_b.sent())[0];
                claimItems = items.map(function (item) { return ({
                    claim_id: claim_1.id,
                    service_code_id: item.service_code_id,
                    quantity: item.quantity || 1,
                    unit_price: item.unit_price,
                    total_price: item.total_price,
                    diagnosis_code: item.diagnosis_code,
                    provider_id: item.provider_id || user_1.id,
                }); });
                return [4 /*yield*/, (0, db_ts_1.default)('hmo_claim_items').insert(claimItems)];
            case 2:
                _b.sent();
                return [2 /*return*/, res.status(201).json(claim_1)];
            case 3:
                error_4 = _b.sent();
                console.error('Error creating claim:', error_4);
                res.status(500).json({ error: 'Failed to create claim' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// PUT /api/claims/:id/submit - Submit claim to HMO
router.put('/:id/submit', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, claim, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, (0, db_ts_1.default)('hmo_claims')
                        .where('id', id)
                        .update({
                        status: 'submitted',
                        submission_date: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    })
                        .returning('*')];
            case 1:
                claim = (_a.sent())[0];
                if (!claim) {
                    return [2 /*return*/, res.status(404).json({ error: 'Claim not found' })];
                }
                return [2 /*return*/, res.json(claim)];
            case 2:
                error_5 = _a.sent();
                console.error('Error submitting claim:', error_5);
                res.status(500).json({ error: 'Failed to submit claim' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// PUT /api/claims/:id/approve - Approve claim (Admin only)
router.put('/:id/approve', auth_ts_1.auth, (0, auth_ts_1.authorize)(['admin']), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, approved_amount, claim, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                approved_amount = req.body.approved_amount;
                return [4 /*yield*/, (0, db_ts_1.default)('hmo_claims')
                        .where('id', id)
                        .update({
                        status: 'approved',
                        approval_date: new Date().toISOString(),
                        claim_amount: approved_amount || db_ts_1.default.raw('claim_amount'),
                        updated_at: new Date().toISOString(),
                    })
                        .returning('*')];
            case 1:
                claim = (_a.sent())[0];
                if (!claim) {
                    return [2 /*return*/, res.status(404).json({ error: 'Claim not found' })];
                }
                return [2 /*return*/, res.json(claim)];
            case 2:
                error_6 = _a.sent();
                console.error('Error approving claim:', error_6);
                res.status(500).json({ error: 'Failed to approve claim' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// PUT /api/claims/:id/reject - Reject claim (Admin only)
router.put('/:id/reject', auth_ts_1.auth, (0, auth_ts_1.authorize)(['admin']), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, rejection_reason, claim, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                rejection_reason = req.body.rejection_reason;
                if (!rejection_reason) {
                    return [2 /*return*/, res.status(400).json({ error: 'Rejection reason is required' })];
                }
                return [4 /*yield*/, (0, db_ts_1.default)('hmo_claims')
                        .where('id', id)
                        .update({
                        status: 'rejected',
                        rejection_reason: rejection_reason,
                        updated_at: new Date().toISOString(),
                    })
                        .returning('*')];
            case 1:
                claim = (_a.sent())[0];
                if (!claim) {
                    return [2 /*return*/, res.status(404).json({ error: 'Claim not found' })];
                }
                return [2 /*return*/, res.json(claim)];
            case 2:
                error_7 = _a.sent();
                console.error('Error rejecting claim:', error_7);
                res.status(500).json({ error: 'Failed to reject claim' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// PUT /api/claims/:id/paid - Mark claim as paid
router.put('/:id/paid', auth_ts_1.auth, (0, auth_ts_1.authorize)(['admin', 'cashier']), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, claim, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                return [4 /*yield*/, (0, db_ts_1.default)('hmo_claims')
                        .where('id', id)
                        .update({
                        status: 'paid',
                        payment_date: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    })
                        .returning('*')];
            case 1:
                claim = (_a.sent())[0];
                if (!claim) {
                    return [2 /*return*/, res.status(404).json({ error: 'Claim not found' })];
                }
                return [2 /*return*/, res.json(claim)];
            case 2:
                error_8 = _a.sent();
                console.error('Error marking claim as paid:', error_8);
                res.status(500).json({ error: 'Failed to mark claim as paid' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/claims/stats - Claims statistics
router.get('/stats/overview', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var stats, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, db_ts_1.default)('hmo_claims')
                        .select(db_ts_1.default.raw('COUNT(*) as total_claims'), db_ts_1.default.raw("SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_claims"), db_ts_1.default.raw("SUM(CASE WHEN status = 'submitted' THEN 1 ELSE 0 END) as submitted_claims"), db_ts_1.default.raw("SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_claims"), db_ts_1.default.raw("SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected_claims"), db_ts_1.default.raw("SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as paid_claims"), db_ts_1.default.raw('SUM(claim_amount) as total_claim_amount'), db_ts_1.default.raw("SUM(CASE WHEN status = 'approved' THEN claim_amount ELSE 0 END) as total_approved_amount"), db_ts_1.default.raw("SUM(CASE WHEN status = 'paid' THEN claim_amount ELSE 0 END) as total_paid_amount"))
                        .first()];
            case 1:
                stats = _a.sent();
                res.json(stats);
                return [3 /*break*/, 3];
            case 2:
                error_9 = _a.sent();
                console.error('Error fetching stats:', error_9);
                res.status(500).json({ error: 'Failed to fetch statistics' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/claims/patient/:patientId - Get patient claims
router.get('/patient/:patientId', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var patientId, claims, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                patientId = req.params.patientId;
                return [4 /*yield*/, (0, db_ts_1.default)('hmo_claims')
                        .select('hmo_claims.*', 'hmo_providers.name as hmo_name')
                        .join('hmo_providers', 'hmo_claims.hmo_provider_id', 'hmo_providers.id')
                        .where('hmo_claims.patient_id', patientId)
                        .orderBy('hmo_claims.created_at', 'desc')];
            case 1:
                claims = _a.sent();
                res.json(claims);
                return [3 /*break*/, 3];
            case 2:
                error_10 = _a.sent();
                console.error('Error fetching patient claims:', error_10);
                res.status(500).json({ error: 'Failed to fetch patient claims' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
