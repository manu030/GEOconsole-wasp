export const updateUserLemonSqueezyPaymentDetails = async ({ lemonSqueezyId, userId, subscriptionPlan, subscriptionStatus, datePaid, numOfCreditsPurchased, lemonSqueezyCustomerPortalUrl }, prismaUserDelegate) => {
    return prismaUserDelegate.update({
        where: {
            id: userId,
        },
        data: {
            paymentProcessorUserId: lemonSqueezyId,
            lemonSqueezyCustomerPortalUrl,
            subscriptionPlan,
            subscriptionStatus,
            datePaid,
            credits: numOfCreditsPurchased !== undefined ? { increment: numOfCreditsPurchased } : undefined,
        },
    });
};
//# sourceMappingURL=paymentDetails.js.map