import rateLimit from 'express-rate-limit';

// Rate limiter for login attempts
export const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs (Relaxed for dev/offline)
    message: {
        error: 'Too many login attempts from this IP. Please try again after 15 minutes.'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    // Skip successful requests
    skipSuccessfulRequests: true,
});

// General API rate limiter
export const apiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5000, // Limit each IP to 5000 requests per windowMs (Relaxed for dev/offline)
    message: {
        error: 'Too many requests from this IP. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Strict rate limiter for sensitive operations
export const strictRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 requests per hour
    message: {
        error: 'Too many requests for this operation. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
