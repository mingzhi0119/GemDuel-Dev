import type { SurfaceThemeVariant } from '../shell/surfaceTheme';
import {
    clickElement,
    hoverElement,
    waitForCondition,
    waitForStableFrame,
} from './electronUnityParityDom';
import type { ParityAction } from './electronUnityParityTypes';
import {
    type ClickActionDeps,
    RESTART_CONFIRM_SELECTOR,
    RESTART_CONTROL_SELECTOR,
    RULEBOOK_CONTROL_SELECTOR,
    SETTINGS_CONTROL_SELECTOR,
    SETTINGS_LOAD_SELECTOR,
    SETTINGS_SAVE_SELECTOR,
    runWithDeterministicDraftRandom,
} from './electronUnityParityClickActionSupport';

export const createChromeParityClickActions = ({
    currentParams,
    result,
    hasRenderedCurrentRoute,
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

    const hoverBoon = async (action: ParityAction, payload: Record<string, unknown>) => {
        const buffId = typeof payload.buffId === 'string' ? payload.buffId : undefined;
        const index = Number(payload.index ?? 0);
        const selector = buffId
            ? `[data-draft-buff-id="${buffId}"]`
            : `[data-draft-buff-index="${index}"]`;
        const ok = hoverElement(selector);
        await waitForStableFrame();
        return result(
            action,
            ok,
            ok
                ? `Hovered draft boon ${buffId ?? index}.`
                : `No draft boon target for ${buffId ?? index}.`,
            ok ? 'dom-hover' : 'missing-dom-target'
        );
    };

    const clickChromeRulebook = async (action: ParityAction) => {
        const ok = clickElement(RULEBOOK_CONTROL_SELECTOR);
        const opened = ok
            ? await waitForCondition(
                  () => Boolean(document.querySelector('[data-rulebook-panel]')),
                  120
              )
            : false;
        return result(
            action,
            opened,
            opened
                ? 'Opened rulebook from top-right control.'
                : 'Rulebook control or panel not found.',
            opened ? 'dom-click' : 'missing-dom-target'
        );
    };

    const clickChromeRestart = async (action: ParityAction) => {
        const requested = clickElement(RESTART_CONTROL_SELECTOR);
        const confirmVisible =
            requested &&
            (await waitForCondition(
                () => Boolean(document.querySelector(RESTART_CONFIRM_SELECTOR)),
                120
            ));
        const confirmed = confirmVisible && clickElement(RESTART_CONFIRM_SELECTOR);
        const reset = confirmed
            ? await waitForCondition(
                  () =>
                      currentParams().game.historyControls.historyLength === 0 &&
                      hasRenderedCurrentRoute(),
                  180
              )
            : false;
        return result(
            action,
            reset,
            reset
                ? 'Clicked restart and confirmed reset.'
                : 'Restart control, confirmation, or reset state was not observed.',
            reset ? 'dom-click' : 'missing-dom-target'
        );
    };

    const hoverChromeControl = async (action: ParityAction, payload: Record<string, unknown>) => {
        const control = payload.control;
        const selector =
            control === 'rulebook'
                ? RULEBOOK_CONTROL_SELECTOR
                : control === 'restart'
                  ? RESTART_CONTROL_SELECTOR
                  : SETTINGS_CONTROL_SELECTOR;
        const ok = hoverElement(selector);
        await waitForStableFrame();
        return result(
            action,
            ok,
            ok
                ? `Hovered chrome ${String(control ?? 'settings')} control.`
                : 'Chrome control not found.',
            ok ? 'dom-hover' : 'missing-dom-target'
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

    const settingsSave = async (action: ParityAction) => {
        const ok = clickElement(SETTINGS_SAVE_SELECTOR);
        await waitForStableFrame();
        return result(
            action,
            ok,
            ok
                ? 'Clicked settings save replay control.'
                : 'Settings save replay control not found.',
            ok ? 'dom-click' : 'missing-dom-target'
        );
    };

    const settingsLoad = async (action: ParityAction) => {
        const element = document.querySelector<HTMLElement>(SETTINGS_LOAD_SELECTOR);
        if (!element) {
            await waitForStableFrame();
            return result(
                action,
                false,
                'Settings load replay control not found.',
                'missing-dom-target'
            );
        }

        const preventFileDialog = (event: Event) => event.preventDefault();
        element.addEventListener('click', preventFileDialog, { capture: true, once: true });
        element.dispatchEvent(
            new MouseEvent('click', { bubbles: true, cancelable: true, view: window })
        );
        await waitForStableFrame();
        return result(action, true, 'Clicked settings load replay control.', 'dom-click');
    };

    const closeSettings = async (action: ParityAction) => {
        document.dispatchEvent(
            new MouseEvent('pointerdown', { bubbles: true, cancelable: true, view: window })
        );
        const closed = await waitForCondition(
            () => !document.querySelector('[data-settings-menu]'),
            120
        );
        return result(
            action,
            closed,
            closed ? 'Closed settings panel.' : 'Settings panel did not close.',
            closed ? 'dom-click' : 'missing-dom-target'
        );
    };

    const changeSetting = async (action: ParityAction, payload: Record<string, unknown>) => {
        const name = payload.name;
        if (name === 'locale' && (payload.value === 'en' || payload.value === 'zh')) {
            const clicked = clickElement(`[data-locale-option="${payload.value}"]`);
            if (clicked) {
                await waitForStableFrame();
                return result(action, true, `Clicked locale option ${payload.value}.`, 'dom-click');
            }

            currentParams().setLocale(payload.value);
            await waitForStableFrame();
            return result(action, true, `Set locale ${payload.value} through harness fallback.`);
        }
        if (name === 'soundEnabled' && typeof payload.value === 'boolean') {
            const selector = 'button[data-app-sound-toggle="true"]';
            const target = document.querySelector<HTMLButtonElement>(selector);
            if (target && !target.disabled) {
                const alreadyDesired = currentParams().soundEnabled === payload.value;
                const firstClick = clickElement(selector);
                await waitForStableFrame();
                const secondClick = alreadyDesired ? clickElement(selector) : true;
                if (alreadyDesired) {
                    await waitForStableFrame();
                }

                return result(
                    action,
                    firstClick && secondClick,
                    alreadyDesired
                        ? `Clicked sound toggle twice to preserve ${String(payload.value)}.`
                        : `Clicked sound toggle to ${String(payload.value)}.`,
                    firstClick && secondClick ? 'dom-click' : 'missing-dom-target'
                );
            }

            currentParams().setSoundEnabled(payload.value);
            await waitForStableFrame();
            return result(action, true);
        }
        if (name === 'surfaceTheme' && typeof payload.value === 'string') {
            const optionSelector = `[data-app-surface-theme-option="${payload.value}"]`;
            if (
                document.querySelector(optionSelector) ||
                clickElement('[data-app-surface-theme-select="true"]')
            ) {
                await waitForStableFrame();
                const optionClicked = clickElement(optionSelector);
                if (optionClicked) {
                    await waitForStableFrame();
                    return result(action, true, undefined, 'dom-click');
                }
            }

            currentParams().selectSurfaceTheme(payload.value as SurfaceThemeVariant);
            await waitForStableFrame();
            return result(action, true, `Set surface theme ${payload.value} through fallback.`);
        }

        await waitForStableFrame();
        return result(action, false, `Unsupported setting ${String(name)}.`);
    };

    return {
        changeSetting,
        chooseBoon,
        clickChromeRestart,
        clickChromeRulebook,
        closeSettings,
        hoverBoon,
        hoverChromeControl,
        openSettings,
        settingsLoad,
        settingsSave,
    };
};
