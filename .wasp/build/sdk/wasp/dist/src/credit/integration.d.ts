/**
 * Higher-order function that wraps operations requiring visibility analysis credits
 * Handles: 1 credit = 1 complete visibility analysis (keyword extraction + query generation + ChatGPT analysis)
 */
export declare const withVisibilityAnalysisCredit: <T>(userId: string, operationName: string, operation: () => Promise<T>) => Promise<T>;
/**
 * Higher-order function that wraps operations requiring content generation credits
 * Handles: 1 additional credit for AI-optimized content generation
 */
export declare const withContentGenerationCredit: <T>(userId: string, operationName: string, operation: () => Promise<T>) => Promise<T>;
/**
 * Utility function to check if user has enough credits without consuming them
 * Useful for UI state management and pre-validation
 */
export declare const checkUserCreditsForOperation: (userId: string, operationType: "visibility_analysis" | "content_generation") => Promise<{
    hasCredits: boolean;
    currentCredits: number;
    requiredCredits: number;
}>;
/**
 * Utility function to get credit cost for different operation types
 */
export declare const getCreditCost: (operationType: "visibility_analysis" | "content_generation") => number;
/**
 * Constants for credit system
 */
export declare const CREDIT_COSTS: {
    readonly VISIBILITY_ANALYSIS: 1;
    readonly CONTENT_GENERATION: 1;
};
export declare const OPERATION_DESCRIPTIONS: {
    readonly VISIBILITY_ANALYSIS: "Complete AI visibility analysis";
    readonly CONTENT_GENERATION: "AI-optimized content generation";
};
//# sourceMappingURL=integration.d.ts.map