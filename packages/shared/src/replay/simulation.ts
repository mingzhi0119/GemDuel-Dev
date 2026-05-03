import { computeAiAction } from '../logic/ai/aiPlayer';
import { getActionRejectionReason } from '../logic/actionValidation/rules';
import { canActionRunInPhase } from '../logic/fsm';
import { applyAction } from '../logic/gameReducer';
import { buildStartGameAction } from '../logic/gameSetup';
import { INITIAL_STATE_SKELETON } from '../logic/initialState';
import { buildSelectBuffAction } from '../logic/interactionCommands';
import { getCrownCount, getPlayerScore } from '../logic/selectors';
import type { GameAction, GameState, GemCoord, GemColor, PlayerKey } from '../types';
import { evaluateReplayPerformance } from './evaluation';
import {
    createReplayRecorderInternalState,
    recordReplayAction,
    seedReplayRecorderState,
} from './recorder';
import { createReplayCheckpoint } from './runtime';
import { saveReplayVNext } from './writer';
import type {
    LoadedReplaySession,
    ReplaySimulationAbortReason,
    ReplaySimulationOptions,
    ReplaySimulationResult,
} from './types';

const DEFAULT_MAX_ACTIONS = 1_200;
const DEFAULT_RANDOMS = {
    expansionColor: 'red' as GemColor,
    extortionColor: 'blue' as GemColor,
    bountyHunterColor: 'red' as GemColor,
};

const BASIC_DISCARD_ORDER = ['red', 'green', 'blue', 'white', 'black', 'pearl', 'gold'] as const;

const getOpponent = (player: PlayerKey): PlayerKey => (player === 'p1' ? 'p2' : 'p1');

const resolveWinnerOnMaxActions = (state: GameState): PlayerKey => {
    const p1Score = getPlayerScore(state, 'p1');
    const p2Score = getPlayerScore(state, 'p2');
    if (p1Score !== p2Score) {
        return p1Score > p2Score ? 'p1' : 'p2';
    }

    const p1Crowns = getCrownCount(state, 'p1');
    const p2Crowns = getCrownCount(state, 'p2');
    if (p1Crowns !== p2Crowns) {
        return p1Crowns > p2Crowns ? 'p1' : 'p2';
    }

    return 'p1';
};

const findBoardCoord = (
    state: GameState,
    predicate: (gemId: string) => boolean
): { r: number; c: number } | null => {
    for (let r = 0; r < state.board.length; r += 1) {
        for (let c = 0; c < state.board[r].length; c += 1) {
            if (predicate(state.board[r][c].type.id)) {
                return { r, c };
            }
        }
    }

    return null;
};

const findCandidateGemLines = (state: GameState): GemCoord[][] => {
    const lines: GemCoord[][] = [];
    const directions = [
        [0, 1],
        [1, 0],
        [1, 1],
        [1, -1],
    ] as const;

    for (let r = 0; r < 5; r += 1) {
        for (let c = 0; c < 5; c += 1) {
            if (state.board[r][c].type.id === 'empty' || state.board[r][c].type.id === 'gold') {
                continue;
            }

            for (const [dr, dc] of directions) {
                for (let length = 3; length >= 1; length -= 1) {
                    const line: GemCoord[] = [];
                    let valid = true;

                    for (let step = 0; step < length; step += 1) {
                        const nr = r + dr * step;
                        const nc = c + dc * step;
                        if (nr < 0 || nr >= 5 || nc < 0 || nc >= 5) {
                            valid = false;
                            break;
                        }

                        const gemId = state.board[nr][nc].type.id;
                        if (gemId === 'empty' || gemId === 'gold') {
                            valid = false;
                            break;
                        }

                        line.push({ r: nr, c: nc });
                    }

                    if (valid) {
                        lines.push(line);
                    }
                }
            }
        }
    }

    return lines;
};

const buildFallbackCandidates = (state: GameState): GameAction[] => {
    const actor = state.turn;
    const opponent = getOpponent(actor);
    const candidates: GameAction[] = [];
    const goldCoord = findBoardCoord(state, (gemId) => gemId === 'gold');

    if (state.phase === 'DRAFT_PHASE') {
        const pool = actor === 'p2' ? (state.p2DraftPool ?? state.draftPool) : state.draftPool;
        if (pool.length > 0) {
            candidates.push({
                type: 'SELECT_BUFF',
                payload: { buffId: pool[0], randomColor: 'red' },
            });
        }
        return candidates;
    }

    if (state.phase === 'SELECT_ROYAL') {
        const royal = [...state.royalDeck].sort((left, right) => right.points - left.points)[0];
        if (royal) {
            candidates.push({
                type: 'SELECT_ROYAL_CARD',
                payload: { card: royal },
            });
        }
        return candidates;
    }

    if (state.pendingBuy && canActionRunInPhase('BUY_CARD', state.phase)) {
        candidates.push({
            type: 'BUY_CARD',
            payload: {
                card: {
                    ...state.pendingBuy.card,
                    bonusColor:
                        state.pendingBuy.card.bonusColor === 'gold'
                            ? 'red'
                            : state.pendingBuy.card.bonusColor,
                },
                source: state.pendingBuy.source,
                ...(state.pendingBuy.marketInfo ? { marketInfo: state.pendingBuy.marketInfo } : {}),
                randoms: { bountyHunterColor: DEFAULT_RANDOMS.bountyHunterColor },
            },
        });
        return candidates;
    }

    if (canActionRunInPhase('DISCARD_GEM', state.phase)) {
        for (const gemId of BASIC_DISCARD_ORDER) {
            if (state.inventories[actor][gemId] > 0) {
                candidates.push({ type: 'DISCARD_GEM', payload: gemId });
            }
        }
    }

    if (canActionRunInPhase('STEAL_GEM', state.phase)) {
        for (const gemId of BASIC_DISCARD_ORDER.filter((gemId) => gemId !== 'gold')) {
            if (state.inventories[opponent][gemId] > 0) {
                candidates.push({ type: 'STEAL_GEM', payload: { gemId } });
            }
        }
    }

    if (state.bonusGemTarget?.id && canActionRunInPhase('TAKE_BONUS_GEM', state.phase)) {
        for (let r = 0; r < state.board.length; r += 1) {
            for (let c = 0; c < state.board[r].length; c += 1) {
                if (state.board[r][c].type.id === state.bonusGemTarget.id) {
                    candidates.push({ type: 'TAKE_BONUS_GEM', payload: { r, c } });
                }
            }
        }
    }

    if (state.privileges[actor] > 0 && canActionRunInPhase('USE_PRIVILEGE', state.phase)) {
        for (let r = 0; r < state.board.length; r += 1) {
            for (let c = 0; c < state.board[r].length; c += 1) {
                if (state.board[r][c].type.id !== 'empty') {
                    candidates.push({ type: 'USE_PRIVILEGE', payload: { r, c } });
                }
            }
        }
    }

    if (canActionRunInPhase('TAKE_GEMS', state.phase)) {
        for (const line of findCandidateGemLines(state)) {
            candidates.push({ type: 'TAKE_GEMS', payload: { coords: line } });
        }
    }

    for (const level of [3, 2, 1] as const) {
        for (let idx = 0; idx < state.market[level].length; idx += 1) {
            const card = state.market[level][idx];
            if (!card) {
                continue;
            }

            if (card.bonusColor === 'gold') {
                if (canActionRunInPhase('BUY_CARD', state.phase)) {
                    candidates.push({
                        type: 'BUY_CARD',
                        payload: {
                            card: { ...card, bonusColor: DEFAULT_RANDOMS.bountyHunterColor },
                            source: 'market',
                            marketInfo: { level, idx },
                            randoms: { bountyHunterColor: DEFAULT_RANDOMS.bountyHunterColor },
                        },
                    });
                }
            } else if (canActionRunInPhase('BUY_CARD', state.phase)) {
                candidates.push({
                    type: 'BUY_CARD',
                    payload: {
                        card,
                        source: 'market',
                        marketInfo: { level, idx },
                        randoms: { bountyHunterColor: DEFAULT_RANDOMS.bountyHunterColor },
                    },
                });
            }

            if (canActionRunInPhase('RESERVE_CARD', state.phase)) {
                candidates.push({
                    type: 'RESERVE_CARD',
                    payload: {
                        card,
                        level,
                        idx,
                        ...(goldCoord ? { goldCoords: goldCoord } : {}),
                    },
                });
            }
        }
    }

    for (const card of state.playerReserved[actor]) {
        if (card.bonusColor === 'gold') {
            if (canActionRunInPhase('BUY_CARD', state.phase)) {
                candidates.push({
                    type: 'BUY_CARD',
                    payload: {
                        card: { ...card, bonusColor: DEFAULT_RANDOMS.bountyHunterColor },
                        source: 'reserved',
                        randoms: { bountyHunterColor: DEFAULT_RANDOMS.bountyHunterColor },
                    },
                });
            }
        } else if (canActionRunInPhase('BUY_CARD', state.phase)) {
            candidates.push({
                type: 'BUY_CARD',
                payload: {
                    card,
                    source: 'reserved',
                    randoms: { bountyHunterColor: DEFAULT_RANDOMS.bountyHunterColor },
                },
            });
        }
    }

    if (canActionRunInPhase('RESERVE_DECK', state.phase)) {
        for (const level of [3, 2, 1] as const) {
            if (state.decks[level].length > 0) {
                candidates.push({
                    type: 'RESERVE_DECK',
                    payload: {
                        level,
                        ...(goldCoord ? { goldCoords: goldCoord } : {}),
                    },
                });
            }
        }
    }

    if (state.bag.length > 0 && canActionRunInPhase('REPLENISH', state.phase)) {
        candidates.push({
            type: 'REPLENISH',
            payload: {
                randoms: {
                    expansionColor: DEFAULT_RANDOMS.expansionColor,
                    extortionColor: DEFAULT_RANDOMS.extortionColor,
                },
            },
        });
    }

    return candidates;
};

const computeFallbackAiAction = (state: GameState): GameAction | null => {
    for (const candidate of buildFallbackCandidates(state)) {
        if (getActionRejectionReason(state, candidate)) {
            continue;
        }
        const nextState = applyAction(state, candidate);
        if (nextState && nextState !== state) {
            return candidate;
        }
    }

    return null;
};

const stabilizeAiAction = (state: GameState, action: GameAction): GameAction => {
    if (action.type !== 'SELECT_BUFF') {
        if (action.type === 'INITIATE_BUY_JOKER') {
            return {
                type: 'BUY_CARD',
                payload: {
                    card: {
                        ...action.payload.card,
                        bonusColor: DEFAULT_RANDOMS.bountyHunterColor,
                    },
                    source: action.payload.source,
                    ...(action.payload.marketInfo ? { marketInfo: action.payload.marketInfo } : {}),
                    randoms: { bountyHunterColor: DEFAULT_RANDOMS.bountyHunterColor },
                },
            };
        }
        return action;
    }

    const availablePool = state.turn === 'p1' ? state.draftPool : (state.p2DraftPool ?? []);
    const selectedBuffId = availablePool.includes(action.payload.buffId)
        ? action.payload.buffId
        : (availablePool[0] ?? action.payload.buffId);

    return buildSelectBuffAction(
        selectedBuffId,
        action.payload.randomColor ?? 'red',
        state.turn,
        state.phase,
        state.buffLevel
    );
};

const finalizeSimulationReplay = (
    state: GameState,
    history: GameAction[],
    recorder: ReturnType<typeof createReplayRecorderInternalState>,
    abortReason: ReplaySimulationAbortReason | null
): ReplaySimulationResult => {
    if (!recorder.init) {
        throw new Error('AI simulation did not produce a replay bootstrap snapshot.');
    }
    const checkpoints = recorder.checkpoints
        .filter((checkpoint) => checkpoint.revision !== recorder.replayRevision)
        .concat(createReplayCheckpoint(recorder.replayRevision, state, recorder.runtimeToInstance))
        .sort((left, right) => left.revision - right.revision);

    const replay = saveReplayVNext({
        replayRevision: recorder.replayRevision,
        gameVersion: recorder.gameVersion,
        createdAt: recorder.createdAt,
        init: recorder.init,
        events: recorder.events,
        checkpoints,
        currentState: state,
        runtimeToInstance: recorder.runtimeToInstance,
        ...(abortReason ? { endReason: 'aborted' } : {}),
    });

    const session: LoadedReplaySession = {
        replay,
        history,
        finalState: state,
        finalStateHash: replay.summary.finalStateHash,
    };

    return {
        replay,
        summary: replay.summary,
        evaluation: evaluateReplayPerformance(session),
        finalState: state,
        finalStateHash: session.finalStateHash,
        history,
        status: abortReason ? 'aborted' : 'completed',
        abortReason,
        actionsExecuted: replay.replayRevision,
    };
};

export const simulateAiVsAiReplay = (options: ReplaySimulationOptions): ReplaySimulationResult => {
    const {
        gameVersion,
        useBuffs = false,
        mode = 'LOCAL_PVP',
        maxActions = DEFAULT_MAX_ACTIONS,
        createdAt = new Date().toISOString(),
        hostPlayer = 'p1',
    } = options;

    if (maxActions <= 0) {
        throw new Error('AI simulation maxActions must be greater than 0.');
    }

    const startAction = buildStartGameAction(mode, {
        useBuffs,
        isHost: true,
        hostPlayer,
        seed: createdAt,
    });
    const initialState = applyAction(INITIAL_STATE_SKELETON, startAction);
    if (!initialState) {
        throw new Error('AI simulation failed to initialize the opening game state.');
    }

    const recorder = seedReplayRecorderState(
        createReplayRecorderInternalState(gameVersion, createdAt),
        startAction,
        initialState
    );
    const history: GameAction[] = [startAction];
    let state = initialState;
    let abortReason: ReplaySimulationAbortReason | null = null;

    for (let actionCount = 0; actionCount < maxActions; actionCount += 1) {
        if (state.winner) {
            break;
        }

        const heuristicAction = computeAiAction(state);
        const preferredAction = heuristicAction ? stabilizeAiAction(state, heuristicAction) : null;
        let action = preferredAction;
        let nextState =
            action && !getActionRejectionReason(state, action) ? applyAction(state, action) : null;

        if (!nextState || nextState === state) {
            action = computeFallbackAiAction(state);
            nextState = action ? applyAction(state, action) : null;
        }

        if (!action || !nextState || nextState === state) {
            abortReason = 'no_action';
            break;
        }

        history.push(action);
        recordReplayAction(recorder, state, action, nextState);
        state = nextState;
    }

    if (!state.winner && !abortReason) {
        state = {
            ...state,
            winner: resolveWinnerOnMaxActions(state),
        };
    }

    return finalizeSimulationReplay(state, history, recorder, abortReason);
};

export const simulateAiVsAiReplayBatch = (
    count: number,
    options: ReplaySimulationOptions
): ReplaySimulationResult[] => {
    if (!Number.isInteger(count) || count <= 0) {
        throw new Error('AI simulation batch count must be a positive integer.');
    }

    return Array.from({ length: count }, (_, index) =>
        simulateAiVsAiReplay({
            ...options,
            createdAt: options.createdAt ?? new Date(Date.now() + index * 1_000).toISOString(),
        })
    );
};
