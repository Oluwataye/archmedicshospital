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
// Get medical records (with filters)
router.get('/', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, patient_id, record_type, date_from, date_to, query, records, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query, patient_id = _a.patient_id, record_type = _a.record_type, date_from = _a.date_from, date_to = _a.date_to;
                query = (0, db_ts_1.default)('medical_records')
                    .join('users', 'medical_records.provider_id', 'users.id')
                    .select('medical_records.*', 'users.first_name as provider_first_name', 'users.last_name as provider_last_name', 'users.role as provider_role');
                if (patient_id) {
                    query = query.where('medical_records.patient_id', patient_id);
                }
                if (record_type) {
                    query = query.where('medical_records.record_type', record_type);
                }
                if (date_from) {
                    query = query.where('medical_records.record_date', '>=', date_from);
                }
                if (date_to) {
                    query = query.where('medical_records.record_date', '<=', date_to);
                }
                return [4 /*yield*/, query.orderBy('medical_records.record_date', 'desc')];
            case 1:
                records = _b.sent();
                return [2 /*return*/, res.json(records)];
            case 2:
                error_1 = _b.sent();
                console.error('Error fetching medical records:', error_1);
                res.status(500).json({ error: 'Failed to fetch medical records' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get single record
router.get('/:id', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var record, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, db_ts_1.default)('medical_records')
                        .join('users', 'medical_records.provider_id', 'users.id')
                        .where('medical_records.id', req.params.id)
                        .select('medical_records.*', 'users.first_name as provider_first_name', 'users.last_name as provider_last_name')
                        .first()];
            case 1:
                record = _a.sent();
                if (!record) {
                    return [2 /*return*/, res.status(404).json({ error: 'Medical record not found' })];
                }
                return [2 /*return*/, res.json(record)];
            case 2:
                error_2 = _a.sent();
                console.error('Error fetching medical record:', error_2);
                res.status(500).json({ error: 'Failed to fetch medical record' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Create medical record
router.post('/', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, patient_id, record_type, record_date, title, content, attachments, status_1, provider_id, newRecord, record, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, patient_id = _a.patient_id, record_type = _a.record_type, record_date = _a.record_date, title = _a.title, content = _a.content, attachments = _a.attachments, status_1 = _a.status;
                provider_id = req.user.id;
                return [4 /*yield*/, (0, db_ts_1.default)('medical_records').insert({
                        patient_id: patient_id,
                        provider_id: provider_id,
                        record_type: record_type,
                        record_date: record_date || new Date(),
                        title: title,
                        content: content,
                        attachments: attachments ? JSON.stringify(attachments) : null,
                        status: status_1 || 'final'
                    }).returning('*')];
            case 1:
                newRecord = (_b.sent())[0];
                if (!!newRecord) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, db_ts_1.default)('medical_records')
                        .where({ patient_id: patient_id, provider_id: provider_id, title: title })
                        .orderBy('created_at', 'desc')
                        .first()];
            case 2:
                record = _b.sent();
                return [2 /*return*/, res.status(201).json(record)];
            case 3: return [2 /*return*/, res.status(201).json(newRecord)];
            case 4:
                error_3 = _b.sent();
                console.error('Error creating medical record:', error_3);
                res.status(500).json({ error: 'Failed to create medical record' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Update medical record
router.put('/:id', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var updates, updatedRecord, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                updates = req.body;
                delete updates.id;
                delete updates.created_at;
                delete updates.provider_id; // Prevent changing provider
                if (typeof updates.attachments === 'object')
                    updates.attachments = JSON.stringify(updates.attachments);
                return [4 /*yield*/, (0, db_ts_1.default)('medical_records').where('id', req.params.id).update(__assign(__assign({}, updates), { updated_at: db_ts_1.default.fn.now() }))];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, db_ts_1.default)('medical_records').where('id', req.params.id).first()];
            case 2:
                updatedRecord = _a.sent();
                return [2 /*return*/, res.json(updatedRecord)];
            case 3:
                error_4 = _a.sent();
                console.error('Error updating medical record:', error_4);
                res.status(500).json({ error: 'Failed to update medical record' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Delete medical record
router.delete('/:id', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, db_ts_1.default)('medical_records').where('id', req.params.id).delete()];
            case 1:
                _a.sent();
                return [2 /*return*/, res.json({ message: 'Medical record deleted successfully' })];
            case 2:
                error_5 = _a.sent();
                console.error('Error deleting medical record:', error_5);
                res.status(500).json({ error: 'Failed to delete medical record' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get patient history
router.get('/patient/:patientId/history', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var records, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, db_ts_1.default)('medical_records')
                        .join('users', 'medical_records.provider_id', 'users.id')
                        .where('medical_records.patient_id', req.params.patientId)
                        .select('medical_records.*', 'users.first_name as provider_first_name', 'users.last_name as provider_last_name')
                        .orderBy('medical_records.record_date', 'desc')];
            case 1:
                records = _a.sent();
                return [2 /*return*/, res.json(records)];
            case 2:
                error_6 = _a.sent();
                console.error('Error fetching patient history:', error_6);
                res.status(500).json({ error: 'Failed to fetch patient history' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get stats overview
router.get('/stats/overview', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var totalRecords, byType, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, (0, db_ts_1.default)('medical_records').count('id as count').first()];
            case 1:
                totalRecords = _a.sent();
                return [4 /*yield*/, (0, db_ts_1.default)('medical_records')
                        .select('record_type')
                        .count('id as count')
                        .groupBy('record_type')];
            case 2:
                byType = _a.sent();
                return [2 /*return*/, res.json({
                        total: (totalRecords === null || totalRecords === void 0 ? void 0 : totalRecords.count) || 0,
                        byType: byType
                    })];
            case 3:
                error_7 = _a.sent();
                console.error('Error fetching stats:', error_7);
                res.status(500).json({ error: 'Failed to fetch stats' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
