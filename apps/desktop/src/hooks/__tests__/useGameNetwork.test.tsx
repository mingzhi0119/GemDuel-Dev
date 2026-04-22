import React from 'react';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { INITIAL_STATE_SKELETON } from '@gemduel/shared/logic/initialState';
import { createGameSetupPayload } from '@gemduel/shared/logic/gameSetup';
import {
    computeBootstrapChecksum,
    computeGuestIntentChecksum,
} from '@gemduel/shared/logic/networkChecksums';
import { guestIntentToAction } from '@gemduel/shared/logic/networkProtocol';
import type { GameAction, GameState, UiStatusNotice } from '@gemduel/shared/types';
import type {
    GuestIntentCommand,
    HostApprovalLogEntry,
    HostDecisionMessage,
} from '@gemduel/shared/types/network';
import { NETWORK_PROTOCOL_VERSION } from '@gemduel/shared/types/network';
import type { OnlineManagerHandlers } from '../onlineManager/types';
import type { OnlineManagerController } from '../onlineManager/types';
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

type GameNetworkResult = {
    online: OnlineManagerController & {
        approvalLog: HostApprovalLogEntry[];
        statusNotice: UiStatusNotice | null;
    };
    networkDispatch: (action: GameAction) => void;
};

let latestHandlers: OnlineManagerHandlers | null = null;
let latestEnabled = false;
let latestTargetIp = 'localhost';

vi.mock('../useOnlineManager', () => ({
    useOnlineManager: (
        handlers: OnlineManagerHandlers,
        enabled: boolean,
        _getCurrentStateRef?: () => GameState,
        targetIP?: string
    ) => {
        latestHandlers = handlers;
        latestEnabled = enabled;
        latestTargetIp = targetIP ?? 'localhost';
        return mockOnlineController;
    },
}));

vi.mock('@gemduel/shared/observability/releaseHealth', () => ({
    reportReleaseHealth: (...args: unknown[]) => reportReleaseHealth(...args),
}));

(
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }
).IS_REACT_ACT_ENVIRONMENT = true;

const cloneState = (): GameState => JSON.parse(JSON.stringify(INITIAL_STATE_SKELETON)) as GameState;

const createOnlineState = (overrides: Partial<GameState> = {}): GameState => {
    const isHost = overrides.isHost ?? false;
    const hostPlayer = overrides.hostPlayer ?? 'p1';
    const localPlayer =
        overrides.localPlayer ?? (isHost ? hostPlayer : hostPlayer === 'p1' ? 'p2' : 'p1');

    return {
        ...cloneState(),
        mode: 'ONLINE_MULTIPLAYER',
        isHost,
        hostPlayer,
        localPlayer,
        turn: overrides.turn ?? localPlayer,
        activeModal: {
            type: 'PEEK',
            data: {
                cards: [],
                initiator: localPlayer,
            },
        },
        ...overrides,
    };
};

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
        latestEnabled = false;
        latestTargetIp = 'localhost';
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

    it('applies bootstrap actions when the guest checksum matches the host broadcast', () => {
        const localDispatch = vi.fn();
        const clearAndInit = vi.fn();
        const gameState = createOnlineState({ isHost: false });
        const bootstrapCommand = {
            kind: 'INIT' as const,
            setup: createGameSetupPayload('ONLINE_MULTIPLAYER', {
                useBuffs: false,
                isHost: true,
            }),
        };

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

        act(() => {
            latestHandlers?.onBootstrapReceived(
                bootstrapCommand,
                computeBootstrapChecksum(bootstrapCommand, false) ?? undefined
            );
        });

        expect(mockOnlineController.requestRecovery).not.toHaveBeenCalled();
        expect(clearAndInit).toHaveBeenCalledWith({
            type: 'INIT',
            payload: expect.objectContaining({
                isHost: false,
            }),
        });
    });

    it('requests recovery when a stale host decision arrives for a pending guest intent', () => {
        const localDispatch = vi.fn();
        const clearAndInit = vi.fn();
        const gameState = createOnlineState({ isHost: false });
        const command: GuestIntentCommand = { kind: 'CLOSE_MODAL' };
        let currentResult: GameNetworkResult | null = null;

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
        let currentResult: GameNetworkResult | null = null;

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

    it('accepts verified host decisions for the pending guest intent without requesting recovery', () => {
        const localDispatch = vi.fn();
        const clearAndInit = vi.fn();
        const gameState = createOnlineState({ isHost: false });
        const command: GuestIntentCommand = { kind: 'CLOSE_MODAL' };
        let currentResult: GameNetworkResult | null = null;

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
                checksum: computeGuestIntentChecksum(gameState, command) ?? 'missing-checksum',
            });
        });

        expect(mockOnlineController.requestRecovery).not.toHaveBeenCalled();
        expect(reportReleaseHealth).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'HOST_DECISION_VERIFIED',
            })
        );
    });

    it('logs structured rejection reasons when the host rejects an out-of-turn guest intent', () => {
        const localDispatch = vi.fn();
        const clearAndInit = vi.fn();
        const gameState = createOnlineState({ isHost: true, turn: 'p1' });
        let currentResult: GameNetworkResult | null = null;

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
                reasonCode: 'NOT_GUEST_TURN',
            })
        );
        expect(currentResult).not.toBeNull();
        expect(currentResult!.online.approvalLog[0]).toMatchObject({
            requestId: 'req-reject',
            outcomeCode: 'AUTHORITY_REJECTED',
            reasonCode: 'NOT_GUEST_TURN',
        });
        expect(localDispatch).not.toHaveBeenCalled();
    });

    it('surfaces a mapped UI notice when the guest renderer blocks an out-of-turn action', () => {
        const localDispatch = vi.fn();
        const clearAndInit = vi.fn();
        const gameState = createOnlineState({ isHost: false, turn: 'p1' });
        let currentResult: GameNetworkResult | null = null;

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
            currentResult?.networkDispatch({ type: 'CLOSE_MODAL' });
        });

        expect(mockOnlineController.sendGuestIntent).not.toHaveBeenCalled();
        expect(currentResult).not.toBeNull();
        expect(currentResult!.online.statusNotice).toMatchObject({
            code: 'NOT_GUEST_TURN',
            message: 'It is not the guest turn yet.',
            severity: 'warn',
        });
        expect(reportReleaseHealth).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'GUEST_INTENT_BLOCKED',
                context: expect.objectContaining({
                    reasonCode: 'NOT_GUEST_TURN',
                }),
            })
        );
    });

    it('ignores guest-intent callbacks when the current renderer is not the host authority', () => {
        const localDispatch = vi.fn();
        const clearAndInit = vi.fn();
        const gameState = createOnlineState({ isHost: false, turn: 'p2' });

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

        act(() => {
            latestHandlers?.onGuestIntentReceived('req-ignored', { kind: 'CLOSE_MODAL' });
        });

        expect(localDispatch).not.toHaveBeenCalled();
        expect(mockOnlineController.sendHostDecision).not.toHaveBeenCalled();
    });

    it('applies approved guest intents on the host and records approval entries', () => {
        const localDispatch = vi.fn();
        const clearAndInit = vi.fn();
        const gameState = createOnlineState({
            isHost: true,
            turn: 'p2',
            activeModal: {
                type: 'PEEK',
                data: {
                    cards: [],
                    initiator: 'p2',
                },
            },
        });
        let currentResult: GameNetworkResult | null = null;

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
        expect(currentResult).not.toBeNull();
        expect(currentResult!.online.approvalLog[0]).toMatchObject({
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
        let currentResult: GameNetworkResult | null = null;

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
                localPlayer: 'p2',
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

    it('disables the online manager when neither multiplayer mode nor explicit connect is requested', () => {
        const localDispatch = vi.fn();
        const clearAndInit = vi.fn();
        const gameState = createOnlineState({
            mode: 'LOCAL_PVP',
        });

        const Harness = () => {
            useGameNetwork(gameState, localDispatch, clearAndInit, false, '10.0.0.42');
            return null;
        };

        container = document.createElement('div');
        document.body.appendChild(container);

        act(() => {
            root = createRoot(container!);
            root.render(React.createElement(Harness));
        });

        expect(latestEnabled).toBe(false);
        expect(latestTargetIp).toBe('10.0.0.42');
    });

    it('blocks non-protocol guest actions before they leave the multiplayer boundary', () => {
        const localDispatch = vi.fn();
        const clearAndInit = vi.fn();
        const gameState = createOnlineState({ isHost: false, turn: 'p2' });
        let currentResult: GameNetworkResult | null = null;
        const initAction = {
            type: 'INIT' as const,
            payload: createGameSetupPayload('ONLINE_MULTIPLAYER', {
                useBuffs: false,
                isHost: true,
            }),
        };

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
            currentResult?.networkDispatch(initAction);
        });

        expect(mockOnlineController.sendGuestIntent).not.toHaveBeenCalled();
        expect(currentResult).not.toBeNull();
        expect(currentResult!.online.statusNotice).toMatchObject({
            code: 'NON_PROTOCOL_ACTION',
            severity: 'warn',
        });
        expect(reportReleaseHealth).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'GUEST_INTENT_BLOCKED',
                context: expect.objectContaining({
                    reasonCode: 'NON_PROTOCOL_ACTION',
                }),
            })
        );
    });

    it('skips exactly one host sync after bootstrap and resumes on the next state update', () => {
        const localDispatch = vi.fn();
        const clearAndInit = vi.fn();
        let currentGameState = createOnlineState({
            isHost: true,
            turn: 'p1',
        });
        let currentResult: ReturnType<typeof useGameNetwork> | null = null;
        const initAction = {
            type: 'INIT' as const,
            payload: createGameSetupPayload('ONLINE_MULTIPLAYER', {
                useBuffs: false,
                isHost: true,
            }),
        };

        const Harness = () => {
            currentResult = useGameNetwork(currentGameState, localDispatch, clearAndInit, false);
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

        expect(mockOnlineController.sendBootstrap).toHaveBeenCalledTimes(1);
        expect(mockOnlineController.sendState).not.toHaveBeenCalled();

        currentGameState = createOnlineState({
            isHost: true,
            turn: 'p2',
        });

        act(() => {
            root?.render(React.createElement(Harness));
        });

        expect(mockOnlineController.sendState).not.toHaveBeenCalled();

        currentGameState = createOnlineState({
            isHost: true,
            turn: 'p1',
            extraPoints: { p1: 1, p2: 0 },
        });

        act(() => {
            root?.render(React.createElement(Harness));
        });

        expect(mockOnlineController.sendState).toHaveBeenCalledWith(
            expect.objectContaining({
                isHost: true,
                turn: 'p1',
            }),
            'TURN_SYNC'
        );
    });
});
