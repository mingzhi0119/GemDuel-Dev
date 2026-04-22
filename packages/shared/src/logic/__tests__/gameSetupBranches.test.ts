import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BUFFS } from '../../constants';
import {
    buildDraftPoolForLevel,
    buildP2AsymmetricDraftPool,
    buildP2DraftPoolIndices,
    buildStartGameAction,
    createGameSetupPayload,
} from '../gameSetup';

vi.mock('../../utils', async () => {
    const actual = await vi.importActual<typeof import('../../utils')>('../../utils');
    return {
        ...actual,
        shuffleArray: vi.fn((items: unknown[]) => [...items]),
    };
});

describe('gameSetup branch coverage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('builds a draft pool with unique categories and stops after three entries', () => {
        const pool = buildDraftPoolForLevel(1);

        expect(pool).toHaveLength(3);
        expect(new Set(pool).size).toBe(3);
        expect(pool).toContain(BUFFS.PRIVILEGE_FAVOR.id);
        expect(pool).toContain(BUFFS.INTELLIGENCE.id);
        expect(pool).toContain(BUFFS.DEEP_POCKETS.id);
    });

    it('returns p2 draft pool indices for a valid selected buff and rejects invalid levels', () => {
        const indices = buildP2DraftPoolIndices(1, BUFFS.PRIVILEGE_FAVOR.id);
        const invalidLevel = buildP2DraftPoolIndices(4, BUFFS.PRIVILEGE_FAVOR.id);
        const asymmetricPool = buildP2AsymmetricDraftPool(3, BUFFS.COLOR_PREFERENCE.id);

        expect(indices).toEqual([0, 3, 4, 8]);
        expect(invalidLevel).toBeUndefined();
        expect(asymmetricPool).toEqual([
            BUFFS.COLOR_PREFERENCE.id,
            BUFFS.GREED_KING.id,
            BUFFS.DOUBLE_AGENT.id,
            BUFFS.ECHO_RESERVOIR.id,
        ]);
    });

    it('falls back to INIT without buffs and preserves setup shape', () => {
        const action = buildStartGameAction('LOCAL_PVP', { useBuffs: false });
        const payload = createGameSetupPayload('LOCAL_PVP', { useBuffs: false });

        expect(action.type).toBe('INIT');
        expect(action.payload.mode).toBe('LOCAL_PVP');
        expect(payload.mode).toBe('LOCAL_PVP');
        expect(payload.isHost).toBe(true);
        expect(payload.board).toHaveLength(5);
        expect(payload.market[1]).toHaveLength(5);
    });
});
