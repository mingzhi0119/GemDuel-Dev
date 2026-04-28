import { describe, expect, it } from 'vitest';
import { getMotionLabel } from '../motionLabLabels';

describe('getMotionLabel', () => {
    it('title-cases hyphenated motion event ids', () => {
        expect(getMotionLabel('royal-unlock')).toBe('Royal Unlock');
        expect(getMotionLabel('market-refill')).toBe('Market Refill');
    });
});
