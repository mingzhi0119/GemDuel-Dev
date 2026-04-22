import type { Card, GameState } from '../types';
import { stableJsonStringify } from './stableJson';

const RUNTIME_CARD_SUFFIX_PATTERN = /-\d{13}-[a-z0-9]+$/i;
const REPLAY_INSTANCE_PATTERN = /^c:(.+)#\d+$/;

const canonicalizeCardId = (id: string): string => {
    const replayInstanceMatch = REPLAY_INSTANCE_PATTERN.exec(id);
    if (replayInstanceMatch) {
        return replayInstanceMatch[1]!;
    }

    return id.replace(RUNTIME_CARD_SUFFIX_PATTERN, '');
};

const normalizeAbility = (ability: Card['ability']): Card['ability'] =>
    Array.isArray(ability) ? [...ability].sort() : (ability ?? 'none');

const summarizeCard = (card: Card | null) =>
    card
        ? {
              id: canonicalizeCardId(card.id),
              level: card.level,
              points: card.points,
              crowns: card.crowns ?? 0,
              bonusColor: card.bonusColor ?? null,
              bonusCount: card.bonusCount ?? 1,
              ability: normalizeAbility(card.ability),
              isBuff: Boolean(card.isBuff),
          }
        : null;

const sortCardSummaries = (cards: Card[]) =>
    cards
        .map((card) => summarizeCard(card))
        .sort((left, right) => stableJsonStringify(left).localeCompare(stableJsonStringify(right)));

/**
 * Generates a simple checksum (hash) for the game state.
 * This is used to detect desynchronization between clients in online mode.
 */
export const generateGameStateHash = (state: GameState | null): string => {
    if (!state) return 'null';

    // Extract only critical sync-relevant fields to avoid noise from UI state
    // We sort keys to ensure deterministic stringification
    const criticalState = {
        board: state.board.map((row) => row.map((cell) => cell.type.id)), // Only check gem types, not UIDs if they differ
        turn: state.turn,
        phase: state.phase,
        mode: state.mode,
        inventories: state.inventories,
        privileges: state.privileges,
        playerTableau: {
            p1: sortCardSummaries(state.playerTableau.p1),
            p2: sortCardSummaries(state.playerTableau.p2),
        },
        playerReserved: {
            p1: sortCardSummaries(state.playerReserved.p1),
            p2: sortCardSummaries(state.playerReserved.p2),
        },
        market: {
            1: state.market[1].map((card) => summarizeCard(card)),
            2: state.market[2].map((card) => summarizeCard(card)),
            3: state.market[3].map((card) => summarizeCard(card)),
        },
        bonusGemTarget: state.bonusGemTarget?.id || null,
        nextPlayerAfterRoyal: state.nextPlayerAfterRoyal,
        pendingExtraTurn: state.pendingExtraTurn,
        abilityResolution: state.abilityResolution,
        royalMilestones: state.royalMilestones,
        extraPoints: state.extraPoints,
        extraCrowns: state.extraCrowns,
        royalDeck: state.royalDeck.map((card) => card.id),
        playerBuffs: {
            p1: {
                id: state.playerBuffs.p1?.id,
                state: state.playerBuffs.p1?.state || null,
            },
            p2: {
                id: state.playerBuffs.p2?.id,
                state: state.playerBuffs.p2?.state || null,
            },
        },
        playerTurnCounts: state.playerTurnCounts,
    };

    const jsonString = stableJsonStringify(criticalState);

    // Simple DJB2 hash
    let hash = 5381;
    for (let i = 0; i < jsonString.length; i++) {
        hash = (hash * 33) ^ jsonString.charCodeAt(i);
    }

    return (hash >>> 0).toString(16); // Convert to unsigned hex
};
