import { describe, expect, it } from 'vitest';
import {
    getPresentationDurationMs,
    getPresentationDurationSeconds,
    getPresentationTimingScale,
} from '../presentationPreviewMode';

describe('presentationPreviewMode', () => {
    it('scales durations when preview mode is active', () => {
        expect(getPresentationTimingScale()).toBe(1);
        expect(getPresentationTimingScale('slow')).toBe(3);
        expect(getPresentationDurationSeconds(1, 'slow')).toBe(3);
        expect(getPresentationDurationMs(1000, 'slow')).toBe(3000);
    });
});
