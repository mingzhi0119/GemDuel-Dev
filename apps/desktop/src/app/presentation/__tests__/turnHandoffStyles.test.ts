import { describe, expect, it } from 'vitest';
import { createGaussianBlurHaloStyle } from '../turnHandoffStyles';

describe('createGaussianBlurHaloStyle', () => {
    it('uses blur strength variants', () => {
        const strong = createGaussianBlurHaloStyle({ color: '#ff0000' });
        expect(strong.filter).toContain('18');

        const soft = createGaussianBlurHaloStyle({ color: '#00ff00', strength: 'soft' });
        expect(soft.filter).toContain('12');
    });
});
