import { HttpError } from 'wasp/server';
import { logger } from '../utils/logger';

/**
 * Creates an InsufficientCreditsError with correlation ID and user-friendly message
 */
export const createInsufficientCreditsError = (
  requiredCredits: number,
  availableCredits: number,
  correlationId?: string
): HttpError => {
  const errorMessage = `Insufficient credits: ${requiredCredits} required, ${availableCredits} available`;
  const userMessage = 'Not enough credits available for this analysis';

  if (correlationId) {
    logger.error('Credit validation failed', {
      service: 'credit',
      operation: 'creditValidation',
      requiredCredits,
      availableCredits,
      correlationId,
      error: errorMessage
    });
  }

  // Using 402 Payment Required status code for insufficient credits
  const httpError = new HttpError(402, userMessage);
  
  // Add custom properties for error handling
  (httpError as any).type = 'INSUFFICIENT_CREDITS';
  (httpError as any).requiredCredits = requiredCredits;
  (httpError as any).availableCredits = availableCredits;
  (httpError as any).correlationId = correlationId;
  (httpError as any).retryable = false; // User needs to purchase more credits
  
  return httpError;
};

/**
 * Creates a generic credit-related error with correlation ID
 */
export const createCreditError = (
  message: string,
  statusCode: number = 400,
  correlationId?: string
): HttpError => {
  if (correlationId) {
    logger.error('Credit operation error', {
      service: 'credit',
      operation: 'creditError',
      correlationId,
      error: message
    });
  }

  const httpError = new HttpError(statusCode, message);
  (httpError as any).correlationId = correlationId;
  
  return httpError;
};

/**
 * Type guard to check if error is an insufficient credits error
 */
export const isInsufficientCreditsError = (error: any): error is HttpError & {
  type: 'INSUFFICIENT_CREDITS';
  requiredCredits: number;
  availableCredits: number;
  correlationId?: string;
} => {
  return error instanceof HttpError && 
         error.statusCode === 402 && 
         (error as any).type === 'INSUFFICIENT_CREDITS';
};