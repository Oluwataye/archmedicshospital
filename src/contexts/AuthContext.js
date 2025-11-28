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
exports.AuthProvider = exports.useAuth = void 0;
var react_1 = require("react");
var apiService_1 = require("../services/apiService");
var initialState = {
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
};
var authReducer = function (state, action) {
    switch (action.type) {
        case 'LOGIN_START':
            return __assign(__assign({}, state), { isLoading: true, error: null });
        case 'LOGIN_SUCCESS':
            return __assign(__assign({}, state), { user: __assign(__assign({}, action.payload), { name: "".concat(action.payload.firstName, " ").concat(action.payload.lastName) }), isAuthenticated: true, isLoading: false, error: null });
        case 'LOGIN_FAILURE':
            return __assign(__assign({}, state), { user: null, isAuthenticated: false, isLoading: false, error: action.payload });
        case 'LOGOUT':
            return __assign(__assign({}, state), { user: null, isAuthenticated: false, isLoading: false, error: null });
        case 'SET_LOADING':
            return __assign(__assign({}, state), { isLoading: action.payload });
        case 'CLEAR_ERROR':
            return __assign(__assign({}, state), { error: null });
        case 'UPDATE_PROFILE':
            return __assign(__assign({}, state), { user: state.user ? __assign(__assign(__assign({}, state.user), action.payload), { name: action.payload.firstName && action.payload.lastName
                        ? "".concat(action.payload.firstName, " ").concat(action.payload.lastName)
                        : state.user.name }) : null });
        default:
            return state;
    }
};
var AuthContext = (0, react_1.createContext)(undefined);
var useAuth = function () {
    var context = (0, react_1.useContext)(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
exports.useAuth = useAuth;
var AuthProvider = function (_a) {
    var children = _a.children;
    var _b = (0, react_1.useReducer)(authReducer, initialState), state = _b[0], dispatch = _b[1];
    // Check for existing authentication on app load
    (0, react_1.useEffect)(function () {
        var checkAuth = function () { return __awaiter(void 0, void 0, void 0, function () {
            var token, user, profile, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        token = localStorage.getItem('authToken');
                        user = localStorage.getItem('user');
                        if (!(token && user)) return [3 /*break*/, 2];
                        return [4 /*yield*/, apiService_1.ApiService.getProfile()];
                    case 1:
                        profile = _a.sent();
                        dispatch({ type: 'LOGIN_SUCCESS', payload: profile });
                        return [3 /*break*/, 3];
                    case 2:
                        dispatch({ type: 'SET_LOADING', payload: false });
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        // Token is invalid, clear storage
                        localStorage.removeItem('authToken');
                        localStorage.removeItem('refreshToken');
                        localStorage.removeItem('user');
                        dispatch({ type: 'SET_LOADING', payload: false });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        checkAuth();
    }, []);
    var login = function (email, password) { return __awaiter(void 0, void 0, void 0, function () {
        var response, token, refreshToken, user, error_2, errorMessage;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    dispatch({ type: 'LOGIN_START' });
                    return [4 /*yield*/, apiService_1.ApiService.login(email, password)];
                case 1:
                    response = _c.sent();
                    token = response.token, refreshToken = response.refreshToken, user = response.user;
                    // Store tokens and user data
                    localStorage.setItem('authToken', token);
                    localStorage.setItem('refreshToken', refreshToken);
                    localStorage.setItem('user', JSON.stringify(user));
                    dispatch({ type: 'LOGIN_SUCCESS', payload: user });
                    return [2 /*return*/, true];
                case 2:
                    error_2 = _c.sent();
                    errorMessage = ((_b = (_a = error_2.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) || 'Login failed. Please try again.';
                    dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    var logout = function () { return __awaiter(void 0, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    return [4 /*yield*/, apiService_1.ApiService.logout()];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 2:
                    error_3 = _a.sent();
                    // Continue with logout even if API call fails
                    console.error('Logout API call failed:', error_3);
                    return [3 /*break*/, 4];
                case 3:
                    // Clear local storage
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('user');
                    dispatch({ type: 'LOGOUT' });
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var clearError = function () {
        dispatch({ type: 'CLEAR_ERROR' });
    };
    var updateProfile = function (data) {
        dispatch({ type: 'UPDATE_PROFILE', payload: data });
        // Update localStorage
        if (state.user) {
            var updatedUser = __assign(__assign({}, state.user), data);
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
    };
    var value = __assign(__assign({}, state), { login: login, logout: logout, clearError: clearError, updateProfile: updateProfile, loading: state.isLoading });
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
exports.AuthProvider = AuthProvider;
