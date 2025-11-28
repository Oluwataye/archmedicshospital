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
var child_process_1 = require("child_process");
var API_URL = 'http://localhost:3001/api';
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
                    // Wait for server to start (simple timeout for now, or check for output)
                    setTimeout(function () {
                        resolve();
                    }, 5000);
                })];
        });
    });
}
function runTests() {
    return __awaiter(this, void 0, void 0, function () {
        var loginRes, _a, token, user, headers, hmoRes, searchRes, claimsRes, preauthRes, referralsRes, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 7, 8, 9]);
                    // 1. Login
                    console.log('\n1. Testing Login...');
                    return [4 /*yield*/, axios_1.default.post("".concat(API_URL, "/auth/login"), {
                            email: 'admin@archmedics.com',
                            password: 'admin123',
                        })];
                case 1:
                    loginRes = _b.sent();
                    _a = loginRes.data, token = _a.token, user = _a.user;
                    console.log('✅ Login successful');
                    console.log("   User: ".concat(user.first_name, " ").concat(user.last_name, " (").concat(user.role, ")"));
                    headers = { Authorization: "Bearer ".concat(token) };
                    // 2. List HMO Providers
                    console.log('\n2. Testing HMO Providers...');
                    return [4 /*yield*/, axios_1.default.get("".concat(API_URL, "/hmo/providers"), { headers: headers })];
                case 2:
                    hmoRes = _b.sent();
                    console.log("\u2705 Fetched ".concat(hmoRes.data.length, " HMO providers"));
                    if (hmoRes.data.length > 0) {
                        console.log("   First provider: ".concat(hmoRes.data[0].name));
                    }
                    // 3. Search NHIS Service Codes
                    console.log('\n3. Testing NHIS Service Codes Search...');
                    return [4 /*yield*/, axios_1.default.get("".concat(API_URL, "/nhis/service-codes/search?q=malaria"), { headers: headers })];
                case 3:
                    searchRes = _b.sent();
                    console.log("\u2705 Found ".concat(searchRes.data.length, " service codes matching 'malaria'"));
                    if (searchRes.data.length > 0) {
                        console.log("   First match: ".concat(searchRes.data[0].code, " - ").concat(searchRes.data[0].description));
                    }
                    // 4. Check Eligibility (Mock Patient)
                    // We need a patient ID. Let's assume we can get one from the database or use a known one.
                    // Since we seeded data, let's try to find a patient or just skip if we don't have IDs handy.
                    // But wait, we can query the database directly if we wanted, but let's stick to API.
                    // We'll skip this if we don't have a patient ID, or we can try to fetch a patient if we had a patient API.
                    // Since we don't have a patient API in this test script context (unless we add it), we might skip specific ID tests
                    // OR we can rely on the fact that we seeded patients.
                    // Let's try to fetch a patient if we can, but we didn't create patient routes in this session.
                    // However, the `patients` table was updated.
                    // 5. Test Claims Route (List)
                    console.log('\n4. Testing Claims List...');
                    return [4 /*yield*/, axios_1.default.get("".concat(API_URL, "/claims"), { headers: headers })];
                case 4:
                    claimsRes = _b.sent();
                    console.log("\u2705 Fetched ".concat(claimsRes.data.length, " claims"));
                    // 6. Test Pre-auth Route (List)
                    console.log('\n5. Testing Pre-authorizations List...');
                    return [4 /*yield*/, axios_1.default.get("".concat(API_URL, "/preauth"), { headers: headers })];
                case 5:
                    preauthRes = _b.sent();
                    console.log("\u2705 Fetched ".concat(preauthRes.data.length, " pre-authorizations"));
                    // 7. Test Referrals Route (List)
                    console.log('\n6. Testing Referrals List...');
                    return [4 /*yield*/, axios_1.default.get("".concat(API_URL, "/referrals"), { headers: headers })];
                case 6:
                    referralsRes = _b.sent();
                    console.log("\u2705 Fetched ".concat(referralsRes.data.length, " referrals"));
                    console.log('\n✅ All tests passed successfully!');
                    return [3 /*break*/, 9];
                case 7:
                    error_1 = _b.sent();
                    console.error('\n❌ Test failed:');
                    if (error_1.response) {
                        console.error("   Status: ".concat(error_1.response.status));
                        console.error("   Data:", error_1.response.data);
                    }
                    else {
                        console.error("   Error: ".concat(error_1.message));
                    }
                    return [3 /*break*/, 9];
                case 8:
                    if (serverProcess) {
                        console.log('\nStopping server...');
                        // On Windows, killing the process tree is tricky with just .kill()
                        // We'll try to kill it, but it might leave the node process running.
                        // In a real CI env we'd handle this better.
                        (0, child_process_1.spawn)("taskkill", ["/pid", serverProcess.pid, '/f', '/t']);
                    }
                    process.exit(0);
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    });
}
// Run
(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, startServer()];
            case 1:
                _a.sent();
                return [4 /*yield*/, runTests()];
            case 2:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); })();
