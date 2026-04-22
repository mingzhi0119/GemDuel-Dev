import { getCrownCount, getPlayerScore } from '../logic/selectors';
import type { GemColor, PlayerKey } from '../types';
import { generateReplayStateHash } from './stateHash';
import { serializeReplayPlayers } from './runtime';
import type { ReplayEvent, ReplaySaveInput, ReplaySummary, ReplayVNext } from './types';
import { REPLAY_VNEXT_SCHEMA_VERSION } from './types';

const REPLAY_EVENT_TYPES: ReplayEvent['type'][] = [
    'select_buff',
    'take_gems',
    'replenish',
    'take_bonus_gem',
    'discard_gem',
    'steal_gem',
    'buy_card',
    'reserve_card',
    'reserve_deck',
    'discard_reserved',
    'use_privilege',
    'select_royal',
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
    finalStateHash: string
): ReplaySummary => ({
    turnCount: (currentState.playerTurnCounts?.p1 ?? 0) + (currentState.playerTurnCounts?.p2 ?? 0),
    totalEvents: events.length,
    eventsByType: countEventsByType(events),
    eventsByPlayer: countEventsByPlayer(events),
    winner: currentState.winner,
    endReason: currentState.winner ? 'normal' : null,
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
}: ReplaySaveInput): ReplayVNext => {
    const finalStateHash = generateReplayStateHash(currentState, runtimeToInstance);

    return {
        schemaVersion: REPLAY_VNEXT_SCHEMA_VERSION,
        replayRevision,
        gameVersion,
        createdAt,
        match: {
            mode: currentState.mode,
            seed: null,
            started: true,
            ended: Boolean(currentState.winner),
            winner: currentState.winner,
            endReason: currentState.winner ? 'normal' : null,
        },
        players: serializeReplayPlayers(currentState),
        init,
        events: JSON.parse(JSON.stringify(events)),
        ...(checkpoints.length > 0
            ? { checkpoints: JSON.parse(JSON.stringify(checkpoints)) }
            : {}),
        summary: buildReplaySummary(events, currentState, finalStateHash),
    };
};
