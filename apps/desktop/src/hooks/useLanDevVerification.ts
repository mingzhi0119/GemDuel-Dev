import { useEffect, useMemo, useRef } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { reportRendererEvent } from '../observability/rendererLogger';
import type { MatchmakingRoute } from '../types/ui';
import type { LanMatchmakingState, LanPregameMode } from '@gemduel/shared/types/lan';

type LanHarnessConfig =
    | {
          enabled: false;
      }
    | {
          enabled: true;
          mode: LanPregameMode;
          profile: string;
      };

interface LanHarnessController {
    state: LanMatchmakingState;
    startSearch: () => Promise<LanMatchmakingState>;
    selectMode: (mode: LanPregameMode) => Promise<LanMatchmakingState>;
    confirmStart: () => Promise<LanMatchmakingState>;
}

interface UseLanDevVerificationOptions {
    lan: LanHarnessController;
    matchmakingRoute: MatchmakingRoute;
    setMatchmakingRoute: Dispatch<SetStateAction<MatchmakingRoute>>;
    historyLength: number;
    gameMode: string;
}

export const readLanDevVerificationConfig = (search: string | undefined): LanHarnessConfig => {
    if (!search) {
        return { enabled: false };
    }

    const params = new URLSearchParams(search);
    if (params.get('lanHarness') !== '1') {
        return { enabled: false };
    }

    const mode = params.get('lanMode');
    if (mode !== 'classic' && mode !== 'roguelike') {
        return { enabled: false };
    }

    return {
        enabled: true,
        mode,
        profile: params.get('lanProfile')?.trim() || 'local',
    };
};

export const useLanDevVerification = ({
    lan,
    matchmakingRoute,
    setMatchmakingRoute,
    historyLength,
    gameMode,
}: UseLanDevVerificationOptions) => {
    const config = useMemo(
        () =>
            readLanDevVerificationConfig(
                typeof window === 'undefined' ? undefined : window.location.search
            ),
        []
    );
    const loggedStateRef = useRef<string | null>(null);
    const startedRoomRef = useRef<string | null>(null);
    const startRequestedRoomRef = useRef<string | null>(null);

    useEffect(() => {
        if (!config.enabled || matchmakingRoute !== 'none') {
            return;
        }

        reportRendererEvent(
            {
                category: 'runtime',
                name: 'LAN_DEV_VERIFICATION_BOOTSTRAP',
                severity: 'info',
                message: 'LAN development verification harness auto-entered the LAN route.',
                context: {
                    profile: config.profile,
                    mode: config.mode,
                },
            },
            {
                consoleMessage: `[LAN-VERIFY][${config.profile}] Auto-entering LAN queue.`,
            }
        );
        setMatchmakingRoute('lan');
    }, [config, matchmakingRoute, setMatchmakingRoute]);

    useEffect(() => {
        if (!config.enabled) {
            return;
        }

        const snapshot = [
            lan.state.phase,
            lan.state.roomId ?? 'no-room',
            lan.state.localSeat ?? 'no-seat',
            lan.state.selectedMode ?? 'no-mode',
            lan.state.transportHost ? 'host' : 'guest',
        ].join(':');

        if (loggedStateRef.current === snapshot) {
            return;
        }

        loggedStateRef.current = snapshot;
        reportRendererEvent(
            {
                category: 'runtime',
                name: 'LAN_DEV_VERIFICATION_PHASE',
                severity: 'info',
                message: 'LAN development verification harness observed a LAN state transition.',
                context: {
                    profile: config.profile,
                    phase: lan.state.phase,
                    seat: lan.state.localSeat ?? null,
                    roomId: lan.state.roomId ?? null,
                    mode: lan.state.selectedMode ?? null,
                    transportHost: lan.state.transportHost,
                },
            },
            {
                consoleMessage: `[LAN-VERIFY][${config.profile}] phase=${lan.state.phase} seat=${lan.state.localSeat ?? '--'} mode=${lan.state.selectedMode ?? '--'} room=${lan.state.roomId ?? '--'}`,
            }
        );
    }, [config, lan.state]);

    useEffect(() => {
        if (
            !config.enabled ||
            matchmakingRoute !== 'lan' ||
            lan.state.phase !== 'matched' ||
            lan.state.localSeat !== 'p1' ||
            lan.state.selectedMode === config.mode
        ) {
            return;
        }

        void lan.selectMode(config.mode);
    }, [
        config,
        lan,
        lan.state.localSeat,
        lan.state.phase,
        lan.state.selectedMode,
        matchmakingRoute,
    ]);

    useEffect(() => {
        if (
            !config.enabled ||
            matchmakingRoute !== 'lan' ||
            lan.state.phase !== 'matched' ||
            lan.state.localSeat !== 'p1' ||
            lan.state.selectedMode !== config.mode ||
            !lan.state.roomId ||
            (lan.state.transportHost && !lan.state.hostPeerId)
        ) {
            return;
        }

        if (startRequestedRoomRef.current === lan.state.roomId) {
            return;
        }

        startRequestedRoomRef.current = lan.state.roomId;
        void lan.confirmStart();
    }, [
        config,
        lan,
        lan.state.localSeat,
        lan.state.phase,
        lan.state.roomId,
        lan.state.selectedMode,
        matchmakingRoute,
    ]);

    useEffect(() => {
        if (
            !config.enabled ||
            historyLength === 0 ||
            gameMode !== 'ONLINE_MULTIPLAYER' ||
            startedRoomRef.current === (lan.state.roomId ?? '__started__')
        ) {
            return;
        }

        startedRoomRef.current = lan.state.roomId ?? '__started__';
        reportRendererEvent(
            {
                category: 'runtime',
                name: 'LAN_DEV_VERIFICATION_STARTED',
                severity: 'info',
                message: 'LAN development verification harness reached an online match start.',
                context: {
                    profile: config.profile,
                    roomId: lan.state.roomId ?? null,
                    seat: lan.state.localSeat ?? null,
                    mode: config.mode,
                },
            },
            {
                consoleMessage: `[LAN-VERIFY][${config.profile}] STARTED room=${lan.state.roomId ?? 'unknown'} seat=${lan.state.localSeat ?? 'unknown'} mode=${config.mode}`,
            }
        );
    }, [config, gameMode, historyLength, lan.state.localSeat, lan.state.roomId]);
};
