import { type GetUserCredits, type ConsumeCredits } from 'wasp/server/operations';
import * as z from 'zod';
declare const getUserCreditsInputSchema: z.ZodObject<{
    userId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    userId?: string | undefined;
}, {
    userId?: string | undefined;
}>;
type GetUserCreditsInput = z.infer<typeof getUserCreditsInputSchema>;
type GetUserCreditsOutput = {
    userId: string;
    credits: number;
    lastUpdated: Date;
};
export declare const getUserCredits: GetUserCredits<GetUserCreditsInput, GetUserCreditsOutput>;
declare const consumeCreditsInputSchema: z.ZodObject<{
    userId: z.ZodOptional<z.ZodString>;
    amount: z.ZodNumber;
    operation: z.ZodString;
}, "strip", z.ZodTypeAny, {
    amount: number;
    operation: string;
    userId?: string | undefined;
}, {
    amount: number;
    operation: string;
    userId?: string | undefined;
}>;
type ConsumeCreditsInput = z.infer<typeof consumeCreditsInputSchema>;
type ConsumeCreditsOutput = {
    userId: string;
    creditsRemaining: number;
    creditsConsumed: number;
    operation: string;
};
export declare const consumeCredits: ConsumeCredits<ConsumeCreditsInput, ConsumeCreditsOutput>;
export declare const hasAvailableCredits: (userCredits: number, requiredAmount: number) => boolean;
export declare const checkUserHasCredits: (userId: string, requiredAmount: number, entities: any) => Promise<boolean>;
export {};
//# sourceMappingURL=operations.d.ts.map