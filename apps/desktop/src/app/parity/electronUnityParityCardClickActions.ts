import {
    clickElement,
    hoverElement,
    waitForCondition,
    waitForStableFrame,
} from './electronUnityParityDom';
import type { ParityAction } from './electronUnityParityTypes';
import {
    type ClickActionDeps,
    selectorForBoardCellClick,
} from './electronUnityParityClickActionSupport';

export const createCardParityClickActions = ({
    currentParams,
    result,
    hasRenderedCurrentRoute,
    getLoadedReplayEvent,
    advanceLoadedReplayEvent,
}: ClickActionDeps) => {
    const hoverMarketCard = async (action: ParityAction, payload: Record<string, unknown>) => {
        const level = Number(payload.level);
        const index = Number(payload.index);
        const selector = `[data-market-slot="${level}-${index}"] [data-card-preview-click="true"], [data-market-slot="${level}-${index}"][data-card-preview-click="true"], [data-market-slot="${level}-${index}"] button, [data-market-slot="${level}-${index}"] [role="button"], [data-market-slot="${level}-${index}"]`;
        const ok = hoverElement(selector);
        await waitForStableFrame();
        return result(
            action,
            ok,
            ok
                ? `Hovered market card ${level}-${index}.`
                : `No market card target for ${level}-${index}.`,
            ok ? 'dom-hover' : 'missing-dom-target'
        );
    };

    const hoverMarketDeck = async (action: ParityAction, payload: Record<string, unknown>) => {
        const level = Number(payload.level);
        const selector = `[data-market-deck="${level}"][role="button"], [data-market-deck="${level}"][tabindex], [data-market-deck="${level}"]`;
        const ok = hoverElement(selector);
        await waitForStableFrame();
        return result(
            action,
            ok,
            ok ? `Hovered market deck ${level}.` : `No market deck target for ${level}.`,
            ok ? 'dom-hover' : 'missing-dom-target'
        );
    };

    const clickMarketCard = async (action: ParityAction, payload: Record<string, unknown>) => {
        const level = Number(payload.level);
        const index = Number(payload.index);
        const selector = `[data-market-slot="${level}-${index}"] [data-card-preview-click="true"], [data-market-slot="${level}-${index}"][data-card-preview-click="true"], [data-market-slot="${level}-${index}"] button, [data-market-slot="${level}-${index}"] [role="button"]`;
        const ok = clickElement(selector);
        await waitForStableFrame();
        return result(
            action,
            ok,
            ok ? undefined : `No market card target for ${level}-${index}.`,
            ok ? 'dom-click' : 'missing-dom-target'
        );
    };

    const clickMarketDeck = async (action: ParityAction, payload: Record<string, unknown>) => {
        const level = Number(payload.level);
        const selector = `[data-market-deck="${level}"][role="button"], [data-market-deck="${level}"][tabindex], [data-market-deck="${level}"]`;
        const ok = clickElement(selector);
        await waitForStableFrame();
        return result(
            action,
            ok,
            ok ? undefined : `No market deck target for ${level}.`,
            ok ? 'dom-click' : 'missing-dom-target'
        );
    };

    const clickPreviewBlank = async (action: ParityAction) => {
        const ok = clickElement('[data-card-preview-backdrop="true"]');
        await waitForStableFrame();
        return result(
            action,
            ok,
            ok ? 'Clicked preview blank backdrop.' : 'No preview blank backdrop target.',
            ok ? 'dom-click' : 'missing-dom-target'
        );
    };

    const dispatchPreviewAction = async (
        action: ParityAction,
        payload: Record<string, unknown>
    ) => {
        const level = Number(payload.level);
        const index = Number(payload.index);
        const replayEvent = getLoadedReplayEvent();
        await clickMarketCard('click_market_card', { level, index });
        const actionId = action === 'buy_card' ? 'buy' : 'reserve';
        const beforeIndex = currentParams().game.historyControls.currentIndex;
        const ok = clickElement(`[data-card-preview-action="${actionId}"]:not(:disabled)`);
        await waitForStableFrame();
        if (!ok) {
            return await advanceLoadedReplayEvent(
                action,
                action === 'buy_card' ? 'buy_card' : 'reserve_card',
                payload
            );
        }

        if (action === 'reserve_card' && replayEvent?.goldCoord) {
            const goldCoord = replayEvent.goldCoord;
            const pendingVisible = await waitForCondition(
                () =>
                    currentParams().game.state.phase === 'RESERVE_WAITING_GEM' &&
                    Boolean(currentParams().game.state.pendingReserve),
                60
            );
            const goldClicked =
                pendingVisible &&
                clickElement(selectorForBoardCellClick(Number(goldCoord.r), Number(goldCoord.c)));
            const committed =
                goldClicked &&
                (await waitForCondition(
                    () =>
                        currentParams().game.historyControls.currentIndex > beforeIndex &&
                        currentParams().game.state.phase !== 'RESERVE_WAITING_GEM' &&
                        hasRenderedCurrentRoute(),
                    60
                ));
            return result(
                action,
                committed,
                committed
                    ? `Clicked preview ${actionId} action and reserve gold ${goldCoord.r}-${goldCoord.c}.`
                    : `Reserve gold confirmation ${goldCoord.r}-${goldCoord.c} did not commit.`,
                committed ? 'dom-click' : 'missing-dom-target'
            );
        }

        return result(action, true, `Clicked preview ${actionId} action.`, 'dom-click');
    };

    const clickPlayerReserved = async (action: ParityAction, payload: Record<string, unknown>) => {
        const index = Number(payload.index ?? 0);
        const player =
            typeof payload.player === 'string' ? payload.player : currentParams().game.state.turn;
        const selectors = [
            `[data-reserved-slot="${player}-${index}"] [data-card-preview-click="true"]`,
            `[data-reserved-slot="${player}-${index}"] button`,
            `[data-reserved-slot="${player}-${index}"] [role="button"]`,
            `[data-reserved-slot="${player}-${index}"]`,
        ];
        const ok = selectors.some((selector) => clickElement(selector));
        const opened =
            ok &&
            (await waitForCondition(
                () =>
                    Boolean(document.querySelector('[data-card-preview-overlay]')) &&
                    Boolean(document.querySelector('[data-card-preview-card]')),
                120
            ));
        await waitForStableFrame();
        return result(
            action,
            opened,
            opened
                ? `Opened ${player} reserved slot ${index} preview.`
                : `No preview opened for ${player} reserved slot ${index}.`,
            opened ? 'dom-click' : 'missing-dom-target'
        );
    };

    const hoverPlayerReserved = async (action: ParityAction, payload: Record<string, unknown>) => {
        const index = Number(payload.index ?? 0);
        const player =
            typeof payload.player === 'string' ? payload.player : currentParams().game.state.turn;
        const selectors = [
            `[data-reserved-slot="${player}-${index}"] [data-card-preview-click="true"]`,
            `[data-reserved-slot="${player}-${index}"] button`,
            `[data-reserved-slot="${player}-${index}"] [role="button"]`,
            `[data-reserved-slot="${player}-${index}"]`,
        ];
        const ok = selectors.some((selector) => hoverElement(selector));
        await waitForStableFrame();
        return result(
            action,
            ok,
            ok
                ? `Hovered ${player} reserved slot ${index}.`
                : `No ${player} reserved slot ${index}.`,
            ok ? 'dom-hover' : 'missing-dom-target'
        );
    };

    const confirmPreviewAction = async (action: ParityAction, payload: Record<string, unknown>) => {
        const actionId = typeof payload.actionId === 'string' ? payload.actionId : undefined;
        const selector = actionId
            ? `[data-card-preview-action="${actionId}"]:not(:disabled)`
            : '[data-card-preview-action]:not(:disabled)';
        const ok = clickElement(selector);
        await waitForStableFrame();
        return result(
            action,
            ok,
            ok ? undefined : 'No enabled preview action.',
            ok ? 'dom-click' : 'missing-dom-target'
        );
    };

    const chooseRoyal = async (action: ParityAction, payload: Record<string, unknown>) => {
        const index = Number(payload.index ?? 0);
        const royal = currentParams().game.state.royalDeck[index];
        if (!royal) {
            await waitForStableFrame();
            return result(action, false, `No royal at index ${index}.`);
        }

        const selectingPlayer = currentParams().game.state.turn;
        const hasCommittedRoyalSelection = () => {
            const { state } = currentParams().game;
            return (
                state.phase !== 'SELECT_ROYAL' &&
                state.playerRoyals[selectingPlayer].some((card) => card.id === royal.id) &&
                !state.royalDeck.some((card) => card.id === royal.id)
            );
        };
        await waitForCondition(
            () =>
                Boolean(document.querySelector(`[data-royal-selection-card="${royal.id}"]`)) ||
                !document.querySelector('[data-royal-unlock-intro]'),
            120
        );
        if (
            document.querySelector(
                '[data-royal-selection-overlay][data-royal-selection-mode="board-info"]'
            )
        ) {
            clickElement('[data-royal-selection-view-toggle="selection"]');
            await waitForCondition(
                () =>
                    Boolean(
                        document.querySelector(
                            '[data-royal-selection-overlay][data-royal-selection-mode="selection"]'
                        )
                    ) && hasRenderedCurrentRoute(),
                120
            );
        }

        const clicked = clickElement(
            `[data-royal-selection-card="${royal.id}"]:not(:disabled), button[data-royal-card="${royal.id}"]:not(:disabled), [data-royal-card="${royal.id}"][role="button"]:not([aria-disabled="true"])`
        );
        if (!clicked) {
            await waitForStableFrame();
            return result(action, false, `No enabled royal target for ${royal.id}.`);
        }

        const committed = await waitForCondition(
            () => hasCommittedRoyalSelection() && hasRenderedCurrentRoute(),
            120
        );
        return result(
            action,
            committed,
            committed
                ? `Clicked royal ${royal.id}.`
                : `Royal ${royal.id} click did not commit selection.`,
            'dom-click'
        );
    };

    return {
        chooseRoyal,
        clickMarketCard,
        clickMarketDeck,
        clickPlayerReserved,
        clickPreviewBlank,
        confirmPreviewAction,
        dispatchPreviewAction,
        hoverMarketCard,
        hoverMarketDeck,
        hoverPlayerReserved,
    };
};
