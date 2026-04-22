import { getLexiconLabel } from '../../lexicon';

export const enLabelMessages = {
    'gem.blue': 'Blue',
    'gem.white': 'White',
    'gem.green': 'Green',
    'gem.black': 'Black',
    'gem.red': 'Red',
    'gem.pearl': 'Pearl',
    'gem.gold': 'Gold',
    'gem.neutral': 'Neutral',
    'gem.empty': '',
    'ability.again': getLexiconLabel('extraTurn', 'en'),
    'ability.steal': getLexiconLabel('steal', 'en'),
    'ability.scroll': getLexiconLabel('privilege', 'en'),
    'ability.bonus_gem': getLexiconLabel('bonusGem', 'en'),
    'ability.none': '',
    'royal.royal-3pts': 'The Queen',
    'royal.royal-again': 'The Merchant',
    'royal.royal-scroll': 'The Judge',
    'royal.royal-steal': 'The Thief',
} as const;

type LabelMessageShape = { [K in keyof typeof enLabelMessages]: string };

export const zhLabelMessages: LabelMessageShape = {
    'gem.blue': '蓝色',
    'gem.white': '白色',
    'gem.green': '绿色',
    'gem.black': '黑色',
    'gem.red': '红色',
    'gem.pearl': '珍珠',
    'gem.gold': '黄金',
    'gem.neutral': '中性',
    'gem.empty': '',
    'ability.again': getLexiconLabel('extraTurn', 'zh'),
    'ability.steal': getLexiconLabel('steal', 'zh'),
    'ability.scroll': getLexiconLabel('privilege', 'zh'),
    'ability.bonus_gem': getLexiconLabel('bonusGem', 'zh'),
    'ability.none': '',
    'royal.royal-3pts': '王后',
    'royal.royal-again': '商贾',
    'royal.royal-scroll': '裁判官',
    'royal.royal-steal': '盗贼',
} as const;
