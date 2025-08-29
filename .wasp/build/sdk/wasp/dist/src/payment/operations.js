import * as z from 'zod';
import { PaymentPlanId, paymentPlans } from '../payment/plans';
import { paymentProcessor } from './paymentProcessor';
import { HttpError } from 'wasp/server';
import { ensureArgsSchemaOrThrowHttpError } from '../server/validation';
const generateCheckoutSessionSchema = z.nativeEnum(PaymentPlanId);
export const generateCheckoutSession = async (rawPaymentPlanId, context) => {
    if (!context.user) {
        throw new HttpError(401, 'Only authenticated users are allowed to perform this operation');
    }
    const paymentPlanId = ensureArgsSchemaOrThrowHttpError(generateCheckoutSessionSchema, rawPaymentPlanId);
    const userId = context.user.id;
    const userEmail = context.user.email;
    if (!userEmail) {
        // If using the usernameAndPassword Auth method, switch to an Auth method that provides an email.
        throw new HttpError(403, 'User needs an email to make a payment.');
    }
    const paymentPlan = paymentPlans[paymentPlanId];
    const { session } = await paymentProcessor.createCheckoutSession({
        userId,
        userEmail,
        paymentPlan,
        prismaUserDelegate: context.entities.User,
    });
    return {
        sessionUrl: session.url,
        sessionId: session.id,
    };
};
export const getCustomerPortalUrl = async (_args, context) => {
    if (!context.user) {
        throw new HttpError(401, 'Only authenticated users are allowed to perform this operation');
    }
    return paymentProcessor.fetchCustomerPortalUrl({
        userId: context.user.id,
        prismaUserDelegate: context.entities.User,
    });
};
//# sourceMappingURL=operations.js.map