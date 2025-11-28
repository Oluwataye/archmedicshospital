"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var knex_1 = require("knex");
var knexfile_ts_1 = require("../../knexfile.ts");
var environment = process.env.NODE_ENV || 'development';
var db = (0, knex_1.default)(knexfile_ts_1.default[environment]);
exports.default = db;
