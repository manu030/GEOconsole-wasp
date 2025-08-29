import { PaymentPlanId } from './plans';
interface PaymentPlanCard {
    name: string;
    price: string;
    description: string;
    features: string[];
}
export declare const paymentPlanCards: Record<PaymentPlanId, PaymentPlanCard>;
declare const PricingPage: () => import("react").JSX.Element;
export default PricingPage;
//# sourceMappingURL=PricingPage.d.ts.map