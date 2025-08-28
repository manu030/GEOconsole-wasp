import { render, screen } from '@testing-library/react';
import { describe, expect, it } from '@jest/globals';
import { CreditIndicator } from './credit-indicator';

describe('CreditIndicator Component', () => {
  describe('Basic Rendering', () => {
    it('should render credit count correctly', () => {
      render(<CreditIndicator currentCredits={50} />);
      expect(screen.getByText('50')).toBeInTheDocument();
    });

    it('should render with default variant when credits are sufficient', () => {
      render(<CreditIndicator currentCredits={50} />);
      const badge = screen.getByText('50').closest('div');
      expect(badge).toHaveClass('bg-primary');
    });

    it('should render zero credits', () => {
      render(<CreditIndicator currentCredits={0} />);
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('should handle large credit numbers', () => {
      render(<CreditIndicator currentCredits={9999} />);
      expect(screen.getByText('9999')).toBeInTheDocument();
    });
  });

  describe('Variant Logic', () => {
    it('should show danger variant when credits are 0', () => {
      render(<CreditIndicator currentCredits={0} />);
      const badge = screen.getByText('0').closest('div');
      expect(badge).toHaveClass('bg-destructive');
    });

    it('should show danger variant when credits are very low (1-5)', () => {
      render(<CreditIndicator currentCredits={3} />);
      const badge = screen.getByText('3').closest('div');
      expect(badge).toHaveClass('bg-destructive');
    });

    it('should show warning variant when credits are low (6-20)', () => {
      render(<CreditIndicator currentCredits={15} />);
      const badge = screen.getByText('15').closest('div');
      expect(badge).toHaveClass('bg-secondary');
    });

    it('should show default variant when credits are sufficient (>20)', () => {
      render(<CreditIndicator currentCredits={25} />);
      const badge = screen.getByText('25').closest('div');
      expect(badge).toHaveClass('bg-primary');
    });

    it('should respect custom variant override', () => {
      render(<CreditIndicator currentCredits={0} variant="secondary" />);
      const badge = screen.getByText('0').closest('div');
      expect(badge).toHaveClass('bg-secondary');
    });
  });

  describe('Size Variants', () => {
    it('should apply small size styling', () => {
      render(<CreditIndicator currentCredits={10} size="sm" />);
      const badge = screen.getByText('10').closest('div');
      expect(badge).toHaveClass('text-xs');
      expect(badge).toHaveClass('px-2');
      expect(badge).toHaveClass('py-0.5');
    });

    it('should apply medium size styling (default)', () => {
      render(<CreditIndicator currentCredits={10} size="md" />);
      const badge = screen.getByText('10').closest('div');
      expect(badge).toHaveClass('text-sm');
      expect(badge).toHaveClass('px-3');
      expect(badge).toHaveClass('py-1');
    });

    it('should apply large size styling', () => {
      render(<CreditIndicator currentCredits={10} size="lg" />);
      const badge = screen.getByText('10').closest('div');
      expect(badge).toHaveClass('text-base');
      expect(badge).toHaveClass('px-4');
      expect(badge).toHaveClass('py-1.5');
    });

    it('should default to medium size when not specified', () => {
      render(<CreditIndicator currentCredits={10} />);
      const badge = screen.getByText('10').closest('div');
      expect(badge).toHaveClass('text-sm');
    });
  });

  describe('Details Display', () => {
    it('should show only credit count when showDetails is false', () => {
      render(<CreditIndicator currentCredits={42} showDetails={false} />);
      expect(screen.getByText('42')).toBeInTheDocument();
      expect(screen.queryByText(/credits/i)).not.toBeInTheDocument();
    });

    it('should show detailed text when showDetails is true', () => {
      render(<CreditIndicator currentCredits={42} showDetails={true} />);
      expect(screen.getByText('42 credits')).toBeInTheDocument();
    });

    it('should handle singular credit correctly', () => {
      render(<CreditIndicator currentCredits={1} showDetails={true} />);
      expect(screen.getByText('1 credit')).toBeInTheDocument();
    });

    it('should handle zero credits with proper pluralization', () => {
      render(<CreditIndicator currentCredits={0} showDetails={true} />);
      expect(screen.getByText('0 credits')).toBeInTheDocument();
    });

    it('should default to hiding details when showDetails is not specified', () => {
      render(<CreditIndicator currentCredits={25} />);
      expect(screen.queryByText(/credits?/i)).not.toBeInTheDocument();
      expect(screen.getByText('25')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle negative credits (should not happen in production)', () => {
      render(<CreditIndicator currentCredits={-5} />);
      const badge = screen.getByText('-5').closest('div');
      expect(badge).toHaveClass('bg-destructive'); // Should show as danger
    });

    it('should handle floating point credits', () => {
      render(<CreditIndicator currentCredits={10.5} />);
      expect(screen.getByText('10.5')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<CreditIndicator currentCredits={10} className="custom-class" />);
      const badge = screen.getByText('10').closest('div');
      expect(badge).toHaveClass('custom-class');
    });
  });

  describe('Accessibility', () => {
    it('should have appropriate ARIA attributes for screen readers', () => {
      render(<CreditIndicator currentCredits={25} showDetails={true} />);
      const element = screen.getByText('25 credits');
      expect(element).toBeInTheDocument();
    });

    it('should be keyboard accessible', () => {
      render(<CreditIndicator currentCredits={10} />);
      const badge = screen.getByText('10').closest('div');
      expect(badge).not.toHaveAttribute('tabindex', '-1');
    });
  });

  describe('Critical Credit Level Boundaries', () => {
    it('should correctly identify boundary between danger and warning (5 vs 6)', () => {
      const { rerender } = render(<CreditIndicator currentCredits={5} />);
      let badge = screen.getByText('5').closest('div');
      expect(badge).toHaveClass('bg-destructive');

      rerender(<CreditIndicator currentCredits={6} />);
      badge = screen.getByText('6').closest('div');
      expect(badge).toHaveClass('bg-secondary');
    });

    it('should correctly identify boundary between warning and default (20 vs 21)', () => {
      const { rerender } = render(<CreditIndicator currentCredits={20} />);
      let badge = screen.getByText('20').closest('div');
      expect(badge).toHaveClass('bg-secondary');

      rerender(<CreditIndicator currentCredits={21} />);
      badge = screen.getByText('21').closest('div');
      expect(badge).toHaveClass('bg-primary');
    });
  });
});