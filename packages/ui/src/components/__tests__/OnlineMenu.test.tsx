import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { OnlineMenu } from '../OnlineMenu';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe('OnlineMenu', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;

    const renderMenu = async (
        overrides: Partial<React.ComponentProps<typeof OnlineMenu>['online']> = {}
    ) => {
        container = document.createElement('div');
        document.body.appendChild(container);

        const props: React.ComponentProps<typeof OnlineMenu> = {
            onBack: vi.fn(),
            online: {
                peerId: '',
                connectionStatus: 'disconnected',
                errorMessage: null,
                isHost: true,
                connectToPeer: vi.fn(),
                clearError: vi.fn(),
                ...overrides,
            },
            startGame: vi.fn(),
            theme: 'dark',
        };

        await act(async () => {
            root = createRoot(container!);
            root.render(
                <LocaleProvider locale="en" setLocale={vi.fn()}>
                    <OnlineMenu {...props} />
                </LocaleProvider>
            );
        });

        return props;
    };

    afterEach(() => {
        act(() => {
            root?.unmount();
        });
        container?.remove();
        root = null;
        container = null;
    });

    it('renders user-visible connection errors and clears them when editing the match id', async () => {
        const props = await renderMenu({
            errorMessage: 'Connection failed. Check the Match ID and try again.',
        });

        expect(container?.textContent).toContain('Connection Issue');
        expect(container?.textContent).toContain(
            'Connection failed. Check the Match ID and try again.'
        );

        const input = container?.querySelector<HTMLInputElement>('input');
        const valueSetter = Object.getOwnPropertyDescriptor(
            HTMLInputElement.prototype,
            'value'
        )?.set;
        await act(async () => {
            valueSetter?.call(input, 'peer-123');
            input?.dispatchEvent(new Event('input', { bubbles: true }));
        });

        expect(props.online.clearError).toHaveBeenCalledTimes(1);
    });

    it('submits the current match id with Enter', async () => {
        const props = await renderMenu();
        const input = container?.querySelector<HTMLInputElement>('input');
        const valueSetter = Object.getOwnPropertyDescriptor(
            HTMLInputElement.prototype,
            'value'
        )?.set;

        await act(async () => {
            valueSetter?.call(input, 'peer-123');
            input?.dispatchEvent(new Event('input', { bubbles: true }));
            input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        });

        expect(props.online.connectToPeer).toHaveBeenCalledWith('peer-123');
    });
});
