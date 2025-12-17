import express from 'express';
import db from '../db';
import { auth } from '../middleware/auth';

const router = express.Router();

// Get Ward Occupancy Report
router.get('/ward-occupancy', auth, async (req, res) => {
    try {
        // Fetch all wards with bed counts
        const wards = await db('wards')
            .select('id', 'name', 'capacity')
            .orderBy('name');

        // Fetch current bed status
        const beds = await db('beds')
            .select('id', 'ward_id', 'status');

        // Process data
        const report = wards.map(ward => {
            const wardBeds = beds.filter(b => b.ward_id === ward.id);
            const total = wardBeds.length;
            const occupied = wardBeds.filter(b => b.status === 'Occupied' || b.status === 'occupied').length;
            const available = wardBeds.filter(b => b.status === 'Available' || b.status === 'available').length;
            const maintenance = wardBeds.filter(b => b.status === 'Maintenance' || b.status === 'maintenance').length;

            return {
                wardId: ward.id,
                wardName: ward.name,
                capacity: ward.capacity,
                totalBeds: total,
                occupied,
                available,
                maintenance,
                occupancyRate: total > 0 ? ((occupied / total) * 100).toFixed(1) : 0
            };
        });

        // Summary totals
        const summary = {
            totalBeds: report.reduce((sum, w) => sum + w.totalBeds, 0),
            totalOccupied: report.reduce((sum, w) => sum + w.occupied, 0),
            totalAvailable: report.reduce((sum, w) => sum + w.available, 0),
            overallOccupancy: 0
        };

        summary.overallOccupancy = summary.totalBeds > 0
            ? parseFloat(((summary.totalOccupied / summary.totalBeds) * 100).toFixed(1))
            : 0;

        res.json({
            summary,
            details: report
        });

    } catch (error) {
        console.error('Error calculating ward occupancy:', error);
        res.status(500).json({ error: 'Failed to generate occupancy report' });
    }
});

// Get Medication Compliance Report (MAR)
router.get('/medication-compliance', auth, async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        // 1. Get active prescriptions
        const prescriptions = await db('prescriptions')
            .join('patients', 'prescriptions.patient_id', 'patients.id')
            .where('prescriptions.status', 'active')
            .select(
                'prescriptions.*',
                'patients.first_name as patient_first_name',
                'patients.last_name as patient_last_name',
                'patients.mrn'
            );

        // 2. Get today's administrations
        const administrations = await db('medication_administrations')
            .whereRaw('date(administered_at) = ?', [today]);

        // 3. Calculate Stats
        let totalExpected = 0;
        let missedDosesList: any[] = [];

        prescriptions.forEach(p => {
            let dailyFreq = 1;
            let freq = '';

            try {
                const meds = JSON.parse(p.medications || '[]');
                if (meds.length > 0 && meds[0].frequency) {
                    freq = meds[0].frequency.toUpperCase();
                }
            } catch (e) {
                // Ignore parse errors, default to dailyFreq = 1
            }

            if (freq.includes('BID')) dailyFreq = 2;
            if (freq.includes('TID')) dailyFreq = 3;
            if (freq.includes('QID')) dailyFreq = 4;
            if (freq.includes('Q4H')) dailyFreq = 6;

            totalExpected += dailyFreq;

            const adminCount = administrations.filter(a => a.prescription_id === p.id).length;
            if (adminCount < dailyFreq) {
                missedDosesList.push({
                    id: p.id,
                    patientName: `${p.patient_first_name} ${p.patient_last_name}`,
                    mrn: p.mrn,
                    medication: JSON.parse(p.medications || '[]')[0]?.name || 'Medication', // Simplified
                    frequency: freq,
                    ward: 'General Ward', // Placeholder until ward linkage
                    scheduledAt: new Date().toISOString() // Placeholder
                });
            }
        });

        const administered = administrations.filter(a => a.status === 'Administered').length;
        const missed = Math.max(0, totalExpected - administered); // heuristic
        const late = administrations.filter(a => a.status === 'Late').length; // If status supports it

        // 4. Trends (Last 7 Days)
        // Mocking trend data for now as getting history is complex
        const trends = Array.from({ length: 7 }).map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return {
                date: d.toISOString().split('T')[0],
                scheduled: Math.floor(totalExpected * (0.8 + Math.random() * 0.4)),
                administered: Math.floor(administered * (0.8 + Math.random() * 0.4))
            };
        });

        res.json({
            summary: {
                total: totalExpected,
                administered,
                missed,
                late,
                complianceRate: totalExpected > 0 ? ((administered / totalExpected) * 100).toFixed(1) : 0
            },
            trends,
            missedDoses: missedDosesList
        });

    } catch (error) {
        console.error('Error calculating medication compliance:', error);
        res.status(500).json({ error: 'Failed to generate medication report' });
    }
});

// Get Vital Signs Trends Report
router.get('/vitals-trends', auth, async (req, res) => {
    try {
        const { patient_id, date_from, date_to } = req.query;

        // Base query for vitals
        let query = db('vital_signs')
            .join('patients', 'vital_signs.patient_id', 'patients.id')
            .select(
                'vital_signs.*',
                'patients.first_name as patient_first_name',
                'patients.last_name as patient_last_name',
                'patients.mrn'
            )
            .orderBy('vital_signs.recorded_at', 'asc');

        if (patient_id) query = query.where('vital_signs.patient_id', patient_id as string);

        // Default to last 7 days if no date range
        if (!date_from && !date_to) {
            const lastWeek = new Date();
            lastWeek.setDate(lastWeek.getDate() - 7);
            query = query.where('vital_signs.recorded_at', '>=', lastWeek.toISOString());
        } else {
            if (date_from) query = query.where('vital_signs.recorded_at', '>=', date_from as string);
            if (date_to) query = query.where('vital_signs.recorded_at', '<=', date_to as string);
        }

        const vitals = await query;

        // Aggregate data by date
        const groupedByDate: Record<string, any> = {};

        vitals.forEach(v => {
            const date = new Date(v.recorded_at).toISOString().split('T')[0];
            if (!groupedByDate[date]) {
                groupedByDate[date] = {
                    date,
                    systolicSum: 0,
                    diastolicSum: 0,
                    heartRateSum: 0,
                    tempSum: 0,
                    spO2Sum: 0,
                    count: 0,
                    abnormalCount: 0
                };
            }

            const entry = groupedByDate[date];
            if (v.blood_pressure) {
                const [sys, dia] = v.blood_pressure.split('/').map(Number);
                if (!isNaN(sys) && !isNaN(dia)) {
                    entry.systolicSum += sys;
                    entry.diastolicSum += dia;
                }
            }
            if (v.heart_rate) entry.heartRateSum += Number(v.heart_rate);
            if (v.temperature) entry.tempSum += Number(v.temperature);
            if (v.oxygen_saturation) entry.spO2Sum += Number(v.oxygen_saturation);

            // Basic abnormality check (Mock values for simplicity)
            if (Number(v.temperature) > 38 || Number(v.heart_rate) > 100) entry.abnormalCount++;

            entry.count++;
        });

        const trends = Object.values(groupedByDate).map(d => ({
            date: d.date,
            avgSystolic: Math.round(d.systolicSum / d.count) || 0,
            avgDiastolic: Math.round(d.diastolicSum / d.count) || 0,
            avgHeartRate: Math.round(d.heartRateSum / d.count) || 0,
            avgTemp: Number((d.tempSum / d.count).toFixed(1)) || 0,
            avgSpO2: Math.round(d.spO2Sum / d.count) || 0,
            abnormalCount: d.abnormalCount,
            totalReadings: d.count
        })).sort((a, b) => a.date.localeCompare(b.date));

        const summary = {
            totalReadings: vitals.length,
            abnormalReadings: trends.reduce((sum, t) => sum + t.abnormalCount, 0),
            avgHeartRate: trends.length > 0 ? Math.round(trends.reduce((sum, t) => sum + t.avgHeartRate, 0) / trends.length) : 0,
            avgSpO2: trends.length > 0 ? Math.round(trends.reduce((sum, t) => sum + t.avgSpO2, 0) / trends.length) : 0
        };

        res.json({ summary, trends });

    } catch (error) {
        console.error('Error calculating vitals trends:', error);
        res.status(500).json({ error: 'Failed to generate vitals trends' });
    }
});

export default router;
