import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { INITIAL_STATE_SKELETON } from '../../logic/initialState';
import { createGameSetupPayload } from '../../logic/gameSetup';
import { guestIntentToAction } from '../../logic/networkProtocol';
import type { GameState } from '../../types';
import type { GuestIntentCommand, HostDecisionMessage } from '../../types/network';
import { NETWORK_PROTOCOL_VERSION } from '../../types/network';
import type { OnlineManagerHandlers } from '../onlineManager/types';
import { useGameNetwork } from '../useGameNetwork';

const reportReleaseHealth = vi.fn();
const mockOnlineController = {
    peerId: 'peer-local',
    remotePeerId: 'peer-remote',
    connectionStatus: 'connected' as const,
    isHost: false,
    connectToPeer: vi.fn(),
    sendBootstrap: vi.fn(),
    sendGuestIntent: vi.fn(),
    sendHostDecision: vi.fn(),
    sendState: vi.fn(),
    requestRecovery: vi.fn(),
    latency: 0,
    isUnstable: false,
};

let latestHandlers: OnlineManagerHandlers | null = null;

vi.mock('../useOnlineManager', () => ({
    useOnlineManager: (handlers: OnlineManagerHandlers) => {
        latestHandlers = handlers;
        return mockOnlineController;
    },
}));

vi.mock('../../observability/releaseHealth', () => ({
    reportReleaseHealth: (...args: unknown[]) => reportReleaseHealth(...args),
}));

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const cloneState = (): GameState => JSON.parse(JSON.stringify(INITIAL_STATE_SKELETON)) as GameState;

const createOnlineState = (overrides: Partial<GameState> = {}): GameState => ({
    ...cloneState(),
    mode: 'ONLINE_MULTIPLAYER',
    turn: 'p2',
    isHost: false,
    activeModal: {
        type: 'PEEK',
        data: {
            cards: [],
            initiator: 'p2',
        },
    },
    ...overrides,
});

const resetOnlineControllerMocks = () => {
    mockOnlineController.connectToPeer.mockReset();
    mockOnlineController.sendBootstrap.mockReset();
    mockOnlineController.sendGuestIntent.mockReset();
    mockOnlineController.sendHostDecision.mockReset();
    mockOnlineController.sendState.mockReset();
    mockOnlineController.requestRecovery.mockReset();
};

describe('useGameNetwork', () => {
    let root: Root | null = null;
    let container: HTMLDivElement | null = null;

    beforeEach(() => {
        latestHandlers = null;
        reportReleaseHealth.mockReset();
        resetOnlineControllerMocks();
    });

    afterEach(() => {
        act(() => {
            root?.unmount();
        });
        container?.remove();
        root = null;
        container = null;
    });

    it('requests recovery when bootstrap checksum verification fails on the guest', () => {
        const localDispatch = vi.fn();
        const clearAndInit = vi.fn();
        const gameState = createOnlineState({ isHost: false });

        const Harness = () => {
            useGameNetwork(gameState, localDispatch, clearAndInit, false);
            return null;
        };

        container = document.createElement('div');
        document.body.appendChild(container);

        act(() => {
            root = createRoot(container!);
            root.render(React.createElement(Harness));
        });

        expect(latestHandlers).not.toBeNull();

        act(() => {
            latestHandlers?.onBootstrapReceived(
                {
                    kind: 'INIT',
                    setup: createGameSetupPayload('ONLINE_MULTIPLAYER', {
                        useBuffs: false,
                        isHost: true,
                    }),
                },
                'checksum-mismatch'
            );
        });

        expect(mockOnlineController.requestRecovery).toHaveBeenCalledWith('CHECKSUM_MISMATCH');
        expect(clearAndInit).not.toHaveBeenCalled();
    });

    it('requests recovery when a stale host decision arrives for a pending guest intent', () => {
        const localDispatch = vi.fn();
        const clearAndInit = vi.fn();
        const gameState = createOnlineState({ isHost: false });
        const command: GuestIntentCommand = { kind: 'CLOSE_MODAL' };
        let currentResult: ReturnType<typeof useGameNetwork> | null = null;

        const Harness = () => {
            currentResult = useGameNetwork(gameState, localDispatch, clearAndInit, false);
            return null;
        };

        container = document.createElement('div');
        document.body.appendChild(container);

        act(() => {
            root = createRoot(container!);
            root.render(React.createElement(Harness));
        });

        act(() => {
            currentResult?.networkDispatch(guestIntentToAction(command));
        });

        const [[requestId, sentCommand]] = mockOnlineController.sendGuestIntent.mock.calls as [
            [string, GuestIntentCommand],
        ];

        expect(sentCommand).toEqual(command);

        const staleDecision: HostDecisionMessage = {
            version: NETWORK_PROTOCOL_VERSION,
            type: 'HOST_DECISION',
            requestId: `${requestId}-late`,
            intentKind: command.kind,
            approved: false,
            reasonCode: 'AUTHORITY_REJECTED',
            reason: 'Late response',
        };

        act(() => {
            latestHandlers?.onHostDecisionReceived(staleDecision);
        });

        expect(mockOnlineController.requestRecovery).toHaveBeenCalledWith(
            'STALE_PACKET',
            staleDecision.requestId
        );
    });

    it('requests recovery when an approved host decision fails checksum verification', () => {
        const localDispatch = vi.fn();
        const clearAndInit = vi.fn();
        const gameState = createOnlineState({ isHost: false });
        const command: GuestIntentCommand = { kind: 'CLOSE_MODAL' };
        let currentResult: ReturnType<typeof useGameNetwork> | null = null;

        const Harness = () => {
            currentResult = useGameNetwork(gameState, localDispatch, clearAndInit, false);
            return null;
        };

        container = document.createElement('div');
        document.body.appendChild(container);

        act(() => {
            root = createRoot(container!);
            root.render(React.createElement(Harness));
        });

        act(() => {
            currentResult?.networkDispatch(guestIntentToAction(command));
        });

        const [[requestId]] = mockOnlineController.sendGuestIntent.mock.calls as [
            [string, GuestIntentCommand],
        ];

        act(() => {
            latestHandlers?.onHostDecisionReceived({
                version: NETWORK_PROTOCOL_VERSION,
                type: 'HOST_DECISION',
                requestId,
                intentKind: command.kind,
                approved: true,
                command,
                checksum: 'wrong-checksum',
            });
        });

        expect(mockOnlineController.requestRecovery).toHaveBeenCalledWith(
            'CHECKSUM_MISMATCH',
            requestId
        );
    });

    it('logs structured rejection reasons when the host rejects an out-of-turn guest intent', () => {
        const localDispatch = vi.fn();
        const clearAndInit = vi.fn();
        const gameState = createOnlineState({ isHost: true, turn: 'p1' });
        let currentResult: ReturnType<typeof useGameNetwork> | null = null;

        const Harness = () => {
            currentResult = useGameNetwork(gameState, localDispatch, clearAndInit, false);
            return null;
        };

        container = document.createElement('div');
        document.body.appendChild(container);

        act(() => {
            root = createRoot(container!);
            root.render(React.createElement(Harness));
        });

        act(() => {
            latestHandlers?.onGuestIntentReceived('req-reject', { kind: 'CLOSE_MODAL' });
        });

        expect(mockOnlineController.sendHostDecision).toHaveBeenCalledWith(
            expect.objectContaining({
                requestId: 'req-reject',
                intentKind: 'CLOSE_MODAL',
                approved: false,
                reasonCode: 'AUTHORITY_REJECTED',
            })
        );
        expect(currentResult?.online.approvalLog[0]).toMatchObject({
            requestId: 'req-reject',
            outcomeCode: 'AUTHORITY_REJECTED',
            reasonCode: 'AUTHORITY_REJECTED',
        });
        expect(localDispatch).not.toHaveBeenCalled();
    });

    it('applies approved guest intents on the host and records approval entries', () => {
        const localDispatch = vi.fn();
        const clearAndInit = vi.fn();
        const gameState = createOnlineState({ isHost: true, turn: 'p2' });
        let currentResult: ReturnType<typeof useGameNetwork> | null = null;

        const Harness = () => {
            currentResult = useGameNetwork(gameState, localDispatch, clearAndInit, false);
            return null;
        };

        container = document.createElement('div');
        document.body.appendChild(container);

        act(() => {
            root = createRoot(container!);
            root.render(React.createElement(Harness));
        });

        act(() => {
            latestHandlers?.onGuestIntentReceived('req-approve', { kind: 'CLOSE_MODAL' });
        });

        expect(localDispatch).toHaveBeenCalledWith({ type: 'CLOSE_MODAL' });
        expect(mockOnlineController.sendHostDecision).toHaveBeenCalledWith(
            expect.objectContaining({
                requestId: 'req-approve',
                intentKind: 'CLOSE_MODAL',
                approved: true,
                command: { kind: 'CLOSE_MODAL' },
                checksum: expect.any(String),
            })
        );
        expect(currentResult?.online.approvalLog[0]).toMatchObject({
            requestId: 'req-approve',
            outcomeCode: 'APPROVED',
            approved: true,
        });
    });

    it('clears pending guest intents when an authoritative sync arrives before the host decision', () => {
        const localDispatch = vi.fn();
        const clearAndInit = vi.fn();
        const gameState = createOnlineState({ isHost: false });
        const authoritativeState = createOnlineState({
            isHost: true,
            turn: 'p1',
        });
        const command: GuestIntentCommand = { kind: 'CLOSE_MODAL' };
        let currentResult: ReturnType<typeof useGameNetwork> | null = null;

        const Harness = () => {
            currentResult = useGameNetwork(gameState, localDispatch, clearAndInit, false);
            return null;
        };

        container = document.createElement('div');
        document.body.appendChild(container);

        act(() => {
            root = createRoot(container!);
            root.render(React.createElement(Harness));
        });

        act(() => {
            currentResult?.networkDispatch(guestIntentToAction(command));
        });

        const [[requestId]] = mockOnlineController.sendGuestIntent.mock.calls as [
            [string, GuestIntentCommand],
        ];

        act(() => {
            latestHandlers?.onStateReceived(authoritativeState, 'RECOVERY');
        });

        expect(localDispatch).toHaveBeenCalledWith({
            type: 'FORCE_SYNC',
            payload: {
                ...authoritativeState,
                isHost: false,
            },
        });

        act(() => {
            latestHandlers?.onHostDecisionReceived({
                version: NETWORK_PROTOCOL_VERSION,
                type: 'HOST_DECISION',
                requestId,
                intentKind: command.kind,
                approved: false,
                reasonCode: 'AUTHORITY_REJECTED',
            });
        });

        expect(mockOnlineController.requestRecovery).not.toHaveBeenCalled();
        expect(reportReleaseHealth).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'HOST_DECISION_LATE',
            })
        );
    });

    it('routes bootstrap actions through the host broadcast path', () => {
        const localDispatch = vi.fn();
        const clearAndInit = vi.fn();
        const gameState = createOnlineState({ isHost: true, turn: 'p1' });
        const initAction = {
            type: 'INIT' as const,
            payload: createGameSetupPayload('ONLINE_MULTIPLAYER', {
                useBuffs: false,
                isHost: true,
            }),
        };
        let currentResult: ReturnType<typeof useGameNetwork> | null = null;

        const Harness = () => {
            currentResult = useGameNetwork(gameState, localDispatch, clearAndInit, false);
            return null;
        };

        container = document.createElement('div');
        document.body.appendChild(container);

        act(() => {
            root = createRoot(container!);
            root.render(React.createElement(Harness));
        });

        resetOnlineControllerMocks();

        act(() => {
            currentResult?.networkDispatch(initAction);
        });

        expect(localDispatch).toHaveBeenCalledWith(initAction);
        expect(mockOnlineController.sendBootstrap).toHaveBeenCalledWith(
            expect.objectContaining({
                kind: 'INIT',
                setup: initAction.payload,
            }),
            expect.any(String)
        );
        expect(mockOnlineController.sendGuestIntent).not.toHaveBeenCalled();
    });
});
