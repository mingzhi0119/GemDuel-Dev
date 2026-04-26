import { useEffect, useMemo, useRef, useState } from 'react';
import { GemDuelRoutes } from './app/routes/GemDuelRoutes';
import { useReplayAutoSave } from './app/io/useReplayAutoSave';
import { useReplayIO } from './app/io/useReplayIO';
import {
    getPersistentWinnerForUi,
    shouldAutoEnterReplayReview,
} from './app/runtime/replayReviewState';
import { useRuntimeAppConfig } from './app/runtime/useRuntimeAppConfig';
import { useGameLogic } from './hooks/useGameLogic';
import { useLanDevVerification } from './hooks/useLanDevVerification';
import { useLanMatchmaking } from './hooks/useLanMatchmaking';
import { useResponsiveLayout } from './hooks/useResponsiveLayout';
import { useSettings } from './hooks/useSettings';
import { getNextSurfaceThemeSelections } from './app/shell/surfaceTheme';
import type { PlayerKey } from '@gemduel/shared/types';
import { getDocumentLanguage } from '@gemduel/shared';
import { LocaleProvider } from '@gemduel/ui/i18n/LocaleProvider';

export default function GemDuelBoard() {
    const [showDebug, setShowDebug] = useState(false);
    const [isReviewing, setIsReviewing] = useState(false);
    const [showRulebook, setShowRulebook] = useState(false);
    const [matchmakingRoute, setMatchmakingRoute] = useState<'none' | 'online' | 'lan'>('none');
    const [isPeekingBoard, setIsPeekingBoard] = useState(false);
    const [persistentWinner, setPersistentWinner] = useState<PlayerKey | null>(null);
    const [showRestartConfirm, setShowRestartConfirm] = useState(false);
    const lastGuestLaunchRoomRef = useRef<string | null>(null);
    const lastHostStartRoomRef = useRef<string | null>(null);

    const { appVersion } = useRuntimeAppConfig();
    const { theme, setTheme, locale, setLocale, surfaceTheme, setSurfaceTheme } = useSettings();
    const layout = useResponsiveLayout();
    const lan = useLanMatchmaking();
    const lanShouldConnect =
        matchmakingRoute === 'lan' &&
        (lan.state.phase === 'matched' || lan.state.phase === 'starting');
    const targetIp =
        matchmakingRoute === 'lan'
            ? lan.state.transportHost
                ? 'localhost'
                : (lan.state.remoteAddress ?? 'localhost')
            : undefined;
    const targetPort =
        matchmakingRoute === 'lan' ? (lan.launch?.targetPort ?? lan.state.hostPort ?? 9000) : 9000;
    const game = useGameLogic(
        matchmakingRoute === 'online' || lanShouldConnect,
        targetIp,
        isReviewing,
        targetPort,
        appVersion
    );
    const { state, handlers, historyControls } = game;
    const desiredPersistentWinner = useMemo(
        () =>
            getPersistentWinnerForUi({
                winner: state.winner,
                historySource: historyControls.historySource,
                historyLength: historyControls.historyLength,
                currentIndex: historyControls.currentIndex,
            }),
        [
            historyControls.currentIndex,
            historyControls.historyLength,
            historyControls.historySource,
            state.winner,
        ]
    );

    useLanDevVerification({
        lan,
        matchmakingRoute,
        setMatchmakingRoute,
        historyLength: historyControls.historyLength,
        gameMode: state.mode,
    });

    useEffect(() => {
        setPersistentWinner((current) =>
            current === desiredPersistentWinner ? current : desiredPersistentWinner
        );
    }, [desiredPersistentWinner]);

    useEffect(() => {
        if (historyControls.historyLength === 0) {
            setPersistentWinner(null);
            setIsReviewing(false);
        }
    }, [historyControls.historyLength]);

    useEffect(() => {
        if (
            shouldAutoEnterReplayReview({
                historySource: historyControls.historySource,
                historyLength: historyControls.historyLength,
            })
        ) {
            setPersistentWinner(null);
            setIsReviewing(true);
        }
    }, [historyControls.historyLength, historyControls.historySource]);

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        document.body.dataset.theme = theme;
    }, [theme]);

    useEffect(() => {
        const documentLanguage = getDocumentLanguage(locale);
        document.documentElement.lang = documentLanguage;
        document.documentElement.dataset.lang = locale;
        document.body.dataset.lang = locale;
    }, [locale]);

    const { handleDownloadReplay, handleUploadReplay, persistReplayToProjectFolder } = useReplayIO({
        replay: game.replay.currentReplay,
        importHistory: handlers.importHistory,
    });

    useReplayAutoSave({
        replay: game.replay.currentReplay,
        historyLength: historyControls.historyLength,
        historySource: historyControls.historySource,
        persistReplayToProjectFolder,
    });

    const handleRestart = () => {
        if (lan.state.phase !== 'idle') {
            void lan.cancelSearch();
        }
        setMatchmakingRoute('none');
        handlers.importHistory([]);
        setShowRestartConfirm(false);
        lastGuestLaunchRoomRef.current = null;
        lastHostStartRoomRef.current = null;
    };

    useEffect(() => {
        if (matchmakingRoute === 'lan' && lan.state.phase === 'idle') {
            void lan.startSearch();
        }
    }, [lan, matchmakingRoute, lan.state.phase]);

    useEffect(() => {
        if (
            matchmakingRoute !== 'lan' ||
            !lan.state.transportHost ||
            !lan.state.roomId ||
            !game.online.peerId
        ) {
            return;
        }

        lan.reportPeerReady({
            roomId: lan.state.roomId,
            peerId: game.online.peerId,
        });
    }, [game.online.peerId, lan, lan.state.roomId, lan.state.transportHost, matchmakingRoute]);

    useEffect(() => {
        if (
            !lan.launch ||
            lan.launch.transportHost ||
            !game.online.peerId ||
            lastGuestLaunchRoomRef.current === lan.launch.roomId
        ) {
            return;
        }

        lastGuestLaunchRoomRef.current = lan.launch.roomId;
        game.online.connectToPeer(lan.launch.hostPeerId);
    }, [game.online, lan.launch]);

    useEffect(() => {
        if (
            !lan.launch?.transportHost ||
            game.online.connectionStatus !== 'connected' ||
            lastHostStartRoomRef.current === lan.launch.roomId
        ) {
            return;
        }

        lastHostStartRoomRef.current = lan.launch.roomId;
        handlers.startGame('ONLINE_MULTIPLAYER', {
            useBuffs: lan.launch.mode === 'roguelike',
            isHost: true,
            hostPlayer: lan.launch.hostPlayer,
        });
    }, [game.online.connectionStatus, handlers, lan.launch]);

    useEffect(() => {
        if (historyControls.historyLength > 0 && lan.launch) {
            lan.clearLaunch();
        }
    }, [historyControls.historyLength, lan]);

    return (
        <LocaleProvider locale={locale} setLocale={setLocale}>
            <GemDuelRoutes
                appVersion={appVersion}
                game={game}
                lan={lan}
                layout={layout}
                theme={theme}
                surfaceTheme={surfaceTheme}
                ui={{
                    showDebug,
                    isReviewing,
                    showRulebook,
                    matchmakingRoute,
                    isPeekingBoard,
                    persistentWinner,
                    showRestartConfirm,
                }}
                setters={{
                    setShowDebug,
                    setIsReviewing,
                    setShowRulebook,
                    setMatchmakingRoute,
                    setIsPeekingBoard,
                    setShowRestartConfirm,
                }}
                callbacks={{
                    handleRestart,
                    handleDownloadReplay,
                    handleUploadReplay,
                    toggleTheme: () =>
                        setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
                    cycleSurfaceTheme: () =>
                        setSurfaceTheme((current) => getNextSurfaceThemeSelections(current)),
                }}
            />
        </LocaleProvider>
    );
}
