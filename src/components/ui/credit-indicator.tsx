import React from 'react';
import { cn } from '../../lib/utils';
import { Badge } from './badge';

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
export function CreditIndicator({
  currentCredits,
  showDetails = false,
  className,
  variant,
  size = 'md'
}: CreditIndicatorProps) {
  // Auto-determine variant based on credit levels if not provided
  const getVariant = (): 'default' | 'warning' | 'danger' => {
    if (variant) return variant;
    
    if (currentCredits <= 0) return 'danger';
    if (currentCredits <= 5) return 'warning';
    return 'default';
  };

  const currentVariant = getVariant();

  // Size classes
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  // Variant classes
  const variantClasses = {
    default: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200',
    danger: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200'
  };

  const badgeContent = showDetails 
    ? `${currentCredits} credit${currentCredits !== 1 ? 's' : ''} remaining`
    : currentCredits.toString();

  return (
    <Badge 
      variant="outline"
      className={cn(
        'font-medium border transition-colors',
        sizeClasses[size],
        variantClasses[currentVariant],
        className
      )}
      title={`${currentCredits} credit${currentCredits !== 1 ? 's' : ''} available for analysis`}
    >
      {badgeContent}
    </Badge>
  );
}

export interface CreditWarningProps {
  currentCredits: number;
  requiredCredits: number;
  operationType?: 'visibility_analysis' | 'content_generation';
  className?: string;
}

/**
 * Warning component shown when user doesn't have enough credits
 */
export function CreditWarning({
  currentCredits,
  requiredCredits,
  operationType = 'visibility_analysis',
  className
}: CreditWarningProps) {
  const operationNames = {
    visibility_analysis: 'AI visibility analysis',
    content_generation: 'content generation'
  };

  const operationName = operationNames[operationType];

  if (currentCredits >= requiredCredits) {
    return null;
  }

  return (
    <div className={cn(
      'flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-md',
      className
    )}>
      <div className="flex-shrink-0">
        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="flex-1 text-sm">
        <p className="text-red-800 font-medium">
          Not enough credits
        </p>
        <p className="text-red-600">
          You need {requiredCredits} credit{requiredCredits !== 1 ? 's' : ''} for {operationName}, but only have {currentCredits}.
        </p>
      </div>
    </div>
  );
}

export interface CreditStatusProps {
  currentCredits: number;
  planCredits?: number;
  planName?: string;
  className?: string;
}

/**
 * Detailed credit status component for user account/dashboard views
 */
export function CreditStatus({
  currentCredits,
  planCredits,
  planName,
  className
}: CreditStatusProps) {
  const usagePercentage = planCredits ? Math.round((currentCredits / planCredits) * 100) : null;
  
  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900">
            Analysis Credits
          </h3>
          {planName && (
            <p className="text-xs text-gray-500">
              {planName} Plan
            </p>
          )}
        </div>
        <CreditIndicator 
          currentCredits={currentCredits}
          showDetails
          size="lg"
        />
      </div>
      
      {planCredits && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Used this month</span>
            <span className="text-gray-900">
              {planCredits - currentCredits} / {planCredits}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                usagePercentage && usagePercentage > 80 ? "bg-red-500" :
                usagePercentage && usagePercentage > 60 ? "bg-yellow-500" : "bg-green-500"
              )}
              style={{ width: `${Math.max(100 - (usagePercentage || 0), 0)}%` }}
            />
          </div>
          
          {usagePercentage !== null && (
            <p className="text-xs text-gray-500">
              {usagePercentage}% remaining
            </p>
          )}
        </div>
      )}
    </div>
  );
}