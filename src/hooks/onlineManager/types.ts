import type { GameState } from '../../types';
import type {
    BootstrapCommand,
    GuestIntentCommand,
    HostDecisionMessage,
    NetworkSyncReason,
    RecoveryReason,
} from '../../types/network';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';

export interface OnlineManagerHandlers {
    onBootstrapReceived: (command: BootstrapCommand, checksum?: string) => void;
    onStateReceived: (state: GameState, reason: NetworkSyncReason) => void;
    onGuestIntentReceived: (requestId: string, command: GuestIntentCommand) => void;
    onHostDecisionReceived: (decision: HostDecisionMessage) => void;
}

export interface OnlineManagerController {
    peerId: string;
    remotePeerId: string;
    connectionStatus: ConnectionStatus;
    isHost: boolean;
    connectToPeer: (id: string) => void;
    sendBootstrap: (command: BootstrapCommand, checksum?: string) => void;
    sendGuestIntent: (requestId: string, command: GuestIntentCommand) => void;
    sendHostDecision: (decision: Omit<HostDecisionMessage, 'type' | 'version'>) => void;
    sendState: (state: GameState, reason?: NetworkSyncReason) => void;
    requestRecovery: (reason: RecoveryReason, requestId?: string) => void;
    latency: number;
    isUnstable: boolean;
}
