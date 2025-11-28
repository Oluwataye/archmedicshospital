"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFoundHandler = void 0;
var logger_1 = require("../utils/logger");
var notFoundHandler = function (req, res, next) {
    var error = new Error("Not Found - ".concat(req.originalUrl));
    res.status(404);
    next(error);
};
exports.notFoundHandler = notFoundHandler;
var errorHandler = function (err, req, res, next) {
    var statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    logger_1.logger.error("Error: ".concat(err.message, ", Stack: ").concat(err.stack));
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    });
};
exports.errorHandler = errorHandler;
