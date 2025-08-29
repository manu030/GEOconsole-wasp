/**
 * Error sanitization utilities to prevent sensitive information leakage
 */
/**
 * List of sensitive patterns that should not be exposed in logs or user-facing errors
 */
const SENSITIVE_PATTERNS = [
    /password/i,
    /token/i,
    /key/i,
    /secret/i,
    /auth/i,
    /credential/i,
    /api[_-]?key/i,
    /bearer/i,
    /session/i,
    /jwt/i,
    /database.*connection/i,
    /connection.*string/i,
    /host.*port/i,
    /username.*password/i,
];
/**
 * Database error patterns that should be sanitized
 */
const DB_ERROR_PATTERNS = [
    /duplicate.*key.*value/i,
    /foreign.*key.*constraint/i,
    /check.*constraint/i,
    /not.*null.*violation/i,
    /unique.*constraint/i,
];
/**
 * Map of known error types to user-friendly messages
 */
const ERROR_TYPE_MAPPING = {
    'ValidationError': 'Invalid input provided',
    'DatabaseError': 'Database operation failed',
    'AuthenticationError': 'Authentication required',
    'AuthorizationError': 'Access denied',
    'TimeoutError': 'Request timeout',
    'NetworkError': 'Network connection failed',
    'RateLimitError': 'Rate limit exceeded',
    'InsufficientCreditsError': 'Insufficient credits',
};
/**
 * Sanitize an error for safe logging (removes sensitive info but keeps debugging details)
 */
export function sanitizeErrorForLogging(error, correlationId) {
    if (!error) {
        return {
            message: 'Unknown error occurred',
            type: 'UnknownError',
        };
    }
    let message = '';
    let stack = '';
    let code = '';
    let type = 'UnknownError';
    if (error instanceof Error) {
        message = error.message || 'Unknown error';
        stack = error.stack || '';
        type = error.constructor.name || 'Error';
        // Extract error code if available (common in database errors)
        if ('code' in error && typeof error.code === 'string') {
            code = error.code;
        }
    }
    else if (typeof error === 'string') {
        message = error;
        type = 'StringError';
    }
    else {
        message = JSON.stringify(error);
        type = 'SerializedError';
    }
    // Sanitize message for sensitive patterns
    for (const pattern of SENSITIVE_PATTERNS) {
        if (pattern.test(message)) {
            message = `[SANITIZED] ${type} occurred`;
            break;
        }
    }
    // Sanitize database-specific errors
    for (const pattern of DB_ERROR_PATTERNS) {
        if (pattern.test(message)) {
            message = `Database constraint violation (${code || 'unknown'})`;
            break;
        }
    }
    return {
        message,
        stack: process.env.NODE_ENV === 'production' ? undefined : stack,
        code: code || undefined,
        type,
    };
}
/**
 * Sanitize an error for user-facing display (minimal information, user-friendly)
 */
export function sanitizeErrorForUser(error, correlationId) {
    if (!error) {
        return {
            message: 'An unexpected error occurred. Please try again.',
            type: 'UnknownError',
        };
    }
    let type = 'UnknownError';
    let message = 'An unexpected error occurred. Please try again.';
    if (error instanceof Error) {
        type = error.constructor.name || 'Error';
        // Use user-friendly messages for known error types
        if (type in ERROR_TYPE_MAPPING) {
            message = ERROR_TYPE_MAPPING[type];
        }
        // For HTTP errors, preserve the message if it's user-safe
        if (type === 'HttpError' && error.message) {
            const errorMessage = error.message.toLowerCase();
            const isSafe = !SENSITIVE_PATTERNS.some(pattern => pattern.test(errorMessage));
            if (isSafe) {
                message = error.message;
            }
        }
    }
    return {
        message: correlationId ? `${message} (ID: ${correlationId})` : message,
        type,
    };
}
/**
 * Check if an error contains potentially sensitive information
 */
export function containsSensitiveInfo(errorMessage) {
    return SENSITIVE_PATTERNS.some(pattern => pattern.test(errorMessage));
}
/**
 * Create a safe error summary for metrics and monitoring
 */
export function createErrorSummary(error, operation) {
    let errorType = 'UnknownError';
    let errorCode;
    let isSensitive = false;
    if (error instanceof Error) {
        errorType = error.constructor.name;
        isSensitive = containsSensitiveInfo(error.message);
        if ('code' in error && typeof error.code === 'string') {
            errorCode = error.code;
        }
    }
    else if (typeof error === 'string') {
        errorType = 'StringError';
        isSensitive = containsSensitiveInfo(error);
    }
    return {
        operation,
        errorType,
        errorCode,
        isSensitive,
    };
}
//# sourceMappingURL=error-sanitizer.js.map