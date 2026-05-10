import { useEffect, useRef } from 'react';
import { buildReplaySyntheticHistory, readReplayVNext } from '@gemduel/shared/replay';
import type { GameAction } from '@gemduel/shared/types';
import {
    canInstallParityHarness,
    clearParityErrorBanner,
    showParityErrorBanner,
    waitForCondition,
    waitForStableFrame,
} from './electronUnityParityDom';
import {
    createElectronUnityClickActions,
    type ReplayEventLike,
} from './electronUnityParityClickActions';
import { buildStateDump, hasRenderedRouteForState } from './electronUnityParityState';
import {
    ACTIONS,
    type ElectronUnityParityApi,
    type ParityAction,
    type ParityActionResult,
    type UseElectronUnityParityHarnessParams,
} from './electronUnityParityTypes';

type ParityParamsRef = { current: UseElectronUnityParityHarnessParams };

export const createElectronUnityParityApi = (
    paramsRef: ParityParamsRef
): ElectronUnityParityApi => {
    const currentParams = () => paramsRef.current;
    let loadedReplayHistory: GameAction[] = [];
    let loadedReplayEvents: ReplayEventLike[] = [];
    let loadedReplayRevision = 0;

    const result = (
        action: ParityAction,
        ok: boolean,
        detail?: string,
        driver = 'semantic'
    ): ParityActionResult => ({
        ok,
        action,
        detail,
        driver,
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

        if (expectedType === 'select_buff' && typeof payload.buffId === 'string') {
            return event.buffId === payload.buffId;
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
        return result(
            action,
            true,
            `Applied replay-backed semantic ${expectedType} action.`,
            'replay-state-import'
        );
    };

    const clickActions = createElectronUnityClickActions({
        currentParams,
        result,
        hasRenderedCurrentRoute,
        getLoadedReplayEvent: () => loadedReplayEvents[loadedReplayRevision],
        advanceLoadedReplayEvent,
    });

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

                case 'choose_boon':
                    return await clickActions.chooseBoon(action, payload);

                case 'load_replay_fixture':
                    clearParityErrorBanner();
                    return await loadReplayFixture(action, payload);

                case 'click_market_card':
                    return await clickActions.clickMarketCard(action, payload);

                case 'buy_card':
                case 'reserve_card':
                    return await clickActions.dispatchPreviewAction(action, payload);

                case 'click_player_reserved':
                    return await clickActions.clickPlayerReserved(action, payload);

                case 'confirm_preview_action':
                    return await clickActions.confirmPreviewAction(action, payload);

                case 'end_turn':
                    return await clickActions.endTurn(action);

                case 'force_royal_selection':
                    currentParams().game.handlers.handleForceRoyal();
                    await waitForStableFrame();
                    return result(action, true);

                case 'choose_royal':
                    return await clickActions.chooseRoyal(action, payload);

                case 'open_settings':
                    return await clickActions.openSettings(action);

                case 'change_setting':
                    return await clickActions.changeSetting(action, payload);

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
        if (rendered && payload.interactive === true) {
            currentParams().setReplayReviewing?.(false);
            await waitForStableFrame();
        }
        return result(
            action,
            rendered,
            rendered
                ? `Loaded replay revision ${clampedRevision}.`
                : `Replay revision ${clampedRevision} did not render before timeout.`,
            payload.interactive === true ? 'setup-replay-load-interactive' : 'setup-replay-load'
        );
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
