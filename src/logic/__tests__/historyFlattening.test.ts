import { describe, expect, it } from 'vitest';
import { shouldFlattenHistory } from '../historyFlattening';
import type { GameAction } from '../../types';

describe('History Flattening', () => {
    it('flattens only after draft/setup history returns to IDLE', () => {
        const draftHistory: GameAction[] = [
            { type: 'INIT_DRAFT', payload: {} as never },
            { type: 'SELECT_BUFF', payload: { buffId: 'privilege_favor', randomColor: 'red' } },
        ];

        expect(shouldFlattenHistory('IDLE', draftHistory.length, draftHistory)).toBe(true);
        expect(shouldFlattenHistory('DRAFT_PHASE', draftHistory.length, draftHistory)).toBe(false);
    });

    it('does not flatten ordinary turn history or short histories', () => {
        const ordinaryHistory: GameAction[] = [
            { type: 'INIT', payload: {} as never },
            { type: 'TAKE_GEMS', payload: { coords: [{ r: 0, c: 0 }] } },
        ];

        expect(shouldFlattenHistory('IDLE', ordinaryHistory.length, ordinaryHistory)).toBe(false);
        expect(shouldFlattenHistory('IDLE', 1, ordinaryHistory.slice(0, 1))).toBe(false);
        expect(shouldFlattenHistory('IDLE', 0, [])).toBe(false);
    });
});
