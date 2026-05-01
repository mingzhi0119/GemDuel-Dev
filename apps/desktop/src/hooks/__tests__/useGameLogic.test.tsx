import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { GameAction, GameState, GemCoord } from '@gemduel/shared/types';
import { useGameLogic } from '../useGameLogic';

const mocks = vi.hoisted(() => ({
    useGameState: vi.fn(),
    useGameNetwork: vi.fn(),
    useGameInteractions: vi.fn(),
    useAIController: vi.fn(),
    useHistoryFlattening: vi.fn(),
    usePlayableHistoryControls: vi.fn(),
    buildReplayRecorderFromHistory: vi.fn(),
    buildReplayFullSync: vi.fn(),
}));

vi.mock('../useGameState', () => ({
    useGameState: (...args: unknown[]) => mocks.useGameState(...args),
}));

vi.mock('../useGameNetwork', () => ({
    useGameNetwork: (...args: unknown[]) => mocks.useGameNetwork(...args),
}));

vi.mock('../useGameInteractions', () => ({
    useGameInteractions: (...args: unknown[]) => mocks.useGameInteractions(...args),
}));

vi.mock('../useAIController', () => ({
    useAIController: (...args: unknown[]) => mocks.useAIController(...args),
}));

vi.mock('../useHistoryFlattening', () => ({
    useHistoryFlattening: (...args: unknown[]) => mocks.useHistoryFlattening(...args),
}));

vi.mock('../usePlayableHistoryControls', () => ({
    usePlayableHistoryControls: (...args: unknown[]) => mocks.usePlayableHistoryControls(...args),
}));

vi.mock('@gemduel/shared/replay', () => ({
    buildReplayRecorderFromHistory: (...args: unknown[]) =>
        mocks.buildReplayRecorderFromHistory(...args),
    buildReplayFullSync: (...args: unknown[]) => mocks.buildReplayFullSync(...args),
}));

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe('useGameLogic', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;
    let currentResult: ReturnType<typeof useGameLogic> | null = null;

    const renderHarness = (
        shouldConnect = false,
        targetIP = 'localhost',
        isReviewing = false,
        targetPort = 9000
    ) => {
        const Harness = () => {
            currentResult = useGameLogic(shouldConnect, targetIP, isReviewing, targetPort);
            return null;
        };

        if (!container) {
            container = document.createElement('div');
            document.body.appendChild(container);
            root = createRoot(container);
        }

        act(() => {
            root?.render(React.createElement(Harness));
        });
    };

    beforeEach(() => {
        currentResult = null;
        vi.clearAllMocks();
    });

    afterEach(() => {
        act(() => {
            root?.unmount();
        });
        container?.remove();
        root = null;
        container = null;
    });

    it('wires state, networking, interaction handlers, and history controls into the public controller', () => {
        const gameState = {
            mode: 'ONLINE_MULTIPLAYER',
            phase: 'MAIN_PHASE',
            turn: 'p1',
            isHost: true,
        } as unknown as GameState;
        const dispatch = vi.fn<(action: GameAction) => void>();
        const clearAndInit = vi.fn();
        const importHistory = vi.fn();
        const historyControls = {
            clearAndInit,
            importHistory,
            currentIndex: 0,
            historyLength: 2,
            history: [{ type: 'INIT' } as GameAction, { type: 'CLOSE_MODAL' } as GameAction],
            historySource: 'live' as const,
        };
        const networkDispatch = vi.fn<(action: GameAction) => void>();
        const online = {
            statusNotice: {
                level: 'info',
                message: 'network status',
            },
            authoritativeReplayRecorder: null,
        };
        const selectedGems = [{ r: 0, c: 1 }] as GemCoord[];
        const interactions = {
            selectedGems,
            errorMsg: 'interaction error',
            handlers: {
                handleGemClick: vi.fn(),
            },
            getters: {
                isSelected: vi.fn(),
            },
        };
        const playableHistoryControls = {
            canUndo: true,
            canRedo: false,
        };

        mocks.useGameState.mockReturnValue({
            gameState,
            dispatch,
            historyControls,
        });
        mocks.buildReplayRecorderFromHistory.mockReturnValue({ init: { actionType: 'INIT' } });
        mocks.buildReplayFullSync.mockReturnValue({ replay: { schemaVersion: '1.0' } });
        mocks.useGameNetwork.mockReturnValue({
            online,
            networkDispatch,
        });
        mocks.useGameInteractions.mockReturnValue(interactions);
        mocks.usePlayableHistoryControls.mockReturnValue(playableHistoryControls);

        renderHarness(true, 'peer.example', true, 9100);

        expect(mocks.useGameNetwork).toHaveBeenCalledWith(
            gameState,
            dispatch,
            clearAndInit,
            true,
            'peer.example',
            9100,
            { init: { actionType: 'INIT' } }
        );
        expect(mocks.useGameInteractions).toHaveBeenCalledWith(
            gameState,
            networkDispatch,
            0,
            true,
            true
        );
        expect(mocks.useAIController).toHaveBeenCalledWith(gameState, networkDispatch, true, true);
        expect(mocks.useHistoryFlattening).toHaveBeenCalledWith(gameState, historyControls, true);
        expect(mocks.usePlayableHistoryControls).toHaveBeenCalledWith(
            gameState.mode,
            historyControls
        );

        expect(currentResult?.state).toMatchObject({
            ...gameState,
            selectedGems,
            errorMsg: 'interaction error',
        });
        expect(currentResult?.handlers).toMatchObject({
            ...interactions.handlers,
            importHistory,
        });
        expect(currentResult?.getters).toBe(interactions.getters);
        expect(currentResult?.historyControls).toBe(playableHistoryControls);
        expect(currentResult?.online).toBe(online);
        expect(currentResult?.replay.currentReplay).toEqual({ schemaVersion: '1.0' });
    });

    it('locks gameplay interactions while the replay counter is not on the latest step', () => {
        const gameState = {
            mode: 'LOCAL_PVP',
            phase: 'MAIN_PHASE',
            turn: 'p1',
        } as unknown as GameState;
        const dispatch = vi.fn<(action: GameAction) => void>();
        const historyControls = {
            clearAndInit: vi.fn(),
            importHistory: vi.fn(),
            currentIndex: 0,
            historyLength: 2,
            history: [{ type: 'INIT' } as GameAction, { type: 'CLOSE_MODAL' } as GameAction],
            historySource: 'live' as const,
        };
        const networkDispatch = vi.fn<(action: GameAction) => void>();

        mocks.useGameState.mockReturnValue({
            gameState,
            dispatch,
            historyControls,
        });
        mocks.buildReplayRecorderFromHistory.mockReturnValue({ init: { actionType: 'INIT' } });
        mocks.buildReplayFullSync.mockReturnValue({ replay: { schemaVersion: '1.0' } });
        mocks.useGameNetwork.mockReturnValue({
            online: {
                statusNotice: null,
                authoritativeReplayRecorder: null,
            },
            networkDispatch,
        });
        mocks.useGameInteractions.mockReturnValue({
            selectedGems: [],
            errorMsg: null,
            handlers: {},
            getters: {},
        });
        mocks.usePlayableHistoryControls.mockReturnValue(historyControls);

        renderHarness(false, 'localhost', false);

        expect(mocks.useGameInteractions).toHaveBeenCalledWith(
            gameState,
            networkDispatch,
            0,
            false,
            true
        );
        expect(mocks.useAIController).toHaveBeenCalledWith(gameState, networkDispatch, true, true);
    });

    it('falls back to the online status notice when interactions do not expose an error', () => {
        const gameState = {
            mode: 'LOCAL_PVP',
            phase: 'IDLE',
            turn: 'p2',
        } as unknown as GameState;
        const dispatch = vi.fn<(action: GameAction) => void>();
        const historyControls = {
            clearAndInit: vi.fn(),
            importHistory: vi.fn(),
            currentIndex: 1,
            historyLength: 2,
            history: [{ type: 'INIT' } as GameAction, { type: 'CLOSE_MODAL' } as GameAction],
            historySource: 'live' as const,
        };
        const networkDispatch = vi.fn<(action: GameAction) => void>();

        mocks.useGameState.mockReturnValue({
            gameState,
            dispatch,
            historyControls,
        });
        mocks.buildReplayRecorderFromHistory.mockReturnValue({ init: { actionType: 'INIT' } });
        mocks.buildReplayFullSync.mockReturnValue({ replay: { schemaVersion: '1.0' } });
        mocks.useGameNetwork.mockReturnValue({
            online: {
                statusNotice: {
                    level: 'warn',
                    message: 'peer lagging',
                },
                authoritativeReplayRecorder: null,
            },
            networkDispatch,
        });
        mocks.useGameInteractions.mockReturnValue({
            selectedGems: [],
            errorMsg: null,
            handlers: {},
            getters: {},
        });
        mocks.usePlayableHistoryControls.mockReturnValue(historyControls);

        renderHarness();

        expect(mocks.useAIController).toHaveBeenCalledWith(
            gameState,
            networkDispatch,
            false,
            false
        );
        expect(currentResult?.state.errorMsg).toBe('peer lagging');
    });
});
