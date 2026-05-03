// @vitest-environment happy-dom
import React, { act, createRef } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ROYAL_CARDS } from '@gemduel/shared/constants';
import { CLASSIC_CARDS } from '@gemduel/shared/data/realCards';
import type { GemInventory } from '@gemduel/shared/types';
import { Card } from '../Card';
import { RoyalCourt } from '../RoyalCourt';
import { PlayerZoneResourcesColumn } from '../playerZone/PlayerZoneResourcesColumn';
import { PlayerZoneTableauStack } from '../playerZone/PlayerZoneTableauStack';
import { PLAYER_ZONE_DISPLAY_COLORS } from '../playerZone/constants';
import type { PlayerZoneColorStats } from '../playerZone/types';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const card = CLASSIC_CARDS[0]!;
const royal = ROYAL_CARDS[0]!;

const inventory: GemInventory = {
    red: 1,
    green: 0,
    blue: 0,
    white: 0,
    black: 0,
    pearl: 0,
    gold: 0,
};

const emptyColorStats = Object.fromEntries(
    PLAYER_ZONE_DISPLAY_COLORS.map((color) => [
        color,
        { cards: [], bonusCount: 0, points: 0 } satisfies PlayerZoneColorStats,
    ])
) as Record<string, PlayerZoneColorStats>;

let root: Root | null = null;
let container: HTMLDivElement | null = null;

const render = async (node: React.ReactNode) => {
    container = document.createElement('div');
    document.body.appendChild(container);

    await act(async () => {
        root = createRoot(container!);
        root.render(node);
    });

    return container;
};

afterEach(() => {
    act(() => {
        root?.unmount();
    });
    container?.remove();
    root = null;
    container = null;
});

describe('interactive UI surfaces', () => {
    it('activates card preview from keyboard events', async () => {
        const onClick = vi.fn();
        const view = await render(<Card card={card} allowUnavailableClick onClick={onClick} />);
        const cardButton = view.querySelector<HTMLElement>(
            '[role="button"][aria-label="Preview card 151-bk"]'
        );

        expect(cardButton).not.toBeNull();
        expect(cardButton?.tabIndex).toBe(0);

        await act(async () => {
            cardButton?.dispatchEvent(
                new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
            );
            cardButton?.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
            cardButton?.dispatchEvent(
                new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
            );
        });

        expect(onClick).toHaveBeenCalledTimes(2);
        expect(onClick).toHaveBeenNthCalledWith(1, card, undefined);
        expect(onClick).toHaveBeenNthCalledWith(2, card, undefined);
    });

    it('renders royal cards as native buttons for selection', async () => {
        const handleSelectRoyal = vi.fn();
        const view = await render(
            <RoyalCourt
                royalDeck={[royal]}
                phase="SELECT_ROYAL"
                handleSelectRoyal={handleSelectRoyal}
                theme="dark"
            />
        );
        const royalButton = view.querySelector<HTMLButtonElement>(
            `button[data-royal-card="${royal.id}"]`
        );

        expect(royalButton).not.toBeNull();
        expect(royalButton?.disabled).toBe(false);
        expect(royalButton?.getAttribute('aria-label')).toBe(`Select royal card ${royal.label}`);

        await act(async () => {
            royalButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        });

        expect(handleSelectRoyal).toHaveBeenCalledWith(royal);
    });

    it('preserves gem button disabled semantics while keeping active gems clickable', async () => {
        const onGemClick = vi.fn();
        const view = await render(
            <PlayerZoneResourcesColumn
                player="p1"
                inventory={inventory}
                feedbacks={[]}
                isStealMode={false}
                isDiscardMode={true}
                theme="dark"
                colorStats={emptyColorStats}
                specialStackStats={{
                    cards: [],
                    bonusCount: 0,
                    points: 0,
                    purePointCount: 0,
                    royalCount: 0,
                }}
                tableauRowRef={createRef<HTMLDivElement>()}
                tableauSummaryScale={0.72}
                inventoryGemSizePx={32}
                inventoryGemBadgeSizePx={16}
                inventoryGemCountFontPx={12}
                summaryBadgeFontPx={12}
                summaryBadgeSizePx={20}
                onGemClick={onGemClick}
                onSelectStack={vi.fn()}
            />
        );
        const redGem = view.querySelector<HTMLButtonElement>('button[data-player-gem="p1-red"]');
        const greenGem = view.querySelector<HTMLButtonElement>(
            'button[data-player-gem="p1-green"]'
        );

        expect(redGem).not.toBeNull();
        expect(greenGem).not.toBeNull();
        expect(redGem?.disabled).toBe(false);
        expect(greenGem?.disabled).toBe(true);

        await act(async () => {
            redGem?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            greenGem?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        });

        expect(onGemClick).toHaveBeenCalledTimes(1);
        expect(onGemClick).toHaveBeenCalledWith('red');
    });

    it('renders tableau stacks as disabled or active native buttons', async () => {
        const onSelectStack = vi.fn();
        const view = await render(
            <>
                <PlayerZoneTableauStack
                    player="p1"
                    color="red"
                    stats={{ cards: [card], bonusCount: 1, points: 0 }}
                    theme="dark"
                    tableauSummaryScale={0.72}
                    summaryBadgeFontPx={12}
                    summaryBadgeSizePx={20}
                    onSelectStack={onSelectStack}
                />
                <PlayerZoneTableauStack
                    player="p1"
                    color="green"
                    stats={{ cards: [], bonusCount: 0, points: 0 }}
                    theme="dark"
                    tableauSummaryScale={0.72}
                    summaryBadgeFontPx={12}
                    summaryBadgeSizePx={20}
                    onSelectStack={onSelectStack}
                />
            </>
        );
        const redStack = view.querySelector<HTMLButtonElement>(
            'button[data-tableau-stack="p1-red"]'
        );
        const greenStack = view.querySelector<HTMLButtonElement>(
            'button[data-tableau-stack="p1-green"]'
        );

        expect(redStack).not.toBeNull();
        expect(greenStack).not.toBeNull();
        expect(redStack?.disabled).toBe(false);
        expect(greenStack?.disabled).toBe(true);

        await act(async () => {
            redStack?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            greenStack?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        });

        expect(onSelectStack).toHaveBeenCalledTimes(1);
        expect(onSelectStack).toHaveBeenCalledWith({ color: 'red', cards: [card] });
    });
});
