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
var auth_ts_1 = require("../middleware/auth.ts");
var db_ts_1 = require("../db.ts");
var router = express_1.default.Router();
// Get prescriptions (with filters)
router.get('/', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, patient_id, status_1, date_from, date_to, query, prescriptions, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query, patient_id = _a.patient_id, status_1 = _a.status, date_from = _a.date_from, date_to = _a.date_to;
                query = (0, db_ts_1.default)('prescriptions')
                    .join('users', 'prescriptions.prescribed_by', 'users.id')
                    .select('prescriptions.*', 'users.first_name as prescriber_first_name', 'users.last_name as prescriber_last_name');
                if (patient_id) {
                    query = query.where('prescriptions.patient_id', patient_id);
                }
                if (status_1) {
                    query = query.where('prescriptions.status', status_1);
                }
                if (date_from) {
                    query = query.where('prescriptions.prescription_date', '>=', date_from);
                }
                if (date_to) {
                    query = query.where('prescriptions.prescription_date', '<=', date_to);
                }
                return [4 /*yield*/, query.orderBy('prescriptions.prescription_date', 'desc')];
            case 1:
                prescriptions = _b.sent();
                res.json(prescriptions);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                console.error('Error fetching prescriptions:', error_1);
                res.status(500).json({ error: 'Failed to fetch prescriptions' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get single prescription
router.get('/:id', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var prescription, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, db_ts_1.default)('prescriptions')
                        .where('id', req.params.id)
                        .first()];
            case 1:
                prescription = _a.sent();
                if (!prescription) {
                    return [2 /*return*/, res.status(404).json({ error: 'Prescription not found' })];
                }
                res.json(prescription);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error('Error fetching prescription:', error_2);
                res.status(500).json({ error: 'Failed to fetch prescription' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Create prescription
router.post('/', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, patient_id, medications, notes, status_2, prescribed_by, newPrescription, prescription, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, patient_id = _a.patient_id, medications = _a.medications, notes = _a.notes, status_2 = _a.status;
                prescribed_by = req.user.id;
                return [4 /*yield*/, (0, db_ts_1.default)('prescriptions').insert({
                        patient_id: patient_id,
                        prescribed_by: prescribed_by,
                        prescription_date: new Date(),
                        medications: typeof medications === 'object' ? JSON.stringify(medications) : medications,
                        notes: notes,
                        status: status_2 || 'active'
                    }).returning('*')];
            case 1:
                newPrescription = (_b.sent())[0];
                if (!!newPrescription) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, db_ts_1.default)('prescriptions')
                        .where({ patient_id: patient_id, prescribed_by: prescribed_by })
                        .orderBy('created_at', 'desc')
                        .first()];
            case 2:
                prescription = _b.sent();
                return [2 /*return*/, res.status(201).json(prescription)];
            case 3:
                res.status(201).json(newPrescription);
                return [3 /*break*/, 5];
            case 4:
                error_3 = _b.sent();
                console.error('Error creating prescription:', error_3);
                res.status(500).json({ error: 'Failed to create prescription' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Update prescription
router.put('/:id', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var updates, updatedPrescription, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                updates = req.body;
                delete updates.id;
                delete updates.created_at;
                delete updates.prescribed_by;
                if (typeof updates.medications === 'object')
                    updates.medications = JSON.stringify(updates.medications);
                return [4 /*yield*/, (0, db_ts_1.default)('prescriptions').where('id', req.params.id).update(__assign(__assign({}, updates), { updated_at: db_ts_1.default.fn.now() }))];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, db_ts_1.default)('prescriptions').where('id', req.params.id).first()];
            case 2:
                updatedPrescription = _a.sent();
                res.json(updatedPrescription);
                return [3 /*break*/, 4];
            case 3:
                error_4 = _a.sent();
                console.error('Error updating prescription:', error_4);
                res.status(500).json({ error: 'Failed to update prescription' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Cancel prescription (or mark as dispensed/completed)
router.delete('/:id', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, db_ts_1.default)('prescriptions').where('id', req.params.id).update({
                        status: 'cancelled',
                        updated_at: db_ts_1.default.fn.now()
                    })];
            case 1:
                _a.sent();
                res.json({ message: 'Prescription cancelled successfully' });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error('Error cancelling prescription:', error_5);
                res.status(500).json({ error: 'Failed to cancel prescription' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get active prescriptions for pharmacy
router.get('/active/pharmacy', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var activePrescriptions, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, db_ts_1.default)('prescriptions')
                        .join('patients', 'prescriptions.patient_id', 'patients.id')
                        .join('users', 'prescriptions.prescribed_by', 'users.id')
                        .where('prescriptions.status', 'active')
                        .select('prescriptions.*', 'patients.first_name as patient_first_name', 'patients.last_name as patient_last_name', 'patients.mrn as patient_mrn', 'users.first_name as prescriber_first_name', 'users.last_name as prescriber_last_name')
                        .orderBy('prescriptions.prescription_date', 'asc')];
            case 1:
                activePrescriptions = _a.sent();
                res.json(activePrescriptions);
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                console.error('Error fetching active prescriptions:', error_6);
                res.status(500).json({ error: 'Failed to fetch active prescriptions' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get patient prescription history
router.get('/patient/:patientId/history', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var history_1, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, db_ts_1.default)('prescriptions')
                        .where('patient_id', req.params.patientId)
                        .orderBy('prescription_date', 'desc')];
            case 1:
                history_1 = _a.sent();
                res.json(history_1);
                return [3 /*break*/, 3];
            case 2:
                error_7 = _a.sent();
                console.error('Error fetching patient prescription history:', error_7);
                res.status(500).json({ error: 'Failed to fetch patient prescription history' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get stats overview
router.get('/stats/overview', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var total, active, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, (0, db_ts_1.default)('prescriptions').count('id as count').first()];
            case 1:
                total = _a.sent();
                return [4 /*yield*/, (0, db_ts_1.default)('prescriptions').where('status', 'active').count('id as count').first()];
            case 2:
                active = _a.sent();
                res.json({
                    total: (total === null || total === void 0 ? void 0 : total.count) || 0,
                    active: (active === null || active === void 0 ? void 0 : active.count) || 0
                });
                return [3 /*break*/, 4];
            case 3:
                error_8 = _a.sent();
                console.error('Error fetching prescription stats:', error_8);
                res.status(500).json({ error: 'Failed to fetch prescription stats' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
