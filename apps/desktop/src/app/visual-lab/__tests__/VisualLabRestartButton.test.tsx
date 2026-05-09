// @vitest-environment happy-dom

import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { VisualLabRestartButton } from '../VisualLabRestartButton';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

describe('VisualLabRestartButton', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;

    const renderButton = async (
        props: Partial<React.ComponentProps<typeof VisualLabRestartButton>> = {}
    ) => {
        container = document.createElement('div');
        document.body.appendChild(container);
        const onCloseToStartPage = vi.fn();

        await act(async () => {
            root = createRoot(container!);
            root.render(
                <VisualLabRestartButton
                    theme="dark"
                    label="Back to start"
                    tooltipId="visual-lab-back-tooltip"
                    readabilityTreatment={false}
                    onCloseToStartPage={onCloseToStartPage}
                    {...props}
                />
            );
        });

        return {
            button: container.querySelector<HTMLButtonElement>('button')!,
            onCloseToStartPage,
        };
    };

    afterEach(() => {
        act(() => {
            root?.unmount();
        });
        container?.remove();
        root = null;
        container = null;
    });

    it('renders the dark close action with tooltip semantics and click behavior', async () => {
        const { button, onCloseToStartPage } = await renderButton();

        expect(button.dataset.visualLabCloseButton).toBe('true');
        expect(button.getAttribute('aria-label')).toBe('Back to start');
        expect(button.getAttribute('aria-describedby')).toBe('visual-lab-back-tooltip');
        expect(button.className).toContain('hover:bg-slate-800/80');

        act(() => {
            button.click();
        });
        expect(onCloseToStartPage).toHaveBeenCalledTimes(1);
    });

    it('renders the light readability treatment branch', async () => {
        const { button } = await renderButton({
            theme: 'light' as unknown as React.ComponentProps<
                typeof VisualLabRestartButton
            >['theme'],
            readabilityTreatment: true,
        });

        expect(button.dataset.readabilityHudChip).toBe('visual-lab-close');
        expect(button.className).toContain('hover:bg-white/80');
    });
});
