import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import db from '../db';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'Authentication required. No token provided.' });
        }

        // Validate JWT_SECRET exists
        if (!process.env.JWT_SECRET) {
            console.error('CRITICAL: JWT_SECRET is not configured!');
            return res.status(500).json({ error: 'Server configuration error.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;

        // Check token expiration
        if (decoded.exp && decoded.exp < Date.now() / 1000) {
            return res.status(401).json({ error: 'Token expired. Please login again.' });
        }

        const user = await db('users').where({ id: decoded.id }).first();

        if (!user) {
            return res.status(401).json({ error: 'User not found. Please login again.' });
        }

        if (!user.is_active) {
            return res.status(403).json({ error: 'Account has been deactivated.' });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ error: 'Token expired. Please login again.' });
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ error: 'Invalid token. Please login again.' });
        }
        console.error('Authentication error:', error);
        res.status(401).json({ error: 'Authentication failed.' });
    }
};

export const authorize = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).send({ error: 'Please authenticate.' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).send({ error: 'Access denied.' });
        }

        next();
    };
};
