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
// Generate unique referral code
var generateReferralCode = function () {
    var timestamp = Date.now().toString(36);
    var random = Math.random().toString(36).substring(2, 7);
    return "REF-".concat(timestamp, "-").concat(random).toUpperCase();
};
// GET /api/referrals - List referrals
router.get('/', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, patient_id, referring_provider_id, status_1, urgency, from_date, to_date, user, query, referrals, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query, patient_id = _a.patient_id, referring_provider_id = _a.referring_provider_id, status_1 = _a.status, urgency = _a.urgency, from_date = _a.from_date, to_date = _a.to_date;
                user = req.user;
                query = (0, db_ts_1.default)('referrals')
                    .select('referrals.*', 'patients.first_name', 'patients.last_name', 'users.first_name as doctor_first_name', 'users.last_name as doctor_last_name', 'hmo_providers.name as hmo_name')
                    .join('patients', 'referrals.patient_id', 'patients.id')
                    .join('users', 'referrals.referring_provider_id', 'users.id')
                    .leftJoin('hmo_providers', 'referrals.hmo_provider_id', 'hmo_providers.id');
                // Role-based filtering
                if (user.role === 'doctor') {
                    query = query.where('referrals.referring_provider_id', user.id);
                }
                if (patient_id)
                    query = query.where('referrals.patient_id', patient_id);
                if (referring_provider_id)
                    query = query.where('referrals.referring_provider_id', referring_provider_id);
                if (status_1)
                    query = query.where('referrals.status', status_1);
                if (urgency)
                    query = query.where('referrals.urgency', urgency);
                if (from_date) {
                    query = query.where('referrals.referral_date', '>=', from_date);
                }
                if (to_date) {
                    query = query.where('referrals.referral_date', '<=', to_date);
                }
                return [4 /*yield*/, query.orderBy('referrals.created_at', 'desc')];
            case 1:
                referrals = _b.sent();
                res.json(referrals);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                console.error('Error fetching referrals:', error_1);
                res.status(500).json({ error: 'Failed to fetch referrals' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/referrals/:id - Get referral details
router.get('/:id', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, referral, preauth, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                id = req.params.id;
                return [4 /*yield*/, (0, db_ts_1.default)('referrals')
                        .select('referrals.*', 'patients.first_name', 'patients.last_name', 'patients.date_of_birth', 'users.first_name as doctor_first_name', 'users.last_name as doctor_last_name', 'hmo_providers.name as hmo_name')
                        .join('patients', 'referrals.patient_id', 'patients.id')
                        .join('users', 'referrals.referring_provider_id', 'users.id')
                        .leftJoin('hmo_providers', 'referrals.hmo_provider_id', 'hmo_providers.id')
                        .where('referrals.id', id)
                        .first()];
            case 1:
                referral = _a.sent();
                if (!referral) {
                    return [2 /*return*/, res.status(404).json({ error: 'Referral not found' })];
                }
                if (!referral.preauth_id) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, db_ts_1.default)('hmo_preauthorizations')
                        .where('id', referral.preauth_id)
                        .first()];
            case 2:
                preauth = _a.sent();
                referral.preauthorization = preauth;
                _a.label = 3;
            case 3:
                res.json(referral);
                return [3 /*break*/, 5];
            case 4:
                error_2 = _a.sent();
                console.error('Error fetching referral:', error_2);
                res.status(500).json({ error: 'Failed to fetch referral' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// GET /api/referrals/code/:referralCode - Get by referral code
router.get('/code/:referralCode', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var referralCode, referral, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                referralCode = req.params.referralCode;
                return [4 /*yield*/, (0, db_ts_1.default)('referrals')
                        .where('referral_code', referralCode)
                        .first()];
            case 1:
                referral = _a.sent();
                if (!referral) {
                    return [2 /*return*/, res.status(404).json({ error: 'Referral not found' })];
                }
                res.json(referral);
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                console.error('Error fetching referral:', error_3);
                res.status(500).json({ error: 'Failed to fetch referral' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// POST /api/referrals - Create referral
router.post('/', auth_ts_1.auth, (0, auth_ts_1.authorize)(['doctor', 'admin']), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, patient_id, referring_facility, referred_to_facility, referred_to_specialist, specialty_required, reason_for_referral, diagnosis, _b, urgency, hmo_provider_id, _c, preauth_required, preauth_id, referral_date, appointment_date, user, referral, error_4;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                _a = req.body, patient_id = _a.patient_id, referring_facility = _a.referring_facility, referred_to_facility = _a.referred_to_facility, referred_to_specialist = _a.referred_to_specialist, specialty_required = _a.specialty_required, reason_for_referral = _a.reason_for_referral, diagnosis = _a.diagnosis, _b = _a.urgency, urgency = _b === void 0 ? 'routine' : _b, hmo_provider_id = _a.hmo_provider_id, _c = _a.preauth_required, preauth_required = _c === void 0 ? false : _c, preauth_id = _a.preauth_id, referral_date = _a.referral_date, appointment_date = _a.appointment_date;
                user = req.user;
                if (!patient_id || !reason_for_referral) {
                    return [2 /*return*/, res.status(400).json({ error: 'Patient and reason for referral are required' })];
                }
                return [4 /*yield*/, (0, db_ts_1.default)('referrals')
                        .insert({
                        referral_code: generateReferralCode(),
                        patient_id: patient_id,
                        referring_provider_id: user.id,
                        referring_facility: referring_facility,
                        referred_to_facility: referred_to_facility,
                        referred_to_specialist: referred_to_specialist,
                        specialty_required: specialty_required,
                        reason_for_referral: reason_for_referral,
                        diagnosis: diagnosis,
                        urgency: urgency,
                        hmo_provider_id: hmo_provider_id,
                        preauth_required: preauth_required,
                        preauth_id: preauth_id,
                        status: 'pending',
                        referral_date: referral_date || new Date().toISOString().split('T')[0],
                        appointment_date: appointment_date,
                    })
                        .returning('*')];
            case 1:
                referral = (_d.sent())[0];
                res.status(201).json(referral);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _d.sent();
                console.error('Error creating referral:', error_4);
                res.status(500).json({ error: 'Failed to create referral' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// PUT /api/referrals/:id - Update referral
router.put('/:id', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, updateData, referral, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                updateData = req.body;
                delete updateData.id;
                delete updateData.referral_code;
                delete updateData.created_at;
                updateData.updated_at = new Date().toISOString();
                return [4 /*yield*/, (0, db_ts_1.default)('referrals')
                        .where('id', id)
                        .update(updateData)
                        .returning('*')];
            case 1:
                referral = (_a.sent())[0];
                if (!referral) {
                    return [2 /*return*/, res.status(404).json({ error: 'Referral not found' })];
                }
                res.json(referral);
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error('Error updating referral:', error_5);
                res.status(500).json({ error: 'Failed to update referral' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// PUT /api/referrals/:id/accept - Accept referral
router.put('/:id/accept', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, appointment_date, updateData, referral, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                appointment_date = req.body.appointment_date;
                updateData = {
                    status: 'accepted',
                    updated_at: new Date().toISOString(),
                };
                if (appointment_date) {
                    updateData.appointment_date = appointment_date;
                }
                return [4 /*yield*/, (0, db_ts_1.default)('referrals')
                        .where('id', id)
                        .update(updateData)
                        .returning('*')];
            case 1:
                referral = (_a.sent())[0];
                if (!referral) {
                    return [2 /*return*/, res.status(404).json({ error: 'Referral not found' })];
                }
                res.json(referral);
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                console.error('Error accepting referral:', error_6);
                res.status(500).json({ error: 'Failed to accept referral' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// PUT /api/referrals/:id/complete - Complete referral
router.put('/:id/complete', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, feedback, referral, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                feedback = req.body.feedback;
                return [4 /*yield*/, (0, db_ts_1.default)('referrals')
                        .where('id', id)
                        .update({
                        status: 'completed',
                        feedback: feedback || db_ts_1.default.raw('feedback'),
                        updated_at: new Date().toISOString(),
                    })
                        .returning('*')];
            case 1:
                referral = (_a.sent())[0];
                if (!referral) {
                    return [2 /*return*/, res.status(404).json({ error: 'Referral not found' })];
                }
                res.json(referral);
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                console.error('Error completing referral:', error_7);
                res.status(500).json({ error: 'Failed to complete referral' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// PUT /api/referrals/:id/cancel - Cancel referral
router.put('/:id/cancel', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, feedback, referral, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = req.params.id;
                feedback = req.body.feedback;
                return [4 /*yield*/, (0, db_ts_1.default)('referrals')
                        .where('id', id)
                        .update({
                        status: 'cancelled',
                        feedback: feedback || db_ts_1.default.raw('feedback'),
                        updated_at: new Date().toISOString(),
                    })
                        .returning('*')];
            case 1:
                referral = (_a.sent())[0];
                if (!referral) {
                    return [2 /*return*/, res.status(404).json({ error: 'Referral not found' })];
                }
                res.json(referral);
                return [3 /*break*/, 3];
            case 2:
                error_8 = _a.sent();
                console.error('Error cancelling referral:', error_8);
                res.status(500).json({ error: 'Failed to cancel referral' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/referrals/patient/:patientId - Get patient referrals
router.get('/patient/:patientId', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var patientId, referrals, error_9;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                patientId = req.params.patientId;
                return [4 /*yield*/, (0, db_ts_1.default)('referrals')
                        .select('referrals.*', 'users.first_name as doctor_first_name', 'users.last_name as doctor_last_name')
                        .join('users', 'referrals.referring_provider_id', 'users.id')
                        .where('referrals.patient_id', patientId)
                        .orderBy('referrals.created_at', 'desc')];
            case 1:
                referrals = _a.sent();
                res.json(referrals);
                return [3 /*break*/, 3];
            case 2:
                error_9 = _a.sent();
                console.error('Error fetching patient referrals:', error_9);
                res.status(500).json({ error: 'Failed to fetch patient referrals' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/referrals/provider/:providerId - Get provider referrals
router.get('/provider/:providerId', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var providerId, referrals, error_10;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                providerId = req.params.providerId;
                return [4 /*yield*/, (0, db_ts_1.default)('referrals')
                        .select('referrals.*', 'patients.first_name', 'patients.last_name')
                        .join('patients', 'referrals.patient_id', 'patients.id')
                        .where('referrals.referring_provider_id', providerId)
                        .orderBy('referrals.created_at', 'desc')];
            case 1:
                referrals = _a.sent();
                res.json(referrals);
                return [3 /*break*/, 3];
            case 2:
                error_10 = _a.sent();
                console.error('Error fetching provider referrals:', error_10);
                res.status(500).json({ error: 'Failed to fetch provider referrals' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// GET /api/referrals/verify/:referralCode - Verify referral code
router.get('/verify/:referralCode', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var referralCode, referral, error_11;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                referralCode = req.params.referralCode;
                return [4 /*yield*/, (0, db_ts_1.default)('referrals')
                        .select('referrals.*', 'patients.first_name', 'patients.last_name')
                        .join('patients', 'referrals.patient_id', 'patients.id')
                        .where('referrals.referral_code', referralCode)
                        .first()];
            case 1:
                referral = _a.sent();
                if (!referral) {
                    return [2 /*return*/, res.json({
                            valid: false,
                            message: 'Referral code not found',
                        })];
                }
                if (referral.status === 'cancelled') {
                    return [2 /*return*/, res.json({
                            valid: false,
                            referral: referral,
                            message: 'Referral has been cancelled',
                        })];
                }
                if (referral.status === 'completed') {
                    return [2 /*return*/, res.json({
                            valid: false,
                            referral: referral,
                            message: 'Referral has already been completed',
                        })];
                }
                res.json({
                    valid: true,
                    referral: referral,
                    message: 'Referral is valid',
                });
                return [3 /*break*/, 3];
            case 2:
                error_11 = _a.sent();
                console.error('Error verifying referral:', error_11);
                res.status(500).json({ error: 'Failed to verify referral' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
