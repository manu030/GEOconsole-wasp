import type { SubscriptionStatus } from '../plans';
import { PaymentPlanId } from '../plans';
import { PrismaClient } from '@prisma/client';
export declare const updateUserLemonSqueezyPaymentDetails: ({ lemonSqueezyId, userId, subscriptionPlan, subscriptionStatus, datePaid, numOfCreditsPurchased, lemonSqueezyCustomerPortalUrl }: {
    lemonSqueezyId: string;
    userId: string;
    subscriptionPlan?: PaymentPlanId;
    subscriptionStatus?: SubscriptionStatus;
    numOfCreditsPurchased?: number;
    lemonSqueezyCustomerPortalUrl?: string;
    datePaid?: Date;
}, prismaUserDelegate: PrismaClient["user"]) => Promise<{
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