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
var bcryptjs_1 = require("bcryptjs");
var jsonwebtoken_1 = require("jsonwebtoken");
var zod_1 = require("zod");
var db_ts_1 = require("../server/db.ts");
var logger_1 = require("../utils/logger");
var auth_1 = require("../middleware/auth");
var router = express_1.default.Router();
// Validation schemas
var loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
var registerSchema = zod_1.z.object({
    username: zod_1.z.string().min(3).max(50),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    firstName: zod_1.z.string().min(1).max(100),
    lastName: zod_1.z.string().min(1).max(100),
    role: zod_1.z.enum(['admin', 'doctor', 'nurse', 'pharmacist', 'labtech', 'cashier', 'ehr']),
    department: zod_1.z.string().optional(),
    specialty: zod_1.z.string().optional(),
    licenseNumber: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
});
// Login endpoint
router.post('/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, user, isValidPassword, tokenOptions, token, refreshTokenOptions, refreshToken, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = loginSchema.parse(req.body), email = _a.email, password = _a.password;
                return [4 /*yield*/, (0, db_ts_1.default)('users')
                        .where({ email: email, is_active: true })
                        .first()];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(401).json({ message: 'Invalid credentials' })];
                }
                return [4 /*yield*/, bcryptjs_1.default.compare(password, user.password_hash)];
            case 2:
                isValidPassword = _b.sent();
                if (!isValidPassword) {
                    return [2 /*return*/, res.status(401).json({ message: 'Invalid credentials' })];
                }
                // Update last login
                return [4 /*yield*/, (0, db_ts_1.default)('users')
                        .where({ id: user.id })
                        .update({ last_login: new Date() })];
            case 3:
                // Update last login
                _b.sent();
                tokenOptions = { expiresIn: process.env.JWT_EXPIRES_IN || '24h' };
                token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, tokenOptions);
                refreshTokenOptions = { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' };
                refreshToken = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, refreshTokenOptions);
                logger_1.logger.info("User logged in: ".concat(user.email));
                return [2 /*return*/, res.json({
                        token: token,
                        refreshToken: refreshToken,
                        user: {
                            id: user.id,
                            username: user.username,
                            email: user.email,
                            firstName: user.first_name,
                            lastName: user.last_name,
                            role: user.role,
                            department: user.department,
                            specialty: user.specialty,
                            licenseNumber: user.license_number,
                            phone: user.phone,
                        },
                    })];
            case 4:
                error_1 = _b.sent();
                if (error_1 instanceof zod_1.z.ZodError) {
                    return [2 /*return*/, res.status(400).json({ message: 'Invalid input', errors: error_1.errors })];
                }
                logger_1.logger.error('Login error:', error_1);
                return [2 /*return*/, res.status(500).json({ message: 'Internal server error' })];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Register endpoint (admin only)
router.post('/register', auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userData, existingUser, saltRounds, passwordHash, newUser, error_2;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 4, , 5]);
                // Only admins can register new users
                if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'admin') {
                    return [2 /*return*/, res.status(403).json({ message: 'Only administrators can register new users' })];
                }
                userData = registerSchema.parse(req.body);
                return [4 /*yield*/, (0, db_ts_1.default)('users')
                        .where('email', userData.email)
                        .orWhere('username', userData.username)
                        .first()];
            case 1:
                existingUser = _c.sent();
                if (existingUser) {
                    return [2 /*return*/, res.status(409).json({ message: 'User already exists' })];
                }
                saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
                return [4 /*yield*/, bcryptjs_1.default.hash(userData.password, saltRounds)];
            case 2:
                passwordHash = _c.sent();
                return [4 /*yield*/, (0, db_ts_1.default)('users')
                        .insert({
                        username: userData.username,
                        email: userData.email,
                        password_hash: passwordHash,
                        first_name: userData.firstName,
                        last_name: userData.lastName,
                        role: userData.role,
                        department: userData.department,
                        specialty: userData.specialty,
                        license_number: userData.licenseNumber,
                        phone: userData.phone,
                    })
                        .returning(['id', 'username', 'email', 'first_name', 'last_name', 'role', 'department', 'specialty', 'license_number', 'phone', 'created_at'])];
            case 3:
                newUser = (_c.sent())[0];
                logger_1.logger.info("New user registered: ".concat(newUser.email, " by ").concat((_b = req.user) === null || _b === void 0 ? void 0 : _b.email));
                return [2 /*return*/, res.status(201).json({
                        message: 'User registered successfully',
                        user: {
                            id: newUser.id,
                            username: newUser.username,
                            email: newUser.email,
                            firstName: newUser.first_name,
                            lastName: newUser.last_name,
                            role: newUser.role,
                            department: newUser.department,
                            specialty: newUser.specialty,
                            licenseNumber: newUser.license_number,
                            phone: newUser.phone,
                            createdAt: newUser.created_at,
                        },
                    })];
            case 4:
                error_2 = _c.sent();
                if (error_2 instanceof zod_1.z.ZodError) {
                    return [2 /*return*/, res.status(400).json({ message: 'Invalid input', errors: error_2.errors })];
                }
                logger_1.logger.error('Registration error:', error_2);
                return [2 /*return*/, res.status(500).json({ message: 'Internal server error' })];
            case 5: return [2 /*return*/];
        }
    });
}); });
// Refresh token endpoint
router.post('/refresh', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var refreshToken, decoded, user, tokenOptions, token, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                refreshToken = req.body.refreshToken;
                if (!refreshToken) {
                    return [2 /*return*/, res.status(401).json({ message: 'Refresh token required' })];
                }
                decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_SECRET);
                return [4 /*yield*/, (0, db_ts_1.default)('users')
                        .where({ id: decoded.id, is_active: true })
                        .first()];
            case 1:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(401).json({ message: 'Invalid refresh token' })];
                }
                tokenOptions = { expiresIn: process.env.JWT_EXPIRES_IN || '24h' };
                token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, tokenOptions);
                return [2 /*return*/, res.json({ token: token })];
            case 2:
                error_3 = _a.sent();
                logger_1.logger.error('Token refresh error:', error_3);
                return [2 /*return*/, res.status(401).json({ message: 'Invalid refresh token' })];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get current user profile
router.get('/profile', auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, error_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                return [4 /*yield*/, (0, db_ts_1.default)('users')
                        .where({ id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id })
                        .select(['id', 'username', 'email', 'first_name', 'last_name', 'role', 'department', 'specialty', 'license_number', 'phone', 'last_login', 'created_at'])
                        .first()];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ message: 'User not found' })];
                }
                return [2 /*return*/, res.json({
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        firstName: user.first_name,
                        lastName: user.last_name,
                        role: user.role,
                        department: user.department,
                        specialty: user.specialty,
                        licenseNumber: user.license_number,
                        phone: user.phone,
                        lastLogin: user.last_login,
                        createdAt: user.created_at,
                    })];
            case 2:
                error_4 = _b.sent();
                logger_1.logger.error('Profile fetch error:', error_4);
                return [2 /*return*/, res.status(500).json({ message: 'Internal server error' })];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Logout endpoint
router.post('/logout', auth_1.authenticateToken, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        try {
            // In a more sophisticated implementation, you might want to blacklist the token
            logger_1.logger.info("User logged out: ".concat((_a = req.user) === null || _a === void 0 ? void 0 : _a.email));
            return [2 /*return*/, res.json({ message: 'Logged out successfully' })];
        }
        catch (error) {
            logger_1.logger.error('Logout error:', error);
            return [2 /*return*/, res.status(500).json({ message: 'Internal server error' })];
        }
        return [2 /*return*/];
    });
}); });
exports.default = router;
