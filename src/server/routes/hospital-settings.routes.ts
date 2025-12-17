import express from 'express';
import type { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import db from '../db';
import { auth, authorize } from '../middleware/auth';
import { asyncHandler, Errors } from '../middleware/errorHandler';
import { log } from '../utils/logger';
import { getHospitalSettings, generateAbbreviation } from '../utils/patient-id-generator';

const router = express.Router();

// Configure multer for logo upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'logos');
        // Ensure directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `hospital-logo-${uniqueSuffix}${ext}`);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB max
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PNG, JPG, and SVG are allowed.'));
        }
    }
});

// GET /api/hospital-settings - Get current hospital settings (public)
router.get('/', asyncHandler(async (req: Request, res: Response) => {
    const settings = await getHospitalSettings(db);
    log.debug('Hospital settings retrieved');
    res.json(settings);
}));

// PUT /api/hospital-settings - Update hospital settings (admin only)
router.put('/', auth, authorize(['admin']), asyncHandler(async (req: Request, res: Response) => {
    const {
        hospital_name,
        address,
        phone,
        email,
        logo_url
    } = req.body;

    // Validate required fields
    if (!hospital_name || hospital_name.trim().length === 0) {
        throw Errors.badRequest('Hospital name is required');
    }

    // Auto-generate abbreviation from hospital name
    const hospital_abbreviation = generateAbbreviation(hospital_name);

    // Update settings (there should only be one row)
    const updated = await db('hospital_settings')
        .update({
            hospital_name: hospital_name.trim(),
            hospital_abbreviation,
            address: address?.trim() || null,
            phone: phone?.trim() || null,
            email: email?.trim() || null,
            logo_url: logo_url?.trim() || null,
            updated_at: new Date()
        })
        .returning('*');

    const settings = updated[0] || await db('hospital_settings').first();

    log.info('Hospital settings updated', {
        userId: (req as any).user?.id,
        hospital_name,
        hospital_abbreviation
    });

    res.json(settings);
}));

// POST /api/hospital-settings/logo - Upload hospital logo (admin only)
router.post('/logo', auth, authorize(['admin']), upload.single('logo'), asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
        throw Errors.badRequest('No file uploaded');
    }

    // Get current settings to delete old logo if exists
    const currentSettings = await db('hospital_settings').first();

    // Delete old logo file if exists
    if (currentSettings?.logo_url) {
        const oldLogoPath = path.join(process.cwd(), 'public', currentSettings.logo_url);
        if (fs.existsSync(oldLogoPath)) {
            fs.unlinkSync(oldLogoPath);
            log.debug('Old logo deleted', { path: oldLogoPath });
        }
    }

    // Save new logo URL (relative path for serving)
    const logoUrl = `/uploads/logos/${req.file.filename}`;

    await db('hospital_settings')
        .update({
            logo_url: logoUrl,
            updated_at: new Date()
        });

    log.info('Hospital logo uploaded', {
        userId: (req as any).user?.id,
        filename: req.file.filename,
        size: req.file.size
    });

    res.json({
        success: true,
        logo_url: logoUrl,
        message: 'Logo uploaded successfully'
    });
}));

// DELETE /api/hospital-settings/logo - Remove hospital logo (admin only)
router.delete('/logo', auth, authorize(['admin']), asyncHandler(async (req: Request, res: Response) => {
    const currentSettings = await db('hospital_settings').first();

    if (!currentSettings?.logo_url) {
        throw Errors.notFound('No logo to delete');
    }

    // Delete logo file
    const logoPath = path.join(process.cwd(), 'public', currentSettings.logo_url);
    if (fs.existsSync(logoPath)) {
        fs.unlinkSync(logoPath);
        log.debug('Logo file deleted', { path: logoPath });
    }

    // Update database
    await db('hospital_settings')
        .update({
            logo_url: null,
            updated_at: new Date()
        });

    log.info('Hospital logo removed', {
        userId: (req as any).user?.id
    });

    res.json({
        success: true,
        message: 'Logo removed successfully'
    });
}));

// POST /api/hospital-settings/favicon - Upload favicon (admin only)
router.post('/favicon', auth, authorize(['admin']), upload.single('favicon'), asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
        throw Errors.badRequest('No file uploaded');
    }

    // Copy favicon to public root as favicon.ico
    const faviconPath = path.join(process.cwd(), 'public', 'favicon.ico');
    const uploadedPath = req.file.path;

    // Copy the uploaded file to favicon.ico
    fs.copyFileSync(uploadedPath, faviconPath);

    // Delete the uploaded file from logos directory
    fs.unlinkSync(uploadedPath);

    log.info('Favicon uploaded', {
        userId: (req as any).user?.id,
        filename: req.file.filename
    });

    res.json({
        success: true,
        message: 'Favicon uploaded successfully. Please refresh your browser to see the new icon.'
    });
}));

// GET /api/hospital-settings/logo - Serve logo file with proper headers
router.get('/logo', asyncHandler(async (req: Request, res: Response) => {
    const settings = await db('hospital_settings').first();

    if (!settings?.logo_url) {
        return res.status(404).json({ error: 'No logo uploaded' });
    }

    const logoPath = path.join(process.cwd(), 'public', settings.logo_url);

    if (!fs.existsSync(logoPath)) {
        return res.status(404).json({ error: 'Logo file not found' });
    }

    // Set proper headers
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Cache-Control', 'public, max-age=86400');

    const ext = path.extname(logoPath).toLowerCase();
    const contentTypes: Record<string, string> = {
        '.svg': 'image/svg+xml',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg'
    };

    res.header('Content-Type', contentTypes[ext] || 'application/octet-stream');
    res.sendFile(logoPath);
}));

export default router;
