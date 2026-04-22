import type { BuffEffects } from '../types';
import {
    BUFF_COPY,
    BUFF_LEVEL_TITLES,
    BUFF_ORDER_BY_LEVEL,
    GOAL_ADJUSTMENT_COPY,
    type BuffLocale,
    type LocalizedBuffText,
} from './buffCopyCatalog';
import { getLexiconLabel } from '../lexicon';

export { BUFF_COPY, BUFF_ORDER_BY_LEVEL, type BuffLocale };

export interface BuffGoalAdjustmentItem {
    label: string;
    value: string;
}

export interface BuffGoalAdjustment {
    title: string;
    items: BuffGoalAdjustmentItem[];
}

export function getBuffText(id: string, locale: BuffLocale): LocalizedBuffText {
    return BUFF_COPY[id]?.[locale] ?? { label: id, desc: '' };
}

export function getBuffWinCondition(id: string): BuffEffects['winCondition'] | undefined {
    const goal = BUFF_COPY[id]?.goal;
    return goal ? { ...goal } : undefined;
}

export function getBuffGoalAdjustment(id: string, locale: BuffLocale): BuffGoalAdjustment | null {
    const goal = BUFF_COPY[id]?.goal;
    if (!goal) {
        return null;
    }

    const copy = GOAL_ADJUSTMENT_COPY[locale];
    const items: BuffGoalAdjustmentItem[] = [];

    if (goal.points) {
        items.push({ label: copy.points, value: String(goal.points) });
    }
    if (goal.crowns) {
        items.push({ label: copy.crowns, value: String(goal.crowns) });
    }
    if (goal.singleColor) {
        items.push({ label: copy.singleColor, value: String(goal.singleColor) });
    }
    if (goal.disableSingleColor) {
        items.push({ label: copy.disableSingleColor, value: copy.disabled });
    }

    return items.length > 0 ? { title: copy.title, items } : null;
}

function buildBuffInlineGoalSummary(id: string, locale: BuffLocale): string {
    const goal = BUFF_COPY[id]?.goal;
    if (!goal) {
        return '';
    }

    const segments: string[] = [];

    if (locale === 'en') {
        if (goal.points) {
            segments.push(
                `Win Condition: ${goal.points} ${getLexiconLabel('prestigePoints', 'en')}.`
            );
        }
        if (goal.crowns) {
            segments.push(`Win Condition: ${goal.crowns} ${getLexiconLabel('crowns', 'en')}.`);
        }
        if (goal.singleColor) {
            segments.push(
                `Win Condition: ${goal.singleColor} ${getLexiconLabel('singleColorPoints', 'en')}.`
            );
        }
        if (goal.disableSingleColor) {
            segments.push('No Single-Color Points Win.');
        }
    } else {
        if (goal.points) {
            segments.push(`获胜条件：${goal.points} ${getLexiconLabel('prestigePoints', 'zh')}。`);
        }
        if (goal.crowns) {
            segments.push(`获胜条件：${goal.crowns} 个${getLexiconLabel('crowns', 'zh')}。`);
        }
        if (goal.singleColor) {
            segments.push(
                `获胜条件：${goal.singleColor} ${getLexiconLabel('singleColorPoints', 'zh')}。`
            );
        }
        if (goal.disableSingleColor) {
            segments.push('取消单色分数获胜。');
        }
    }

    return segments.join(' ');
}

export function buildBuffCompendium(locale: BuffLocale): string {
    return ([1, 2, 3] as const)
        .map((level) => {
            const title = BUFF_LEVEL_TITLES[locale][level];
            const entries = BUFF_ORDER_BY_LEVEL[level]
                .map((id) => {
                    const copy = getBuffText(id, locale);
                    const goalSummary = buildBuffInlineGoalSummary(id, locale);
                    return `${copy.label}: ${[copy.desc, goalSummary].filter(Boolean).join(' ')}`;
                })
                .join('\n');

            return `${title}\n\n${entries}`;
        })
        .join('\n\n');
}
