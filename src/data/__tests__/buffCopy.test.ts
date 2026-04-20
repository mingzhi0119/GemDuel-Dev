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
            { label: 'Single Color Win', value: 'Disabled' },
        ]);
    });
});
