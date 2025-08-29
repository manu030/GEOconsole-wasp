import * as z from 'zod';
import type { GenerateCheckoutSession, GetCustomerPortalUrl } from 'wasp/server/operations';
import { PaymentPlanId } from '../payment/plans';
export type CheckoutSession = {
    sessionUrl: string | null;
    sessionId: string;
};
declare const generateCheckoutSessionSchema: z.ZodNativeEnum<typeof PaymentPlanId>;
type GenerateCheckoutSessionInput = z.infer<typeof generateCheckoutSessionSchema>;
export declare const generateCheckoutSession: GenerateCheckoutSession<GenerateCheckoutSessionInput, CheckoutSession>;
export declare const getCustomerPortalUrl: GetCustomerPortalUrl<void, string | null>;
export {};
//# sourceMappingURL=operations.d.ts.map