import { describe, expect, it } from 'vitest';
import { buildBuffCompendium } from '@gemduel/shared/data/buffCopy';
import { getLexiconDescription } from '@gemduel/shared';
import { getRulebookSearchText } from '../RulebookContent';

const bannedTerms = [
    'Royal Court',
    '皇室庭院',
    '皇室法院',
    'Select Joker Color',
    '选择小丑颜色',
    'Roguelike Mode (New!)',
    'Royal reward',
    'Royal rewards',
    '皇室奖励',
    '免费奖励卡',
];

describe('lexicon normalization regressions', () => {
    it('keeps rulebook and buff compendium text on canonical terminology', () => {
        const combinedText = [
            getRulebookSearchText(),
            getLexiconDescription('crowns', 'zh'),
            getLexiconDescription('royal', 'zh'),
            getLexiconDescription('royalCard', 'zh'),
            getLexiconDescription('bonus', 'zh'),
            getLexiconDescription('singleColorPoints', 'zh'),
            buildBuffCompendium('en'),
            buildBuffCompendium('zh'),
        ].join('\n');

        for (const bannedTerm of bannedTerms) {
            expect(combinedText).not.toContain(bannedTerm);
        }

        expect(combinedText).toContain('Gem Cap');
        expect(combinedText).toContain('Single-Color Points');
        expect(combinedText).toContain('Royal Card');
        expect(combinedText).toContain('Royal Area');
        expect(combinedText).toContain('皇室区');
        expect(combinedText).toContain('卡牌颜色');
        expect(combinedText).toContain('没有折扣宝石的卡牌只计入总分');
        expect(combinedText).toContain('任选一种基础颜色作为折扣');
    });
});
