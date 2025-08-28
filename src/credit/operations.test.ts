import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { HttpError } from 'wasp/server';
import type { User } from 'wasp/entities';
import { getUserCredits, consumeCredits } from './operations';
import { createInsufficientCreditsError } from './errors';

const mockContext = {
  user: null as User | null,
  entities: {
    User: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
};

const mockUser: User = {
  id: 'test-user-id',
  email: 'test@example.com',
  username: 'testuser',
  credits: 100,
  isEmailVerified: true,
  emailVerificationSentAt: new Date(),
  passwordResetSentAt: null,
  isAdmin: false,
  subscriptionStatus: null,
  subscriptionPlan: null,
  sendEmail: true,
  datePaid: null,
  checkoutSessionId: null,
  subscriptionId: null,
  lemonSqueezyCustomerId: null,
  stripeId: null,
  createdAt: new Date(),
};

describe('Credit Operations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockContext.user = { ...mockUser };
  });

  describe('getUserCredits', () => {
    it('should return user credits successfully', async () => {
      mockContext.entities.User.findUnique.mockResolvedValue(mockUser);

      const result = await getUserCredits({}, mockContext as any);

      expect(result).toEqual({
        success: true,
        data: { credits: 100 },
        correlationId: expect.any(String),
      });
      expect(mockContext.entities.User.findUnique).toHaveBeenCalledWith({
        where: { id: 'test-user-id' },
        select: { credits: true },
      });
    });

    it('should throw error when user is not authenticated', async () => {
      mockContext.user = null;

      await expect(getUserCredits({}, mockContext as any)).rejects.toThrow(
        new HttpError(401, 'User not authenticated')
      );
    });

    it('should handle user not found', async () => {
      mockContext.entities.User.findUnique.mockResolvedValue(null);

      const result = await getUserCredits({}, mockContext as any);

      expect(result).toEqual({
        success: false,
        error: 'User not found',
        correlationId: expect.any(String),
      });
    });

    it('should handle database errors gracefully', async () => {
      const dbError = new Error('Database connection failed');
      mockContext.entities.User.findUnique.mockRejectedValue(dbError);

      const result = await getUserCredits({}, mockContext as any);

      expect(result).toEqual({
        success: false,
        error: 'Failed to retrieve user credits',
        correlationId: expect.any(String),
      });
    });

    it('should accept custom correlation ID', async () => {
      const customCorrelationId = 'custom-123';
      mockContext.entities.User.findUnique.mockResolvedValue(mockUser);

      const result = await getUserCredits({ correlationId: customCorrelationId }, mockContext as any);

      expect(result.correlationId).toBe(customCorrelationId);
    });
  });

  describe('consumeCredits', () => {
    it('should consume credits successfully', async () => {
      const updatedUser = { ...mockUser, credits: 95 };
      mockContext.entities.User.update.mockResolvedValue(updatedUser);

      const result = await consumeCredits({ 
        creditsToConsume: 5,
        operationName: 'test-operation' 
      }, mockContext as any);

      expect(result).toEqual({
        success: true,
        data: { 
          remainingCredits: 95,
          creditsConsumed: 5,
          operationName: 'test-operation'
        },
        correlationId: expect.any(String),
      });

      expect(mockContext.entities.User.update).toHaveBeenCalledWith({
        where: { 
          id: 'test-user-id',
          credits: { gte: 5 }
        },
        data: { 
          credits: { decrement: 5 } 
        },
      });
    });

    it('should throw error when user is not authenticated', async () => {
      mockContext.user = null;

      await expect(consumeCredits({
        creditsToConsume: 5,
        operationName: 'test-operation'
      }, mockContext as any)).rejects.toThrow(
        new HttpError(401, 'User not authenticated')
      );
    });

    it('should throw error when user has insufficient credits', async () => {
      mockContext.entities.User.update.mockResolvedValue(null);

      await expect(consumeCredits({
        creditsToConsume: 150,
        operationName: 'test-operation'
      }, mockContext as any)).rejects.toThrow(HttpError);
    });

    it('should validate input parameters', async () => {
      await expect(consumeCredits({
        creditsToConsume: 0,
        operationName: 'test-operation'
      }, mockContext as any)).rejects.toThrow(HttpError);

      await expect(consumeCredits({
        creditsToConsume: -5,
        operationName: 'test-operation'
      }, mockContext as any)).rejects.toThrow(HttpError);

      await expect(consumeCredits({
        creditsToConsume: 5,
        operationName: ''
      }, mockContext as any)).rejects.toThrow(HttpError);
    });

    it('should handle database errors gracefully', async () => {
      const dbError = new Error('Database connection failed');
      mockContext.entities.User.update.mockRejectedValue(dbError);

      const result = await consumeCredits({
        creditsToConsume: 5,
        operationName: 'test-operation'
      }, mockContext as any);

      expect(result).toEqual({
        success: false,
        error: 'Failed to consume credits',
        correlationId: expect.any(String),
      });
    });

    it('should use custom correlation ID when provided', async () => {
      const customCorrelationId = 'custom-456';
      const updatedUser = { ...mockUser, credits: 95 };
      mockContext.entities.User.update.mockResolvedValue(updatedUser);

      const result = await consumeCredits({
        creditsToConsume: 5,
        operationName: 'test-operation',
        correlationId: customCorrelationId
      }, mockContext as any);

      expect(result.correlationId).toBe(customCorrelationId);
    });

    it('should handle edge case of consuming all remaining credits', async () => {
      const userWithFewCredits = { ...mockUser, credits: 5 };
      mockContext.user = userWithFewCredits;
      const updatedUser = { ...userWithFewCredits, credits: 0 };
      mockContext.entities.User.update.mockResolvedValue(updatedUser);

      const result = await consumeCredits({
        creditsToConsume: 5,
        operationName: 'test-operation'
      }, mockContext as any);

      expect(result).toEqual({
        success: true,
        data: {
          remainingCredits: 0,
          creditsConsumed: 5,
          operationName: 'test-operation'
        },
        correlationId: expect.any(String),
      });
    });
  });
});

describe('Credit Error Handling', () => {
  it('should create proper insufficient credits error', () => {
    const error = createInsufficientCreditsError(10, 5, 'correlation-123');
    
    expect(error).toBeInstanceOf(HttpError);
    expect(error.statusCode).toBe(402);
    expect(error.message).toContain('Insufficient credits');
    expect(error.data).toEqual({
      requiredCredits: 10,
      availableCredits: 5,
      correlationId: 'correlation-123'
    });
  });

  it('should create error without correlation ID', () => {
    const error = createInsufficientCreditsError(10, 5);
    
    expect(error).toBeInstanceOf(HttpError);
    expect(error.statusCode).toBe(402);
    expect(error.data.correlationId).toBeUndefined();
  });
});