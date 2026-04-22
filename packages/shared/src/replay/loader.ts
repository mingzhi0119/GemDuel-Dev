import { applyAction } from '../logic/gameReducer';
import { INITIAL_STATE_SKELETON } from '../logic/initialState';
import type { GameAction, GameState } from '../types';
import { generateReplayStateHash } from './stateHash';
import {
    buildBootstrapActionFromReplayInit,
    buildIdentityRuntimeToInstanceMap,
    inflateReplayEventToGameAction,
    inflateReplayStateSnapshot,
} from './runtime';
import type { LoadedReplaySession, ReplayVNext } from './types';

const applyReplayAction = (state: GameState | null, action: GameAction): GameState => {
    const nextState = applyAction(state, action);
    if (!nextState) {
        throw new Error(`Replay action ${action.type} could not be applied safely.`);
    }
    return nextState;
};

export const buildReplaySyntheticHistory = (replay: ReplayVNext): GameAction[] => {
    const bootstrapAction = buildBootstrapActionFromReplayInit(replay.init);
    const history: GameAction[] = [bootstrapAction];
    let state = applyReplayAction(INITIAL_STATE_SKELETON, bootstrapAction);

    for (const event of replay.events) {
        const action = inflateReplayEventToGameAction(state, event, replay.init);
        history.push(action);
        state = applyReplayAction(state, action);
    }

    return history;
};

export const loadReplayStateAtRevision = (
    replay: ReplayVNext,
    revision: number = replay.replayRevision
): GameState => {
    const clampedRevision = Math.max(0, Math.min(revision, replay.events.length));
    const checkpoint = [...(replay.checkpoints ?? [])]
        .filter((candidate) => candidate.revision <= clampedRevision)
        .sort((left, right) => right.revision - left.revision)[0];

    let state: GameState;
    let startRevision = 0;

    if (checkpoint) {
        state = inflateReplayStateSnapshot(checkpoint.state, replay.init);
        startRevision = checkpoint.revision;
    } else {
        const bootstrapAction = buildBootstrapActionFromReplayInit(replay.init);
        state = applyReplayAction(INITIAL_STATE_SKELETON, bootstrapAction);
    }

    for (const event of replay.events.slice(startRevision, clampedRevision)) {
        const action = inflateReplayEventToGameAction(state, event, replay.init);
        state = applyReplayAction(state, action);
    }

    return state;
};

export const loadReplaySession = (replay: ReplayVNext): LoadedReplaySession => {
    const history = buildReplaySyntheticHistory(replay);
    const finalState = loadReplayStateAtRevision(replay, replay.replayRevision);
    const finalStateHash = generateReplayStateHash(
        finalState,
        buildIdentityRuntimeToInstanceMap(replay.init.cardInstances)
    );

    return {
        replay,
        history,
        finalState,
        finalStateHash,
    };
};
