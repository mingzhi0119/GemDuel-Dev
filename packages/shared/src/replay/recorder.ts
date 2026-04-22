import type { GameAction, GameState } from '../types';
import { applyAction } from '../logic/gameReducer';
import { INITIAL_STATE_SKELETON } from '../logic/initialState';
import type {
    ReplayBonusColor,
    ReplayCardInstanceId,
    ReplayCheckpoint,
    ReplayDeltaSync,
    ReplayEvent,
    ReplayFullSync,
    ReplayRecorderState,
    ReplaySync,
    ReplayVNext,
} from './types';
import {
    buildIdentityRuntimeToInstanceMap,
    buildReplayInitSnapshot,
    createReplayCheckpoint,
    resolveRuntimeCardIdToInstanceId,
} from './runtime';
import { generateReplayStateHash } from './stateHash';
import { saveReplayVNext } from './writer';

interface ReplayRecorderInternalState extends ReplayRecorderState {
    runtimeToInstance: Map<string, ReplayCardInstanceId>;
}

const createBaseRecorder = (
    gameVersion: string,
    createdAt = new Date().toISOString()
): ReplayRecorderInternalState => ({
    replayRevision: 0,
    gameVersion,
    createdAt,
    init: null,
    events: [],
    checkpoints: [],
    runtimeToInstance: new Map<string, ReplayCardInstanceId>(),
});

const shouldCreateCheckpoint = (
    revision: number,
    previousState: GameState,
    nextState: GameState
): boolean =>
    revision > 0 &&
    (revision % 25 === 0 ||
        (previousState.phase !== 'IDLE' && nextState.phase === 'IDLE') ||
        (previousState.phase === 'SELECT_ROYAL' && nextState.phase !== 'SELECT_ROYAL') ||
        (!previousState.winner && Boolean(nextState.winner)));

const appendCheckpoint = (
    recorder: ReplayRecorderInternalState,
    revision: number,
    state: GameState
) => {
    const checkpoint = createReplayCheckpoint(revision, state, recorder.runtimeToInstance);
    recorder.checkpoints = recorder.checkpoints
        .filter((existing) => existing.revision !== checkpoint.revision)
        .concat(checkpoint)
        .sort((left, right) => left.revision - right.revision);
};

const normalizeReplayEvent = (
    previousState: GameState,
    action: GameAction,
    runtimeToInstance: Map<string, ReplayCardInstanceId>
): ReplayEvent | null => {
    const actor = previousState.turn;

    switch (action.type) {
        case 'SELECT_BUFF':
            return {
                type: 'select_buff',
                actor,
                buffId: action.payload.buffId,
                ...(action.payload.randomColor ? { randomColor: action.payload.randomColor } : {}),
                ...(action.payload.initRandoms
                    ? { initRandoms: JSON.parse(JSON.stringify(action.payload.initRandoms)) }
                    : {}),
                ...(action.payload.p2DraftPoolIndices
                    ? {
                          p2DraftPoolIndices: JSON.parse(
                              JSON.stringify(action.payload.p2DraftPoolIndices)
                          ),
                      }
                    : {}),
            };
        case 'TAKE_GEMS':
            return {
                type: 'take_gems',
                actor,
                coords: JSON.parse(JSON.stringify(action.payload.coords)),
            };
        case 'REPLENISH':
            return action.payload?.randoms
                ? {
                      type: 'replenish',
                      actor,
                      randoms: JSON.parse(JSON.stringify(action.payload.randoms)),
                  }
                : {
                      type: 'replenish',
                      actor,
                  };
        case 'TAKE_BONUS_GEM':
            return {
                type: 'take_bonus_gem',
                actor,
                coord: JSON.parse(JSON.stringify(action.payload)),
            };
        case 'DISCARD_GEM':
            return {
                type: 'discard_gem',
                actor,
                gemId: action.payload as ReplayEvent extends { type: 'discard_gem'; gemId: infer T }
                    ? T
                    : never,
            };
        case 'STEAL_GEM':
            return {
                type: 'steal_gem',
                actor,
                gemId: action.payload.gemId,
            };
        case 'BUY_CARD':
            return {
                type: 'buy_card',
                actor,
                instanceId: resolveRuntimeCardIdToInstanceId(action.payload.card.id, runtimeToInstance),
                source: action.payload.source,
                ...(action.payload.marketInfo
                    ? { marketRef: JSON.parse(JSON.stringify(action.payload.marketInfo)) }
                    : {}),
                bonusColor: (action.payload.card.bonusColor ?? 'null') as ReplayBonusColor,
                ...(action.payload.randoms
                    ? { randoms: JSON.parse(JSON.stringify(action.payload.randoms)) }
                    : {}),
            };
        case 'RESERVE_CARD':
            return {
                type: 'reserve_card',
                actor,
                instanceId: resolveRuntimeCardIdToInstanceId(action.payload.card.id, runtimeToInstance),
                level: action.payload.level,
                marketRef:
                    action.payload.isExtra && action.payload.level === 3
                        ? {
                              level: 3,
                              idx: action.payload.idx,
                              isExtra: true,
                              extraIdx: action.payload.extraIdx ?? 0,
                          }
                        : {
                              level: action.payload.level,
                              idx: action.payload.idx,
                          },
                ...(action.payload.goldCoords
                    ? { goldCoord: JSON.parse(JSON.stringify(action.payload.goldCoords)) }
                    : {}),
                ...(action.payload.isExtra ? { isExtra: true } : {}),
                ...(action.payload.extraIdx !== undefined ? { extraIdx: action.payload.extraIdx } : {}),
                ...(action.payload.isSteal ? { isSteal: true } : {}),
            };
        case 'RESERVE_DECK':
            return {
                type: 'reserve_deck',
                actor,
                level: action.payload.level,
                ...(action.payload.goldCoords
                    ? { goldCoord: JSON.parse(JSON.stringify(action.payload.goldCoords)) }
                    : {}),
            };
        case 'DISCARD_RESERVED':
            return {
                type: 'discard_reserved',
                actor,
                instanceId: resolveRuntimeCardIdToInstanceId(action.payload.cardId, runtimeToInstance),
            };
        case 'USE_PRIVILEGE':
            return {
                type: 'use_privilege',
                actor,
                coord: JSON.parse(JSON.stringify(action.payload)),
            };
        case 'SELECT_ROYAL_CARD':
            return {
                type: 'select_royal',
                actor,
                royalId: action.payload.card.id,
            };
        default:
            return null;
    }
};

export const createReplayRecorderState = (
    gameVersion: string,
    createdAt?: string
): ReplayRecorderState => {
    const recorder = createBaseRecorder(gameVersion, createdAt);
    return {
        replayRevision: recorder.replayRevision,
        gameVersion: recorder.gameVersion,
        createdAt: recorder.createdAt,
        init: recorder.init,
        events: recorder.events,
        checkpoints: recorder.checkpoints,
    };
};

export const createReplayRecorderInternalState = createBaseRecorder;

export const seedReplayRecorderState = (
    recorder: ReplayRecorderInternalState,
    action: Extract<GameAction, { type: 'INIT' | 'INIT_DRAFT' }>,
    nextState: GameState
): ReplayRecorderInternalState => {
    const { init, runtimeToInstance } = buildReplayInitSnapshot(action, nextState);
    recorder.replayRevision = 0;
    recorder.createdAt = new Date().toISOString();
    recorder.init = init;
    recorder.events = [];
    recorder.checkpoints = [];
    recorder.runtimeToInstance = runtimeToInstance;
    return recorder;
};

export const recordReplayAction = (
    recorder: ReplayRecorderInternalState,
    previousState: GameState | null,
    action: GameAction,
    nextState: GameState | null
): ReplayRecorderInternalState => {
    if (!nextState) {
        return recorder;
    }

    if (action.type === 'INIT' || action.type === 'INIT_DRAFT') {
        return seedReplayRecorderState(recorder, action, nextState);
    }

    if (!previousState || !recorder.init) {
        return recorder;
    }

    const event = normalizeReplayEvent(previousState, action, recorder.runtimeToInstance);
    if (!event) {
        return recorder;
    }

    recorder.events = recorder.events.concat(event);
    recorder.replayRevision = recorder.events.length;

    if (shouldCreateCheckpoint(recorder.replayRevision, previousState, nextState)) {
        appendCheckpoint(recorder, recorder.replayRevision, nextState);
    }

    return recorder;
};

export const replaceReplayRecorderFromReplay = (
    replay: ReplayVNext,
    runtimeToInstance?: Map<string, ReplayCardInstanceId>
): ReplayRecorderInternalState => ({
    replayRevision: replay.replayRevision,
    gameVersion: replay.gameVersion,
    createdAt: replay.createdAt,
    init: JSON.parse(JSON.stringify(replay.init)),
    events: JSON.parse(JSON.stringify(replay.events)),
    checkpoints: JSON.parse(JSON.stringify(replay.checkpoints ?? [])),
    runtimeToInstance:
        runtimeToInstance ?? buildIdentityRuntimeToInstanceMap(replay.init.cardInstances),
});

export const buildReplayFullSync = (
    recorder: ReplayRecorderInternalState,
    currentState: GameState
): ReplayFullSync => ({
    kind: 'full',
    replayRevision: recorder.replayRevision,
    replay: saveReplayVNext({
        replayRevision: recorder.replayRevision,
        gameVersion: recorder.gameVersion,
        createdAt: recorder.createdAt,
        init: recorder.init!,
        events: recorder.events,
        checkpoints: recorder.checkpoints,
        currentState,
        runtimeToInstance: recorder.runtimeToInstance,
    }),
});

export const buildReplayDeltaSync = (
    recorder: ReplayRecorderInternalState,
    currentState: GameState,
    fromRevision: number
): ReplaySync => {
    if (!recorder.init || fromRevision < 0 || fromRevision > recorder.replayRevision) {
        return buildReplayFullSync(recorder, currentState);
    }

    if (fromRevision === recorder.replayRevision) {
        return {
            kind: 'delta',
            fromRevision,
            toRevision: recorder.replayRevision,
            events: [],
            stateHashAfter: generateReplayStateHash(currentState, recorder.runtimeToInstance),
        };
    }

    const checkpoint = recorder.checkpoints.find(
        (candidate) => candidate.revision > fromRevision && candidate.revision <= recorder.replayRevision
    );

    const delta: ReplayDeltaSync = {
        kind: 'delta',
        fromRevision,
        toRevision: recorder.replayRevision,
        events: recorder.events.slice(fromRevision),
        stateHashAfter: generateReplayStateHash(currentState, recorder.runtimeToInstance),
        ...(checkpoint ? { checkpoint: JSON.parse(JSON.stringify(checkpoint)) as ReplayCheckpoint } : {}),
    };

    return delta;
};

export const applyReplaySyncToRecorder = (
    recorder: ReplayRecorderInternalState,
    replaySync: ReplaySync
): ReplayRecorderInternalState => {
    if (replaySync.kind === 'full') {
        return replaceReplayRecorderFromReplay(replaySync.replay, recorder.runtimeToInstance);
    }

    if (!recorder.init || replaySync.fromRevision !== recorder.replayRevision) {
        throw new Error('Replay delta revision gap detected.');
    }

    recorder.events = recorder.events.concat(JSON.parse(JSON.stringify(replaySync.events)));
    recorder.replayRevision = replaySync.toRevision;
    if (replaySync.checkpoint) {
        recorder.checkpoints = recorder.checkpoints
            .filter((checkpoint) => checkpoint.revision !== replaySync.checkpoint?.revision)
            .concat(JSON.parse(JSON.stringify(replaySync.checkpoint)));
    }
    return recorder;
};

export const buildReplayRecorderFromHistory = (
    history: GameAction[],
    gameVersion: string,
    createdAt?: string
): ReplayRecorderInternalState => {
    const recorder = createBaseRecorder(gameVersion, createdAt);
    let state: GameState | null = INITIAL_STATE_SKELETON;

    for (const action of history) {
        const nextState = applyAction(state, action);
        if (!nextState) {
            continue;
        }

        if (action.type === 'INIT' || action.type === 'INIT_DRAFT') {
            seedReplayRecorderState(recorder, action, nextState);
        } else {
            recordReplayAction(recorder, state, action, nextState);
        }

        state = nextState;
    }

    return recorder;
};
