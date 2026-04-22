import type { GameState } from '../types';
import { stableJsonStringify } from '../utils/stableJson';
import type { ReplayCardInstanceId } from './types';
import { serializeReplayStateSnapshot } from './runtime';

const hashString = (value: string): string => {
    let hash = 5381;
    for (let index = 0; index < value.length; index += 1) {
        hash = (hash * 33) ^ value.charCodeAt(index);
    }

    return (hash >>> 0).toString(16);
};

export const generateReplayStateHash = (
    state: GameState,
    runtimeToInstance: Map<string, ReplayCardInstanceId>
): string =>
    hashString(stableJsonStringify(serializeReplayStateSnapshot(state, runtimeToInstance)));
