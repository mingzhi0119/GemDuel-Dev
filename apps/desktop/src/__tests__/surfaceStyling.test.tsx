import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { GEM_TYPES } from '@gemduel/shared/constants';
import type { BoardCell, Card as CardType, GemInventory } from '@gemduel/shared/types';
import { Card } from '@gemduel/ui/components/Card';
import { GemIcon } from '@gemduel/ui/components/GemIcon';
import { GameBoard } from '@gemduel/ui/components/GameBoard';
import { getGemPanelSkin } from '../app/shell/surfaceArtwork';

const EMPTY_COST: GemInventory = {
    blue: 0,
    white: 0,
    green: 0,
    black: 0,
    red: 0,
    pearl: 0,
    gold: 0,
};

const SAMPLE_CARD: CardType = {
    id: 'surface-styling-card',
    level: 2,
    cost: {
        ...EMPTY_COST,
        black: 2,
        green: 1,
    },
    points: 2,
    ability: 'none',
    bonusColor: 'green',
    crowns: 0,
    bonusCount: 1,
};

const SAMPLE_GOLD_BONUS_CARD: CardType = {
    ...SAMPLE_CARD,
    id: 'surface-styling-card-gold',
    bonusColor: 'gold',
    cost: {
        ...EMPTY_COST,
        red: 1,
    },
};

const buildBoard = (): BoardCell[][] =>
    Array.from({ length: 5 }, (_, rowIndex) =>
        Array.from({ length: 5 }, (_, colIndex) => ({
            uid: `cell-${rowIndex}-${colIndex}`,
            type:
                rowIndex === 2 && colIndex === 2
                    ? GEM_TYPES.BLACK
                    : rowIndex === 2 && colIndex === 1
                      ? GEM_TYPES.GREEN
                      : GEM_TYPES.EMPTY,
        }))
    );

describe('surface styling affordances', () => {
    it('strengthens the purchasable card highlight in light mode', () => {
        const html = renderToStaticMarkup(<Card card={SAMPLE_CARD} canBuy theme="light" />);

        expect(html).toContain('data-card-affordable="true"');
        expect(html).toContain('border-emerald-700');
        expect(html).toContain('ring-emerald-500/45');
    });

    it('marks dark black gem icons for enhanced contrast', () => {
        const html = renderToStaticMarkup(<GemIcon type={GEM_TYPES.BLACK} theme="dark" />);

        expect(html).toContain('data-gem-contrast="enhanced"');
        expect(html).toContain('/assets/gems/black.png');
        expect(html).not.toContain('border-slate-100/80');
        expect(html).not.toContain('border-white/15');
    });

    it('lifts gold artwork within board-aligned gem renders', () => {
        const html = renderToStaticMarkup(
            <GemIcon type={GEM_TYPES.GOLD} theme="dark" variant="board" />
        );

        expect(html).toContain('/assets/gems/gold.png');
        expect(html).toContain('transform:translate(0%, -11%)');
    });

    it('maps pearl icons onto the pink-pearl artwork asset', () => {
        const html = renderToStaticMarkup(<GemIcon type={GEM_TYPES.PEARL} theme="light" />);

        expect(html).toContain('/assets/gems/pearl.png');
    });

    it('marks dark black board gems for enhanced contrast', () => {
        const panelSkin = getGemPanelSkin('dark');
        const html = renderToStaticMarkup(
            <GameBoard
                board={buildBoard()}
                handleGemClick={() => undefined}
                handleGemDragSelection={() => undefined}
                selectedGems={[]}
                phase="IDLE"
                bonusGemTarget={null}
                theme="dark"
                canInteract={true}
                panelSkin={panelSkin}
            />
        );

        expect(html).toContain('data-gem-contrast="enhanced"');
        expect(html).toContain('/assets/gems/black.png');
        expect(html).toContain('data-gem-panel-skin="dashboard"');
        expect(html).not.toContain('grid-cols-5');
        expect(html).toContain('width:610px');
        expect(html).toContain('left:25.368%');
        expect(html).toContain('top:22.010%');
    });

    it('does not render a light-mode circular base behind board gems', () => {
        const panelSkin = getGemPanelSkin('light');
        const html = renderToStaticMarkup(
            <GameBoard
                board={buildBoard()}
                handleGemClick={() => undefined}
                handleGemDragSelection={() => undefined}
                selectedGems={[]}
                phase="IDLE"
                bonusGemTarget={null}
                theme="light"
                canInteract={true}
                panelSkin={panelSkin}
            />
        );

        expect(html).not.toContain('bg-white/30');
        expect(html).not.toContain('rgba(255,255,255,0.22)');
    });

    it('renders card costs and bonuses with gem artwork assets', () => {
        const html = renderToStaticMarkup(<Card card={SAMPLE_CARD} canBuy theme="dark" />);

        expect(html).toContain('/assets/gems/green.png');
        expect(html).toContain('/assets/gems/black.png');
        expect(html).toContain('data-card-cost-row="black"');
        expect(html).toContain('data-card-cost-count="black"');
        expect(html).toContain('gap:3px');
        expect(html).toContain('color:#fde68a');
    });

    it('renders white gem cost counts with white text', () => {
        const whiteCostCard: CardType = {
            ...SAMPLE_CARD,
            id: 'surface-styling-card-white-cost',
            cost: {
                ...EMPTY_COST,
                white: 3,
            },
        };
        const html = renderToStaticMarkup(<Card card={whiteCostCard} canBuy theme="dark" />);

        expect(html).toContain('data-card-cost-count="white"');
        expect(html).toContain('color:#ffffff');
    });

    it('renders joker card bonuses with the five-gem badge instead of the gold artwork asset', () => {
        const html = renderToStaticMarkup(<Card card={SAMPLE_GOLD_BONUS_CARD} theme="dark" />);

        expect(html).toContain('data-joker-badge="true"');
        expect(html).toContain('data-joker-badge-layer="core"');
        expect(html).toContain('conic-gradient');
        expect(html).not.toContain('/assets/gems/gold.png');
        expect(html).not.toContain('border-white/12');
        expect(html).not.toContain('1px solid rgba(255,255,255,0.12)');
    });
});
