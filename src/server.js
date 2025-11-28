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
exports.io = void 0;
var express_1 = require("express");
var cors_1 = require("cors");
var helmet_1 = require("helmet");
var compression_1 = require("compression");
var morgan_1 = require("morgan");
var express_rate_limit_1 = require("express-rate-limit");
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var dotenv_1 = require("dotenv");
var errorHandler_1 = require("./middleware/errorHandler");
var logger_1 = require("./utils/logger");
var database_ts_1 = require("./config/database.ts");
// Import routes
var auth_routes_ts_1 = require("./server/routes/auth.routes.ts");
var users_routes_ts_1 = require("./server/routes/users.routes.ts");
var patients_routes_ts_1 = require("./server/routes/patients.routes.ts");
var appointments_routes_ts_1 = require("./server/routes/appointments.routes.ts");
var medical_records_routes_ts_1 = require("./server/routes/medical-records.routes.ts");
var vital_signs_routes_ts_1 = require("./server/routes/vital-signs.routes.ts");
var lab_routes_ts_1 = require("./server/routes/lab.routes.ts");
var prescriptions_routes_ts_1 = require("./server/routes/prescriptions.routes.ts");
// import analyticsRoutes from './routes/analytics';
// Load environment variables
dotenv_1.default.config();
var app = (0, express_1.default)();
var server = (0, http_1.createServer)(app);
// Socket.IO setup
var io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});
exports.io = io;
// Security middleware
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));
// CORS configuration
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Rate limiting
var limiter = (0, express_rate_limit_1.default)({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '15') * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX || '100'), // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);
// Compression and logging
app.use((0, compression_1.default)());
app.use((0, morgan_1.default)('combined', { stream: { write: function (message) { return logger_1.logger.info(message.trim()); } } }));
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Health check endpoint
app.get('/health', function (req, res) {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.env.npm_package_version || '1.0.0',
    });
});
// API routes
app.use('/api/auth', auth_routes_ts_1.default);
app.use('/api/users', users_routes_ts_1.default);
app.use('/api/patients', patients_routes_ts_1.default);
app.use('/api/appointments', appointments_routes_ts_1.default);
app.use('/api/medical-records', medical_records_routes_ts_1.default);
app.use('/api/vital-signs', vital_signs_routes_ts_1.default);
app.use('/api/lab-results', lab_routes_ts_1.default);
app.use('/api/prescriptions', prescriptions_routes_ts_1.default);
// app.use('/api/analytics', analyticsRoutes);
// Socket.IO connection handling
io.on('connection', function (socket) {
    logger_1.logger.info("Client connected: ".concat(socket.id));
    socket.on('authenticate', function (token) {
        // TODO: Implement socket authentication
        logger_1.logger.info("Socket authentication attempt: ".concat(socket.id));
    });
    socket.on('join-room', function (room) {
        socket.join(room);
        logger_1.logger.info("Socket ".concat(socket.id, " joined room: ").concat(room));
    });
    socket.on('leave-room', function (room) {
        socket.leave(room);
        logger_1.logger.info("Socket ".concat(socket.id, " left room: ").concat(room));
    });
    socket.on('disconnect', function () {
        logger_1.logger.info("Client disconnected: ".concat(socket.id));
    });
});
// Error handling middleware
app.use(errorHandler_1.notFoundHandler);
app.use(errorHandler_1.errorHandler);
// Start server
var PORT = process.env.PORT || 3001;
var HOST = process.env.HOST || 'localhost';
function startServer() {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    // Connect to database
                    return [4 /*yield*/, (0, database_ts_1.connectDatabase)()];
                case 1:
                    // Connect to database
                    _a.sent();
                    logger_1.logger.info('Database connected successfully');
                    // Start server
                    server.listen(PORT, function () {
                        logger_1.logger.info("Server running on http://".concat(HOST, ":").concat(PORT));
                        logger_1.logger.info("Environment: ".concat(process.env.NODE_ENV || 'development'));
                    });
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    logger_1.logger.error('Failed to start server:', error_1);
                    process.exit(1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Graceful shutdown
process.on('SIGTERM', function () {
    logger_1.logger.info('SIGTERM received, shutting down gracefully');
    server.close(function () {
        logger_1.logger.info('Process terminated');
        process.exit(0);
    });
});
process.on('SIGINT', function () {
    logger_1.logger.info('SIGINT received, shutting down gracefully');
    server.close(function () {
        logger_1.logger.info('Process terminated');
        process.exit(0);
    });
});
// Handle uncaught exceptions
process.on('uncaughtException', function (error) {
    logger_1.logger.error('Uncaught Exception:', error);
    process.exit(1);
});
process.on('unhandledRejection', function (reason, promise) {
    logger_1.logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
startServer();
