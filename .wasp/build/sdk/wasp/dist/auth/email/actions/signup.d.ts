import { type UserEmailSignupFields } from '../../providers';
type EmailSignupData = {
    username: string;
    password: string;
} & UserEmailSignupFields;
export declare function signup(data: EmailSignupData): Promise<{
    success: boolean;
}>;
export {};
//# sourceMappingURL=signup.d.ts.map