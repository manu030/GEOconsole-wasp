export const updateUserStripePaymentDetails = async ({ userStripeId, subscriptionPlan, subscriptionStatus, datePaid, numOfCreditsPurchased }, userDelegate) => {
    return userDelegate.update({
        where: {
            paymentProcessorUserId: userStripeId
        },
        data: {
            paymentProcessorUserId: userStripeId,
            subscriptionPlan,
            subscriptionStatus,
            datePaid,
            credits: numOfCreditsPurchased !== undefined ? { increment: numOfCreditsPurchased } : undefined,
        },
    });
};
//# sourceMappingURL=paymentDetails.js.map