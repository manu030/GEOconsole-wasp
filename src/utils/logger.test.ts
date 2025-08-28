import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import { logger, generateCorrelationId } from './logger';

// Mock console methods
const mockConsole = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn(),
};

describe('Logger Utility', () => {
  beforeEach(() => {
    // Replace console methods with mocks
    Object.assign(console, mockConsole);
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restore original console methods
    jest.restoreAllMocks();
  });

  describe('Logger Methods', () => {
    it('should log info messages with proper structure', () => {
      const context = {
        service: 'credit-system',
        operation: 'getUserCredits',
        userId: 'user-123',
        correlationId: 'corr-456'
      };

      logger.info('User credits retrieved successfully', context);

      expect(mockConsole.info).toHaveBeenCalledWith(
        JSON.stringify({
          level: 'info',
          message: 'User credits retrieved successfully',
          timestamp: expect.any(String),
          service: 'credit-system',
          operation: 'getUserCredits',
          userId: 'user-123',
          correlationId: 'corr-456'
        })
      );
    });

    it('should log warning messages', () => {
      const context = {
        service: 'credit-system',
        operation: 'consumeCredits',
        userId: 'user-789'
      };

      logger.warn('Low credit balance detected', context);

      expect(mockConsole.warn).toHaveBeenCalledWith(
        JSON.stringify({
          level: 'warn',
          message: 'Low credit balance detected',
          timestamp: expect.any(String),
          service: 'credit-system',
          operation: 'consumeCredits',
          userId: 'user-789'
        })
      );
    });

    it('should log error messages with error details', () => {
      const error = new Error('Database connection failed');
      const context = {
        service: 'credit-system',
        operation: 'consumeCredits',
        userId: 'user-123',
        error: error
      };

      logger.error('Failed to consume credits', context);

      expect(mockConsole.error).toHaveBeenCalledWith(
        JSON.stringify({
          level: 'error',
          message: 'Failed to consume credits',
          timestamp: expect.any(String),
          service: 'credit-system',
          operation: 'consumeCredits',
          userId: 'user-123',
          error: 'Database connection failed',
          stack: expect.any(String)
        })
      );
    });

    it('should log debug messages', () => {
      const context = {
        service: 'credit-system',
        operation: 'validateInput',
        creditsRequested: 5
      };

      logger.debug('Validating credit consumption request', context);

      expect(mockConsole.debug).toHaveBeenCalledWith(
        JSON.stringify({
          level: 'debug',
          message: 'Validating credit consumption request',
          timestamp: expect.any(String),
          service: 'credit-system',
          operation: 'validateInput',
          creditsRequested: 5
        })
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle Error objects in context', () => {
      const error = new Error('Test error');
      error.stack = 'Error: Test error\n    at test.js:1:1';

      const context = {
        service: 'test',
        operation: 'test',
        error: error
      };

      logger.error('Test message', context);

      const logCall = mockConsole.error.mock.calls[0][0];
      const parsed = JSON.parse(logCall);

      expect(parsed.error).toBe('Test error');
      expect(parsed.stack).toContain('Error: Test error');
    });

    it('should handle string errors in context', () => {
      const context = {
        service: 'test',
        operation: 'test',
        error: 'String error message'
      };

      logger.error('Test message', context);

      const logCall = mockConsole.error.mock.calls[0][0];
      const parsed = JSON.parse(logCall);

      expect(parsed.error).toBe('String error message');
      expect(parsed.stack).toBeUndefined();
    });

    it('should handle missing error gracefully', () => {
      const context = {
        service: 'test',
        operation: 'test'
      };

      logger.error('Test message', context);

      const logCall = mockConsole.error.mock.calls[0][0];
      const parsed = JSON.parse(logCall);

      expect(parsed.error).toBeUndefined();
      expect(parsed.stack).toBeUndefined();
    });
  });

  describe('Timestamp Generation', () => {
    it('should include valid ISO timestamp', () => {
      const context = {
        service: 'test',
        operation: 'test'
      };

      logger.info('Test message', context);

      const logCall = mockConsole.info.mock.calls[0][0];
      const parsed = JSON.parse(logCall);

      expect(parsed.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      expect(() => new Date(parsed.timestamp)).not.toThrow();
    });

    it('should have timestamps close to current time', () => {
      const beforeLog = new Date();
      
      logger.info('Test message', { service: 'test', operation: 'test' });
      
      const afterLog = new Date();
      const logCall = mockConsole.info.mock.calls[0][0];
      const parsed = JSON.parse(logCall);
      const logTime = new Date(parsed.timestamp);

      expect(logTime.getTime()).toBeGreaterThanOrEqual(beforeLog.getTime());
      expect(logTime.getTime()).toBeLessThanOrEqual(afterLog.getTime());
    });
  });

  describe('Context Handling', () => {
    it('should handle empty context', () => {
      logger.info('Test message', {});

      expect(mockConsole.info).toHaveBeenCalledWith(
        JSON.stringify({
          level: 'info',
          message: 'Test message',
          timestamp: expect.any(String)
        })
      );
    });

    it('should handle additional custom context properties', () => {
      const context = {
        service: 'credit-system',
        operation: 'test',
        customField: 'customValue',
        requestId: 'req-123',
        metadata: { key: 'value' }
      };

      logger.info('Test message', context);

      const logCall = mockConsole.info.mock.calls[0][0];
      const parsed = JSON.parse(logCall);

      expect(parsed.customField).toBe('customValue');
      expect(parsed.requestId).toBe('req-123');
      expect(parsed.metadata).toEqual({ key: 'value' });
    });

    it('should not modify the original context object', () => {
      const originalContext = {
        service: 'test',
        operation: 'test',
        userId: 'user-123'
      };

      const contextCopy = { ...originalContext };

      logger.info('Test message', originalContext);

      expect(originalContext).toEqual(contextCopy);
    });
  });

  describe('generateCorrelationId', () => {
    it('should generate valid UUID v4 format', () => {
      const correlationId = generateCorrelationId();

      expect(correlationId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    });

    it('should generate unique IDs', () => {
      const id1 = generateCorrelationId();
      const id2 = generateCorrelationId();
      const id3 = generateCorrelationId();

      expect(id1).not.toBe(id2);
      expect(id2).not.toBe(id3);
      expect(id1).not.toBe(id3);
    });

    it('should always generate 36-character strings', () => {
      for (let i = 0; i < 10; i++) {
        const id = generateCorrelationId();
        expect(id).toHaveLength(36);
      }
    });

    it('should generate IDs with proper UUID v4 characteristics', () => {
      for (let i = 0; i < 10; i++) {
        const id = generateCorrelationId();
        const parts = id.split('-');
        
        expect(parts).toHaveLength(5);
        expect(parts[0]).toHaveLength(8);
        expect(parts[1]).toHaveLength(4);
        expect(parts[2]).toHaveLength(4);
        expect(parts[3]).toHaveLength(4);
        expect(parts[4]).toHaveLength(12);
        
        // Version should be 4
        expect(parts[2][0]).toBe('4');
        
        // Variant should be 8, 9, a, or b
        expect(['8', '9', 'a', 'b']).toContain(parts[3][0]);
      }
    });
  });

  describe('JSON Serialization', () => {
    it('should handle circular references gracefully', () => {
      const circular: any = { service: 'test', operation: 'test' };
      circular.self = circular;

      expect(() => {
        logger.info('Test with circular reference', circular);
      }).not.toThrow();
    });

    it('should handle undefined values', () => {
      const context = {
        service: 'test',
        operation: 'test',
        undefinedValue: undefined,
        nullValue: null
      };

      logger.info('Test message', context);

      const logCall = mockConsole.info.mock.calls[0][0];
      expect(() => JSON.parse(logCall)).not.toThrow();

      const parsed = JSON.parse(logCall);
      expect(parsed.undefinedValue).toBeUndefined();
      expect(parsed.nullValue).toBeNull();
    });
  });
});