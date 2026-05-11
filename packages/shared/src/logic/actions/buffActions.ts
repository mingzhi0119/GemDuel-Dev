import { INITIAL_STATE_SKELETON } from '../initialState';
import { GAME_PHASES, BUFFS } from '../../constants';
import {
    COLOR_PREFERENCE_LEGACY_DUMMY_PREFIX,
    getColorPreferenceProxyCard,
    isColorPreferenceProxyCardId,
} from '../../data/colorPreferenceProxyCards';
import { buildDraftPoolForLevel, buildP2AsymmetricDraftPool, isBuffLevel } from '../gameSetup';
import { canActionRunInPhase } from '../fsm';
import { createSeededRandomSource, shuffleArray } from '../../utils';
import {
    BasicGemColor,
    GameState,
    PlayerKey,
    Buff,
    BuffInitPayload,
    BuffRuntimeState,
    SelectBuffPayload,
    BuffEffects,
    Card,
    GameSetupPayload,
    InitDraftPayload,
    PlayerInitRandoms,
} from '../../types';

const getLocalPlayerFromSetup = (
    setup: Pick<GameSetupPayload, 'isHost' | 'hostPlayer'>
): PlayerKey => (setup.isHost ? setup.hostPlayer : setup.hostPlayer === 'p1' ? 'p2' : 'p1');

const createColorPreferenceDummyCard = (discountColor: BasicGemColor): Card => ({
    ...getColorPreferenceProxyCard(discountColor),
    isBuff: true,
});

const syncColorPreferenceDummyCard = (
    draft: GameState,
    pid: PlayerKey,
    discountColor?: BasicGemColor
) => {
    const legacyPrefix = `${COLOR_PREFERENCE_LEGACY_DUMMY_PREFIX}${pid}`;
    draft.playerTableau[pid] = draft.playerTableau[pid].filter(
        (card) =>
            !(
                card.isBuff &&
                (card.id.startsWith(legacyPrefix) || isColorPreferenceProxyCardId(card.id))
            )
    );

    if (discountColor) {
        draft.playerTableau[pid].push(createColorPreferenceDummyCard(discountColor));
    }
};

/**
 * Internal Helper: Apply initialization logic for a single player
 */
const applyPlayerInitLogic = (draft: GameState, pid: PlayerKey, randoms?: PlayerInitRandoms) => {
    const rawBuff = draft.playerBuffs[pid];
    if (!rawBuff || rawBuff.id === 'none') return;

    // Reconstruction from ID
    const buff = Object.values(BUFFS).find((b) => b.id === rawBuff.id);
    if (!buff || !buff.effects) return;

    if (!draft.playerBuffs[pid].state) {
        draft.playerBuffs[pid].state = {};
    }

    const fx = (buff.effects as BuffEffects).onInit;
    if (fx) {
        if (fx.privilege)
            draft.extraPrivileges[pid] = (draft.extraPrivileges[pid] || 0) + fx.privilege;

        if (fx.randomGem) {
            const count = typeof fx.randomGem === 'number' ? fx.randomGem : 1;
            const randColors = randoms?.randomGems ?? [];
            randColors.slice(0, count).forEach((randColor) => {
                draft.inventories[pid][randColor]++;
                draft.extraAllocation[pid][randColor]++;
            });
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
            const lvl = randoms?.reserveCardLevel;
            if (lvl && draft.decks[lvl].length > 0) {
                const card = draft.decks[lvl].pop()!;
                draft.playerReserved[pid].push(card);
            }
        }
    }

    if (buff.id === 'extortion') {
        const buffState = draft.playerBuffs[pid].state as BuffRuntimeState;
        buffState.refillCount = 0;
    }
    if (buff.id === 'color_preference') {
        const buffState = draft.playerBuffs[pid].state as BuffRuntimeState;
        const discountColor = buffState.discountColor ?? randoms?.preferenceColor;
        if (discountColor) {
            buffState.discountColor = discountColor;
            syncColorPreferenceDummyCard(draft, pid, discountColor);
        }
    }
};

const ensureStructures = (draft: GameState) => {
    if (!draft.playerBuffs) draft.playerBuffs = { p1: BUFFS.NONE as Buff, p2: BUFFS.NONE as Buff };
    else {
        draft.playerBuffs = { ...draft.playerBuffs };
        // Inflate buffs from BUFFS constant if they are missing effects
        (['p1', 'p2'] as const).forEach((pid) => {
            const current = draft.playerBuffs[pid];
            if (current && (!current.effects || Object.keys(current.effects).length === 0)) {
                const full = Object.values(BUFFS).find((b) => b.id === current.id);
                if (full) {
                    draft.playerBuffs[pid] = {
                        ...JSON.parse(JSON.stringify(full)),
                        state: current.state || {},
                    };
                }
            }
        });
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

const applySetupFields = (draft: GameState, setup: GameSetupPayload) => {
    draft.mode = setup.mode;
    draft.isHost = setup.isHost;
    draft.hostPlayer = setup.hostPlayer;
    draft.localPlayer = getLocalPlayerFromSetup(setup);
    draft.board = setup.board;
    draft.bag = setup.bag;
    draft.market = setup.market;
    draft.decks = setup.decks;
};

export const applyBuffInitEffects = (
    draft: GameState,
    initRandoms: Partial<Record<PlayerKey, PlayerInitRandoms>> = {}
): GameState => {
    ensureStructures(draft);
    applyPlayerInitLogic(draft, 'p1', initRandoms.p1);
    applyPlayerInitLogic(draft, 'p2', initRandoms.p2);
    return draft;
};

export const handleInit = (state: GameState | null, payload: BuffInitPayload): GameState => {
    const skeleton = JSON.parse(JSON.stringify(INITIAL_STATE_SKELETON)) as GameState;
    const initializedState = { ...skeleton };

    applySetupFields(initializedState, payload);
    ensureStructures(initializedState);
    applyPlayerInitLogic(initializedState, 'p1', payload.initRandoms?.p1);
    applyPlayerInitLogic(initializedState, 'p2', payload.initRandoms?.p2);

    return initializedState;
};

const resolveP2DraftLevel = (
    state: Pick<GameState, 'p2DraftLevel' | 'buffLevel'>
): 1 | 2 | 3 | null => {
    if (isBuffLevel(state.p2DraftLevel)) {
        return state.p2DraftLevel;
    }

    if (isBuffLevel(state.buffLevel)) {
        return state.buffLevel;
    }

    return null;
};

export const handleInitDraft = (state: GameState | null, payload: InitDraftPayload): GameState => {
    const { draftPool, buffLevel, ...gameSetup } = payload;
    const newState = JSON.parse(JSON.stringify(INITIAL_STATE_SKELETON)) as GameState;

    newState.draftPool = draftPool;
    newState.buffLevel = buffLevel;
    newState.p2DraftLevel = buffLevel;
    newState.pendingSetup = gameSetup;
    newState.playerTurnCounts = { p1: 0, p2: 0 };
    newState.draftOrder = ['p1', 'p2'];
    newState.phase = GAME_PHASES.DRAFT_PHASE;
    newState.turn = 'p1';
    applySetupFields(newState, gameSetup);

    return newState;
};

export const handleSelectBuff = (state: GameState, payload: SelectBuffPayload): void => {
    const { buffId, randomColor, initRandoms = {}, p2DraftPoolIndices: p2Indices } = payload;
    const player = state.turn;

    // Buff ID assignment - FULL OBJECT from BUFFS
    const fullBuff = Object.values(BUFFS).find((b) => b.id === buffId) || BUFFS.NONE;
    state.playerBuffs[player] = JSON.parse(JSON.stringify(fullBuff));
    state.playerBuffs[player].state = {};

    if (player === 'p1') {
        state.p1SelectedBuff = JSON.parse(JSON.stringify(fullBuff));
    }

    if (buffId === 'color_preference' && randomColor) {
        const buffState = state.playerBuffs[player].state as BuffRuntimeState;
        buffState.discountColor = randomColor;
        syncColorPreferenceDummyCard(state, player, randomColor);
    }

    const currentIdx = state.draftOrder.indexOf(player);
    if (currentIdx !== -1) {
        const nextPlayer = state.draftOrder[currentIdx + 1];

        if (nextPlayer) {
            state.turn = nextPlayer;
            const currentBuffLevel = isBuffLevel(state.buffLevel) ? state.buffLevel : null;
            if (nextPlayer === 'p2' && currentBuffLevel) {
                state.p2DraftLevel = currentBuffLevel;
                const levelBuffs = Object.values(BUFFS).filter((b) => b.level === currentBuffLevel);

                if (p2Indices && p2Indices.length === 4) {
                    state.p2DraftPool = p2Indices.map((i) => (levelBuffs[i] as Buff).id);
                } else if (state.mode === 'LOCAL_PVP' && state.p1SelectedBuff?.id) {
                    const p2DraftPool = buildP2AsymmetricDraftPool(
                        currentBuffLevel,
                        state.p1SelectedBuff.id
                    );
                    if (p2DraftPool) {
                        state.p2DraftPool = p2DraftPool;
                    }
                } else {
                    const shuffled = shuffleArray(
                        [...levelBuffs],
                        createSeededRandomSource(
                            `p2-draft:${state.mode}:${currentBuffLevel}:${state.p1SelectedBuff?.id ?? 'none'}`
                        )
                    );
                    state.p2DraftPool = shuffled.slice(0, 4).map((b) => (b as Buff).id);
                }
            }
        } else {
            const setup = state.pendingSetup;
            if (setup) {
                applySetupFields(state, setup);
            }
            const finalInitRandoms = setup?.initRandoms ?? initRandoms ?? {};
            state.pendingSetup = null;
            state.draftOrder = [];
            state.phase = GAME_PHASES.IDLE;
            state.turn = 'p1';

            ensureStructures(state);
            applyPlayerInitLogic(state, 'p1', finalInitRandoms.p1);
            applyPlayerInitLogic(state, 'p2', finalInitRandoms.p2);
        }
    }
};

export const handleRerollDraftPool = (state: GameState, payload: { level?: 1 | 2 | 3 }): void => {
    if (
        state.mode === 'ONLINE_MULTIPLAYER' ||
        !canActionRunInPhase('REROLL_DRAFT_POOL', state.phase)
    ) {
        return;
    }

    if (state.turn === 'p1') {
        const level = payload.level ?? (isBuffLevel(state.buffLevel) ? state.buffLevel : null);
        if (!level) {
            return;
        }

        state.buffLevel = level;
        state.draftPool = buildDraftPoolForLevel(
            level,
            createSeededRandomSource(
                `draft-reroll:${state.mode}:${level}:${state.turn}:${state.draftPool.join('|')}`
            )
        );
        return;
    }

    if (state.mode !== 'LOCAL_PVP') {
        return;
    }

    if (state.turn !== 'p2' || !state.p1SelectedBuff?.id) {
        return;
    }

    const level = payload.level ?? resolveP2DraftLevel(state);
    if (!level) {
        return;
    }

    const p2DraftPool = buildP2AsymmetricDraftPool(
        level,
        state.p1SelectedBuff.id,
        createSeededRandomSource(
            `draft-reroll:${state.mode}:${level}:${state.turn}:${state.p1SelectedBuff.id}:${state.p2DraftPool?.join('|') ?? 'none'}`
        )
    );
    if (!p2DraftPool) {
        return;
    }

    state.p2DraftLevel = level;
    state.p2DraftPool = p2DraftPool;
};
