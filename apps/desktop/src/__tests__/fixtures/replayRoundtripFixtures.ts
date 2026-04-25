import { BUFFS } from '@gemduel/shared/constants';
import { applyAction } from '@gemduel/shared/logic/gameReducer';
import { createGameSetupPayload } from '@gemduel/shared/logic/gameSetup';
import {
    buildPeekDeckAction,
    buildSelectBuffAction,
} from '@gemduel/shared/logic/interactionCommands';
import {
    buildReplayRecorderFromHistory,
    loadReplaySession,
    saveReplayVNext,
    simulateAiVsAiReplay,
    type LoadedReplaySession,
    type ReplayVNext,
} from '@gemduel/shared/replay';
import type { Card, GameAction, GameState } from '@gemduel/shared/types';

const FIXTURE_GAME_VERSION = '5.2.11';

export interface ReplayRoundtripFixture {
    replay: ReplayVNext;
    session: LoadedReplaySession;
    history: GameAction[];
    states: GameState[];
    exportedJson: string;
}

const reduceHistoryToStates = (history: GameAction[]): GameState[] => {
    const states: GameState[] = [];
    let state: GameState | null = null;

    for (const action of history) {
        const nextState = applyAction(state, action);
        if (!nextState) {
            throw new Error(`Fixture history failed to apply action ${action.type}.`);
        }

        states.push(nextState);
        state = nextState;
    }

    return states;
};

const buildReplayFixtureFromHistory = (
    history: GameAction[],
    createdAt: string
): ReplayRoundtripFixture => {
    const states = reduceHistoryToStates(history);
    const finalState = states.at(-1);
    if (!finalState) {
        throw new Error('Replay fixture history cannot be empty.');
    }

    const recorder = buildReplayRecorderFromHistory(history, FIXTURE_GAME_VERSION, createdAt);
    if (!recorder.init) {
        throw new Error('Replay fixture recorder did not produce an init snapshot.');
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
    const session = loadReplaySession(replay);

    return {
        replay,
        session,
        history: session.history,
        states: reduceHistoryToStates(session.history),
        exportedJson: JSON.stringify(replay),
    };
};

export const createCompletedReplayFixture = (): ReplayRoundtripFixture => {
    const result = simulateAiVsAiReplay({
        gameVersion: FIXTURE_GAME_VERSION,
        mode: 'LOCAL_PVP',
        useBuffs: false,
        maxActions: 40,
        createdAt: '2026-04-22T10:00:00.000Z',
    });

    if (result.status !== 'completed') {
        throw new Error(`Expected completed replay fixture, received ${result.status}.`);
    }

    const session = loadReplaySession(result.replay);

    return {
        replay: result.replay,
        session,
        history: session.history,
        states: reduceHistoryToStates(session.history),
        exportedJson: JSON.stringify(result.replay),
    };
};

export const createSelectCardColorReplayFixture = (): ReplayRoundtripFixture => {
    const setup = createGameSetupPayload('LOCAL_PVP', { useBuffs: false });
    const wildcardCard =
        [
            ...setup.market[1],
            ...setup.market[2],
            ...setup.market[3],
            ...setup.decks[1],
            ...setup.decks[2],
            ...setup.decks[3],
        ].find((card): card is Card => Boolean(card && card.bonusColor === 'gold')) ?? null;

    if (!wildcardCard) {
        throw new Error('Failed to find a real Wild Bonus card for the color-selection fixture.');
    }

    setup.market[1][0] = wildcardCard;

    return buildReplayFixtureFromHistory(
        [
            { type: 'INIT', payload: setup },
            {
                type: 'INITIATE_BUY_JOKER',
                payload: {
                    card: wildcardCard,
                    source: 'market',
                    marketInfo: { level: 1, idx: 0 },
                },
            },
        ],
        '2026-04-22T10:05:00.000Z'
    );
};

export const createPeekModalReplayFixture = (): ReplayRoundtripFixture => {
    const setup = createGameSetupPayload('LOCAL_PVP', { useBuffs: true });
    const initDraftAction: Extract<GameAction, { type: 'INIT_DRAFT' }> = {
        type: 'INIT_DRAFT',
        payload: {
            ...setup,
            draftPool: [BUFFS.INTELLIGENCE.id, BUFFS.HEAD_START.id, BUFFS.INSIGHT.id],
            buffLevel: 1,
        },
    };

    const draftState = applyAction(null, initDraftAction);
    if (!draftState) {
        throw new Error('Failed to initialize the peek replay fixture draft.');
    }

    const p1SelectAction = buildSelectBuffAction(
        BUFFS.INTELLIGENCE.id,
        'red',
        draftState.turn,
        draftState.phase,
        draftState.buffLevel
    );
    const afterP1Selection = applyAction(draftState, p1SelectAction);
    if (!afterP1Selection || !afterP1Selection.p2DraftPool?.length) {
        throw new Error('Peek replay fixture failed to generate the P2 draft pool.');
    }

    const p2SelectAction = buildSelectBuffAction(
        afterP1Selection.p2DraftPool[0]!,
        'red',
        afterP1Selection.turn,
        afterP1Selection.phase,
        afterP1Selection.buffLevel
    );

    return buildReplayFixtureFromHistory(
        [initDraftAction, p1SelectAction, p2SelectAction, buildPeekDeckAction(1)],
        '2026-04-22T10:10:00.000Z'
    );
};
