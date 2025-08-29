import type { SubscriptionStatus } from '../plans';
import { PaymentPlanId } from '../plans';
import { PrismaClient } from '@prisma/client';
export declare const updateUserStripePaymentDetails: ({ userStripeId, subscriptionPlan, subscriptionStatus, datePaid, numOfCreditsPurchased }: {
    userStripeId: string;
    subscriptionPlan?: PaymentPlanId;
    subscriptionStatus?: SubscriptionStatus;
    numOfCreditsPurchased?: number;
    datePaid?: Date;
}, userDelegate: PrismaClient["user"]) => Promise<{
    id: string;
    createdAt: Date;
    email: string | null;
    username: string | null;
    isAdmin: boolean;
    paymentProcessorUserId: string | null;
    lemonSqueezyCustomerPortalUrl: string | null;
    subscriptionStatus: string | null;
    subscriptionPlan: string | null;
    datePaid: Date | null;
    credits: number;
}>;
//# sourceMappingURL=paymentDetails.d.ts.map