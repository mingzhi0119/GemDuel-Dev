import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
    ConfirmLanPregameStartPayload,
    LanLaunchPayload,
    LanMatchmakingEvent,
    LanMatchmakingState,
    LanPregameMode,
    ReportLanPeerReadyPayload,
    SelectLanPregameModePayload,
} from '@gemduel/shared/types/lan';
import { reportRendererEvent } from '../observability/rendererLogger';

const FALLBACK_STATE: LanMatchmakingState = {
    phase: 'idle',
    roomId: null,
    remoteInstanceId: null,
    remoteAddress: null,
    hostPort: null,
    transportHost: false,
    localSeat: null,
    selectedMode: null,
    hostPeerId: null,
    errorMessage: null,
    statusMessage: 'LAN duel is ready.',
};

const getBridge = () => window.electron;

const LAN_BRIDGE_ERROR_STATE: LanMatchmakingState = {
    ...FALLBACK_STATE,
    errorMessage: 'LAN matchmaking is temporarily unavailable.',
    statusMessage: 'LAN matchmaking request failed.',
};

const BROWSER_LAN_UNAVAILABLE_STATE: LanMatchmakingState = {
    ...FALLBACK_STATE,
    phase: 'error',
    errorMessage: 'LAN duel requires the Electron desktop app.',
    statusMessage: 'LAN matchmaking is not available in this browser preview.',
};

const reportLanBridgeFailure = (operation: string, error: unknown) => {
    reportRendererEvent(
        {
            category: 'runtime',
            name: 'LAN_MATCHMAKING_IPC_REJECTED',
            severity: 'warn',
            message: 'LAN matchmaking bridge request failed.',
            context: {
                operation,
            },
        },
        {
            consoleMessage: `[LAN] Matchmaking bridge request failed: ${operation}`,
            consoleDetails: error,
        }
    );
};

export const useLanMatchmaking = () => {
    const [state, setState] = useState<LanMatchmakingState>(FALLBACK_STATE);
    const [launch, setLaunch] = useState<LanLaunchPayload | null>(null);

    const refresh = useCallback(async () => {
        const bridge = getBridge();
        if (!bridge) {
            setState(BROWSER_LAN_UNAVAILABLE_STATE);
            return BROWSER_LAN_UNAVAILABLE_STATE;
        }

        try {
            const nextState = await bridge.getLanMatchmakingState();
            setState(nextState);
            return nextState;
        } catch (error) {
            reportLanBridgeFailure('refresh', error);
            setLaunch(null);
            setState(LAN_BRIDGE_ERROR_STATE);
            return LAN_BRIDGE_ERROR_STATE;
        }
    }, []);

    useEffect(() => {
        const bridge = getBridge();
        if (!bridge) {
            setState(BROWSER_LAN_UNAVAILABLE_STATE);
            return undefined;
        }

        void refresh();
        return bridge.onLanMatchmakingEvent((event: LanMatchmakingEvent) => {
            if (event.type === 'state') {
                setState(event.state);
                return;
            }

            setLaunch(event.launch);
            setState((previous) => ({
                ...previous,
                phase: 'starting',
                errorMessage: null,
                statusMessage: 'Connecting LAN duel...',
            }));
        });
    }, [refresh]);

    const startSearch = useCallback(async () => {
        const bridge = getBridge();
        if (!bridge) {
            setState(BROWSER_LAN_UNAVAILABLE_STATE);
            return BROWSER_LAN_UNAVAILABLE_STATE;
        }

        try {
            const nextState = await bridge.startLanMatchmaking();
            setLaunch(null);
            setState(nextState);
            return nextState;
        } catch (error) {
            reportLanBridgeFailure('startSearch', error);
            setLaunch(null);
            setState(LAN_BRIDGE_ERROR_STATE);
            return LAN_BRIDGE_ERROR_STATE;
        }
    }, []);

    const cancelSearch = useCallback(async () => {
        const bridge = getBridge();
        if (!bridge) {
            setState(BROWSER_LAN_UNAVAILABLE_STATE);
            return BROWSER_LAN_UNAVAILABLE_STATE;
        }

        try {
            const nextState = await bridge.cancelLanMatchmaking();
            setLaunch(null);
            setState(nextState);
            return nextState;
        } catch (error) {
            reportLanBridgeFailure('cancelSearch', error);
            setLaunch(null);
            setState(LAN_BRIDGE_ERROR_STATE);
            return LAN_BRIDGE_ERROR_STATE;
        }
    }, []);

    const selectMode = useCallback(
        async (mode: LanPregameMode) => {
            const bridge = getBridge();
            if (!bridge || !state.roomId) {
                return state;
            }

            try {
                const nextState = await bridge.selectLanPregameMode({
                    roomId: state.roomId,
                    mode,
                } satisfies SelectLanPregameModePayload);
                setState(nextState);
                return nextState;
            } catch (error) {
                reportLanBridgeFailure('selectMode', error);
                setLaunch(null);
                setState(LAN_BRIDGE_ERROR_STATE);
                return LAN_BRIDGE_ERROR_STATE;
            }
        },
        [state]
    );

    const confirmStart = useCallback(async () => {
        const bridge = getBridge();
        if (!bridge || !state.roomId) {
            return state;
        }

        try {
            const nextState = await bridge.confirmLanPregameStart({
                roomId: state.roomId,
            } satisfies ConfirmLanPregameStartPayload);
            setState(nextState);
            return nextState;
        } catch (error) {
            reportLanBridgeFailure('confirmStart', error);
            setLaunch(null);
            setState(LAN_BRIDGE_ERROR_STATE);
            return LAN_BRIDGE_ERROR_STATE;
        }
    }, [state]);

    const reportPeerReady = useCallback((payload: ReportLanPeerReadyPayload) => {
        const bridge = getBridge();
        if (!bridge) {
            return;
        }

        try {
            bridge.reportLanPeerReady(payload);
        } catch (error) {
            reportLanBridgeFailure('reportPeerReady', error);
        }
    }, []);

    const clearLaunch = useCallback(() => {
        setLaunch(null);
    }, []);

    return useMemo(
        () => ({
            state,
            launch,
            refresh,
            startSearch,
            cancelSearch,
            selectMode,
            confirmStart,
            reportPeerReady,
            clearLaunch,
        }),
        [
            cancelSearch,
            clearLaunch,
            confirmStart,
            launch,
            refresh,
            reportPeerReady,
            selectMode,
            startSearch,
            state,
        ]
    );
};
