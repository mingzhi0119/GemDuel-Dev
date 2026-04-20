import type { GameAction, GameState } from '../types';
import type { BootstrapCommand, PendingGuestIntent } from '../types/network';
import { computeBootstrapChecksum } from './networkChecksums';
import { actionToBootstrapCommand, actionToGuestIntentCommand } from './networkProtocol';

export interface NetworkDispatchPlanningDependencies {
    computeChecksum?: typeof computeBootstrapChecksum;
    nextGuestRequestId?: () => string;
    toBootstrapCommand?: typeof actionToBootstrapCommand;
    toGuestIntentCommand?: typeof actionToGuestIntentCommand;
}

export interface BootstrapSyncPlan {
    command: BootstrapCommand;
    checksum?: string;
}

export type GuestDispatchBlockReason = 'NON_PROTOCOL_ACTION' | 'NOT_GUEST_TURN';

export interface NetworkDispatchPlan {
    localAction?: GameAction;
    bootstrapSync?: BootstrapSyncPlan;
    pendingGuestIntent?: PendingGuestIntent;
    blockedGuestIntentReason?: GuestDispatchBlockReason;
    shouldSkipNextHostSync: boolean;
}

export interface GuestRequestIdFactoryInput {
    now: number;
    requestCounter: number;
}

export const createGuestIntentRequestId = ({
    now,
    requestCounter,
}: GuestRequestIdFactoryInput): string => `guest-${now}-${requestCounter}`;

export const shouldSendHostStateSync = (gameState: GameState, skipNextHostSync: boolean): boolean =>
    gameState.mode === 'ONLINE_MULTIPLAYER' && gameState.isHost && !skipNextHostSync;

export const resolveNetworkDispatchPlan = (
    gameState: GameState,
    action: GameAction,
    shouldConnect: boolean,
    dependencies: NetworkDispatchPlanningDependencies = {}
): NetworkDispatchPlan => {
    const computeChecksum = dependencies.computeChecksum ?? computeBootstrapChecksum;
    const toBootstrapCommand = dependencies.toBootstrapCommand ?? actionToBootstrapCommand;
    const toGuestIntentCommand = dependencies.toGuestIntentCommand ?? actionToGuestIntentCommand;

    const bootstrapCommand = toBootstrapCommand(action);
    const buildBootstrapSync = (command: BootstrapCommand): BootstrapSyncPlan => ({
        command,
        checksum: computeChecksum(command, false) || undefined,
    });

    if (gameState.mode === 'ONLINE_MULTIPLAYER') {
        if (gameState.isHost) {
            return {
                localAction: action,
                bootstrapSync: bootstrapCommand ? buildBootstrapSync(bootstrapCommand) : undefined,
                shouldSkipNextHostSync: Boolean(bootstrapCommand),
            };
        }

        const guestIntent = toGuestIntentCommand(action);
        if (!guestIntent) {
            return {
                blockedGuestIntentReason: 'NON_PROTOCOL_ACTION',
                shouldSkipNextHostSync: false,
            };
        }

        if (gameState.turn !== 'p2') {
            return {
                blockedGuestIntentReason: 'NOT_GUEST_TURN',
                shouldSkipNextHostSync: false,
            };
        }

        return {
            pendingGuestIntent: {
                requestId: (dependencies.nextGuestRequestId ?? (() => ''))(),
                command: guestIntent,
            },
            shouldSkipNextHostSync: false,
        };
    }

    const bootstrapSync =
        bootstrapCommand && (bootstrapCommand.setup.mode === 'ONLINE_MULTIPLAYER' || shouldConnect)
            ? buildBootstrapSync(bootstrapCommand)
            : undefined;

    return {
        localAction: action,
        bootstrapSync,
        shouldSkipNextHostSync: Boolean(bootstrapSync),
    };
};
