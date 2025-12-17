import helmet from 'helmet';
import type { Express } from 'express';

/**
 * Configure security headers using Helmet
 * Protects against common web vulnerabilities
 */
export const configureSecurityHeaders = (app: Express) => {
    // Use Helmet to set various HTTP headers for security
    app.use(helmet({
        // Content Security Policy
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles for React
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", "data:", "https:"],
                connectSrc: ["'self'"],
                fontSrc: ["'self'", "data:"],
                objectSrc: ["'none'"],
                mediaSrc: ["'self'"],
                frameSrc: ["'none'"],
            },
        },
        // Strict Transport Security
        hsts: {
            maxAge: 31536000, // 1 year
            includeSubDomains: true,
            preload: true,
        },
        // Prevent clickjacking
        frameguard: {
            action: 'deny',
        },
        // Prevent MIME type sniffing
        noSniff: true,
        // XSS Protection
        xssFilter: true,
        // Hide X-Powered-By header
        hidePoweredBy: true,
        // Referrer Policy
        referrerPolicy: {
            policy: 'strict-origin-when-cross-origin',
        },
    }));

    // Additional custom headers
    app.use((req, res, next) => {
        // Skip restrictive headers for uploaded files
        if (req.path.startsWith('/uploads')) {
            // Allow caching for static assets
            res.setHeader('Cache-Control', 'public, max-age=86400');
            return next();
        }

        // Prevent caching of sensitive data (API routes only)
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        // Additional security headers
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');

        // Permissions Policy (formerly Feature Policy)
        res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

        next();
    });
};
