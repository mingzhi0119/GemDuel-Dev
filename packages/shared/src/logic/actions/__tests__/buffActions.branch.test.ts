import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BUFFS, GAME_PHASES } from '../../../constants';
import { createGameSetupPayload } from '../../gameSetup';
import { createMockState } from '../../__tests__/testHelpers';
import { handleRerollDraftPool, handleSelectBuff } from '../buffActions';
import { validateCommand } from '../../commandGate';
import { applyAction } from '../../gameReducer';
import type { GameAction, GameState } from '../../../types';

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

    it('builds the local p2 asymmetric draft pool after p1 selects a buff and records color preference', () => {
        const state = createState({
            mode: 'LOCAL_PVP',
            phase: GAME_PHASES.DRAFT_PHASE,
            turn: 'p1',
            buffLevel: 2,
            p2DraftLevel: 2,
            draftOrder: ['p1', 'p2'],
        });

        handleSelectBuff(state, {
            buffId: BUFFS.COLOR_PREFERENCE.id,
            randomColor: 'blue',
        });

        expect(state.p1SelectedBuff?.id).toBe(BUFFS.COLOR_PREFERENCE.id);
        expect(state.playerBuffs.p1.state?.discountColor).toBe('blue');
        expect(state.playerTableau.p1).toEqual([
            expect.objectContaining({
                id: '131-bl',
                bonusColor: 'blue',
                bonusCount: 1,
                isBuff: true,
            }),
        ]);
        expect(state.turn).toBe('p2');
        expect(state.p2DraftLevel).toBe(2);
        expect(state.p2DraftPool).toEqual([
            BUFFS.COLOR_PREFERENCE.id,
            BUFFS.PEARL_TRADER.id,
            BUFFS.EXTORTION.id,
            BUFFS.SPECULATOR.id,
        ]);
    });

    it('keeps the online sync path on explicit p2 draft indices', () => {
        const state = createState({
            mode: 'ONLINE_MULTIPLAYER',
            phase: GAME_PHASES.DRAFT_PHASE,
            turn: 'p1',
            buffLevel: 2,
            p2DraftLevel: 2,
            draftOrder: ['p1', 'p2'],
        });

        handleSelectBuff(state, {
            buffId: BUFFS.COLOR_PREFERENCE.id,
            randomColor: 'blue',
            p2DraftPoolIndices: [2, 3, 5, 8],
        });

        expect(state.turn).toBe('p2');
        expect(state.p2DraftLevel).toBe(2);
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
                id: '121-gr',
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

    it('rerolls in offline draft modes and keeps p1/p2 level ownership separate', () => {
        const blockedState = createState({
            mode: 'ONLINE_MULTIPLAYER',
            phase: GAME_PHASES.DRAFT_PHASE,
            turn: 'p1',
            buffLevel: 2,
            p2DraftLevel: 2,
            draftPool: ['old-a', 'old-b'],
        });
        const blockedSnapshot = JSON.parse(JSON.stringify(blockedState)) as GameState;

        handleRerollDraftPool(blockedState, { level: 3 });
        expect(blockedState).toEqual(blockedSnapshot);

        const pveState = createState({
            mode: 'PVE',
            phase: GAME_PHASES.DRAFT_PHASE,
            turn: 'p1',
            localPlayer: 'p1',
            buffLevel: 2,
            p2DraftLevel: 2,
            draftPool: ['stale-a', 'stale-b'],
        });

        handleRerollDraftPool(pveState, { level: 3 });

        expect(pveState.buffLevel).toBe(3);
        expect(pveState.draftPool).toHaveLength(3);
        expect(new Set(pveState.draftPool).size).toBe(3);
        expect(
            pveState.draftPool.every((buffId) =>
                Object.values(BUFFS).some((buff) => buff.id === buffId && buff.level === 3)
            )
        ).toBe(true);
        expect(pveState.draftPool).toEqual(
            expect.arrayContaining([BUFFS.GREED_KING.id, BUFFS.DOUBLE_AGENT.id])
        );

        const rerollState = createState({
            mode: 'LOCAL_PVP',
            phase: GAME_PHASES.DRAFT_PHASE,
            turn: 'p1',
            buffLevel: 1,
            p2DraftLevel: 1,
            draftPool: ['stale-a', 'stale-b'],
            p2DraftPool: ['keep-me'],
        });

        handleRerollDraftPool(rerollState, { level: 1 });

        expect(rerollState.buffLevel).toBe(1);
        expect(rerollState.p2DraftLevel).toBe(1);
        expect(rerollState.p2DraftPool).toEqual(['keep-me']);
        expect(rerollState.draftPool).toEqual([
            BUFFS.PRIVILEGE_FAVOR.id,
            BUFFS.INTELLIGENCE.id,
            BUFFS.DEEP_POCKETS.id,
        ]);

        const firstDeterministic = createState({
            mode: 'LOCAL_PVP',
            phase: GAME_PHASES.DRAFT_PHASE,
            turn: 'p1',
            buffLevel: 2,
            draftPool: ['same-a', 'same-b', 'same-c'],
        });
        const secondDeterministic = createState({
            mode: 'LOCAL_PVP',
            phase: GAME_PHASES.DRAFT_PHASE,
            turn: 'p1',
            buffLevel: 2,
            draftPool: ['same-a', 'same-b', 'same-c'],
        });

        handleRerollDraftPool(firstDeterministic, { level: 2 });
        handleRerollDraftPool(secondDeterministic, { level: 2 });

        expect(firstDeterministic.draftPool).toEqual(secondDeterministic.draftPool);
    });

    it('uses p2DraftLevel for refresh defaults and lets p2 choose the p1 card without changing buffLevel', () => {
        const rerollState = createState({
            mode: 'LOCAL_PVP',
            phase: GAME_PHASES.DRAFT_PHASE,
            turn: 'p2',
            buffLevel: 2,
            p2DraftLevel: 3,
            p1SelectedBuff: JSON.parse(JSON.stringify(BUFFS.COLOR_PREFERENCE)),
            p2DraftPool: [BUFFS.COLOR_PREFERENCE.id, 'old-a', 'old-b', 'old-c'],
            draftOrder: ['p1', 'p2'],
            pendingSetup: createGameSetupPayload('LOCAL_PVP'),
        });

        handleRerollDraftPool(rerollState, {});

        expect(rerollState.buffLevel).toBe(2);
        expect(rerollState.p2DraftLevel).toBe(3);
        expect(rerollState.p2DraftPool).toEqual([
            BUFFS.COLOR_PREFERENCE.id,
            BUFFS.GREED_KING.id,
            BUFFS.DOUBLE_AGENT.id,
            BUFFS.ECHO_RESERVOIR.id,
        ]);

        handleSelectBuff(rerollState, {
            buffId: BUFFS.COLOR_PREFERENCE.id,
        });

        expect(rerollState.phase).toBe(GAME_PHASES.IDLE);
        expect(rerollState.playerBuffs.p2.id).toBe(BUFFS.COLOR_PREFERENCE.id);
        expect(rerollState.buffLevel).toBe(2);
    });

    it('rejects a stale p2 draft selection before p1 locks a buff', () => {
        const state = createState({
            mode: 'LOCAL_PVP',
            phase: GAME_PHASES.DRAFT_PHASE,
            turn: 'p2',
            buffLevel: 1,
            p2DraftLevel: 1,
            draftOrder: ['p1', 'p2'],
            draftPool: [BUFFS.PRIVILEGE_FAVOR.id, BUFFS.INTELLIGENCE.id, BUFFS.DEEP_POCKETS.id],
            p2DraftPool: [
                BUFFS.PRIVILEGE_FAVOR.id,
                BUFFS.INTELLIGENCE.id,
                BUFFS.DEEP_POCKETS.id,
                BUFFS.ROYAL_BLOOD.id,
            ],
            p1SelectedBuff: null,
        });
        const action: GameAction = {
            type: 'SELECT_BUFF',
            payload: { buffId: BUFFS.PRIVILEGE_FAVOR.id },
        };
        const snapshot = JSON.parse(JSON.stringify(state)) as GameState;

        expect(validateCommand(state, action)).toEqual({
            valid: false,
            reason: 'P2 draft selections require a locked-in P1 buff selection.',
        });
        expect(applyAction(state, action)).toBe(state);
        expect(state).toEqual(snapshot);
    });
});
