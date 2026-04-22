import type { GameState, GemColor } from '../types';
import { generateGameStateHash } from '../utils/checksum';

export const BASIC_GEM_COLORS: readonly GemColor[] = ['red', 'green', 'blue', 'white', 'black'];

const RUNTIME_CARD_SUFFIX_PATTERN = /-\d{13}-[a-z0-9]+$/i;
const REPLAY_INSTANCE_PATTERN = /^c:(.+)#\d+$/;

const hashString = (value: string): number => {
    let hash = 5381;
    for (let index = 0; index < value.length; index += 1) {
        hash = (hash * 33) ^ value.charCodeAt(index);
    }

    return hash >>> 0;
};

export const canonicalizeDeterministicSaltToken = (value: string): string => {
    const replayInstanceMatch = REPLAY_INSTANCE_PATTERN.exec(value);
    if (replayInstanceMatch) {
        return replayInstanceMatch[1]!;
    }

    return value.replace(RUNTIME_CARD_SUFFIX_PATTERN, '');
};

export const pickDeterministicValue = <T>(
    state: GameState,
    choices: readonly T[],
    salt: string
): T => {
    if (choices.length === 0) {
        throw new Error('Cannot pick a deterministic value from an empty list.');
    }

    const seed = `${generateGameStateHash(state)}:${salt}`;
    return choices[hashString(seed) % choices.length]!;
};

export const pickDeterministicBasicGemColor = (state: GameState, salt: string): GemColor =>
    pickDeterministicValue(state, BASIC_GEM_COLORS, salt);
