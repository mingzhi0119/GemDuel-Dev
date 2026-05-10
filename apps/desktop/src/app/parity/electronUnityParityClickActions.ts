import type { SurfaceThemeVariant } from '../shell/surfaceTheme';
import { clickElement, waitForCondition, waitForStableFrame } from './electronUnityParityDom';
import type {
    ParityAction,
    ParityActionResult,
    UseElectronUnityParityHarnessParams,
} from './electronUnityParityTypes';

export type ReplayEventLike = {
    type?: string;
    marketRef?: { level?: number; idx?: number };
    royalId?: string;
    buffId?: string;
    goldCoord?: { r?: number; c?: number };
};

type ParityResultFactory = (
    action: ParityAction,
    ok: boolean,
    detail?: string,
    driver?: string
) => ParityActionResult;

type ClickActionDeps = {
    currentParams: () => UseElectronUnityParityHarnessParams;
    result: ParityResultFactory;
    hasRenderedCurrentRoute: () => boolean;
    getLoadedReplayEvent: () => ReplayEventLike | undefined;
    advanceLoadedReplayEvent: (
        action: ParityAction,
        expectedType: string,
        payload?: Record<string, unknown>
    ) => Promise<ParityActionResult>;
};

const SETTINGS_CONTROL_SELECTOR =
    'button[aria-label="Settings"], button[aria-label="设置"], [data-game-glyph="settings"]';

const createParityRandom = (seed: string) => {
    let hash = 2166136261;
    for (let index = 0; index < seed.length; index += 1) {
        hash ^= seed.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }

    let state = hash >>> 0 || 0x9e3779b9;
    return () => {
        state = Math.imul(state, 1664525) + 1013904223;
        return ((state >>> 0) + 0.5) / 4294967296;
    };
};

const runWithDeterministicDraftRandom = <T>(callback: () => T): T => {
    const previousRandom = Math.random;
    Math.random = createParityRandom('parity:125');
    try {
        return callback();
    } finally {
        Math.random = previousRandom;
    }
};

export const createElectronUnityClickActions = ({
    currentParams,
    result,
    hasRenderedCurrentRoute,
    getLoadedReplayEvent,
    advanceLoadedReplayEvent,
}: ClickActionDeps) => {
    const chooseBoon = async (action: ParityAction, payload: Record<string, unknown>) => {
        const beforeIndex = currentParams().game.historyControls.currentIndex;
        const buffId = typeof payload.buffId === 'string' ? payload.buffId : undefined;
        const index = Number(payload.index ?? 0);
        const selector = buffId
            ? `[data-draft-buff-id="${buffId}"]`
            : `[data-draft-buff-index="${index}"]`;
        const button = document.querySelector<HTMLButtonElement>(selector);
        if (!button || button.disabled) {
            await waitForStableFrame();
            return result(action, false, `No enabled draft boon target for ${buffId ?? index}.`);
        }

        runWithDeterministicDraftRandom(() => button.click());
        const advanced = await waitForCondition(
            () =>
                currentParams().game.historyControls.currentIndex > beforeIndex &&
                hasRenderedCurrentRoute(),
            60
        );
        return result(
            action,
            advanced,
            advanced
                ? `Clicked draft boon ${buffId ?? index}.`
                : `Draft boon ${buffId ?? index} did not advance history.`,
            'dom-click'
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
                clickElement(
                    `[data-board-cell="${Number(goldCoord.r)}-${Number(goldCoord.c)}"] button:not(:disabled)`
                );
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
        const ok = clickElement(
            `[data-reserved-slot="p1-${index}"] [data-card-preview-click="true"], [data-reserved-slot="p1-${index}"] button, [data-reserved-slot="p1-${index}"] [role="button"]`
        );
        await waitForStableFrame();
        return result(
            action,
            ok,
            ok ? undefined : `No p1 reserved slot ${index}.`,
            ok ? 'dom-click' : 'missing-dom-target'
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

    const endTurn = async (action: ParityAction) => {
        const ok = clickElement(
            '[data-game-action="confirm-take"], [data-game-action="replenish"]'
        );
        await waitForStableFrame();
        return ok
            ? result(action, true, 'Clicked visible end-turn action.', 'dom-click')
            : await advanceLoadedReplayEvent(action, 'replenish');
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

    const openSettings = async (action: ParityAction) => {
        const hasControl = () => Boolean(document.querySelector(SETTINGS_CONTROL_SELECTOR));
        const hasPanel = () => Boolean(document.querySelector('[data-settings-menu]'));
        const ready = await waitForCondition(() => hasRenderedCurrentRoute() && hasControl(), 240);
        const ok = ready && clickElement(SETTINGS_CONTROL_SELECTOR);
        const panelVisible = ok && (await waitForCondition(hasPanel, 120));
        return result(
            action,
            panelVisible,
            panelVisible ? undefined : 'Settings control or panel not found.',
            panelVisible ? 'dom-click' : 'missing-dom-target'
        );
    };

    const changeSetting = async (action: ParityAction, payload: Record<string, unknown>) => {
        const name = payload.name;
        if (name === 'locale' && (payload.value === 'en' || payload.value === 'zh')) {
            currentParams().setLocale(payload.value);
            await waitForStableFrame();
            return result(action, true);
        }
        if (name === 'soundEnabled' && typeof payload.value === 'boolean') {
            currentParams().setSoundEnabled(payload.value);
            await waitForStableFrame();
            return result(action, true);
        }
        if (name === 'surfaceTheme' && typeof payload.value === 'string') {
            currentParams().selectSurfaceTheme(payload.value as SurfaceThemeVariant);
            await waitForStableFrame();
            return result(action, true);
        }

        await waitForStableFrame();
        return result(action, false, `Unsupported setting ${String(name)}.`);
    };

    return {
        changeSetting,
        chooseBoon,
        chooseRoyal,
        clickMarketCard,
        clickPlayerReserved,
        confirmPreviewAction,
        dispatchPreviewAction,
        endTurn,
        openSettings,
    };
};
