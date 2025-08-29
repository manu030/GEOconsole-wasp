export function requireNodeEnvVar(name) {
    const value = process.env[name];
    if (value === undefined) {
        throw new Error(`Env var ${name} is undefined`);
    }
    else {
        return value;
    }
}
//# sourceMappingURL=utils.js.map