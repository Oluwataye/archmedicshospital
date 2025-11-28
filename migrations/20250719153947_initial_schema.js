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
exports.up = up;
exports.down = down;
function up(knex) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, knex.schema.createTable("users", function (table) {
                        table.uuid("id").primary().defaultTo(knex.raw("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"));
                        table.string("username", 50).unique().notNullable();
                        table.string("email", 255).unique().notNullable();
                        table.string("password_hash", 255).notNullable();
                        table.string("first_name", 100).notNullable();
                        table.string("last_name", 100).notNullable();
                        table.string("role", 20).notNullable();
                        table.string("department", 100);
                        table.string("specialty", 100);
                        table.string("license_number", 50);
                        table.string("phone", 20);
                        table.boolean("is_active").defaultTo(true);
                        table.timestamp("last_login");
                        table.timestamp("created_at").defaultTo(knex.fn.now());
                        table.timestamp("updated_at").defaultTo(knex.fn.now());
                    })];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, knex.schema.createTable("patients", function (table) {
                            table.uuid("id").primary().defaultTo(knex.raw("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"));
                            table.string("mrn", 20).unique().notNullable();
                            table.string("first_name", 100).notNullable();
                            table.string("last_name", 100).notNullable();
                            table.date("date_of_birth").notNullable();
                            table.string("gender", 10).notNullable();
                            table.string("phone", 20);
                            table.string("email", 255);
                            table.text("address");
                            table.string("city", 100);
                            table.string("state", 2);
                            table.string("zip_code", 10);
                            table.text("emergency_contact");
                            table.text("insurance");
                            table.text("medical_history");
                            table.text("allergies");
                            table.text("current_medications");
                            table.string("status", 20).defaultTo("active");
                            table.uuid("assigned_doctor").references("id").inTable("users");
                            table.timestamp("created_at").defaultTo(knex.fn.now());
                            table.timestamp("updated_at").defaultTo(knex.fn.now());
                        })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, knex.schema.createTable("appointments", function (table) {
                            table.uuid("id").primary().defaultTo(knex.raw("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"));
                            table.uuid("patient_id").notNullable().references("id").inTable("patients");
                            table.uuid("doctor_id").notNullable().references("id").inTable("users");
                            table.date("appointment_date").notNullable();
                            table.time("appointment_time").notNullable();
                            table.integer("duration").notNullable().defaultTo(30);
                            table.string("type", 20).notNullable();
                            table.string("status", 20).defaultTo("scheduled");
                            table.text("notes");
                            table.text("symptoms");
                            table.text("diagnosis");
                            table.text("treatment");
                            table.string("room", 20);
                            table.timestamp("created_at").defaultTo(knex.fn.now());
                            table.timestamp("updated_at").defaultTo(knex.fn.now());
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, knex.schema.createTable("medical_records", function (table) {
                            table.uuid("id").primary().defaultTo(knex.raw("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"));
                            table.uuid("patient_id").notNullable().references("id").inTable("patients");
                            table.uuid("provider_id").notNullable().references("id").inTable("users");
                            table.string("record_type", 20).notNullable();
                            table.date("record_date").notNullable();
                            table.string("title", 200).notNullable();
                            table.text("content").notNullable();
                            table.text("attachments");
                            table.string("status", 20).defaultTo("final");
                            table.timestamp("created_at").defaultTo(knex.fn.now());
                            table.timestamp("updated_at").defaultTo(knex.fn.now());
                        })];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, knex.schema.createTable("vital_signs", function (table) {
                            table.uuid("id").primary().defaultTo(knex.raw("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"));
                            table.uuid("patient_id").notNullable().references("id").inTable("patients");
                            table.uuid("recorded_by").notNullable().references("id").inTable("users");
                            table.timestamp("recorded_at").notNullable();
                            table.integer("systolic_bp");
                            table.integer("diastolic_bp");
                            table.integer("heart_rate");
                            table.decimal("temperature", 4, 1);
                            table.integer("respiratory_rate");
                            table.integer("oxygen_saturation");
                            table.decimal("weight", 5, 2);
                            table.decimal("height", 5, 2);
                            table.decimal("bmi", 4, 1);
                            table.text("notes");
                            table.timestamp("created_at").defaultTo(knex.fn.now());
                        })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, knex.schema.createTable("lab_results", function (table) {
                            table.uuid("id").primary().defaultTo(knex.raw("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"));
                            table.uuid("patient_id").notNullable().references("id").inTable("patients");
                            table.uuid("ordered_by").notNullable().references("id").inTable("users");
                            table.uuid("performed_by").references("id").inTable("users");
                            table.string("test_type", 100).notNullable();
                            table.string("test_name", 200).notNullable();
                            table.date("order_date").notNullable();
                            table.date("collection_date");
                            table.date("result_date");
                            table.string("status", 20).defaultTo("ordered");
                            table.text("results");
                            table.text("interpretation");
                            table.boolean("critical_values").defaultTo(false);
                            table.text("attachments");
                            table.timestamp("created_at").defaultTo(knex.fn.now());
                            table.timestamp("updated_at").defaultTo(knex.fn.now());
                        })];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, knex.schema.createTable("prescriptions", function (table) {
                            table.uuid("id").primary().defaultTo(knex.raw("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"));
                            table.uuid("patient_id").notNullable().references("id").inTable("patients");
                            table.uuid("prescribed_by").notNullable().references("id").inTable("users");
                            table.date("prescription_date").notNullable();
                            table.text("medications").notNullable();
                            table.string("status", 20).defaultTo("active");
                            table.text("notes");
                            table.timestamp("created_at").defaultTo(knex.fn.now());
                            table.timestamp("updated_at").defaultTo(knex.fn.now());
                        })];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, knex.schema.createTable("audit_logs", function (table) {
                            table.uuid("id").primary().defaultTo(knex.raw("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"));
                            table.uuid("user_id").references("id").inTable("users");
                            table.string("action", 100).notNullable();
                            table.string("resource_type", 50).notNullable();
                            table.uuid("resource_id");
                            table.text("old_values");
                            table.text("new_values");
                            table.string("ip_address");
                            table.text("user_agent");
                            table.timestamp("created_at").defaultTo(knex.fn.now());
                        })];
                case 8:
                    _a.sent();
                    // Create indexes for performance
                    return [4 /*yield*/, knex.schema.raw("CREATE INDEX idx_patients_mrn ON patients(mrn);")];
                case 9:
                    // Create indexes for performance
                    _a.sent();
                    return [4 /*yield*/, knex.schema.raw("CREATE INDEX idx_appointments_patient_date ON appointments(patient_id, appointment_date);")];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, knex.schema.raw("CREATE INDEX idx_appointments_doctor_date ON appointments(doctor_id, appointment_date);")];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, knex.schema.raw("CREATE INDEX idx_medical_records_patient ON medical_records(patient_id);")];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, knex.schema.raw("CREATE INDEX idx_vital_signs_patient_date ON vital_signs(patient_id, recorded_at);")];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, knex.schema.raw("CREATE INDEX idx_lab_results_patient ON lab_results(patient_id);")];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, knex.schema.raw("CREATE INDEX idx_prescriptions_patient ON prescriptions(patient_id);")];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, knex.schema.raw("CREATE INDEX idx_audit_logs_user_date ON audit_logs(user_id, created_at);")];
                case 16:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function down(knex) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, knex.schema.dropTableIfExists("audit_logs")];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, knex.schema.dropTableIfExists("prescriptions")];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, knex.schema.dropTableIfExists("lab_results")];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, knex.schema.dropTableIfExists("vital_signs")];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, knex.schema.dropTableIfExists("medical_records")];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, knex.schema.dropTableIfExists("appointments")];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, knex.schema.dropTableIfExists("patients")];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, knex.schema.dropTableIfExists("users")];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
