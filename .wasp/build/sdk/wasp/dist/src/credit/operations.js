import { HttpError, prisma } from 'wasp/server';
import * as z from 'zod';
import { ensureArgsSchemaOrThrowHttpError } from '../server/validation';
import { createInsufficientCreditsError } from './errors';
import { logger, generateCorrelationId } from '../utils/logger';
// Input schema for getUserCredits
const getUserCreditsInputSchema = z.object({
    userId: z.string().nonempty().max(36).regex(/^[a-zA-Z0-9-]+$/, 'User ID must be a valid UUID format').optional(), // Optional - if not provided, use context.user.id, validate UUID format
});
export const getUserCredits = async (rawArgs, context) => {
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
    const correlationId = generateCorrelationId();
    try {
        const user = await context.entities.User.findUnique({
            where: { id: targetUserId },
            select: { id: true, credits: true, createdAt: true }
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
            lastUpdated: user.createdAt
        };
    }
    catch (error) {
        logger.error('Failed to retrieve user credits', {
            service: 'credit',
            operation: 'getUserCredits',
            userId: targetUserId,
            correlationId,
            error: error instanceof Error ? error.message : String(error)
        });
        throw error;
    }
};
// Input schema for consumeCredits
const consumeCreditsInputSchema = z.object({
    userId: z.string().nonempty().max(36).optional(), // Optional - if not provided, use context.user.id, max 36 chars for UUID
    amount: z.number().int().positive().max(100), // Maximum 100 credits per operation to prevent abuse
    operation: z.string().nonempty().max(200).regex(/^[a-zA-Z0-9_-]+$/, 'Operation name must contain only alphanumeric characters, hyphens, and underscores'), // Sanitized operation names
});
export const consumeCredits = async (rawArgs, context) => {
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
    const correlationId = generateCorrelationId();
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
    }
    catch (error) {
        logger.error('Failed to consume credits', {
            service: 'credit',
            operation: 'consumeCredits',
            userId: targetUserId,
            requestedAmount: amount,
            operationDescription: operation,
            correlationId,
            error: error instanceof Error ? error.message : String(error)
        });
        throw error;
    }
};
// Helper function to check if user has available credits (no database call needed if user object is available)
export const hasAvailableCredits = (userCredits, requiredAmount) => {
    return userCredits >= requiredAmount;
};
// Helper function to check credits with database call
export const checkUserHasCredits = async (userId, requiredAmount, entities) => {
    const user = await entities.User.findUnique({
        where: { id: userId },
        select: { credits: true }
    });
    if (!user) {
        return false;
    }
    return hasAvailableCredits(user.credits, requiredAmount);
};
//# sourceMappingURL=operations.js.map