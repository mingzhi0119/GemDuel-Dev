import { renderToStaticMarkup } from 'react-dom/server';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BUFFS, GEM_TYPES } from '@gemduel/shared/constants';
import type {
    BoardCell,
    Buff,
    Card as CardType,
    DeckState,
    GemInventory,
    MarketState,
} from '@gemduel/shared/types';
import { Card } from '@gemduel/ui/components/Card';
import { DeckPeekModal } from '@gemduel/ui/components/DeckPeekModal';
import { GemIcon } from '@gemduel/ui/components/GemIcon';
import { GameBoard } from '@gemduel/ui/components/GameBoard';
import { Market } from '@gemduel/ui/components/Market';
import { PlayerZone } from '@gemduel/ui/components/PlayerZone';
import { TopBar } from '@gemduel/ui/components/TopBar';
import { LocaleProvider } from '@gemduel/ui/i18n/LocaleProvider';
import { getGemPanelSkin } from '../app/shell/surfaceArtwork';
import { SURFACE_THEME_VARIANTS } from '../app/shell/surfaceTheme';

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

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

const SAMPLE_PEARL_COST_CARD: CardType = {
    ...SAMPLE_CARD,
    id: 'surface-styling-card-pearl-cost',
    cost: {
        ...EMPTY_COST,
        pearl: 2,
    },
};

const EMPTY_MARKET: MarketState = {
    1: [],
    2: [],
    3: [],
};

const EMPTY_DECKS: DeckState = {
    1: [],
    2: [],
    3: [],
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
        expect(html).toContain('data-gem-panel-skin="square-dashboard"');
        expect(html).not.toContain('grid-cols-5');
        expect(html).toContain('width:452px');
        expect(html).toContain('left:16.800%');
        expect(html).toContain('top:16.800%');
    });

    it('keeps the gem board footprint stable across panel theme variants', () => {
        for (const variant of SURFACE_THEME_VARIANTS) {
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
                    panelSkin={getGemPanelSkin('dark', variant)}
                />
            );

            expect(html).toContain('width:452px');
            expect(html).toContain('height:452px');
        }
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

    it('frames reserve gold targets without dimming other board gems', () => {
        const panelSkin = getGemPanelSkin('dark');
        const board = buildBoard();
        board[0][0] = { uid: 'reserve-gold', type: GEM_TYPES.GOLD };
        board[0][1] = { uid: 'reserve-red', type: GEM_TYPES.RED };

        const html = renderToStaticMarkup(
            <GameBoard
                board={board}
                handleGemClick={() => undefined}
                handleGemDragSelection={() => undefined}
                selectedGems={[]}
                reserveGoldSelection={{ r: 0, c: 0 }}
                phase="RESERVE_WAITING_GEM"
                bonusGemTarget={null}
                theme="dark"
                canInteract={true}
                panelSkin={panelSkin}
            />
        );

        expect(html).toContain('animate-gem-reserve-target');
        expect(html).not.toContain('animate-pulse');
        expect(html).not.toContain('opacity-20 grayscale');
        expect(html).not.toContain('bg-white/5');
        expect(html).not.toContain('shadow-[0_10px_20px_rgba(0,0,0,0.28)]');
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
        expect(html).toContain('-webkit-text-stroke:0.45px rgba(15,23,42,0.94)');
    });

    it('renders pearl gem cost counts with stronger edge contrast', () => {
        const html = renderToStaticMarkup(
            <Card card={SAMPLE_PEARL_COST_CARD} canBuy theme="dark" />
        );

        expect(html).toContain('data-card-cost-count="pearl"');
        expect(html).toContain('color:#fff7fb');
        expect(html).toContain('-webkit-text-stroke:0.42px rgba(76,29,149,0.9)');
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

    it('localizes market deck backs without leaking Chinese into English', () => {
        const renderMarket = (locale: 'en' | 'zh') =>
            renderToStaticMarkup(
                <LocaleProvider locale={locale} setLocale={() => undefined}>
                    <Market
                        market={EMPTY_MARKET}
                        decks={EMPTY_DECKS}
                        phase="IDLE"
                        turn="p1"
                        inventories={{ p1: EMPTY_COST, p2: EMPTY_COST }}
                        playerTableau={{ p1: [], p2: [] }}
                        playerBuffs={{
                            p1: BUFFS.NONE as unknown as Buff,
                            p2: BUFFS.NONE as unknown as Buff,
                        }}
                        handleReserveDeck={() => undefined}
                        initiateBuy={() => undefined}
                        handleReserveCard={() => undefined}
                        theme="dark"
                    />
                </LocaleProvider>
            );

        const englishHtml = renderMarket('en');
        const chineseHtml = renderMarket('zh');

        expect(englishHtml).toContain('Lvl 1');
        expect(englishHtml).toContain('Lvl 2');
        expect(englishHtml).toContain('Lvl 3');
        expect(englishHtml).not.toContain('级');
        expect(chineseHtml).toContain('1 级');
    });

    it('uses featured card dimensions for reserved player-zone cards', () => {
        const html = renderToStaticMarkup(
            <LocaleProvider locale="en" setLocale={() => undefined}>
                <PlayerZone
                    player="p1"
                    inventory={EMPTY_COST}
                    cards={[]}
                    reserved={[SAMPLE_CARD]}
                    privileges={0}
                    isActive={true}
                    lastFeedback={null}
                    onBuyReserved={() => false}
                    onDiscardReserved={() => undefined}
                    onUsePrivilege={() => undefined}
                    isPrivilegeMode={false}
                    onGemClick={() => undefined}
                    isStealMode={false}
                    isDiscardMode={false}
                    buff={BUFFS.NONE as unknown as Buff}
                    theme="dark"
                    score={0}
                    crowns={0}
                />
            </LocaleProvider>
        );

        expect(html).toContain('width:150px');
        expect(html).toContain('height:200px');
    });

    it('renders player-held gems and count badges at the enlarged resource size', () => {
        const html = renderToStaticMarkup(
            <LocaleProvider locale="en" setLocale={() => undefined}>
                <PlayerZone
                    player="p1"
                    inventory={{ ...EMPTY_COST, red: 2, gold: 1 }}
                    cards={[]}
                    reserved={[]}
                    privileges={0}
                    isActive={true}
                    lastFeedback={null}
                    onBuyReserved={() => false}
                    onDiscardReserved={() => undefined}
                    onUsePrivilege={() => undefined}
                    isPrivilegeMode={false}
                    onGemClick={() => undefined}
                    isStealMode={false}
                    isDiscardMode={false}
                    buff={BUFFS.NONE as unknown as Buff}
                    theme="dark"
                    score={0}
                    crowns={0}
                />
            </LocaleProvider>
        );

        expect(html).toContain('width:90px');
        expect(html).toContain('height:90px');
        expect(html).toContain('min-width:38px');
        expect(html).toContain('font-size:22px');
    });

    it('renders the centered turn core and safe-side buff slots in the top bar', () => {
        const html = renderToStaticMarkup(
            <LocaleProvider locale="zh" setLocale={() => undefined}>
                <TopBar
                    p1Score={0}
                    p1Crowns={0}
                    p2Score={0}
                    p2Crowns={0}
                    playerTurnCounts={{ p1: 1, p2: 0 }}
                    activePlayer="p1"
                    theme="dark"
                    playerBuffs={{
                        p1: BUFFS.PRIVILEGE_FAVOR as unknown as Buff,
                        p2: BUFFS.DEEP_POCKETS as unknown as Buff,
                    }}
                />
            </LocaleProvider>
        );

        expect(html).toContain('data-topbar-center-core="true"');
        expect(html).toContain('data-topbar-turn-core="true"');
        expect(html).toContain('data-topbar-buff-slot="p1"');
        expect(html).toContain('data-topbar-buff-slot="p2"');
        expect(html).toContain('data-topbar-turn-side="p1"');
        expect(html).toContain('data-topbar-turn-side="p2"');
        expect(html).toContain('data-topbar-score-anchor="p1"');
        expect(html).toContain('data-topbar-score-anchor="p2"');
        expect(html.indexOf('data-topbar-crown-group="p1"')).toBeLessThan(
            html.indexOf('data-topbar-points-group="p1"')
        );
        expect(html.indexOf('data-topbar-crown-group="p2"')).toBeLessThan(
            html.indexOf('data-topbar-points-group="p2"')
        );
    });

    it('renders deck peek cards larger than featured market cards', () => {
        const html = renderToStaticMarkup(
            <LocaleProvider locale="zh" setLocale={() => undefined}>
                <DeckPeekModal
                    isOpen={true}
                    cards={[SAMPLE_CARD, SAMPLE_GOLD_BONUS_CARD]}
                    onClose={() => undefined}
                    theme="dark"
                />
            </LocaleProvider>
        );

        expect(html).toContain('width:180px');
        expect(html).toContain('height:240px');
        expect(html).toContain('w-[min(92vw,1500px)]');
    });
});

describe('game board drag interactions', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;

    const renderBoard = ({
        selectedGems,
        handleGemDragSelection,
    }: {
        selectedGems: Array<{ r: number; c: number }>;
        handleGemDragSelection: (coords: Array<{ r: number; c: number }>, intent?: string) => void;
    }) => {
        container = document.createElement('div');
        document.body.appendChild(container);
        root = createRoot(container);

        const board = buildBoard();
        board[0][0] = { uid: 'drag-red', type: GEM_TYPES.RED };
        board[0][1] = { uid: 'drag-green', type: GEM_TYPES.GREEN };
        board[0][2] = { uid: 'drag-blue', type: GEM_TYPES.BLUE };

        act(() => {
            root?.render(
                <GameBoard
                    board={board}
                    handleGemClick={() => undefined}
                    handleGemDragSelection={handleGemDragSelection}
                    selectedGems={selectedGems}
                    phase="IDLE"
                    bonusGemTarget={null}
                    theme="dark"
                    canInteract={true}
                    panelSkin={getGemPanelSkin('dark')}
                />
            );
        });
    };

    const getCellButton = (coord: string) =>
        container?.querySelector<HTMLButtonElement>(`[data-board-cell="${coord}"] button`);

    afterEach(() => {
        act(() => {
            root?.unmount();
        });
        container?.remove();
        root = null;
        container = null;
    });

    it('emits select intent when dragging across unselected gems', () => {
        const handleGemDragSelection = vi.fn();
        renderBoard({ selectedGems: [], handleGemDragSelection });

        act(() => {
            getCellButton('0-0')?.dispatchEvent(
                new PointerEvent('pointerdown', { bubbles: true, button: 0 })
            );
            getCellButton('0-1')?.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));
            window.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
        });

        expect(handleGemDragSelection).toHaveBeenCalledWith(
            [
                { r: 0, c: 0 },
                { r: 0, c: 1 },
            ],
            'select'
        );
    });

    it('emits deselect intent when dragging across selected gems', () => {
        const handleGemDragSelection = vi.fn();
        renderBoard({
            selectedGems: [
                { r: 0, c: 0 },
                { r: 0, c: 1 },
                { r: 0, c: 2 },
            ],
            handleGemDragSelection,
        });

        act(() => {
            getCellButton('0-0')?.dispatchEvent(
                new PointerEvent('pointerdown', { bubbles: true, button: 0 })
            );
            getCellButton('0-1')?.dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));
            window.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
        });

        expect(handleGemDragSelection).toHaveBeenCalledWith(
            [
                { r: 0, c: 0 },
                { r: 0, c: 1 },
            ],
            'deselect'
        );
    });
});
