import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
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

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
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


// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server if run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;
