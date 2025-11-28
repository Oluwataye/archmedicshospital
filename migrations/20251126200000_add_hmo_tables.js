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
                case 0: 
                // 1. Create HMO Providers table
                return [4 /*yield*/, knex.schema.createTable("hmo_providers", function (table) {
                        table.uuid("id").primary().defaultTo(knex.raw("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"));
                        table.string("name", 200).notNullable();
                        table.string("code", 50).unique().notNullable();
                        table.string("nhia_accreditation_number", 100);
                        table.string("contact_email", 255);
                        table.string("contact_phone", 20);
                        table.text("address");
                        table.string("coverage_type", 50); // individual, family, corporate
                        table.boolean("is_active").defaultTo(true);
                        table.timestamp("created_at").defaultTo(knex.fn.now());
                        table.timestamp("updated_at").defaultTo(knex.fn.now());
                    })];
                case 1:
                    // 1. Create HMO Providers table
                    _a.sent();
                    // 2. Create HMO Service Packages table
                    return [4 /*yield*/, knex.schema.createTable("hmo_service_packages", function (table) {
                            table.uuid("id").primary().defaultTo(knex.raw("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"));
                            table.uuid("hmo_provider_id").notNullable().references("id").inTable("hmo_providers").onDelete("CASCADE");
                            table.string("package_name", 200).notNullable();
                            table.string("package_code", 50).notNullable();
                            table.decimal("annual_limit", 12, 2);
                            table.text("services_covered"); // JSON array of service codes
                            table.text("exclusions"); // JSON array
                            table.decimal("copay_percentage", 5, 2);
                            table.boolean("is_active").defaultTo(true);
                            table.timestamp("created_at").defaultTo(knex.fn.now());
                            table.timestamp("updated_at").defaultTo(knex.fn.now());
                        })];
                case 2:
                    // 2. Create HMO Service Packages table
                    _a.sent();
                    // 3. Create NHIS Service Codes table
                    return [4 /*yield*/, knex.schema.createTable("nhis_service_codes", function (table) {
                            table.uuid("id").primary().defaultTo(knex.raw("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"));
                            table.string("code", 50).unique().notNullable();
                            table.string("description", 500).notNullable();
                            table.string("category", 100); // consultation, procedure, diagnostic, etc.
                            table.decimal("base_tariff", 10, 2).notNullable();
                            table.boolean("is_active").defaultTo(true);
                            table.timestamp("created_at").defaultTo(knex.fn.now());
                            table.timestamp("updated_at").defaultTo(knex.fn.now());
                        })];
                case 3:
                    // 3. Create NHIS Service Codes table
                    _a.sent();
                    // 4. Create HMO Tariffs table (pricing per HMO)
                    return [4 /*yield*/, knex.schema.createTable("hmo_tariffs", function (table) {
                            table.uuid("id").primary().defaultTo(knex.raw("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"));
                            table.uuid("hmo_provider_id").notNullable().references("id").inTable("hmo_providers").onDelete("CASCADE");
                            table.uuid("service_code_id").notNullable().references("id").inTable("nhis_service_codes").onDelete("CASCADE");
                            table.decimal("tariff_amount", 10, 2).notNullable();
                            table.decimal("copay_amount", 10, 2);
                            table.decimal("copay_percentage", 5, 2);
                            table.date("effective_from").notNullable();
                            table.date("effective_to");
                            table.timestamp("created_at").defaultTo(knex.fn.now());
                            table.timestamp("updated_at").defaultTo(knex.fn.now());
                        })];
                case 4:
                    // 4. Create HMO Tariffs table (pricing per HMO)
                    _a.sent();
                    // 5. Create HMO Claims table
                    return [4 /*yield*/, knex.schema.createTable("hmo_claims", function (table) {
                            table.uuid("id").primary().defaultTo(knex.raw("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"));
                            table.string("claim_number", 50).unique().notNullable();
                            table.uuid("patient_id").notNullable().references("id").inTable("patients").onDelete("RESTRICT");
                            table.uuid("hmo_provider_id").notNullable().references("id").inTable("hmo_providers").onDelete("RESTRICT");
                            table.date("claim_date").notNullable();
                            table.date("service_date").notNullable();
                            table.decimal("total_amount", 12, 2).notNullable();
                            table.decimal("copay_amount", 12, 2).defaultTo(0);
                            table.decimal("claim_amount", 12, 2).notNullable();
                            table.string("status", 50).defaultTo("pending"); // pending, submitted, approved, rejected, paid
                            table.timestamp("submission_date");
                            table.timestamp("approval_date");
                            table.timestamp("payment_date");
                            table.text("rejection_reason");
                            table.uuid("created_by").references("id").inTable("users");
                            table.timestamp("created_at").defaultTo(knex.fn.now());
                            table.timestamp("updated_at").defaultTo(knex.fn.now());
                        })];
                case 5:
                    // 5. Create HMO Claims table
                    _a.sent();
                    // 6. Create HMO Claim Items table
                    return [4 /*yield*/, knex.schema.createTable("hmo_claim_items", function (table) {
                            table.uuid("id").primary().defaultTo(knex.raw("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"));
                            table.uuid("claim_id").notNullable().references("id").inTable("hmo_claims").onDelete("CASCADE");
                            table.uuid("service_code_id").notNullable().references("id").inTable("nhis_service_codes").onDelete("RESTRICT");
                            table.integer("quantity").defaultTo(1);
                            table.decimal("unit_price", 10, 2).notNullable();
                            table.decimal("total_price", 10, 2).notNullable();
                            table.string("diagnosis_code", 50);
                            table.uuid("provider_id").references("id").inTable("users"); // doctor who provided service
                            table.timestamp("created_at").defaultTo(knex.fn.now());
                        })];
                case 6:
                    // 6. Create HMO Claim Items table
                    _a.sent();
                    // 7. Create HMO Pre-authorizations table
                    return [4 /*yield*/, knex.schema.createTable("hmo_preauthorizations", function (table) {
                            table.uuid("id").primary().defaultTo(knex.raw("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"));
                            table.string("authorization_code", 50).unique().notNullable();
                            table.uuid("patient_id").notNullable().references("id").inTable("patients").onDelete("RESTRICT");
                            table.uuid("hmo_provider_id").notNullable().references("id").inTable("hmo_providers").onDelete("RESTRICT");
                            table.uuid("requested_service_code_id").references("id").inTable("nhis_service_codes").onDelete("RESTRICT");
                            table.text("diagnosis");
                            table.uuid("requested_by").notNullable().references("id").inTable("users");
                            table.timestamp("request_date").defaultTo(knex.fn.now());
                            table.timestamp("approval_date");
                            table.date("expiry_date");
                            table.string("status", 50).defaultTo("pending"); // pending, approved, rejected, expired
                            table.decimal("approved_amount", 10, 2);
                            table.text("notes");
                            table.timestamp("created_at").defaultTo(knex.fn.now());
                            table.timestamp("updated_at").defaultTo(knex.fn.now());
                        })];
                case 7:
                    // 7. Create HMO Pre-authorizations table
                    _a.sent();
                    // 8. Create Referrals table
                    return [4 /*yield*/, knex.schema.createTable("referrals", function (table) {
                            table.uuid("id").primary().defaultTo(knex.raw("(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))"));
                            table.string("referral_code", 50).unique().notNullable();
                            table.uuid("patient_id").notNullable().references("id").inTable("patients").onDelete("RESTRICT");
                            table.uuid("referring_provider_id").notNullable().references("id").inTable("users");
                            table.string("referring_facility", 200);
                            table.string("referred_to_facility", 200);
                            table.string("referred_to_specialist", 200);
                            table.string("specialty_required", 100);
                            table.text("reason_for_referral").notNullable();
                            table.text("diagnosis");
                            table.string("urgency", 50).defaultTo("routine"); // routine, urgent, emergency
                            table.uuid("hmo_provider_id").references("id").inTable("hmo_providers");
                            table.boolean("preauth_required").defaultTo(false);
                            table.uuid("preauth_id").references("id").inTable("hmo_preauthorizations");
                            table.string("status", 50).defaultTo("pending"); // pending, accepted, completed, cancelled
                            table.date("referral_date").notNullable();
                            table.date("appointment_date");
                            table.text("feedback");
                            table.timestamp("created_at").defaultTo(knex.fn.now());
                            table.timestamp("updated_at").defaultTo(knex.fn.now());
                        })];
                case 8:
                    // 8. Create Referrals table
                    _a.sent();
                    // Create indexes for performance
                    return [4 /*yield*/, knex.schema.raw("CREATE INDEX idx_hmo_providers_code ON hmo_providers(code);")];
                case 9:
                    // Create indexes for performance
                    _a.sent();
                    return [4 /*yield*/, knex.schema.raw("CREATE INDEX idx_hmo_providers_active ON hmo_providers(is_active);")];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, knex.schema.raw("CREATE INDEX idx_nhis_service_codes_code ON nhis_service_codes(code);")];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, knex.schema.raw("CREATE INDEX idx_nhis_service_codes_category ON nhis_service_codes(category);")];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, knex.schema.raw("CREATE INDEX idx_hmo_tariffs_lookup ON hmo_tariffs(hmo_provider_id, service_code_id, effective_from);")];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, knex.schema.raw("CREATE INDEX idx_hmo_claims_patient ON hmo_claims(patient_id);")];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, knex.schema.raw("CREATE INDEX idx_hmo_claims_status ON hmo_claims(status);")];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, knex.schema.raw("CREATE INDEX idx_hmo_claims_date ON hmo_claims(claim_date);")];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, knex.schema.raw("CREATE INDEX idx_hmo_preauth_patient ON hmo_preauthorizations(patient_id);")];
                case 17:
                    _a.sent();
                    return [4 /*yield*/, knex.schema.raw("CREATE INDEX idx_hmo_preauth_code ON hmo_preauthorizations(authorization_code);")];
                case 18:
                    _a.sent();
                    return [4 /*yield*/, knex.schema.raw("CREATE INDEX idx_referrals_patient ON referrals(patient_id);")];
                case 19:
                    _a.sent();
                    return [4 /*yield*/, knex.schema.raw("CREATE INDEX idx_referrals_code ON referrals(referral_code);")];
                case 20:
                    _a.sent();
                    return [4 /*yield*/, knex.schema.raw("CREATE INDEX idx_referrals_status ON referrals(status);")];
                case 21:
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
                case 0: 
                // Drop tables in reverse order to respect foreign key constraints
                return [4 /*yield*/, knex.schema.dropTableIfExists("referrals")];
                case 1:
                    // Drop tables in reverse order to respect foreign key constraints
                    _a.sent();
                    return [4 /*yield*/, knex.schema.dropTableIfExists("hmo_preauthorizations")];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, knex.schema.dropTableIfExists("hmo_claim_items")];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, knex.schema.dropTableIfExists("hmo_claims")];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, knex.schema.dropTableIfExists("hmo_tariffs")];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, knex.schema.dropTableIfExists("nhis_service_codes")];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, knex.schema.dropTableIfExists("hmo_service_packages")];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, knex.schema.dropTableIfExists("hmo_providers")];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
