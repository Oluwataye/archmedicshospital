import { Request, Response, NextFunction } from 'express';
import { logger, log } from '../utils/logger';

/**
 * Custom Application Error class
 * Extends Error to include HTTP status code and operational flag
 */
export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(
        statusCode: number,
        message: string,
        isOperational = true
    ) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;

        // Maintains proper stack trace for where our error was thrown
        Error.captureStackTrace(this, this.constructor);

        // Set the prototype explicitly
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

/**
 * Common error factory functions for consistency
 */
export const Errors = {
    notFound: (resource: string) =>
        new AppError(404, `${resource} not found`),

    badRequest: (message: string) =>
        new AppError(400, message),

    unauthorized: (message = 'Authentication required') =>
        new AppError(401, message),

    forbidden: (message = 'Access denied') =>
        new AppError(403, message),

    conflict: (message: string) =>
        new AppError(409, message),

    internal: (message = 'An unexpected error occurred') =>
        new AppError(500, message, false),
};

/**
 * Async handler wrapper
 * Eliminates need for try-catch in every route
 */
export const asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

/**
 * Centralized error handling middleware
 * Must be registered LAST in middleware chain
 */
export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // Default to 500 server error
    let statusCode = 500;
    let message = 'An unexpected error occurred';
    let isOperational = false;

    // Check if it's our custom AppError
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        isOperational = err.isOperational;
    }

    // Log the error
    if (statusCode >= 500) {
        // Server errors - log with full details
        log.error('Server error', {
            message: err.message,
            stack: err.stack,
            path: req.path,
            method: req.method,
            statusCode,
            user: (req as any).user?.id,
            body: req.body,
        });
    } else if (statusCode >= 400) {
        // Client errors - log with less detail
        log.warn('Client error', {
            message: err.message,
            path: req.path,
            method: req.method,
            statusCode,
            user: (req as any).user?.id,
        });
    }

    // Send error response
    const response: any = {
        error: message,
        statusCode,
    };

    // Include stack trace in development
    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
        response.isOperational = isOperational;
    }

    res.status(statusCode).json(response);
};

/**
 * 404 handler for undefined routes
 * Should be registered after all routes but before error handler
 */
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
    next(new AppError(404, `Route ${req.method} ${req.path} not found`));
};

/**
 * Unhandled rejection handler
 * Catches promise rejections that weren't caught elsewhere
 */
export const handleUnhandledRejection = () => {
    process.on('unhandledRejection', (reason: Error) => {
        log.error('Unhandled Rejection', {
            message: reason.message,
            stack: reason.stack,
        });

        // In production, you might want to exit the process
        // process.exit(1);
    });
};

/**
 * Uncaught exception handler
 * Catches synchronous errors that weren't caught
 */
export const handleUncaughtException = () => {
    process.on('uncaughtException', (error: Error) => {
        log.error('Uncaught Exception', {
            message: error.message,
            stack: error.stack,
        });

        // Exit the process - uncaught exceptions are serious
        process.exit(1);
    });
};
