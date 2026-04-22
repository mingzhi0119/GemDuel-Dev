import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import type { ComponentProps } from 'react';
import { DraftScreen } from '../DraftScreen';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { BUFFS } from '@gemduel/shared/constants';

describe('DraftScreen', () => {
    const renderDraftScreen = (overrides: Partial<ComponentProps<typeof DraftScreen>> = {}) =>
        renderToStaticMarkup(
            <LocaleProvider locale="en" setLocale={vi.fn()}>
                <DraftScreen
                    draftPool={[
                        BUFFS.PRIVILEGE_FAVOR.id,
                        BUFFS.INTELLIGENCE.id,
                        BUFFS.DEEP_POCKETS.id,
                    ]}
                    buffLevel={1}
                    activePlayer="p1"
                    onSelectBuff={vi.fn()}
                    onReroll={vi.fn()}
                    theme="dark"
                    localPlayer="p1"
                    isOnline={false}
                    isPvE={false}
                    {...overrides}
                />
            </LocaleProvider>
        );

    it('shows reroll controls for offline local roguelike drafts', () => {
        const html = renderDraftScreen();

        expect(html).toContain('DRAFT CUSTOMIZE');
        expect(html).toContain('Refresh Pool');
        expect(html).toContain('L1');
        expect(html).toContain('L2');
        expect(html).toContain('L3');
    });

    it('hides reroll controls for online drafts', () => {
        const html = renderDraftScreen({
            isOnline: true,
            localPlayer: 'p1',
        });

        expect(html).not.toContain('DRAFT CUSTOMIZE');
        expect(html).not.toContain('Refresh Pool');
    });
});
