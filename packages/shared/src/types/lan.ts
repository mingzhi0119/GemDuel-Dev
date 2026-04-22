import type { PlayerKey } from './domain-core';

export const LAN_DISCOVERY_PROTOCOL_VERSION = 1 as const;

export type LanMatchPhase = 'idle' | 'searching' | 'matched' | 'starting' | 'error';
export type LanPregameMode = 'classic' | 'roguelike';

export interface LanMatchmakingState {
    phase: LanMatchPhase;
    roomId: string | null;
    remoteInstanceId: string | null;
    remoteAddress: string | null;
    hostPort: number | null;
    transportHost: boolean;
    localSeat: PlayerKey | null;
    selectedMode: LanPregameMode | null;
    hostPeerId: string | null;
    errorMessage: string | null;
    statusMessage: string;
}

export interface LanLaunchPayload {
    roomId: string;
    targetIP: string;
    targetPort: number;
    hostPeerId: string;
    transportHost: boolean;
    hostPlayer: PlayerKey;
    mode: LanPregameMode;
}

export interface ReportLanPeerReadyPayload {
    roomId: string;
    peerId: string;
}

export interface SelectLanPregameModePayload {
    roomId: string;
    mode: LanPregameMode;
}

export interface ConfirmLanPregameStartPayload {
    roomId: string;
}

export type LanMatchmakingEvent =
    | {
          type: 'state';
          state: LanMatchmakingState;
      }
    | {
          type: 'launch';
          launch: LanLaunchPayload;
      };

export type LanDiscoveryPacket =
    | {
          kind: 'SEARCH';
          protocolVersion: typeof LAN_DISCOVERY_PROTOCOL_VERSION;
          appVersion: string;
          instanceId: string;
      }
    | {
          kind: 'MATCH_ASSIGN';
          protocolVersion: typeof LAN_DISCOVERY_PROTOCOL_VERSION;
          appVersion: string;
          instanceId: string;
          roomId: string;
          hostInstanceId: string;
          guestInstanceId: string;
          hostAddress: string;
          hostPort: number;
          hostNonce: string;
      }
    | {
          kind: 'MATCH_ACK';
          protocolVersion: typeof LAN_DISCOVERY_PROTOCOL_VERSION;
          appVersion: string;
          instanceId: string;
          roomId: string;
          hostInstanceId: string;
          guestInstanceId: string;
          guestNonce: string;
      }
    | {
          kind: 'SESSION_HEARTBEAT';
          protocolVersion: typeof LAN_DISCOVERY_PROTOCOL_VERSION;
          appVersion: string;
          instanceId: string;
          roomId: string;
          hostInstanceId: string;
          guestInstanceId: string;
          hostAddress: string;
          hostPort: number;
          hostNonce: string;
          guestNonce?: string;
          hostPlayer?: PlayerKey;
          hostPeerId?: string;
          selectedMode?: LanPregameMode;
      }
    | {
          kind: 'SELECT_MODE';
          protocolVersion: typeof LAN_DISCOVERY_PROTOCOL_VERSION;
          appVersion: string;
          instanceId: string;
          roomId: string;
          hostInstanceId: string;
          guestInstanceId: string;
          mode: LanPregameMode;
      }
    | {
          kind: 'START_REQUEST';
          protocolVersion: typeof LAN_DISCOVERY_PROTOCOL_VERSION;
          appVersion: string;
          instanceId: string;
          roomId: string;
          hostInstanceId: string;
          guestInstanceId: string;
      }
    | {
          kind: 'START_READY';
          protocolVersion: typeof LAN_DISCOVERY_PROTOCOL_VERSION;
          appVersion: string;
          instanceId: string;
          roomId: string;
          hostInstanceId: string;
          guestInstanceId: string;
          hostAddress: string;
          hostPort: number;
          hostPeerId: string;
          hostPlayer: PlayerKey;
          mode: LanPregameMode;
      }
    | {
          kind: 'CANCEL';
          protocolVersion: typeof LAN_DISCOVERY_PROTOCOL_VERSION;
          appVersion: string;
          instanceId: string;
          roomId: string;
          hostInstanceId?: string;
          guestInstanceId?: string;
      };
