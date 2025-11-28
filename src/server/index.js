"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var url_1 = require("url");
var hmo_routes_ts_1 = require("./routes/hmo.routes.ts");
var nhis_routes_ts_1 = require("./routes/nhis.routes.ts");
var claims_routes_ts_1 = require("./routes/claims.routes.ts");
var preauth_routes_ts_1 = require("./routes/preauth.routes.ts");
var referrals_routes_ts_1 = require("./routes/referrals.routes.ts");
var auth_routes_ts_1 = require("./routes/auth.routes.ts");
var users_routes_ts_1 = require("./routes/users.routes.ts");
var patients_routes_ts_1 = require("./routes/patients.routes.ts");
var appointments_routes_ts_1 = require("./routes/appointments.routes.ts");
var medical_records_routes_ts_1 = require("./routes/medical-records.routes.ts");
var vital_signs_routes_ts_1 = require("./routes/vital-signs.routes.ts");
var lab_routes_ts_1 = require("./routes/lab.routes.ts");
var prescriptions_routes_ts_1 = require("./routes/prescriptions.routes.ts");
var app = (0, express_1.default)();
var PORT = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/auth', auth_routes_ts_1.default);
app.use('/api/users', users_routes_ts_1.default);
app.use('/api/patients', patients_routes_ts_1.default);
app.use('/api/appointments', appointments_routes_ts_1.default);
app.use('/api/medical-records', medical_records_routes_ts_1.default);
app.use('/api/vital-signs', vital_signs_routes_ts_1.default);
app.use('/api/lab-results', lab_routes_ts_1.default);
app.use('/api/prescriptions', prescriptions_routes_ts_1.default);
app.use('/api/hmo', hmo_routes_ts_1.default);
app.use('/api/nhis', nhis_routes_ts_1.default);
app.use('/api/claims', claims_routes_ts_1.default);
app.use('/api/preauth', preauth_routes_ts_1.default);
app.use('/api/referrals', referrals_routes_ts_1.default);
// Health check
app.get('/health', function (req, res) {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Start server if run directly
if (process.argv[1] === (0, url_1.fileURLToPath)(import.meta.url)) {
    app.listen(PORT, function () {
        console.log("Server running on port ".concat(PORT));
    });
}
exports.default = app;
