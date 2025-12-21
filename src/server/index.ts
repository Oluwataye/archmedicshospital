import express from 'express';
import cors from 'cors';
import path from 'path';

import hmoRoutes from './routes/hmo.routes';
import nhisRoutes from './routes/nhis.routes';
import claimsRoutes from './routes/claims.routes';
import preauthRoutes from './routes/preauth.routes';
import referralRoutes from './routes/referrals.routes';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/users.routes';
import patientRoutes from './routes/patients.routes';
import appointmentRoutes from './routes/appointments.routes';
import medicalRecordRoutes from './routes/medical-records.routes';
import vitalSignRoutes from './routes/vital-signs.routes';
import labRoutes from './routes/lab.routes';
import prescriptionRoutes from './routes/prescriptions.routes';
import auditRoutes from './routes/audit.routes';
import settingsRoutes from './routes/settings.routes';
import wardRoutes from './routes/wards.routes';
import drugInteractionRoutes from './routes/drug-interactions.routes';
import inventoryRoutes from './routes/inventory.routes';
import labInventoryRoutes from './routes/lab-inventory.routes';
import paymentsRoutes from './routes/payments.routes';
import labEquipmentRoutes from './routes/lab-equipment.routes';
import labQualityRoutes from './routes/lab-quality.routes';
import invoicesRoutes from './routes/invoices.routes';
import refundsRoutes from './routes/refunds.routes';
import billingRoutes from './routes/billing.routes';
import staffRoutes from './routes/staff.routes';
import departmentRoutes from './routes/departments.routes';
import transactionRoutes from './routes/transactions.routes';
import reportsRoutes from './routes/reports.routes';
import { loginRateLimiter, apiRateLimiter } from './middleware/rateLimiter';
import { configureSecurityHeaders } from './middleware/securityHeaders';
import { sanitizeInput } from './middleware/validation';
import { errorHandler, notFoundHandler, handleUnhandledRejection, handleUncaughtException } from './middleware/errorHandler';


const app = express();
const PORT = process.env.PORT || 3001;

// Security Middleware (must be first)
configureSecurityHeaders(app);

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input sanitization (must be after body parsing)
app.use(sanitizeInput);

// Serve static files from public directory (for uploaded logos) with CORS
app.use('/uploads', (req, res, next) => {
    // Set CORS headers
    res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:5173');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials', 'true');

    // Set proper MIME type for SVG files
    if (req.path.endsWith('.svg')) {
        res.header('Content-Type', 'image/svg+xml');
        res.header('X-Content-Type-Options', 'nosniff');
    }

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
}, express.static(path.join(process.cwd(), 'public', 'uploads')));

// Apply general API rate limiting to all routes
app.use('/api/', apiRateLimiter);

// Routes (auth routes with stricter rate limiting)
app.use('/api/auth/login', loginRateLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/vital-signs', vitalSignRoutes);
app.use('/api/lab-results', labRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/hmo', hmoRoutes);
app.use('/api/nhis', nhisRoutes);
app.use('/api/claims', claimsRoutes);
app.use('/api/preauth', preauthRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/wards', wardRoutes);
app.use('/api/drug-interactions', drugInteractionRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/lab-inventory', labInventoryRoutes);
app.use('/api/lab-equipment', labEquipmentRoutes);
app.use('/api/lab-quality', labQualityRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/invoices', invoicesRoutes);
app.use('/api/refunds', refundsRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/transactions', transactionRoutes);

import financialReportsRoutes from './routes/financial-reports.routes';
app.use('/api/reports/financial', financialReportsRoutes);

import backupRoutes from './routes/backup.routes';
app.use('/api/backup', backupRoutes);
import analyticsRoutes from './routes/analytics.routes';
app.use('/api/analytics', analyticsRoutes);
import servicesRoutes from './routes/services.routes';
app.use('/api/services', servicesRoutes);
import financialRoutes from './routes/financial.routes';
app.use('/api/financial', financialRoutes);
import cashierRoutes from './routes/cashier.routes';
app.use('/api/cashier', cashierRoutes);
import hospitalSettingsRoutes from './routes/hospital-settings.routes';
app.use('/api/hospital-settings', hospitalSettingsRoutes);



// Test endpoint to verify server is running
app.get('/api/test', (req, res) => {
    res.json({
        message: 'Server is running with latest code!',
        timestamp: new Date().toISOString(),
        env: {
            NODE_ENV: process.env.NODE_ENV,
            NETLIFY: !!process.env.NETLIFY,
            CONTEXT: !!process.env.CONTEXT,
            HAS_DB_URL: !!process.env.DATABASE_URL
        }
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler - must be after all routes
app.use(notFoundHandler);

// Error handling middleware - must be last
app.use(errorHandler);

// Start server if run directly
import { startScheduler } from './services/scheduler.service';

if (require.main === module) {
    // Set up process-level error handlers
    handleUnhandledRejection();
    handleUncaughtException();

    console.log('Starting server...');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        startScheduler();
    });

    // Keep process alive
    setInterval(() => { }, 1000 * 60 * 60);
}

import salesRoutes from './routes/sales.routes';
app.use('/api/sales', salesRoutes);

import samplesRoutes from './routes/samples.routes';
app.use('/api/samples', samplesRoutes);

export default app;
