import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { INITIAL_STATE_SKELETON } from '../../packages/shared/src/logic/initialState';
import { applyAction } from '../../packages/shared/src/logic/gameReducer';
import { getActionRejectionReason } from '../../packages/shared/src/logic/actionValidation/rules';
import {
    buildReplaySyntheticHistory,
    loadReplayStateAtRevision,
} from '../../packages/shared/src/replay/loader';
import {
    buildReplayFullSync,
    buildReplayRecorderFromHistory,
} from '../../packages/shared/src/replay/recorder';
import { buildIdentityRuntimeToInstanceMap } from '../../packages/shared/src/replay/runtime';
import { simulateAiVsAiReplay } from '../../packages/shared/src/replay/simulation';
import { generateReplayStateHash } from '../../packages/shared/src/replay/stateHash';
import type { ReplayVNext } from '../../packages/shared/src/replay/types';
import type { GameAction, GameState, GemCoord, PlayerKey } from '../../packages/shared/src/types';

const DEFAULT_SEED = 'local-pvp-full-migration-2026-05-13';
const DEFAULT_GAME_VERSION = '5.2.11';
const DEFAULT_MAX_ACTIONS = 500;

type HarnessAction =
    | 'start_local_game'
    | 'click_board_cell'
    | 'confirm_gem_selection'
    | 'click_market_card'
    | 'click_player_reserved'
    | 'confirm_preview_action'
    | 'select_joker_color'
    | 'take_bonus_gem'
    | 'preselect_reserve_gold'
    | 'resolve_pending_reserve_gold'
    | 'discard_gem'
    | 'steal_gem'
    | 'end_turn'
    | 'choose_royal'
    | 'activate_privilege'
    | 'use_privilege';

interface UiStep {
    id: string;
    logicalActionIndex: number;
    actionType: GameAction['type'];
    stepIndex: number;
    action: HarnessAction;
    payload: Record<string, unknown>;
    semanticKey: string;
    intent: string;
    commitsReplayEvent: boolean;
    expectedReplayRevisionAfter: number;
    expectedPhaseAfter: string;
    expectedTurnAfter: PlayerKey;
    expectedWinnerAfter: PlayerKey | null;
    expectedStateHashAfter: string;
}

interface LogicalActionTrace {
    index: number;
    action: GameAction;
    actorBefore: PlayerKey;
    phaseBefore: string;
    phaseAfter: string;
    turnAfter: PlayerKey;
    winnerAfter: PlayerKey | null;
    stateHashBefore: string;
    stateHashAfter: string;
}

interface LocalPvpFullGamePlan {
    schemaVersion: 1;
    kind: 'local-pvp-full-game-migration-plan';
    generatedAt: string;
    scope: {
        included: ['Local PVP'];
        exempt: string[];
    };
    oracle: {
        source:
            | 'TypeScript shared simulation'
            | 'TypeScript shared simulation expanded to Electron Local PVP UI flow';
        seed: string;
        gameVersion: string;
        maxActions: number;
        status: string;
        abortReason: string | null;
        replayRevision: number;
        finalStateHash: string;
        winner: PlayerKey | null;
        eventsByType: Record<string, number>;
    };
    replay: unknown;
    logicalActions: LogicalActionTrace[];
    uiSteps: UiStep[];
    coverageTargets: {
        entrypoints: string[];
        actionFamilies: string[];
        phaseEdges: string[];
    };
}

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const isObject = (value: unknown): value is Record<string, unknown> =>
    Boolean(value) && typeof value === 'object';

const normalizeCoord = (coord: unknown): GemCoord => {
    if (!isObject(coord)) {
        throw new Error('Expected a gem coordinate payload.');
    }

    return { r: Number(coord.r), c: Number(coord.c) };
};

const marketInfoFromAction = (action: GameAction): { level: number; index: number } => {
    const payload = isObject(action.payload) ? action.payload : {};
    const marketInfo = isObject(payload.marketInfo) ? payload.marketInfo : payload;
    return {
        level: Number(marketInfo.level),
        index: Number(marketInfo.idx ?? marketInfo.index),
    };
};

const getCurrentReservedIndex = (
    state: GameState,
    player: PlayerKey,
    action: Extract<GameAction, { type: 'BUY_CARD' | 'INITIATE_BUY_JOKER' }>
) => {
    const cardId = action.payload.card.id;
    return state.playerReserved[player].findIndex(
        (card) => isObject(card) && 'id' in card && card.id === cardId
    );
};

const getRoyalIndex = (
    state: GameState,
    action: Extract<GameAction, { type: 'SELECT_ROYAL_CARD' }>
) => {
    const royalId = action.payload.card.id;
    const index = state.royalDeck.findIndex((card) => card.id === royalId);
    if (index < 0) {
        throw new Error(`Royal ${royalId} was not visible before selection.`);
    }

    return index;
};

const appendStep = (
    steps: UiStep[],
    trace: LogicalActionTrace,
    step: Omit<
        UiStep,
        | 'id'
        | 'logicalActionIndex'
        | 'actionType'
        | 'stepIndex'
        | 'expectedPhaseAfter'
        | 'expectedTurnAfter'
        | 'expectedWinnerAfter'
        | 'expectedStateHashAfter'
    >
) => {
    const stepIndex = steps.filter(
        (candidate) => candidate.logicalActionIndex === trace.index
    ).length;
    steps.push({
        id: `a${String(trace.index).padStart(3, '0')}.s${stepIndex}`,
        logicalActionIndex: trace.index,
        actionType: trace.action.type,
        stepIndex,
        ...step,
        expectedPhaseAfter: trace.phaseAfter,
        expectedTurnAfter: trace.turnAfter,
        expectedWinnerAfter: trace.winnerAfter,
        expectedStateHashAfter: trace.stateHashAfter,
    });
};

const appendMarketCardPreviewSteps = (
    steps: UiStep[],
    trace: LogicalActionTrace,
    level: number,
    index: number,
    actionId: 'buy' | 'reserve'
) => {
    appendStep(steps, trace, {
        action: 'click_market_card',
        payload: { level, index },
        semanticKey: `market.card.${level}.${index}`,
        intent: `Open market card ${level}-${index} preview.`,
        commitsReplayEvent: false,
        expectedReplayRevisionAfter: trace.index - 1,
    });
    appendStep(steps, trace, {
        action: 'confirm_preview_action',
        payload: { actionId },
        semanticKey:
            actionId === 'buy' ? 'card.preview.primaryAction' : 'card.preview.action.reserve',
        intent: `Confirm preview ${actionId}.`,
        commitsReplayEvent: true,
        expectedReplayRevisionAfter: trace.index,
    });
};

const appendBuyOrInitiateBuySteps = (
    steps: UiStep[],
    trace: LogicalActionTrace,
    stateBefore: GameState,
    action: Extract<GameAction, { type: 'BUY_CARD' | 'INITIATE_BUY_JOKER' }>
) => {
    if (action.type === 'BUY_CARD' && stateBefore.phase === 'SELECT_CARD_COLOR') {
        const color =
            action.payload.card.bonusColor === 'gold' ? 'red' : action.payload.card.bonusColor;
        appendStep(steps, trace, {
            action: 'select_joker_color',
            payload: { color },
            semanticKey: `card.color.${color}`,
            intent: `Select joker color ${color}.`,
            commitsReplayEvent: true,
            expectedReplayRevisionAfter: trace.index,
        });
        return;
    }

    if (action.payload.source === 'reserved') {
        const index = getCurrentReservedIndex(stateBefore, trace.actorBefore, action);
        if (index < 0) {
            throw new Error(`Reserved card ${action.payload.card.id} was not visible before buy.`);
        }

        appendStep(steps, trace, {
            action: 'click_player_reserved',
            payload: { player: trace.actorBefore, index },
            semanticKey: `player.reserved.${index}`,
            intent: `Open reserved card ${index} preview.`,
            commitsReplayEvent: false,
            expectedReplayRevisionAfter: trace.index - 1,
        });
        appendStep(steps, trace, {
            action: 'confirm_preview_action',
            payload: { actionId: 'buy' },
            semanticKey: 'card.preview.primaryAction',
            intent: 'Confirm reserved-card preview buy.',
            commitsReplayEvent: true,
            expectedReplayRevisionAfter: trace.index,
        });
        return;
    }

    const { level, index } = marketInfoFromAction(action);
    appendMarketCardPreviewSteps(steps, trace, level, index, 'buy');
};

const appendUiStepsForAction = (
    steps: UiStep[],
    trace: LogicalActionTrace,
    stateBefore: GameState
) => {
    const action = trace.action;
    switch (action.type) {
        case 'INIT':
            appendStep(steps, trace, {
                action: 'start_local_game',
                payload: {
                    seed: String(action.payload.seed ?? DEFAULT_SEED),
                    useBuffs: Boolean(action.payload.useBuffs),
                },
                semanticKey: 'mode.local',
                intent: 'Fresh-launch Classic Local PVP.',
                commitsReplayEvent: false,
                expectedReplayRevisionAfter: 0,
            });
            return;
        case 'TAKE_GEMS':
            action.payload.coords.forEach((coord, index) => {
                appendStep(steps, trace, {
                    action: 'click_board_cell',
                    payload: { row: coord.r, column: coord.c },
                    semanticKey: `board.cell.${coord.r}.${coord.c}`,
                    intent: `Select gem ${index + 1} for TAKE_GEMS.`,
                    commitsReplayEvent: false,
                    expectedReplayRevisionAfter: trace.index - 1,
                });
            });
            appendStep(steps, trace, {
                action: 'confirm_gem_selection',
                payload: {},
                semanticKey: 'board.selection.confirm',
                intent: 'Confirm TAKE_GEMS selection.',
                commitsReplayEvent: true,
                expectedReplayRevisionAfter: trace.index,
            });
            return;
        case 'REPLENISH':
            appendStep(steps, trace, {
                action: 'end_turn',
                payload: {},
                semanticKey: 'turn.end',
                intent: 'Click visible Replenish/end-turn control.',
                commitsReplayEvent: true,
                expectedReplayRevisionAfter: trace.index,
            });
            return;
        case 'TAKE_BONUS_GEM': {
            const coord = normalizeCoord(action.payload);
            appendStep(steps, trace, {
                action: 'take_bonus_gem',
                payload: { row: coord.r, column: coord.c },
                semanticKey: `board.cell.${coord.r}.${coord.c}`,
                intent: 'Take required bonus gem from board.',
                commitsReplayEvent: true,
                expectedReplayRevisionAfter: trace.index,
            });
            return;
        }
        case 'DISCARD_GEM':
            appendStep(steps, trace, {
                action: 'discard_gem',
                payload: { player: trace.actorBefore, gemId: action.payload },
                semanticKey: `player.current.gem.${action.payload}`,
                intent: `Discard excess ${action.payload}.`,
                commitsReplayEvent: true,
                expectedReplayRevisionAfter: trace.index,
            });
            return;
        case 'STEAL_GEM':
            appendStep(steps, trace, {
                action: 'steal_gem',
                payload: { gemId: action.payload.gemId },
                semanticKey: `player.opponent.gem.${action.payload.gemId}`,
                intent: `Steal ${action.payload.gemId} from opponent.`,
                commitsReplayEvent: true,
                expectedReplayRevisionAfter: trace.index,
            });
            return;
        case 'INITIATE_BUY_JOKER':
        case 'BUY_CARD':
            appendBuyOrInitiateBuySteps(steps, trace, stateBefore, action);
            return;
        case 'INITIATE_RESERVE':
            appendMarketCardPreviewSteps(
                steps,
                trace,
                Number(action.payload.level),
                Number(action.payload.idx),
                'reserve'
            );
            return;
        case 'RESERVE_CARD': {
            const goldCoords = isObject(action.payload.goldCoords)
                ? normalizeCoord(action.payload.goldCoords)
                : null;
            if (stateBefore.phase === 'RESERVE_WAITING_GEM' && goldCoords) {
                appendStep(steps, trace, {
                    action: 'resolve_pending_reserve_gold',
                    payload: { row: goldCoords.r, column: goldCoords.c },
                    semanticKey: `board.cell.${goldCoords.r}.${goldCoords.c}`,
                    intent: 'Click highlighted Gold to complete pending reserve.',
                    commitsReplayEvent: true,
                    expectedReplayRevisionAfter: trace.index,
                });
                return;
            }

            appendMarketCardPreviewSteps(
                steps,
                trace,
                Number(action.payload.level),
                Number(action.payload.idx),
                'reserve'
            );
            return;
        }
        case 'ACTIVATE_PRIVILEGE':
            appendStep(steps, trace, {
                action: 'activate_privilege',
                payload: {},
                semanticKey: 'player.current.privilege',
                intent: 'Click current-player privilege scroll.',
                commitsReplayEvent: true,
                expectedReplayRevisionAfter: trace.index,
            });
            return;
        case 'USE_PRIVILEGE': {
            const coord = normalizeCoord(action.payload);
            appendStep(steps, trace, {
                action: 'use_privilege',
                payload: { row: coord.r, column: coord.c },
                semanticKey: `board.cell.${coord.r}.${coord.c}`,
                intent: 'Use privilege to take one board gem.',
                commitsReplayEvent: true,
                expectedReplayRevisionAfter: trace.index,
            });
            return;
        }
        case 'SELECT_ROYAL_CARD': {
            const index = getRoyalIndex(stateBefore, action);
            appendStep(steps, trace, {
                action: 'choose_royal',
                payload: { index, royalId: action.payload.card.id },
                semanticKey: `royal.card.${index}`,
                intent: `Choose royal ${action.payload.card.id}.`,
                commitsReplayEvent: true,
                expectedReplayRevisionAfter: trace.index,
            });
            return;
        }
        default:
            throw new Error(`No Local PVP UI mapping for action ${action.type}.`);
    }
};

const buildElectronUiActionHistory = (
    replay: ReplayVNext,
    gameVersion: string,
    createdAt: string
) => {
    const sourceHistory = buildReplaySyntheticHistory(replay);
    const history: GameAction[] = [];
    let state: GameState | null = null;

    for (let index = 0; index < sourceHistory.length; index += 1) {
        const sourceAction = sourceHistory[index];
        const sourceEvent = index > 0 ? replay.events[index - 1] : undefined;
        const action = clone(sourceAction);
        if (index === 0 && action.type === 'INIT') {
            action.payload = {
                ...action.payload,
                seed: createdAt,
            };
        }
        const replayGoldCoord =
            isObject(sourceEvent) && isObject(sourceEvent.goldCoord) ? sourceEvent.goldCoord : null;
        const reserveGoldCoords =
            action.type === 'RESERVE_CARD' && isObject(action.payload.goldCoords)
                ? action.payload.goldCoords
                : replayGoldCoord;
        if (state && !state.pendingReserve && action.type === 'RESERVE_CARD' && reserveGoldCoords) {
            const reserveAction: Extract<GameAction, { type: 'RESERVE_CARD' }> = {
                ...action,
                payload: {
                    ...action.payload,
                    goldCoords: clone(reserveGoldCoords),
                },
            };
            const initiateAction: Extract<GameAction, { type: 'INITIATE_RESERVE' }> = {
                type: 'INITIATE_RESERVE',
                payload: {
                    card: reserveAction.payload.card,
                    level: reserveAction.payload.level,
                    idx: reserveAction.payload.idx,
                    ...(reserveAction.payload.isExtra
                        ? { isExtra: reserveAction.payload.isExtra }
                        : {}),
                    ...(reserveAction.payload.extraIdx !== undefined
                        ? { extraIdx: reserveAction.payload.extraIdx }
                        : {}),
                },
            };
            history.push(initiateAction);
            state = applyAction(state, initiateAction);
            history.push(reserveAction);
            state = applyAction(state, reserveAction);
            continue;
        }

        history.push(action);
        state = applyAction(state, action);
    }

    if (!state) {
        throw new Error('Electron UI action history did not produce a final state.');
    }

    const recorder = buildReplayRecorderFromHistory(history, gameVersion, createdAt);
    return buildReplayFullSync(recorder, state).replay;
};

const buildTraces = (replay: ReplayVNext) => {
    const history = buildReplaySyntheticHistory(replay);
    const startAction = history[0];
    if (startAction?.type !== 'INIT' && startAction?.type !== 'INIT_DRAFT') {
        throw new Error('Local PVP full-game plan requires an INIT bootstrap action.');
    }

    const runtimeToInstance = buildIdentityRuntimeToInstanceMap(replay.init.cardInstances);
    const traces: LogicalActionTrace[] = [];
    const stateBeforeByIndex: GameState[] = [];

    history.forEach((action, index) => {
        const before =
            index === 0
                ? clone(INITIAL_STATE_SKELETON)
                : loadReplayStateAtRevision(replay, index - 1);
        const next = loadReplayStateAtRevision(replay, index);
        stateBeforeByIndex.push(clone(before));
        traces.push({
            index,
            action: clone(action),
            actorBefore: before.turn,
            phaseBefore: before.phase,
            phaseAfter: next.phase,
            turnAfter: next.turn,
            winnerAfter: next.winner,
            stateHashBefore: generateReplayStateHash(before, runtimeToInstance),
            stateHashAfter: generateReplayStateHash(next, runtimeToInstance),
        });
    });

    return { traces, stateBeforeByIndex };
};

const summarizeCoverage = (traces: LogicalActionTrace[]) => {
    const actionFamilies = Array.from(new Set(traces.map((trace) => trace.action.type))).sort();
    const phaseEdges = Array.from(
        new Set(traces.map((trace) => `${trace.phaseBefore} -> ${trace.phaseAfter}`))
    ).sort();
    return {
        entrypoints: ['Classic Local PVP'],
        actionFamilies,
        phaseEdges,
    };
};

const assertElectronLegalTrace = (
    traces: LogicalActionTrace[],
    stateBeforeByIndex: GameState[]
) => {
    traces.forEach((trace) => {
        if (trace.action.type === 'INIT' || trace.action.type === 'INIT_DRAFT') {
            return;
        }

        const rejection = getActionRejectionReason(stateBeforeByIndex[trace.index], trace.action);
        if (rejection) {
            throw new Error(
                `Plan action ${trace.index} ${trace.action.type} is not UI-legal under Electron command gate: ${rejection}`
            );
        }
    });
};

export const buildLocalPvpFullGamePlan = ({
    seed = DEFAULT_SEED,
    gameVersion = DEFAULT_GAME_VERSION,
    maxActions = DEFAULT_MAX_ACTIONS,
}: {
    seed?: string;
    gameVersion?: string;
    maxActions?: number;
} = {}): LocalPvpFullGamePlan => {
    const simulation = simulateAiVsAiReplay({
        gameVersion,
        useBuffs: false,
        mode: 'LOCAL_PVP',
        maxActions,
        createdAt: seed,
        hostPlayer: 'p1',
    });
    if (simulation.status !== 'completed' || simulation.abortReason) {
        throw new Error(
            `Local PVP oracle simulation did not complete: ${simulation.abortReason ?? simulation.status}.`
        );
    }

    const electronUiReplay = buildElectronUiActionHistory(simulation.replay, gameVersion, seed);
    const { traces, stateBeforeByIndex } = buildTraces(electronUiReplay);
    assertElectronLegalTrace(traces, stateBeforeByIndex);
    const uiSteps: UiStep[] = [];
    traces.forEach((trace) => {
        appendUiStepsForAction(uiSteps, trace, stateBeforeByIndex[trace.index]);
    });
    if (uiSteps[0]?.action === 'start_local_game') {
        uiSteps[0].payload = {
            ...uiSteps[0].payload,
            seed,
        };
    }

    return {
        schemaVersion: 1,
        kind: 'local-pvp-full-game-migration-plan',
        generatedAt: new Date().toISOString(),
        scope: {
            included: ['Local PVP'],
            exempt: [
                'Roguelike Local PVP',
                'Replay Import/Review',
                'Settings matrix',
                'Recovery matrix',
                'LAN',
                'Online',
                'Visual Lab',
            ],
        },
        oracle: {
            source: 'TypeScript shared simulation expanded to Electron Local PVP UI flow',
            seed,
            gameVersion,
            maxActions,
            status: simulation.status,
            abortReason: simulation.abortReason,
            replayRevision: electronUiReplay.replayRevision,
            finalStateHash: electronUiReplay.summary.finalStateHash,
            winner: electronUiReplay.summary.winner,
            eventsByType: electronUiReplay.summary.eventsByType,
        },
        replay: electronUiReplay,
        logicalActions: traces,
        uiSteps,
        coverageTargets: summarizeCoverage(traces),
    };
};

const parseArgs = () => {
    const values = new Map<string, string>();
    const args = process.argv.slice(2);
    for (let index = 0; index < args.length; index += 1) {
        const arg = args[index];
        if (!arg.startsWith('--')) {
            continue;
        }

        const next = args[index + 1];
        if (next && !next.startsWith('--')) {
            values.set(arg, next);
            index += 1;
        } else {
            values.set(arg, 'true');
        }
    }

    return {
        seed: values.get('--seed') ?? DEFAULT_SEED,
        gameVersion: values.get('--game-version') ?? DEFAULT_GAME_VERSION,
        maxActions: Number(values.get('--max-actions') ?? DEFAULT_MAX_ACTIONS),
        out: values.get('--out'),
    };
};

const isDirectRun = () =>
    process.argv.some((arg) => arg.replace(/\\/g, '/').endsWith('local-pvp-full-game-plan.ts'));

if (isDirectRun()) {
    const options = parseArgs();
    const plan = buildLocalPvpFullGamePlan(options);
    const text = `${JSON.stringify(plan, null, 4)}\n`;
    if (options.out) {
        mkdirSync(path.dirname(path.resolve(options.out)), { recursive: true });
        writeFileSync(options.out, text, 'utf8');
    } else {
        process.stdout.write(text);
    }
}
