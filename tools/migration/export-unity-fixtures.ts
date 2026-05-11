import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { parseArgs } from 'node:util';
import { fileURLToPath } from 'node:url';

import { format as formatWithPrettier } from 'prettier';

import { GEM_TYPES } from '../../packages/shared/src/constants';
import { getActionRejectionReason } from '../../packages/shared/src/logic/actionValidation/rules';
import { applyAction } from '../../packages/shared/src/logic/gameReducer';
import { buildStartGameAction } from '../../packages/shared/src/logic/gameSetup';
import { INITIAL_STATE_SKELETON } from '../../packages/shared/src/logic/initialState';
import { buildSelectBuffAction } from '../../packages/shared/src/logic/interactionCommands';
import {
    buildReplayInitSnapshot,
    buildIdentityRuntimeToInstanceMap,
    createReplayCheckpoint,
    createReplayRecorderInternalState,
    loadReplayStateAtRevision,
    recordReplayAction,
    saveReplayVNext,
    seedReplayRecorderState,
    simulateAiVsAiReplay,
    type ReplayEvent,
    type ReplayVNext,
} from '../../packages/shared/src/replay/index';
import { generateReplayStateHash } from '../../packages/shared/src/replay/stateHash';
import type {
    BasicGemColor,
    BuffLevel,
    Card,
    GameAction,
    GameState,
    GemColor,
    MarketCardRef,
} from '../../packages/shared/src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, '..', '..');

const DEFAULT_OUT_DIR = path.join(workspaceRoot, 'fixtures', 'replay-golden');
const RULES_VERSION = '5.2.11';
const REPLAY_SCHEMA_VERSION = '1.0';
const REQUIRED_COVERAGE = [
    'local-pvp-opening',
    'reserve',
    'buy',
    'joker-buy',
    'reserved-buy',
    'reserve-cancel',
    'reserve-deck',
    'discard-reserved',
    'privilege',
    'peek-modal',
    'draft-reroll',
    'draft-p2-reroll',
    'royal-selection',
    'royal-handoff',
    'extra-turn',
    'buff',
    'game-over',
] as const;

const REQUIRED_REJECTION_COVERAGE = [
    'wrong-phase:SELECT_BUFF',
    'wrong-phase:TAKE_GEMS',
    'wrong-phase:REPLENISH',
    'wrong-phase:TAKE_BONUS_GEM',
    'wrong-phase:DISCARD_GEM',
    'wrong-phase:STEAL_GEM',
    'wrong-phase:INITIATE_BUY_JOKER',
    'wrong-phase:BUY_CARD',
    'wrong-phase:INITIATE_RESERVE',
    'wrong-phase:INITIATE_RESERVE_DECK',
    'wrong-phase:CANCEL_RESERVE',
    'wrong-phase:RESERVE_CARD',
    'wrong-phase:RESERVE_DECK',
    'wrong-phase:DISCARD_RESERVED',
    'wrong-phase:ACTIVATE_PRIVILEGE',
    'wrong-phase:USE_PRIVILEGE',
    'wrong-phase:CANCEL_PRIVILEGE',
    'wrong-phase:SELECT_ROYAL_CARD',
    'wrong-phase:REROLL_DRAFT_POOL',
    'edge:SELECT_BUFF:unavailable',
    'edge:REPLENISH:empty-bag',
    'edge:TAKE_GEMS:empty',
    'edge:TAKE_GEMS:gold-cell',
    'edge:TAKE_GEMS:gapped',
    'edge:TAKE_BONUS_GEM:wrong-color',
    'edge:TAKE_BONUS_GEM:unavailable-cell',
    'edge:DISCARD_GEM:not-owned',
    'edge:STEAL_GEM:gold',
    'edge:STEAL_GEM:not-owned',
    'edge:INITIATE_BUY_JOKER:non-joker',
    'edge:BUY_CARD:market-mismatch',
    'edge:BUY_CARD:reserved-not-owned',
    'edge:INITIATE_RESERVE:market-mismatch',
    'edge:INITIATE_RESERVE_DECK:empty-deck',
    'edge:RESERVE_CARD:missing-gold',
    'edge:RESERVE_CARD:non-gold',
    'edge:RESERVE_CARD:pending-mismatch',
    'edge:RESERVE_CARD:full-row',
    'edge:RESERVE_DECK:missing-gold',
    'edge:RESERVE_DECK:non-gold',
    'edge:RESERVE_DECK:pending-mismatch',
    'edge:RESERVE_DECK:full-row',
    'edge:DISCARD_RESERVED:no-ability',
    'edge:DISCARD_RESERVED:not-owned',
    'edge:ACTIVATE_PRIVILEGE:no-charge',
    'edge:ACTIVATE_PRIVILEGE:no-target',
    'edge:USE_PRIVILEGE:no-charge',
    'edge:USE_PRIVILEGE:invalid-target',
    'edge:SELECT_ROYAL_CARD:unavailable',
    'edge:PEEK_DECK:no-ability',
    'edge:CLOSE_MODAL:no-modal',
    'edge:CLOSE_MODAL:blocked',
    'edge:REROLL_DRAFT_POOL:online',
    'edge:REROLL_DRAFT_POOL:p2-before-p1',
] as const;

const FULL_COVERAGE_PARITY_CHECKPOINT_REVISIONS = [8, 11] as const;

type CoverageTag = (typeof REQUIRED_COVERAGE)[number];
type RejectionCoverageTag = (typeof REQUIRED_REJECTION_COVERAGE)[number];
type ReplayRevisionResolver = (replay: ReplayVNext) => number;
type RejectionStateSetupId =
    | 'empty-bag'
    | 'empty-deck'
    | 'full-reserve-row'
    | 'empty-board-with-privilege'
    | 'privilege-action-no-charge'
    | 'blocked-peek-modal'
    | 'online-draft'
    | 'p2-draft-before-p1-selection';

const REJECTION_GEM_COLORS: GemColor[] = ['red', 'blue', 'green', 'white', 'black', 'pearl'];

const formatJson = (value: unknown) =>
    formatWithPrettier(JSON.stringify(value), {
        parser: 'json',
        printWidth: 100,
        tabWidth: 4,
    });

const cloneJson = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

interface GoldenFixture {
    id: string;
    fileName: string;
    tags: CoverageTag[];
    replay: ReplayVNext;
    source: string;
}

interface RejectionOracleCaseInput {
    id: string;
    fixtureId: string;
    fileName: string;
    revision: number | ReplayRevisionResolver;
    stateSetupId?: RejectionStateSetupId;
    tags: RejectionCoverageTag[];
    action: (state: GameState) => GameAction;
    source: string;
}

interface RejectionOracleCase {
    id: string;
    fixtureId: string;
    fileName: string;
    revision: number;
    stateSetupId?: RejectionStateSetupId;
    tags: RejectionCoverageTag[];
    actionType: GameAction['type'];
    action: GameAction;
    expectedRejectionCode: 'COMMAND_REJECTED';
    expectedRejectionReason: string;
    expectedBeforeStateHash: string;
    expectedAfterStateHash: string;
    source: string;
}

const createDeterministicRandom = (seed: number) => {
    let current = seed >>> 0;
    return () => {
        current = (current * 1_664_525 + 1_013_904_223) >>> 0;
        return current / 4_294_967_296;
    };
};

const withDeterministicMathRandom = <T>(seed: number, work: () => T): T => {
    const originalRandom = Math.random;
    Math.random = createDeterministicRandom(seed);
    try {
        return work();
    } finally {
        Math.random = originalRandom;
    }
};

const parseCliOptions = () => {
    const { values } = parseArgs({
        args: process.argv.slice(2),
        options: {
            'out-dir': { type: 'string' },
            help: { type: 'boolean' },
        },
        allowPositionals: false,
        strict: true,
    });

    if (values.help) {
        process.stdout.write(
            [
                'Usage: pnpm --dir tools/scripts exec vite-node --script ../../tools/migration/export-unity-fixtures.ts [options]',
                '',
                'Options:',
                '  --out-dir <path>  Output directory (default: fixtures/replay-golden)',
                '  --help            Show this help message',
                '',
            ].join('\n')
        );
        process.exit(0);
    }

    return {
        outDir: path.resolve(values['out-dir'] ?? DEFAULT_OUT_DIR),
    };
};

const requireState = (state: GameState | null, actionType: string): GameState => {
    if (!state) {
        throw new Error(`Fixture export failed while applying ${actionType}.`);
    }
    return state;
};

const applyRecordedAction = (
    recorder: ReturnType<typeof createReplayRecorderInternalState>,
    previousState: GameState,
    action: GameAction
): GameState => {
    const nextState = requireState(applyAction(previousState, action), action.type);
    if (nextState === previousState) {
        throw new Error(`Fixture export could not apply ${action.type}; state was unchanged.`);
    }
    recordReplayAction(recorder, previousState, action, nextState);
    return nextState;
};

const buildCustomDraftInitAction = (
    seed: string,
    buffLevel: BuffLevel,
    draftPool: string[]
): Extract<GameAction, { type: 'INIT_DRAFT' }> => {
    const initAction = buildStartGameAction('LOCAL_PVP', {
        useBuffs: true,
        isHost: true,
        hostPlayer: 'p1',
        seed,
    });

    if (initAction.type !== 'INIT_DRAFT') {
        throw new Error('Custom draft fixture expected INIT_DRAFT bootstrap action.');
    }

    return {
        ...initAction,
        payload: {
            ...initAction.payload,
            buffLevel,
            draftPool,
        },
    };
};

const finishLocalPvpDraft = (
    recorder: ReturnType<typeof createReplayRecorderInternalState>,
    initState: GameState,
    p1BuffId: string,
    p1Color: BasicGemColor = 'red',
    p2Color: BasicGemColor = 'blue'
): GameState => {
    const p1BuffAction = withDeterministicMathRandom(0x5eed_1000 + initState.buffLevel, () =>
        buildSelectBuffAction(
            p1BuffId,
            p1Color,
            initState.turn,
            initState.phase,
            initState.buffLevel
        )
    );
    const afterP1 = applyRecordedAction(recorder, initState, p1BuffAction);
    const p2Pool = afterP1.p2DraftPool ?? afterP1.draftPool;
    const p2BuffId = p2Pool.find((buffId) => buffId !== p1BuffId) ?? p2Pool[0];

    if (!p2BuffId) {
        throw new Error('Draft fixture could not find a P2 buff selection.');
    }

    const afterP2 = applyRecordedAction(
        recorder,
        afterP1,
        buildSelectBuffAction(p2BuffId, p2Color, afterP1.turn, afterP1.phase, afterP1.buffLevel)
    );

    if (afterP2.phase !== 'IDLE' || afterP2.turn !== 'p1') {
        throw new Error('Draft fixture did not resolve to P1 IDLE gameplay.');
    }

    return afterP2;
};

const saveRecorderReplay = (
    recorder: ReturnType<typeof createReplayRecorderInternalState>,
    finalState: GameState
): ReplayVNext => {
    if (!recorder.init) {
        throw new Error('Fixture did not create replay init metadata.');
    }

    const replay = saveReplayVNext({
        replayRevision: recorder.replayRevision,
        gameVersion: recorder.gameVersion,
        createdAt: recorder.createdAt,
        init: recorder.init,
        events: recorder.events,
        checkpoints: recorder.checkpoints,
        currentState: finalState,
        runtimeToInstance: recorder.runtimeToInstance,
    });

    return addParityCheckpoints(replay, [replay.replayRevision]);
};

const findBoardGemCoord = (
    state: GameState,
    predicate: (gemId: string) => boolean,
    label: string
): { r: number; c: number } => {
    for (let r = 0; r < state.board.length; r += 1) {
        for (let c = 0; c < state.board[r].length; c += 1) {
            if (predicate(state.board[r][c].type.id)) {
                return { r, c };
            }
        }
    }

    throw new Error(`Fixture export could not find board gem for ${label}.`);
};

const findGoldCoord = (state: GameState): { r: number; c: number } =>
    findBoardGemCoord(state, (gemId) => gemId === 'gold', 'gold reserve prompt');

const findEmptyCoord = (state: GameState): { r: number; c: number } =>
    findBoardGemCoord(state, (gemId) => gemId === 'empty', 'empty rejection target');

const findCollectibleCoord = (state: GameState): { r: number; c: number } =>
    findBoardGemCoord(
        state,
        (gemId) => gemId !== 'empty' && gemId !== 'gold',
        'collectible privilege or turn-advance action'
    );

const findWrongBonusCoord = (state: GameState): { r: number; c: number } => {
    const target = state.bonusGemTarget?.id;
    if (!target) {
        throw new Error('Fixture export could not find a bonus-gem target for rejection coverage.');
    }

    return findBoardGemCoord(
        state,
        (gemId) => gemId !== 'empty' && gemId !== 'gold' && gemId !== target,
        'wrong bonus-gem color'
    );
};

const findUnownedGemColor = (state: GameState, owner: 'p1' | 'p2'): GemColor => {
    const color = REJECTION_GEM_COLORS.find((gemId) => state.inventories[owner][gemId] === 0);
    if (!color) {
        throw new Error(`Fixture export could not find an unowned gem for ${owner}.`);
    }
    return color;
};

const findFirstMarketCard = (
    state: GameState,
    predicate: (card: Card, marketInfo: MarketCardRef) => boolean = () => true,
    label = 'rejection coverage'
): { card: Card; marketInfo: MarketCardRef } => {
    for (const level of [1, 2, 3] as const) {
        for (let idx = 0; idx < state.market[level].length; idx += 1) {
            const card = state.market[level][idx];
            const marketInfo = { level, idx };
            if (card && predicate(card, marketInfo)) {
                return {
                    card,
                    marketInfo,
                };
            }
        }
    }

    throw new Error(`Fixture export could not find a market card for ${label}.`);
};

const buildMarketCardPayload = (state: GameState) => {
    const { card, marketInfo } = findFirstMarketCard(state);
    return {
        card: cloneJson(card),
        marketInfo,
    };
};

const buildNonJokerMarketCardPayload = (state: GameState) => {
    const { card, marketInfo } = findFirstMarketCard(
        state,
        (candidate) => candidate.bonusColor !== 'gold',
        'non-joker rejection coverage'
    );
    return {
        card: cloneJson(card),
        marketInfo,
    };
};

const buildMismatchedMarketCardPayload = (state: GameState) => {
    const first = findFirstMarketCard(state);
    const second = findFirstMarketCard(
        state,
        (_card, marketInfo) =>
            marketInfo.level !== first.marketInfo.level || marketInfo.idx !== first.marketInfo.idx,
        'market mismatch rejection coverage'
    );
    return {
        card: cloneJson(first.card),
        marketInfo: second.marketInfo,
    };
};

const findRevision = (
    replay: ReplayVNext,
    label: string,
    predicate: (state: GameState, revision: number) => boolean
): number => {
    for (let revision = 0; revision <= replay.replayRevision; revision += 1) {
        const state = loadReplayStateAtRevision(replay, revision);
        if (predicate(state, revision)) {
            return revision;
        }
    }

    throw new Error(`Fixture export could not find replay revision for ${label}.`);
};

const findPhaseRevision = (phase: GameState['phase']): ReplayRevisionResolver => {
    return (replay) => findRevision(replay, `${phase} phase`, (state) => state.phase === phase);
};

const collectReserveFillCards = (state: GameState): Card[] => {
    const marketCards = ([1, 2, 3] as const).flatMap((level) =>
        state.market[level].filter((card): card is Card => Boolean(card))
    );
    const deckCards = ([1, 2, 3] as const).flatMap((level) => state.decks[level]);
    const cards = [...marketCards, ...deckCards];
    if (cards.length < 3) {
        throw new Error('Rejection oracle could not find enough cards to fill the reserve row.');
    }
    return cards.slice(0, 3).map((card) => cloneJson(card));
};

const makeEmptyBoard = (state: GameState): GameState['board'] =>
    state.board.map((row, r) =>
        row.map((_cell, c) => ({
            type: GEM_TYPES.EMPTY,
            uid: `oracle-empty-${r}-${c}`,
        }))
    );

const applyRejectionStateSetup = (
    state: GameState,
    setupId: RejectionStateSetupId | undefined
): GameState => {
    if (!setupId) {
        return state;
    }

    const nextState = cloneJson(state);
    switch (setupId) {
        case 'empty-bag':
            nextState.bag = [];
            return nextState;
        case 'empty-deck':
            nextState.decks[1] = [];
            return nextState;
        case 'full-reserve-row':
            nextState.playerReserved[nextState.turn] = collectReserveFillCards(nextState);
            return nextState;
        case 'empty-board-with-privilege':
            nextState.board = makeEmptyBoard(nextState);
            nextState.privileges[nextState.turn] = 1;
            nextState.extraPrivileges[nextState.turn] = 0;
            return nextState;
        case 'privilege-action-no-charge':
            nextState.phase = 'PRIVILEGE_ACTION';
            nextState.privileges[nextState.turn] = 0;
            nextState.extraPrivileges[nextState.turn] = 0;
            nextState.privilegeGemCount = 0;
            return nextState;
        case 'blocked-peek-modal':
            if (!nextState.activeModal) {
                throw new Error('Blocked modal setup requires an active modal.');
            }
            nextState.turn = nextState.activeModal.data.initiator === 'p1' ? 'p2' : 'p1';
            return nextState;
        case 'online-draft':
            nextState.mode = 'ONLINE_MULTIPLAYER';
            return nextState;
        case 'p2-draft-before-p1-selection':
            nextState.turn = 'p2';
            nextState.p1SelectedBuff = null;
            return nextState;
        default: {
            const exhaustive: never = setupId;
            throw new Error(`Unsupported rejection oracle state setup ${exhaustive}.`);
        }
    }
};

const buildOpeningReplay = (): ReplayVNext => {
    const initAction = buildStartGameAction('LOCAL_PVP', {
        useBuffs: false,
        isHost: true,
        hostPlayer: 'p1',
        seed: 'unity-golden-local-pvp-opening',
    });
    const initialState = requireState(applyAction(INITIAL_STATE_SKELETON, initAction), 'INIT');
    const { init, runtimeToInstance } = buildReplayInitSnapshot(initAction, initialState);

    return saveReplayVNext({
        replayRevision: 0,
        gameVersion: RULES_VERSION,
        createdAt: '2026-05-09T00:00:00.000Z',
        init,
        events: [],
        checkpoints: [createReplayCheckpoint(0, initialState, runtimeToInstance)],
        currentState: initialState,
        runtimeToInstance,
    });
};

const buildBuffDraftReplay = (): ReplayVNext =>
    withDeterministicMathRandom(0x5eed_0001, () => {
        const initAction = buildStartGameAction('LOCAL_PVP', {
            useBuffs: true,
            isHost: true,
            hostPlayer: 'p1',
            seed: 'unity-golden-buff-draft',
        });
        const initState = requireState(
            applyAction(INITIAL_STATE_SKELETON, initAction),
            'INIT_DRAFT'
        );
        const recorder = seedReplayRecorderState(
            createReplayRecorderInternalState(RULES_VERSION, '2026-05-09T00:01:00.000Z'),
            initAction,
            initState
        );

        const p1BuffAction = buildSelectBuffAction(
            initState.draftPool[0] ?? 'none',
            'red',
            initState.turn,
            initState.phase,
            initState.buffLevel
        );
        const afterP1 = applyRecordedAction(recorder, initState, p1BuffAction);
        const p2Pool = afterP1.p2DraftPool ?? afterP1.draftPool;
        const p2BuffAction = buildSelectBuffAction(
            p2Pool[0] ?? 'none',
            'blue',
            afterP1.turn,
            afterP1.phase,
            afterP1.buffLevel
        );
        const finalState = applyRecordedAction(recorder, afterP1, p2BuffAction);

        if (!recorder.init) {
            throw new Error('Buff draft fixture did not create replay init metadata.');
        }

        return saveReplayVNext({
            replayRevision: recorder.replayRevision,
            gameVersion: recorder.gameVersion,
            createdAt: recorder.createdAt,
            init: recorder.init,
            events: recorder.events,
            checkpoints: recorder.checkpoints,
            currentState: finalState,
            runtimeToInstance: recorder.runtimeToInstance,
        });
    });

const hasFullCoverage = (events: ReplayEvent[], replay: ReplayVNext): boolean => {
    const eventTypes = new Set(events.map((event) => event.type));
    const extraTurnEvidence = events.some((event, index) => {
        const previous = events[index - 1];
        return previous?.type === 'select_royal' ? event.actor === previous.actor : false;
    });

    return (
        eventTypes.has('reserve_card') &&
        eventTypes.has('buy_card') &&
        eventTypes.has('select_royal') &&
        extraTurnEvidence &&
        replay.summary.winner !== null &&
        replay.summary.endReason === 'normal'
    );
};

const isJokerTemplateId = (templateId: string): boolean => /-jo(?:-|$)/.test(templateId);

const hasJokerBuyCoverage = (replay: ReplayVNext): boolean =>
    replay.events.some((event) => {
        if (event.type !== 'buy_card') {
            return false;
        }
        const templateId = replay.init.cardInstances[event.instanceId] ?? event.instanceId;
        return (
            isJokerTemplateId(templateId) &&
            event.bonusColor !== 'gold' &&
            event.bonusColor !== 'null'
        );
    });

const hasJokerColorSelectionCoverage = (replay: ReplayVNext): boolean =>
    replay.events.some((event, index, events) => {
        if (event.type !== 'buy_card') {
            return false;
        }

        const templateId = replay.init.cardInstances[event.instanceId] ?? event.instanceId;
        if (
            !isJokerTemplateId(templateId) ||
            event.bonusColor === 'gold' ||
            event.bonusColor === 'null'
        ) {
            return false;
        }

        return events.slice(0, index).some((previous) => {
            if (previous.type !== 'initiate_buy_joker') {
                return false;
            }

            const sameMarketRef =
                previous.marketRef?.level === event.marketRef?.level &&
                previous.marketRef?.idx === event.marketRef?.idx &&
                previous.marketRef?.isExtra === event.marketRef?.isExtra &&
                previous.marketRef?.extraIdx === event.marketRef?.extraIdx;

            return (
                previous.actor === event.actor &&
                previous.instanceId === event.instanceId &&
                previous.source === event.source &&
                sameMarketRef
            );
        });
    });

const hasReservedBuyCoverage = (replay: ReplayVNext): boolean =>
    replay.events.some((event) => event.type === 'buy_card' && event.source === 'reserved');

const buildReserveCancelReplay = (): ReplayVNext => {
    const initAction = buildStartGameAction('LOCAL_PVP', {
        useBuffs: false,
        isHost: true,
        hostPlayer: 'p1',
        seed: 'unity-golden-reserve-cancel',
    });
    const initState = requireState(applyAction(INITIAL_STATE_SKELETON, initAction), 'INIT');
    const recorder = seedReplayRecorderState(
        createReplayRecorderInternalState(RULES_VERSION, '2026-05-11T09:00:03.000Z'),
        initAction,
        initState
    );

    const marketRef = ([1, 2, 3] as const)
        .flatMap((level) =>
            initState.market[level].map((card, idx) => ({
                card,
                level,
                idx,
            }))
        )
        .find((candidate) => candidate.card);

    if (!marketRef?.card) {
        throw new Error('Reserve-cancel fixture could not find an initial market card.');
    }

    const reservingState = applyRecordedAction(recorder, initState, {
        type: 'INITIATE_RESERVE',
        payload: {
            card: marketRef.card,
            level: marketRef.level,
            idx: marketRef.idx,
        },
    });
    if (reservingState.phase !== 'RESERVE_WAITING_GEM') {
        throw new Error('Reserve-cancel fixture did not enter RESERVE_WAITING_GEM.');
    }

    const finalState = applyRecordedAction(recorder, reservingState, { type: 'CANCEL_RESERVE' });
    if (finalState.phase !== 'IDLE' || finalState.pendingReserve) {
        throw new Error('Reserve-cancel fixture did not return to IDLE.');
    }

    if (!recorder.init) {
        throw new Error('Reserve-cancel fixture did not create replay init metadata.');
    }

    return saveReplayVNext({
        replayRevision: recorder.replayRevision,
        gameVersion: recorder.gameVersion,
        createdAt: recorder.createdAt,
        init: recorder.init,
        events: recorder.events,
        checkpoints: recorder.checkpoints,
        currentState: finalState,
        runtimeToInstance: recorder.runtimeToInstance,
    });
};

const buildReserveDeckReplay = (): ReplayVNext => {
    const initAction = buildStartGameAction('LOCAL_PVP', {
        useBuffs: false,
        isHost: true,
        hostPlayer: 'p1',
        seed: 'unity-golden-reserve-deck',
    });
    const initState = requireState(applyAction(INITIAL_STATE_SKELETON, initAction), 'INIT');
    const recorder = seedReplayRecorderState(
        createReplayRecorderInternalState(RULES_VERSION, '2026-05-11T09:00:04.000Z'),
        initAction,
        initState
    );
    const goldCoord = findGoldCoord(initState);
    const waitingState = applyRecordedAction(recorder, initState, {
        type: 'INITIATE_RESERVE_DECK',
        payload: { level: 1 },
    });

    if (waitingState.phase !== 'RESERVE_WAITING_GEM') {
        throw new Error('Reserve-deck fixture did not enter RESERVE_WAITING_GEM.');
    }

    const finalState = applyRecordedAction(recorder, waitingState, {
        type: 'RESERVE_DECK',
        payload: { level: 1, goldCoords: goldCoord },
    });

    if (finalState.playerReserved.p1.length === 0) {
        throw new Error('Reserve-deck fixture did not reserve a deck card.');
    }

    return saveRecorderReplay(recorder, finalState);
};

const buildPrivilegeReplay = (): ReplayVNext => {
    const initAction = buildCustomDraftInitAction('unity-golden-privilege', 1, [
        'privilege_favor',
        'intelligence',
        'deep_pockets',
    ]);
    const initState = requireState(applyAction(INITIAL_STATE_SKELETON, initAction), 'INIT_DRAFT');
    const recorder = seedReplayRecorderState(
        createReplayRecorderInternalState(RULES_VERSION, '2026-05-11T09:00:05.000Z'),
        initAction,
        initState
    );
    const gameplayState = finishLocalPvpDraft(recorder, initState, 'privilege_favor');
    const privilegeState = applyRecordedAction(recorder, gameplayState, {
        type: 'ACTIVATE_PRIVILEGE',
    });
    const cancelledState = applyRecordedAction(recorder, privilegeState, {
        type: 'CANCEL_PRIVILEGE',
    });
    const secondPrivilegeState = applyRecordedAction(recorder, cancelledState, {
        type: 'ACTIVATE_PRIVILEGE',
    });
    const finalState = applyRecordedAction(recorder, secondPrivilegeState, {
        type: 'USE_PRIVILEGE',
        payload: findCollectibleCoord(secondPrivilegeState),
    });

    if (finalState.phase !== 'IDLE' || finalState.extraPrivileges.p1 !== 0) {
        throw new Error('Privilege fixture did not spend the active privilege and return to IDLE.');
    }

    return saveRecorderReplay(recorder, finalState);
};

const buildPeekModalReplay = (): ReplayVNext => {
    const initAction = buildCustomDraftInitAction('unity-golden-peek-modal', 1, [
        'intelligence',
        'privilege_favor',
        'deep_pockets',
    ]);
    const initState = requireState(applyAction(INITIAL_STATE_SKELETON, initAction), 'INIT_DRAFT');
    const recorder = seedReplayRecorderState(
        createReplayRecorderInternalState(RULES_VERSION, '2026-05-11T09:00:06.000Z'),
        initAction,
        initState
    );
    const gameplayState = finishLocalPvpDraft(recorder, initState, 'intelligence');
    const modalState = applyRecordedAction(recorder, gameplayState, {
        type: 'PEEK_DECK',
        payload: { levels: [3, 2, 1] },
    });

    if (!modalState.activeModal) {
        throw new Error('Peek-modal fixture did not open a modal.');
    }

    const finalState = applyRecordedAction(recorder, modalState, { type: 'CLOSE_MODAL' });
    if (finalState.activeModal) {
        throw new Error('Peek-modal fixture did not close the active modal.');
    }

    return saveRecorderReplay(recorder, finalState);
};

const buildDiscardReservedReplay = (): ReplayVNext => {
    const initAction = buildCustomDraftInitAction('unity-golden-discard-reserved', 3, [
        'puppet_master',
        'greed_king',
        'double_agent',
    ]);
    const initState = requireState(applyAction(INITIAL_STATE_SKELETON, initAction), 'INIT_DRAFT');
    const recorder = seedReplayRecorderState(
        createReplayRecorderInternalState(RULES_VERSION, '2026-05-11T09:00:07.000Z'),
        initAction,
        initState
    );
    const gameplayState = finishLocalPvpDraft(recorder, initState, 'puppet_master');
    const marketCard = gameplayState.market[1][0];

    if (!marketCard) {
        throw new Error('Discard-reserved fixture could not find an initial market card.');
    }

    const afterReserve = applyRecordedAction(recorder, gameplayState, {
        type: 'RESERVE_CARD',
        payload: { card: marketCard, level: 1, idx: 0 },
    });
    const afterP2Turn = applyRecordedAction(recorder, afterReserve, {
        type: 'TAKE_GEMS',
        payload: { coords: [findCollectibleCoord(afterReserve)] },
    });
    const reservedCard = afterP2Turn.playerReserved.p1.find((card) => card.id === marketCard.id);

    if (!reservedCard) {
        throw new Error('Discard-reserved fixture could not find P1 reserved card.');
    }

    const finalState = applyRecordedAction(recorder, afterP2Turn, {
        type: 'DISCARD_RESERVED',
        payload: { cardId: reservedCard.id },
    });

    if (finalState.playerReserved.p1.some((card) => card.id === reservedCard.id)) {
        throw new Error('Discard-reserved fixture did not discard the reserved card.');
    }

    return saveRecorderReplay(recorder, finalState);
};

const buildDraftRerollReplay = (): ReplayVNext => {
    const initAction = buildCustomDraftInitAction('unity-golden-draft-reroll', 1, [
        'privilege_favor',
        'intelligence',
        'deep_pockets',
    ]);
    const initState = requireState(applyAction(INITIAL_STATE_SKELETON, initAction), 'INIT_DRAFT');
    const recorder = seedReplayRecorderState(
        createReplayRecorderInternalState(RULES_VERSION, '2026-05-11T09:00:08.000Z'),
        initAction,
        initState
    );
    const rerolledState = applyRecordedAction(recorder, initState, {
        type: 'REROLL_DRAFT_POOL',
        payload: { level: 1 },
    });
    const selectedBuff = rerolledState.draftPool[0];

    if (!selectedBuff) {
        throw new Error('Draft-reroll fixture did not produce a selectable P1 draft pool.');
    }

    const afterP1 = applyRecordedAction(
        recorder,
        rerolledState,
        withDeterministicMathRandom(0x5eed_1001, () =>
            buildSelectBuffAction(
                selectedBuff,
                'red',
                rerolledState.turn,
                rerolledState.phase,
                rerolledState.buffLevel
            )
        )
    );
    const p2RerolledState = withDeterministicMathRandom(0x5eed_1002, () =>
        applyRecordedAction(recorder, afterP1, {
            type: 'REROLL_DRAFT_POOL',
            payload: { level: afterP1.p2DraftLevel ?? afterP1.buffLevel },
        })
    );
    const p2BuffId = p2RerolledState.p2DraftPool?.[0];

    if (!p2BuffId || p2RerolledState.turn !== 'p2') {
        throw new Error('Draft-reroll fixture did not produce a selectable P2 draft pool.');
    }

    const finalState = applyRecordedAction(
        recorder,
        p2RerolledState,
        buildSelectBuffAction(
            p2BuffId,
            'blue',
            p2RerolledState.turn,
            p2RerolledState.phase,
            p2RerolledState.buffLevel
        )
    );

    if (finalState.phase !== 'IDLE' || finalState.turn !== 'p1') {
        throw new Error('Draft-reroll fixture did not resolve to gameplay after P2 selection.');
    }

    return saveRecorderReplay(recorder, finalState);
};

const buildJokerColorSelectionReplay = (): ReplayVNext => {
    const initAction = buildStartGameAction('LOCAL_PVP', {
        useBuffs: false,
        isHost: true,
        hostPlayer: 'p1',
        seed: 'unity-joker-color-selection-5',
    });
    const initState = requireState(applyAction(INITIAL_STATE_SKELETON, initAction), 'INIT');
    const recorder = seedReplayRecorderState(
        createReplayRecorderInternalState(RULES_VERSION, '2026-05-11T09:00:09.000Z'),
        initAction,
        initState
    );
    const joker = initState.market[1][0];

    if (!joker || joker.bonusColor !== 'gold') {
        throw new Error('Joker color-selection fixture expected a Level 1 Joker in market slot 0.');
    }

    let state = applyRecordedAction(recorder, initState, {
        type: 'TAKE_GEMS',
        payload: {
            coords: [
                { r: 0, c: 0 },
                { r: 1, c: 1 },
                { r: 2, c: 2 },
            ],
        },
    });
    state = applyRecordedAction(recorder, state, {
        type: 'TAKE_GEMS',
        payload: { coords: [{ r: 0, c: 1 }] },
    });
    state = applyRecordedAction(recorder, state, {
        type: 'TAKE_GEMS',
        payload: {
            coords: [
                { r: 0, c: 3 },
                { r: 1, c: 3 },
                { r: 2, c: 3 },
            ],
        },
    });
    state = applyRecordedAction(recorder, state, {
        type: 'TAKE_GEMS',
        payload: { coords: [{ r: 0, c: 4 }] },
    });

    const pendingState = applyRecordedAction(recorder, state, {
        type: 'INITIATE_BUY_JOKER',
        payload: {
            card: joker,
            source: 'market',
            marketInfo: { level: 1, idx: 0 },
        },
    });

    if (pendingState.phase !== 'SELECT_CARD_COLOR' || !pendingState.pendingBuy) {
        throw new Error('Joker color-selection fixture did not enter SELECT_CARD_COLOR.');
    }

    const finalState = applyRecordedAction(recorder, pendingState, {
        type: 'BUY_CARD',
        payload: {
            card: { ...joker, bonusColor: 'red' },
            source: 'market',
            marketInfo: { level: 1, idx: 0 },
            randoms: { bountyHunterColor: 'red' },
        },
    });

    if (!finalState.playerTableau.p1.some((card) => card.id === joker.id)) {
        throw new Error('Joker color-selection fixture did not buy the selected Joker.');
    }

    const replay = saveRecorderReplay(recorder, finalState);
    if (!hasJokerColorSelectionCoverage(replay)) {
        throw new Error('Joker color-selection fixture did not record the two-step Joker flow.');
    }
    return replay;
};

const buildJokerReservedBuyReplay = (): ReplayVNext =>
    withDeterministicMathRandom(0, () => {
        const result = simulateAiVsAiReplay({
            gameVersion: RULES_VERSION,
            useBuffs: true,
            mode: 'LOCAL_PVP',
            createdAt: '2026-05-11T09:00:02.000Z',
        });

        if (
            result.status !== 'completed' ||
            !hasJokerBuyCoverage(result.replay) ||
            !hasReservedBuyCoverage(result.replay)
        ) {
            throw new Error('Could not generate deterministic Joker/reserved-buy replay fixture.');
        }

        return result.replay;
    });

const buildFullCoverageReplay = (): ReplayVNext =>
    withDeterministicMathRandom(0x5eed_0002, () => {
        const knownCoverageSeeds = ['2026-05-09T01:00:00.000Z'];

        for (const createdAt of knownCoverageSeeds) {
            const result = simulateAiVsAiReplay({
                gameVersion: RULES_VERSION,
                useBuffs: true,
                mode: 'LOCAL_PVP',
                createdAt,
            });

            if (
                result.status === 'completed' &&
                hasFullCoverage(result.replay.events, result.replay)
            ) {
                return addParityCheckpoints(
                    result.replay,
                    buildFullCoverageParityCheckpointRevisions(result.replay)
                );
            }
        }

        for (let index = 0; index < 300; index += 1) {
            const createdAt = new Date(Date.UTC(2026, 4, 9, 1, 0, index)).toISOString();
            const result = simulateAiVsAiReplay({
                gameVersion: RULES_VERSION,
                useBuffs: true,
                mode: 'LOCAL_PVP',
                createdAt,
            });

            if (
                result.status === 'completed' &&
                hasFullCoverage(result.replay.events, result.replay)
            ) {
                return addParityCheckpoints(
                    result.replay,
                    buildFullCoverageParityCheckpointRevisions(result.replay)
                );
            }
        }

        throw new Error('Could not generate a deterministic full-coverage replay fixture.');
    });

const addParityCheckpoints = (replay: ReplayVNext, revisions: readonly number[]): ReplayVNext => {
    const runtimeToInstance = buildIdentityRuntimeToInstanceMap(replay.init.cardInstances);
    const checkpoints = new Map(
        (replay.checkpoints ?? []).map((checkpoint) => [checkpoint.revision, checkpoint])
    );

    for (const revision of revisions) {
        if (revision < 0 || revision > replay.replayRevision) {
            throw new Error(`Parity checkpoint revision ${revision} is outside replay bounds.`);
        }

        const state = loadReplayStateAtRevision(replay, revision);
        checkpoints.set(revision, createReplayCheckpoint(revision, state, runtimeToInstance));
    }

    return {
        ...replay,
        checkpoints: [...checkpoints.values()].sort(
            (left, right) => left.revision - right.revision
        ),
    };
};

const buildFullCoverageParityCheckpointRevisions = (replay: ReplayVNext): number[] => [
    ...FULL_COVERAGE_PARITY_CHECKPOINT_REVISIONS,
    findRevision(
        replay,
        'DISCARD_EXCESS_GEMS parity checkpoint',
        (state) => state.phase === 'DISCARD_EXCESS_GEMS'
    ),
];

const buildFixtureManifest = (fixtures: GoldenFixture[]) => ({
    schemaVersion: 1,
    generatedAt: '2026-05-09T00:00:00.000Z',
    generatedBy: 'tools/migration/export-unity-fixtures.ts',
    rulesVersion: RULES_VERSION,
    replaySchemaVersion: REPLAY_SCHEMA_VERSION,
    hashContract: {
        id: 'replay-state-hash-v1',
        implementation: 'packages/shared/src/replay/stateHash.ts',
        serializer: 'serializeReplayStateSnapshot + stableJsonStringify',
    },
    requiredCoverage: REQUIRED_COVERAGE,
    rejectionManifestFile: 'rejection-manifest.json',
    fixtures: fixtures.map(({ id, fileName, tags, replay, source }) => ({
        id,
        fileName,
        tags,
        schemaVersion: replay.schemaVersion,
        replayRevision: replay.replayRevision,
        expectedFinalStateHash: replay.summary.finalStateHash,
        expectedWinner: replay.summary.winner,
        expectedEndReason: replay.summary.endReason,
        expectedTotalEvents: replay.summary.totalEvents,
        expectedTurnCount: replay.summary.turnCount,
        source,
    })),
});

const buildRejectionOracleCase = (
    fixtureById: Map<string, GoldenFixture>,
    input: RejectionOracleCaseInput
): RejectionOracleCase => {
    const fixture = fixtureById.get(input.fixtureId);
    if (!fixture) {
        throw new Error(`Rejection oracle fixture ${input.fixtureId} does not exist.`);
    }

    const revision =
        typeof input.revision === 'function' ? input.revision(fixture.replay) : input.revision;
    const baseState = loadReplayStateAtRevision(fixture.replay, revision);
    const state = applyRejectionStateSetup(baseState, input.stateSetupId);
    const runtimeToInstance = buildIdentityRuntimeToInstanceMap(fixture.replay.init.cardInstances);
    const action = input.action(state);
    const rejectionReason = getActionRejectionReason(state, action);
    if (!rejectionReason) {
        throw new Error(`Rejection oracle case ${input.id} unexpectedly accepted ${action.type}.`);
    }

    const nextState = applyAction(state, action);
    if (nextState !== state) {
        throw new Error(`Rejection oracle case ${input.id} mutated state for ${action.type}.`);
    }

    const stateHash = generateReplayStateHash(state, runtimeToInstance);

    return {
        id: input.id,
        fixtureId: input.fixtureId,
        fileName: input.fileName,
        revision,
        stateSetupId: input.stateSetupId,
        tags: input.tags,
        actionType: action.type,
        action: cloneJson(action),
        expectedRejectionCode: 'COMMAND_REJECTED',
        expectedRejectionReason: rejectionReason,
        expectedBeforeStateHash: stateHash,
        expectedAfterStateHash: stateHash,
        source: input.source,
    };
};

const buildRejectionOracleInputs = (): RejectionOracleCaseInput[] => {
    const idleFixture = {
        fixtureId: 'local-pvp-opening',
        fileName: 'local-pvp-opening.replay.json',
        revision: 0,
    };
    const draftFixture = {
        fixtureId: 'buff-draft-opening',
        fileName: 'buff-draft-opening.replay.json',
        revision: 0,
    };
    const fullFixture = {
        fixtureId: 'local-pvp-royal-extra-turn-game-over',
        fileName: 'local-pvp-royal-extra-turn-game-over.replay.json',
    };
    const reserveCardWaitingFixture = {
        fixtureId: 'local-pvp-reserve-cancel',
        fileName: 'local-pvp-reserve-cancel.replay.json',
        revision: 1,
    };
    const reserveDeckWaitingFixture = {
        fixtureId: 'local-pvp-reserve-deck',
        fileName: 'local-pvp-reserve-deck.replay.json',
        revision: 1,
    };
    const privilegeActionFixture = {
        fixtureId: 'local-pvp-privilege',
        fileName: 'local-pvp-privilege.replay.json',
        revision: findPhaseRevision('PRIVILEGE_ACTION'),
    };
    const discardReservedReadyFixture = {
        fixtureId: 'local-pvp-discard-reserved',
        fileName: 'local-pvp-discard-reserved.replay.json',
        revision: (replay: ReplayVNext) =>
            findRevision(
                replay,
                'discard-reserved active buff with owned reserved card',
                (state) =>
                    state.phase === 'IDLE' &&
                    state.playerBuffs?.[state.turn]?.effects?.active === 'discard_reserved' &&
                    state.playerReserved[state.turn].length > 0
            ),
    };
    const wrongPhaseSource =
        'TypeScript oracle wrong-phase rejection coverage; action must preserve replay-state hash.';
    const edgeSource =
        'TypeScript oracle edge rejection coverage; action must preserve replay-state hash.';

    return [
        {
            ...idleFixture,
            id: 'reject-select-buff-idle',
            tags: ['wrong-phase:SELECT_BUFF'],
            action: () => ({ type: 'SELECT_BUFF', payload: { buffId: 'privilege_favor' } }),
            source: wrongPhaseSource,
        },
        {
            ...draftFixture,
            id: 'reject-take-gems-draft',
            tags: ['wrong-phase:TAKE_GEMS'],
            action: (state) => ({
                type: 'TAKE_GEMS',
                payload: { coords: [findCollectibleCoord(state)] },
            }),
            source: wrongPhaseSource,
        },
        {
            ...draftFixture,
            id: 'reject-replenish-draft',
            tags: ['wrong-phase:REPLENISH'],
            action: () => ({ type: 'REPLENISH' }),
            source: wrongPhaseSource,
        },
        {
            ...idleFixture,
            id: 'reject-take-bonus-gem-idle',
            tags: ['wrong-phase:TAKE_BONUS_GEM'],
            action: (state) => ({ type: 'TAKE_BONUS_GEM', payload: findCollectibleCoord(state) }),
            source: wrongPhaseSource,
        },
        {
            ...idleFixture,
            id: 'reject-discard-gem-idle',
            tags: ['wrong-phase:DISCARD_GEM'],
            action: () => ({ type: 'DISCARD_GEM', payload: 'red' }),
            source: wrongPhaseSource,
        },
        {
            ...idleFixture,
            id: 'reject-steal-gem-idle',
            tags: ['wrong-phase:STEAL_GEM'],
            action: () => ({ type: 'STEAL_GEM', payload: { gemId: 'red' } }),
            source: wrongPhaseSource,
        },
        {
            ...draftFixture,
            id: 'reject-initiate-buy-joker-draft',
            tags: ['wrong-phase:INITIATE_BUY_JOKER'],
            action: (state) => {
                const { card, marketInfo } = buildMarketCardPayload(state);
                return {
                    type: 'INITIATE_BUY_JOKER',
                    payload: { card, source: 'market', marketInfo },
                };
            },
            source: wrongPhaseSource,
        },
        {
            ...draftFixture,
            id: 'reject-buy-card-draft',
            tags: ['wrong-phase:BUY_CARD'],
            action: (state) => {
                const { card, marketInfo } = buildMarketCardPayload(state);
                return {
                    type: 'BUY_CARD',
                    payload: { card, source: 'market', marketInfo },
                };
            },
            source: wrongPhaseSource,
        },
        {
            ...draftFixture,
            id: 'reject-initiate-reserve-draft',
            tags: ['wrong-phase:INITIATE_RESERVE'],
            action: (state) => {
                const { card, marketInfo } = buildMarketCardPayload(state);
                return {
                    type: 'INITIATE_RESERVE',
                    payload: {
                        card,
                        level: marketInfo.level,
                        idx: marketInfo.idx,
                    },
                };
            },
            source: wrongPhaseSource,
        },
        {
            ...draftFixture,
            id: 'reject-initiate-reserve-deck-draft',
            tags: ['wrong-phase:INITIATE_RESERVE_DECK'],
            action: () => ({ type: 'INITIATE_RESERVE_DECK', payload: { level: 1 } }),
            source: wrongPhaseSource,
        },
        {
            ...idleFixture,
            id: 'reject-cancel-reserve-idle',
            tags: ['wrong-phase:CANCEL_RESERVE'],
            action: () => ({ type: 'CANCEL_RESERVE' }),
            source: wrongPhaseSource,
        },
        {
            ...draftFixture,
            id: 'reject-reserve-card-draft',
            tags: ['wrong-phase:RESERVE_CARD'],
            action: (state) => {
                const { card, marketInfo } = buildMarketCardPayload(state);
                return {
                    type: 'RESERVE_CARD',
                    payload: {
                        card,
                        level: marketInfo.level,
                        idx: marketInfo.idx,
                    },
                };
            },
            source: wrongPhaseSource,
        },
        {
            ...draftFixture,
            id: 'reject-reserve-deck-draft',
            tags: ['wrong-phase:RESERVE_DECK'],
            action: () => ({ type: 'RESERVE_DECK', payload: { level: 1 } }),
            source: wrongPhaseSource,
        },
        {
            ...draftFixture,
            id: 'reject-discard-reserved-draft',
            tags: ['wrong-phase:DISCARD_RESERVED'],
            action: () => ({ type: 'DISCARD_RESERVED', payload: { cardId: 'missing-card' } }),
            source: wrongPhaseSource,
        },
        {
            ...draftFixture,
            id: 'reject-activate-privilege-draft',
            tags: ['wrong-phase:ACTIVATE_PRIVILEGE'],
            action: () => ({ type: 'ACTIVATE_PRIVILEGE' }),
            source: wrongPhaseSource,
        },
        {
            ...idleFixture,
            id: 'reject-use-privilege-idle',
            tags: ['wrong-phase:USE_PRIVILEGE'],
            action: (state) => ({ type: 'USE_PRIVILEGE', payload: findCollectibleCoord(state) }),
            source: wrongPhaseSource,
        },
        {
            ...idleFixture,
            id: 'reject-cancel-privilege-idle',
            tags: ['wrong-phase:CANCEL_PRIVILEGE'],
            action: () => ({ type: 'CANCEL_PRIVILEGE' }),
            source: wrongPhaseSource,
        },
        {
            ...idleFixture,
            id: 'reject-select-royal-idle',
            tags: ['wrong-phase:SELECT_ROYAL_CARD'],
            action: (state) => {
                const card = state.royalDeck[0];
                if (!card) {
                    throw new Error('Rejection oracle could not find a royal card.');
                }
                return { type: 'SELECT_ROYAL_CARD', payload: { card: cloneJson(card) } };
            },
            source: wrongPhaseSource,
        },
        {
            ...idleFixture,
            id: 'reject-reroll-draft-pool-idle',
            tags: ['wrong-phase:REROLL_DRAFT_POOL'],
            action: () => ({ type: 'REROLL_DRAFT_POOL', payload: { level: 1 } }),
            source: wrongPhaseSource,
        },
        {
            ...draftFixture,
            id: 'reject-select-buff-unavailable',
            tags: ['edge:SELECT_BUFF:unavailable'],
            action: () => ({ type: 'SELECT_BUFF', payload: { buffId: 'missing-buff' } }),
            source: edgeSource,
        },
        {
            ...idleFixture,
            id: 'reject-replenish-empty-bag',
            stateSetupId: 'empty-bag',
            tags: ['edge:REPLENISH:empty-bag'],
            action: () => ({ type: 'REPLENISH' }),
            source: edgeSource,
        },
        {
            ...idleFixture,
            id: 'reject-take-gems-empty-selection',
            tags: ['edge:TAKE_GEMS:empty'],
            action: () => ({ type: 'TAKE_GEMS', payload: { coords: [] } }),
            source: edgeSource,
        },
        {
            ...idleFixture,
            id: 'reject-take-gems-gold-cell',
            tags: ['edge:TAKE_GEMS:gold-cell'],
            action: (state) => ({ type: 'TAKE_GEMS', payload: { coords: [findGoldCoord(state)] } }),
            source: edgeSource,
        },
        {
            ...idleFixture,
            id: 'reject-take-gems-gapped-selection',
            tags: ['edge:TAKE_GEMS:gapped'],
            action: () => ({
                type: 'TAKE_GEMS',
                payload: {
                    coords: [
                        { r: 0, c: 0 },
                        { r: 0, c: 2 },
                    ],
                },
            }),
            source: edgeSource,
        },
        {
            ...fullFixture,
            revision: findPhaseRevision('BONUS_ACTION'),
            id: 'reject-take-bonus-gem-wrong-color',
            tags: ['edge:TAKE_BONUS_GEM:wrong-color'],
            action: (state) => ({ type: 'TAKE_BONUS_GEM', payload: findWrongBonusCoord(state) }),
            source: edgeSource,
        },
        {
            ...fullFixture,
            revision: findPhaseRevision('BONUS_ACTION'),
            id: 'reject-take-bonus-gem-unavailable-cell',
            tags: ['edge:TAKE_BONUS_GEM:unavailable-cell'],
            action: (state) => ({ type: 'TAKE_BONUS_GEM', payload: findEmptyCoord(state) }),
            source: edgeSource,
        },
        {
            ...fullFixture,
            revision: findPhaseRevision('DISCARD_EXCESS_GEMS'),
            id: 'reject-discard-gem-not-owned',
            tags: ['edge:DISCARD_GEM:not-owned'],
            action: (state) => ({
                type: 'DISCARD_GEM',
                payload: findUnownedGemColor(state, state.turn),
            }),
            source: edgeSource,
        },
        {
            ...fullFixture,
            revision: findPhaseRevision('STEAL_ACTION'),
            id: 'reject-steal-gem-gold',
            tags: ['edge:STEAL_GEM:gold'],
            action: () => ({ type: 'STEAL_GEM', payload: { gemId: 'gold' } }),
            source: edgeSource,
        },
        {
            ...fullFixture,
            revision: findPhaseRevision('STEAL_ACTION'),
            id: 'reject-steal-gem-not-owned',
            tags: ['edge:STEAL_GEM:not-owned'],
            action: (state) => ({
                type: 'STEAL_GEM',
                payload: {
                    gemId: findUnownedGemColor(state, state.turn === 'p1' ? 'p2' : 'p1'),
                },
            }),
            source: edgeSource,
        },
        {
            ...idleFixture,
            id: 'reject-initiate-buy-joker-non-joker',
            tags: ['edge:INITIATE_BUY_JOKER:non-joker'],
            action: (state) => {
                const { card, marketInfo } = buildNonJokerMarketCardPayload(state);
                return {
                    type: 'INITIATE_BUY_JOKER',
                    payload: { card, source: 'market', marketInfo },
                };
            },
            source: edgeSource,
        },
        {
            ...idleFixture,
            id: 'reject-buy-card-market-mismatch',
            tags: ['edge:BUY_CARD:market-mismatch'],
            action: (state) => {
                const { card, marketInfo } = buildMismatchedMarketCardPayload(state);
                return {
                    type: 'BUY_CARD',
                    payload: { card, source: 'market', marketInfo },
                };
            },
            source: edgeSource,
        },
        {
            ...idleFixture,
            id: 'reject-buy-card-reserved-not-owned',
            tags: ['edge:BUY_CARD:reserved-not-owned'],
            action: (state) => {
                const { card } = buildMarketCardPayload(state);
                return {
                    type: 'BUY_CARD',
                    payload: { card, source: 'reserved' },
                };
            },
            source: edgeSource,
        },
        {
            ...idleFixture,
            id: 'reject-initiate-reserve-market-mismatch',
            tags: ['edge:INITIATE_RESERVE:market-mismatch'],
            action: (state) => {
                const { card, marketInfo } = buildMismatchedMarketCardPayload(state);
                return {
                    type: 'INITIATE_RESERVE',
                    payload: {
                        card,
                        level: marketInfo.level,
                        idx: marketInfo.idx,
                    },
                };
            },
            source: edgeSource,
        },
        {
            ...idleFixture,
            id: 'reject-initiate-reserve-deck-empty-deck',
            stateSetupId: 'empty-deck',
            tags: ['edge:INITIATE_RESERVE_DECK:empty-deck'],
            action: () => ({ type: 'INITIATE_RESERVE_DECK', payload: { level: 1 } }),
            source: edgeSource,
        },
        {
            ...reserveCardWaitingFixture,
            id: 'reject-reserve-card-missing-gold',
            tags: ['edge:RESERVE_CARD:missing-gold'],
            action: (state) => {
                const pendingReserve = state.pendingReserve;
                if (!pendingReserve?.card || pendingReserve.isDeck) {
                    throw new Error('Rejection oracle expected a pending card reserve.');
                }
                return {
                    type: 'RESERVE_CARD',
                    payload: {
                        card: cloneJson(pendingReserve.card),
                        level: pendingReserve.level,
                        idx: pendingReserve.idx,
                    },
                };
            },
            source: edgeSource,
        },
        {
            ...reserveCardWaitingFixture,
            id: 'reject-reserve-card-non-gold',
            tags: ['edge:RESERVE_CARD:non-gold'],
            action: (state) => {
                const pendingReserve = state.pendingReserve;
                if (!pendingReserve?.card || pendingReserve.isDeck) {
                    throw new Error('Rejection oracle expected a pending card reserve.');
                }
                return {
                    type: 'RESERVE_CARD',
                    payload: {
                        card: cloneJson(pendingReserve.card),
                        level: pendingReserve.level,
                        idx: pendingReserve.idx,
                        goldCoords: findCollectibleCoord(state),
                    },
                };
            },
            source: edgeSource,
        },
        {
            ...reserveCardWaitingFixture,
            id: 'reject-reserve-card-pending-mismatch',
            tags: ['edge:RESERVE_CARD:pending-mismatch'],
            action: (state) => {
                const { card, marketInfo } = buildMismatchedMarketCardPayload(state);
                return {
                    type: 'RESERVE_CARD',
                    payload: {
                        card,
                        level: marketInfo.level,
                        idx: marketInfo.idx,
                        goldCoords: findGoldCoord(state),
                    },
                };
            },
            source: edgeSource,
        },
        {
            ...reserveCardWaitingFixture,
            id: 'reject-reserve-card-full-row',
            stateSetupId: 'full-reserve-row',
            tags: ['edge:RESERVE_CARD:full-row'],
            action: (state) => {
                const pendingReserve = state.pendingReserve;
                if (!pendingReserve?.card || pendingReserve.isDeck) {
                    throw new Error('Rejection oracle expected a pending card reserve.');
                }
                return {
                    type: 'RESERVE_CARD',
                    payload: {
                        card: cloneJson(pendingReserve.card),
                        level: pendingReserve.level,
                        idx: pendingReserve.idx,
                        goldCoords: findGoldCoord(state),
                    },
                };
            },
            source: edgeSource,
        },
        {
            ...reserveDeckWaitingFixture,
            id: 'reject-reserve-deck-missing-gold',
            tags: ['edge:RESERVE_DECK:missing-gold'],
            action: (state) => ({
                type: 'RESERVE_DECK',
                payload: { level: state.pendingReserve?.level ?? 1 },
            }),
            source: edgeSource,
        },
        {
            ...reserveDeckWaitingFixture,
            id: 'reject-reserve-deck-non-gold',
            tags: ['edge:RESERVE_DECK:non-gold'],
            action: (state) => ({
                type: 'RESERVE_DECK',
                payload: {
                    level: state.pendingReserve?.level ?? 1,
                    goldCoords: findCollectibleCoord(state),
                },
            }),
            source: edgeSource,
        },
        {
            ...reserveCardWaitingFixture,
            id: 'reject-reserve-deck-pending-mismatch',
            tags: ['edge:RESERVE_DECK:pending-mismatch'],
            action: () => ({
                type: 'RESERVE_DECK',
                payload: { level: 1, goldCoords: { r: 0, c: 0 } },
            }),
            source: edgeSource,
        },
        {
            ...reserveDeckWaitingFixture,
            id: 'reject-reserve-deck-full-row',
            stateSetupId: 'full-reserve-row',
            tags: ['edge:RESERVE_DECK:full-row'],
            action: (state) => ({
                type: 'RESERVE_DECK',
                payload: {
                    level: state.pendingReserve?.level ?? 1,
                    goldCoords: findGoldCoord(state),
                },
            }),
            source: edgeSource,
        },
        {
            ...idleFixture,
            id: 'reject-discard-reserved-no-ability',
            tags: ['edge:DISCARD_RESERVED:no-ability'],
            action: () => ({ type: 'DISCARD_RESERVED', payload: { cardId: 'missing-card' } }),
            source: edgeSource,
        },
        {
            ...discardReservedReadyFixture,
            id: 'reject-discard-reserved-not-owned',
            tags: ['edge:DISCARD_RESERVED:not-owned'],
            action: () => ({ type: 'DISCARD_RESERVED', payload: { cardId: 'missing-card' } }),
            source: edgeSource,
        },
        {
            ...idleFixture,
            id: 'reject-activate-privilege-no-charge',
            tags: ['edge:ACTIVATE_PRIVILEGE:no-charge'],
            action: () => ({ type: 'ACTIVATE_PRIVILEGE' }),
            source: edgeSource,
        },
        {
            ...idleFixture,
            id: 'reject-activate-privilege-no-target',
            stateSetupId: 'empty-board-with-privilege',
            tags: ['edge:ACTIVATE_PRIVILEGE:no-target'],
            action: () => ({ type: 'ACTIVATE_PRIVILEGE' }),
            source: edgeSource,
        },
        {
            ...privilegeActionFixture,
            id: 'reject-use-privilege-no-charge',
            stateSetupId: 'privilege-action-no-charge',
            tags: ['edge:USE_PRIVILEGE:no-charge'],
            action: (state) => ({ type: 'USE_PRIVILEGE', payload: findCollectibleCoord(state) }),
            source: edgeSource,
        },
        {
            ...privilegeActionFixture,
            id: 'reject-use-privilege-invalid-target',
            tags: ['edge:USE_PRIVILEGE:invalid-target'],
            action: (state) => ({ type: 'USE_PRIVILEGE', payload: findGoldCoord(state) }),
            source: edgeSource,
        },
        {
            ...fullFixture,
            revision: findPhaseRevision('SELECT_ROYAL'),
            id: 'reject-select-royal-unavailable',
            tags: ['edge:SELECT_ROYAL_CARD:unavailable'],
            action: (state) => {
                const card = state.royalDeck[0];
                if (!card) {
                    throw new Error('Rejection oracle could not find a royal card.');
                }
                return {
                    type: 'SELECT_ROYAL_CARD',
                    payload: { card: { ...cloneJson(card), id: `missing-${card.id}` } },
                };
            },
            source: edgeSource,
        },
        {
            ...idleFixture,
            id: 'reject-peek-deck-no-ability',
            tags: ['edge:PEEK_DECK:no-ability'],
            action: () => ({ type: 'PEEK_DECK', payload: { level: 1 } }),
            source: edgeSource,
        },
        {
            ...idleFixture,
            id: 'reject-close-modal-without-modal',
            tags: ['edge:CLOSE_MODAL:no-modal'],
            action: () => ({ type: 'CLOSE_MODAL' }),
            source: edgeSource,
        },
        {
            fixtureId: 'local-pvp-peek-modal',
            fileName: 'local-pvp-peek-modal.replay.json',
            revision: (replay: ReplayVNext) =>
                findRevision(replay, 'active peek modal', (state) => Boolean(state.activeModal)),
            id: 'reject-close-modal-blocked-actor',
            stateSetupId: 'blocked-peek-modal',
            tags: ['edge:CLOSE_MODAL:blocked'],
            action: () => ({ type: 'CLOSE_MODAL' }),
            source: edgeSource,
        },
        {
            ...draftFixture,
            id: 'reject-reroll-draft-pool-online',
            stateSetupId: 'online-draft',
            tags: ['edge:REROLL_DRAFT_POOL:online'],
            action: () => ({ type: 'REROLL_DRAFT_POOL', payload: { level: 1 } }),
            source: edgeSource,
        },
        {
            ...draftFixture,
            id: 'reject-reroll-draft-pool-p2-before-p1-selection',
            stateSetupId: 'p2-draft-before-p1-selection',
            tags: ['edge:REROLL_DRAFT_POOL:p2-before-p1'],
            action: () => ({ type: 'REROLL_DRAFT_POOL', payload: { level: 1 } }),
            source: edgeSource,
        },
    ];
};

const buildRejectionOracleManifest = (fixtures: GoldenFixture[]) => {
    const fixtureById = new Map(fixtures.map((fixture) => [fixture.id, fixture]));
    const cases = buildRejectionOracleInputs().map((input) =>
        buildRejectionOracleCase(fixtureById, input)
    );

    return {
        schemaVersion: 1,
        generatedAt: '2026-05-11T00:00:00.000Z',
        generatedBy: 'tools/migration/export-unity-fixtures.ts',
        rulesVersion: RULES_VERSION,
        replaySchemaVersion: REPLAY_SCHEMA_VERSION,
        hashContract: {
            id: 'replay-state-hash-v1',
            implementation: 'packages/shared/src/replay/stateHash.ts',
            serializer: 'serializeReplayStateSnapshot + stableJsonStringify',
        },
        requiredCoverage: REQUIRED_REJECTION_COVERAGE,
        cases,
    };
};

const main = async () => {
    const { outDir } = parseCliOptions();
    const fixtures: GoldenFixture[] = [
        {
            id: 'local-pvp-opening',
            fileName: 'local-pvp-opening.replay.json',
            tags: ['local-pvp-opening'],
            replay: buildOpeningReplay(),
            source: 'Deterministic INIT replay with no post-bootstrap events.',
        },
        {
            id: 'buff-draft-opening',
            fileName: 'buff-draft-opening.replay.json',
            tags: ['buff'],
            replay: buildBuffDraftReplay(),
            source: 'Deterministic INIT_DRAFT replay with both players selecting buffs.',
        },
        {
            id: 'local-pvp-royal-extra-turn-game-over',
            fileName: 'local-pvp-royal-extra-turn-game-over.replay.json',
            tags: ['reserve', 'buy', 'royal-selection', 'royal-handoff', 'extra-turn', 'game-over'],
            replay: buildFullCoverageReplay(),
            source: 'Deterministic AI local PvP replay selected for reserve/buy/royal extra-turn/game-over coverage.',
        },
        {
            id: 'local-pvp-joker-color-selection',
            fileName: 'local-pvp-joker-color-selection.replay.json',
            tags: ['joker-buy'],
            replay: buildJokerColorSelectionReplay(),
            source: 'Deterministic local PvP replay selected for the two-step Joker bonus-color selection and buy command path.',
        },
        {
            id: 'local-pvp-joker-reserved-buy',
            fileName: 'local-pvp-joker-reserved-buy.replay.json',
            tags: ['buy', 'reserved-buy', 'game-over'],
            replay: buildJokerReservedBuyReplay(),
            source: 'Deterministic AI local PvP replay selected for Joker buy plus reserved-card buy coverage.',
        },
        {
            id: 'local-pvp-reserve-cancel',
            fileName: 'local-pvp-reserve-cancel.replay.json',
            tags: ['reserve-cancel'],
            replay: buildReserveCancelReplay(),
            source: 'Deterministic local PvP replay selected for reserve initiation and cancel coverage.',
        },
        {
            id: 'local-pvp-reserve-deck',
            fileName: 'local-pvp-reserve-deck.replay.json',
            tags: ['reserve-deck'],
            replay: buildReserveDeckReplay(),
            source: 'Deterministic local PvP replay selected for deck reserve initiation and gold resolution coverage.',
        },
        {
            id: 'local-pvp-privilege',
            fileName: 'local-pvp-privilege.replay.json',
            tags: ['privilege', 'buff'],
            replay: buildPrivilegeReplay(),
            source: 'Deterministic local PvP replay selected for privilege activation, cancel, and use coverage.',
        },
        {
            id: 'local-pvp-peek-modal',
            fileName: 'local-pvp-peek-modal.replay.json',
            tags: ['peek-modal', 'buff'],
            replay: buildPeekModalReplay(),
            source: 'Deterministic local PvP replay selected for deck peek modal open and close coverage.',
        },
        {
            id: 'local-pvp-discard-reserved',
            fileName: 'local-pvp-discard-reserved.replay.json',
            tags: ['reserve', 'discard-reserved', 'buff'],
            replay: buildDiscardReservedReplay(),
            source: 'Deterministic local PvP replay selected for Puppet Master reserved-card discard coverage.',
        },
        {
            id: 'local-pvp-draft-reroll',
            fileName: 'local-pvp-draft-reroll.replay.json',
            tags: ['draft-reroll', 'draft-p2-reroll', 'buff'],
            replay: buildDraftRerollReplay(),
            source: 'Deterministic local PvP replay selected for ordered P1 and P2 offline draft-pool reroll coverage.',
        },
    ];
    const manifest = buildFixtureManifest(fixtures);
    const rejectionManifest = buildRejectionOracleManifest(fixtures);

    await mkdir(outDir, { recursive: true });
    await Promise.all(
        fixtures.map(async (fixture) =>
            writeFile(path.join(outDir, fixture.fileName), await formatJson(fixture.replay), 'utf8')
        )
    );
    const manifestJson = await formatJson(manifest);
    const rejectionManifestJson = await formatJson(rejectionManifest);
    await writeFile(path.join(outDir, 'manifest.json'), manifestJson);
    await writeFile(path.join(outDir, 'rejection-manifest.json'), rejectionManifestJson);

    process.stdout.write(manifestJson);
};

main().catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exit(1);
});
