import { renderToStaticMarkup } from 'react-dom/server';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BUFFS, GEM_TYPES, ROYAL_CARDS } from '@gemduel/shared/constants';
import type {
    BoardCell,
    Buff,
    Card as CardType,
    DeckState,
    GemInventory,
    MarketState,
} from '@gemduel/shared/types';
import { Card } from '@gemduel/ui/components/Card';
import { CardPreviewOverlay } from '@gemduel/ui/components/CardPreviewOverlay';
import { createCardPreviewActions } from '@gemduel/ui/components/cardPreviewActions';
import { DeckPeekModal } from '@gemduel/ui/components/DeckPeekModal';
import { GemIcon } from '@gemduel/ui/components/GemIcon';
import { GameActions } from '@gemduel/ui/components/GameActions';
import { GameBoard } from '@gemduel/ui/components/GameBoard';
import { Market } from '@gemduel/ui/components/Market';
import { PlayerZone } from '@gemduel/ui/components/PlayerZone';
import { ReplayControls } from '@gemduel/ui/components/ReplayControls';
import { RoyalCourt } from '@gemduel/ui/components/RoyalCourt';
import { TopBar } from '@gemduel/ui/components/TopBar';
import { MarketDeckBack } from '@gemduel/ui/components/market/MarketDeckBack';
import { LocaleProvider } from '@gemduel/ui/i18n/LocaleProvider';
import { INITIAL_STATE_SKELETON } from '@gemduel/shared/logic/initialState';
import type { AppRouteProps, ResponsiveLayout } from '@app/types/ui';
import { GameShell } from '../app/shell/GameShell';
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

const SAMPLE_PURE_POINTS_CARD: CardType = {
    ...SAMPLE_CARD,
    id: 'surface-styling-card-pure-points',
    bonusColor: 'null',
    bonusCount: 0,
    points: 3,
    cost: {
        ...EMPTY_COST,
        white: 2,
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
        expect(html).toContain('left:18.905%');
        expect(html).toContain('top:15.335%');
        expect(html).toContain('width:57px');
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
            expect(html).toContain('data-gem-panel-skin="square-dashboard"');
        }
    });

    it('can render the gem panel calibration overlay without changing board footprint', () => {
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
                panelSkin={getGemPanelSkin('dark', 'clean-boardgame')}
                showCalibrationOverlay={true}
            />
        );

        expect(html).toContain('data-gem-panel-calibration-overlay="true"');
        expect(html.match(/data-gem-panel-calibration-cell=/g)).toHaveLength(25);
        expect(html).toContain('width:452px');
        expect(html).toContain('height:452px');
    });

    it('does not render a circular base behind board gems', () => {
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

    it('renders market deck artwork as an isolated image layer', () => {
        const html = renderToStaticMarkup(
            <MarketDeckBack
                level={1}
                count={12}
                theme="dark"
                levelLabel="Lvl 1"
                artwork={{ path: '/assets/test-card-back.png', variant: 'test-l1' }}
            />
        );

        expect(html).toContain('data-market-deck-back-img="true"');
        expect(html).toContain('src="/assets/test-card-back.png"');
        expect(html).not.toContain('background-image:url');
        expect(html).not.toContain('filter:');
        expect(html).not.toContain('group-hover');
        expect(html).not.toContain('inset-2 rounded-md border');
    });

    it('keeps market deck backs borderless until hover or focus', () => {
        const html = renderToStaticMarkup(
            <LocaleProvider locale="en" setLocale={() => undefined}>
                <Market
                    market={EMPTY_MARKET}
                    decks={{ ...EMPTY_DECKS, 1: [SAMPLE_CARD] }}
                    phase="IDLE"
                    turn="p1"
                    inventories={{ p1: EMPTY_COST, p2: EMPTY_COST }}
                    playerTableau={{ p1: [], p2: [] }}
                    playerBuffs={{
                        p1: BUFFS.NONE as unknown as Buff,
                        p2: BUFFS.NONE as unknown as Buff,
                    }}
                    onPreviewDeckReserve={() => undefined}
                    theme="dark"
                />
            </LocaleProvider>
        );

        expect(html).toContain('data-market-deck="1"');
        expect(html).toContain('border-transparent');
        expect(html).toContain('hover:border-emerald-400');
        expect(html).toContain('focus-visible:border-emerald-400');
        expect(html).not.toContain('border-slate-600 hover:border-emerald-400');
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
                    phase="IDLE"
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

    it('renders player-zone columns in side-specific order', () => {
        const renderZone = (player: 'p1' | 'p2') => {
            const html = renderToStaticMarkup(
                <LocaleProvider locale="en" setLocale={() => undefined}>
                    <PlayerZone
                        player={player}
                        inventory={EMPTY_COST}
                        cards={[]}
                        reserved={[SAMPLE_CARD]}
                        privileges={0}
                        isActive={true}
                        phase="IDLE"
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
            const container = document.createElement('div');
            container.innerHTML = html;

            return Array.from(container.querySelectorAll('[data-player-zone-column]')).map(
                (element) => element.getAttribute('data-player-zone-column')
            );
        };

        expect(renderZone('p1')).toEqual(['reserved', 'resources', 'identity']);
        expect(renderZone('p2')).toEqual(['identity', 'resources', 'reserved']);
    });

    it('renders the five basic tableau stacks plus one pure-royal special stack', () => {
        const html = renderToStaticMarkup(
            <LocaleProvider locale="en" setLocale={() => undefined}>
                <PlayerZone
                    player="p1"
                    inventory={EMPTY_COST}
                    cards={[{ ...SAMPLE_CARD, bonusColor: 'red' }, SAMPLE_PURE_POINTS_CARD]}
                    reserved={[]}
                    royals={[ROYAL_CARDS[0]!]}
                    privileges={0}
                    isActive={true}
                    phase="IDLE"
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
        const container = document.createElement('div');
        container.innerHTML = html;
        const stacks = Array.from(container.querySelectorAll('[data-tableau-stack]'));
        const stackColors = stacks.map((element) =>
            element.getAttribute('data-tableau-stack-color')
        );
        const specialStack = container.querySelector(
            '[data-tableau-special-stack="p1-pure-royal"]'
        );

        expect(stacks).toHaveLength(6);
        expect(stackColors).toEqual(['red', 'green', 'blue', 'white', 'black', 'pure-royal']);
        expect(specialStack?.getAttribute('data-tableau-card-count')).toBe('2');
        expect(specialStack?.getAttribute('data-tableau-special-pure-count')).toBe('1');
        expect(specialStack?.getAttribute('data-tableau-special-royal-count')).toBe('1');
        expect(container.querySelector('[data-tableau-point-summary="red"]')?.textContent).toBe(
            '2/10'
        );
        expect(
            container.querySelector('[data-tableau-point-summary="pure-royal"]')?.textContent
        ).not.toContain('/10');
        expect(specialStack?.textContent).not.toContain('/10');
    });

    it('tracks empty, pure-only, and royal-only special stack counts', () => {
        const renderSpecialStack = (cards: CardType[], royals = [] as typeof ROYAL_CARDS) => {
            const html = renderToStaticMarkup(
                <LocaleProvider locale="en" setLocale={() => undefined}>
                    <PlayerZone
                        player="p1"
                        inventory={EMPTY_COST}
                        cards={cards}
                        reserved={[]}
                        royals={royals}
                        privileges={0}
                        isActive={true}
                        phase="IDLE"
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
            const container = document.createElement('div');
            container.innerHTML = html;
            return container.querySelector('[data-tableau-special-stack="p1-pure-royal"]');
        };

        expect(renderSpecialStack([])?.getAttribute('data-tableau-card-count')).toBe('0');
        expect(
            renderSpecialStack([SAMPLE_PURE_POINTS_CARD])?.getAttribute(
                'data-tableau-special-pure-count'
            )
        ).toBe('1');
        expect(
            renderSpecialStack([], [ROYAL_CARDS[0]!])?.getAttribute(
                'data-tableau-special-royal-count'
            )
        ).toBe('1');
    });

    it('renders reserved cards as a stable diagonal mini-stack', () => {
        const reservedCards = [0, 1, 2].map((index) => ({
            ...SAMPLE_CARD,
            id: `reserved-mini-stack-${index}`,
        }));
        const html = renderToStaticMarkup(
            <LocaleProvider locale="en" setLocale={() => undefined}>
                <PlayerZone
                    player="p1"
                    inventory={EMPTY_COST}
                    cards={[]}
                    reserved={reservedCards}
                    privileges={0}
                    isActive={true}
                    phase="IDLE"
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
        const container = document.createElement('div');
        container.innerHTML = html;

        expect(container.querySelector('[data-reserved-mini-stack="p1"]')).not.toBeNull();
        expect(container.querySelectorAll('[data-reserved-slot]')).toHaveLength(3);
        expect(container.querySelector('[data-reserved-slot="p1-0"]')).not.toBeNull();
        expect(container.querySelector('[data-reserved-slot="p1-1"]')).not.toBeNull();
        expect(container.querySelector('[data-reserved-slot="p1-2"]')).not.toBeNull();
    });

    it('renders player-zone artwork as a separate mirrored fallback layer', () => {
        const html = renderToStaticMarkup(
            <LocaleProvider locale="en" setLocale={() => undefined}>
                <PlayerZone
                    player="p2"
                    inventory={EMPTY_COST}
                    cards={[]}
                    reserved={[]}
                    privileges={0}
                    isActive={true}
                    phase="IDLE"
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
                    surfaceStyle={{
                        backgroundImage: 'url("/legacy-player-zone.png")',
                        backgroundColor: '#020617',
                    }}
                    surfaceArtwork={{
                        primaryPath: '/legacy-player-zone.png',
                        fallbackPath: '/legacy-player-zone.png',
                        mirrorFallback: true,
                    }}
                />
            </LocaleProvider>
        );

        expect(html).toContain('data-player-zone-surface-artwork="p2"');
        expect(html).toContain('data-player-zone-surface-primary="/legacy-player-zone.png"');
        expect(html).toContain('data-player-zone-surface-using-fallback="true"');
        expect(html).toContain('data-player-zone-surface-mirrored="true"');
        expect(html).toContain('transform:scaleX(-1)');
        expect(html).not.toContain('background-image:url(&quot;/legacy-player-zone.png&quot;)');
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
                    phase="IDLE"
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
        expect(html).not.toContain('No Reserved Cards');
    });

    it('renders the centered turn core without buff slots in the top bar', () => {
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
        expect(html).not.toContain('data-topbar-buff-slot');
        expect(html).toContain('data-topbar-turn-side="p1"');
        expect(html).toContain('data-topbar-turn-side="p2"');
        expect(html).toContain('data-topbar-score-anchor="p1"');
        expect(html).toContain('data-topbar-score-anchor="p2"');
        expect(html).toContain('data-topbar-crown-artwork="p1"');
        expect(html).toContain('data-topbar-crown-artwork="p2"');
        expect(html).toContain('data-topbar-points-artwork="p1"');
        expect(html).toContain('data-topbar-points-artwork="p2"');
        expect(html).toContain('/assets/ui-icons/crown-gold-green-screen.png');
        expect(html).toContain('/assets/ui-icons/point-ribbon-silver-short.png');
        expect(html.indexOf('data-topbar-crown-group="p1"')).toBeLessThan(
            html.indexOf('data-topbar-points-group="p1"')
        );
        expect(html.indexOf('data-topbar-crown-group="p2"')).toBeLessThan(
            html.indexOf('data-topbar-points-group="p2"')
        );
    });

    it('wires semantic contrast variables into visible shell labels', () => {
        const topBarHtml = renderToStaticMarkup(
            <LocaleProvider locale="zh" setLocale={() => undefined}>
                <TopBar
                    p1Score={0}
                    p1Crowns={0}
                    p2Score={0}
                    p2Crowns={0}
                    playerTurnCounts={{ p1: 1, p2: 0 }}
                    activePlayer="p1"
                    theme="light"
                />
            </LocaleProvider>
        );
        const marketHtml = renderToStaticMarkup(
            <LocaleProvider locale="zh" setLocale={() => undefined}>
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
                    theme="light"
                />
            </LocaleProvider>
        );
        const royalHtml = renderToStaticMarkup(
            <LocaleProvider locale="zh" setLocale={() => undefined}>
                <RoyalCourt
                    royalDeck={[]}
                    phase="IDLE"
                    handleSelectRoyal={() => undefined}
                    theme="light"
                />
            </LocaleProvider>
        );
        const actionsHtml = renderToStaticMarkup(
            <LocaleProvider locale="zh" setLocale={() => undefined}>
                <GameActions
                    handleReplenish={() => undefined}
                    bag={[{ type: GEM_TYPES.BLUE, uid: 'bag-blue' }]}
                    phase="IDLE"
                    handleConfirmTake={() => undefined}
                    handleCancelReserve={() => undefined}
                    handleCancelPrivilege={() => undefined}
                    theme="light"
                />
            </LocaleProvider>
        );
        const replayHtml = renderToStaticMarkup(
            <LocaleProvider locale="zh" setLocale={() => undefined}>
                <ReplayControls
                    undo={() => undefined}
                    redo={() => undefined}
                    canUndo={true}
                    canRedo={false}
                    currentIndex={0}
                    historyLength={1}
                    theme="light"
                />
            </LocaleProvider>
        );

        expect(topBarHtml).toContain('var(--gd-topbar-goal-text)');
        expect(marketHtml).toContain('var(--gd-shell-label-primary)');
        expect(royalHtml).toContain('var(--gd-shell-gold-text)');
        expect(actionsHtml).toContain('var(--gd-shell-action-text)');
        expect(replayHtml).toContain('var(--gd-shell-action-text)');
    });

    it('hides pending reserved cards while keeping the target slot anchor', () => {
        const html = renderToStaticMarkup(
            <LocaleProvider locale="en" setLocale={() => undefined}>
                <PlayerZone
                    player="p1"
                    inventory={EMPTY_COST}
                    cards={[]}
                    reserved={[SAMPLE_CARD]}
                    privileges={0}
                    isActive={true}
                    phase="IDLE"
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
                    pendingReservedCardIds={[SAMPLE_CARD.id]}
                />
            </LocaleProvider>
        );

        expect(html).toContain('data-reserved-slot="p1-0"');
        expect(html).toContain('data-reserved-card-pending="true"');
        expect(html).toContain('visibility:hidden');
    });

    it('hides pending market refill cards while keeping the slot anchor', () => {
        const html = renderToStaticMarkup(
            <LocaleProvider locale="en" setLocale={() => undefined}>
                <Market
                    market={{ ...EMPTY_MARKET, 2: [SAMPLE_CARD] }}
                    decks={EMPTY_DECKS}
                    phase="IDLE"
                    turn="p1"
                    inventories={{ p1: EMPTY_COST, p2: EMPTY_COST }}
                    playerTableau={{ p1: [], p2: [] }}
                    playerBuffs={{
                        p1: BUFFS.NONE as unknown as Buff,
                        p2: BUFFS.NONE as unknown as Buff,
                    }}
                    pendingMarketRefillSlots={[{ level: 2, index: 0, nextCardId: SAMPLE_CARD.id }]}
                    theme="dark"
                />
            </LocaleProvider>
        );

        expect(html).toContain('data-market-slot="2-0"');
        expect(html).toContain('data-market-card-pending-refill="true"');
        expect(html).toContain('visibility:hidden');
    });

    it('renders a full initialized market without hidden refill cards', () => {
        const createMarketCard = (level: 1 | 2 | 3, index: number): CardType => ({
            ...SAMPLE_CARD,
            id: `initialized-market-${level}-${index}`,
            level,
        });
        const html = renderToStaticMarkup(
            <LocaleProvider locale="en" setLocale={() => undefined}>
                <Market
                    market={{
                        1: [0, 1, 2, 3, 4].map((index) => createMarketCard(1, index)),
                        2: [0, 1, 2, 3].map((index) => createMarketCard(2, index)),
                        3: [0, 1, 2].map((index) => createMarketCard(3, index)),
                    }}
                    decks={EMPTY_DECKS}
                    phase="IDLE"
                    turn="p1"
                    inventories={{ p1: EMPTY_COST, p2: EMPTY_COST }}
                    playerTableau={{ p1: [], p2: [] }}
                    playerBuffs={{
                        p1: BUFFS.NONE as unknown as Buff,
                        p2: BUFFS.NONE as unknown as Buff,
                    }}
                    theme="dark"
                />
            </LocaleProvider>
        );

        expect(html.match(/data-market-slot="/g)).toHaveLength(12);
        expect(html.match(/data-card-affordable="/g)).toHaveLength(12);
        expect(html).not.toContain('data-market-card-pending-refill="true"');
        expect(html).not.toContain('visibility:hidden');
    });

    it('adds hover scale feedback to market cards without scaling deck backs', () => {
        const html = renderToStaticMarkup(
            <LocaleProvider locale="en" setLocale={() => undefined}>
                <Market
                    market={{ ...EMPTY_MARKET, 2: [SAMPLE_CARD] }}
                    decks={{ ...EMPTY_DECKS, 2: [SAMPLE_CARD] }}
                    phase="IDLE"
                    turn="p1"
                    inventories={{ p1: EMPTY_COST, p2: EMPTY_COST }}
                    playerTableau={{ p1: [], p2: [] }}
                    playerBuffs={{
                        p1: BUFFS.NONE as unknown as Buff,
                        p2: BUFFS.NONE as unknown as Buff,
                    }}
                    theme="dark"
                />
            </LocaleProvider>
        );
        const host = document.createElement('div');
        host.innerHTML = html;
        const marketCardMotion = host.querySelector<HTMLElement>(
            '[data-market-card-hover-motion="true"]'
        );
        const deckBack = host.querySelector<HTMLElement>('[data-market-deck="2"]');

        expect(marketCardMotion).not.toBeNull();
        expect(marketCardMotion?.className).toContain('hover:scale-[1.025]');
        expect(marketCardMotion?.className).toContain('focus-within:scale-[1.025]');
        expect(deckBack?.className).not.toContain('hover:scale-[1.025]');
        expect(deckBack?.className).not.toContain('focus-within:scale-[1.025]');
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

describe('card preview interactions', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;

    const renderInteractive = async (node: React.ReactNode) => {
        container = document.createElement('div');
        document.body.appendChild(container);

        await act(async () => {
            root = createRoot(container!);
            root.render(
                <LocaleProvider locale="en" setLocale={() => undefined}>
                    {node}
                </LocaleProvider>
            );
            await Promise.resolve();
        });
    };

    const clickElement = async (element: Element | null | undefined) => {
        await act(async () => {
            element?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            await Promise.resolve();
        });
    };

    const collectionCards = (count: number): CardType[] =>
        Array.from({ length: count }, (_, index) => ({
            ...SAMPLE_CARD,
            id: `collection-green-${index}`,
            bonusColor: 'green',
            points: index % 3,
        }));

    const shellLayout: ResponsiveLayout = {
        layoutMode: 'desktop-4k',
        viewportWidth: 1920,
        viewportHeight: 1080,
        aspectRatio: 16 / 9,
        stageCanvasWidthPx: 3840,
        stageCanvasHeightPx: 2160,
        stageScale: 0.5,
        stageInsetXPx: 0,
        stageInsetYPx: 0,
        boardScale: 1,
        deckScale: 1,
        zoneScale: 1,
        zoneHeightPx: 520,
        mainGapPx: 24,
    };

    const createShellProps = (
        stateOverrides: Partial<AppRouteProps['game']['state']> = {},
        getterOverrides: Partial<AppRouteProps['game']['getters']> = {}
    ) => {
        const state = {
            ...(JSON.parse(
                JSON.stringify(INITIAL_STATE_SKELETON)
            ) as AppRouteProps['game']['state']),
            selectedGems: [],
            reserveGoldSelection: null,
            errorMsg: null,
            ...stateOverrides,
        };
        const handlers = {
            importHistory: vi.fn(),
            startGame: vi.fn(),
            handleSelectBuff: vi.fn(),
            handleRerollBuffs: vi.fn(),
            handleDebugAddCrowns: vi.fn(),
            handleDebugAddPoints: vi.fn(),
            handleDebugAddPrivilege: vi.fn(),
            handleForceRoyal: vi.fn(),
            handleSelectBonusColor: vi.fn(),
            handleCloseModal: vi.fn(),
            handleGemClick: vi.fn(),
            handleGemDragSelection: vi.fn(),
            handleConfirmTake: vi.fn(),
            handleReplenish: vi.fn(),
            handleSelectRoyal: vi.fn(),
            handleCancelReserve: vi.fn(),
            handleCancelPrivilege: vi.fn(),
            handlePeekDeck: vi.fn(),
            handleSelfGemClick: vi.fn(),
            handleOpponentGemClick: vi.fn(),
            handleDiscardReserved: vi.fn(),
            activatePrivilegeMode: vi.fn(),
            checkAndInitiateBuyReserved: vi.fn(() => false),
            clearPreselectedReserveGold: vi.fn(),
            handleReserveCard: vi.fn(() => true),
            handleReserveDeck: vi.fn(() => true),
            initiateBuy: vi.fn(() => true),
        };
        const game = {
            state,
            handlers,
            getters: {
                getPlayerScore: vi.fn(() => 0),
                isSelected: vi.fn(() => false),
                getCrownCount: vi.fn(() => 0),
                canAfford: vi.fn(() => true),
                isMyTurn: true,
                ...getterOverrides,
            },
            historyControls: {
                undo: vi.fn(),
                redo: vi.fn(),
                canUndo: false,
                canRedo: false,
                jumpToStep: vi.fn(),
                importHistory: vi.fn(),
                clearAndInit: vi.fn(),
                currentIndex: 0,
                historyLength: 0,
                history: [],
                historySource: 'live',
            },
            online: {
                peerId: '',
                remotePeerId: '',
                connectionStatus: 'disconnected',
                isHost: true,
                connectToPeer: vi.fn(),
                sendBootstrap: vi.fn(),
                sendGuestIntent: vi.fn(),
                sendHostDecision: vi.fn(),
                sendState: vi.fn(),
                requestRecovery: vi.fn(),
                latency: 0,
                isUnstable: false,
                approvalLog: [],
                statusNotice: null,
                authoritativeReplayRecorder: null,
            },
            replay: {
                currentReplay: null,
            },
        } satisfies AppRouteProps['game'];

        return {
            game,
            handlers,
            props: {
                appVersion: 'test',
                game,
                lan: {} as AppRouteProps['lan'],
                layout: shellLayout,
                theme: 'dark',
                ui: {
                    showDebug: false,
                    isReviewing: false,
                    showRulebook: false,
                    matchmakingRoute: 'none',
                    isPeekingBoard: false,
                    persistentWinner: null,
                    showRestartConfirm: false,
                },
                setters: {
                    setShowDebug: vi.fn(),
                    setIsReviewing: vi.fn(),
                    setShowRulebook: vi.fn(),
                    setMatchmakingRoute: vi.fn(),
                    setIsPeekingBoard: vi.fn(),
                    setShowRestartConfirm: vi.fn(),
                },
                callbacks: {
                    handleRestart: vi.fn(),
                    handleDownloadReplay: vi.fn(),
                    handleUploadReplay: vi.fn(),
                },
            } satisfies AppRouteProps,
        };
    };

    const renderShell = async (props: AppRouteProps) => {
        await renderInteractive(<GameShell {...props} />);
    };

    afterEach(() => {
        act(() => {
            root?.unmount();
        });
        container?.remove();
        document.body.replaceChildren();
        root = null;
        container = null;
    });

    it('previews market cards instead of buying from the rail click', async () => {
        const onPreviewCard = vi.fn();
        const market = { ...EMPTY_MARKET, 2: [SAMPLE_CARD] };

        await renderInteractive(
            <Market
                market={market}
                decks={EMPTY_DECKS}
                phase="IDLE"
                turn="p1"
                inventories={{ p1: EMPTY_COST, p2: EMPTY_COST }}
                playerTableau={{ p1: [], p2: [] }}
                playerBuffs={{
                    p1: BUFFS.NONE as unknown as Buff,
                    p2: BUFFS.NONE as unknown as Buff,
                }}
                onPreviewCard={onPreviewCard}
                theme="dark"
            />
        );

        await clickElement(
            document.body.querySelector('[data-market-slot="2-0"] [data-card-preview-click="true"]')
        );

        expect(onPreviewCard).toHaveBeenCalledWith(SAMPLE_CARD, { level: 2, idx: 0 });

        act(() => {
            root?.unmount();
        });
        container?.remove();
        container = null;
        root = null;

        await renderInteractive(
            <Market
                market={market}
                decks={EMPTY_DECKS}
                phase="IDLE"
                turn="p1"
                inventories={{
                    p1: { ...EMPTY_COST, black: 2, green: 1 },
                    p2: EMPTY_COST,
                }}
                playerTableau={{ p1: [], p2: [] }}
                playerBuffs={{
                    p1: BUFFS.NONE as unknown as Buff,
                    p2: BUFFS.NONE as unknown as Buff,
                }}
                onPreviewCard={onPreviewCard}
                theme="dark"
            />
        );

        await clickElement(
            document.body.querySelector('[data-market-slot="2-0"] [data-card-affordable="true"]')
        );

        expect(onPreviewCard).toHaveBeenCalledWith(SAMPLE_CARD, { level: 2, idx: 0 });
        expect(onPreviewCard).toHaveBeenCalledTimes(2);
    });

    it('previews market deck reserve before executing the reserve action', async () => {
        const onPreviewDeckReserve = vi.fn();

        await renderInteractive(
            <Market
                market={EMPTY_MARKET}
                decks={{ ...EMPTY_DECKS, 2: [SAMPLE_CARD] }}
                phase="IDLE"
                turn="p1"
                inventories={{ p1: EMPTY_COST, p2: EMPTY_COST }}
                playerTableau={{ p1: [], p2: [] }}
                playerBuffs={{
                    p1: BUFFS.NONE as unknown as Buff,
                    p2: BUFFS.NONE as unknown as Buff,
                }}
                onPreviewDeckReserve={onPreviewDeckReserve}
                theme="dark"
            />
        );

        await clickElement(document.body.querySelector('[data-market-deck="2"]'));

        expect(onPreviewDeckReserve).toHaveBeenCalledWith(2);
    });

    it('does not render reveal or peek buff controls from the market side area', async () => {
        await renderInteractive(
            <Market
                market={EMPTY_MARKET}
                decks={{
                    ...EMPTY_DECKS,
                    1: [{ ...SAMPLE_CARD, id: 'hidden-l1-reveal', level: 1 as const }],
                    3: [
                        { ...SAMPLE_CARD, id: 'hidden-l3-bottom', level: 3 as const },
                        { ...SAMPLE_CARD, id: 'hidden-l3-extra-2', level: 3 as const },
                        { ...SAMPLE_CARD, id: 'hidden-l3-extra-1', level: 3 as const },
                        { ...SAMPLE_CARD, id: 'hidden-l3-top', level: 3 as const },
                    ],
                }}
                phase="IDLE"
                turn="p1"
                inventories={{ p1: EMPTY_COST, p2: EMPTY_COST }}
                playerTableau={{ p1: [], p2: [] }}
                playerBuffs={{
                    p1: BUFFS.INTELLIGENCE as unknown as Buff,
                    p2: BUFFS.ALL_SEEING_EYE as unknown as Buff,
                }}
                theme="dark"
            />
        );

        expect(document.body.textContent).not.toContain('Peek L');
        expect(document.body.textContent).not.toContain('Insight');
        expect(document.body.querySelector('[data-player-buff-preview-action]')).toBeNull();
    });

    it('routes market preview buy and reserve actions through the shell overlay', async () => {
        const { props, handlers } = createShellProps({
            market: { ...EMPTY_MARKET, 2: [SAMPLE_CARD] },
            inventories: {
                p1: { ...EMPTY_COST, black: 2, green: 1 },
                p2: EMPTY_COST,
            },
        });

        await renderShell(props);

        await clickElement(
            document.body.querySelector('[data-market-slot="2-0"] [data-card-preview-click="true"]')
        );

        expect(handlers.clearPreselectedReserveGold).toHaveBeenCalled();
        expect(document.body.querySelector('[data-card-preview-action="buy"]')).not.toBeNull();
        expect(document.body.querySelector('[data-card-preview-action="reserve"]')).not.toBeNull();

        await clickElement(document.body.querySelector('[data-card-preview-action="buy"]'));

        expect(handlers.initiateBuy).toHaveBeenCalledWith(SAMPLE_CARD, 'market', {
            level: 2,
            idx: 0,
        });

        await clickElement(
            document.body.querySelector('[data-market-slot="2-0"] [data-card-preview-click="true"]')
        );
        await clickElement(document.body.querySelector('[data-card-preview-action="reserve"]'));

        expect(handlers.handleReserveCard).toHaveBeenCalledWith(SAMPLE_CARD, {
            level: 2,
            idx: 0,
        });
    });

    it('keeps market preview actions visible but disabled when unavailable', async () => {
        const { props } = createShellProps(
            {
                market: { ...EMPTY_MARKET, 2: [SAMPLE_CARD] },
                playerReserved: {
                    p1: [
                        { ...SAMPLE_CARD, id: 'reserved-full-1' },
                        { ...SAMPLE_CARD, id: 'reserved-full-2' },
                        { ...SAMPLE_CARD, id: 'reserved-full-3' },
                    ],
                    p2: [],
                },
            },
            {
                canAfford: vi.fn(() => false),
            }
        );

        await renderShell(props);

        await clickElement(
            document.body.querySelector('[data-market-slot="2-0"] [data-card-preview-click="true"]')
        );

        const buyAction = document.body.querySelector(
            '[data-card-preview-action="buy"]'
        ) as HTMLButtonElement | null;
        const reserveAction = document.body.querySelector(
            '[data-card-preview-action="reserve"]'
        ) as HTMLButtonElement | null;

        expect(buyAction).not.toBeNull();
        expect(reserveAction).not.toBeNull();
        expect(buyAction?.disabled).toBe(true);
        expect(reserveAction?.disabled).toBe(true);
    });

    it('routes deck reserve preview through a single centered shell action', async () => {
        const { props, handlers } = createShellProps({
            decks: { ...EMPTY_DECKS, 1: [SAMPLE_CARD] },
        });

        await renderShell(props);

        await clickElement(document.body.querySelector('[data-market-deck="1"]'));

        expect(document.body.querySelector('[data-card-preview-deck-reserve="1"]')).not.toBeNull();
        expect(document.body.querySelectorAll('[data-card-preview-action]')).toHaveLength(1);
        expect(
            document.body
                .querySelector('[data-card-preview-actions]')
                ?.getAttribute('data-card-preview-actions-align')
        ).toBe('center');

        await clickElement(document.body.querySelector('[data-card-preview-action="reserve"]'));

        expect(handlers.handleReserveDeck).toHaveBeenCalledWith(1);
    });

    it('opens actionable revealed L1 cards from the player avatar trigger', async () => {
        const revealCard = { ...SAMPLE_CARD, id: 'avatar-l1-reveal', level: 1 as const };
        const { props, handlers } = createShellProps({
            decks: { ...EMPTY_DECKS, 1: [revealCard] },
            playerBuffs: {
                p1: BUFFS.INSIGHT as unknown as Buff,
                p2: BUFFS.NONE as unknown as Buff,
            },
            inventories: {
                p1: { ...EMPTY_COST, black: 2, green: 1 },
                p2: EMPTY_COST,
            },
        });

        await renderShell(props);

        const trigger = document.body.querySelector(
            '[data-player-buff-preview-action="reveal"][data-player-buff-preview-player="p1"]'
        );
        expect(trigger).not.toBeNull();

        await clickElement(trigger);

        expect(document.body.querySelectorAll('[data-card-preview-card]')).toHaveLength(1);
        expect(
            document.body.querySelectorAll(
                '[data-card-preview-action-scope="card"][data-card-preview-action="buy"]'
            )
        ).toHaveLength(1);
        expect(
            document.body.querySelectorAll(
                '[data-card-preview-action-scope="card"][data-card-preview-action="reserve"]'
            )
        ).toHaveLength(1);

        await clickElement(
            document.body.querySelector(
                `[data-card-preview-action-card="${revealCard.id}"][data-card-preview-action="buy"]`
            )
        );

        expect(handlers.initiateBuy).toHaveBeenCalledWith(revealCard, 'market', {
            level: 1,
            idx: 0,
            isExtra: true,
            extraIdx: 0,
        });

        await clickElement(trigger);
        await clickElement(
            document.body.querySelector(
                `[data-card-preview-action-card="${revealCard.id}"][data-card-preview-action="reserve"]`
            )
        );

        expect(handlers.handleReserveCard).toHaveBeenCalledWith(revealCard, {
            level: 1,
            idx: 0,
            isExtra: true,
            extraIdx: 0,
        });
    });

    it('opens actionable All-Seeing Eye cards and keeps disabled reveal actions visible', async () => {
        const hiddenCards = [
            { ...SAMPLE_CARD, id: 'avatar-l3-bottom', level: 3 as const },
            { ...SAMPLE_CARD, id: 'avatar-l3-extra-2', level: 3 as const },
            { ...SAMPLE_CARD, id: 'avatar-l3-extra-1', level: 3 as const },
            { ...SAMPLE_CARD, id: 'avatar-l3-top', level: 3 as const },
        ];
        const { props } = createShellProps(
            {
                decks: { ...EMPTY_DECKS, 3: hiddenCards },
                playerBuffs: {
                    p1: BUFFS.ALL_SEEING_EYE as unknown as Buff,
                    p2: BUFFS.NONE as unknown as Buff,
                },
                playerReserved: {
                    p1: [
                        { ...SAMPLE_CARD, id: 'full-reserve-1' },
                        { ...SAMPLE_CARD, id: 'full-reserve-2' },
                        { ...SAMPLE_CARD, id: 'full-reserve-3' },
                    ],
                    p2: [],
                },
            },
            { canAfford: vi.fn(() => false) }
        );

        await renderShell(props);

        await clickElement(
            document.body.querySelector(
                '[data-player-buff-preview-action="reveal"][data-player-buff-preview-player="p1"]'
            )
        );

        const buyActions = Array.from(
            document.body.querySelectorAll<HTMLButtonElement>(
                '[data-card-preview-action-scope="card"][data-card-preview-action="buy"]'
            )
        );
        const reserveActions = Array.from(
            document.body.querySelectorAll<HTMLButtonElement>(
                '[data-card-preview-action-scope="card"][data-card-preview-action="reserve"]'
            )
        );

        expect(document.body.querySelectorAll('[data-card-preview-card]')).toHaveLength(2);
        expect(buyActions).toHaveLength(2);
        expect(reserveActions).toHaveLength(2);
        expect(buyActions.every((action) => action.disabled)).toBe(true);
        expect(reserveActions.every((action) => action.disabled)).toBe(true);
    });

    it('routes Intelligence from the avatar trigger and renders peek cards read-only', async () => {
        const peekCards = ([3, 2, 1] as const).flatMap((level) =>
            [0, 1, 2].map((index) => ({
                ...SAMPLE_CARD,
                id: `peek-l${level}-${index}`,
                level,
            }))
        );
        const { props, handlers } = createShellProps({
            playerBuffs: {
                p1: BUFFS.INTELLIGENCE as unknown as Buff,
                p2: BUFFS.NONE as unknown as Buff,
            },
        });

        await renderShell(props);

        await clickElement(
            document.body.querySelector(
                '[data-player-buff-preview-action="peek"][data-player-buff-preview-player="p1"]'
            )
        );

        expect(handlers.handlePeekDeck).toHaveBeenCalledWith('all');

        act(() => {
            root?.unmount();
        });
        container?.remove();
        root = null;
        container = null;

        const { props: modalProps } = createShellProps({
            activeModal: {
                type: 'PEEK',
                data: {
                    cards: peekCards,
                    initiator: 'p1',
                },
            },
        });

        await renderShell(modalProps);

        expect(document.body.querySelectorAll('[data-card-preview-card]')).toHaveLength(9);
        expect(document.body.querySelector('[data-card-preview-action]')).toBeNull();
        expect(document.body.textContent).toContain('Deck Intelligence');
    });

    it('previews royal cards outside SELECT_ROYAL and selects them during SELECT_ROYAL', async () => {
        const royalCard = ROYAL_CARDS[0]!;
        const onPreviewRoyal = vi.fn();
        const handleSelectRoyal = vi.fn();

        await renderInteractive(
            <RoyalCourt
                royalDeck={[royalCard]}
                phase="IDLE"
                handleSelectRoyal={handleSelectRoyal}
                onPreviewRoyal={onPreviewRoyal}
                theme="dark"
            />
        );

        await clickElement(container?.querySelector(`[data-royal-card="${royalCard.id}"]`));

        expect(onPreviewRoyal).toHaveBeenCalledWith(royalCard);
        expect(handleSelectRoyal).not.toHaveBeenCalled();

        await act(async () => {
            root?.render(
                <LocaleProvider locale="en" setLocale={() => undefined}>
                    <RoyalCourt
                        royalDeck={[royalCard]}
                        phase="SELECT_ROYAL"
                        handleSelectRoyal={handleSelectRoyal}
                        onPreviewRoyal={onPreviewRoyal}
                        theme="dark"
                    />
                </LocaleProvider>
            );
            await Promise.resolve();
        });

        await clickElement(container?.querySelector(`[data-royal-card="${royalCard.id}"]`));

        expect(handleSelectRoyal).toHaveBeenCalledWith(royalCard);
        expect(onPreviewRoyal).toHaveBeenCalledTimes(1);
    });

    it('keeps the royal court empty state visual-only without fallback copy', async () => {
        await renderInteractive(
            <RoyalCourt
                royalDeck={[]}
                phase="IDLE"
                handleSelectRoyal={() => undefined}
                theme="dark"
            />
        );

        expect(container?.querySelectorAll('[data-royal-court-empty-slot]')).toHaveLength(4);
        expect(container?.textContent).toContain('Royal');
        expect(container?.textContent).not.toContain('No Royal Cards Available');
    });

    it('sends all cards from a player tableau color stack to the shared preview lane', async () => {
        const cards = collectionCards(5);
        const onPreviewStack = vi.fn();

        await renderInteractive(
            <PlayerZone
                player="p1"
                inventory={EMPTY_COST}
                cards={cards}
                reserved={[]}
                privileges={0}
                isActive={true}
                phase="IDLE"
                lastFeedback={null}
                onBuyReserved={() => false}
                onDiscardReserved={() => undefined}
                onUsePrivilege={() => undefined}
                isPrivilegeMode={false}
                onGemClick={() => undefined}
                isStealMode={false}
                isDiscardMode={false}
                buff={BUFFS.NONE as unknown as Buff}
                onPreviewStack={onPreviewStack}
                theme="dark"
                score={0}
                crowns={0}
            />
        );

        await clickElement(container?.querySelector('[data-tableau-stack="p1-green"]'));

        expect(onPreviewStack).toHaveBeenCalledWith({
            player: 'p1',
            color: 'green',
            cards,
        });
    });

    it('sends pure-points and royal cards from the special stack to the shared preview lane', async () => {
        const onPreviewStack = vi.fn();

        await renderInteractive(
            <PlayerZone
                player="p1"
                inventory={EMPTY_COST}
                cards={[SAMPLE_PURE_POINTS_CARD]}
                reserved={[]}
                royals={[ROYAL_CARDS[0]!]}
                privileges={0}
                isActive={true}
                phase="IDLE"
                lastFeedback={null}
                onBuyReserved={() => false}
                onDiscardReserved={() => undefined}
                onUsePrivilege={() => undefined}
                isPrivilegeMode={false}
                onGemClick={() => undefined}
                isStealMode={false}
                isDiscardMode={false}
                buff={BUFFS.NONE as unknown as Buff}
                onPreviewStack={onPreviewStack}
                theme="dark"
                score={0}
                crowns={0}
            />
        );

        await clickElement(
            container?.querySelector('[data-tableau-special-stack="p1-pure-royal"]')
        );

        expect(onPreviewStack).toHaveBeenCalledWith({
            player: 'p1',
            color: 'pure-royal',
            title: 'Pure / Royal',
            cards: [
                SAMPLE_PURE_POINTS_CARD,
                expect.objectContaining({
                    id: ROYAL_CARDS[0]!.id,
                    points: ROYAL_CARDS[0]!.points,
                }),
            ],
        });
    });

    it('caps collection previews at four columns, three rows, and twelve visible cards', async () => {
        Object.defineProperty(window, 'innerWidth', {
            configurable: true,
            writable: true,
            value: 1280,
        });
        Object.defineProperty(window, 'innerHeight', {
            configurable: true,
            writable: true,
            value: 820,
        });

        await renderInteractive(
            <CardPreviewOverlay
                isOpen={true}
                mode="collection"
                cards={collectionCards(13)}
                player="p1"
                color="green"
                theme="dark"
                onClose={() => undefined}
            />
        );

        const overlay = document.body.querySelector('[data-card-preview-overlay]');

        expect(overlay?.getAttribute('data-card-preview-mode')).toBe('collection');
        expect(overlay?.getAttribute('data-card-preview-count')).toBe('12');
        expect(overlay?.getAttribute('data-card-preview-grid-columns')).toBe('4');
        expect(overlay?.getAttribute('data-card-preview-grid-rows')).toBe('3');
        expect(document.body.querySelectorAll('[data-card-preview-card]')).toHaveLength(12);
        expect(document.body.querySelector('[data-card-preview-actions]')).toBeNull();
        expect(document.body.textContent).toContain('Showing 12 / 13');
    });

    it('supports custom preview content and centered single preview actions', async () => {
        const onReserve = vi.fn(() => true);
        const onClose = vi.fn();

        await renderInteractive(
            <CardPreviewOverlay
                isOpen={true}
                mode="single"
                cards={[]}
                previewContent={<div data-test-deck-back-preview="true">Deck Back</div>}
                actions={createCardPreviewActions({
                    id: 'reserve',
                    label: 'Reserve',
                    onAction: onReserve,
                })}
                theme="dark"
                onClose={onClose}
            />
        );

        const overlay = document.body.querySelector('[data-card-preview-overlay]');
        const action = document.body.querySelector('[data-card-preview-action="reserve"]');

        expect(overlay?.getAttribute('data-card-preview-count')).toBe('0');
        expect(document.body.querySelector('[data-card-preview-content="custom"]')).not.toBeNull();
        expect(document.body.querySelector('[data-test-deck-back-preview="true"]')).not.toBeNull();
        expect(
            document.body
                .querySelector('[data-card-preview-actions]')
                ?.getAttribute('data-card-preview-actions-align')
        ).toBe('center');

        await clickElement(action);

        expect(onReserve).toHaveBeenCalled();
        expect(onClose).toHaveBeenCalled();
    });

    it('renders paired preview actions and keeps the overlay open when an action returns false', async () => {
        const onBuy = vi.fn(() => false);
        const onReserve = vi.fn();
        const onClose = vi.fn();

        await renderInteractive(
            <CardPreviewOverlay
                isOpen={true}
                mode="single"
                cards={[SAMPLE_CARD]}
                actions={createCardPreviewActions(
                    {
                        id: 'buy',
                        label: 'Buy',
                        onAction: onBuy,
                    },
                    {
                        id: 'reserve',
                        label: 'Reserve',
                        disabled: true,
                        onAction: onReserve,
                    }
                )}
                theme="dark"
                onClose={onClose}
            />
        );

        const actions = Array.from(document.body.querySelectorAll('[data-card-preview-action]'));

        expect(actions).toHaveLength(2);
        expect(actions[0]?.getAttribute('data-card-preview-action')).toBe('buy');
        expect(actions[1]?.getAttribute('data-card-preview-action')).toBe('reserve');
        expect(
            document.body
                .querySelector('[data-card-preview-actions]')
                ?.getAttribute('data-card-preview-actions-layout')
        ).toBe('pair');

        await clickElement(actions[0]);
        await clickElement(actions[1]);

        expect(onBuy).toHaveBeenCalled();
        expect(onReserve).not.toHaveBeenCalled();
        expect(onClose).not.toHaveBeenCalled();
    });

    it('labels the pure-royal collection preview as extra points', async () => {
        await renderInteractive(
            <CardPreviewOverlay
                isOpen={true}
                mode="collection"
                cards={[SAMPLE_PURE_POINTS_CARD]}
                player="p1"
                color="pure-royal"
                theme="dark"
                onClose={() => undefined}
            />
        );

        expect(document.body.textContent).toContain('Player 1 - Extra Points');
        expect(document.body.textContent).not.toContain('COLOR: PURE-ROYAL');
    });

    it('opens the full reserved-card preview with one disabled buy action per card', async () => {
        const reservedCards = [0, 1, 2].map((index) => ({
            ...SAMPLE_CARD,
            id: `reserved-preview-disabled-${index}`,
        }));

        await renderInteractive(
            <PlayerZone
                player="p1"
                inventory={EMPTY_COST}
                cards={[]}
                reserved={reservedCards}
                privileges={0}
                isActive={true}
                phase="IDLE"
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
        );

        await clickElement(
            container?.querySelector('[data-reserved-slot="p1-0"] [data-card-preview-click="true"]')
        );

        expect(document.body.querySelector('[data-card-preview-overlay]')).not.toBeNull();
        expect(
            document.body
                .querySelector('[data-card-preview-overlay]')
                ?.getAttribute('data-card-preview-mode')
        ).toBe('collection');
        expect(document.body.querySelectorAll('[data-card-preview-card]')).toHaveLength(3);
        const actions = Array.from(
            document.body.querySelectorAll(
                '[data-card-preview-action-scope="card"][data-card-preview-action="buy"]'
            )
        ) as HTMLButtonElement[];
        expect(actions).toHaveLength(3);
        expect(actions.every((action) => action.disabled)).toBe(true);
        expect(document.body.querySelector('[data-card-preview-card-actions-band]')).not.toBeNull();
        expect(document.body.querySelector('[data-card-preview-actions]')).toBeNull();
    });

    it('buys reserved cards from each large preview card action instead of the rail card click', async () => {
        const reservedCards = [0, 1, 2].map((index) => ({
            ...SAMPLE_CARD,
            id: `reserved-preview-buy-${index}`,
        }));
        const onBuyReserved = vi.fn((card: CardType, execute?: boolean) =>
            card.id === reservedCards[1].id && execute === true
                ? true
                : card.id === reservedCards[1].id
        );

        await renderInteractive(
            <PlayerZone
                player="p1"
                inventory={EMPTY_COST}
                cards={[]}
                reserved={reservedCards}
                privileges={0}
                isActive={true}
                phase="IDLE"
                lastFeedback={null}
                onBuyReserved={onBuyReserved}
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
        );

        await clickElement(
            container?.querySelector('[data-reserved-slot="p1-1"] [data-card-preview-click="true"]')
        );

        expect(document.body.querySelector('[data-card-preview-overlay]')).not.toBeNull();
        expect(document.body.querySelectorAll('[data-card-preview-card]')).toHaveLength(3);
        expect(onBuyReserved).not.toHaveBeenCalledWith(reservedCards[1], true);

        await clickElement(
            document.body.querySelector(
                `[data-card-preview-action-card="${reservedCards[1].id}"][data-card-preview-action="buy"]`
            )
        );

        expect(onBuyReserved).toHaveBeenCalledWith(reservedCards[1], true);
        expect(document.body.querySelector('[data-card-preview-overlay]')).toBeNull();
    });
});

describe('game board drag interactions', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;

    const renderBoard = ({
        selectedGems,
        handleGemDragSelection,
        handleGemClick = () => undefined,
        phase = 'IDLE',
    }: {
        selectedGems: Array<{ r: number; c: number }>;
        handleGemDragSelection: (coords: Array<{ r: number; c: number }>, intent?: string) => void;
        handleGemClick?: (r: number, c: number) => void;
        phase?: string;
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
                    handleGemClick={handleGemClick}
                    handleGemDragSelection={handleGemDragSelection}
                    selectedGems={selectedGems}
                    phase={phase}
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

    it('keeps reserve and privilege target gems clickable', () => {
        const handleGemClick = vi.fn();
        const handleGemDragSelection = vi.fn();
        renderBoard({
            selectedGems: [],
            handleGemDragSelection,
            handleGemClick,
            phase: 'RESERVE_WAITING_GEM',
        });

        act(() => {
            getCellButton('0-0')?.click();
        });

        expect(handleGemClick).toHaveBeenCalledWith(0, 0);

        act(() => {
            root?.unmount();
        });
        container?.remove();
        root = null;
        container = null;

        renderBoard({
            selectedGems: [],
            handleGemDragSelection,
            handleGemClick,
            phase: 'PRIVILEGE_ACTION',
        });

        act(() => {
            getCellButton('0-1')?.click();
        });

        expect(handleGemClick).toHaveBeenCalledWith(0, 1);
    });
});
