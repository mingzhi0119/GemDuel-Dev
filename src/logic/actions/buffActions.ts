/**
 * Buff Action Handlers (ID-based Synchronization)
 *
 * This refactor uses Buff IDs for storage and synchronization,
 * ensuring compatibility with P2P serialization and complex object data.
 */

import { INITIAL_STATE_SKELETON } from '../initialState';
import { GAME_PHASES, BUFFS } from '../../constants';
import { GameState, PlayerKey, Buff, GemColor } from '../../types';

export interface BuffInitPayload {
    initRandoms?: Record<PlayerKey, any>;
}

export interface SelectBuffPayload {
    buffId: string;
    randomColor?: GemColor;
    initRandoms?: Record<PlayerKey, any>;
    p2DraftPoolIndices?: number[];
}

/**
 * Internal Helper: Apply initialization logic for a single player
 */
const applyPlayerInitLogic = (draft: GameState, pid: PlayerKey, randoms: any) => {
    const rawBuff = draft.playerBuffs[pid];
    if (!rawBuff || rawBuff.id === 'none') return;

    // Reconstruction from ID
    const buff = Object.values(BUFFS).find((b) => b.id === rawBuff.id);
    if (!buff || !buff.effects) return;

    if (!draft.playerBuffs[pid].state) {
        draft.playerBuffs[pid].state = {};
    }

    if (buff.effects.onInit) {
        const fx = buff.effects.onInit;
        if (fx.privilege)
            draft.extraPrivileges[pid] = (draft.extraPrivileges[pid] || 0) + fx.privilege;

        if (fx.randomGem) {
            const count = typeof fx.randomGem === 'number' ? fx.randomGem : 1;
            const randColors = randoms.randomGems;
            if (randColors) {
                randColors.slice(0, count).forEach((randColor: GemColor) => {
                    draft.inventories[pid][randColor]++;
                    draft.extraAllocation[pid][randColor]++;
                });
            }
        }

        if (fx.crowns) draft.extraCrowns[pid] = (draft.extraCrowns[pid] || 0) + fx.crowns;
        if (fx.pearl) {
            draft.inventories[pid].pearl += fx.pearl;
            draft.extraAllocation[pid].pearl += fx.pearl;
        }
        if (fx.gold) {
            draft.inventories[pid].gold += fx.gold;
            draft.extraAllocation[pid].gold += fx.gold;
        }

        if (fx.reserveCard) {
            const lvl = randoms.reserveCardLevel as 1 | 2 | 3;
            if (lvl && draft.decks[lvl].length > 0) {
                const card = draft.decks[lvl].pop()!;
                draft.playerReserved[pid].push(card);
            }
        }
    }

    if (buff.id === 'extortion') (draft.playerBuffs[pid].state as any).refillCount = 0;
    if (buff.id === 'pacifist') draft.extraPrivileges[pid] = (draft.extraPrivileges[pid] || 0) + 1;
    if (buff.id === 'color_preference') {
        const discountColor = randoms.preferenceColor;
        if (discountColor) {
            const dummyId = `buff-color-pref-${pid}`;
            if (!draft.playerTableau[pid].some((c) => (c as any).id.startsWith(dummyId))) {
                const dummyCard = {
                    id: `${dummyId}-${Date.now()}`,
                    points: 0,
                    crowns: 0,
                    bonusColor: discountColor as GemColor,
                    bonusCount: 1,
                    level: 0 as any,
                    cost: {},
                    isBuff: true,
                };
                draft.playerTableau[pid].push(dummyCard as any);
            }
        }
    }
};

const ensureStructures = (draft: GameState) => {
    if (!draft.playerBuffs) draft.playerBuffs = { p1: BUFFS.NONE, p2: BUFFS.NONE };
    else draft.playerBuffs = { ...draft.playerBuffs };

    if (!draft.extraAllocation) {
        draft.extraAllocation = {
            p1: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
            p2: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
        };
    }
    if (!draft.extraPrivileges) draft.extraPrivileges = { p1: 0, p2: 0 };
    if (!draft.extraCrowns) draft.extraCrowns = { p1: 0, p2: 0 };
    if (!draft.extraPoints) draft.extraPoints = { p1: 0, p2: 0 };
    if (!draft.playerTurnCounts) draft.playerTurnCounts = { p1: 0, p2: 0 };
};

export const applyBuffInitEffects = (
    draft: GameState,
    initRandoms: Record<PlayerKey, any> = {}
): GameState => {
    ensureStructures(draft);
    applyPlayerInitLogic(draft, 'p1', initRandoms.p1 || {});
    applyPlayerInitLogic(draft, 'p2', initRandoms.p2 || {});
    return draft;
};

export const handleInit = (state: GameState | null, payload: BuffInitPayload & any): GameState => {
    const skeleton = JSON.parse(JSON.stringify(INITIAL_STATE_SKELETON)) as GameState;
    const initializedState = { ...skeleton, ...payload };
    ensureStructures(initializedState);
    const initRandoms = payload.initRandoms || {};
    applyPlayerInitLogic(initializedState, 'p1', initRandoms.p1 || {});
    applyPlayerInitLogic(initializedState, 'p2', initRandoms.p2 || {});
    return initializedState;
};

export const handleInitDraft = (state: GameState | null, payload: any): GameState => {
    const { draftPool, buffLevel, ...gameSetup } = payload;
    console.log('[REDUCER-INIT-DRAFT] Incoming Pool IDs:', draftPool);

    // Start with a clean copy of skeleton

    const newState = JSON.parse(JSON.stringify(INITIAL_STATE_SKELETON)) as GameState;

    // Store IDs only
    newState.draftPool = Array.isArray(draftPool)
        ? draftPool.map((b: any) => (typeof b === 'string' ? b : b.id))
        : [];
    newState.buffLevel = buffLevel || 1;
    newState.pendingSetup = gameSetup;
    newState.playerTurnCounts = { p1: 0, p2: 0 };
    newState.draftOrder = ['p1', 'p2'];
    newState.phase = GAME_PHASES.DRAFT_PHASE;
    newState.turn = 'p1';

    if (gameSetup.mode) newState.mode = gameSetup.mode;
    if (gameSetup.isHost !== undefined) newState.isHost = gameSetup.isHost;
    if (gameSetup.board) newState.board = gameSetup.board;
    if (gameSetup.bag) newState.bag = gameSetup.bag;
    if (gameSetup.market) newState.market = gameSetup.market;
    if (gameSetup.decks) newState.decks = gameSetup.decks;

    return newState;
};

export const handleSelectBuff = (state: GameState, payload: SelectBuffPayload | string): void => {
    const buffId = typeof payload === 'object' ? payload.buffId : payload;
    const randomColor = typeof payload === 'object' ? payload.randomColor : null;
    const initRandoms = typeof payload === 'object' ? payload.initRandoms : {};
    const p2Indices = typeof payload === 'object' ? payload.p2DraftPoolIndices : null;
    const player = state.turn;

    // Buff ID assignment
    state.playerBuffs[player] = { id: buffId, state: {} } as Buff;
    if (player === 'p1') {
        state.p1SelectedBuff = { id: buffId } as Buff;
    }

    if (buffId === 'color_preference' && randomColor) {
        (state.playerBuffs[player].state as any).discountColor = randomColor;
    }

    const currentIdx = state.draftOrder.indexOf(player);
    if (currentIdx !== -1) {
        const nextPlayer = state.draftOrder[currentIdx + 1];

        if (nextPlayer) {
            state.turn = nextPlayer;
            if (nextPlayer === 'p2') {
                const levelBuffs = Object.values(BUFFS).filter((b) => b.level === state.buffLevel);
                if (p2Indices && p2Indices.length === 4) {
                    state.p2DraftPool = p2Indices.map((i) => levelBuffs[i].id);
                } else {
                    const shuffled = [...levelBuffs].sort(() => Math.random() - 0.5);
                    state.p2DraftPool = shuffled.slice(0, 4).map((b) => b.id);
                }
            }
        } else {
            const setup = state.pendingSetup as any;
            if (setup) {
                state.board = setup.board;
                state.bag = setup.bag || [];
                state.market = setup.market;
                state.decks = setup.decks;
            }
            const finalInitRandoms = (setup?.initRandoms || initRandoms) as Record<PlayerKey, any>;
            state.pendingSetup = null;
            state.draftOrder = [];
            state.phase = GAME_PHASES.IDLE;
            state.turn = 'p1';

            ensureStructures(state);
            applyPlayerInitLogic(state, 'p1', finalInitRandoms.p1 || {});
            applyPlayerInitLogic(state, 'p2', finalInitRandoms.p2 || {});

            const p1Cap =
                Object.values(BUFFS).find((b) => b.id === state.playerBuffs?.p1?.id)?.effects
                    ?.passive?.gemCap || 10;
            const p1Total = Object.values(state.inventories.p1).reduce((a, b) => a + b, 0);
            if (p1Total > p1Cap) {
                state.turn = 'p1';
                state.phase = GAME_PHASES.DISCARD_EXCESS_GEMS;
                state.nextPlayerAfterRoyal = 'p1';
            } else {
                const p2Cap =
                    Object.values(BUFFS).find((b) => b.id === state.playerBuffs?.p2?.id)?.effects
                        ?.passive?.gemCap || 10;
                const p2Total = Object.values(state.inventories.p2).reduce((a, b) => a + b, 0);
                if (p2Total > p2Cap) {
                    state.turn = 'p2';
                    state.phase = GAME_PHASES.DISCARD_EXCESS_GEMS;
                    state.nextPlayerAfterRoyal = 'p1';
                }
            }
        }
    }
};
