import { describe, expect, it, vi, beforeEach } from 'vitest';
import { BUFFS, GAME_PHASES } from '../../../constants';
import { createGameSetupPayload } from '../../gameSetup';
import { createMockState } from '../../__tests__/testHelpers';
import { handleRerollBuffs, handleSelectBuff } from '../buffActions';
import type { GameState } from '../../../types';

vi.mock('../../../utils', async () => {
    const actual = await vi.importActual<typeof import('../../../utils')>('../../../utils');
    return {
        ...actual,
        shuffleArray: vi.fn((items: unknown[]) => [...items]),
    };
});

const createState = (overrides: Partial<GameState> = {}): GameState =>
    JSON.parse(JSON.stringify(createMockState(overrides))) as GameState;

describe('buffActions branch coverage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('selects a buff, fills the p2 draft pool from explicit indices, and records color preference', () => {
        const state = createState({
            phase: GAME_PHASES.DRAFT_PHASE,
            turn: 'p1',
            buffLevel: 2,
            draftOrder: ['p1', 'p2'],
        });

        handleSelectBuff(state, {
            buffId: BUFFS.COLOR_PREFERENCE.id,
            randomColor: 'blue',
            p2DraftPoolIndices: [2, 3, 5, 8],
        });

        expect(state.p1SelectedBuff?.id).toBe(BUFFS.COLOR_PREFERENCE.id);
        expect(state.playerBuffs.p1.state?.discountColor).toBe('blue');
        expect(state.playerTableau.p1).toEqual([
            expect.objectContaining({
                id: 'buff-color-pref-p1-blue',
                bonusColor: 'blue',
                bonusCount: 1,
                isBuff: true,
            }),
        ]);
        expect(state.turn).toBe('p2');
        expect(state.p2DraftPool).toEqual([
            BUFFS.COLOR_PREFERENCE.id,
            BUFFS.EXTORTION.id,
            BUFFS.BOUNTY_HUNTER.id,
            BUFFS.SPECULATOR.id,
        ]);
    });

    it('finalizes draft setup and applies p1/p2 init buffs when the last pick resolves', () => {
        const pendingSetup = createGameSetupPayload('LOCAL_PVP');
        pendingSetup.initRandoms.p1 = {
            randomGems: [],
            reserveCardLevel: 1,
            preferenceColor: 'green',
        };
        pendingSetup.initRandoms.p2 = {
            randomGems: ['red', 'blue', 'green', 'white', 'black'],
            reserveCardLevel: 1,
            preferenceColor: 'red',
        };

        const state = createState({
            phase: GAME_PHASES.DRAFT_PHASE,
            turn: 'p1',
            draftOrder: ['p1'],
            pendingSetup,
        });
        state.playerBuffs.p2 = JSON.parse(JSON.stringify(BUFFS.BACKUP_SUPPLY));

        handleSelectBuff(state, {
            buffId: BUFFS.COLOR_PREFERENCE.id,
            randomColor: 'green',
        });

        expect(state.phase).toBe(GAME_PHASES.IDLE);
        expect(state.turn).toBe('p1');
        expect(state.pendingSetup).toBeNull();
        expect(state.draftOrder).toEqual([]);
        expect(state.p1SelectedBuff?.id).toBe(BUFFS.COLOR_PREFERENCE.id);
        expect(state.playerBuffs.p1.state?.discountColor).toBe('green');
        expect(state.playerTableau.p1).toEqual([
            expect.objectContaining({
                id: 'buff-color-pref-p1-green',
                bonusColor: 'green',
                bonusCount: 1,
                isBuff: true,
            }),
        ]);
        expect(state.inventories.p2.red).toBe(1);
        expect(state.inventories.p2.blue).toBe(1);
        expect(state.extraAllocation.p2.red).toBe(1);
        expect(state.extraAllocation.p2.blue).toBe(1);
    });

    it('rerolls only during the p1 draft turn and keeps the first three unique categories', () => {
        const blockedState = createState({
            phase: GAME_PHASES.IDLE,
            turn: 'p2',
            buffLevel: 2,
            draftPool: ['old-a', 'old-b'],
        });
        const blockedSnapshot = JSON.parse(JSON.stringify(blockedState)) as GameState;

        handleRerollBuffs(blockedState, { level: 3 });
        expect(blockedState).toEqual(blockedSnapshot);

        const rerollState = createState({
            phase: GAME_PHASES.DRAFT_PHASE,
            turn: 'p1',
            buffLevel: 1,
        });

        handleRerollBuffs(rerollState, { level: 1 });

        expect(rerollState.buffLevel).toBe(1);
        expect(rerollState.draftPool).toEqual([
            BUFFS.PRIVILEGE_FAVOR.id,
            BUFFS.INTELLIGENCE.id,
            BUFFS.DEEP_POCKETS.id,
        ]);
    });
});
