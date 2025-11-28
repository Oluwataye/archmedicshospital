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
exports.healthRecordsService = void 0;
// Simple in-memory storage for health records (in a real app, this would use an API or database)
var healthRecords = [];
exports.healthRecordsService = {
    // Get all records
    getAllRecords: function () {
        return __spreadArray([], healthRecords, true);
    },
    // Get records by patient ID
    getRecordsByPatient: function (patientId) {
        return healthRecords.filter(function (record) { return record.patientId === patientId; });
    },
    // Get records by type
    getRecordsByType: function (patientId, type) {
        return healthRecords.filter(function (record) { return record.patientId === patientId && record.recordType === type; });
    },
    // Add a new record
    addRecord: function (record) {
        var newRecord = record;
        healthRecords.push(newRecord);
        return newRecord;
    },
    // Update a record
    updateRecord: function (recordId, updatedData) {
        var index = healthRecords.findIndex(function (record) { return record.id === recordId; });
        if (index !== -1) {
            healthRecords[index] = __assign(__assign({}, healthRecords[index]), updatedData);
            return healthRecords[index];
        }
        return null;
    },
    // Delete a record
    deleteRecord: function (recordId) {
        var index = healthRecords.findIndex(function (record) { return record.id === recordId; });
        if (index !== -1) {
            var deletedRecord = healthRecords[index];
            healthRecords = healthRecords.filter(function (record) { return record.id !== recordId; });
            return deletedRecord;
        }
        return null;
    }
};
