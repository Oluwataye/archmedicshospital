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
// Get appointments (with filters)
router.get('/', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, date, doctor_id, patient_id, status_1, query, appointments, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query, date = _a.date, doctor_id = _a.doctor_id, patient_id = _a.patient_id, status_1 = _a.status;
                query = (0, db_ts_1.default)('appointments')
                    .join('patients', 'appointments.patient_id', 'patients.id')
                    .join('users', 'appointments.doctor_id', 'users.id')
                    .select('appointments.*', 'patients.first_name as patient_first_name', 'patients.last_name as patient_last_name', 'users.first_name as doctor_first_name', 'users.last_name as doctor_last_name');
                if (date) {
                    query = query.where('appointments.appointment_date', date);
                }
                if (doctor_id) {
                    query = query.where('appointments.doctor_id', doctor_id);
                }
                if (patient_id) {
                    query = query.where('appointments.patient_id', patient_id);
                }
                if (status_1) {
                    query = query.where('appointments.status', status_1);
                }
                return [4 /*yield*/, query.orderBy('appointments.appointment_date', 'asc').orderBy('appointments.appointment_time', 'asc')];
            case 1:
                appointments = _b.sent();
                return [2 /*return*/, res.json(appointments)];
            case 2:
                error_1 = _b.sent();
                console.error('Error fetching appointments:', error_1);
                res.status(500).json({ error: 'Failed to fetch appointments' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get single appointment
router.get('/:id', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var appointment, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, db_ts_1.default)('appointments')
                        .join('patients', 'appointments.patient_id', 'patients.id')
                        .join('users', 'appointments.doctor_id', 'users.id')
                        .where('appointments.id', req.params.id)
                        .select('appointments.*', 'patients.first_name as patient_first_name', 'patients.last_name as patient_last_name', 'users.first_name as doctor_first_name', 'users.last_name as doctor_last_name')
                        .first()];
            case 1:
                appointment = _a.sent();
                if (!appointment) {
                    return [2 /*return*/, res.status(404).json({ error: 'Appointment not found' })];
                }
                return [2 /*return*/, res.json(appointment)];
            case 2:
                error_2 = _a.sent();
                console.error('Error fetching appointment:', error_2);
                res.status(500).json({ error: 'Failed to fetch appointment' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Create appointment
router.post('/', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, patient_id, doctor_id, appointment_date, appointment_time, duration, type, notes, symptoms, existingAppointment, newAppointment, appointment, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, patient_id = _a.patient_id, doctor_id = _a.doctor_id, appointment_date = _a.appointment_date, appointment_time = _a.appointment_time, duration = _a.duration, type = _a.type, notes = _a.notes, symptoms = _a.symptoms;
                return [4 /*yield*/, (0, db_ts_1.default)('appointments')
                        .where({
                        doctor_id: doctor_id,
                        appointment_date: appointment_date,
                        appointment_time: appointment_time,
                        status: 'scheduled'
                    })
                        .first()];
            case 1:
                existingAppointment = _b.sent();
                if (existingAppointment) {
                    return [2 /*return*/, res.status(400).json({ error: 'Doctor is not available at this time' })];
                }
                return [4 /*yield*/, (0, db_ts_1.default)('appointments').insert({
                        patient_id: patient_id,
                        doctor_id: doctor_id,
                        appointment_date: appointment_date,
                        appointment_time: appointment_time,
                        duration: duration || 30,
                        type: type,
                        notes: notes,
                        symptoms: symptoms,
                        status: 'scheduled'
                    }).returning('*')];
            case 2:
                newAppointment = (_b.sent())[0];
                if (!!newAppointment) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, db_ts_1.default)('appointments')
                        .where({ patient_id: patient_id, doctor_id: doctor_id, appointment_date: appointment_date, appointment_time: appointment_time })
                        .first()];
            case 3:
                appointment = _b.sent();
                return [2 /*return*/, res.status(201).json(appointment)];
            case 4: return [2 /*return*/, res.status(201).json(newAppointment)];
            case 5:
                error_3 = _b.sent();
                console.error('Error creating appointment:', error_3);
                res.status(500).json({ error: 'Failed to create appointment' });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// Update appointment
router.put('/:id', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var updates, updatedAppointment, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                updates = req.body;
                delete updates.id;
                delete updates.created_at;
                return [4 /*yield*/, (0, db_ts_1.default)('appointments').where('id', req.params.id).update(__assign(__assign({}, updates), { updated_at: db_ts_1.default.fn.now() }))];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, db_ts_1.default)('appointments').where('id', req.params.id).first()];
            case 2:
                updatedAppointment = _a.sent();
                return [2 /*return*/, res.json(updatedAppointment)];
            case 3:
                error_4 = _a.sent();
                console.error('Error updating appointment:', error_4);
                res.status(500).json({ error: 'Failed to update appointment' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Cancel appointment
router.delete('/:id', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, db_ts_1.default)('appointments').where('id', req.params.id).update({
                        status: 'cancelled',
                        updated_at: db_ts_1.default.fn.now()
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/, res.json({ message: 'Appointment cancelled successfully' })];
            case 2:
                error_5 = _a.sent();
                console.error('Error cancelling appointment:', error_5);
                res.status(500).json({ error: 'Failed to cancel appointment' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Check doctor availability
router.get('/availability/:doctorId', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var date, appointments, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                date = req.query.date;
                if (!date) {
                    return [2 /*return*/, res.status(400).json({ error: 'Date is required' })];
                }
                return [4 /*yield*/, (0, db_ts_1.default)('appointments')
                        .where({
                        doctor_id: req.params.doctorId,
                        appointment_date: date,
                    })
                        .whereNot('status', 'cancelled')
                        .select('appointment_time', 'duration')];
            case 1:
                appointments = _a.sent();
                return [2 /*return*/, res.json(appointments)];
            case 2:
                error_6 = _a.sent();
                console.error('Error checking availability:', error_6);
                res.status(500).json({ error: 'Failed to check availability' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
