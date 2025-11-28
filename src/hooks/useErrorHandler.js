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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useErrorHandler = exports.ErrorSeverity = void 0;
var react_1 = require("react");
var sonner_1 = require("sonner");
// Error code mappings for user-friendly messages
var ERROR_MESSAGES = {
    // Network errors
    NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
    TIMEOUT_ERROR: 'Request timed out. Please try again.',
    // Authentication errors
    UNAUTHORIZED: 'You are not authorized to perform this action. Please log in again.',
    FORBIDDEN: 'You do not have permission to access this resource.',
    TOKEN_EXPIRED: 'Your session has expired. Please log in again.',
    INVALID_CREDENTIALS: 'Invalid email or password. Please try again.',
    // Validation errors
    VALIDATION_ERROR: 'Please check your input and try again.',
    REQUIRED_FIELD: 'This field is required.',
    INVALID_EMAIL: 'Please enter a valid email address.',
    INVALID_PHONE: 'Please enter a valid phone number.',
    INVALID_DATE: 'Please enter a valid date.',
    // Patient errors
    PATIENT_NOT_FOUND: 'Patient not found. Please verify the patient ID.',
    PATIENT_ALREADY_EXISTS: 'A patient with this information already exists.',
    PATIENT_UPDATE_FAILED: 'Failed to update patient information. Please try again.',
    // Appointment errors
    APPOINTMENT_NOT_FOUND: 'Appointment not found.',
    APPOINTMENT_CONFLICT: 'This time slot is already booked. Please choose another time.',
    APPOINTMENT_PAST_DATE: 'Cannot schedule appointments in the past.',
    APPOINTMENT_CANCELLATION_FAILED: 'Failed to cancel appointment. Please try again.',
    // Medical record errors
    RECORD_NOT_FOUND: 'Medical record not found.',
    RECORD_ACCESS_DENIED: 'You do not have permission to access this medical record.',
    RECORD_UPDATE_FAILED: 'Failed to update medical record. Please try again.',
    // Lab result errors
    LAB_RESULT_NOT_FOUND: 'Lab result not found.',
    LAB_ORDER_FAILED: 'Failed to create lab order. Please try again.',
    CRITICAL_RESULT_NOTIFICATION_FAILED: 'Failed to send critical result notification.',
    // Prescription errors
    PRESCRIPTION_NOT_FOUND: 'Prescription not found.',
    PRESCRIPTION_EXPIRED: 'This prescription has expired.',
    DRUG_INTERACTION: 'Potential drug interaction detected. Please review.',
    ALLERGY_ALERT: 'Patient has a known allergy to this medication.',
    // File upload errors
    FILE_TOO_LARGE: 'File size exceeds the maximum limit.',
    INVALID_FILE_TYPE: 'Invalid file type. Please upload a supported format.',
    UPLOAD_FAILED: 'File upload failed. Please try again.',
    // Server errors
    SERVER_ERROR: 'An internal server error occurred. Please try again later.',
    SERVICE_UNAVAILABLE: 'Service is temporarily unavailable. Please try again later.',
    DATABASE_ERROR: 'Database error occurred. Please contact support.',
    // Generic errors
    UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
    OPERATION_FAILED: 'Operation failed. Please try again.',
};
// Error severity levels
var ErrorSeverity;
(function (ErrorSeverity) {
    ErrorSeverity["LOW"] = "low";
    ErrorSeverity["MEDIUM"] = "medium";
    ErrorSeverity["HIGH"] = "high";
    ErrorSeverity["CRITICAL"] = "critical";
})(ErrorSeverity || (exports.ErrorSeverity = ErrorSeverity = {}));
// Get error severity based on error code
var getErrorSeverity = function (code) {
    var criticalErrors = ['SERVER_ERROR', 'DATABASE_ERROR', 'CRITICAL_RESULT_NOTIFICATION_FAILED'];
    var highErrors = ['UNAUTHORIZED', 'FORBIDDEN', 'TOKEN_EXPIRED', 'DRUG_INTERACTION', 'ALLERGY_ALERT'];
    var mediumErrors = ['VALIDATION_ERROR', 'APPOINTMENT_CONFLICT', 'PATIENT_NOT_FOUND'];
    if (criticalErrors.includes(code))
        return ErrorSeverity.CRITICAL;
    if (highErrors.includes(code))
        return ErrorSeverity.HIGH;
    if (mediumErrors.includes(code))
        return ErrorSeverity.MEDIUM;
    return ErrorSeverity.LOW;
};
// Convert unknown error to AppError
var normalizeError = function (error, context) {
    if (error instanceof Error) {
        // Handle fetch/network errors
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            return {
                code: 'NETWORK_ERROR',
                message: ERROR_MESSAGES.NETWORK_ERROR,
                details: error.message,
                timestamp: new Date(),
                context: context,
            };
        }
        // Handle timeout errors
        if (error.name === 'AbortError' || error.message.includes('timeout')) {
            return {
                code: 'TIMEOUT_ERROR',
                message: ERROR_MESSAGES.TIMEOUT_ERROR,
                details: error.message,
                timestamp: new Date(),
                context: context,
            };
        }
        // Handle API response errors
        if (error.message.includes('401')) {
            return {
                code: 'UNAUTHORIZED',
                message: ERROR_MESSAGES.UNAUTHORIZED,
                details: error.message,
                timestamp: new Date(),
                context: context,
            };
        }
        if (error.message.includes('403')) {
            return {
                code: 'FORBIDDEN',
                message: ERROR_MESSAGES.FORBIDDEN,
                details: error.message,
                timestamp: new Date(),
                context: context,
            };
        }
        if (error.message.includes('404')) {
            return {
                code: 'NOT_FOUND',
                message: 'The requested resource was not found.',
                details: error.message,
                timestamp: new Date(),
                context: context,
            };
        }
        if (error.message.includes('500')) {
            return {
                code: 'SERVER_ERROR',
                message: ERROR_MESSAGES.SERVER_ERROR,
                details: error.message,
                timestamp: new Date(),
                context: context,
            };
        }
        // Generic error
        return {
            code: 'UNKNOWN_ERROR',
            message: error.message || ERROR_MESSAGES.UNKNOWN_ERROR,
            details: error.stack,
            timestamp: new Date(),
            context: context,
        };
    }
    // Handle string errors
    if (typeof error === 'string') {
        return {
            code: 'UNKNOWN_ERROR',
            message: error,
            timestamp: new Date(),
            context: context,
        };
    }
    // Handle object errors (e.g., from API responses)
    if (typeof error === 'object' && error !== null) {
        var errorObj = error;
        return {
            code: errorObj.code || 'UNKNOWN_ERROR',
            message: errorObj.message || ERROR_MESSAGES.UNKNOWN_ERROR,
            details: errorObj.details || errorObj,
            timestamp: new Date(),
            context: context,
        };
    }
    // Fallback for unknown error types
    return {
        code: 'UNKNOWN_ERROR',
        message: ERROR_MESSAGES.UNKNOWN_ERROR,
        details: error,
        timestamp: new Date(),
        context: context,
    };
};
// Show toast notification based on error severity
var showErrorToast = function (error) {
    var severity = getErrorSeverity(error.code);
    switch (severity) {
        case ErrorSeverity.CRITICAL:
            sonner_1.toast.error(error.message, {
                duration: 10000,
                description: 'Please contact system administrator if this persists.',
            });
            break;
        case ErrorSeverity.HIGH:
            sonner_1.toast.error(error.message, {
                duration: 8000,
            });
            break;
        case ErrorSeverity.MEDIUM:
            sonner_1.toast.warning(error.message, {
                duration: 6000,
            });
            break;
        case ErrorSeverity.LOW:
        default:
            sonner_1.toast.error(error.message, {
                duration: 4000,
            });
            break;
    }
};
// Log error for monitoring/debugging
var logError = function (error) {
    var severity = getErrorSeverity(error.code);
    var logData = {
        timestamp: error.timestamp.toISOString(),
        code: error.code,
        message: error.message,
        context: error.context,
        severity: severity,
        details: error.details,
        userAgent: navigator.userAgent,
        url: window.location.href,
    };
    // In production, send to error monitoring service
    if (process.env.NODE_ENV === 'production') {
        // Example: Send to Sentry, LogRocket, or custom error service
        console.error('[Error Logged]', logData);
    }
    else {
        console.error('[Development Error]', logData);
    }
};
var useErrorHandler = function () {
    var _a = (0, react_1.useState)({
        error: null,
        isLoading: false,
        hasError: false,
    }), errorState = _a[0], setErrorState = _a[1];
    var setError = (0, react_1.useCallback)(function (error) {
        setErrorState(function (prev) { return (__assign(__assign({}, prev), { error: error, hasError: error !== null })); });
    }, []);
    var clearError = (0, react_1.useCallback)(function () {
        setErrorState(function (prev) { return (__assign(__assign({}, prev), { error: null, hasError: false })); });
    }, []);
    var handleError = (0, react_1.useCallback)(function (error, context, showToast) {
        if (showToast === void 0) { showToast = true; }
        var normalizedError = normalizeError(error, context);
        // Log the error
        logError(normalizedError);
        // Show toast notification if requested
        if (showToast) {
            showErrorToast(normalizedError);
        }
        // Update error state
        setError(normalizedError);
        return normalizedError;
    }, [setError]);
    var handleAsync = (0, react_1.useCallback)(function (asyncFn_1) {
        var args_1 = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args_1[_i - 1] = arguments[_i];
        }
        return __awaiter(void 0, __spreadArray([asyncFn_1], args_1, true), void 0, function (asyncFn, options) {
            var _a, showToast, context, onError, onSuccess, result, error_1, appError;
            if (options === void 0) { options = {}; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = options.showToast, showToast = _a === void 0 ? true : _a, context = options.context, onError = options.onError, onSuccess = options.onSuccess;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        // Clear previous errors
                        clearError();
                        // Set loading state
                        setErrorState(function (prev) { return (__assign(__assign({}, prev), { isLoading: true })); });
                        return [4 /*yield*/, asyncFn()];
                    case 2:
                        result = _b.sent();
                        // Clear loading state
                        setErrorState(function (prev) { return (__assign(__assign({}, prev), { isLoading: false })); });
                        // Call success callback
                        if (onSuccess) {
                            onSuccess(result);
                        }
                        return [2 /*return*/, result];
                    case 3:
                        error_1 = _b.sent();
                        // Clear loading state
                        setErrorState(function (prev) { return (__assign(__assign({}, prev), { isLoading: false })); });
                        appError = handleError(error_1, context, showToast);
                        // Call error callback
                        if (onError) {
                            onError(appError);
                        }
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }, [clearError, handleError]);
    return {
        error: errorState.error,
        isLoading: errorState.isLoading,
        hasError: errorState.hasError,
        setError: setError,
        clearError: clearError,
        handleAsync: handleAsync,
        handleError: handleError,
    };
};
exports.useErrorHandler = useErrorHandler;
exports.default = exports.useErrorHandler;
