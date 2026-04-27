import { GAME_PHASES } from '@gemduel/shared/constants';
import type { GameState, GemColor, GemInventory, PlayerKey } from '@gemduel/shared/types';
import type {
    BoardGemPresentationSource,
    GemDiscardPresentationEvent,
    GemDropPresentationEvent,
    GemFlightPresentationEvent,
    GemStealPresentationEvent,
    PresentationEvent,
} from './presentationTypes';

const PLAYER_KEYS = ['p1', 'p2'] as const satisfies readonly PlayerKey[];
const GEM_COLORS = [
    'blue',
    'white',
    'green',
    'black',
    'red',
    'pearl',
    'gold',
] as const satisfies readonly GemColor[];

export const isPresentationGemColor = (value: string): value is GemColor =>
    GEM_COLORS.includes(value as GemColor);

const getInventoryDelta = (
    previousInventory: GemInventory,
    nextInventory: GemInventory
): Partial<Record<GemColor, number>> => {
    const delta: Partial<Record<GemColor, number>> = {};

    for (const color of GEM_COLORS) {
        const diff = nextInventory[color] - previousInventory[color];
        if (diff !== 0) {
            delta[color] = diff;
        }
    }

    return delta;
};

const hasDelta = (delta: Partial<Record<GemColor, number>>): boolean =>
    GEM_COLORS.some((color) => (delta[color] ?? 0) !== 0);

const createDeltaIdPart = (delta: Partial<Record<GemColor, number>>): string =>
    GEM_COLORS.filter((color) => delta[color] !== undefined)
        .map((color) => `${color}:${delta[color]}`)
        .join(',');

const createPositiveDelta = (
    delta: Partial<Record<GemColor, number>>,
    usedColors: Set<GemColor>
): Partial<Record<GemColor, number>> => {
    const positiveDelta: Partial<Record<GemColor, number>> = {};

    for (const color of GEM_COLORS) {
        const value = delta[color] ?? 0;
        if (value > 0 && !usedColors.has(color)) {
            positiveDelta[color] = value;
        }
    }

    return positiveDelta;
};

const createNegativeDelta = (
    delta: Partial<Record<GemColor, number>>,
    usedColors: Set<GemColor>
): Partial<Record<GemColor, number>> => {
    const negativeDelta: Partial<Record<GemColor, number>> = {};

    for (const color of GEM_COLORS) {
        const value = delta[color] ?? 0;
        if (value < 0 && !usedColors.has(color)) {
            negativeDelta[color] = Math.abs(value);
        }
    }

    return negativeDelta;
};

const findRemovedBoardGemSources = (
    previousState: GameState,
    nextState: GameState,
    color: GemColor,
    amount: number
): BoardGemPresentationSource[] => {
    const sources: BoardGemPresentationSource[] = [];

    previousState.board.forEach((row, rowIndex) => {
        row.forEach((previousCell, colIndex) => {
            if (sources.length >= amount || previousCell.type.id !== color) {
                return;
            }

            const nextCell = nextState.board[rowIndex]?.[colIndex];
            if (!nextCell || nextCell.uid !== previousCell.uid || nextCell.type.id !== color) {
                sources.push({ row: rowIndex, col: colIndex, color });
            }
        });
    });

    return sources;
};

const collectBoardGemSourcesForDelta = (
    previousState: GameState,
    nextState: GameState,
    delta: Partial<Record<GemColor, number>>
): BoardGemPresentationSource[] =>
    GEM_COLORS.flatMap((color) => {
        const amount = delta[color] ?? 0;
        return amount > 0
            ? findRemovedBoardGemSources(previousState, nextState, color, amount)
            : [];
    });

export const deriveGemEvents = (
    previousState: GameState,
    nextState: GameState,
    currentIndex: number
): PresentationEvent[] => {
    const events: PresentationEvent[] = [];
    const deltas = {
        p1: getInventoryDelta(previousState.inventories.p1, nextState.inventories.p1),
        p2: getInventoryDelta(previousState.inventories.p2, nextState.inventories.p2),
    };
    const stealColors = {
        p1: new Set<GemColor>(),
        p2: new Set<GemColor>(),
    };
    const shouldEmitDiscard =
        previousState.phase === GAME_PHASES.DISCARD_EXCESS_GEMS ||
        nextState.phase === GAME_PHASES.DISCARD_EXCESS_GEMS;

    for (const color of GEM_COLORS) {
        const p1Delta = deltas.p1[color] ?? 0;
        const p2Delta = deltas.p2[color] ?? 0;

        if (p1Delta > 0 && p2Delta < 0) {
            const amount = Math.min(p1Delta, Math.abs(p2Delta));
            events.push({
                id: `gem-steal:${currentIndex}:p2:p1:${color}:${amount}`,
                type: 'gem-steal',
                fromPlayer: 'p2',
                toPlayer: 'p1',
                deltas: { [color]: amount },
                createdAtIndex: currentIndex,
            } satisfies GemStealPresentationEvent);
            stealColors.p1.add(color);
            stealColors.p2.add(color);
        } else if (p2Delta > 0 && p1Delta < 0) {
            const amount = Math.min(p2Delta, Math.abs(p1Delta));
            events.push({
                id: `gem-steal:${currentIndex}:p1:p2:${color}:${amount}`,
                type: 'gem-steal',
                fromPlayer: 'p1',
                toPlayer: 'p2',
                deltas: { [color]: amount },
                createdAtIndex: currentIndex,
            } satisfies GemStealPresentationEvent);
            stealColors.p1.add(color);
            stealColors.p2.add(color);
        }
    }

    for (const player of PLAYER_KEYS) {
        const positiveDelta = createPositiveDelta(deltas[player], stealColors[player]);
        if (hasDelta(positiveDelta)) {
            const sources = collectBoardGemSourcesForDelta(previousState, nextState, positiveDelta);
            events.push({
                id: `gem-flight:${currentIndex}:${player}:${createDeltaIdPart(positiveDelta)}`,
                type: 'gem-flight',
                player,
                deltas: positiveDelta,
                sources,
                createdAtIndex: currentIndex,
            } satisfies GemFlightPresentationEvent);
        }

        const negativeDelta = createNegativeDelta(deltas[player], stealColors[player]);
        if (shouldEmitDiscard && hasDelta(negativeDelta)) {
            events.push({
                id: `gem-discard:${currentIndex}:${player}:${createDeltaIdPart(negativeDelta)}`,
                type: 'gem-discard',
                player,
                deltas: negativeDelta,
                createdAtIndex: currentIndex,
            } satisfies GemDiscardPresentationEvent);
        }
    }

    return events;
};

export const deriveGemDropEvent = (
    previousState: GameState,
    nextState: GameState,
    currentIndex: number
): GemDropPresentationEvent | null => {
    const cells: GemDropPresentationEvent['cells'] = [];

    nextState.board.forEach((row, rowIndex) => {
        row.forEach((nextCell, colIndex) => {
            const previousCell = previousState.board[rowIndex]?.[colIndex];
            const nextGemId = nextCell.type.id;
            if (
                isPresentationGemColor(nextGemId) &&
                previousCell &&
                (previousCell.uid !== nextCell.uid || previousCell.type.id !== nextCell.type.id)
            ) {
                cells.push({ row: rowIndex, col: colIndex, color: nextGemId });
            }
        });
    });

    if (cells.length === 0) {
        return null;
    }

    return {
        id: `gem-drop:${currentIndex}:${cells.map((cell) => `${cell.row}.${cell.col}`).join('|')}`,
        type: 'gem-drop',
        cells,
        createdAtIndex: currentIndex,
    };
};
