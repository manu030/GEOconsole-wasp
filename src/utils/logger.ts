export interface LogContext {
  service: string;
  operation: string;
  userId?: string;
  projectId?: string;
  domain?: string;
  correlationId?: string;
  error?: string | Error;
  metadata?: Record<string, any>;
  [key: string]: any; // Allow additional properties
}

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Structured logger with correlation IDs and context awareness
 * In development: logs to console with formatting
 * In production: structured JSON logs (ready for log aggregation)
 */
class Logger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV !== 'production';
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const correlationId = context?.correlationId || 'no-correlation-id';
    
    if (this.isDevelopment) {
      // Human-readable format for development
      const contextStr = context ? JSON.stringify(context, null, 2) : '';
      return `[${timestamp}] ${level.toUpperCase()} [${correlationId}] ${message}${contextStr ? `\nContext: ${contextStr}` : ''}`;
    } else {
      // Structured JSON for production
      return JSON.stringify({
        timestamp,
        level: level.toUpperCase(),
        message,
        correlationId,
        ...context
      });
    }
  }

  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.debug(this.formatMessage('debug', message, context));
    }
  }

  info(message: string, context?: LogContext): void {
    console.info(this.formatMessage('info', message, context));
  }

  warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage('warn', message, context));
  }

  error(message: string, context?: LogContext): void {
    console.error(this.formatMessage('error', message, context));
  }

  /**
   * Create a child logger with preset context
   */
  child(baseContext: Partial<LogContext>): Logger {
    const childLogger = new Logger();
    
    // Override methods to include base context
    const originalMethods = {
      debug: childLogger.debug.bind(childLogger),
      info: childLogger.info.bind(childLogger), 
      warn: childLogger.warn.bind(childLogger),
      error: childLogger.error.bind(childLogger)
    };

    childLogger.debug = (message: string, context?: LogContext) => {
      originalMethods.debug(message, { ...baseContext, ...context });
    };

    childLogger.info = (message: string, context?: LogContext) => {
      originalMethods.info(message, { ...baseContext, ...context });
    };

    childLogger.warn = (message: string, context?: LogContext) => {
      originalMethods.warn(message, { ...baseContext, ...context });
    };

    childLogger.error = (message: string, context?: LogContext) => {
      originalMethods.error(message, { ...baseContext, ...context });
    };

    return childLogger;
  }
}

// Export singleton logger instance
export const logger = new Logger();

// Export utility functions
export const generateCorrelationId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const createServiceLogger = (service: string) => {
  return logger.child({ service });
};