import { GAME_PHASES, GEM_TYPES } from '../../constants';
import { addPrivilege } from '../stateHelpers';
import type {
    BounsColor,
    Buff,
    Card,
    EffectiveCardAbility,
    GameState,
    GemColor,
    PendingAbilityResolution,
    PlayerKey,
} from '../../types';

const PURCHASE_RESOLUTION_ORDER = ['again', 'steal', 'bonus_gem', 'scroll'] as const;
const ROYAL_RESOLUTION_ORDER = ['again', 'bonus_gem', 'steal', 'scroll'] as const;

export interface AbilitySourceSnapshot {
    abilities: EffectiveCardAbility[];
    bonusColor?: BounsColor;
}

const isEchoReservoirBuff = (buff?: Buff | null): boolean =>
    Boolean(buff?.effects?.passive?.echoReservoir);

const hasQueuedOrResolvedAbility = (state: GameState, ability: EffectiveCardAbility): boolean =>
    Boolean(
        state.abilityResolution?.resolved.includes(ability) ||
        state.abilityResolution?.pending.includes(ability as PendingAbilityResolution)
    );

const isResolvableBonusColor = (color?: BounsColor): color is Exclude<GemColor, 'gold'> =>
    color !== undefined && color !== 'null' && color !== 'gold';

const ensureAbilityResolution = (state: GameState, nextPlayer: PlayerKey) => {
    if (!state.abilityResolution) {
        state.abilityResolution = {
            nextPlayer,
            pending: [],
            resolved: [],
        };
    } else {
        state.abilityResolution.nextPlayer = nextPlayer;
    }

    return state.abilityResolution;
};

const seedAbilityResolution = (
    state: GameState,
    nextPlayer: PlayerKey,
    sources: AbilitySourceSnapshot[],
    order: readonly EffectiveCardAbility[],
    deferredEchoWrite?: NonNullable<GameState['abilityResolution']>['deferredEchoWrite']
) => {
    if (!sources.some((source) => source.abilities.length > 0) && !deferredEchoWrite) {
        return;
    }

    const resolution = ensureAbilityResolution(state, nextPlayer);
    if (deferredEchoWrite) {
        resolution.deferredEchoWrite = deferredEchoWrite;
    }

    for (const ability of order) {
        if (hasQueuedOrResolvedAbility(state, ability)) {
            continue;
        }

        const source = sources.find((candidate) => {
            if (!candidate.abilities.includes(ability)) {
                return false;
            }

            if (ability !== 'bonus_gem') {
                return true;
            }

            return isResolvableBonusColor(candidate.bonusColor);
        });

        if (!source) {
            continue;
        }

        if (ability === 'again') {
            resolution.resolved.push('again');
            state.pendingExtraTurn = true;
            continue;
        }

        if (ability === 'bonus_gem' && resolution.bonusGemColor === undefined) {
            resolution.bonusGemColor = source.bonusColor;
        }

        resolution.pending.push(ability as PendingAbilityResolution);
    }
};

export const normalizeCardAbilities = (
    ability?: Card['ability'] | EffectiveCardAbility[]
): EffectiveCardAbility[] => {
    if (!ability) {
        return [];
    }

    const entries = Array.isArray(ability) ? ability : [ability];
    const seen = new Set<EffectiveCardAbility>();
    const normalized: EffectiveCardAbility[] = [];

    for (const entry of entries) {
        if (entry === 'none') {
            continue;
        }

        if (!seen.has(entry)) {
            seen.add(entry);
            normalized.push(entry);
        }
    }

    return normalized;
};

export const getCardAbilitySnapshot = (
    card: Pick<Card, 'ability' | 'bonusColor'>
): AbilitySourceSnapshot => ({
    abilities: normalizeCardAbilities(card.ability),
    bonusColor: card.bonusColor,
});

export const getStoredEchoReservoirSnapshot = (
    buff?: Buff | null
): AbilitySourceSnapshot | null => {
    const reservoirBuff = buff;
    if (!reservoirBuff || !isEchoReservoirBuff(reservoirBuff)) {
        return null;
    }

    const abilities = normalizeCardAbilities(reservoirBuff.state?.echoReservoirStoredAbilities);
    const snapshot =
        abilities.length > 0
            ? {
                  abilities,
                  bonusColor: reservoirBuff.state?.echoReservoirStoredBonusColor,
              }
            : null;

    if (reservoirBuff.state) {
        delete reservoirBuff.state.echoReservoirStoredAbilities;
        delete reservoirBuff.state.echoReservoirStoredBonusColor;
    }

    if (abilities.length === 0) {
        return null;
    }

    return snapshot;
};

export const createDeferredEchoReservoirWrite = (
    state: GameState,
    purchaser: PlayerKey,
    card: Pick<Card, 'ability' | 'bonusColor'>
): NonNullable<GameState['abilityResolution']>['deferredEchoWrite'] | undefined => {
    const holder: PlayerKey = purchaser === 'p1' ? 'p2' : 'p1';
    const holderBuff = state.playerBuffs?.[holder];
    const snapshot = getCardAbilitySnapshot(card);

    if (!isEchoReservoirBuff(holderBuff) || snapshot.abilities.length === 0) {
        return undefined;
    }

    return {
        holder,
        abilities: snapshot.abilities,
        bonusColor: snapshot.bonusColor,
    };
};

export const startPurchaseAbilityResolution = (
    state: GameState,
    nextPlayer: PlayerKey,
    cardSnapshot: AbilitySourceSnapshot,
    echoSnapshot: AbilitySourceSnapshot | null,
    deferredEchoWrite?: NonNullable<GameState['abilityResolution']>['deferredEchoWrite']
) => {
    const sources = echoSnapshot ? [cardSnapshot, echoSnapshot] : [cardSnapshot];
    seedAbilityResolution(state, nextPlayer, sources, PURCHASE_RESOLUTION_ORDER, deferredEchoWrite);
};

export const startRoyalAbilityResolution = (
    state: GameState,
    nextPlayer: PlayerKey,
    royalSnapshot: AbilitySourceSnapshot
) => {
    seedAbilityResolution(state, nextPlayer, [royalSnapshot], ROYAL_RESOLUTION_ORDER);
};

export const continueAbilityResolution = (state: GameState): 'waiting' | 'complete' => {
    const resolution = state.abilityResolution;
    if (!resolution) {
        return 'complete';
    }

    while (resolution.pending.length > 0) {
        const ability = resolution.pending.shift();
        if (!ability || resolution.resolved.includes(ability)) {
            continue;
        }

        resolution.resolved.push(ability);

        if (ability === 'scroll') {
            addPrivilege(state, state.turn);
            continue;
        }

        if (ability === 'steal') {
            const opponent: PlayerKey = state.turn === 'p1' ? 'p2' : 'p1';
            const oppBuff = state.playerBuffs?.[opponent];

            if (oppBuff?.effects?.passive?.immuneNegative) {
                state.toastMessage = 'Steal blocked by Pacifist!';
                continue;
            }

            const hasStealable = Object.entries(state.inventories[opponent]).some(
                ([key, count]) => key !== 'gold' && count > 0
            );

            if (!hasStealable) {
                state.toastMessage = 'No stealable gem from opponent - Skill skipped';
                continue;
            }

            state.phase = GAME_PHASES.STEAL_ACTION;
            state.nextPlayerAfterRoyal = resolution.nextPlayer;
            state.bonusGemTarget = null;
            return 'waiting';
        }

        if (!isResolvableBonusColor(resolution.bonusGemColor)) {
            continue;
        }

        const targetColor = resolution.bonusGemColor;
        const hasGem = state.board.some((row) => row.some((gem) => gem.type.id === targetColor));

        if (!hasGem) {
            state.toastMessage = 'No matching gem available - Skill skipped';
            continue;
        }

        state.phase = GAME_PHASES.BONUS_ACTION;
        state.bonusGemTarget = GEM_TYPES[targetColor.toUpperCase() as keyof typeof GEM_TYPES];
        state.nextPlayerAfterRoyal = resolution.nextPlayer;
        return 'waiting';
    }

    return 'complete';
};

export const getAbilityResolutionNextPlayer = (state: GameState, fallback: PlayerKey): PlayerKey =>
    state.abilityResolution?.nextPlayer || fallback;

export const commitDeferredEchoReservoirWrite = (state: GameState) => {
    const deferred = state.abilityResolution?.deferredEchoWrite;
    if (!deferred || deferred.abilities.length === 0) {
        return;
    }

    const holderBuff = state.playerBuffs?.[deferred.holder];
    if (!isEchoReservoirBuff(holderBuff)) {
        return;
    }

    if (!holderBuff.state) {
        holderBuff.state = {};
    }

    holderBuff.state.echoReservoirStoredAbilities = normalizeCardAbilities(deferred.abilities);

    if (deferred.bonusColor !== undefined) {
        holderBuff.state.echoReservoirStoredBonusColor = deferred.bonusColor;
    } else {
        delete holderBuff.state.echoReservoirStoredBonusColor;
    }
};

export const clearAbilityResolution = (state: GameState) => {
    state.abilityResolution = null;
    state.bonusGemTarget = null;
};
