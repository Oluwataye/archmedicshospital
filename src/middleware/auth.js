"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.authenticateToken = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var logger_1 = require("../utils/logger");
var authenticateToken = function (req, res, next) {
    var authHeader = req.headers['authorization'];
    var token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    if (!token) {
        res.status(401).json({ message: 'Access token required' });
        return;
    }
    try {
        var decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        logger_1.logger.error('Token verification error:', error);
        res.status(403).json({ message: 'Invalid or expired token' });
        return;
    }
};
exports.authenticateToken = authenticateToken;
var authorizeRoles = function () {
    var roles = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        roles[_i] = arguments[_i];
    }
    return function (req, res, next) {
        if (!req.user) {
            res.status(401).json({ message: 'Authentication required' });
            return;
        }
        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                message: 'Insufficient permissions',
                requiredRoles: roles,
                userRole: req.user.role
            });
            return;
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
