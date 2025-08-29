import { fetchStripeCustomer, createStripeCheckoutSession } from './checkoutUtils';
import { requireNodeEnvVar } from '../../server/utils';
import { stripeWebhook, stripeMiddlewareConfigFn } from './webhook';
export const stripePaymentProcessor = {
    id: 'stripe',
    createCheckoutSession: async ({ userId, userEmail, paymentPlan, prismaUserDelegate }) => {
        const customer = await fetchStripeCustomer(userEmail);
        const stripeSession = await createStripeCheckoutSession({
            priceId: paymentPlan.getPaymentProcessorPlanId(),
            customerId: customer.id,
            mode: paymentPlanEffectToStripeMode(paymentPlan.effect),
        });
        await prismaUserDelegate.update({
            where: {
                id: userId
            },
            data: {
                paymentProcessorUserId: customer.id
            }
        });
        if (!stripeSession.url)
            throw new Error('Error creating Stripe Checkout Session');
        const session = {
            url: stripeSession.url,
            id: stripeSession.id,
        };
        return { session };
    },
    fetchCustomerPortalUrl: async (_args) => requireNodeEnvVar('STRIPE_CUSTOMER_PORTAL_URL'),
    webhook: stripeWebhook,
    webhookMiddlewareConfigFn: stripeMiddlewareConfigFn,
};
function paymentPlanEffectToStripeMode(planEffect) {
    const effectToMode = {
        subscription: 'subscription',
        credits: 'payment',
    };
    return effectToMode[planEffect.kind];
}
//# sourceMappingURL=paymentProcessor.js.map