/**
 * Database configuration and optimization utilities
 */
export declare const DATABASE_CONFIG: {
    readonly CONNECTION_POOL_SIZE: number;
    readonly CONNECTION_TIMEOUT: number;
    readonly QUERY_TIMEOUT: number;
    readonly CREDIT_OPERATION_TIMEOUT: number;
    readonly DEFAULT_ISOLATION_LEVEL: "ReadCommitted";
    readonly CREDIT_ISOLATION_LEVEL: "ReadCommitted";
    readonly MAX_RETRIES: number;
    readonly RETRY_DELAY_MS: number;
    readonly ENABLE_QUERY_LOGGING: boolean;
    readonly SLOW_QUERY_THRESHOLD_MS: number;
};
/**
 * Standard transaction options for credit operations
 */
export declare const CREDIT_TRANSACTION_OPTIONS: {
    readonly isolationLevel: "ReadCommitted";
    readonly timeout: number;
    readonly maxWait: number;
};
/**
 * Standard transaction options for general operations
 */
export declare const DEFAULT_TRANSACTION_OPTIONS: {
    readonly isolationLevel: "ReadCommitted";
    readonly timeout: number;
    readonly maxWait: number;
};
/**
 * Utility function to create retry logic for database operations
 */
export declare function withDatabaseRetry<T>(operation: () => Promise<T>, maxRetries?: number, delayMs?: number): Promise<T>;
/**
 * Performance monitoring utility for database queries
 */
export declare class DatabaseMetrics {
    private static instance;
    private queryStats;
    private constructor();
    static getInstance(): DatabaseMetrics;
    recordQuery(queryName: string, durationMs: number): void;
    getStats(): Record<string, {
        count: number;
        totalTime: number;
        avgTime: number;
    }>;
    reset(): void;
}
/**
 * Utility function to wrap database operations with performance monitoring
 */
export declare function withQueryMetrics<T>(queryName: string, operation: () => Promise<T>): Promise<T>;
/**
 * Environment variables documentation for database optimization
 */
export declare const DATABASE_ENV_VARS: {
    readonly DATABASE_POOL_SIZE: "Number of connections in the pool (default: 10)";
    readonly DATABASE_CONNECTION_TIMEOUT: "Connection timeout in milliseconds (default: 10000)";
    readonly DATABASE_QUERY_TIMEOUT: "Query timeout in milliseconds (default: 5000)";
    readonly CREDIT_OPERATION_TIMEOUT: "Credit operation timeout in milliseconds (default: 3000)";
    readonly DATABASE_MAX_RETRIES: "Maximum retry attempts for failed operations (default: 3)";
    readonly DATABASE_RETRY_DELAY_MS: "Base delay between retries in milliseconds (default: 1000)";
    readonly ENABLE_DATABASE_QUERY_LOGGING: "Enable query performance logging (default: false)";
    readonly SLOW_QUERY_THRESHOLD_MS: "Threshold for logging slow queries in milliseconds (default: 1000)";
};
//# sourceMappingURL=database-config.d.ts.map