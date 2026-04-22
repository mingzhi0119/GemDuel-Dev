import { BUFFS, GRID_SIZE } from '../constants';
import { generateDeck, generateGemPool, shuffleArray } from '../utils';
import type {
    BasicGemColor,
    BoardCell,
    Buff,
    BuffInitPayload,
    BuffLevel,
    GameAction,
    GameMode,
    InitDraftPayload,
    P2DraftPoolIndices,
    PlayerKey,
    PlayerInitRandoms,
} from '../types';

export interface StartGameOptions {
    useBuffs: boolean;
    isHost?: boolean;
    hostPlayer?: PlayerKey;
}

export const BASIC_GEM_COLORS: BasicGemColor[] = ['red', 'green', 'blue', 'white', 'black'];

export const getRandomBasicGemColor = (): BasicGemColor =>
    BASIC_GEM_COLORS[Math.floor(Math.random() * BASIC_GEM_COLORS.length)];

export const isBuffLevel = (value: unknown): value is BuffLevel =>
    value === 1 || value === 2 || value === 3;

const buildBoard = (initialBoardFlat: BoardCell[]): BoardCell[][] => {
    const board: BoardCell[][] = [];

    for (let r = 0; r < GRID_SIZE; r++) {
        const row: BoardCell[] = [];
        for (let c = 0; c < GRID_SIZE; c++) {
            row.push(initialBoardFlat[r * GRID_SIZE + c]);
        }
        board.push(row);
    }

    return board;
};

const createPlayerInitRandoms = (): PlayerInitRandoms => ({
    randomGems: Array.from({ length: 5 }, () => getRandomBasicGemColor()),
    reserveCardLevel: (Math.floor(Math.random() * 3) + 1) as 1 | 2 | 3,
    preferenceColor: getRandomBasicGemColor(),
});

const getLevelBuffs = (level: BuffLevel): Buff[] =>
    (Object.values(BUFFS) as Buff[]).filter((buff) => buff.level === level);

interface DraftCandidateOptions {
    excludeBuffIds?: Set<string>;
    excludeCategories?: Set<NonNullable<Buff['category']>>;
    targetCount: number;
}

const buildCategoryDiverseDraftCandidates = (
    level: BuffLevel,
    {
        excludeBuffIds = new Set<string>(),
        excludeCategories = new Set<NonNullable<Buff['category']>>(),
        targetCount,
    }: DraftCandidateOptions
): Buff[] => {
    const categoriesSeen = new Set<string>();
    const selectedBuffs: Buff[] = [];
    const shuffledPool = shuffleArray([...getLevelBuffs(level)]);

    for (const buff of shuffledPool) {
        if (excludeBuffIds.has(buff.id)) continue;
        if (buff.category && excludeCategories.has(buff.category)) continue;
        if (!buff.category || categoriesSeen.has(buff.category)) continue;
        categoriesSeen.add(buff.category);
        selectedBuffs.push(buff);
        if (selectedBuffs.length === targetCount) {
            return selectedBuffs;
        }
    }

    for (const buff of shuffledPool) {
        if (excludeBuffIds.has(buff.id)) continue;
        if (buff.category && excludeCategories.has(buff.category)) continue;
        if (selectedBuffs.some((candidate) => candidate.id === buff.id)) continue;
        selectedBuffs.push(buff);
        if (selectedBuffs.length === targetCount) {
            break;
        }
    }

    return selectedBuffs;
};

export const buildDraftPoolForLevel = (level: BuffLevel): string[] => {
    const selectedBuffs = buildCategoryDiverseDraftCandidates(level, { targetCount: 3 });
    return selectedBuffs.map((buff) => buff.id);
};

export const buildP2AsymmetricDraftPool = (
    level: BuffLevel,
    p1SelectedBuffId: string
): string[] | undefined => {
    const p1SelectedBuff = (Object.values(BUFFS) as Buff[]).find(
        (buff) => buff.id === p1SelectedBuffId
    );
    if (!p1SelectedBuff) {
        return undefined;
    }

    const excludeCategories = new Set<NonNullable<Buff['category']>>();
    if (p1SelectedBuff.category) {
        excludeCategories.add(p1SelectedBuff.category);
    }

    const generatedPool = buildCategoryDiverseDraftCandidates(level, {
        excludeBuffIds: new Set([p1SelectedBuffId]),
        excludeCategories,
        targetCount: 3,
    });

    return [p1SelectedBuffId, ...generatedPool.map((buff) => buff.id)];
};

export const buildP2DraftPoolIndices = (
    buffLevel: number,
    selectedBuffId: string
): P2DraftPoolIndices | undefined => {
    if (!isBuffLevel(buffLevel)) {
        return undefined;
    }

    const levelBuffs = getLevelBuffs(buffLevel);
    const p2DraftPool = buildP2AsymmetricDraftPool(buffLevel, selectedBuffId);
    if (!p2DraftPool || p2DraftPool.length !== 4) {
        return undefined;
    }

    const finalIndices = p2DraftPool.map((buffId) =>
        levelBuffs.findIndex((candidate) => candidate.id === buffId)
    );

    if (finalIndices.some((idx) => idx === -1)) {
        return undefined;
    }

    return finalIndices as P2DraftPoolIndices;
};

export const createGameSetupPayload = (
    mode: GameMode,
    options: StartGameOptions = { useBuffs: false }
): BuffInitPayload => {
    const fullPool = generateGemPool();
    const initialBoardFlat = fullPool.slice(0, 25);
    const initialBag = fullPool.slice(25);
    const deck1 = generateDeck(1, options.useBuffs);
    const deck2 = generateDeck(2, options.useBuffs);
    const deck3 = generateDeck(3, options.useBuffs);

    return {
        mode,
        board: buildBoard(initialBoardFlat),
        bag: initialBag,
        market: {
            1: deck1.splice(0, 5),
            2: deck2.splice(0, 4),
            3: deck3.splice(0, 3),
        },
        decks: {
            1: deck1,
            2: deck2,
            3: deck3,
        },
        initRandoms: {
            p1: createPlayerInitRandoms(),
            p2: createPlayerInitRandoms(),
        },
        isHost: options.isHost ?? true,
        hostPlayer: options.hostPlayer ?? 'p1',
    };
};

export const buildStartGameAction = (
    mode: GameMode,
    options: StartGameOptions = { useBuffs: false }
): Extract<GameAction, { type: 'INIT' | 'INIT_DRAFT' }> => {
    const setupData = createGameSetupPayload(mode, options);

    if (!options.useBuffs) {
        return { type: 'INIT', payload: setupData };
    }

    const buffLevel = (Math.floor(Math.random() * 3) + 1) as 1 | 2 | 3;
    const payload: InitDraftPayload = {
        ...setupData,
        draftPool: buildDraftPoolForLevel(buffLevel),
        buffLevel,
    };

    return {
        type: 'INIT_DRAFT',
        payload,
    };
};
