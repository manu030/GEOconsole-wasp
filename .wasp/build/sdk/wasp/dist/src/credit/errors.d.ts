import { HttpError } from 'wasp/server';
/**
 * Creates an InsufficientCreditsError with correlation ID and user-friendly message
 */
export declare const createInsufficientCreditsError: (requiredCredits: number, availableCredits: number, correlationId?: string) => HttpError;
/**
 * Creates a generic credit-related error with correlation ID
 */
export declare const createCreditError: (message: string, statusCode?: number, correlationId?: string) => HttpError;
/**
 * Type guard to check if error is an insufficient credits error
 */
export declare const isInsufficientCreditsError: (error: any) => error is HttpError & {
    type: "INSUFFICIENT_CREDITS";
    requiredCredits: number;
    availableCredits: number;
    correlationId?: string;
};
//# sourceMappingURL=errors.d.ts.map