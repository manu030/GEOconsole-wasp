export declare enum SubscriptionStatus {
    PastDue = "past_due",
    CancelAtPeriodEnd = "cancel_at_period_end",
    Active = "active",
    Deleted = "deleted"
}
export declare enum PaymentPlanId {
    Hobby = "hobby",
    Pro = "pro",
    Credits10 = "credits10"
}
export interface PaymentPlan {
    getPaymentProcessorPlanId: () => string;
    effect: PaymentPlanEffect;
}
export type PaymentPlanEffect = {
    kind: 'subscription';
} | {
    kind: 'credits';
    amount: number;
};
export declare const paymentPlans: Record<PaymentPlanId, PaymentPlan>;
export declare function prettyPaymentPlanName(planId: PaymentPlanId): string;
export declare function parsePaymentPlanId(planId: string): PaymentPlanId;
export declare function getSubscriptionPaymentPlanIds(): PaymentPlanId[];
//# sourceMappingURL=plans.d.ts.map