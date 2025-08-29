import * as z from 'zod';
import { Stripe } from 'stripe';
export declare function parseWebhookPayload(rawStripeEvent: Stripe.Event): Promise<{
    eventName: "checkout.session.completed";
    data: {
        id: string;
        mode: "subscription" | "payment";
        customer: string;
        payment_status: "paid" | "unpaid" | "no_payment_required";
    };
} | {
    eventName: "invoice.paid";
    data: {
        id: string;
        customer: string;
        period_start: number;
        lines: {
            data: {
                pricing: {
                    price_details: {
                        price: string;
                    };
                };
            }[];
        };
    };
} | {
    eventName: "customer.subscription.updated";
    data: {
        status: string;
        cancel_at_period_end: boolean;
        customer: string;
        items: {
            data: {
                price: {
                    id: string;
                };
            }[];
        };
    };
} | {
    eventName: "customer.subscription.deleted";
    data: {
        customer: string;
    };
}>;
/**
 * This is a subtype of
 * @type import('stripe').Stripe.Checkout.Session
 */
declare const sessionCompletedDataSchema: z.ZodObject<{
    id: z.ZodString;
    customer: z.ZodString;
    payment_status: z.ZodEnum<["paid", "unpaid", "no_payment_required"]>;
    mode: z.ZodEnum<["payment", "subscription"]>;
}, "strip", z.ZodTypeAny, {
    id: string;
    mode: "subscription" | "payment";
    customer: string;
    payment_status: "paid" | "unpaid" | "no_payment_required";
}, {
    id: string;
    mode: "subscription" | "payment";
    customer: string;
    payment_status: "paid" | "unpaid" | "no_payment_required";
}>;
/**
 * This is a subtype of
 * @type import('stripe').Stripe.Invoice
 */
declare const invoicePaidDataSchema: z.ZodObject<{
    id: z.ZodString;
    customer: z.ZodString;
    period_start: z.ZodNumber;
    lines: z.ZodObject<{
        data: z.ZodArray<z.ZodObject<{
            pricing: z.ZodObject<{
                price_details: z.ZodObject<{
                    price: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    price: string;
                }, {
                    price: string;
                }>;
            }, "strip", z.ZodTypeAny, {
                price_details: {
                    price: string;
                };
            }, {
                price_details: {
                    price: string;
                };
            }>;
        }, "strip", z.ZodTypeAny, {
            pricing: {
                price_details: {
                    price: string;
                };
            };
        }, {
            pricing: {
                price_details: {
                    price: string;
                };
            };
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        data: {
            pricing: {
                price_details: {
                    price: string;
                };
            };
        }[];
    }, {
        data: {
            pricing: {
                price_details: {
                    price: string;
                };
            };
        }[];
    }>;
}, "strip", z.ZodTypeAny, {
    id: string;
    customer: string;
    period_start: number;
    lines: {
        data: {
            pricing: {
                price_details: {
                    price: string;
                };
            };
        }[];
    };
}, {
    id: string;
    customer: string;
    period_start: number;
    lines: {
        data: {
            pricing: {
                price_details: {
                    price: string;
                };
            };
        }[];
    };
}>;
/**
 * This is a subtype of
 * @type import('stripe').Stripe.Subscription
 */
declare const subscriptionUpdatedDataSchema: z.ZodObject<{
    customer: z.ZodString;
    status: z.ZodString;
    cancel_at_period_end: z.ZodBoolean;
    items: z.ZodObject<{
        data: z.ZodArray<z.ZodObject<{
            price: z.ZodObject<{
                id: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                id: string;
            }, {
                id: string;
            }>;
        }, "strip", z.ZodTypeAny, {
            price: {
                id: string;
            };
        }, {
            price: {
                id: string;
            };
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        data: {
            price: {
                id: string;
            };
        }[];
    }, {
        data: {
            price: {
                id: string;
            };
        }[];
    }>;
}, "strip", z.ZodTypeAny, {
    status: string;
    cancel_at_period_end: boolean;
    customer: string;
    items: {
        data: {
            price: {
                id: string;
            };
        }[];
    };
}, {
    status: string;
    cancel_at_period_end: boolean;
    customer: string;
    items: {
        data: {
            price: {
                id: string;
            };
        }[];
    };
}>;
/**
 * This is a subtype of
 * @type import('stripe').Stripe.Subscription
 */
declare const subscriptionDeletedDataSchema: z.ZodObject<{
    customer: z.ZodString;
}, "strip", z.ZodTypeAny, {
    customer: string;
}, {
    customer: string;
}>;
export type SessionCompletedData = z.infer<typeof sessionCompletedDataSchema>;
export type InvoicePaidData = z.infer<typeof invoicePaidDataSchema>;
export type SubscriptionUpdatedData = z.infer<typeof subscriptionUpdatedDataSchema>;
export type SubscriptionDeletedData = z.infer<typeof subscriptionDeletedDataSchema>;
export {};
//# sourceMappingURL=webhookPayload.d.ts.map