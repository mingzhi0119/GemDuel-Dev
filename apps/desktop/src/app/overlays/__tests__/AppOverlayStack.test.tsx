// @vitest-environment happy-dom

import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { GAME_PHASES } from '@gemduel/shared';
import { LocaleProvider } from '@gemduel/ui/i18n/LocaleProvider';
import { AppOverlayStack } from '../AppOverlayStack';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe('AppOverlayStack', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;

    const renderOverlay = async (locale: 'en' | 'zh') => {
        container = document.createElement('div');
        document.body.appendChild(container);

        await act(async () => {
            root = createRoot(container!);
            root.render(
                <LocaleProvider locale={locale} setLocale={vi.fn()}>
                    <AppOverlayStack
                        theme="dark"
                        showRulebook={false}
                        activeModal={null}
                        mode="LOCAL_PVP"
                        localPlayer="p1"
                        persistentWinner={null}
                        isReviewing={false}
                        showRestartConfirm={false}
                        phase={GAME_PHASES.SELECT_CARD_COLOR}
                        isPeekingBoard={false}
                        onCloseRulebook={vi.fn()}
                        onCloseModal={vi.fn()}
                        onStartReview={vi.fn()}
                        onStopReview={vi.fn()}
                        onCancelRestart={vi.fn()}
                        onConfirmRestart={vi.fn()}
                        onStartBoardPeek={vi.fn()}
                        onStopBoardPeek={vi.fn()}
                        onSelectBonusColor={vi.fn()}
                    />
                </LocaleProvider>
            );
            await Promise.resolve();
        });
    };

    afterEach(() => {
        act(() => {
            root?.unmount();
        });
        container?.remove();
        root = null;
        container = null;
    });

    it('renders the English card-color overlay title with the lexicon term', async () => {
        await renderOverlay('en');

        expect(container?.textContent).toContain('Select');
        expect(container?.textContent).toContain('Card Color');
        expect(container?.textContent).not.toContain('Select Joker Color');
    });

    it('renders the Chinese card-color overlay title with the canonical term', async () => {
        await renderOverlay('zh');

        expect(container?.textContent).toContain('选择');
        expect(container?.textContent).toContain('卡牌颜色');
        expect(container?.textContent).not.toContain('选择小丑颜色');
    });
});
