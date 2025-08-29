import { type User } from 'wasp/entities';
import { type GetPaginatedUsers, type UpdateIsUserAdminById } from 'wasp/server/operations';
import * as z from 'zod';
import { SubscriptionStatus } from '../payment/plans';
declare const updateUserAdminByIdInputSchema: z.ZodObject<{
    id: z.ZodString;
    isAdmin: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    id: string;
    isAdmin: boolean;
}, {
    id: string;
    isAdmin: boolean;
}>;
type UpdateUserAdminByIdInput = z.infer<typeof updateUserAdminByIdInputSchema>;
export declare const updateIsUserAdminById: UpdateIsUserAdminById<UpdateUserAdminByIdInput, User>;
type GetPaginatedUsersOutput = {
    users: Pick<User, 'id' | 'email' | 'username' | 'subscriptionStatus' | 'paymentProcessorUserId' | 'isAdmin'>[];
    totalPages: number;
};
declare const getPaginatorArgsSchema: z.ZodObject<{
    skipPages: z.ZodNumber;
    filter: z.ZodObject<{
        emailContains: z.ZodOptional<z.ZodString>;
        isAdmin: z.ZodOptional<z.ZodBoolean>;
        subscriptionStatusIn: z.ZodOptional<z.ZodArray<z.ZodNullable<z.ZodNativeEnum<typeof SubscriptionStatus>>, "many">>;
    }, "strip", z.ZodTypeAny, {
        isAdmin?: boolean | undefined;
        emailContains?: string | undefined;
        subscriptionStatusIn?: (SubscriptionStatus | null)[] | undefined;
    }, {
        isAdmin?: boolean | undefined;
        emailContains?: string | undefined;
        subscriptionStatusIn?: (SubscriptionStatus | null)[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    filter: {
        isAdmin?: boolean | undefined;
        emailContains?: string | undefined;
        subscriptionStatusIn?: (SubscriptionStatus | null)[] | undefined;
    };
    skipPages: number;
}, {
    filter: {
        isAdmin?: boolean | undefined;
        emailContains?: string | undefined;
        subscriptionStatusIn?: (SubscriptionStatus | null)[] | undefined;
    };
    skipPages: number;
}>;
type GetPaginatedUsersInput = z.infer<typeof getPaginatorArgsSchema>;
export declare const getPaginatedUsers: GetPaginatedUsers<GetPaginatedUsersInput, GetPaginatedUsersOutput>;
export {};
//# sourceMappingURL=operations.d.ts.map