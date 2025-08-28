import { HttpError, prisma } from 'wasp/server';
import { createInsufficientCreditsError } from './errors';
import { logger, generateCorrelationId } from '../utils/logger';
import { hasAvailableCredits } from './operations';
import { CREDIT_TRANSACTION_OPTIONS, withDatabaseRetry, withQueryMetrics } from '../utils/database-config';

/**
 * Higher-order function that wraps operations requiring visibility analysis credits
 * Handles: 1 credit = 1 complete visibility analysis (keyword extraction + query generation + ChatGPT analysis)
 */
export const withVisibilityAnalysisCredit = async <T>(
  userId: string,
  operationName: string,
  operation: () => Promise<T>
): Promise<T> => {
  const correlationId = generateCorrelationId();
  const requiredCredits = 1; // 1 credit for complete visibility analysis
  
  logger.info('Starting visibility analysis with credit check', {
    service: 'credit',
    operation: 'withVisibilityAnalysisCredit',
    userId,
    requiredCredits,
    operationName,
    correlationId
  });

  try {
    // Phase 1: Check and reserve credits atomically
    const creditReservation = await prisma.$transaction(async (tx) => {
      // 1. Check current user credits
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { id: true, credits: true }
      });

      if (!user) {
        throw new HttpError(404, 'User not found');
      }

      // 2. Validate sufficient credits
      if (!hasAvailableCredits(user.credits, requiredCredits)) {
        throw createInsufficientCreditsError(requiredCredits, user.credits, correlationId);
      }

      // 3. Reserve credits by consuming them immediately
      // This prevents race conditions and ensures credits are consumed even if operation fails
      const updatedUser = await tx.user.update({
        where: { 
          id: userId,
          credits: { gte: requiredCredits } // Double-check during update
        },
        data: {
          credits: {
            decrement: requiredCredits
          }
        },
        select: { credits: true }
      });

      if (!updatedUser) {
        throw createInsufficientCreditsError(requiredCredits, user.credits, correlationId);
      }

      return {
        remainingCredits: updatedUser.credits,
        creditsConsumed: requiredCredits
      };
    }, CREDIT_TRANSACTION_OPTIONS);

    logger.info('Credits reserved, executing visibility analysis operation', {
      service: 'credit',
      operation: operationName,
      userId,
      creditsConsumed: creditReservation.creditsConsumed,
      remainingCredits: creditReservation.remainingCredits,
      correlationId
    });

    // Phase 2: Execute operation (credits already consumed)
    try {
      const operationResult = await operation();

      logger.info('Visibility analysis completed successfully', {
        service: 'credit',
        operation: operationName,
        userId,
        creditsConsumed: creditReservation.creditsConsumed,
        correlationId
      });

      return operationResult;
    } catch (operationError) {
      // Operation failed after credits consumed - this is expected behavior
      // Credits should be consumed for API calls regardless of success/failure
      logger.warn('Visibility analysis operation failed after credit consumption', {
        service: 'credit',
        operation: operationName,
        userId,
        creditsConsumed: creditReservation.creditsConsumed,
        error: operationError instanceof Error ? operationError.message : String(operationError),
        correlationId
      });
      
      throw operationError;
    }

  } catch (error) {
    logger.error('Visibility analysis failed', {
      service: 'credit',
      operation: operationName,
      userId,
      requiredCredits,
      correlationId,
      error: error instanceof Error ? error.message : String(error)
    });

    // Re-throw the error to maintain existing error handling patterns
    throw error;
  }
};

/**
 * Higher-order function that wraps operations requiring content generation credits
 * Handles: 1 additional credit for AI-optimized content generation
 */
export const withContentGenerationCredit = async <T>(
  userId: string,
  operationName: string,
  operation: () => Promise<T>
): Promise<T> => {
  const correlationId = generateCorrelationId();
  const requiredCredits = 1; // 1 credit for content generation
  
  logger.info('Starting content generation with credit check', {
    service: 'credit',
    operation: 'withContentGenerationCredit',
    userId,
    requiredCredits,
    operationName,
    correlationId
  });

  try {
    // Phase 1: Check and reserve credits atomically
    const creditReservation = await prisma.$transaction(async (tx) => {
      // 1. Check current user credits
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { id: true, credits: true }
      });

      if (!user) {
        throw new HttpError(404, 'User not found');
      }

      // 2. Validate sufficient credits
      if (!hasAvailableCredits(user.credits, requiredCredits)) {
        throw createInsufficientCreditsError(requiredCredits, user.credits, correlationId);
      }

      // 3. Reserve credits by consuming them immediately
      // This prevents race conditions and ensures credits are consumed even if operation fails
      const updatedUser = await tx.user.update({
        where: { 
          id: userId,
          credits: { gte: requiredCredits } // Double-check during update
        },
        data: {
          credits: {
            decrement: requiredCredits
          }
        },
        select: { credits: true }
      });

      if (!updatedUser) {
        throw createInsufficientCreditsError(requiredCredits, user.credits, correlationId);
      }

      return {
        remainingCredits: updatedUser.credits,
        creditsConsumed: requiredCredits
      };
    }, CREDIT_TRANSACTION_OPTIONS);

    logger.info('Credits reserved, executing content generation operation', {
      service: 'credit',
      operation: operationName,
      userId,
      creditsConsumed: creditReservation.creditsConsumed,
      remainingCredits: creditReservation.remainingCredits,
      correlationId
    });

    // Phase 2: Execute operation (credits already consumed)
    try {
      const operationResult = await operation();

      logger.info('Content generation completed successfully', {
        service: 'credit',
        operation: operationName,
        userId,
        creditsConsumed: creditReservation.creditsConsumed,
        correlationId
      });

      return operationResult;
    } catch (operationError) {
      // Operation failed after credits consumed - this is expected behavior
      // Credits should be consumed for API calls regardless of success/failure
      logger.warn('Content generation operation failed after credit consumption', {
        service: 'credit',
        operation: operationName,
        userId,
        creditsConsumed: creditReservation.creditsConsumed,
        error: operationError instanceof Error ? operationError.message : String(operationError),
        correlationId
      });
      
      throw operationError;
    }

  } catch (error) {
    logger.error('Content generation failed', {
      service: 'credit',
      operation: operationName,
      userId,
      requiredCredits,
      correlationId,
      error: error instanceof Error ? error.message : String(error)
    });

    throw error;
  }
};

/**
 * Utility function to check if user has enough credits without consuming them
 * Useful for UI state management and pre-validation
 */
export const checkUserCreditsForOperation = async (
  userId: string,
  operationType: 'visibility_analysis' | 'content_generation'
): Promise<{ hasCredits: boolean; currentCredits: number; requiredCredits: number }> => {
  const requiredCredits = operationType === 'visibility_analysis' ? 1 : 1;
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { credits: true }
  });

  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  return {
    hasCredits: hasAvailableCredits(user.credits, requiredCredits),
    currentCredits: user.credits,
    requiredCredits
  };
};

/**
 * Utility function to get credit cost for different operation types
 */
export const getCreditCost = (operationType: 'visibility_analysis' | 'content_generation'): number => {
  switch (operationType) {
    case 'visibility_analysis':
      return 1; // Complete analysis: keyword extraction + query generation + ChatGPT analysis
    case 'content_generation':
      return 1; // AI-optimized content generation
    default:
      throw new Error(`Unknown operation type: ${operationType}`);
  }
};

/**
 * Constants for credit system
 */
export const CREDIT_COSTS = {
  VISIBILITY_ANALYSIS: 1,
  CONTENT_GENERATION: 1,
} as const;

export const OPERATION_DESCRIPTIONS = {
  VISIBILITY_ANALYSIS: 'Complete AI visibility analysis',
  CONTENT_GENERATION: 'AI-optimized content generation',
} as const;