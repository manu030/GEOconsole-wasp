interface FeatureProps {
    name: string;
    description: string | React.ReactNode;
    direction?: 'row' | 'row-reverse';
    highlightedComponent: React.ReactNode;
    tilt?: 'left' | 'right';
}
/**
 * A component that highlights a feature with a description and a highlighted component.
 * Shows text description on one side, and whatever component you want to show on the other side to demonstrate the functionality.
 */
declare const HighlightedFeature: ({ name, description, direction, highlightedComponent, tilt, }: FeatureProps) => import("react").JSX.Element;
export default HighlightedFeature;
//# sourceMappingURL=HighlightedFeature.d.ts.map