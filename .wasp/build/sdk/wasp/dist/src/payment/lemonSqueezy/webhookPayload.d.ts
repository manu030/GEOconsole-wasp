import * as z from 'zod';
export declare function parseWebhookPayload(rawPayload: string): Promise<{
    eventName: "order_created";
    meta: {
        event_name: string;
        custom_data: {
            user_id: string;
        };
    };
    data: {
        attributes: {
            status: string;
            customer_id: number;
            first_order_item: {
                variant_id: number;
            };
            order_number: number;
        };
    };
} | {
    eventName: "subscription_created" | "subscription_updated" | "subscription_cancelled" | "subscription_expired";
    meta: {
        event_name: string;
        custom_data: {
            user_id: string;
        };
    };
    data: {
        attributes: {
            status: string;
            customer_id: number;
            variant_id: number;
        };
    };
}>;
export type SubscriptionData = z.infer<typeof subscriptionDataSchema>;
export type OrderData = z.infer<typeof orderDataSchema>;
/**
 * This schema is based on
 * @type import('@lemonsqueezy/lemonsqueezy.js').Order
 * specifically Order['data'].
 */
declare const orderDataSchema: z.ZodObject<{
    attributes: z.ZodObject<{
        customer_id: z.ZodNumber;
        status: z.ZodString;
        first_order_item: z.ZodObject<{
            variant_id: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            variant_id: number;
        }, {
            variant_id: number;
        }>;
        order_number: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        status: string;
        customer_id: number;
        first_order_item: {
            variant_id: number;
        };
        order_number: number;
    }, {
        status: string;
        customer_id: number;
        first_order_item: {
            variant_id: number;
        };
        order_number: number;
    }>;
}, "strip", z.ZodTypeAny, {
    attributes: {
        status: string;
        customer_id: number;
        first_order_item: {
            variant_id: number;
        };
        order_number: number;
    };
}, {
    attributes: {
        status: string;
        customer_id: number;
        first_order_item: {
            variant_id: number;
        };
        order_number: number;
    };
}>;
/**
 * This schema is based on
 * @type import('@lemonsqueezy/lemonsqueezy.js').Subscription
 * specifically Subscription['data'].
 */
declare const subscriptionDataSchema: z.ZodObject<{
    attributes: z.ZodObject<{
        customer_id: z.ZodNumber;
        status: z.ZodString;
        variant_id: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        status: string;
        customer_id: number;
        variant_id: number;
    }, {
        status: string;
        customer_id: number;
        variant_id: number;
    }>;
}, "strip", z.ZodTypeAny, {
    attributes: {
        status: string;
        customer_id: number;
        variant_id: number;
    };
}, {
    attributes: {
        status: string;
        customer_id: number;
        variant_id: number;
    };
}>;
export {};
//# sourceMappingURL=webhookPayload.d.ts.map