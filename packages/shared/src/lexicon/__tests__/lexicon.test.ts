import { describe, expect, it } from 'vitest';
import {
    LEXICON_TERM_IDS,
    getLexiconTerm,
    segmentLexiconText,
    type LexiconSegmentTerm,
} from '../index';

const getTermSegments = (text: string, locale: 'en' | 'zh') =>
    segmentLexiconText(text, locale).filter(
        (segment): segment is LexiconSegmentTerm => segment.type === 'term'
    );

describe('lexicon catalog', () => {
    it('keeps every term populated for both locales', () => {
        for (const termId of LEXICON_TERM_IDS) {
            const term = getLexiconTerm(termId);

            expect(term.label.en).toBeTruthy();
            expect(term.label.zh).toBeTruthy();
            expect(term.description.en).toBeTruthy();
            expect(term.description.zh).toBeTruthy();
            expect(term.aliases.en.length).toBeGreaterThan(0);
            expect(term.aliases.zh.length).toBeGreaterThan(0);
        }
    });

    it('keeps canonical labels unique within each locale', () => {
        for (const locale of ['en', 'zh'] as const) {
            const labels = LEXICON_TERM_IDS.map((termId) => getLexiconTerm(termId).label[locale]);
            expect(new Set(labels).size).toBe(labels.length);
        }
    });

    it('uses Royal Area as the canonical area term', () => {
        const royal = getLexiconTerm('royal');

        expect(royal.label.en).toBe('Royal Area');
        expect(royal.label.zh).toBe('皇室区');
    });
});

describe('segmentLexiconText', () => {
    it('prefers the longest English alias when terms overlap', () => {
        const segments = getTermSegments(
            'Royal Card, Royal, Special Privilege, Privilege Scroll, Privilege, Bonus Gem, Bonus.',
            'en'
        );

        expect(segments.map((segment) => `${segment.termId}:${segment.value}`)).toEqual([
            'royalCard:Royal Card',
            'royal:Royal',
            'specialPrivilege:Special Privilege',
            'privilegeScroll:Privilege Scroll',
            'privilege:Privilege',
            'bonusGem:Bonus Gem',
            'bonus:Bonus',
        ]);
    });

    it('enforces whole-term boundaries for English aliases', () => {
        const segments = getTermSegments('Bonuses Bonus_Gem Bonus-Gem Bonus bonus_gem', 'en');

        expect(segments.map((segment) => segment.value)).toEqual(['Bonuses', 'Bonus']);
    });

    it('matches exact Chinese substrings without splitting longer phrases', () => {
        const segments = getTermSegments('皇室卡会计入单色分数，而皇室会发放奖励。', 'zh');

        expect(segments.map((segment) => `${segment.termId}:${segment.value}`)).toEqual([
            'royalCard:皇室卡',
            'singleColorPoints:单色分数',
            'royal:皇室',
            'bonus:奖励',
        ]);
    });

    it('does not confuse Take Gems with Bonus Gem in Chinese', () => {
        const segments = getTermSegments('拿取宝石，然后结算奖励宝石。', 'zh');

        expect(segments.map((segment) => `${segment.termId}:${segment.value}`)).toEqual([
            'takeGems:拿取宝石',
            'bonusGem:奖励宝石',
        ]);
    });

    it('segments Reveal as a standalone actionable keyword in both locales', () => {
        const enSegments = getTermSegments(
            'Reveal 2 extra L3 cards. Revealed cards stay actionable.',
            'en'
        );
        const zhSegments = getTermSegments('揭示 1 级卡组顶部的那张牌。', 'zh');

        expect(enSegments.map((segment) => `${segment.termId}:${segment.value}`)).toEqual([
            'reveal:Reveal',
            'reveal:Revealed',
        ]);
        expect(zhSegments.map((segment) => `${segment.termId}:${segment.value}`)).toEqual([
            'reveal:揭示',
        ]);
    });
});
