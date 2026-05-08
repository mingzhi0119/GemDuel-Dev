import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ComponentProps } from 'react';
import { LanMenu } from '../LanMenu';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

type LanMenuProps = ComponentProps<typeof LanMenu>;

const createProps = (overrides: Partial<LanMenuProps> = {}): LanMenuProps => ({
    onBack: vi.fn(),
    onRetry: vi.fn(),
    onSelectMode: vi.fn(),
    onConfirmStart: vi.fn(),
    lan: {
        phase: 'searching',
        roomId: null,
        remoteInstanceId: null,
        remoteAddress: null,
        hostPort: null,
        transportHost: false,
        localSeat: null,
        selectedMode: null,
        hostPeerId: null,
        errorMessage: null,
        statusMessage: 'Searching for opponent on local network...',
    },
    theme: 'dark',
    ...overrides,
});

describe('LanMenu', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;

    const renderMenu = async (props: LanMenuProps) => {
        container = document.createElement('div');
        document.body.appendChild(container);

        await act(async () => {
            root = createRoot(container!);
            root.render(<LanMenu {...props} />);
            await Promise.resolve();
        });
    };

    const findButton = (label: string) =>
        Array.from(container?.querySelectorAll('button') ?? []).find((button) =>
            button.textContent?.includes(label)
        ) as HTMLButtonElement | undefined;

    afterEach(() => {
        act(() => {
            root?.unmount();
        });
        container?.remove();
        root = null;
        container = null;
    });

    it('renders the LAN searching state', async () => {
        await renderMenu(createProps());

        expect(container?.textContent).toContain('Searching for opponent...');
        expect(container?.textContent).toContain('Searching for opponent on local network...');
    });

    it('renders idle as an actionable fallback instead of a blank panel', async () => {
        const props = createProps({
            lan: {
                phase: 'idle',
                roomId: null,
                remoteInstanceId: null,
                remoteAddress: null,
                hostPort: null,
                transportHost: false,
                localSeat: null,
                selectedMode: null,
                hostPeerId: null,
                errorMessage: null,
                statusMessage: 'LAN duel is ready.',
            },
        });

        await renderMenu(props);

        expect(container?.textContent).toContain('Ready to Search');
        expect(container?.textContent).toContain('LAN duel is ready.');

        act(() => {
            findButton('Search Again')?.click();
        });

        expect(props.onRetry).toHaveBeenCalledTimes(1);
    });

    it('lets randomized P1 choose a mode and start the duel', async () => {
        const props = createProps({
            lan: {
                phase: 'matched',
                roomId: 'room-1',
                remoteInstanceId: 'peer-2',
                remoteAddress: '192.168.1.20',
                hostPort: 9000,
                transportHost: false,
                localSeat: 'p1',
                selectedMode: 'classic',
                hostPeerId: 'peer-host',
                errorMessage: null,
                statusMessage: 'Opponent matched. Randomized seats are ready.',
            },
        });

        await renderMenu(props);

        const classicButton = findButton('Classic');
        const startButton = findButton('Start Duel');

        expect(container?.textContent).toContain('Match Found');
        expect(container?.textContent).toContain('You are P1. Choose a mode and start the duel.');
        expect(classicButton?.disabled).toBe(false);
        expect(startButton?.disabled).toBe(false);

        act(() => {
            classicButton?.click();
            startButton?.click();
        });

        expect(props.onSelectMode).toHaveBeenCalledWith('classic');
        expect(props.onConfirmStart).toHaveBeenCalledTimes(1);
    });

    it('locks mode selection and start behind randomized P1 ownership', async () => {
        const props = createProps({
            lan: {
                phase: 'matched',
                roomId: 'room-1',
                remoteInstanceId: 'peer-2',
                remoteAddress: '192.168.1.20',
                hostPort: 9001,
                transportHost: true,
                localSeat: 'p2',
                selectedMode: 'roguelike',
                hostPeerId: 'peer-host',
                errorMessage: null,
                statusMessage: 'P1 selected a mode. Ready to start.',
            },
        });

        await renderMenu(props);

        const classicButton = findButton('Classic');
        const roguelikeButton = findButton('Roguelike');
        const startButton = findButton('Start Duel');

        expect(container?.textContent).toContain('Waiting for P1 to choose the mode.');
        expect(classicButton?.disabled).toBe(true);
        expect(roguelikeButton?.disabled).toBe(true);
        expect(startButton?.disabled).toBe(true);

        act(() => {
            classicButton?.click();
            startButton?.click();
        });

        expect(props.onSelectMode).not.toHaveBeenCalled();
        expect(props.onConfirmStart).not.toHaveBeenCalled();
    });
});
