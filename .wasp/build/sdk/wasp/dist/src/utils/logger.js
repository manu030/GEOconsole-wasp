import crypto from 'crypto';
import { sanitizeErrorForLogging } from './error-sanitizer';
/**
 * Structured logger with correlation IDs and context awareness
 * In development: logs to console with formatting
 * In production: structured JSON logs (ready for log aggregation)
 */
class Logger {
    isDevelopment;
    constructor() {
        this.isDevelopment = process.env.NODE_ENV !== 'production';
    }
    formatMessage(level, message, context) {
        const timestamp = new Date().toISOString();
        const correlationId = context?.correlationId || 'no-correlation-id';
        // Create a safe copy of context and sanitize errors
        let safeContext = { ...context };
        if (context?.error) {
            const sanitizedError = sanitizeErrorForLogging(context.error, correlationId);
            safeContext = {
                ...context,
                error: sanitizedError.message,
                errorType: sanitizedError.type,
                ...(sanitizedError.code && { errorCode: sanitizedError.code }),
                ...(sanitizedError.stack && { stack: sanitizedError.stack }),
            };
            delete safeContext.error; // Remove original error object
        }
        if (this.isDevelopment) {
            // Human-readable format for development
            const contextStr = safeContext ? JSON.stringify(safeContext, null, 2) : '';
            return `[${timestamp}] ${level.toUpperCase()} [${correlationId}] ${message}${contextStr ? `\nContext: ${contextStr}` : ''}`;
        }
        else {
            // Structured JSON for production
            return JSON.stringify({
                timestamp,
                level: level.toUpperCase(),
                message,
                correlationId,
                ...safeContext
            });
        }
    }
    debug(message, context) {
        if (this.isDevelopment) {
            console.debug(this.formatMessage('debug', message, context));
        }
    }
    info(message, context) {
        console.info(this.formatMessage('info', message, context));
    }
    warn(message, context) {
        console.warn(this.formatMessage('warn', message, context));
    }
    error(message, context) {
        console.error(this.formatMessage('error', message, context));
    }
    /**
     * Create a child logger with preset context
     */
    child(baseContext) {
        const childLogger = new Logger();
        // Override methods to include base context
        const originalMethods = {
            debug: childLogger.debug.bind(childLogger),
            info: childLogger.info.bind(childLogger),
            warn: childLogger.warn.bind(childLogger),
            error: childLogger.error.bind(childLogger)
        };
        childLogger.debug = (message, context) => {
            originalMethods.debug(message, { ...baseContext, ...context });
        };
        childLogger.info = (message, context) => {
            originalMethods.info(message, { ...baseContext, ...context });
        };
        childLogger.warn = (message, context) => {
            originalMethods.warn(message, { ...baseContext, ...context });
        };
        childLogger.error = (message, context) => {
            originalMethods.error(message, { ...baseContext, ...context });
        };
        return childLogger;
    }
}
// Export singleton logger instance
export const logger = new Logger();
// Export utility functions
export const generateCorrelationId = () => {
    // Use Node.js crypto.randomUUID() for proper UUID v4 generation
    // Falls back to manual UUID generation if not available
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    // Fallback UUID v4 generation
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};
export const createServiceLogger = (service) => {
    return logger.child({ service });
};
//# sourceMappingURL=logger.js.map