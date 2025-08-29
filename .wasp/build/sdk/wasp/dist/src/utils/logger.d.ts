export interface LogContext {
    service: string;
    operation: string;
    userId?: string;
    projectId?: string;
    domain?: string;
    correlationId?: string;
    error?: string | Error;
    metadata?: Record<string, any>;
    [key: string]: any;
}
/**
 * Structured logger with correlation IDs and context awareness
 * In development: logs to console with formatting
 * In production: structured JSON logs (ready for log aggregation)
 */
declare class Logger {
    private isDevelopment;
    constructor();
    private formatMessage;
    debug(message: string, context?: LogContext): void;
    info(message: string, context?: LogContext): void;
    warn(message: string, context?: LogContext): void;
    error(message: string, context?: LogContext): void;
    /**
     * Create a child logger with preset context
     */
    child(baseContext: Partial<LogContext>): Logger;
}
export declare const logger: Logger;
export declare const generateCorrelationId: () => string;
export declare const createServiceLogger: (service: string) => Logger;
export {};
//# sourceMappingURL=logger.d.ts.map