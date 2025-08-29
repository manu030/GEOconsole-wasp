export class UnhandledWebhookEventError extends Error {
    constructor(eventType) {
        super(`Unhandled event type: ${eventType}`);
        this.name = 'UnhandledWebhookEventError';
    }
}
//# sourceMappingURL=errors.js.map