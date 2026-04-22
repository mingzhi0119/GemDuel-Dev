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

export const useLanMatchmaking = () => {
    const [state, setState] = useState<LanMatchmakingState>(FALLBACK_STATE);
    const [launch, setLaunch] = useState<LanLaunchPayload | null>(null);

    const refresh = useCallback(async () => {
        const bridge = getBridge();
        if (!bridge) {
            setState(FALLBACK_STATE);
            return FALLBACK_STATE;
        }

        const nextState = await bridge.getLanMatchmakingState();
        setState(nextState);
        return nextState;
    }, []);

    useEffect(() => {
        const bridge = getBridge();
        if (!bridge) {
            setState(FALLBACK_STATE);
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
            return FALLBACK_STATE;
        }

        const nextState = await bridge.startLanMatchmaking();
        setLaunch(null);
        setState(nextState);
        return nextState;
    }, []);

    const cancelSearch = useCallback(async () => {
        const bridge = getBridge();
        if (!bridge) {
            return FALLBACK_STATE;
        }

        const nextState = await bridge.cancelLanMatchmaking();
        setLaunch(null);
        setState(nextState);
        return nextState;
    }, []);

    const selectMode = useCallback(
        async (mode: LanPregameMode) => {
            const bridge = getBridge();
            if (!bridge || !state.roomId) {
                return state;
            }

            const nextState = await bridge.selectLanPregameMode({
                roomId: state.roomId,
                mode,
            } satisfies SelectLanPregameModePayload);
            setState(nextState);
            return nextState;
        },
        [state]
    );

    const confirmStart = useCallback(async () => {
        const bridge = getBridge();
        if (!bridge || !state.roomId) {
            return state;
        }

        const nextState = await bridge.confirmLanPregameStart({
            roomId: state.roomId,
        } satisfies ConfirmLanPregameStartPayload);
        setState(nextState);
        return nextState;
    }, [state]);

    const reportPeerReady = useCallback((payload: ReportLanPeerReadyPayload) => {
        const bridge = getBridge();
        if (!bridge) {
            return;
        }

        bridge.reportLanPeerReady(payload);
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
