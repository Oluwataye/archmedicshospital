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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var auth_ts_1 = require("../middleware/auth.ts");
var db_ts_1 = require("../db.ts");
var router = express_1.default.Router();
// Get all users (Admin only)
router.get('/', auth_ts_1.auth, (0, auth_ts_1.authorize)(['admin']), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, role, search_1, query, users, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query, role = _a.role, search_1 = _a.search;
                query = (0, db_ts_1.default)('users').select('id', 'username', 'email', 'first_name', 'last_name', 'role', 'department', 'specialty', 'is_active', 'last_login', 'created_at');
                if (role) {
                    query = query.where('role', role);
                }
                if (search_1) {
                    query = query.where(function (builder) {
                        builder.where('first_name', 'like', "%".concat(search_1, "%"))
                            .orWhere('last_name', 'like', "%".concat(search_1, "%"))
                            .orWhere('email', 'like', "%".concat(search_1, "%"))
                            .orWhere('username', 'like', "%".concat(search_1, "%"));
                    });
                }
                return [4 /*yield*/, query];
            case 1:
                users = _b.sent();
                res.json(users);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                console.error('Error fetching users:', error_1);
                res.status(500).json({ error: 'Failed to fetch users' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get doctors list (Accessible by authenticated users)
router.get('/doctors/list', auth_ts_1.auth, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var doctors, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, db_ts_1.default)('users')
                        .where('role', 'doctor')
                        .where('is_active', true)
                        .select('id', 'first_name', 'last_name', 'specialty', 'department')];
            case 1:
                doctors = _a.sent();
                res.json(doctors);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error('Error fetching doctors:', error_2);
                res.status(500).json({ error: 'Failed to fetch doctors' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get user stats overview (Admin only)
router.get('/stats/overview', auth_ts_1.auth, (0, auth_ts_1.authorize)(['admin']), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var totalUsers, activeUsers, roleCounts, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, (0, db_ts_1.default)('users').count('id as count').first()];
            case 1:
                totalUsers = _a.sent();
                return [4 /*yield*/, (0, db_ts_1.default)('users').where('is_active', true).count('id as count').first()];
            case 2:
                activeUsers = _a.sent();
                return [4 /*yield*/, (0, db_ts_1.default)('users')
                        .select('role')
                        .count('id as count')
                        .groupBy('role')];
            case 3:
                roleCounts = _a.sent();
                res.json({
                    total: (totalUsers === null || totalUsers === void 0 ? void 0 : totalUsers.count) || 0,
                    active: (activeUsers === null || activeUsers === void 0 ? void 0 : activeUsers.count) || 0,
                    byRole: roleCounts
                });
                return [3 /*break*/, 5];
            case 4:
                error_3 = _a.sent();
                console.error('Error fetching user stats:', error_3);
                res.status(500).json({ error: 'Failed to fetch user stats' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Get single user
router.get('/:id', auth_ts_1.auth, (0, auth_ts_1.authorize)(['admin']), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, db_ts_1.default)('users')
                        .where('id', req.params.id)
                        .select('id', 'username', 'email', 'first_name', 'last_name', 'role', 'department', 'specialty', 'license_number', 'phone', 'is_active', 'created_at')
                        .first()];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ error: 'User not found' })];
                }
                res.json(user);
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                console.error('Error fetching user:', error_4);
                res.status(500).json({ error: 'Failed to fetch user' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Update user (Admin only)
router.put('/:id', auth_ts_1.auth, (0, auth_ts_1.authorize)(['admin']), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, password, updateData, updatedUser, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                _a = req.body, password = _a.password, updateData = __rest(_a, ["password"]);
                // Don't allow updating password directly through this endpoint
                // Use a separate endpoint or handle hashing if needed
                return [4 /*yield*/, (0, db_ts_1.default)('users').where('id', req.params.id).update(__assign(__assign({}, updateData), { updated_at: db_ts_1.default.fn.now() }))];
            case 1:
                // Don't allow updating password directly through this endpoint
                // Use a separate endpoint or handle hashing if needed
                _b.sent();
                return [4 /*yield*/, (0, db_ts_1.default)('users')
                        .where('id', req.params.id)
                        .select('id', 'username', 'email', 'first_name', 'last_name', 'role', 'department', 'specialty', 'is_active')
                        .first()];
            case 2:
                updatedUser = _b.sent();
                res.json(updatedUser);
                return [3 /*break*/, 4];
            case 3:
                error_5 = _b.sent();
                console.error('Error updating user:', error_5);
                res.status(500).json({ error: 'Failed to update user' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// Deactivate user (Admin only)
router.delete('/:id', auth_ts_1.auth, (0, auth_ts_1.authorize)(['admin']), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, db_ts_1.default)('users').where('id', req.params.id).update({
                        is_active: false,
                        updated_at: db_ts_1.default.fn.now()
                    })];
            case 1:
                _a.sent();
                res.json({ message: 'User deactivated successfully' });
                return [3 /*break*/, 3];
            case 2:
                error_6 = _a.sent();
                console.error('Error deactivating user:', error_6);
                res.status(500).json({ error: 'Failed to deactivate user' });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
