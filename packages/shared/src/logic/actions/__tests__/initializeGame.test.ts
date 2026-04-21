import { describe, it, expect } from 'vitest';
import { handleInit, handleInitDraft } from '../buffActions';
import { buildStartGameAction, createGameSetupPayload } from '../../gameSetup';

describe('Game Initialization Direct', () => {
    it('handleInit should create game state', () => {
        const payload = createGameSetupPayload('LOCAL_PVP');

        const result = handleInit(null, payload);

        expect(result).toBeDefined();
        expect(result.turn).toBe('p1');
        expect(result.phase).toBe('IDLE');
        expect(result.playerBuffs.p1).toBeDefined();
        expect(result.playerBuffs.p2).toBeDefined();
    });

    it('handleInitDraft should create draft state', () => {
        const draftAction = buildStartGameAction('LOCAL_PVP', { useBuffs: true });
        if (draftAction.type !== 'INIT_DRAFT') {
            throw new Error('Expected buildStartGameAction to create INIT_DRAFT payload.');
        }

        const result = handleInitDraft(null, draftAction.payload);

        expect(result).toBeDefined();
        expect(result.phase).toBe('DRAFT_PHASE');
        expect(result.turn).toBe('p1');
        expect(result.draftPool.length).toBe(3);
        expect(result.buffLevel).toBeGreaterThanOrEqual(1);
    });
});
