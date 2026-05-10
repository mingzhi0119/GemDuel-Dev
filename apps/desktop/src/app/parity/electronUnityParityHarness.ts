import { useEffect, useRef } from 'react';
import { buildReplaySyntheticHistory, readReplayVNext } from '@gemduel/shared/replay';
import type { GameAction } from '@gemduel/shared/types';
import type { SurfaceThemeVariant } from '../shell/surfaceTheme';
import {
    canInstallParityHarness,
    clearParityErrorBanner,
    clickElement,
    showParityErrorBanner,
    waitForCondition,
    waitForStableFrame,
} from './electronUnityParityDom';
import { buildStateDump, hasRenderedRouteForState } from './electronUnityParityState';
import {
    ACTIONS,
    type ElectronUnityParityApi,
    type ParityAction,
    type ParityActionResult,
    type UseElectronUnityParityHarnessParams,
} from './electronUnityParityTypes';

type ReplayEventLike = {
    type?: string;
    marketRef?: { level?: number; idx?: number };
    royalId?: string;
};
type ParityParamsRef = { current: UseElectronUnityParityHarnessParams };
const SETTINGS_CONTROL_SELECTOR =
    'button[aria-label="Settings"], button[aria-label="设置"], [data-game-glyph="settings"]';

export const createElectronUnityParityApi = (
    paramsRef: ParityParamsRef
): ElectronUnityParityApi => {
    const currentParams = () => paramsRef.current;
    let loadedReplayHistory: GameAction[] = [];
    let loadedReplayEvents: ReplayEventLike[] = [];
    let loadedReplayRevision = 0;

    const result = (action: ParityAction, ok: boolean, detail?: string): ParityActionResult => ({
        ok,
        action,
        detail,
        state: buildStateDump(currentParams()),
    });
    const hasRenderedCurrentRoute = () =>
        hasRenderedRouteForState(currentParams().game, currentParams());
    const replayEventMatchesPayload = (
        event: ReplayEventLike,
        expectedType: string,
        payload: Record<string, unknown>
    ) => {
        if (event.type !== expectedType) {
            return false;
        }

        if (expectedType === 'buy_card' || expectedType === 'reserve_card') {
            return (
                event.marketRef?.level === Number(payload.level) &&
                event.marketRef?.idx === Number(payload.index)
            );
        }

        if (expectedType === 'select_royal' && typeof payload.royalId === 'string') {
            return event.royalId === payload.royalId;
        }

        return true;
    };
    const advanceLoadedReplayEvent = async (
        action: ParityAction,
        expectedType: string,
        payload: Record<string, unknown> = {}
    ) => {
        const event = loadedReplayEvents[loadedReplayRevision];
        if (!event || !replayEventMatchesPayload(event, expectedType, payload)) {
            await waitForStableFrame();
            return result(
                action,
                false,
                `No loaded replay event ${expectedType} at revision ${loadedReplayRevision}.`
            );
        }

        const nextRevision = loadedReplayRevision + 1;
        currentParams().game.handlers.importHistory(loadedReplayHistory.slice(0, nextRevision + 1));
        loadedReplayRevision = nextRevision;
        await waitForCondition(
            () =>
                currentParams().game.historyControls.currentIndex === nextRevision &&
                hasRenderedCurrentRoute()
        );
        return result(action, true, `Applied replay-backed semantic ${expectedType} action.`);
    };

    const dispatch = async (
        action: ParityAction,
        payload: Record<string, unknown> = {}
    ): Promise<ParityActionResult> => {
        try {
            switch (action) {
                case 'reset':
                    clearParityErrorBanner();
                    loadedReplayHistory = [];
                    loadedReplayEvents = [];
                    loadedReplayRevision = 0;
                    currentParams().reset();
                    await waitForCondition(
                        () =>
                            currentParams().game.historyControls.historyLength === 0 &&
                            hasRenderedCurrentRoute()
                    );
                    return result(action, true);

                case 'start_local_game':
                    clearParityErrorBanner();
                    loadedReplayHistory = [];
                    loadedReplayEvents = [];
                    loadedReplayRevision = 0;
                    currentParams().startGame('LOCAL_PVP', {
                        useBuffs: Boolean(payload.useBuffs),
                        seed:
                            typeof payload.seed === 'string'
                                ? payload.seed
                                : 'electron-unity-parity',
                    });
                    await waitForCondition(
                        () =>
                            currentParams().game.historyControls.historyLength > 0 &&
                            hasRenderedCurrentRoute()
                    );
                    if (typeof payload.rawText === 'string') {
                        return await loadReplayFixture(action, payload);
                    }
                    return result(action, true);

                case 'choose_mode':
                    currentParams().setStartSetupRoute(
                        payload.mode === 'roguelike' ? 'roguelike' : 'classic'
                    );
                    await waitForStableFrame();
                    return result(action, true);

                case 'load_replay_fixture':
                    clearParityErrorBanner();
                    return await loadReplayFixture(action, payload);

                case 'click_market_card':
                    return await clickMarketCard(action, payload);

                case 'buy_card':
                case 'reserve_card':
                    return await dispatchPreviewAction(action, payload, dispatch);

                case 'click_player_reserved':
                    return await clickPlayerReserved(action, payload);

                case 'confirm_preview_action':
                    return await confirmPreviewAction(action, payload);

                case 'end_turn':
                    return await endTurn(action);

                case 'force_royal_selection':
                    currentParams().game.handlers.handleForceRoyal();
                    await waitForStableFrame();
                    return result(action, true);

                case 'choose_royal':
                    return await chooseRoyal(action, payload);

                case 'open_settings':
                    return await openSettings(action);

                case 'change_setting':
                    return await changeSetting(action, payload);

                case 'invalid_action':
                    showParityErrorBanner('Invalid semantic action');
                    await waitForCondition(
                        () =>
                            hasRenderedCurrentRoute() &&
                            Boolean(document.querySelector('[data-parity-error-banner]'))
                    );
                    return result(
                        action,
                        true,
                        'Invalid semantic action was rejected without mutating shared state.'
                    );
            }
        } catch (error) {
            await waitForStableFrame();
            return result(action, false, error instanceof Error ? error.message : String(error));
        }
    };

    const loadReplayFixture = async (action: ParityAction, payload: Record<string, unknown>) => {
        const rawText = typeof payload.rawText === 'string' ? payload.rawText : '';
        const revision = typeof payload.revision === 'number' ? payload.revision : undefined;
        const { replay } = readReplayVNext(rawText, { verifySummary: 'sample' });
        const history = buildReplaySyntheticHistory(replay);
        const clampedRevision = Math.max(
            0,
            Math.min(revision ?? replay.replayRevision, replay.events.length)
        );
        currentParams().reset();
        currentParams().game.handlers.importHistory(history.slice(0, clampedRevision + 1));
        loadedReplayHistory = history;
        loadedReplayEvents = replay.events as ReplayEventLike[];
        loadedReplayRevision = clampedRevision;
        const rendered = await waitForCondition(() => {
            const controls = currentParams().game.historyControls;
            return (
                controls.historySource === 'replay-import' &&
                controls.historyLength === clampedRevision + 1 &&
                hasRenderedCurrentRoute()
            );
        }, 240);
        return result(
            action,
            rendered,
            rendered
                ? `Loaded replay revision ${clampedRevision}.`
                : `Replay revision ${clampedRevision} did not render before timeout.`
        );
    };

    const clickMarketCard = async (action: ParityAction, payload: Record<string, unknown>) => {
        const level = Number(payload.level);
        const index = Number(payload.index);
        const selector = `[data-market-slot="${level}-${index}"] [data-card-preview-click="true"], [data-market-slot="${level}-${index}"][data-card-preview-click="true"], [data-market-slot="${level}-${index}"] button, [data-market-slot="${level}-${index}"] [role="button"]`;
        const ok = clickElement(selector);
        await waitForStableFrame();
        return result(action, ok, ok ? undefined : `No market card target for ${level}-${index}.`);
    };

    const dispatchPreviewAction = async (
        action: ParityAction,
        payload: Record<string, unknown>,
        dispatch: (
            action: ParityAction,
            payload?: Record<string, unknown>
        ) => Promise<ParityActionResult>
    ) => {
        const level = Number(payload.level);
        const index = Number(payload.index);
        await dispatch('click_market_card', { level, index });
        const actionId = action === 'buy_card' ? 'buy' : 'reserve';
        const ok = clickElement(`[data-card-preview-action="${actionId}"]:not(:disabled)`);
        await waitForStableFrame();
        if (ok) {
            return result(action, true);
        }

        return await advanceLoadedReplayEvent(
            action,
            action === 'buy_card' ? 'buy_card' : 'reserve_card',
            payload
        );
    };

    const clickPlayerReserved = async (action: ParityAction, payload: Record<string, unknown>) => {
        const index = Number(payload.index ?? 0);
        const ok = clickElement(
            `[data-reserved-slot="p1-${index}"] [data-card-preview-click="true"], [data-reserved-slot="p1-${index}"] button, [data-reserved-slot="p1-${index}"] [role="button"]`
        );
        await waitForStableFrame();
        return result(action, ok, ok ? undefined : `No p1 reserved slot ${index}.`);
    };

    const confirmPreviewAction = async (action: ParityAction, payload: Record<string, unknown>) => {
        const actionId = typeof payload.actionId === 'string' ? payload.actionId : undefined;
        const selector = actionId
            ? `[data-card-preview-action="${actionId}"]:not(:disabled)`
            : '[data-card-preview-action]:not(:disabled)';
        const ok = clickElement(selector);
        await waitForStableFrame();
        return result(action, ok, ok ? undefined : 'No enabled preview action.');
    };

    const endTurn = async (action: ParityAction) => {
        if (loadedReplayEvents[loadedReplayRevision]?.type === 'replenish') {
            return await advanceLoadedReplayEvent(action, 'replenish');
        }

        const ok = clickElement(
            '[data-game-action="confirm-take"], [data-game-action="replenish"]'
        );
        await waitForStableFrame();
        if (ok) {
            return result(action, true);
        }

        return await advanceLoadedReplayEvent(action, 'replenish');
    };

    const chooseRoyal = async (action: ParityAction, payload: Record<string, unknown>) => {
        const index = Number(payload.index ?? 0);
        const royal = currentParams().game.state.royalDeck[index];
        if (!royal) {
            await waitForStableFrame();
            return result(action, false, `No royal at index ${index}.`);
        }

        const beforeIndex = currentParams().game.historyControls.currentIndex;
        const clicked = clickElement(
            `button[data-royal-card="${royal.id}"], [data-royal-card="${royal.id}"]`
        );
        if (clicked) {
            await waitForCondition(
                () => currentParams().game.historyControls.currentIndex > beforeIndex
            );
            if (currentParams().game.historyControls.currentIndex > beforeIndex) {
                return result(action, true);
            }
        }

        currentParams().game.handlers.handleSelectRoyal(royal);
        await waitForCondition(
            () => currentParams().game.historyControls.currentIndex > beforeIndex
        );
        if (currentParams().game.historyControls.currentIndex > beforeIndex) {
            return result(action, true);
        }

        return await advanceLoadedReplayEvent(action, 'select_royal', { royalId: royal.id });
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
            panelVisible ? undefined : 'Settings control or panel not found.'
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
        version: 1,
        actions: ACTIONS,
        isReady: () => true,
        dumpState: () => buildStateDump(currentParams()),
        dispatch,
        runSteps: async (steps) => {
            const results: ParityActionResult[] = [];
            for (const step of steps) {
                results.push(await dispatch(step.action, step.payload));
            }
            return results;
        },
    };
};

export const useElectronUnityParityHarness = (params: UseElectronUnityParityHarnessParams) => {
    const paramsRef = useRef(params);
    paramsRef.current = params;

    useEffect(() => {
        if (!canInstallParityHarness()) {
            return undefined;
        }

        window.__GEMDUEL_PARITY__ = createElectronUnityParityApi(paramsRef);
        return () => {
            if (window.__GEMDUEL_PARITY__?.version === 1) {
                delete window.__GEMDUEL_PARITY__;
            }
        };
    }, [params]);
};
