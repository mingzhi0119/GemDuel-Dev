import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { INITIAL_STATE_SKELETON } from '../../logic/initialState';
import type { GameAction, GameState } from '../../types';
import { useGameState } from '../useGameState';

const mocks = vi.hoisted(() => ({
    actionHistoryState: null as ReturnType<typeof createActionHistoryState> | null,
    applyAction: vi.fn(),
}));

vi.mock('../useActionHistory', () => ({
    useActionHistory: () => mocks.actionHistoryState,
}));

vi.mock('../../logic/gameReducer', () => ({
    applyAction: (...args: unknown[]) => mocks.applyAction(...args),
}));

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const createActionHistoryState = (overrides: Partial<Record<string, unknown>> = {}) => ({
    history: [] as GameAction[],
    currentIndex: -1,
    recordAction: vi.fn(),
    undo: vi.fn(),
    redo: vi.fn(),
    canUndo: false,
    canRedo: false,
    jumpToStep: vi.fn(),
    importHistory: vi.fn(),
    clearAndInit: vi.fn(),
    ...overrides,
});

describe('useGameState', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;
    let currentResult: ReturnType<typeof useGameState> | null = null;
    const Harness = () => {
        currentResult = useGameState();
        return null;
    };

    const renderHarness = () => {
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
        mocks.applyAction.mockReset();
    });

    afterEach(() => {
        act(() => {
            root?.unmount();
        });
        container?.remove();
        root = null;
        container = null;
        vi.restoreAllMocks();
    });

    it('returns the initial skeleton when history is empty and forwards history controls', () => {
        const recordAction = vi.fn();
        const undo = vi.fn();
        const redo = vi.fn();
        const jumpToStep = vi.fn();
        const importHistory = vi.fn();
        const clearAndInit = vi.fn();

        mocks.actionHistoryState = createActionHistoryState({
            recordAction,
            undo,
            redo,
            canUndo: true,
            canRedo: true,
            jumpToStep,
            importHistory,
            clearAndInit,
        });

        renderHarness();

        expect(currentResult?.gameState).toBe(INITIAL_STATE_SKELETON);

        const action = { type: 'CLOSE_MODAL' } as GameAction;
        act(() => {
            currentResult?.dispatch(action);
        });

        expect(recordAction).toHaveBeenCalledWith(action);
        expect(currentResult?.historyControls).toMatchObject({
            undo,
            redo,
            canUndo: true,
            canRedo: true,
            jumpToStep,
            importHistory,
            clearAndInit,
            currentIndex: -1,
            historyLength: 0,
            history: [],
        });
    });

    it('reuses cached state between renders and clears the cache when the first action changes', () => {
        const firstAction = { type: 'INIT', payload: { mode: 'LOCAL_PVP' } } as GameAction;
        const secondAction = { type: 'CLOSE_MODAL' } as GameAction;
        const createDerivedState = (step: number, actionType: string) =>
            ({
                ...INITIAL_STATE_SKELETON,
                turn: step % 2 === 0 ? 'p1' : 'p2',
                toastMessage: `${actionType}-${step}`,
            }) as GameState;

        mocks.applyAction.mockImplementation((state: GameState, action: GameAction) =>
            createDerivedState(
                state.toastMessage ? Number(state.toastMessage.split('-')[1]) + 1 : 1,
                action.type
            )
        );

        mocks.actionHistoryState = createActionHistoryState({
            history: [firstAction, secondAction],
            currentIndex: 0,
        });

        renderHarness();

        expect(mocks.applyAction).toHaveBeenCalledTimes(1);
        expect(currentResult?.gameState.toastMessage).toBe('INIT-1');

        mocks.actionHistoryState = createActionHistoryState({
            history: [firstAction, secondAction],
            currentIndex: 1,
        });

        renderHarness();

        expect(mocks.applyAction).toHaveBeenCalledTimes(2);
        expect(currentResult?.gameState.toastMessage).toBe('CLOSE_MODAL-2');

        mocks.actionHistoryState = createActionHistoryState({
            history: [{ ...firstAction }, secondAction],
            currentIndex: 1,
        });

        renderHarness();

        expect(mocks.applyAction).toHaveBeenCalledTimes(4);
        expect(currentResult?.gameState.toastMessage).toBe('CLOSE_MODAL-2');
    });
});
