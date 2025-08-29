/**
 * Database configuration and optimization utilities
 */
export const DATABASE_CONFIG = {
    // Connection pool settings
    CONNECTION_POOL_SIZE: parseInt(process.env.DATABASE_POOL_SIZE || '10', 10),
    CONNECTION_TIMEOUT: parseInt(process.env.DATABASE_CONNECTION_TIMEOUT || '10000', 10), // 10 seconds
    QUERY_TIMEOUT: parseInt(process.env.DATABASE_QUERY_TIMEOUT || '5000', 10), // 5 seconds
    // Credit operation specific timeouts
    CREDIT_OPERATION_TIMEOUT: parseInt(process.env.CREDIT_OPERATION_TIMEOUT || '3000', 10), // 3 seconds
    // Transaction isolation levels
    DEFAULT_ISOLATION_LEVEL: 'ReadCommitted',
    CREDIT_ISOLATION_LEVEL: 'ReadCommitted',
    // Retry configuration
    MAX_RETRIES: parseInt(process.env.DATABASE_MAX_RETRIES || '3', 10),
    RETRY_DELAY_MS: parseInt(process.env.DATABASE_RETRY_DELAY_MS || '1000', 10),
    // Performance monitoring
    ENABLE_QUERY_LOGGING: process.env.ENABLE_DATABASE_QUERY_LOGGING === 'true',
    SLOW_QUERY_THRESHOLD_MS: parseInt(process.env.SLOW_QUERY_THRESHOLD_MS || '1000', 10),
};
/**
 * Standard transaction options for credit operations
 */
export const CREDIT_TRANSACTION_OPTIONS = {
    isolationLevel: DATABASE_CONFIG.CREDIT_ISOLATION_LEVEL,
    timeout: DATABASE_CONFIG.CREDIT_OPERATION_TIMEOUT,
    maxWait: DATABASE_CONFIG.CONNECTION_TIMEOUT,
};
/**
 * Standard transaction options for general operations
 */
export const DEFAULT_TRANSACTION_OPTIONS = {
    isolationLevel: DATABASE_CONFIG.DEFAULT_ISOLATION_LEVEL,
    timeout: DATABASE_CONFIG.QUERY_TIMEOUT,
    maxWait: DATABASE_CONFIG.CONNECTION_TIMEOUT,
};
/**
 * Utility function to create retry logic for database operations
 */
export async function withDatabaseRetry(operation, maxRetries = DATABASE_CONFIG.MAX_RETRIES, delayMs = DATABASE_CONFIG.RETRY_DELAY_MS) {
    let lastError;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        }
        catch (error) {
            lastError = error;
            // Don't retry on certain error types
            if (isNonRetryableError(error)) {
                throw error;
            }
            // If this is the last attempt, throw the error
            if (attempt === maxRetries) {
                throw error;
            }
            // Wait before retry with exponential backoff
            const delay = delayMs * Math.pow(2, attempt - 1);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw lastError;
}
/**
 * Check if an error should not be retried
 */
function isNonRetryableError(error) {
    if (!(error instanceof Error))
        return false;
    const errorMessage = error.message.toLowerCase();
    // Don't retry validation errors, authorization errors, etc.
    const nonRetryablePatterns = [
        'unique constraint',
        'foreign key constraint',
        'not null violation',
        'check constraint',
        'validation failed',
        'unauthorized',
        'forbidden',
        'invalid input',
    ];
    return nonRetryablePatterns.some(pattern => errorMessage.includes(pattern));
}
/**
 * Performance monitoring utility for database queries
 */
export class DatabaseMetrics {
    static instance;
    queryStats;
    constructor() {
        this.queryStats = new Map();
    }
    static getInstance() {
        if (!DatabaseMetrics.instance) {
            DatabaseMetrics.instance = new DatabaseMetrics();
        }
        return DatabaseMetrics.instance;
    }
    recordQuery(queryName, durationMs) {
        if (!DATABASE_CONFIG.ENABLE_QUERY_LOGGING)
            return;
        const existing = this.queryStats.get(queryName) || { count: 0, totalTime: 0, avgTime: 0 };
        const newCount = existing.count + 1;
        const newTotalTime = existing.totalTime + durationMs;
        const newAvgTime = newTotalTime / newCount;
        this.queryStats.set(queryName, {
            count: newCount,
            totalTime: newTotalTime,
            avgTime: newAvgTime,
        });
        // Log slow queries
        if (durationMs > DATABASE_CONFIG.SLOW_QUERY_THRESHOLD_MS) {
            console.warn(`Slow query detected: ${queryName} took ${durationMs}ms`);
        }
    }
    getStats() {
        return Object.fromEntries(this.queryStats);
    }
    reset() {
        this.queryStats.clear();
    }
}
/**
 * Utility function to wrap database operations with performance monitoring
 */
export async function withQueryMetrics(queryName, operation) {
    const startTime = Date.now();
    const metrics = DatabaseMetrics.getInstance();
    try {
        const result = await operation();
        const duration = Date.now() - startTime;
        metrics.recordQuery(queryName, duration);
        return result;
    }
    catch (error) {
        const duration = Date.now() - startTime;
        metrics.recordQuery(`${queryName}:error`, duration);
        throw error;
    }
}
/**
 * Environment variables documentation for database optimization
 */
export const DATABASE_ENV_VARS = {
    DATABASE_POOL_SIZE: 'Number of connections in the pool (default: 10)',
    DATABASE_CONNECTION_TIMEOUT: 'Connection timeout in milliseconds (default: 10000)',
    DATABASE_QUERY_TIMEOUT: 'Query timeout in milliseconds (default: 5000)',
    CREDIT_OPERATION_TIMEOUT: 'Credit operation timeout in milliseconds (default: 3000)',
    DATABASE_MAX_RETRIES: 'Maximum retry attempts for failed operations (default: 3)',
    DATABASE_RETRY_DELAY_MS: 'Base delay between retries in milliseconds (default: 1000)',
    ENABLE_DATABASE_QUERY_LOGGING: 'Enable query performance logging (default: false)',
    SLOW_QUERY_THRESHOLD_MS: 'Threshold for logging slow queries in milliseconds (default: 1000)',
};
//# sourceMappingURL=database-config.js.map