import { describe, expect, it, jest, beforeEach } from '@jest/globals';
import { HttpError } from 'wasp/server';
import { withVisibilityAnalysisCredit, withContentGenerationCredit } from './integration';
import * as operations from './operations';
import { createInsufficientCreditsError } from './errors';

jest.mock('./operations');
const mockOperations = operations as jest.Mocked<typeof operations>;

describe('Credit Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('withVisibilityAnalysisCredit', () => {
    it('should execute operation successfully when user has enough credits', async () => {
      const mockOperation = jest.fn().mockResolvedValue('operation result');
      mockOperations.consumeCredits.mockResolvedValue({
        success: true,
        data: { remainingCredits: 95, creditsConsumed: 1, operationName: 'visibility-analysis' },
        correlationId: 'test-correlation-id'
      });

      const result = await withVisibilityAnalysisCredit(
        'user-123',
        'visibility-analysis',
        mockOperation
      );

      expect(result).toBe('operation result');
      expect(mockOperations.consumeCredits).toHaveBeenCalledWith(
        {
          creditsToConsume: 1,
          operationName: 'visibility-analysis',
          correlationId: expect.any(String)
        },
        expect.any(Object)
      );
      expect(mockOperation).toHaveBeenCalled();
    });

    it('should throw insufficient credits error when user has no credits', async () => {
      const mockOperation = jest.fn();
      const insufficientCreditsError = createInsufficientCreditsError(1, 0, 'correlation-123');
      mockOperations.consumeCredits.mockRejectedValue(insufficientCreditsError);

      await expect(
        withVisibilityAnalysisCredit('user-123', 'visibility-analysis', mockOperation)
      ).rejects.toThrow(HttpError);

      expect(mockOperation).not.toHaveBeenCalled();
    });

    it('should handle operation failures and not consume credits twice', async () => {
      const mockOperation = jest.fn().mockRejectedValue(new Error('Operation failed'));
      mockOperations.consumeCredits.mockResolvedValue({
        success: true,
        data: { remainingCredits: 99, creditsConsumed: 1, operationName: 'visibility-analysis' },
        correlationId: 'test-correlation-id'
      });

      await expect(
        withVisibilityAnalysisCredit('user-123', 'visibility-analysis', mockOperation)
      ).rejects.toThrow('Operation failed');

      expect(mockOperations.consumeCredits).toHaveBeenCalledOnce();
      expect(mockOperation).toHaveBeenCalled();
    });

    it('should handle credit consumption service errors', async () => {
      const mockOperation = jest.fn();
      mockOperations.consumeCredits.mockResolvedValue({
        success: false,
        error: 'Database connection failed',
        correlationId: 'test-correlation-id'
      });

      await expect(
        withVisibilityAnalysisCredit('user-123', 'visibility-analysis', mockOperation)
      ).rejects.toThrow('Credit consumption failed');

      expect(mockOperation).not.toHaveBeenCalled();
    });

    it('should pass correlation ID through the chain', async () => {
      const mockOperation = jest.fn().mockResolvedValue('result');
      const correlationId = 'custom-correlation-123';
      mockOperations.consumeCredits.mockResolvedValue({
        success: true,
        data: { remainingCredits: 99, creditsConsumed: 1, operationName: 'visibility-analysis' },
        correlationId
      });

      await withVisibilityAnalysisCredit(
        'user-123',
        'visibility-analysis',
        mockOperation,
        correlationId
      );

      expect(mockOperations.consumeCredits).toHaveBeenCalledWith(
        expect.objectContaining({ correlationId }),
        expect.any(Object)
      );
    });
  });

  describe('withContentGenerationCredit', () => {
    it('should execute operation successfully when user has enough credits', async () => {
      const mockOperation = jest.fn().mockResolvedValue({ generated: 'content' });
      mockOperations.consumeCredits.mockResolvedValue({
        success: true,
        data: { remainingCredits: 98, creditsConsumed: 1, operationName: 'content-generation' },
        correlationId: 'test-correlation-id'
      });

      const result = await withContentGenerationCredit(
        'user-456',
        'content-generation',
        mockOperation
      );

      expect(result).toEqual({ generated: 'content' });
      expect(mockOperations.consumeCredits).toHaveBeenCalledWith(
        {
          creditsToConsume: 1,
          operationName: 'content-generation',
          correlationId: expect.any(String)
        },
        expect.any(Object)
      );
      expect(mockOperation).toHaveBeenCalled();
    });

    it('should handle async operation results correctly', async () => {
      const asyncResult = Promise.resolve({ data: 'async result' });
      const mockOperation = jest.fn().mockReturnValue(asyncResult);
      mockOperations.consumeCredits.mockResolvedValue({
        success: true,
        data: { remainingCredits: 97, creditsConsumed: 1, operationName: 'content-generation' },
        correlationId: 'test-correlation-id'
      });

      const result = await withContentGenerationCredit(
        'user-789',
        'content-generation',
        mockOperation
      );

      expect(result).toEqual({ data: 'async result' });
    });

    it('should throw specific error for insufficient credits', async () => {
      const mockOperation = jest.fn();
      const error = createInsufficientCreditsError(1, 0, 'correlation-456');
      mockOperations.consumeCredits.mockRejectedValue(error);

      await expect(
        withContentGenerationCredit('user-no-credits', 'content-generation', mockOperation)
      ).rejects.toThrow(HttpError);

      expect(mockOperation).not.toHaveBeenCalled();
    });

    it('should preserve operation error types and messages', async () => {
      const customError = new HttpError(500, 'Custom operation error');
      const mockOperation = jest.fn().mockRejectedValue(customError);
      mockOperations.consumeCredits.mockResolvedValue({
        success: true,
        data: { remainingCredits: 96, creditsConsumed: 1, operationName: 'content-generation' },
        correlationId: 'test-correlation-id'
      });

      await expect(
        withContentGenerationCredit('user-123', 'content-generation', mockOperation)
      ).rejects.toThrow('Custom operation error');
    });
  });

  describe('Integration Error Scenarios', () => {
    it('should handle malformed credit consumption responses', async () => {
      const mockOperation = jest.fn();
      mockOperations.consumeCredits.mockResolvedValue({
        success: true,
        // Missing data property
      } as any);

      await expect(
        withVisibilityAnalysisCredit('user-123', 'test-operation', mockOperation)
      ).rejects.toThrow();

      expect(mockOperation).not.toHaveBeenCalled();
    });

    it('should handle network timeouts in credit operations', async () => {
      const mockOperation = jest.fn();
      const timeoutError = new Error('Request timeout');
      mockOperations.consumeCredits.mockRejectedValue(timeoutError);

      await expect(
        withContentGenerationCredit('user-123', 'test-operation', mockOperation)
      ).rejects.toThrow('Request timeout');

      expect(mockOperation).not.toHaveBeenCalled();
    });
  });

  describe('Correlation ID Management', () => {
    it('should generate correlation ID when not provided', async () => {
      const mockOperation = jest.fn().mockResolvedValue('result');
      mockOperations.consumeCredits.mockResolvedValue({
        success: true,
        data: { remainingCredits: 99, creditsConsumed: 1, operationName: 'test-op' },
        correlationId: 'generated-id'
      });

      await withVisibilityAnalysisCredit('user-123', 'test-op', mockOperation);

      expect(mockOperations.consumeCredits).toHaveBeenCalledWith(
        expect.objectContaining({
          correlationId: expect.stringMatching(/^[a-f0-9-]{36}$/) // UUID format
        }),
        expect.any(Object)
      );
    });

    it('should use provided correlation ID', async () => {
      const mockOperation = jest.fn().mockResolvedValue('result');
      const customCorrelationId = 'custom-12345';
      mockOperations.consumeCredits.mockResolvedValue({
        success: true,
        data: { remainingCredits: 99, creditsConsumed: 1, operationName: 'test-op' },
        correlationId: customCorrelationId
      });

      await withContentGenerationCredit(
        'user-123',
        'test-op',
        mockOperation,
        customCorrelationId
      );

      expect(mockOperations.consumeCredits).toHaveBeenCalledWith(
        expect.objectContaining({ correlationId: customCorrelationId }),
        expect.any(Object)
      );
    });
  });
});