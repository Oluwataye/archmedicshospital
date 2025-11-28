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
exports.seed = seed;
var bcryptjs_1 = require("bcryptjs");
function seed(knex) {
    return __awaiter(this, void 0, void 0, function () {
        var saltRounds, adminPassword, doctorPassword, nursePassword, ehrPassword, pharmacistPassword, labtechPassword, users, adminUser, drSmith, drJohnson, nurseWilliams, ehrManager, pharmacist, labTech, patients, patient1, patient2, patient3, today, tomorrow, nextWeek, yesterday;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Clear existing data
                return [4 /*yield*/, knex('audit_logs').del()];
                case 1:
                    // Clear existing data
                    _a.sent();
                    return [4 /*yield*/, knex('prescriptions').del()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, knex('lab_results').del()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, knex('vital_signs').del()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, knex('medical_records').del()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, knex('appointments').del()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, knex('patients').del()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, knex('users').del()];
                case 8:
                    _a.sent();
                    saltRounds = 12;
                    return [4 /*yield*/, bcryptjs_1.default.hash('admin123', saltRounds)];
                case 9:
                    adminPassword = _a.sent();
                    return [4 /*yield*/, bcryptjs_1.default.hash('doctor123', saltRounds)];
                case 10:
                    doctorPassword = _a.sent();
                    return [4 /*yield*/, bcryptjs_1.default.hash('nurse123', saltRounds)];
                case 11:
                    nursePassword = _a.sent();
                    return [4 /*yield*/, bcryptjs_1.default.hash('ehr123', saltRounds)];
                case 12:
                    ehrPassword = _a.sent();
                    return [4 /*yield*/, bcryptjs_1.default.hash('pharm123', saltRounds)];
                case 13:
                    pharmacistPassword = _a.sent();
                    return [4 /*yield*/, bcryptjs_1.default.hash('lab123', saltRounds)];
                case 14:
                    labtechPassword = _a.sent();
                    return [4 /*yield*/, knex('users').insert([
                            {
                                username: 'admin',
                                email: 'admin@archmedics.com',
                                password_hash: adminPassword,
                                first_name: 'System',
                                last_name: 'Administrator',
                                role: 'admin',
                                department: 'Administration',
                                is_active: true,
                            },
                            {
                                username: 'dr.smith',
                                email: 'dr.smith@archmedics.com',
                                password_hash: doctorPassword,
                                first_name: 'John',
                                last_name: 'Smith',
                                role: 'doctor',
                                department: 'Cardiology',
                                specialty: 'Cardiology',
                                license_number: 'MD123456',
                                phone: '+1-555-0101',
                                is_active: true,
                            },
                            {
                                username: 'dr.johnson',
                                email: 'dr.johnson@archmedics.com',
                                password_hash: doctorPassword,
                                first_name: 'Sarah',
                                last_name: 'Johnson',
                                role: 'doctor',
                                department: 'Internal Medicine',
                                specialty: 'Internal Medicine',
                                license_number: 'MD789012',
                                phone: '+1-555-0102',
                                is_active: true,
                            },
                            {
                                username: 'nurse.williams',
                                email: 'nurse.williams@archmedics.com',
                                password_hash: nursePassword,
                                first_name: 'Emily',
                                last_name: 'Williams',
                                role: 'nurse',
                                department: 'Emergency',
                                license_number: 'RN345678',
                                phone: '+1-555-0201',
                                is_active: true,
                            },
                            {
                                username: 'ehr.manager',
                                email: 'ehr@archmedics.com',
                                password_hash: ehrPassword,
                                first_name: 'Michael',
                                last_name: 'Brown',
                                role: 'ehr',
                                department: 'Health Information',
                                phone: '+1-555-0301',
                                is_active: true,
                            },
                            {
                                username: 'pharmacist.davis',
                                email: 'pharmacist@archmedics.com',
                                password_hash: pharmacistPassword,
                                first_name: 'Lisa',
                                last_name: 'Davis',
                                role: 'pharmacist',
                                department: 'Pharmacy',
                                license_number: 'PharmD901234',
                                phone: '+1-555-0401',
                                is_active: true,
                            },
                            {
                                username: 'lab.tech',
                                email: 'labtech@archmedics.com',
                                password_hash: labtechPassword,
                                first_name: 'Robert',
                                last_name: 'Wilson',
                                role: 'labtech',
                                department: 'Laboratory',
                                license_number: 'MLT567890',
                                phone: '+1-555-0501',
                                is_active: true,
                            },
                        ]).returning('*')];
                case 15:
                    users = _a.sent();
                    adminUser = users.find(function (u) { return u.role === 'admin'; });
                    drSmith = users.find(function (u) { return u.username === 'dr.smith'; });
                    drJohnson = users.find(function (u) { return u.username === 'dr.johnson'; });
                    nurseWilliams = users.find(function (u) { return u.role === 'nurse'; });
                    ehrManager = users.find(function (u) { return u.role === 'ehr'; });
                    pharmacist = users.find(function (u) { return u.role === 'pharmacist'; });
                    labTech = users.find(function (u) { return u.role === 'labtech'; });
                    return [4 /*yield*/, knex('patients').insert([
                            {
                                mrn: 'MRN001001',
                                first_name: 'James',
                                last_name: 'Anderson',
                                date_of_birth: '1985-03-15',
                                gender: 'male',
                                phone: '+1-555-1001',
                                email: 'james.anderson@email.com',
                                address: '123 Main Street',
                                city: 'Springfield',
                                state: 'IL',
                                zip_code: '62701',
                                emergency_contact: JSON.stringify({
                                    name: 'Mary Anderson',
                                    relationship: 'Spouse',
                                    phone: '+1-555-1002',
                                    email: 'mary.anderson@email.com'
                                }),
                                insurance: JSON.stringify({
                                    provider: 'Blue Cross Blue Shield',
                                    policyNumber: 'BCBS123456789',
                                    groupNumber: 'GRP001',
                                    subscriberId: 'SUB001'
                                }),
                                medical_history: ['Hypertension', 'Type 2 Diabetes'],
                                allergies: ['Penicillin', 'Shellfish'],
                                current_medications: ['Metformin 500mg', 'Lisinopril 10mg'],
                                assigned_doctor: drSmith === null || drSmith === void 0 ? void 0 : drSmith.id,
                                status: 'active',
                            },
                            {
                                mrn: 'MRN001002',
                                first_name: 'Maria',
                                last_name: 'Garcia',
                                date_of_birth: '1992-07-22',
                                gender: 'female',
                                phone: '+1-555-1003',
                                email: 'maria.garcia@email.com',
                                address: '456 Oak Avenue',
                                city: 'Springfield',
                                state: 'IL',
                                zip_code: '62702',
                                emergency_contact: JSON.stringify({
                                    name: 'Carlos Garcia',
                                    relationship: 'Brother',
                                    phone: '+1-555-1004',
                                    email: 'carlos.garcia@email.com'
                                }),
                                insurance: JSON.stringify({
                                    provider: 'Aetna',
                                    policyNumber: 'AET987654321',
                                    groupNumber: 'GRP002',
                                    subscriberId: 'SUB002'
                                }),
                                medical_history: ['Asthma'],
                                allergies: ['Latex'],
                                current_medications: ['Albuterol inhaler'],
                                assigned_doctor: drJohnson === null || drJohnson === void 0 ? void 0 : drJohnson.id,
                                status: 'active',
                            },
                            {
                                mrn: 'MRN001003',
                                first_name: 'Robert',
                                last_name: 'Thompson',
                                date_of_birth: '1978-11-08',
                                gender: 'male',
                                phone: '+1-555-1005',
                                email: 'robert.thompson@email.com',
                                address: '789 Pine Street',
                                city: 'Springfield',
                                state: 'IL',
                                zip_code: '62703',
                                emergency_contact: JSON.stringify({
                                    name: 'Jennifer Thompson',
                                    relationship: 'Wife',
                                    phone: '+1-555-1006',
                                    email: 'jennifer.thompson@email.com'
                                }),
                                insurance: JSON.stringify({
                                    provider: 'United Healthcare',
                                    policyNumber: 'UHC456789123',
                                    groupNumber: 'GRP003',
                                    subscriberId: 'SUB003'
                                }),
                                medical_history: ['High Cholesterol', 'Anxiety'],
                                allergies: ['Sulfa drugs'],
                                current_medications: ['Atorvastatin 20mg', 'Sertraline 50mg'],
                                assigned_doctor: drSmith === null || drSmith === void 0 ? void 0 : drSmith.id,
                                status: 'active',
                            },
                        ]).returning('*')];
                case 16:
                    patients = _a.sent();
                    patient1 = patients[0];
                    patient2 = patients[1];
                    patient3 = patients[2];
                    today = new Date();
                    tomorrow = new Date(today);
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    nextWeek = new Date(today);
                    nextWeek.setDate(nextWeek.getDate() + 7);
                    return [4 /*yield*/, knex('appointments').insert([
                            {
                                patient_id: patient1.id,
                                doctor_id: drSmith === null || drSmith === void 0 ? void 0 : drSmith.id,
                                appointment_date: today.toISOString().split('T')[0],
                                appointment_time: '09:00',
                                duration: 30,
                                type: 'consultation',
                                status: 'scheduled',
                                notes: 'Regular checkup for diabetes management',
                                symptoms: 'No acute symptoms',
                                room: 'Room 101',
                            },
                            {
                                patient_id: patient2.id,
                                doctor_id: drJohnson === null || drJohnson === void 0 ? void 0 : drJohnson.id,
                                appointment_date: tomorrow.toISOString().split('T')[0],
                                appointment_time: '14:30',
                                duration: 45,
                                type: 'follow-up',
                                status: 'confirmed',
                                notes: 'Follow-up for asthma treatment',
                                symptoms: 'Mild shortness of breath',
                                room: 'Room 203',
                            },
                            {
                                patient_id: patient3.id,
                                doctor_id: drSmith === null || drSmith === void 0 ? void 0 : drSmith.id,
                                appointment_date: nextWeek.toISOString().split('T')[0],
                                appointment_time: '11:00',
                                duration: 30,
                                type: 'consultation',
                                status: 'scheduled',
                                notes: 'Cholesterol level review',
                                room: 'Room 105',
                            },
                        ])];
                case 17:
                    _a.sent();
                    yesterday = new Date(today);
                    yesterday.setDate(yesterday.getDate() - 1);
                    return [4 /*yield*/, knex('vital_signs').insert([
                            {
                                patient_id: patient1.id,
                                recorded_by: nurseWilliams === null || nurseWilliams === void 0 ? void 0 : nurseWilliams.id,
                                recorded_at: yesterday.toISOString(),
                                systolic_bp: 135,
                                diastolic_bp: 85,
                                heart_rate: 78,
                                temperature: 98.6,
                                respiratory_rate: 16,
                                oxygen_saturation: 98,
                                weight: 180.5,
                                height: 175,
                                bmi: 29.6,
                                notes: 'Blood pressure slightly elevated',
                            },
                            {
                                patient_id: patient2.id,
                                recorded_by: nurseWilliams === null || nurseWilliams === void 0 ? void 0 : nurseWilliams.id,
                                recorded_at: yesterday.toISOString(),
                                systolic_bp: 118,
                                diastolic_bp: 75,
                                heart_rate: 82,
                                temperature: 98.4,
                                respiratory_rate: 18,
                                oxygen_saturation: 96,
                                weight: 125.0,
                                height: 162,
                                bmi: 23.8,
                                notes: 'Oxygen saturation slightly low due to asthma',
                            },
                        ])];
                case 18:
                    _a.sent();
                    // Insert sample medical records
                    return [4 /*yield*/, knex('medical_records').insert([
                            {
                                patient_id: patient1.id,
                                provider_id: drSmith === null || drSmith === void 0 ? void 0 : drSmith.id,
                                record_type: 'note',
                                record_date: yesterday.toISOString().split('T')[0],
                                title: 'Diabetes Management Visit',
                                content: JSON.stringify({
                                    chief_complaint: 'Routine diabetes follow-up',
                                    history_of_present_illness: 'Patient reports good adherence to medication. Blood sugars have been well controlled.',
                                    physical_exam: 'Vital signs stable. No acute distress. Feet examination normal.',
                                    assessment: 'Type 2 diabetes mellitus, well controlled',
                                    plan: 'Continue current medications. Follow up in 3 months. HbA1c ordered.'
                                }),
                                status: 'final',
                            },
                            {
                                patient_id: patient2.id,
                                provider_id: drJohnson === null || drJohnson === void 0 ? void 0 : drJohnson.id,
                                record_type: 'note',
                                record_date: yesterday.toISOString().split('T')[0],
                                title: 'Asthma Evaluation',
                                content: JSON.stringify({
                                    chief_complaint: 'Mild shortness of breath',
                                    history_of_present_illness: 'Patient reports occasional wheezing, especially with exercise.',
                                    physical_exam: 'Lungs clear to auscultation. No wheezing at rest.',
                                    assessment: 'Asthma, mild intermittent',
                                    plan: 'Continue albuterol as needed. Peak flow monitoring. Follow up in 6 weeks.'
                                }),
                                status: 'final',
                            },
                        ])];
                case 19:
                    // Insert sample medical records
                    _a.sent();
                    // Insert sample lab results
                    return [4 /*yield*/, knex('lab_results').insert([
                            {
                                patient_id: patient1.id,
                                ordered_by: drSmith === null || drSmith === void 0 ? void 0 : drSmith.id,
                                performed_by: labTech === null || labTech === void 0 ? void 0 : labTech.id,
                                test_type: 'Blood Chemistry',
                                test_name: 'Comprehensive Metabolic Panel',
                                order_date: yesterday.toISOString().split('T')[0],
                                collection_date: yesterday.toISOString().split('T')[0],
                                result_date: today.toISOString().split('T')[0],
                                status: 'completed',
                                results: JSON.stringify({
                                    glucose: { value: 125, unit: 'mg/dL', reference_range: '70-100', flag: 'H' },
                                    bun: { value: 18, unit: 'mg/dL', reference_range: '7-20', flag: 'N' },
                                    creatinine: { value: 1.1, unit: 'mg/dL', reference_range: '0.7-1.3', flag: 'N' },
                                    sodium: { value: 140, unit: 'mEq/L', reference_range: '136-145', flag: 'N' },
                                    potassium: { value: 4.2, unit: 'mEq/L', reference_range: '3.5-5.1', flag: 'N' }
                                }),
                                interpretation: 'Glucose slightly elevated, consistent with diabetes. Other values within normal limits.',
                                critical_values: false,
                            },
                            {
                                patient_id: patient3.id,
                                ordered_by: drSmith === null || drSmith === void 0 ? void 0 : drSmith.id,
                                test_type: 'Lipid Panel',
                                test_name: 'Lipid Profile',
                                order_date: today.toISOString().split('T')[0],
                                status: 'ordered',
                            },
                        ])];
                case 20:
                    // Insert sample lab results
                    _a.sent();
                    // Insert sample prescriptions
                    return [4 /*yield*/, knex('prescriptions').insert([
                            {
                                patient_id: patient1.id,
                                prescribed_by: drSmith === null || drSmith === void 0 ? void 0 : drSmith.id,
                                prescription_date: yesterday.toISOString().split('T')[0],
                                medications: JSON.stringify([
                                    {
                                        name: 'Metformin',
                                        dosage: '500mg',
                                        frequency: 'Twice daily',
                                        duration: '90 days',
                                        instructions: 'Take with meals',
                                        quantity: 180,
                                        refills: 5
                                    },
                                    {
                                        name: 'Lisinopril',
                                        dosage: '10mg',
                                        frequency: 'Once daily',
                                        duration: '90 days',
                                        instructions: 'Take in the morning',
                                        quantity: 90,
                                        refills: 5
                                    }
                                ]),
                                status: 'active',
                                notes: 'Continue current diabetes and hypertension management',
                            },
                            {
                                patient_id: patient2.id,
                                prescribed_by: drJohnson === null || drJohnson === void 0 ? void 0 : drJohnson.id,
                                prescription_date: yesterday.toISOString().split('T')[0],
                                medications: JSON.stringify([
                                    {
                                        name: 'Albuterol HFA',
                                        dosage: '90mcg',
                                        frequency: 'As needed',
                                        duration: '30 days',
                                        instructions: '2 puffs every 4-6 hours as needed for wheezing',
                                        quantity: 1,
                                        refills: 3
                                    }
                                ]),
                                status: 'active',
                                notes: 'Rescue inhaler for asthma symptoms',
                            },
                        ])];
                case 21:
                    // Insert sample prescriptions
                    _a.sent();
                    console.log('Seed data inserted successfully!');
                    return [2 /*return*/];
            }
        });
    });
}
