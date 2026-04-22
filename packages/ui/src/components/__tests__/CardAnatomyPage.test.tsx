import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { CardAnatomyPage } from '../CardAnatomyPage';

describe('CardAnatomyPage', () => {
    it('renders the anatomy sections in English', () => {
        const html = renderToStaticMarkup(<CardAnatomyPage theme="light" lang="en" />);

        expect(html).toContain('Card Layout');
        expect(html).toContain('Special Abilities');
        expect(html).toContain('Prestige Points');
        expect(html).toContain('Bonus');
        expect(html).toContain('Special Ability');
        expect(html).toContain('Gem Cost');
        expect(html).toContain('Crowns');
        expect(html).toContain('Bonus Gem');
        expect(html).toContain('Extra Turn');
        expect(html).toContain('Privilege');
    });

    it('renders the anatomy sections in Chinese', () => {
        const html = renderToStaticMarkup(<CardAnatomyPage theme="dark" lang="zh" />);

        expect(html).toContain('卡牌结构');
        expect(html).toContain('特殊能力');
        expect(html).toContain('声望值');
        expect(html).toContain('奖励');
        expect(html).toContain('特殊能力');
        expect(html).toContain('宝石成本');
        expect(html).toContain('皇冠');
        expect(html).toContain('奖励宝石');
        expect(html).toContain('额外回合');
        expect(html).toContain('特权');
    });
});
