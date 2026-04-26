import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { INITIAL_STATE_SKELETON } from '@gemduel/shared/logic/initialState';
import type { GameAction, GameState, GemCoord } from '@gemduel/shared/types';
import { useBoardInteractionHandlers } from '../useBoardInteractionHandlers';

const mocks = vi.hoisted(() => ({
    processGemClick: vi.fn(),
    processOpponentGemClick: vi.fn(),
    buildReplenishAction: vi.fn(),
    canActionRunInPhase: vi.fn(),
    getFsmPhaseSurfacePolicy: vi.fn(),
    validateGemSelection: vi.fn(),
    getRandomBasicGemColor: vi.fn(),
}));

vi.mock('@gemduel/shared/logic/interactionManager', () => ({
    processGemClick: (...args: unknown[]) => mocks.processGemClick(...args),
    processOpponentGemClick: (...args: unknown[]) => mocks.processOpponentGemClick(...args),
}));

vi.mock('@gemduel/shared/logic/interactionCommands', () => ({
    buildReplenishAction: (...args: unknown[]) => mocks.buildReplenishAction(...args),
}));

vi.mock('@gemduel/shared/logic/fsm', () => ({
    canActionRunInPhase: (...args: unknown[]) => mocks.canActionRunInPhase(...args),
    getFsmPhaseSurfacePolicy: (...args: unknown[]) => mocks.getFsmPhaseSurfacePolicy(...args),
}));

vi.mock('@gemduel/shared/logic/validators', () => ({
    validateGemSelection: (...args: unknown[]) => mocks.validateGemSelection(...args),
}));

vi.mock('@gemduel/shared/logic/gameSetup', () => ({
    getRandomBasicGemColor: (...args: unknown[]) => mocks.getRandomBasicGemColor(...args),
}));

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const cloneState = () => JSON.parse(JSON.stringify(INITIAL_STATE_SKELETON)) as GameState;

const createState = (overrides: Partial<GameState> = {}): GameState => ({
    ...cloneState(),
    phase: 'IDLE',
    turn: 'p1',
    ...overrides,
});

describe('useBoardInteractionHandlers', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;
    let currentResult: ReturnType<typeof useBoardInteractionHandlers> | null = null;
    let currentProps: Parameters<typeof useBoardInteractionHandlers>[0];

    const renderHarness = () => {
        const Harness = () => {
            currentResult = useBoardInteractionHandlers(currentProps);
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
        currentProps = {
            gameState: createState(),
            canLocalInteract: true,
            networkDispatch: vi.fn<(action: GameAction) => void>(),
            selectedGems: [],
            setSelectedGems: vi.fn(),
            clearSelectedGems: vi.fn(),
            preselectedReserveGold: null,
            setPreselectedReserveGold: vi.fn(),
            setErrorMsg: vi.fn(),
        };
        vi.clearAllMocks();
        mocks.getFsmPhaseSurfacePolicy.mockReturnValue({
            selfGemRailMode: 'discard-self',
            boardInteractionMode: 'selection',
        });
        mocks.validateGemSelection.mockReturnValue({ valid: true, hasGap: false });
        mocks.canActionRunInPhase.mockReturnValue(true);
        mocks.getRandomBasicGemColor.mockReturnValue('blue');
        mocks.buildReplenishAction.mockReturnValue({ type: 'REPLENISH_BOARD' });
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

    it('dispatches self-rail discard only when the surface policy allows it', () => {
        renderHarness();

        act(() => {
            currentResult?.handleSelfGemClick('gem-1');
        });

        expect(currentProps.networkDispatch).toHaveBeenCalledWith({
            type: 'DISCARD_GEM',
            payload: 'gem-1',
        });

        mocks.getFsmPhaseSurfacePolicy.mockReturnValue({
            selfGemRailMode: 'inspect-only',
            boardInteractionMode: 'selection',
        });

        renderHarness();

        act(() => {
            currentResult?.handleSelfGemClick('gem-2');
        });

        expect(currentProps.networkDispatch).toHaveBeenCalledTimes(1);
    });

    it('routes gem clicks through error, action, and selection branches', () => {
        renderHarness();

        mocks.processGemClick.mockReturnValueOnce({ error: 'Invalid move' });
        act(() => {
            currentResult?.handleGemClick(1, 2);
        });
        expect(currentProps.setErrorMsg).toHaveBeenCalledWith('Invalid move');

        mocks.processGemClick.mockReturnValueOnce({
            action: { type: 'TAKE_GEMS', payload: { coords: [] } },
        });
        act(() => {
            currentResult?.handleGemClick(2, 1);
        });
        expect(currentProps.networkDispatch).toHaveBeenCalledWith({
            type: 'TAKE_GEMS',
            payload: { coords: [] },
        });

        const newSelection: GemCoord[] = [{ r: 0, c: 0 }];
        mocks.processGemClick.mockReturnValueOnce({ newSelection });
        act(() => {
            currentResult?.handleGemClick(0, 0);
        });
        expect(currentProps.setPreselectedReserveGold).toHaveBeenCalledWith(null);
        expect(currentProps.setSelectedGems).toHaveBeenCalledWith(newSelection);
    });

    it('preselects a gold gem for the next reserve action while in selection mode', () => {
        currentProps.gameState = createState({
            board: [
                [
                    {
                        type: { id: 'gold', color: 'gold', border: 'solid', label: 'Gold' },
                        uid: 'gold-1',
                    },
                ],
            ] as unknown as GameState['board'],
        });

        renderHarness();

        act(() => {
            currentResult?.handleGemClick(0, 0);
        });

        expect(mocks.processGemClick).not.toHaveBeenCalled();
        expect(currentProps.setPreselectedReserveGold).toHaveBeenCalledWith({ r: 0, c: 0 });
        expect(currentProps.clearSelectedGems).toHaveBeenCalled();
        expect(currentProps.setErrorMsg).toHaveBeenCalledWith('Select a card or deck to reserve.');

        currentProps.preselectedReserveGold = { r: 0, c: 0 };
        renderHarness();

        act(() => {
            currentResult?.handleGemClick(0, 0);
        });

        expect(currentProps.setPreselectedReserveGold).toHaveBeenCalledWith(null);
        expect(currentProps.setErrorMsg).toHaveBeenCalledWith(null);
    });

    it('validates drag selection, confirms TAKE_GEMS, and clears selection on success', () => {
        currentProps.selectedGems = [
            { r: 0, c: 0 },
            { r: 0, c: 1 },
        ];
        renderHarness();

        act(() => {
            currentResult?.handleGemDragSelection([
                { r: 1, c: 0 },
                { r: 1, c: 1 },
            ]);
        });

        expect(currentProps.setErrorMsg).toHaveBeenCalledWith(null);
        expect(currentProps.setSelectedGems).toHaveBeenCalledWith([
            { r: 1, c: 0 },
            { r: 1, c: 1 },
        ]);

        act(() => {
            currentResult?.handleConfirmTake();
        });

        expect(currentProps.networkDispatch).toHaveBeenCalledWith({
            type: 'TAKE_GEMS',
            payload: { coords: currentProps.selectedGems },
        });
        expect(currentProps.clearSelectedGems).toHaveBeenCalled();
    });

    it('removes drag-deselected gems locally without dispatching a take action', () => {
        currentProps.selectedGems = [
            { r: 0, c: 0 },
            { r: 0, c: 1 },
            { r: 0, c: 2 },
        ];
        renderHarness();

        act(() => {
            currentResult?.handleGemDragSelection(
                [
                    { r: 0, c: 0 },
                    { r: 0, c: 1 },
                ],
                'deselect'
            );
        });

        expect(currentProps.setErrorMsg).toHaveBeenCalledWith(null);
        expect(currentProps.setPreselectedReserveGold).toHaveBeenCalledWith(null);
        expect(currentProps.setSelectedGems).toHaveBeenCalledWith([{ r: 0, c: 2 }]);
        expect(currentProps.networkDispatch).not.toHaveBeenCalledWith(
            expect.objectContaining({ type: 'TAKE_GEMS' })
        );
    });

    it('rejects invalid confirm-take branches and buff-restricted drag selection', () => {
        currentProps.selectedGems = [
            { r: 0, c: 0 },
            { r: 0, c: 1 },
            { r: 0, c: 2 },
        ];
        currentProps.gameState = createState({
            playerBuffs: {
                ...cloneState().playerBuffs,
                p1: {
                    ...cloneState().playerBuffs.p1,
                    effects: {
                        ...cloneState().playerBuffs.p1.effects,
                        passive: {
                            ...cloneState().playerBuffs.p1.effects.passive,
                            noTake3: true,
                        },
                    },
                },
            },
        });

        renderHarness();

        act(() => {
            currentResult?.handleGemDragSelection(currentProps.selectedGems);
        });
        expect(currentProps.setErrorMsg).toHaveBeenCalledWith('Cannot take 3 gems!');

        mocks.validateGemSelection.mockReturnValueOnce({
            valid: false,
            hasGap: false,
            error: 'Need a line',
        });
        act(() => {
            currentResult?.handleConfirmTake();
        });
        expect(currentProps.setErrorMsg).toHaveBeenCalledWith('Need a line');

        mocks.validateGemSelection.mockReturnValueOnce({
            valid: true,
            hasGap: true,
        });
        act(() => {
            currentResult?.handleConfirmTake();
        });
        expect(currentProps.setErrorMsg).toHaveBeenCalledWith('Gap detected!');
    });

    it('short-circuits interactive handlers when the renderer cannot act locally', () => {
        currentProps.canLocalInteract = false;
        currentProps.selectedGems = [{ r: 0, c: 0 }];

        renderHarness();

        act(() => {
            currentResult?.handleSelfGemClick('gem-1');
            currentResult?.handleGemClick(0, 0);
            currentResult?.handleGemDragSelection([{ r: 0, c: 0 }]);
            currentResult?.handleOpponentGemClick('blue');
            currentResult?.handleConfirmTake();
            currentResult?.handleReplenish();
            currentResult?.activatePrivilegeMode();
        });

        expect(mocks.processGemClick).not.toHaveBeenCalled();
        expect(mocks.processOpponentGemClick).not.toHaveBeenCalled();
        expect(currentProps.networkDispatch).not.toHaveBeenCalled();
        expect(currentProps.setSelectedGems).not.toHaveBeenCalled();
        expect(currentProps.clearSelectedGems).not.toHaveBeenCalled();
    });

    it('ignores invalid drag-selection input before mutating selection state', () => {
        renderHarness();

        act(() => {
            currentResult?.handleGemDragSelection([]);
            currentResult?.handleGemDragSelection([
                { r: 0, c: 0 },
                { r: 0, c: 1 },
                { r: 0, c: 2 },
                { r: 0, c: 3 },
            ]);
        });

        mocks.validateGemSelection.mockReturnValueOnce({
            valid: false,
            hasGap: false,
        });
        act(() => {
            currentResult?.handleGemDragSelection([
                { r: 1, c: 0 },
                { r: 1, c: 1 },
            ]);
        });

        mocks.validateGemSelection.mockReturnValueOnce({
            valid: true,
            hasGap: true,
        });
        act(() => {
            currentResult?.handleGemDragSelection([
                { r: 2, c: 0 },
                { r: 2, c: 1 },
            ]);
        });

        mocks.getFsmPhaseSurfacePolicy.mockReturnValueOnce({
            selfGemRailMode: 'discard-self',
            boardInteractionMode: 'inspect-only',
        });
        renderHarness();

        act(() => {
            currentResult?.handleGemDragSelection([
                { r: 3, c: 0 },
                { r: 3, c: 1 },
            ]);
        });

        expect(currentProps.setSelectedGems).not.toHaveBeenCalled();
    });

    it('handles opponent clicks, replenish dispatch, and privilege activation', () => {
        currentProps.gameState = createState({
            bag: [cloneState().board[0][0]],
            inventories: {
                ...cloneState().inventories,
                p2: {
                    blue: 2,
                    white: 0,
                    green: 0,
                    black: 0,
                    red: 1,
                    gold: 0,
                    pearl: 0,
                },
            },
            privileges: {
                p1: 1,
                p2: 0,
            },
            board: [
                [
                    {
                        type: { id: 'blue', color: 'blue', border: 'solid', label: 'Blue' },
                        uid: 'gem-1',
                    },
                ],
            ] as unknown as GameState['board'],
        });
        mocks.processOpponentGemClick.mockReturnValue({
            action: { type: 'STEAL_OPPONENT_GEM', payload: 'blue' },
        });
        vi.spyOn(Math, 'random').mockReturnValue(0);

        renderHarness();

        act(() => {
            currentResult?.handleOpponentGemClick('blue');
        });
        expect(currentProps.networkDispatch).toHaveBeenCalledWith({
            type: 'STEAL_OPPONENT_GEM',
            payload: 'blue',
        });

        act(() => {
            currentResult?.handleReplenish();
        });
        expect(mocks.buildReplenishAction).toHaveBeenCalledWith('blue', 'blue');
        expect(currentProps.networkDispatch).toHaveBeenCalledWith({ type: 'REPLENISH_BOARD' });

        act(() => {
            currentResult?.activatePrivilegeMode();
        });
        expect(currentProps.networkDispatch).toHaveBeenCalledWith({ type: 'ACTIVATE_PRIVILEGE' });
        expect(currentProps.clearSelectedGems).toHaveBeenCalled();
    });

    it('surfaces guarded error branches for opponent clicks, replenish fallback, and privilege activation', () => {
        currentProps.gameState = createState({
            bag: [cloneState().board[0][0]],
            inventories: cloneState().inventories,
            privileges: {
                p1: 0,
                p2: 0,
            },
        });
        mocks.processOpponentGemClick.mockReturnValueOnce({ error: 'Cannot steal gold' });

        renderHarness();

        act(() => {
            currentResult?.handleOpponentGemClick('gold');
        });
        expect(currentProps.setErrorMsg).toHaveBeenCalledWith('Cannot steal gold');

        act(() => {
            currentResult?.handleReplenish();
        });
        expect(mocks.buildReplenishAction).toHaveBeenCalledWith('blue', undefined);

        act(() => {
            currentResult?.activatePrivilegeMode();
        });
        expect(currentProps.networkDispatch).toHaveBeenCalledTimes(1);

        currentProps.gameState = createState({
            privileges: {
                p1: 1,
                p2: 0,
            },
        });
        renderHarness();

        act(() => {
            currentResult?.activatePrivilegeMode();
        });
        expect(currentProps.setErrorMsg).toHaveBeenCalledWith('No gems.');
    });
});
