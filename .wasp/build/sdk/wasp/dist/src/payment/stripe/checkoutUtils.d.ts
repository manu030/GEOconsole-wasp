import type { StripeMode } from './paymentProcessor';
import Stripe from 'stripe';
export declare function fetchStripeCustomer(customerEmail: string): Promise<Stripe.Customer>;
interface CreateStripeCheckoutSessionParams {
    priceId: string;
    customerId: string;
    mode: StripeMode;
}
export declare function createStripeCheckoutSession({ priceId, customerId, mode, }: CreateStripeCheckoutSessionParams): Promise<Stripe.Response<Stripe.Checkout.Session>>;
export {};
//# sourceMappingURL=checkoutUtils.d.ts.map