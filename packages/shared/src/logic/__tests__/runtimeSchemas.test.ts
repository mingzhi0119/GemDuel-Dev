import { describe, expect, it } from 'vitest';
import type { CardInteractionContext, SelectBuffPayload } from '../../types';
import {
    marketCardRefSchema,
    parseRuntimeIceServers,
    rerollDraftPoolPayloadSchema,
    selectBuffPayloadSchema,
} from '../runtimeSchemas';

describe('runtimeSchemas', () => {
    it('accepts typed market card contexts for standard and extra cards', () => {
        const marketContext = { level: 2, idx: 1 } satisfies CardInteractionContext;
        const extraContext = {
            level: 3,
            idx: 0,
            isExtra: true,
            extraIdx: 2,
        } satisfies CardInteractionContext;

        expect(marketCardRefSchema.safeParse(marketContext).success).toBe(true);
        expect(marketCardRefSchema.safeParse(extraContext).success).toBe(true);
    });

    it('rejects malformed extra-card contexts and legacy string buff payloads', () => {
        expect(
            marketCardRefSchema.safeParse({
                level: 3,
                idx: 0,
                isExtra: true,
            }).success
        ).toBe(false);

        expect(selectBuffPayloadSchema.safeParse('privilege_favor').success).toBe(false);
    });

    it('parses valid select-buff payloads and filters invalid ICE servers', () => {
        const payload = {
            buffId: 'color_preference',
            randomColor: 'red',
            p2DraftPoolIndices: [0, 1, 2, 3],
        } satisfies SelectBuffPayload;

        expect(selectBuffPayloadSchema.safeParse(payload).success).toBe(true);
        expect(rerollDraftPoolPayloadSchema.safeParse({ level: 2 }).success).toBe(true);
        expect(rerollDraftPoolPayloadSchema.safeParse({ level: 0 }).success).toBe(false);
        expect(
            parseRuntimeIceServers([
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: ['turn:example.com'], username: 'user', credential: 'pass' },
                { urls: 'stun:example.com', username: 'user', credential: 'pass' },
                { urls: 'https://relay.example.com' },
                { urls: 123 },
            ])
        ).toEqual([
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: ['turn:example.com'], username: 'user', credential: 'pass' },
        ]);
    });
});
