import { describe, expect, it } from 'vitest';
import { BUFFS } from '../../constants';
import {
    BUFF_COPY,
    buildBuffCompendium,
    getBuffGoalAdjustment,
    getBuffText,
    getBuffWinCondition,
} from '../buffCopy';

describe('buffCopy', () => {
    it('keeps gameplay buff labels and descriptions sourced from shared english copy', () => {
        for (const [id, copy] of Object.entries(BUFF_COPY)) {
            const buff = Object.values(BUFFS).find((entry) => entry.id === id);
            const winCondition =
                buff?.effects && 'winCondition' in buff.effects
                    ? buff.effects.winCondition
                    : undefined;

            expect(buff, `missing buff constant for ${id}`).toBeTruthy();
            expect(buff?.label).toBe(copy.en.label);
            expect(buff?.desc).toBe(copy.en.desc);
            expect(winCondition).toEqual(getBuffWinCondition(id));
        }
    });

    it('builds compendium text from the same shared source', () => {
        const zhCompendium = buildBuffCompendium('zh');
        const enCompendium = buildBuffCompendium('en');
        const wonderGoal = getBuffGoalAdjustment('wonder_architect', 'en');

        expect(zhCompendium).toContain(
            `${getBuffText('pacifist', 'zh').label}: ${getBuffText('pacifist', 'zh').desc}`
        );
        expect(enCompendium).toContain(
            `${getBuffText('intelligence', 'en').label}: ${getBuffText('intelligence', 'en').desc}`
        );
        expect(wonderGoal?.items).toEqual([
            { label: 'Crowns', value: '13' },
            { label: 'Single-Color Points Win', value: 'Disabled' },
        ]);
    });

    it('keeps Minimalist aligned to the first-two-card bonus boost and Gem Cap 8', () => {
        expect(BUFFS.MINIMALIST.effects.passive).toMatchObject({
            doubleBonusFirst2: true,
            gemCap: 8,
        });
        expect(getBuffText('minimalist', 'en').desc).toContain('Gem Cap: 8.');
        expect(getBuffText('minimalist', 'zh').desc).toContain('宝石持有上限：8。');
    });

    it('keeps Insight on the default 20-point race while exposing the revealed top card as actionable', () => {
        expect(BUFFS.INSIGHT.effects).toEqual({ passive: { revealDeck1: true } });
        expect(getBuffWinCondition('insight')).toBeUndefined();
        expect(getBuffText('insight', 'en').desc).toBe('Reveal the top card of the Level 1 Deck.');
        expect(getBuffText('insight', 'zh').desc).toBe('揭示 1 级卡组顶部的那张牌。');
        expect(getBuffText('all_seeing_eye', 'en').desc).toContain('Reveal 2 extra L3 cards.');
        expect(getBuffText('all_seeing_eye', 'zh').desc).toContain('揭示 2 张额外 L3 卡。');
    });
});
