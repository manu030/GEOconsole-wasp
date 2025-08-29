import { interpolatePath } from './linkHelpers';
// PUBLIC API
export const routes = {
    LandingPageRoute: {
        to: "/",
        build: (options) => interpolatePath("/", undefined, options?.search, options?.hash),
    },
    LoginRoute: {
        to: "/login",
        build: (options) => interpolatePath("/login", undefined, options?.search, options?.hash),
    },
    SignupRoute: {
        to: "/signup",
        build: (options) => interpolatePath("/signup", undefined, options?.search, options?.hash),
    },
    RequestPasswordResetRoute: {
        to: "/request-password-reset",
        build: (options) => interpolatePath("/request-password-reset", undefined, options?.search, options?.hash),
    },
    PasswordResetRoute: {
        to: "/password-reset",
        build: (options) => interpolatePath("/password-reset", undefined, options?.search, options?.hash),
    },
    EmailVerificationRoute: {
        to: "/email-verification",
        build: (options) => interpolatePath("/email-verification", undefined, options?.search, options?.hash),
    },
    AccountRoute: {
        to: "/account",
        build: (options) => interpolatePath("/account", undefined, options?.search, options?.hash),
    },
    DemoAppRoute: {
        to: "/demo-app",
        build: (options) => interpolatePath("/demo-app", undefined, options?.search, options?.hash),
    },
    PricingPageRoute: {
        to: "/pricing",
        build: (options) => interpolatePath("/pricing", undefined, options?.search, options?.hash),
    },
    CheckoutRoute: {
        to: "/checkout",
        build: (options) => interpolatePath("/checkout", undefined, options?.search, options?.hash),
    },
    FileUploadRoute: {
        to: "/file-upload",
        build: (options) => interpolatePath("/file-upload", undefined, options?.search, options?.hash),
    },
    AdminRoute: {
        to: "/admin",
        build: (options) => interpolatePath("/admin", undefined, options?.search, options?.hash),
    },
    AdminUsersRoute: {
        to: "/admin/users",
        build: (options) => interpolatePath("/admin/users", undefined, options?.search, options?.hash),
    },
    AdminSettingsRoute: {
        to: "/admin/settings",
        build: (options) => interpolatePath("/admin/settings", undefined, options?.search, options?.hash),
    },
    AdminCalendarRoute: {
        to: "/admin/calendar",
        build: (options) => interpolatePath("/admin/calendar", undefined, options?.search, options?.hash),
    },
    AdminUIButtonsRoute: {
        to: "/admin/ui/buttons",
        build: (options) => interpolatePath("/admin/ui/buttons", undefined, options?.search, options?.hash),
    },
    NotFoundRoute: {
        to: "*",
        build: (options) => interpolatePath("*", options.params, options?.search, options?.hash),
    },
    AdminMessagesRoute: {
        to: "/admin/messages",
        build: (options) => interpolatePath("/admin/messages", undefined, options?.search, options?.hash),
    },
};
// PUBLIC API
export { Link } from './Link';
//# sourceMappingURL=index.js.map