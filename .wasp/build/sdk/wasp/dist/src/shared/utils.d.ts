/**
 * Used purely to help compiler check for exhaustiveness in switch statements,
 * will never execute. See https://stackoverflow.com/a/39419171.
 */
export declare function assertUnreachable(x: never): never;
/**
 * Allows for throttling a function call while still allowing the last invocation to be executed after the throttle delay ends.
 */
export declare function throttleWithTrailingInvocation(fn: () => void, delayInMilliseconds: number): ((...args: any[]) => void) & {
    cancel: () => void;
};
//# sourceMappingURL=utils.d.ts.map