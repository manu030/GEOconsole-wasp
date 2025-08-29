import { HttpError, prisma } from 'wasp/server';
import * as z from 'zod';
import { SubscriptionStatus } from '../payment/plans';
import { ensureArgsSchemaOrThrowHttpError } from '../server/validation';
const updateUserAdminByIdInputSchema = z.object({
    id: z.string().nonempty(),
    isAdmin: z.boolean(),
});
export const updateIsUserAdminById = async (rawArgs, context) => {
    const { id, isAdmin } = ensureArgsSchemaOrThrowHttpError(updateUserAdminByIdInputSchema, rawArgs);
    if (!context.user) {
        throw new HttpError(401, 'Only authenticated users are allowed to perform this operation');
    }
    if (!context.user.isAdmin) {
        throw new HttpError(403, 'Only admins are allowed to perform this operation');
    }
    return context.entities.User.update({
        where: { id },
        data: { isAdmin },
    });
};
const getPaginatorArgsSchema = z.object({
    skipPages: z.number(),
    filter: z.object({
        emailContains: z.string().nonempty().optional(),
        isAdmin: z.boolean().optional(),
        subscriptionStatusIn: z.array(z.nativeEnum(SubscriptionStatus).nullable()).optional(),
    }),
});
export const getPaginatedUsers = async (rawArgs, context) => {
    if (!context.user) {
        throw new HttpError(401, 'Only authenticated users are allowed to perform this operation');
    }
    if (!context.user.isAdmin) {
        throw new HttpError(403, 'Only admins are allowed to perform this operation');
    }
    const { skipPages, filter: { subscriptionStatusIn: subscriptionStatus, emailContains, isAdmin }, } = ensureArgsSchemaOrThrowHttpError(getPaginatorArgsSchema, rawArgs);
    const includeUnsubscribedUsers = !!subscriptionStatus?.some((status) => status === null);
    const desiredSubscriptionStatuses = subscriptionStatus?.filter((status) => status !== null);
    const pageSize = 10;
    const userPageQuery = {
        skip: skipPages * pageSize,
        take: pageSize,
        where: {
            AND: [
                {
                    email: {
                        contains: emailContains,
                        mode: 'insensitive',
                    },
                    isAdmin,
                },
                {
                    OR: [
                        {
                            subscriptionStatus: {
                                in: desiredSubscriptionStatuses,
                            },
                        },
                        {
                            subscriptionStatus: includeUnsubscribedUsers ? null : undefined,
                        },
                    ],
                },
            ],
        },
        select: {
            id: true,
            email: true,
            username: true,
            isAdmin: true,
            subscriptionStatus: true,
            paymentProcessorUserId: true,
        },
        orderBy: {
            username: 'asc',
        },
    };
    const [pageOfUsers, totalUsers] = await prisma.$transaction([
        context.entities.User.findMany(userPageQuery),
        context.entities.User.count({ where: userPageQuery.where }),
    ]);
    const totalPages = Math.ceil(totalUsers / pageSize);
    return {
        users: pageOfUsers,
        totalPages,
    };
};
//# sourceMappingURL=operations.js.map