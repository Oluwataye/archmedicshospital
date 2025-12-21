import winston from 'winston';
import path from 'path';
import fs from 'fs';

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

const level = () => {
    const env = process.env.NODE_ENV || 'development';
    const isDevelopment = env === 'development';
    return isDevelopment ? 'debug' : 'warn';
};

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
};

winston.addColors(colors);

const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
);

// Create logs directory if it doesn't exist AND not in production/Netlify
const isProduction = process.env.NODE_ENV === 'production' || !!process.env.NETLIFY;

if (!isProduction) {
    const logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) {
        try {
            // Only try to create if we are definitely not on Netlify
            if (!process.env.NETLIFY) {
                fs.mkdirSync(logsDir, { recursive: true });
            }
        } catch (e) {
            // Ignore error in production
            console.warn('Logging to console only - could not create logs directory');
        }
    }
}

const transports: winston.transport[] = [
    new winston.transports.Console(),
];

// Add file transports only in development
if (!isProduction) {
    transports.push(
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
        })
    );
    transports.push(
        new winston.transports.File({ filename: 'logs/all.log' })
    );
}

export const logger = winston.createLogger({
    level: level(),
    levels,
    format,
    transports,
});

/**
 * Helper functions for common log levels
 * Makes it easier to use throughout the application
 */
export const log = {
    error: (message: string, context?: Record<string, any>) => {
        if (context) {
            logger.error(`${message} ${JSON.stringify(context)}`);
        } else {
            logger.error(message);
        }
    },

    warn: (message: string, context?: Record<string, any>) => {
        if (context) {
            logger.warn(`${message} ${JSON.stringify(context)}`);
        } else {
            logger.warn(message);
        }
    },

    info: (message: string, context?: Record<string, any>) => {
        if (context) {
            logger.info(`${message} ${JSON.stringify(context)}`);
        } else {
            logger.info(message);
        }
    },

    http: (message: string, context?: Record<string, any>) => {
        if (context) {
            logger.http(`${message} ${JSON.stringify(context)}`);
        } else {
            logger.http(message);
        }
    },

    debug: (message: string, context?: Record<string, any>) => {
        if (context) {
            logger.debug(`${message} ${JSON.stringify(context)}`);
        } else {
            logger.debug(message);
        }
    },
};

