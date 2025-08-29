interface NavigationItem {
    name: string;
    href: string;
}
export default function Footer({ footerNavigation }: {
    footerNavigation: {
        app: NavigationItem[];
        company: NavigationItem[];
    };
}): import("react").JSX.Element;
export {};
//# sourceMappingURL=Footer.d.ts.map