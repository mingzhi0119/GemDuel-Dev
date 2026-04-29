import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { FEATURED_CARD_SAMPLE_SIZE } from '../Card';
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
        expect(html).toContain('/assets/cards/373-jo.png');
        expect(html).not.toContain('/assets/cards/253-bk.png');
        expect(html).not.toContain('/assets/cards/251-bk.png');
        expect(html).not.toContain('data-card-anatomy-ability-example="true"');
        expect(html).not.toContain('data-card-anatomy-ability-note="true"');
        expect(html).toContain('data-card-anatomy-card-scale="preview"');
        expect(html).toContain('data-card-anatomy-label="prestige"');
        expect(html).toContain('data-card-anatomy-label="ability"');
        expect(html).toContain('data-card-anatomy-label="bonus"');
        expect(html).toContain('data-card-anatomy-label="cost"');
        expect(html).toContain('data-card-anatomy-label="crowns"');
        expect(html).toContain('data-card-anatomy-anchor="top-center-crowns"');
        expect(html).toContain('data-card-sample-canvas="featured"');
        expect(html).toContain(`data-card-sample-width="${FEATURED_CARD_SAMPLE_SIZE.width}"`);
        expect(html).toContain(`data-card-sample-height="${FEATURED_CARD_SAMPLE_SIZE.height}"`);
        expect(html).not.toContain('anatomy-sample');
        expect(html).not.toContain('data-card-face-pattern="true"');
        expect(html).toContain('/assets/ui-icons/abilities/ability-extra-turn-medallion.png');
        expect(html).toContain('/assets/ui-icons/abilities/ability-bonus-gem-medallion.png');
        expect(html).toContain('/assets/ui-icons/abilities/ability-steal-medallion.png');
        expect(html).toContain('/assets/ui-icons/abilities/ability-privilege-medallion.png');
        expect(html).toContain('data-card-anatomy-connector-contrast="strong"');
        expect(html).toContain('data-card-anatomy-connector-halo-width="8"');
        expect(html).toContain('data-card-anatomy-connector-stroke-width="4"');
        expect(html).not.toContain('stroke-width="1.5"');
        expect(html).not.toContain('strokeWidth="1.5"');
        expect(html).toContain('h-[128px] w-[128px]');
        expect(html).toContain('h-full w-full object-contain');
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
