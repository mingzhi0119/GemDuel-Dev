import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { INITIAL_STATE_SKELETON } from '../initialState';
import { validateCommand } from '../commandGate';
import { parseNetworkMessage } from '../actionValidation';
import { validateGemSelection } from '../validators';
import { NETWORK_PROTOCOL_VERSION } from '../../types/network';
import type { GameAction, GameState, GemCoord } from '../../types';

const cloneState = (): GameState => JSON.parse(JSON.stringify(INITIAL_STATE_SKELETON)) as GameState;

const inBoundsCoordArbitrary = fc.record({
    r: fc.integer({ min: 0, max: 4 }),
    c: fc.integer({ min: 0, max: 4 }),
});

const outOfBoundsCoordArbitrary = fc.oneof(
    fc.record({
        r: fc.oneof(fc.integer({ min: -4, max: -1 }), fc.integer({ min: 5, max: 8 })),
        c: fc.integer({ min: -4, max: 8 }),
    }),
    fc.record({
        r: fc.integer({ min: -4, max: 8 }),
        c: fc.oneof(fc.integer({ min: -4, max: -1 }), fc.integer({ min: 5, max: 8 })),
    })
);

const directionArbitrary = fc.constantFrom(
    [1, 0] as const,
    [-1, 0] as const,
    [0, 1] as const,
    [0, -1] as const,
    [1, 1] as const,
    [1, -1] as const,
    [-1, 1] as const,
    [-1, -1] as const
);

const contiguousLineArbitrary = fc
    .tuple(inBoundsCoordArbitrary, directionArbitrary, fc.integer({ min: 1, max: 3 }), fc.boolean())
    .filter(([start, [dr, dc], length]) => {
        const endRow = start.r + dr * (length - 1);
        const endCol = start.c + dc * (length - 1);
        return endRow >= 0 && endRow <= 4 && endCol >= 0 && endCol <= 4;
    })
    .map(([start, [dr, dc], length, reversed]) => {
        const line = Array.from({ length }, (_, index) => ({
            r: start.r + dr * index,
            c: start.c + dc * index,
        }));
        return reversed ? [...line].reverse() : line;
    });

describe('Property-based boundary coverage', () => {
    it('accepts any contiguous in-bounds line of one to three gems', () => {
        fc.assert(
            fc.property(contiguousLineArbitrary, (selection) => {
                const result = validateGemSelection(selection);
                expect(result.valid).toBe(true);
                expect(result.hasGap).toBe(false);
            }),
            { numRuns: 100 }
        );
    });

    it('rejects duplicate gem coordinates at the reducer command gate', () => {
        fc.assert(
            fc.property(inBoundsCoordArbitrary, (coord) => {
                const state = cloneState();
                const action: GameAction = {
                    type: 'TAKE_GEMS',
                    payload: { coords: [coord, coord] },
                };

                const validation = validateCommand(state, action);
                expect(validation.valid).toBe(false);
                expect(validation.reason).toMatch(/unique/i);
            }),
            { numRuns: 50 }
        );
    });

    it('rejects out-of-bounds gem coordinates at the reducer command gate', () => {
        fc.assert(
            fc.property(outOfBoundsCoordArbitrary, (coord) => {
                const state = cloneState();
                const action: GameAction = {
                    type: 'TAKE_GEMS',
                    payload: { coords: [coord as GemCoord] },
                };

                const validation = validateCommand(state, action);
                expect(validation.valid).toBe(false);
                expect(validation.reason).toMatch(/out-of-bounds/i);
            }),
            { numRuns: 50 }
        );
    });

    it('rejects protocol messages that use the wrong version even when the shape looks valid', () => {
        fc.assert(
            fc.property(
                fc.integer().filter((version) => version !== NETWORK_PROTOCOL_VERSION),
                (version) => {
                    expect(
                        parseNetworkMessage({
                            version,
                            type: 'HEARTBEAT_PING',
                            timestamp: 1,
                        })
                    ).toBeNull();
                }
            ),
            { numRuns: 50 }
        );
    });
});
