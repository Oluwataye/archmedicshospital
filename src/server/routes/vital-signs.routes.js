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
var auth_ts_1 = require("../middleware/auth.ts");
var db_ts_1 = require("../db.ts");
var router = express_1.default.Router();
// Get vital signs (with filters)
router.get('/', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, patient_id, date_from, date_to, query, vitals, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query, patient_id = _a.patient_id, date_from = _a.date_from, date_to = _a.date_to;
                query = (0, db_ts_1.default)('vital_signs')
                    .join('users', 'vital_signs.recorded_by', 'users.id')
                    .select('vital_signs.*', 'users.first_name as recorder_first_name', 'users.last_name as recorder_last_name');
                if (patient_id) {
                    query = query.where('vital_signs.patient_id', patient_id);
                }
                if (date_from) {
                    query = query.where('vital_signs.recorded_at', '>=', date_from);
                }
                if (date_to) {
                    query = query.where('vital_signs.recorded_at', '<=', date_to);
                }
                return [4 /*yield*/, query.orderBy('vital_signs.recorded_at', 'desc')];
            case 1:
                vitals = _b.sent();
                res.json(vitals);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                console.error('Error fetching vital signs:', error_1);
                res.status(500).json({ error: 'Failed to fetch vital signs' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Create vital signs
router.post('/', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, patient_id, systolic_bp, diastolic_bp, heart_rate, temperature, respiratory_rate, oxygen_saturation, weight, height, bmi, notes, recorded_by, newVitals, vitals, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, patient_id = _a.patient_id, systolic_bp = _a.systolic_bp, diastolic_bp = _a.diastolic_bp, heart_rate = _a.heart_rate, temperature = _a.temperature, respiratory_rate = _a.respiratory_rate, oxygen_saturation = _a.oxygen_saturation, weight = _a.weight, height = _a.height, bmi = _a.bmi, notes = _a.notes;
                recorded_by = req.user.id;
                return [4 /*yield*/, (0, db_ts_1.default)('vital_signs').insert({
                        patient_id: patient_id,
                        recorded_by: recorded_by,
                        recorded_at: db_ts_1.default.fn.now(),
                        systolic_bp: systolic_bp,
                        diastolic_bp: diastolic_bp,
                        heart_rate: heart_rate,
                        temperature: temperature,
                        respiratory_rate: respiratory_rate,
                        oxygen_saturation: oxygen_saturation,
                        weight: weight,
                        height: height,
                        bmi: bmi,
                        notes: notes
                    }).returning('*')];
            case 1:
                newVitals = (_b.sent())[0];
                if (!!newVitals) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, db_ts_1.default)('vital_signs')
                        .where({ patient_id: patient_id, recorded_by: recorded_by })
                        .orderBy('created_at', 'desc')
                        .first()];
            case 2:
                vitals = _b.sent();
                return [2 /*return*/, res.status(201).json(vitals)];
            case 3:
                res.status(201).json(newVitals);
                return [3 /*break*/, 5];
            case 4:
                error_2 = _b.sent();
                console.error('Error creating vital signs:', error_2);
                res.status(500).json({ error: 'Failed to create vital signs' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Update vital signs
router.put('/:id', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var updates, updatedVitals, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                updates = req.body;
                delete updates.id;
                delete updates.created_at;
                delete updates.recorded_at;
                delete updates.recorded_by;
                return [4 /*yield*/, (0, db_ts_1.default)('vital_signs').where('id', req.params.id).update(updates)];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, db_ts_1.default)('vital_signs').where('id', req.params.id).first()];
            case 2:
                updatedVitals = _a.sent();
                res.json(updatedVitals);
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                console.error('Error updating vital signs:', error_3);
                res.status(500).json({ error: 'Failed to update vital signs' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Delete vital signs
router.delete('/:id', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, db_ts_1.default)('vital_signs').where('id', req.params.id).delete()];
            case 1:
                _a.sent();
                res.json({ message: 'Vital signs deleted successfully' });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.error('Error deleting vital signs:', error_4);
                res.status(500).json({ error: 'Failed to delete vital signs' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get patient vital history
router.get('/patient/:patientId/history', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var vitals, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, db_ts_1.default)('vital_signs')
                        .where('patient_id', req.params.patientId)
                        .orderBy('recorded_at', 'desc')];
            case 1:
                vitals = _a.sent();
                res.json(vitals);
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                console.error('Error fetching patient vital history:', error_5);
                res.status(500).json({ error: 'Failed to fetch patient vital history' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get patient vital trends (simplified)
router.get('/patient/:patientId/trends', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, limit, vitals, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query.limit, limit = _a === void 0 ? 10 : _a;
                return [4 /*yield*/, (0, db_ts_1.default)('vital_signs')
                        .where('patient_id', req.params.patientId)
                        .orderBy('recorded_at', 'asc') // Ascending for charts
                        .limit(Number(limit))];
            case 1:
                vitals = _b.sent();
                res.json(vitals);
                return [3 /*break*/, 3];
            case 2:
                error_6 = _b.sent();
                console.error('Error fetching patient vital trends:', error_6);
                res.status(500).json({ error: 'Failed to fetch patient vital trends' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
