import { type User } from 'wasp/entities';
import { HttpError, prisma } from 'wasp/server';
import { type GetUserCredits, type ConsumeCredits } from 'wasp/server/operations';
import * as z from 'zod';
import { ensureArgsSchemaOrThrowHttpError } from '../server/validation';
import { createInsufficientCreditsError } from './errors';
import { logger } from '../utils/logger';

// Input schema for getUserCredits
const getUserCreditsInputSchema = z.object({
  userId: z.string().nonempty().optional(), // Optional - if not provided, use context.user.id
});

type GetUserCreditsInput = z.infer<typeof getUserCreditsInputSchema>;

// Output type for getUserCredits
type GetUserCreditsOutput = {
  userId: string;
  credits: number;
  lastUpdated: Date;
};

export const getUserCredits: GetUserCredits<GetUserCreditsInput, GetUserCreditsOutput> = async (
  rawArgs,
  context
) => {
  const { userId } = ensureArgsSchemaOrThrowHttpError(getUserCreditsInputSchema, rawArgs);

  if (!context.user) {
    throw new HttpError(401, 'Only authenticated users can access credit information');
  }

  // If userId not provided, use current user. If provided, verify access rights.
  const targetUserId = userId || context.user.id;
  
  // Only allow users to see their own credits (or admins to see any user's credits)
  if (targetUserId !== context.user.id && !context.user.isAdmin) {
    throw new HttpError(403, 'You can only access your own credit information');
  }

  const correlationId = `get-credits-${Date.now()}`;
  
  try {
    const user = await context.entities.User.findUnique({
      where: { id: targetUserId },
      select: { id: true, credits: true, updatedAt: true }
    });

    if (!user) {
      throw new HttpError(404, 'User not found');
    }

    logger.info('Credits retrieved successfully', {
      service: 'credit',
      operation: 'getUserCredits',
      userId: targetUserId,
      credits: user.credits,
      correlationId
    });

    return {
      userId: user.id,
      credits: user.credits,
      lastUpdated: user.updatedAt
    };

  } catch (error) {
    logger.error('Failed to retrieve user credits', {
      service: 'credit',
      operation: 'getUserCredits',
      userId: targetUserId,
      correlationId,
      error
    });
    throw error;
  }
};

// Input schema for consumeCredits
const consumeCreditsInputSchema = z.object({
  userId: z.string().nonempty().optional(), // Optional - if not provided, use context.user.id
  amount: z.number().int().positive(),
  operation: z.string().nonempty(), // Description of what operation consumed the credits
});

type ConsumeCreditsInput = z.infer<typeof consumeCreditsInputSchema>;

// Output type for consumeCredits
type ConsumeCreditsOutput = {
  userId: string;
  creditsRemaining: number;
  creditsConsumed: number;
  operation: string;
};

export const consumeCredits: ConsumeCredits<ConsumeCreditsInput, ConsumeCreditsOutput> = async (
  rawArgs,
  context
) => {
  const { userId, amount, operation } = ensureArgsSchemaOrThrowHttpError(consumeCreditsInputSchema, rawArgs);

  if (!context.user) {
    throw new HttpError(401, 'Only authenticated users can consume credits');
  }

  // If userId not provided, use current user. If provided, verify access rights.
  const targetUserId = userId || context.user.id;
  
  // Only allow users to consume their own credits (or admins for any user)
  if (targetUserId !== context.user.id && !context.user.isAdmin) {
    throw new HttpError(403, 'You can only consume your own credits');
  }

  const correlationId = `consume-credits-${Date.now()}`;

  try {
    // Use transaction to ensure atomic credit consumption
    const result = await prisma.$transaction(async (tx) => {
      // First, get current credits
      const user = await tx.user.findUnique({
        where: { id: targetUserId },
        select: { id: true, credits: true }
      });

      if (!user) {
        throw new HttpError(404, 'User not found');
      }

      // Check if user has sufficient credits
      if (user.credits < amount) {
        throw createInsufficientCreditsError(amount, user.credits, correlationId);
      }

      // Consume credits
      const updatedUser = await tx.user.update({
        where: { id: targetUserId },
        data: {
          credits: {
            decrement: amount
          }
        },
        select: { id: true, credits: true }
      });

      return {
        userId: updatedUser.id,
        creditsRemaining: updatedUser.credits,
        creditsConsumed: amount,
        operation
      };
    });

    logger.info('Credits consumed successfully', {
      service: 'credit',
      operation: 'consumeCredits',
      userId: targetUserId,
      creditsConsumed: amount,
      creditsRemaining: result.creditsRemaining,
      operationDescription: operation,
      correlationId
    });

    return result;

  } catch (error) {
    logger.error('Failed to consume credits', {
      service: 'credit',
      operation: 'consumeCredits',
      userId: targetUserId,
      requestedAmount: amount,
      operationDescription: operation,
      correlationId,
      error
    });
    throw error;
  }
};

// Helper function to check if user has available credits (no database call needed if user object is available)
export const hasAvailableCredits = (userCredits: number, requiredAmount: number): boolean => {
  return userCredits >= requiredAmount;
};

// Helper function to check credits with database call
export const checkUserHasCredits = async (
  userId: string, 
  requiredAmount: number,
  entities: any
): Promise<boolean> => {
  const user = await entities.User.findUnique({
    where: { id: userId },
    select: { credits: true }
  });

  if (!user) {
    return false;
  }

  return hasAvailableCredits(user.credits, requiredAmount);
};