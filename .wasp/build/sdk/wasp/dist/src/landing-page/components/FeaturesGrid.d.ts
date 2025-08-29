import React from 'react';
import { Feature } from './Features';
export interface GridFeature extends Omit<Feature, 'icon'> {
    icon?: React.ReactNode;
    emoji?: string;
    direction?: 'col' | 'row' | 'col-reverse' | 'row-reverse';
    align?: 'center' | 'left';
    size: 'small' | 'medium' | 'large';
    fullWidthIcon?: boolean;
}
interface FeaturesGridProps {
    features: GridFeature[];
    className?: string;
}
declare const FeaturesGrid: ({ features, className }: FeaturesGridProps) => React.JSX.Element;
export default FeaturesGrid;
//# sourceMappingURL=FeaturesGrid.d.ts.map