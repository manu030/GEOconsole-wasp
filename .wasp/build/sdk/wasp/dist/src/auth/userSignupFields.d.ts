export declare const getEmailUserFields: {
    email: (data: {
        [key: string]: unknown;
    }) => string;
    username: (data: {
        [key: string]: unknown;
    }) => string;
    isAdmin: (data: {
        [key: string]: unknown;
    }) => boolean;
};
export declare const getGitHubUserFields: {
    email: (data: {
        [key: string]: unknown;
    }) => string;
    username: (data: {
        [key: string]: unknown;
    }) => string;
    isAdmin: (data: {
        [key: string]: unknown;
    }) => boolean;
};
export declare function getGitHubAuthConfig(): {
    scopes: string[];
};
export declare const getGoogleUserFields: {
    email: (data: {
        [key: string]: unknown;
    }) => string;
    username: (data: {
        [key: string]: unknown;
    }) => string;
    isAdmin: (data: {
        [key: string]: unknown;
    }) => boolean;
};
export declare function getGoogleAuthConfig(): {
    scopes: string[];
};
export declare const getDiscordUserFields: {
    email: (data: {
        [key: string]: unknown;
    }) => string;
    username: (data: {
        [key: string]: unknown;
    }) => string;
    isAdmin: (data: {
        [key: string]: unknown;
    }) => boolean;
};
export declare function getDiscordAuthConfig(): {
    scopes: string[];
};
//# sourceMappingURL=userSignupFields.d.ts.map