import {
    clickElement,
    hoverElement,
    waitForCondition,
    waitForStableFrame,
} from './electronUnityParityDom';
import type { ParityAction } from './electronUnityParityTypes';
import {
    clickBoardCellUntilCommitted,
    clickBoardCellUntilSelectionChange,
    getBoardCoord,
    hasReserveGoldSelection,
    hasSelectedGem,
} from './electronUnityParityBoardClickSupport';
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
        const { row, column } = getBoardCoord(payload);
        const wasSelected = hasSelectedGem(currentParams().game.state, row, column);
        const { ok, selectionObserved } = await clickBoardCellUntilSelectionChange({
            selector: selectorForBoardCellClick(row, column),
            row,
            column,
            wasSelected,
            currentParams,
            isSelected: hasSelectedGem,
            allowPhaseExit: true,
        });
        const clicked = ok && selectionObserved;
        return result(
            action,
            clicked,
            clicked
                ? `Clicked board cell ${row}-${column}.`
                : ok
                  ? `Board cell ${row}-${column} did not update selection.`
                  : `No board cell target for ${row}-${column}.`,
            clicked ? 'dom-click' : 'missing-dom-target'
        );
    };

    const preselectReserveGold = async (action: ParityAction, payload: Record<string, unknown>) => {
        const { row, column } = getBoardCoord(payload);
        const wasSelected = hasReserveGoldSelection(currentParams().game.state, row, column);
        const selector = selectorForBoardCellClick(row, column);
        const { ok, selectionObserved } = await clickBoardCellUntilSelectionChange({
            selector,
            row,
            column,
            wasSelected,
            currentParams,
            isSelected: hasReserveGoldSelection,
        });
        return result(
            action,
            Boolean(ok && selectionObserved),
            ok && selectionObserved
                ? `Preselected reserve gold ${row}-${column}.`
                : ok
                  ? `Reserve gold ${row}-${column} did not update selection.`
                  : `No reserve gold target for ${row}-${column}.`,
            ok && selectionObserved ? 'dom-click' : 'missing-dom-target'
        );
    };

    const resolvePendingReserveGold = async (
        action: ParityAction,
        payload: Record<string, unknown>
    ) => {
        const { row, column } = getBoardCoord(payload);
        const selector = selectorForBoardCellClick(row, column);
        const beforeIndex = currentParams().game.historyControls.currentIndex;
        const beforePhase = currentParams().game.state.phase;
        const beforeTurn = currentParams().game.state.turn;
        const observeCommitted = () =>
            waitForCondition(() => {
                const params = currentParams();
                const historyMoved = params.game.historyControls.currentIndex > beforeIndex;
                const stateMoved = hasTurnOrPhaseAdvanced(
                    beforePhase,
                    beforeTurn,
                    params.game.state.phase,
                    params.game.state.turn
                );
                const reserveResolved =
                    params.game.state.phase !== 'RESERVE_WAITING_GEM' &&
                    params.game.state.pendingReserve === null;
                return (historyMoved || stateMoved || reserveResolved) && hasRenderedCurrentRoute();
            }, 120);

        const { ok, committed } = await clickBoardCellUntilCommitted({
            selector,
            row,
            column,
            currentParams,
            observeCommitted,
        });
        return result(
            action,
            Boolean(ok && committed),
            ok && committed
                ? `Resolved pending reserve with Gold ${row}-${column}.`
                : ok
                  ? `Gold ${row}-${column} did not resolve pending reserve.`
                  : `No pending reserve gold target for ${row}-${column}.`,
            ok && committed ? 'dom-click' : 'missing-dom-target'
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
        await new Promise((resolve) => window.setTimeout(resolve, 0));
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
        const { row, column } = getBoardCoord(payload, replayEvent?.coord);
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

    const activatePrivilege = async (action: ParityAction) => {
        const player = currentParams().game.state.turn;
        const beforeIndex = currentParams().game.historyControls.currentIndex;
        const ok = clickElement(
            `[data-player-zone-privilege^="${player}-"]:not(:disabled), [data-player-zone-privilege^="${player}-"][role="button"]:not([aria-disabled="true"])`
        );
        const committed =
            ok &&
            (await waitForCondition(() => {
                const params = currentParams();
                const historyMoved = params.game.historyControls.currentIndex > beforeIndex;
                return (
                    (historyMoved || params.game.state.phase === 'PRIVILEGE_ACTION') &&
                    hasRenderedCurrentRoute()
                );
            }, 120));
        await waitForStableFrame();
        return committed
            ? result(action, true, `Clicked ${player} privilege scroll.`, 'dom-click')
            : await advanceLoadedReplayEvent(action, 'activate_privilege');
    };

    const usePrivilege = async (action: ParityAction, payload: Record<string, unknown>) => {
        const replayEvent = getLoadedReplayEvent();
        const { row, column } = getBoardCoord(payload, replayEvent?.coord);
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
            ? result(action, true, `Clicked privilege gem ${row}-${column}.`, 'dom-click')
            : await advanceLoadedReplayEvent(action, 'use_privilege', payload);
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
        activatePrivilege,
        cancelGemSelection,
        clickBoardCell,
        confirmGemSelection,
        discardGem: (action: ParityAction, payload: Record<string, unknown>) =>
            clickPlayerGem(action, payload, 'discard_gem'),
        endTurn,
        hoverBoardCell,
        hoverPlayerGem,
        preselectReserveGold,
        resolvePendingReserveGold,
        stealGem: (action: ParityAction, payload: Record<string, unknown>) =>
            clickPlayerGem(action, payload, 'steal_gem'),
        takeBonusGem,
        usePrivilege,
    };
};
