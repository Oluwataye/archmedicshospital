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

// Add file transports only in development and not on Netlify
const isProductionFrontend = process.env.NODE_ENV === 'production' || !!process.env.NETLIFY;
if (!isProductionFrontend) {
  try {
    logger.add(new winston.transports.File({ filename: 'logs/error.log', level: 'error' }));
    logger.add(new winston.transports.File({ filename: 'logs/combined.log' }));
  } catch (e) {
    console.warn('Frontend logging to console only');
  }
}

