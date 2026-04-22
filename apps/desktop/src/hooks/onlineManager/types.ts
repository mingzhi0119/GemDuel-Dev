import type { GameState } from '@gemduel/shared/types';
import type { ReplayFullSync, ReplaySync } from '@gemduel/shared/replay';
import type {
    BootstrapCommand,
    GuestIntentCommand,
    HostDecisionMessage,
    NetworkSyncReason,
    RecoveryReason,
} from '@gemduel/shared/types/network';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

export interface OnlineManagerHandlers {
    onBootstrapReceived: (
        command: BootstrapCommand,
        checksum?: string,
        replayFull?: ReplayFullSync
    ) => void;
    onStateReceived: (state: GameState, reason: NetworkSyncReason, replaySync?: ReplaySync) => void;
    onGuestIntentReceived: (requestId: string, command: GuestIntentCommand) => void;
    onHostDecisionReceived: (decision: HostDecisionMessage) => void;
}

export interface OnlineManagerController {
    peerId: string;
    remotePeerId: string;
    connectionStatus: ConnectionStatus;
    isHost: boolean;
    connectToPeer: (id: string) => void;
    sendBootstrap: (command: BootstrapCommand, checksum?: string, replayFull?: ReplayFullSync) => void;
    sendGuestIntent: (requestId: string, command: GuestIntentCommand) => void;
    sendHostDecision: (decision: Omit<HostDecisionMessage, 'type' | 'version'>) => void;
    sendState: (state: GameState, reason?: NetworkSyncReason, replaySync?: ReplaySync) => void;
    requestRecovery: (reason: RecoveryReason, requestId?: string) => void;
    latency: number;
    isUnstable: boolean;
}
