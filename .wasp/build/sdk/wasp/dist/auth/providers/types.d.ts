import type { Router, Request } from 'express';
import type { Prisma } from '@prisma/client';
import type { Expand, Exact } from 'wasp/universal/types';
import type { ProviderName } from '../utils';
export declare function defineUserSignupFields<T extends UserSignupFields>(fields: Exact<UserSignupFields, T>): T;
import { getEmailUserFields as getEmailUserFields_ext } from 'wasp/src/auth/userSignupFields';
export type UserEmailSignupFields = InferUserSignupFields<typeof getEmailUserFields_ext>;
/**
 * Extracts the result types from a UserSignupFields object.
 *
 * This type transforms an object containing field getter functions
 * into an object with the same keys but whose values are the return types
 * of those functions.
 */
type InferUserSignupFields<T extends UserSignupFields> = {
    [K in keyof T]: T[K] extends FieldGetter<PossibleUserFieldValues> ? ReturnType<T[K]> : never;
};
type UserEntityCreateInput = Prisma.UserCreateInput;
export type ProviderConfig = {
    id: ProviderName;
    displayName: string;
    createRouter(provider: ProviderConfig): Router;
};
export type RequestWithWasp = Request & {
    wasp?: {
        [key: string]: any;
    };
};
export type PossibleUserFields = Expand<Partial<UserEntityCreateInput>>;
export type UserSignupFields = {
    [key in keyof PossibleUserFields]: FieldGetter<PossibleUserFields[key]>;
};
type FieldGetter<T extends PossibleUserFieldValues> = (data: {
    [key: string]: unknown;
}) => Promise<T | undefined> | T | undefined;
type PossibleUserFieldValues = PossibleUserFields[keyof PossibleUserFields];
export {};
//# sourceMappingURL=types.d.ts.map