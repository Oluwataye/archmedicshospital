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
            throw new Error();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await db('users').where({ id: (decoded as any).id }).first();

        if (!user) {
            throw new Error();
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate.' });
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
