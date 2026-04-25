// @vitest-environment happy-dom

import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { GAME_PHASES } from '@gemduel/shared';
import type { ActiveModal } from '@gemduel/shared/types';
import { LocaleProvider } from '@gemduel/ui/i18n/LocaleProvider';
import { AppOverlayStack } from '../AppOverlayStack';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe('AppOverlayStack', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;

    const renderOverlay = async (
        locale: 'en' | 'zh',
        overrides: Partial<{
            activeModal: ActiveModal | null;
            isReviewing: boolean;
            phase: (typeof GAME_PHASES)[keyof typeof GAME_PHASES];
        }> = {}
    ) => {
        container = document.createElement('div');
        document.body.appendChild(container);

        await act(async () => {
            root = createRoot(container!);
            root.render(
                <LocaleProvider locale={locale} setLocale={vi.fn()}>
                    <AppOverlayStack
                        theme="dark"
                        showRulebook={false}
                        activeModal={overrides.activeModal ?? null}
                        mode="LOCAL_PVP"
                        localPlayer="p1"
                        persistentWinner={null}
                        isReviewing={overrides.isReviewing ?? false}
                        showRestartConfirm={false}
                        phase={overrides.phase ?? GAME_PHASES.SELECT_CARD_COLOR}
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

    it('suppresses the card-color overlay while review mode is active', async () => {
        await renderOverlay('en', { isReviewing: true });

        expect(container?.textContent).not.toContain('Select Card Color');
    });

    it('suppresses the peek modal while review mode is active', async () => {
        await renderOverlay('en', {
            isReviewing: true,
            phase: GAME_PHASES.IDLE,
            activeModal: {
                type: 'PEEK',
                data: {
                    cards: [],
                    initiator: 'p1',
                },
            },
        });

        expect(container?.textContent).not.toContain('Deck Intelligence');
    });

    it('renders five basic gem artwork buttons and excludes gold', async () => {
        await renderOverlay('en');

        const artworkNodes = Array.from(
            container?.querySelectorAll('[data-gem-artwork="true"]') ?? []
        );
        const bonusButtons = Array.from(
            container?.querySelectorAll('button[data-bonus-color] [data-gem-artwork="true"]') ?? []
        );
        const gemIds = bonusButtons.map((node) => node.getAttribute('data-gem-id'));

        expect(artworkNodes.length).toBeGreaterThanOrEqual(5);
        expect(gemIds).toEqual(['blue', 'white', 'green', 'black', 'red']);
        expect(gemIds).not.toContain('gold');
    });
});
