/**
 * Frontend Logger Utility
 * Provides environment-aware logging for the React frontend
 */

const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

interface LogData {
    [key: string]: any;
}

class FrontendLogger {
    private formatMessage(level: string, message: string, data?: LogData): string {
        const timestamp = new Date().toISOString();
        const dataStr = data ? ` ${JSON.stringify(data)}` : '';
        return `[${timestamp}] [${level}] ${message}${dataStr}`;
    }

    info(message: string, data?: LogData): void {
        if (isDevelopment) {
            console.log(this.formatMessage('INFO', message, data));
        }
    }

    warn(message: string, data?: LogData): void {
        if (isDevelopment) {
            console.warn(this.formatMessage('WARN', message, data));
        }
    }

    error(message: string, error?: Error | unknown, data?: LogData): void {
        const errorData = error instanceof Error ? {
            message: error.message,
            stack: error.stack,
            ...data
        } : data;

        if (isDevelopment) {
            console.error(this.formatMessage('ERROR', message, errorData));
        }

        // In production, send to error tracking service
        if (isProduction) {
            // TODO: Integrate with error tracking service (e.g., Sentry)
            // this.sendToErrorTracking(message, errorData);
        }
    }

    debug(message: string, data?: LogData): void {
        if (isDevelopment) {
            console.debug(this.formatMessage('DEBUG', message, data));
        }
    }

    group(label: string): void {
        if (isDevelopment) {
            console.group(label);
        }
    }

    groupEnd(): void {
        if (isDevelopment) {
            console.groupEnd();
        }
    }

    table(data: any): void {
        if (isDevelopment) {
            console.table(data);
        }
    }
}

export const log = new FrontendLogger();
