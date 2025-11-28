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
var axios_1 = require("axios");
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
var child_process_1 = require("child_process");
var API_URL = 'http://localhost:3001/api';
var authToken = '';
var hmoProviderId = '';
var packageId = '';
var tariffId = '';
var serviceCodeId = '';
var serverProcess;
function startServer() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log('Starting server...');
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    serverProcess = (0, child_process_1.spawn)('npx', ['ts-node', '--esm', '--experimental-specifier-resolution=node', 'src/server/index.ts'], {
                        cwd: process.cwd(),
                        stdio: 'inherit',
                        shell: true,
                    });
                    // Wait for server to start
                    setTimeout(function () {
                        resolve();
                    }, 5000);
                })];
        });
    });
}
function login() {
    return __awaiter(this, void 0, void 0, function () {
        var response, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    console.log('1. Logging in as admin...');
                    return [4 /*yield*/, axios_1.default.post("".concat(API_URL, "/auth/login"), {
                            email: 'admin@archmedics.com',
                            password: 'admin123'
                        })];
                case 1:
                    response = _b.sent();
                    authToken = response.data.token;
                    console.log('✅ Login successful');
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _b.sent();
                    console.error('❌ Login failed:', ((_a = error_1.response) === null || _a === void 0 ? void 0 : _a.data) || error_1.message);
                    process.exit(1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getHMOProvider() {
    return __awaiter(this, void 0, void 0, function () {
        var response, error_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    console.log('\n2. Fetching HMO Provider...');
                    return [4 /*yield*/, axios_1.default.get("".concat(API_URL, "/hmo/providers"), {
                            headers: { Authorization: "Bearer ".concat(authToken) }
                        })];
                case 1:
                    response = _b.sent();
                    if (response.data.length > 0) {
                        hmoProviderId = response.data[0].id;
                        console.log("\u2705 Found provider: ".concat(response.data[0].name, " (").concat(hmoProviderId, ")"));
                    }
                    else {
                        console.error('❌ No HMO providers found. Please seed data first.');
                        process.exit(1);
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _b.sent();
                    console.error('❌ Failed to fetch providers:', ((_a = error_2.response) === null || _a === void 0 ? void 0 : _a.data) || error_2.message);
                    process.exit(1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getServiceCode() {
    return __awaiter(this, void 0, void 0, function () {
        var response, error_3;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    console.log('\n3. Fetching a Service Code...');
                    return [4 /*yield*/, axios_1.default.get("".concat(API_URL, "/nhis/service-codes"), {
                            headers: { Authorization: "Bearer ".concat(authToken) },
                            params: { search: 'malaria' }
                        })];
                case 1:
                    response = _b.sent();
                    if (response.data.length > 0) {
                        serviceCodeId = response.data[0].id;
                        console.log("\u2705 Found service code: ".concat(response.data[0].code, " (").concat(serviceCodeId, ")"));
                    }
                    else {
                        console.error('❌ No service codes found. Please seed data first.');
                        process.exit(1);
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _b.sent();
                    console.error('❌ Failed to fetch service codes:', ((_a = error_3.response) === null || _a === void 0 ? void 0 : _a.data) || error_3.message);
                    process.exit(1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function testPackages() {
    return __awaiter(this, void 0, void 0, function () {
        var response, error_4, response, error_5, response, error_6;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    console.log('\n4. Testing Service Packages...');
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    console.log('   Creating package...');
                    return [4 /*yield*/, axios_1.default.post("".concat(API_URL, "/hmo/packages"), {
                            hmo_provider_id: hmoProviderId,
                            package_name: 'Test Gold Plan',
                            package_code: 'TGP-001',
                            annual_limit: 500000,
                            copay_percentage: 10,
                            services_covered: ['CON-001', 'LAB-001'],
                            exclusions: ['COS-001']
                        }, {
                            headers: { Authorization: "Bearer ".concat(authToken) }
                        })];
                case 2:
                    response = _d.sent();
                    packageId = response.data.id;
                    console.log('   ✅ Package created:', response.data.package_name);
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _d.sent();
                    console.error('   ❌ Failed to create package:', ((_a = error_4.response) === null || _a === void 0 ? void 0 : _a.data) || error_4.message);
                    return [3 /*break*/, 4];
                case 4:
                    _d.trys.push([4, 6, , 7]);
                    console.log('   Updating package...');
                    return [4 /*yield*/, axios_1.default.put("".concat(API_URL, "/hmo/packages/").concat(packageId), {
                            package_name: 'Test Gold Plan Updated',
                            annual_limit: 600000
                        }, {
                            headers: { Authorization: "Bearer ".concat(authToken) }
                        })];
                case 5:
                    response = _d.sent();
                    console.log('   ✅ Package updated:', response.data.package_name);
                    return [3 /*break*/, 7];
                case 6:
                    error_5 = _d.sent();
                    console.error('   ❌ Failed to update package:', ((_b = error_5.response) === null || _b === void 0 ? void 0 : _b.data) || error_5.message);
                    return [3 /*break*/, 7];
                case 7:
                    _d.trys.push([7, 9, , 10]);
                    console.log('   Fetching packages for provider...');
                    return [4 /*yield*/, axios_1.default.get("".concat(API_URL, "/hmo/providers/").concat(hmoProviderId, "/packages"), {
                            headers: { Authorization: "Bearer ".concat(authToken) }
                        })];
                case 8:
                    response = _d.sent();
                    console.log("   \u2705 Fetched ".concat(response.data.length, " packages"));
                    return [3 /*break*/, 10];
                case 9:
                    error_6 = _d.sent();
                    console.error('   ❌ Failed to fetch packages:', ((_c = error_6.response) === null || _c === void 0 ? void 0 : _c.data) || error_6.message);
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
}
function testTariffs() {
    return __awaiter(this, void 0, void 0, function () {
        var response, error_7, response, error_8, response, error_9;
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    console.log('\n5. Testing Tariffs...');
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 3, , 4]);
                    console.log('   Creating tariff...');
                    return [4 /*yield*/, axios_1.default.post("".concat(API_URL, "/hmo/tariffs"), {
                            hmo_provider_id: hmoProviderId,
                            service_code_id: serviceCodeId,
                            tariff_amount: 5000,
                            copay_amount: 500,
                            effective_from: new Date().toISOString().split('T')[0]
                        }, {
                            headers: { Authorization: "Bearer ".concat(authToken) }
                        })];
                case 2:
                    response = _d.sent();
                    tariffId = response.data.id;
                    console.log('   ✅ Tariff created for service:', response.data.service_code_id);
                    return [3 /*break*/, 4];
                case 3:
                    error_7 = _d.sent();
                    console.error('   ❌ Failed to create tariff:', ((_a = error_7.response) === null || _a === void 0 ? void 0 : _a.data) || error_7.message);
                    return [3 /*break*/, 4];
                case 4:
                    _d.trys.push([4, 6, , 7]);
                    console.log('   Updating tariff...');
                    return [4 /*yield*/, axios_1.default.put("".concat(API_URL, "/hmo/tariffs/").concat(tariffId), {
                            tariff_amount: 5500
                        }, {
                            headers: { Authorization: "Bearer ".concat(authToken) }
                        })];
                case 5:
                    response = _d.sent();
                    console.log('   ✅ Tariff updated amount:', response.data.tariff_amount);
                    return [3 /*break*/, 7];
                case 6:
                    error_8 = _d.sent();
                    console.error('   ❌ Failed to update tariff:', ((_b = error_8.response) === null || _b === void 0 ? void 0 : _b.data) || error_8.message);
                    return [3 /*break*/, 7];
                case 7:
                    _d.trys.push([7, 9, , 10]);
                    console.log('   Fetching tariffs for provider...');
                    return [4 /*yield*/, axios_1.default.get("".concat(API_URL, "/hmo/providers/").concat(hmoProviderId, "/tariffs"), {
                            headers: { Authorization: "Bearer ".concat(authToken) }
                        })];
                case 8:
                    response = _d.sent();
                    console.log("   \u2705 Fetched ".concat(response.data.length, " tariffs"));
                    return [3 /*break*/, 10];
                case 9:
                    error_9 = _d.sent();
                    console.error('   ❌ Failed to fetch tariffs:', ((_c = error_9.response) === null || _c === void 0 ? void 0 : _c.data) || error_9.message);
                    return [3 /*break*/, 10];
                case 10: return [2 /*return*/];
            }
        });
    });
}
function cleanup() {
    return __awaiter(this, void 0, void 0, function () {
        var error_10, error_11;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    console.log('\n6. Cleaning up...');
                    if (!tariffId) return [3 /*break*/, 4];
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.delete("".concat(API_URL, "/hmo/tariffs/").concat(tariffId), {
                            headers: { Authorization: "Bearer ".concat(authToken) }
                        })];
                case 2:
                    _c.sent();
                    console.log('   ✅ Tariff deleted');
                    return [3 /*break*/, 4];
                case 3:
                    error_10 = _c.sent();
                    console.error('   ❌ Failed to delete tariff:', ((_a = error_10.response) === null || _a === void 0 ? void 0 : _a.data) || error_10.message);
                    return [3 /*break*/, 4];
                case 4:
                    if (!packageId) return [3 /*break*/, 8];
                    _c.label = 5;
                case 5:
                    _c.trys.push([5, 7, , 8]);
                    return [4 /*yield*/, axios_1.default.delete("".concat(API_URL, "/hmo/packages/").concat(packageId), {
                            headers: { Authorization: "Bearer ".concat(authToken) }
                        })];
                case 6:
                    _c.sent();
                    console.log('   ✅ Package deleted');
                    return [3 /*break*/, 8];
                case 7:
                    error_11 = _c.sent();
                    console.error('   ❌ Failed to delete package:', ((_b = error_11.response) === null || _b === void 0 ? void 0 : _b.data) || error_11.message);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function () {
        var error_12;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, 9, 10]);
                    return [4 /*yield*/, startServer()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, login()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, getHMOProvider()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, getServiceCode()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, testPackages()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, testTariffs()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, cleanup()];
                case 7:
                    _a.sent();
                    return [3 /*break*/, 10];
                case 8:
                    error_12 = _a.sent();
                    console.error('Test failed:', error_12);
                    return [3 /*break*/, 10];
                case 9:
                    if (serverProcess) {
                        console.log('\nStopping server...');
                        (0, child_process_1.spawn)("taskkill", ["/pid", serverProcess.pid, '/f', '/t']);
                    }
                    process.exit(0);
                    return [7 /*endfinally*/];
                case 10: return [2 /*return*/];
            }
        });
    });
}
run();
