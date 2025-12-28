/**
 * Buff Action Handlers
 *
 * Handles game initialization with buffs and buff selection during draft
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
    p2DraftPoolIndices?: number[]; // For syncing P2's pool
}

/**
 * Internal Helper: Apply initialization logic for a single player directly to the draft
 */
const applyPlayerInitLogic = (draft: GameState, pid: PlayerKey, randoms: any) => {
    const buff = draft.playerBuffs[pid];
    if (!buff || buff.id === 'none' || !buff.effects) return;

    // Ensure buff object itself is mutable and has state container
    if (!buff.state) {
        draft.playerBuffs[pid] = { ...buff, state: {} };
    }

    // Now it's safe to access state
    if (!draft.playerBuffs[pid].state) {
        draft.playerBuffs[pid].state = {};
    }

    // Initial reward application (onInit)
    if (buff.effects.onInit) {
        const fx = buff.effects.onInit;

        if (fx.privilege) {
            draft.extraPrivileges[pid] = (draft.extraPrivileges[pid] || 0) + fx.privilege;
        }

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

        if (fx.crowns) {
            draft.extraCrowns[pid] = (draft.extraCrowns[pid] || 0) + fx.crowns;
        }

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

    // Skill-specific logic
    if (buff.id === 'extortion') {
        (draft.playerBuffs[pid].state as any).refillCount = 0;
    }
    if (buff.id === 'pacifist') {
        draft.extraPrivileges[pid] = (draft.extraPrivileges[pid] || 0) + 1;
    }
    if (buff.id === 'color_preference') {
        const discountColor = randoms.preferenceColor;
        if (discountColor) {
            const dummyId = `buff-color-pref-${pid}`;
            // Use 'as any' for partial check to avoid TS strictness on drafts
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

/**
 * Internal Helper: Initialize tracking structures if missing
 */
const ensureStructures = (draft: GameState) => {
    if (!draft.playerBuffs) {
        draft.playerBuffs = { p1: BUFFS.NONE, p2: BUFFS.NONE };
    } else {
        // Force mutable container to break inheritance from read-only constants
        draft.playerBuffs = { ...draft.playerBuffs };
    }

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

/**
 * Public Helper: Apply buff initialization effects (for tests and handleInit)
 */
export const applyBuffInitEffects = (
    draft: GameState,
    initRandoms: Record<PlayerKey, any> = {} as Record<PlayerKey, any>
): GameState => {
    ensureStructures(draft);
    applyPlayerInitLogic(draft, 'p1', initRandoms.p1 || {});
    applyPlayerInitLogic(draft, 'p2', initRandoms.p2 || {});
    return draft;
};

/**
 * Initialize game with selected buffs and game setup (Direct State Creation)
 */
export const handleInit = (state: GameState | null, payload: BuffInitPayload & any): GameState => {
    // Create fresh skeleton
    const skeleton = JSON.parse(JSON.stringify(INITIAL_STATE_SKELETON)) as GameState;
    const initializedState = { ...skeleton, ...payload };

    ensureStructures(initializedState);

    const initRandoms = payload.initRandoms || {};
    applyPlayerInitLogic(initializedState, 'p1', initRandoms.p1 || {});
    applyPlayerInitLogic(initializedState, 'p2', initRandoms.p2 || {});

    return initializedState;
};

/**
 * Initialize draft phase
 */
export const handleInitDraft = (state: GameState | null, payload: any): GameState => {
    const { draftPool, buffLevel, isPvE, ...gameSetup } = payload;
    const newState = JSON.parse(JSON.stringify(INITIAL_STATE_SKELETON)) as GameState;

    newState.draftPool = draftPool;
    newState.buffLevel = buffLevel;
    newState.isPvE = !!isPvE;
    newState.pendingSetup = gameSetup;
    newState.playerTurnCounts = { p1: 0, p2: 0 };
    newState.draftOrder = ['p1', 'p2'];
    newState.gameMode = GAME_PHASES.DRAFT_PHASE;
    newState.turn = 'p1';

    return newState;
};

/**
 * Handle player selecting a buff during draft
 */
export const handleSelectBuff = (state: GameState, payload: SelectBuffPayload | string): void => {
    const buffId = typeof payload === 'object' ? payload.buffId : payload;
    const randomColor = typeof payload === 'object' ? payload.randomColor : null;
    const initRandoms = typeof payload === 'object' ? payload.initRandoms : {};
    const p2Indices = typeof payload === 'object' ? payload.p2DraftPoolIndices : null;
    const player = state.turn;

    // 1. Determine Pool
    const currentPool = player === 'p1' ? state.draftPool : state.p2DraftPool || [];

    // 2. Assign Buff
    const selectedBuff = currentPool.find((b) => b.id === buffId);
    if (selectedBuff) {
        const buffWithState = { ...selectedBuff, state: {} } as Buff;
        state.playerBuffs[player] = buffWithState;

        if (player === 'p1') {
            state.p1SelectedBuff = buffWithState;
        }

        // Color Preference Special Logic (Early Bind)
        if (selectedBuff.id === 'color_preference' && randomColor) {
            (state.playerBuffs[player].state as any).discountColor = randomColor;
            // Dummy card will be added in init logic to be safe, or we can do it here.
            // Let's rely on the init logic to prevent duplicates.
        }
    }

    // 3. Progression
    const currentIdx = state.draftOrder.indexOf(player);
    if (currentIdx !== -1) {
        const nextPlayer = state.draftOrder[currentIdx + 1];

        if (nextPlayer) {
            state.turn = nextPlayer;
            if (nextPlayer === 'p2') {
                const levelBuffs = Object.values(BUFFS).filter((b) => b.level === state.buffLevel);

                if (p2Indices && p2Indices.length === 4) {
                    // Deterministic generation from payload
                    state.p2DraftPool = p2Indices.map((i) => levelBuffs[i]);
                } else {
                    // Fallback to random (Local/AI)
                    const shuffled = [...levelBuffs].sort(() => Math.random() - 0.5);
                    state.p2DraftPool = shuffled.slice(0, 4);
                }
            }
        } else {
            // 4. Draft Complete - INLINE INITIALIZATION
            const setup = state.pendingSetup as any;
            if (setup) {
                state.board = setup.board;
                state.bag = setup.bag;
                state.market = setup.market;
                state.decks = setup.decks;
            }
            const finalInitRandoms = (setup?.initRandoms || initRandoms) as Record<PlayerKey, any>;

            state.pendingSetup = null;
            state.draftOrder = [];
            state.gameMode = GAME_PHASES.IDLE;
            state.turn = 'p1';

            // 5. Explicitly Run Init Logic for Both Players
            ensureStructures(state);
            applyPlayerInitLogic(state, 'p1', finalInitRandoms.p1 || {});
            applyPlayerInitLogic(state, 'p2', finalInitRandoms.p2 || {});

            // Check Gem Caps
            const p1Cap = state.playerBuffs?.p1?.effects?.passive?.gemCap || 10;
            const p1Total = Object.values(state.inventories.p1).reduce((a, b) => a + b, 0);
            if (p1Total > p1Cap) {
                state.turn = 'p1';
                state.gameMode = GAME_PHASES.DISCARD_EXCESS_GEMS;
                state.nextPlayerAfterRoyal = 'p1';
            } else {
                const p2Cap = state.playerBuffs?.p2?.effects?.passive?.gemCap || 10;
                const p2Total = Object.values(state.inventories.p2).reduce((a, b) => a + b, 0);
                if (p2Total > p2Cap) {
                    state.turn = 'p2';
                    state.gameMode = GAME_PHASES.DISCARD_EXCESS_GEMS;
                    state.nextPlayerAfterRoyal = 'p1';
                }
            }
        }
    }
};
