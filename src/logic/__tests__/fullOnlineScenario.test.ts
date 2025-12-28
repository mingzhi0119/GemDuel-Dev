import { describe, it, expect, beforeEach } from 'vitest';
import { applyAction } from '../gameReducer';
import { INITIAL_STATE_SKELETON } from '../initialState';
import { generateGemPool, generateDeck } from '../../utils';
import { GameState, GameAction, Buff } from '../../types';

// --- Mocking Infrastructure ---

// A mock "Client" representing one player's full logic stack (Reducer + Network)
class MockClient {
    state: GameState;
    role: 'host' | 'guest';
    peerId: string;
    outbox: { to: string; action: GameAction }[] = [];

    constructor(role: 'host' | 'guest', id: string) {
        this.role = role;
        this.peerId = id;
        // Start with skeleton (like useGameLogic initial state)
        this.state = JSON.parse(JSON.stringify(INITIAL_STATE_SKELETON));

        // Host knows they are host, Guest knows they are guest (via online manager logic mock)
        // But initial state isOnline is false.
    }

    // Simulate receiving an action from the network or local UI
    dispatch(action: GameAction, source: 'local' | 'remote') {
        // 1. Intercept INIT/FLATTEN logic (simulating useGameLogic handleRemoteAction)
        if (source === 'remote') {
            if (action.type === 'INIT' || action.type === 'INIT_DRAFT') {
                // Simulate clearAndInit: replace state completely based on payload
                const newState = applyAction(null, action);
                if (newState) this.state = newState;
                return;
            }
            if (action.type === 'FLATTEN') {
                // Flatten replaces state directly
                this.state = action.payload;
                return;
            }
        }

        // 2. Standard Reducer (Handle local INIT correctly by passing null)
        let nextState;
        if (action.type === 'INIT' || action.type === 'INIT_DRAFT') {
            nextState = applyAction(null, action);
        } else {
            nextState = applyAction(this.state, action);
        }

        if (nextState) {
            this.state = nextState;
        }

        // 3. Network Broadcast (simulating useGameLogic recordAction)
        if (source === 'local') {
            // Logic: send if isOnline OR connected.
            // We assume connected for this test.
            this.outbox.push({ to: this.role === 'host' ? 'guest' : 'host', action });
        }
    }
}

describe('Full Online Scenario Integration Test', () => {
    let host: MockClient;
    let guest: MockClient;

    beforeEach(() => {
        host = new MockClient('host', 'host-id');
        guest = new MockClient('guest', 'guest-id');
    });

    // Helper to flush network messages
    const flushNetwork = () => {
        let delivered = 0;
        // Host -> Guest
        while (host.outbox.length > 0) {
            const msg = host.outbox.shift()!;
            guest.dispatch(msg.action, 'remote');
            delivered++;
        }
        // Guest -> Host
        while (guest.outbox.length > 0) {
            const msg = guest.outbox.shift()!;
            host.dispatch(msg.action, 'remote');
            delivered++;
        }
        return delivered;
    };

    it('should synchronize a full Roguelike game start sequence', () => {
        // 1. Host clicks Start Game (Roguelike Mode)
        // This generates setup data locally
        const pool = generateGemPool();
        const d1 = generateDeck(1);
        const setupPayload = {
            board: Array.from({ length: 5 }, () => Array.from({ length: 5 }, () => pool.pop()!)),
            bag: pool,
            market: { 1: d1.slice(0, 5), 2: [], 3: [] },
            decks: { 1: d1.slice(5), 2: [], 3: [] },
            isPvE: false,
            isOnline: true,
            isHost: true,
            initRandoms: { p1: {}, p2: {} },
            draftPool: [{ id: 'buff1', level: 1 } as Buff, { id: 'buff2', level: 1 } as Buff],
            buffLevel: 1,
        };

        // Host dispatches INIT_DRAFT locally
        host.dispatch({ type: 'INIT_DRAFT', payload: setupPayload }, 'local');

        // Verify Host State
        expect(host.state.gameMode).toBe('DRAFT_PHASE');
        expect(host.state.turn).toBe('p1');

        // Network Sync
        flushNetwork();

        // Verify Guest State (Should match Host exactly)
        expect(guest.state.gameMode).toBe('DRAFT_PHASE');
        expect(guest.state.turn).toBe('p1');
        expect(guest.state.draftPool.length).toBe(2);
        // Guest is not host, but state.isHost is from payload?
        // handleInitDraft copies payload. isHost in payload is true (Host's view).
        // BUT useGameLogic ignores state.isHost for role determination, it uses online.isHost.
        // So state consistency is fine.

        // 2. Host (P1) Selects Buff
        // P1 selects 'buff1'. Logic generates P2 pool indices.
        const p2Indices = [0, 1, 2, 3];
        host.dispatch(
            {
                type: 'SELECT_BUFF',
                payload: { buffId: 'buff1', randomColor: 'red', p2DraftPoolIndices: p2Indices },
            },
            'local'
        );

        // Host updates locally
        expect(host.state.playerBuffs.p1.id).toBe('buff1');
        expect(host.state.turn).toBe('p2');

        // Sync
        flushNetwork();

        // Guest updates
        expect(guest.state.playerBuffs.p1.id).toBe('buff1');
        expect(guest.state.turn).toBe('p2');
        expect(guest.state.p2DraftPool).toBeDefined();
        // Check pool sync (indices [0,1,2,3] map to first 4 buffs of level 1)
        expect(guest.state.p2DraftPool?.length).toBe(4);

        // 3. Guest (P2) Selects Buff
        // Guest must select from THEIR pool.
        const p2Buff = guest.state.p2DraftPool![0];
        guest.dispatch(
            {
                type: 'SELECT_BUFF',
                payload: { buffId: p2Buff.id, randomColor: 'blue' },
            },
            'local'
        );

        expect(guest.state.gameMode).toBe('IDLE'); // Draft over
        expect(guest.state.playerBuffs.p2.id).toBe(p2Buff.id);

        // Sync
        flushNetwork();

        expect(host.state.gameMode).toBe('IDLE');
        expect(host.state.playerBuffs.p2.id).toBe(p2Buff.id);

        // 4. Flattening (Simulated)
        // Both clients detect IDLE + history>1, so they trigger FLATTEN locally.
        // Flattening is a LOCAL housekeeping action, NOT broadcasted.
        // But we need to ensure the payload (current state) is correct.

        // Host Flattens
        const hostSnapshot = JSON.parse(JSON.stringify(host.state));
        host.dispatch({ type: 'FLATTEN', payload: hostSnapshot }, 'local'); // But wait, local actions are broadcasted by default in my mock.
        // In real app, clearAndInit calls setHistory, it DOES NOT call recordAction.
        // So FLATTEN is NOT broadcasted. It's a local reset.
        // I won't dispatch it here to avoid outbox pollution, just verify state is ready.

        expect(host.state.playerBuffs.p2.id).toBe(p2Buff.id);
        expect(host.state.extraAllocation).toBeDefined();

        // 5. Host (P1) Takes Gems
        // Now it's P1's turn again (IDLE, turn=p1)
        expect(host.state.turn).toBe('p1');

        // Find 3 gems
        const coords = [
            { r: 0, c: 0 },
            { r: 0, c: 1 },
            { r: 0, c: 2 },
        ];
        host.dispatch({ type: 'TAKE_GEMS', payload: { coords } }, 'local');

        expect(host.state.turn).toBe('p2');

        // Sync
        flushNetwork();

        expect(guest.state.turn).toBe('p2');
        expect(guest.state.board[0][0].type.id).toBe('empty'); // Gems taken

        // 6. Cross-Turn Interaction Check (Logic Level)
        // If Guest tries to play now, it should work.
        // If Guest tries to play when turn=p1, reducer might allow it (reducer doesn't check isMyTurn),
        // but UI (useGameLogic) prevents dispatch.
        // Since we are testing logic integration, we assume UI guards work (validated in previous steps).

        // Guest (P2) Takes Gems
        const coords2 = [
            { r: 1, c: 0 },
            { r: 1, c: 1 },
            { r: 1, c: 2 },
        ];
        guest.dispatch({ type: 'TAKE_GEMS', payload: { coords: coords2 } }, 'local');

        expect(guest.state.turn).toBe('p1');

        flushNetwork();

        expect(host.state.turn).toBe('p1');
        expect(host.state.board[1][0].type.id).toBe('empty');
    });
});
