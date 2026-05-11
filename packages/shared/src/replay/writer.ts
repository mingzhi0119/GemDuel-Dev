import { getCrownCount, getPlayerScore } from '../logic/selectors';
import type { GemColor, PlayerKey } from '../types';
import { generateReplayStateHash } from './stateHash';
import { serializeReplayPlayers } from './runtime';
import type {
    ReplayEndReason,
    ReplayEvent,
    ReplaySaveInput,
    ReplaySummary,
    ReplayVNext,
} from './types';
import { REPLAY_VNEXT_SCHEMA_VERSION } from './types';

const REPLAY_EVENT_TYPES: ReplayEvent['type'][] = [
    'select_buff',
    'take_gems',
    'replenish',
    'take_bonus_gem',
    'discard_gem',
    'steal_gem',
    'initiate_buy_joker',
    'buy_card',
    'initiate_reserve',
    'initiate_reserve_deck',
    'cancel_reserve',
    'reserve_card',
    'reserve_deck',
    'discard_reserved',
    'activate_privilege',
    'use_privilege',
    'cancel_privilege',
    'select_royal',
    'reroll_draft_pool',
    'peek_deck',
    'close_modal',
];

const countEventsByType = (events: ReplayEvent[]): ReplaySummary['eventsByType'] =>
    REPLAY_EVENT_TYPES.reduce(
        (accumulator, type) => {
            accumulator[type] = events.filter((event) => event.type === type).length;
            return accumulator;
        },
        {} as ReplaySummary['eventsByType']
    );

const countEventsByPlayer = (events: ReplayEvent[]): ReplaySummary['eventsByPlayer'] =>
    events.reduce(
        (accumulator, event) => {
            accumulator[event.actor] += 1;
            return accumulator;
        },
        { p1: 0, p2: 0 }
    );

const getTotalGems = (playerInventory: Record<GemColor | 'gold' | 'pearl', number>) =>
    Object.values(playerInventory).reduce((sum, count) => sum + count, 0);

export const buildReplaySummary = (
    events: ReplayEvent[],
    currentState: ReplaySaveInput['currentState'],
    finalStateHash: string,
    endReason: ReplayEndReason = currentState.winner ? 'normal' : null
): ReplaySummary => ({
    turnCount: (currentState.playerTurnCounts?.p1 ?? 0) + (currentState.playerTurnCounts?.p2 ?? 0),
    totalEvents: events.length,
    eventsByType: countEventsByType(events),
    eventsByPlayer: countEventsByPlayer(events),
    winner: currentState.winner,
    endReason,
    finalScores: {
        p1: getPlayerScore(currentState, 'p1'),
        p2: getPlayerScore(currentState, 'p2'),
    },
    finalCrowns: {
        p1: getCrownCount(currentState, 'p1'),
        p2: getCrownCount(currentState, 'p2'),
    },
    finalGemTotals: {
        p1: getTotalGems(currentState.inventories.p1),
        p2: getTotalGems(currentState.inventories.p2),
    },
    finalStateHash,
    summaryDerivedFrom: 'writer',
});

export const saveReplayVNext = ({
    replayRevision,
    gameVersion,
    createdAt,
    init,
    events,
    checkpoints = [],
    currentState,
    runtimeToInstance,
    endReason,
}: ReplaySaveInput): ReplayVNext => {
    const finalStateHash = generateReplayStateHash(currentState, runtimeToInstance);
    const resolvedEndReason = endReason ?? (currentState.winner ? 'normal' : null);

    return {
        schemaVersion: REPLAY_VNEXT_SCHEMA_VERSION,
        replayRevision,
        gameVersion,
        createdAt,
        match: {
            mode: currentState.mode,
            seed: null,
            started: true,
            ended: resolvedEndReason !== null,
            winner: currentState.winner,
            endReason: resolvedEndReason,
        },
        players: serializeReplayPlayers(currentState),
        init,
        events: JSON.parse(JSON.stringify(events)),
        ...(checkpoints.length > 0 ? { checkpoints: JSON.parse(JSON.stringify(checkpoints)) } : {}),
        summary: buildReplaySummary(events, currentState, finalStateHash, resolvedEndReason),
    };
};
