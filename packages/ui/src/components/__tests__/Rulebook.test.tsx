import { describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { LocaleProvider } from '../../i18n/LocaleProvider';
import { Rulebook } from '../Rulebook';
import { RULEBOOK_CONTENT, getRulebookSearchText } from '../RulebookContent';
import { RulebookAreaGuidePage } from '../rulebook/RulebookAreaGuidePage';

describe('Rulebook', () => {
    it('follows the global locale instead of rendering a local language toggle', () => {
        const html = renderToStaticMarkup(
            <LocaleProvider locale="zh" setLocale={vi.fn()}>
                <Rulebook onClose={vi.fn()} theme="dark" />
            </LocaleProvider>
        );

        expect(html).toContain('游戏说明书');
        expect(html).toContain('快速上手');
        expect(html).not.toContain('Close Rules');
    });

    it('renders canonical English terms in the rulebook introduction', () => {
        const html = renderToStaticMarkup(
            <LocaleProvider locale="en" setLocale={vi.fn()}>
                <Rulebook onClose={vi.fn()} theme="dark" />
            </LocaleProvider>
        );

        expect(html).toContain('Royal Area');
        expect(html).toContain('Single-Color Points');
        expect(html).not.toContain('Royal Court');
    });

    it('renders the preview-style shell contract', () => {
        const html = renderToStaticMarkup(
            <LocaleProvider locale="en" setLocale={vi.fn()}>
                <Rulebook onClose={vi.fn()} theme="dark" />
            </LocaleProvider>
        );

        expect(html).toContain('data-rulebook-overlay="true"');
        expect(html).toContain('data-rulebook-panel="preview-style"');
        expect(html).toContain('data-rulebook-nav="true"');
        expect(html).toContain('role="dialog"');
        expect(html).toContain('aria-modal="true"');
        expect(html).toContain('aria-label="Close Rules"');
        expect(html).toContain('max-w-[1880px]');
        expect(html).toContain('data-rulebook-wide-body-layout="columns"');
        expect(html).toContain('data-rulebook-type-scale="140"');
        expect(html).toContain('data-rulebook-page-count="9"');
        expect(html).toContain('text-[50px]');
    });

    it('removes the expired roguelike announcement wording', () => {
        const html = renderToStaticMarkup(
            <LocaleProvider locale="en" setLocale={vi.fn()}>
                <Rulebook onClose={vi.fn()} theme="dark" />
            </LocaleProvider>
        );

        expect(html).not.toContain('Roguelike Mode (New!)');
    });

    it('adds player zone and center area chapters to the rulebook', () => {
        const zhTitles = RULEBOOK_CONTENT.map((page) => page.title.zh);
        const enTitles = RULEBOOK_CONTENT.map((page) => page.title.en);
        const searchText = getRulebookSearchText();

        expect(zhTitles).toContain('玩家区');
        expect(zhTitles).toContain('主战区');
        expect(zhTitles).toContain('战况栏');
        expect(zhTitles).not.toContain('中间区');
        expect(zhTitles).not.toContain('皇室与胜利');
        expect(enTitles.indexOf('Battle Status Bar')).toBe(enTitles.indexOf('Main Field') + 1);
        expect(enTitles.indexOf('Turn Flow')).toBe(enTitles.indexOf('Battle Status Bar') + 1);
        expect(searchText).toContain('点击保留区可以查看你保留的牌');
        expect(searchText).toContain('主战区包含市场、宝石盘面和皇室区');
        expect(searchText).toContain(
            '皇室卡显示在盘面右侧，在你达到3/6个皇冠时你必须选择一个获取。'
        );
        expect(searchText).toContain('皇室卡是免费的纯分数卡，提供分数和特殊能力。');
        expect(searchText).toContain('后续阶段会高亮必须选择的目标');
        expect(searchText).toContain('战况栏显示双方当前胜利进度');
        expect(searchText).not.toContain('皇室奖励');
        expect(searchText).not.toContain('Royal reward');
        expect(searchText).not.toContain('Royal rewards');
        expect(searchText).not.toContain('免费奖励卡');
    });

    it('renders the player and center area figures with runtime assets', () => {
        const playerFigure = renderToStaticMarkup(
            <RulebookAreaGuidePage kind="player_zone" lang="zh" />
        );
        const centerFigure = renderToStaticMarkup(
            <RulebookAreaGuidePage kind="center_area" lang="zh" />
        );
        const topbarFigure = renderToStaticMarkup(
            <RulebookAreaGuidePage kind="topbar" lang="zh" />
        );

        expect(playerFigure).toContain('data-rulebook-area-guide="player-zone"');
        expect(playerFigure).toContain(
            '/assets/surfaces/anime-themes/royal-luxury/dark/player-zone.png'
        );
        expect(playerFigure).toContain('data-rulebook-player-zone-layout="reserve-full-height"');
        expect(playerFigure).toContain('data-rulebook-area-hotspot="reserved"');
        expect(playerFigure).toContain('data-rulebook-reserve-card-size="large"');
        expect(playerFigure.indexOf('data-rulebook-area-hotspot="gems"')).toBeLessThan(
            playerFigure.indexOf('data-rulebook-area-hotspot="tableau"')
        );
        expect(playerFigure).toContain('data-rulebook-area-hotspot="buffs"');
        expect(playerFigure).toContain('data-rulebook-area-hotspot="scrolls"');
        expect(centerFigure).toContain('data-rulebook-area-guide="main-field"');
        expect(centerFigure).toContain('/assets/surfaces/dark/tablecloth-playmat.png');
        expect(centerFigure).toContain('data-rulebook-area-hotspot="market"');
        expect(centerFigure).toContain('data-rulebook-market-layout="single-l3-plus-deck"');
        expect(centerFigure).toContain('/assets/cards/373-jo.png');
        expect(centerFigure).toContain(
            '/assets/surfaces/anime-themes/royal-luxury/dark/market-card-back-l3.png'
        );
        expect(centerFigure).not.toContain('/assets/cards/253-bk.png');
        expect(centerFigure).toContain('data-rulebook-area-hotspot="board"');
        expect(centerFigure).toContain('data-rulebook-area-hotspot="royal-area"');
        expect(centerFigure).toContain('data-rulebook-royal-layout="single-card-plus-back"');
        expect(centerFigure).toContain('/assets/cards/r92-ro.png');
        expect(centerFigure).not.toContain('/assets/cards/r93-ro.png');
        expect(centerFigure).toContain(
            '/assets/surfaces/anime-themes/royal-luxury/dark/royal-card-back.png'
        );
        expect(centerFigure).toContain('皇室区');
        expect(topbarFigure).toContain('data-rulebook-area-guide="topbar"');
        expect(topbarFigure).toContain('data-rulebook-topbar-layout="clear-columns"');
        expect(topbarFigure).toContain('data-rulebook-area-hotspot="p1-crowns"');
        expect(topbarFigure).toContain('data-rulebook-area-hotspot="p1-points"');
        expect(topbarFigure).toContain('data-rulebook-area-hotspot="turn-counts"');
        expect(topbarFigure).toContain('data-rulebook-area-hotspot="p2-crowns"');
        expect(topbarFigure).toContain('data-rulebook-area-hotspot="p2-points"');
        const enTopbarFigure = renderToStaticMarkup(
            <RulebookAreaGuidePage kind="topbar" lang="en" />
        );
        expect(enTopbarFigure).toContain('P1 Crowns / Goals');
        expect(enTopbarFigure).toContain('P1 Points / Goal');
        expect(enTopbarFigure).toContain('Turn Counts');
        expect(enTopbarFigure).toContain('P2 Crowns / Goals');
        expect(enTopbarFigure).toContain('P2 Points / Goal');
    });
});
