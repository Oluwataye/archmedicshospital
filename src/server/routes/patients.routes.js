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
// Get all patients (with search and filters)
router.get('/', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, search_1, status_1, gender, _b, limit, _c, offset, query, countQuery, totalResult, total, patients, error_1;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 3, , 4]);
                _a = req.query, search_1 = _a.search, status_1 = _a.status, gender = _a.gender, _b = _a.limit, limit = _b === void 0 ? 50 : _b, _c = _a.offset, offset = _c === void 0 ? 0 : _c;
                query = (0, db_ts_1.default)('patients').select('*');
                if (search_1) {
                    query = query.where(function (builder) {
                        builder.where('first_name', 'like', "%".concat(search_1, "%"))
                            .orWhere('last_name', 'like', "%".concat(search_1, "%"))
                            .orWhere('mrn', 'like', "%".concat(search_1, "%"))
                            .orWhere('phone', 'like', "%".concat(search_1, "%"))
                            .orWhere('email', 'like', "%".concat(search_1, "%"));
                    });
                }
                if (status_1 && status_1 !== 'all') {
                    query = query.where('status', status_1);
                }
                if (gender && gender !== 'all') {
                    query = query.where('gender', gender);
                }
                countQuery = query.clone().clearSelect().count('id as total').first();
                return [4 /*yield*/, countQuery];
            case 1:
                totalResult = _d.sent();
                total = (totalResult === null || totalResult === void 0 ? void 0 : totalResult.total) || 0;
                return [4 /*yield*/, query
                        .orderBy('created_at', 'desc')
                        .limit(Number(limit))
                        .offset(Number(offset))];
            case 2:
                patients = _d.sent();
                return [2 /*return*/, res.json({
                        data: patients,
                        total: total,
                        page: Math.floor(Number(offset) / Number(limit)) + 1,
                        limit: Number(limit)
                    })];
            case 3:
                error_1 = _d.sent();
                console.error('Error fetching patients:', error_1);
                res.status(500).json({ error: 'Failed to fetch patients' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Get single patient
router.get('/:id', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var patient, appointments, medicalRecords, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, (0, db_ts_1.default)('patients').where('id', req.params.id).first()];
            case 1:
                patient = _a.sent();
                if (!patient) {
                    return [2 /*return*/, res.status(404).json({ error: 'Patient not found' })];
                }
                return [4 /*yield*/, (0, db_ts_1.default)('appointments')
                        .where('patient_id', req.params.id)
                        .orderBy('appointment_date', 'desc')
                        .limit(5)];
            case 2:
                appointments = _a.sent();
                return [4 /*yield*/, (0, db_ts_1.default)('medical_records')
                        .where('patient_id', req.params.id)
                        .orderBy('record_date', 'desc')
                        .limit(5)];
            case 3:
                medicalRecords = _a.sent();
                return [2 /*return*/, res.json(__assign(__assign({}, patient), { recentAppointments: appointments, recentMedicalRecords: medicalRecords }))];
            case 4:
                error_2 = _a.sent();
                console.error('Error fetching patient:', error_2);
                res.status(500).json({ error: 'Failed to fetch patient' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Create patient
router.post('/', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, first_name, last_name, date_of_birth, gender, phone, email, address, city, state, zip_code, emergency_contact, insurance, medical_history, allergies, current_medications, assigned_doctor, dateStr, randomSuffix, mrn, newPatient, patient, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, first_name = _a.first_name, last_name = _a.last_name, date_of_birth = _a.date_of_birth, gender = _a.gender, phone = _a.phone, email = _a.email, address = _a.address, city = _a.city, state = _a.state, zip_code = _a.zip_code, emergency_contact = _a.emergency_contact, insurance = _a.insurance, medical_history = _a.medical_history, allergies = _a.allergies, current_medications = _a.current_medications, assigned_doctor = _a.assigned_doctor;
                dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
                randomSuffix = Math.floor(1000 + Math.random() * 9000);
                mrn = "PAT-".concat(dateStr, "-").concat(randomSuffix);
                return [4 /*yield*/, (0, db_ts_1.default)('patients').insert({
                        mrn: mrn,
                        first_name: first_name,
                        last_name: last_name,
                        date_of_birth: date_of_birth,
                        gender: gender,
                        phone: phone,
                        email: email,
                        address: address,
                        city: city,
                        state: state,
                        zip_code: zip_code,
                        emergency_contact: JSON.stringify(emergency_contact),
                        insurance: JSON.stringify(insurance),
                        medical_history: JSON.stringify(medical_history),
                        allergies: JSON.stringify(allergies),
                        current_medications: JSON.stringify(current_medications),
                        assigned_doctor: assigned_doctor,
                        status: 'active'
                    }).returning('*')];
            case 1:
                newPatient = (_b.sent())[0];
                if (!!newPatient) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, db_ts_1.default)('patients').where('mrn', mrn).first()];
            case 2:
                patient = _b.sent();
                return [2 /*return*/, res.status(201).json(patient)];
            case 3: return [2 /*return*/, res.status(201).json(newPatient)];
            case 4:
                error_3 = _b.sent();
                console.error('Error creating patient:', error_3);
                res.status(500).json({ error: 'Failed to create patient' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Update patient
router.put('/:id', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var updates, updatedPatient, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                updates = req.body;
                delete updates.id; // Prevent updating ID
                delete updates.mrn; // Prevent updating MRN
                delete updates.created_at;
                // Handle JSON fields if they are objects
                if (typeof updates.emergency_contact === 'object')
                    updates.emergency_contact = JSON.stringify(updates.emergency_contact);
                if (typeof updates.insurance === 'object')
                    updates.insurance = JSON.stringify(updates.insurance);
                if (typeof updates.medical_history === 'object')
                    updates.medical_history = JSON.stringify(updates.medical_history);
                if (typeof updates.allergies === 'object')
                    updates.allergies = JSON.stringify(updates.allergies);
                if (typeof updates.current_medications === 'object')
                    updates.current_medications = JSON.stringify(updates.current_medications);
                return [4 /*yield*/, (0, db_ts_1.default)('patients').where('id', req.params.id).update(__assign(__assign({}, updates), { updated_at: db_ts_1.default.fn.now() }))];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, db_ts_1.default)('patients').where('id', req.params.id).first()];
            case 2:
                updatedPatient = _a.sent();
                return [2 /*return*/, res.json(updatedPatient)];
            case 3:
                error_4 = _a.sent();
                console.error('Error updating patient:', error_4);
                res.status(500).json({ error: 'Failed to update patient' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Delete patient (Soft delete usually, but here we might do hard delete or status update)
router.delete('/:id', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var hasAppointments, hasRecords, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 6, , 7]);
                return [4 /*yield*/, (0, db_ts_1.default)('appointments').where('patient_id', req.params.id).first()];
            case 1:
                hasAppointments = _a.sent();
                return [4 /*yield*/, (0, db_ts_1.default)('medical_records').where('patient_id', req.params.id).first()];
            case 2:
                hasRecords = _a.sent();
                if (!(hasAppointments || hasRecords)) return [3 /*break*/, 4];
                // Soft delete
                return [4 /*yield*/, (0, db_ts_1.default)('patients').where('id', req.params.id).update({
                        status: 'inactive',
                        updated_at: db_ts_1.default.fn.now()
                    })];
            case 3:
                // Soft delete
                _a.sent();
                return [2 /*return*/, res.json({ message: 'Patient marked as inactive due to existing records' })];
            case 4: return [4 /*yield*/, (0, db_ts_1.default)('patients').where('id', req.params.id).delete()];
            case 5:
                _a.sent();
                return [2 /*return*/, res.json({ message: 'Patient deleted successfully' })];
            case 6:
                error_5 = _a.sent();
                console.error('Error deleting patient:', error_5);
                res.status(500).json({ error: 'Failed to delete patient' });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
