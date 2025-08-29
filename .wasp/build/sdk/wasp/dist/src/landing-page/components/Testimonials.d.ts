interface Testimonial {
    name: string;
    role: string;
    avatarSrc: string;
    socialUrl: string;
    quote: string;
}
export default function Testimonials({ testimonials }: {
    testimonials: Testimonial[];
}): import("react").JSX.Element;
export {};
//# sourceMappingURL=Testimonials.d.ts.map