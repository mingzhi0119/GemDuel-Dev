import type { CSSProperties } from 'react';

interface GaussianBlurHaloOptions {
    color: string;
    strength?: 'soft' | 'strong';
}

export const createGaussianBlurHaloStyle = ({
    color,
    strength = 'strong',
}: GaussianBlurHaloOptions): CSSProperties => ({
    background: `radial-gradient(circle, ${color} 0%, ${color} 34%, transparent 72%)`,
    filter: `blur(${strength === 'strong' ? 18 : 12}px)`,
});
