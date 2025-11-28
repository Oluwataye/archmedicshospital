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
// Get lab results (with filters)
router.get('/', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, patient_id, status_1, date_from, date_to, query, results, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query, patient_id = _a.patient_id, status_1 = _a.status, date_from = _a.date_from, date_to = _a.date_to;
                query = (0, db_ts_1.default)('lab_results')
                    .join('users as orderer', 'lab_results.ordered_by', 'orderer.id')
                    .leftJoin('users as performer', 'lab_results.performed_by', 'performer.id')
                    .select('lab_results.*', 'orderer.first_name as orderer_first_name', 'orderer.last_name as orderer_last_name', 'performer.first_name as performer_first_name', 'performer.last_name as performer_last_name');
                if (patient_id) {
                    query = query.where('lab_results.patient_id', patient_id);
                }
                if (status_1) {
                    query = query.where('lab_results.status', status_1);
                }
                if (date_from) {
                    query = query.where('lab_results.order_date', '>=', date_from);
                }
                if (date_to) {
                    query = query.where('lab_results.order_date', '<=', date_to);
                }
                return [4 /*yield*/, query.orderBy('lab_results.order_date', 'desc')];
            case 1:
                results = _b.sent();
                return [2 /*return*/, res.json(results)];
            case 2:
                error_1 = _b.sent();
                console.error('Error fetching lab results:', error_1);
                res.status(500).json({ error: 'Failed to fetch lab results' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get single lab result
router.get('/:id', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var result, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, db_ts_1.default)('lab_results')
                        .where('id', req.params.id)
                        .first()];
            case 1:
                result = _a.sent();
                if (!result) {
                    return [2 /*return*/, res.status(404).json({ error: 'Lab result not found' })];
                }
                return [2 /*return*/, res.json(result)];
            case 2:
                error_2 = _a.sent();
                console.error('Error fetching lab result:', error_2);
                res.status(500).json({ error: 'Failed to fetch lab result' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Create lab order
router.post('/', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, patient_id, test_type, test_name, order_date, status_2, notes, ordered_by, newOrder, order, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, patient_id = _a.patient_id, test_type = _a.test_type, test_name = _a.test_name, order_date = _a.order_date, status_2 = _a.status, notes = _a.notes;
                ordered_by = req.user.id;
                return [4 /*yield*/, (0, db_ts_1.default)('lab_results').insert({
                        patient_id: patient_id,
                        ordered_by: ordered_by,
                        test_type: test_type,
                        test_name: test_name,
                        order_date: order_date || new Date(),
                        status: status_2 || 'ordered',
                        // notes field not in schema but might be useful, ignored for now or map to interpretation if needed
                    }).returning('*')];
            case 1:
                newOrder = (_b.sent())[0];
                if (!!newOrder) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, db_ts_1.default)('lab_results')
                        .where({ patient_id: patient_id, ordered_by: ordered_by, test_name: test_name })
                        .orderBy('created_at', 'desc')
                        .first()];
            case 2:
                order = _b.sent();
                return [2 /*return*/, res.status(201).json(order)];
            case 3: return [2 /*return*/, res.status(201).json(newOrder)];
            case 4:
                error_3 = _b.sent();
                console.error('Error creating lab order:', error_3);
                res.status(500).json({ error: 'Failed to create lab order' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Update lab result (e.g. adding results)
router.put('/:id', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var updates, updatedResult, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                updates = req.body;
                delete updates.id;
                delete updates.created_at;
                delete updates.ordered_by;
                // If updating status to completed, set performed_by if not set
                if (updates.status === 'completed' && !updates.performed_by) {
                    updates.performed_by = req.user.id;
                    updates.result_date = new Date();
                }
                if (typeof updates.attachments === 'object')
                    updates.attachments = JSON.stringify(updates.attachments);
                return [4 /*yield*/, (0, db_ts_1.default)('lab_results').where('id', req.params.id).update(__assign(__assign({}, updates), { updated_at: db_ts_1.default.fn.now() }))];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, db_ts_1.default)('lab_results').where('id', req.params.id).first()];
            case 2:
                updatedResult = _a.sent();
                return [2 /*return*/, res.json(updatedResult)];
            case 3:
                error_4 = _a.sent();
                console.error('Error updating lab result:', error_4);
                res.status(500).json({ error: 'Failed to update lab result' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Cancel lab order
router.delete('/:id', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, db_ts_1.default)('lab_results').where('id', req.params.id).update({
                        status: 'cancelled',
                        updated_at: db_ts_1.default.fn.now()
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/, res.json({ message: 'Lab order cancelled successfully' })];
            case 2:
                error_5 = _a.sent();
                console.error('Error cancelling lab order:', error_5);
                res.status(500).json({ error: 'Failed to cancel lab order' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get pending orders
router.get('/pending/orders', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var pendingOrders, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, db_ts_1.default)('lab_results')
                        .join('patients', 'lab_results.patient_id', 'patients.id')
                        .where('lab_results.status', 'ordered')
                        .select('lab_results.*', 'patients.first_name as patient_first_name', 'patients.last_name as patient_last_name', 'patients.mrn as patient_mrn')
                        .orderBy('lab_results.order_date', 'asc')];
            case 1:
                pendingOrders = _a.sent();
                return [2 /*return*/, res.json(pendingOrders)];
            case 2:
                error_6 = _a.sent();
                console.error('Error fetching pending lab orders:', error_6);
                res.status(500).json({ error: 'Failed to fetch pending lab orders' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get patient lab history
router.get('/patient/:patientId/history', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var results, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, db_ts_1.default)('lab_results')
                        .where('patient_id', req.params.patientId)
                        .orderBy('order_date', 'desc')];
            case 1:
                results = _a.sent();
                return [2 /*return*/, res.json(results)];
            case 2:
                error_7 = _a.sent();
                console.error('Error fetching patient lab history:', error_7);
                res.status(500).json({ error: 'Failed to fetch patient lab history' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
