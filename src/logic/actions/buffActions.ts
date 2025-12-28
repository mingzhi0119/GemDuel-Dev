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
}

/**
 * Helper: Apply buff initialization effects (onInit)
 */
export const applyBuffInitEffects = (
    state: GameState,
    initRandoms: Record<PlayerKey, any> = {} as Record<PlayerKey, any>
): GameState => {
    // Deep clone the state to ensure every nested property is mutable
    // This is necessary because in some environments (like Vitest),
    // the source skeleton state is deeply frozen.
    const newState = JSON.parse(JSON.stringify(state)) as GameState;

    // Ensure core tracking structures exist
    if (!newState.playerBuffs) {
        newState.playerBuffs = { p1: BUFFS.NONE, p2: BUFFS.NONE };
    }

    if (!newState.extraAllocation) {
        newState.extraAllocation = {
            p1: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
            p2: { blue: 0, white: 0, green: 0, black: 0, red: 0, gold: 0, pearl: 0 },
        };
    }

    if (!newState.extraPrivileges) newState.extraPrivileges = { p1: 0, p2: 0 };
    if (!newState.extraCrowns) newState.extraCrowns = { p1: 0, p2: 0 };
    if (!newState.extraPoints) newState.extraPoints = { p1: 0, p2: 0 };
    if (!newState.playerTurnCounts) newState.playerTurnCounts = { p1: 0, p2: 0 };

    // Apply per-player buff init effects
    (['p1', 'p2'] as const).forEach((pid) => {
        // CRITICAL: Ensure we use the latest buff assigned during handleSelectBuff
        const buff = newState.playerBuffs[pid];
        const randoms = initRandoms[pid] || {};

        if (buff && buff.id !== 'none' && buff.effects) {
            if (!newState.playerBuffs[pid].state) newState.playerBuffs[pid].state = {};

            // Initial reward application (onInit)
            if (buff.effects.onInit) {
                const fx = buff.effects.onInit;

                // Extra privileges (Special/Protected)
                if (fx.privilege) {
                    newState.extraPrivileges[pid] =
                        (newState.extraPrivileges[pid] || 0) + fx.privilege;
                }

                // Random basic gems
                if (fx.randomGem) {
                    const count = typeof fx.randomGem === 'number' ? fx.randomGem : 1;
                    const randColors = randoms.randomGems;
                    if (randColors) {
                        randColors.slice(0, count).forEach((randColor: GemColor) => {
                            newState.inventories[pid][randColor]++;
                            newState.extraAllocation[pid][randColor]++;
                        });
                    }
                }

                // Crowns
                if (fx.crowns) {
                    newState.extraCrowns[pid] = (newState.extraCrowns[pid] || 0) + fx.crowns;
                }

                // Pearls
                if (fx.pearl) {
                    newState.inventories[pid].pearl += fx.pearl;
                    newState.extraAllocation[pid].pearl += fx.pearl;
                }

                // Gold
                if (fx.gold) {
                    newState.inventories[pid].gold += fx.gold;
                    newState.extraAllocation[pid].gold += fx.gold;
                }

                // Reserve card
                if (fx.reserveCard) {
                    const lvl = randoms.reserveCardLevel as 1 | 2 | 3;
                    if (lvl && newState.decks[lvl].length > 0) {
                        const card = newState.decks[lvl].pop()!;
                        newState.playerReserved[pid].push(card);
                    }
                }
            }

            // Special Case Handlers (By ID)
            if (buff.id === 'extortion') {
                (newState.playerBuffs[pid].state as any).refillCount = 0;
            }
            if (buff.id === 'pacifist') {
                newState.extraPrivileges[pid] = (newState.extraPrivileges[pid] || 0) + 1;
            }
            if (buff.id === 'color_preference') {
                const discountColor = randoms.preferenceColor;
                if (discountColor) {
                    const dummyId = `buff-color-pref-${pid}`;
                    if (
                        !newState.playerTableau[pid].some((c) => (c as any).id.startsWith(dummyId))
                    ) {
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
                        newState.playerTableau[pid].push(dummyCard as any);
                    }
                }
            }
        }
    });

    // Check for gem cap overflow
    const p1Cap = newState.playerBuffs?.p1?.effects?.passive?.gemCap || 10;
    const p1Total = Object.values(newState.inventories.p1).reduce((a, b) => a + b, 0);

    if (p1Total > p1Cap) {
        newState.turn = 'p1';
        newState.gameMode = GAME_PHASES.DISCARD_EXCESS_GEMS;
        newState.nextPlayerAfterRoyal = 'p1';
    } else {
        const p2Cap = newState.playerBuffs?.p2?.effects?.passive?.gemCap || 10;
        const p2Total = Object.values(newState.inventories.p2).reduce((a, b) => a + b, 0);
        if (p2Total > p2Cap) {
            newState.turn = 'p2';
            newState.gameMode = GAME_PHASES.DISCARD_EXCESS_GEMS;
            newState.nextPlayerAfterRoyal = 'p1';
        }
    }

    return newState;
};

/**
 * Initialize game with selected buffs and game setup
 */
export const handleInit = (state: GameState | null, payload: BuffInitPayload & any): GameState => {
    // Create fresh skeleton to prevent mutating constant
    const skeleton = JSON.parse(JSON.stringify(INITIAL_STATE_SKELETON)) as GameState;

    // Combine skeleton with payload, ensuring payload properties overwrite defaults.
    const initializedState = { ...skeleton, ...payload };

    // Ensure playerBuffs are initialized if not provided in payload.
    if (!initializedState.playerBuffs) {
        initializedState.playerBuffs = { p1: BUFFS.NONE, p2: BUFFS.NONE };
    }

    return applyBuffInitEffects(initializedState, payload.initRandoms);
};

/**
 * Initialize draft phase with buff selection
 */
export const handleInitDraft = (state: GameState | null, payload: any): GameState => {
    const { draftPool, buffLevel, isPvE, ...gameSetup } = payload;
    // Create fresh skeleton
    const newState = JSON.parse(JSON.stringify(INITIAL_STATE_SKELETON)) as GameState;

    newState.draftPool = draftPool; // This is P1's pool
    newState.buffLevel = buffLevel;
    newState.isPvE = !!isPvE;
    newState.pendingSetup = gameSetup;
    newState.playerTurnCounts = { p1: 0, p2: 0 };
    newState.draftOrder = ['p1', 'p2']; // P1 first, then P2
    newState.gameMode = GAME_PHASES.DRAFT_PHASE;
    newState.turn = 'p1';

    return newState;
};

/**
 * Handle player selecting a buff during draft
 */
export const handleSelectBuff = (
    state: GameState,
    payload: SelectBuffPayload | string
): GameState => {
    const buffId = typeof payload === 'object' ? payload.buffId : payload;
    const randomColor = typeof payload === 'object' ? payload.randomColor : null;
    const initRandoms = typeof payload === 'object' ? payload.initRandoms : {};
    const player = state.turn;

    // Use correct pool based on player
    const currentPool = player === 'p1' ? state.draftPool : state.p2DraftPool || [];

    // Find and assign selected buff
    const selectedBuff = currentPool.find((b) => b.id === buffId);
    if (selectedBuff) {
        // Create a proper copy with fresh state
        const buffWithState = { ...selectedBuff, state: {} } as Buff;
        state.playerBuffs[player] = buffWithState;

        if (player === 'p1') {
            state.p1SelectedBuff = buffWithState;
        }

        // Special: Color Preference buff
        if (selectedBuff.id === 'color_preference' && randomColor) {
            (state.playerBuffs[player].state as any).discountColor = randomColor;

            // Add dummy card for visual representation
            const dummyCard = {
                id: `buff-color-pref-${player}-${Date.now()}`,
                points: 0,
                crowns: 0,
                bonusColor: randomColor as GemColor,
                bonusCount: 1,
                level: 0 as any,
                cost: {},
                image: null,
                isBuff: true,
            } as any;

            if (!state.playerTableau[player]) state.playerTableau[player] = [];
            state.playerTableau[player].push(dummyCard);
        }
    }

    // Draft phase progression
    const currentIdx = state.draftOrder.indexOf(player);
    if (currentIdx !== -1) {
        const nextPlayer = state.draftOrder[currentIdx + 1];

        if (nextPlayer) {
            // Next player's turn to select buff
            state.turn = nextPlayer;

            // Generate a fresh 4-buff pool for P2
            if (nextPlayer === 'p2') {
                const levelBuffs = Object.values(BUFFS).filter((b) => b.level === state.buffLevel);
                // Shuffle all buffs of this level and pick 4 (independent of P1's pool)
                const shuffled = [...levelBuffs].sort(() => Math.random() - 0.5);
                state.p2DraftPool = shuffled.slice(0, 4);
            }
        } else {
            // Draft complete, initialize game
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

            // Apply all effects now that the draft is over
            const finalState = applyBuffInitEffects(state, finalInitRandoms);

            // Explicitly sync all derived state back to draft to avoid lost properties
            state.inventories = finalState.inventories;
            state.playerBuffs = finalState.playerBuffs;
            state.playerTableau = finalState.playerTableau;
            state.playerReserved = finalState.playerReserved;
            state.extraAllocation = finalState.extraAllocation;
            state.extraPrivileges = finalState.extraPrivileges;
            state.extraCrowns = finalState.extraCrowns;
            state.extraPoints = finalState.extraPoints;
            state.playerTurnCounts = finalState.playerTurnCounts;
            state.gameMode = finalState.gameMode;
            state.turn = finalState.turn;
        }
    }
};
