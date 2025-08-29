import React from 'react';
export interface CreditIndicatorProps {
    currentCredits: number;
    showDetails?: boolean;
    className?: string;
    variant?: 'default' | 'warning' | 'danger';
    size?: 'sm' | 'md' | 'lg';
}
/**
 * Credit indicator component that shows user's remaining credits
 * Automatically adjusts styling based on credit levels
 */
export declare function CreditIndicator({ currentCredits, showDetails, className, variant, size }: CreditIndicatorProps): React.JSX.Element;
export interface CreditWarningProps {
    currentCredits: number;
    requiredCredits: number;
    operationType?: 'visibility_analysis' | 'content_generation';
    className?: string;
}
/**
 * Warning component shown when user doesn't have enough credits
 */
export declare function CreditWarning({ currentCredits, requiredCredits, operationType, className }: CreditWarningProps): React.JSX.Element | null;
export interface CreditStatusProps {
    currentCredits: number;
    planCredits?: number;
    planName?: string;
    className?: string;
}
/**
 * Detailed credit status component for user account/dashboard views
 */
export declare function CreditStatus({ currentCredits, planCredits, planName, className }: CreditStatusProps): React.JSX.Element;
//# sourceMappingURL=credit-indicator.d.ts.map