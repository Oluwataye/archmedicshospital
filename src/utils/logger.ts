console.log('--- ROOT LOGGER INITIALIZING ---');
import winston from 'winston';

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'archmedics-hms' },
  transports: [
    new winston.transports.Console({
      format: process.env.NODE_ENV === 'production'
        ? logFormat
        : winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
    })
  ],
});

// File transports disabled for Netlify compatibility


