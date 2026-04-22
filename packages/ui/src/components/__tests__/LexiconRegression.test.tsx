import { describe, expect, it } from 'vitest';
import { buildBuffCompendium } from '@gemduel/shared/data/buffCopy';
import { RULEBOOK_CONTENT } from '../RulebookContent';

const bannedTerms = ['Royal Court', '皇室庭院', '皇室法院', 'Select Joker Color', '选择小丑颜色'];

describe('lexicon normalization regressions', () => {
    it('keeps rulebook and buff compendium text on canonical terminology', () => {
        const rulebookText = RULEBOOK_CONTENT.flatMap((page) => [
            page.title.en,
            page.title.zh,
            page.body.en,
            page.body.zh,
        ]).join('\n');
        const combinedText = [
            rulebookText,
            buildBuffCompendium('en'),
            buildBuffCompendium('zh'),
        ].join('\n');

        for (const bannedTerm of bannedTerms) {
            expect(combinedText).not.toContain(bannedTerm);
        }

        expect(combinedText).toContain('Gem Cap');
        expect(combinedText).toContain('Single-Color Points');
        expect(combinedText).toContain('Royal Card');
        expect(combinedText).toContain('卡牌颜色');
    });
});
