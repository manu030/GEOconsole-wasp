interface LemonSqueezyCheckoutSessionParams {
    storeId: string;
    variantId: string;
    userEmail: string;
    userId: string;
}
export declare function createLemonSqueezyCheckoutSession({ storeId, variantId, userEmail, userId }: LemonSqueezyCheckoutSessionParams): Promise<{
    url: string;
    id: string;
}>;
export {};
//# sourceMappingURL=checkoutUtils.d.ts.map