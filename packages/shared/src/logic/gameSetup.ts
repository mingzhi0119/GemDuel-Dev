import { BUFFS, GRID_SIZE } from '../constants';
import { generateDeck, generateGemPool, shuffleArray } from '../utils';
import type {
    BasicGemColor,
    BoardCell,
    Buff,
    BuffInitPayload,
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

const getLevelBuffs = (level: 1 | 2 | 3): Buff[] =>
    (Object.values(BUFFS) as Buff[]).filter((buff) => buff.level === level);

export const buildDraftPoolForLevel = (level: 1 | 2 | 3): string[] => {
    const categoriesSeen = new Set<string>();
    const selectedBuffs: Buff[] = [];
    const shuffledPool = shuffleArray([...getLevelBuffs(level)]);

    for (const buff of shuffledPool) {
        if (!buff.category || categoriesSeen.has(buff.category)) continue;
        categoriesSeen.add(buff.category);
        selectedBuffs.push(buff);
        if (selectedBuffs.length === 3) break;
    }

    return selectedBuffs.map((buff) => buff.id);
};

export const buildP2DraftPoolIndices = (
    buffLevel: number,
    selectedBuffId: string
): P2DraftPoolIndices | undefined => {
    if (buffLevel !== 1 && buffLevel !== 2 && buffLevel !== 3) {
        return undefined;
    }

    const levelBuffs = getLevelBuffs(buffLevel);
    const selectedBuff = levelBuffs.find((buff) => buff.id === selectedBuffId);
    if (!selectedBuff?.category) {
        return undefined;
    }

    const selectedIndex = levelBuffs.findIndex((buff) => buff.id === selectedBuffId);
    if (selectedIndex === -1) {
        return undefined;
    }

    const finalIndices: number[] = [selectedIndex];
    const categoriesSeen = new Set<string>();
    const poolForP2 = levelBuffs.filter(
        (buff) => buff.id !== selectedBuffId && buff.category !== selectedBuff.category
    );
    const shuffledPool = shuffleArray([...poolForP2]);

    for (const buff of shuffledPool) {
        if (!buff.category || categoriesSeen.has(buff.category)) continue;
        const idx = levelBuffs.findIndex((candidate) => candidate.id === buff.id);
        if (idx === -1) continue;
        categoriesSeen.add(buff.category);
        finalIndices.push(idx);
        if (finalIndices.length === 4) break;
    }

    return finalIndices.length === 4 ? (finalIndices as P2DraftPoolIndices) : undefined;
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
