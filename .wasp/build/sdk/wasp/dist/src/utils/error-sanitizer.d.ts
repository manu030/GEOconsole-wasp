/**
 * Error sanitization utilities to prevent sensitive information leakage
 */
export interface SanitizedError {
    message: string;
    stack?: string;
    code?: string;
    type: string;
}
/**
 * Sanitize an error for safe logging (removes sensitive info but keeps debugging details)
 */
export declare function sanitizeErrorForLogging(error: unknown, correlationId?: string): SanitizedError;
/**
 * Sanitize an error for user-facing display (minimal information, user-friendly)
 */
export declare function sanitizeErrorForUser(error: unknown, correlationId?: string): SanitizedError;
/**
 * Check if an error contains potentially sensitive information
 */
export declare function containsSensitiveInfo(errorMessage: string): boolean;
/**
 * Create a safe error summary for metrics and monitoring
 */
export declare function createErrorSummary(error: unknown, operation: string): {
    operation: string;
    errorType: string;
    errorCode?: string;
    isSensitive: boolean;
};
//# sourceMappingURL=error-sanitizer.d.ts.map