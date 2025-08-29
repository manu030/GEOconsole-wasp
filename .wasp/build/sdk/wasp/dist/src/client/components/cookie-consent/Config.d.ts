import type { CookieConsentConfig } from 'vanilla-cookieconsent';
declare global {
    interface Window {
        dataLayer: any;
    }
}
declare const getConfig: () => CookieConsentConfig;
export default getConfig;
//# sourceMappingURL=Config.d.ts.map