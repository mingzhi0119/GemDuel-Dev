import {
    clickElement,
    hoverElement,
    waitForCondition,
    waitForStableFrame,
} from './electronUnityParityDom';
import type { ParityAction } from './electronUnityParityTypes';
import {
    type ClickActionDeps,
    hasTurnOrPhaseAdvanced,
    otherPlayer,
    selectorForBoardCellClick,
    selectorForBoardCellHover,
} from './electronUnityParityClickActionSupport';

export const createBoardParityClickActions = ({
    currentParams,
    result,
    hasRenderedCurrentRoute,
    getLoadedReplayEvent,
    advanceLoadedReplayEvent,
}: ClickActionDeps) => {
    const clickBoardCell = async (action: ParityAction, payload: Record<string, unknown>) => {
        const row = Number(payload.row ?? payload.r);
        const column = Number(payload.column ?? payload.c);
        const wasSelected = currentParams().game.state.selectedGems.some(
            (selection) => selection.r === row && selection.c === column
        );
        const ok = clickElement(selectorForBoardCellClick(row, column));
        if (ok) {
            await waitForCondition(() => {
                const { state } = currentParams().game;
                if (state.phase !== 'IDLE') {
                    return true;
                }

                const isSelected = state.selectedGems.some(
                    (selection) => selection.r === row && selection.c === column
                );
                if (!wasSelected && !isSelected) {
                    return false;
                }
                if (state.selectedGems.length === 0) {
                    return true;
                }

                return Boolean(
                    document.querySelector('[data-game-action="confirm-take"]:not(:disabled)')
                );
            }, 120);
        }
        await waitForStableFrame();
        return result(
            action,
            ok,
            ok
                ? `Clicked board cell ${row}-${column}.`
                : `No board cell target for ${row}-${column}.`,
            ok ? 'dom-click' : 'missing-dom-target'
        );
    };

    const hoverBoardCell = async (action: ParityAction, payload: Record<string, unknown>) => {
        const row = Number(payload.row ?? payload.r);
        const column = Number(payload.column ?? payload.c);
        const ok = hoverElement(selectorForBoardCellHover(row, column));
        await waitForStableFrame();
        return result(
            action,
            ok,
            ok
                ? `Hovered board cell ${row}-${column}.`
                : `No board cell target for ${row}-${column}.`,
            ok ? 'dom-hover' : 'missing-dom-target'
        );
    };

    const confirmGemSelection = async (action: ParityAction) => {
        const beforeIndex = currentParams().game.historyControls.currentIndex;
        const beforeLength = currentParams().game.historyControls.historyLength;
        const beforeSource = currentParams().game.historyControls.historySource;
        const beforeTurn = currentParams().game.state.turn;
        await waitForCondition(
            () =>
                Boolean(document.querySelector('[data-game-action="confirm-take"]:not(:disabled)')),
            120
        );
        const ok = clickElement('[data-game-action="confirm-take"]:not(:disabled)');
        const committed =
            ok &&
            (await waitForCondition(() => {
                const { historyControls, state } = currentParams().game;
                const historyMoved =
                    historyControls.currentIndex > beforeIndex ||
                    historyControls.historyLength !== beforeLength ||
                    historyControls.historySource !== beforeSource;
                const turnMoved = state.turn !== beforeTurn && state.selectedGems.length === 0;
                return (historyMoved || turnMoved) && hasRenderedCurrentRoute();
            }, 120));
        await waitForStableFrame();
        return result(
            action,
            committed,
            committed
                ? 'Confirmed selected board gems.'
                : 'No enabled gem-selection confirm action.',
            committed ? 'dom-click' : 'missing-dom-target'
        );
    };

    const cancelGemSelection = async (action: ParityAction) => {
        const ok = clickElement('[data-game-action="cancel-take"]:not(:disabled)');
        await waitForStableFrame();
        return result(
            action,
            ok,
            ok ? 'Cancelled selected board gems.' : 'No enabled gem-selection cancel action.',
            ok ? 'dom-click' : 'missing-dom-target'
        );
    };

    const takeBonusGem = async (action: ParityAction, payload: Record<string, unknown>) => {
        const replayEvent = getLoadedReplayEvent();
        const row = Number(payload.row ?? payload.r ?? replayEvent?.coord?.r);
        const column = Number(payload.column ?? payload.c ?? replayEvent?.coord?.c);
        const beforeIndex = currentParams().game.historyControls.currentIndex;
        const beforePhase = currentParams().game.state.phase;
        const beforeTurn = currentParams().game.state.turn;
        const ok = clickElement(selectorForBoardCellClick(row, column));
        const committed =
            ok &&
            (await waitForCondition(() => {
                const params = currentParams();
                const historyMoved = params.game.historyControls.currentIndex > beforeIndex;
                const stateMoved = hasTurnOrPhaseAdvanced(
                    beforePhase,
                    beforeTurn,
                    params.game.state.phase,
                    params.game.state.turn
                );
                return (historyMoved || stateMoved) && hasRenderedCurrentRoute();
            }, 120));
        await waitForStableFrame();
        return committed
            ? result(action, true, `Clicked bonus gem ${row}-${column}.`, 'dom-click')
            : await advanceLoadedReplayEvent(action, 'take_bonus_gem', payload);
    };

    const clickPlayerGem = async (
        action: ParityAction,
        payload: Record<string, unknown>,
        kind: 'steal_gem' | 'discard_gem'
    ) => {
        const replayEvent = getLoadedReplayEvent();
        const gemId =
            typeof payload.gemId === 'string'
                ? payload.gemId
                : typeof replayEvent?.gemId === 'string'
                  ? replayEvent.gemId
                  : 'red';
        const currentPlayer = currentParams().game.state.turn;
        const player =
            typeof payload.player === 'string'
                ? payload.player
                : kind === 'steal_gem'
                  ? otherPlayer(currentPlayer)
                  : currentPlayer;
        const beforeIndex = currentParams().game.historyControls.currentIndex;
        const beforePhase = currentParams().game.state.phase;
        const beforeTurn = currentParams().game.state.turn;
        const ok = clickElement(`[data-player-zone-gem="${player}-${gemId}"]:not(:disabled)`);
        const committed =
            ok &&
            (await waitForCondition(() => {
                const params = currentParams();
                const historyMoved = params.game.historyControls.currentIndex > beforeIndex;
                const stateMoved = hasTurnOrPhaseAdvanced(
                    beforePhase,
                    beforeTurn,
                    params.game.state.phase,
                    params.game.state.turn
                );
                return (historyMoved || stateMoved) && hasRenderedCurrentRoute();
            }, 120));
        await waitForStableFrame();
        return committed
            ? result(action, true, `Clicked ${player} ${gemId} gem.`, 'dom-click')
            : await advanceLoadedReplayEvent(action, kind, payload);
    };

    const hoverPlayerGem = async (action: ParityAction, payload: Record<string, unknown>) => {
        const currentPlayer = currentParams().game.state.turn;
        const player =
            typeof payload.player === 'string'
                ? payload.player
                : payload.role === 'opponent'
                  ? otherPlayer(currentPlayer)
                  : currentPlayer;
        const gemId = typeof payload.gemId === 'string' ? payload.gemId : 'red';
        const ok = hoverElement(`[data-player-zone-gem="${player}-${gemId}"]`);
        await waitForStableFrame();
        return result(
            action,
            ok,
            ok ? `Hovered ${player} ${gemId} gem.` : `No player gem target for ${player}-${gemId}.`,
            ok ? 'dom-hover' : 'missing-dom-target'
        );
    };

    const endTurn = async (action: ParityAction) => {
        const ok = clickElement(
            '[data-game-action="confirm-take"], [data-game-action="replenish"]'
        );
        await waitForStableFrame();
        return ok
            ? result(action, true, 'Clicked visible end-turn action.', 'dom-click')
            : await advanceLoadedReplayEvent(action, 'replenish');
    };

    return {
        cancelGemSelection,
        clickBoardCell,
        confirmGemSelection,
        discardGem: (action: ParityAction, payload: Record<string, unknown>) =>
            clickPlayerGem(action, payload, 'discard_gem'),
        endTurn,
        hoverBoardCell,
        hoverPlayerGem,
        stealGem: (action: ParityAction, payload: Record<string, unknown>) =>
            clickPlayerGem(action, payload, 'steal_gem'),
        takeBonusGem,
    };
};
