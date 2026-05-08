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
import { createSurfaceThemeSelections, type SurfaceThemeVariant } from './app/shell/surfaceTheme';
import {
    clearSurfacePreviewArtworkQuery,
    getSurfacePreviewStartMode,
    getSurfacePreviewVariant,
} from './app/shell/surfacePreviewQuery';
import type { PlayerKey } from '@gemduel/shared/types';
import type { AppVisualLabMode, MatchmakingRoute, StartSetupRoute } from './types/ui';
import { getDocumentLanguage } from '@gemduel/shared';
import { LocaleProvider } from '@gemduel/ui/i18n/LocaleProvider';
import {
    EMPTY_SEARCH_ROUTE,
    readSearchRouteState,
    writeSearchRouteHistory,
    type AppSearchRouteState,
} from './app/routes/searchRouteState';
import { useVisualLabExitReset } from './app/visual-lab/useVisualLabExitReset';

export default function GemDuelBoard() {
    const [showDebug, setShowDebug] = useState(false);
    const [isReviewing, setIsReviewing] = useState(false);
    const [showRulebook, setShowRulebook] = useState(false);
    const [searchRoute, setSearchRoute] = useState<AppSearchRouteState>(readSearchRouteState);
    const [isPeekingBoard, setIsPeekingBoard] = useState(false);
    const [persistentWinner, setPersistentWinner] = useState<PlayerKey | null>(null);
    const [showRestartConfirm, setShowRestartConfirm] = useState(false);
    const { setupRoute, matchmakingRoute, visualLabMode } = searchRoute;
    const lastGuestLaunchRoomRef = useRef<string | null>(null);
    const lastHostStartRoomRef = useRef<string | null>(null);
    const didSurfacePreviewStartRef = useRef(false);

    const { appVersion } = useRuntimeAppConfig();
    const {
        theme,
        locale,
        setLocale,
        surfaceTheme,
        setSurfaceTheme,
        soundEnabled,
        setSoundEnabled,
        lanShowOpponentPlayerZoneCards,
        setLanShowOpponentPlayerZoneCards,
        lanShowOpponentGems,
        setLanShowOpponentGems,
    } = useSettings();
    const initialSurfacePreviewVariant = useMemo(getSurfacePreviewVariant, []);
    const [surfacePreviewVariant, setSurfacePreviewVariant] = useState(
        initialSurfacePreviewVariant
    );
    const surfacePreviewStartMode = useMemo(getSurfacePreviewStartMode, []);
    const effectiveSurfaceTheme = useMemo(
        () =>
            surfacePreviewVariant
                ? createSurfaceThemeSelections(surfacePreviewVariant)
                : surfaceTheme,
        [surfacePreviewVariant, surfaceTheme]
    );
    const layout = useResponsiveLayout();
    const lan = useLanMatchmaking();

    const navigateSearchRoute = (route: AppSearchRouteState, mode: 'push' | 'replace' = 'push') => {
        writeSearchRouteHistory(route, mode);
        setSearchRoute(route);
    };

    const setStartSetupRoute = (
        next: StartSetupRoute | ((current: StartSetupRoute) => StartSetupRoute)
    ) => {
        setSearchRoute((current) => {
            const setup = typeof next === 'function' ? next(current.setupRoute) : next;
            const route: AppSearchRouteState = {
                setupRoute: setup,
                matchmakingRoute: 'none',
                visualLabMode: null,
            };
            const normalizedRoute = setup === 'none' ? EMPTY_SEARCH_ROUTE : route;
            writeSearchRouteHistory(normalizedRoute, setup === 'none' ? 'replace' : 'push');
            return normalizedRoute;
        });
    };

    const setMatchmakingRoute = (
        next: MatchmakingRoute | ((current: MatchmakingRoute) => MatchmakingRoute)
    ) => {
        setSearchRoute((current) => {
            const matchmaking = typeof next === 'function' ? next(current.matchmakingRoute) : next;
            const route: AppSearchRouteState =
                matchmaking === 'none'
                    ? EMPTY_SEARCH_ROUTE
                    : {
                          setupRoute: 'none',
                          matchmakingRoute: matchmaking,
                          visualLabMode: null,
                      };
            writeSearchRouteHistory(route, matchmaking === 'none' ? 'replace' : 'push');
            return route;
        });
    };

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
        const handlePopState = () => {
            setSearchRoute(readSearchRouteState());
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

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

    const markVisualLabOpened = useVisualLabExitReset({
        visualLabMode,
        historyLength: historyControls.historyLength,
        resetToStartPage: () => {
            handlers.importHistory([]);
            setPersistentWinner(null);
            setIsReviewing(false);
        },
    });

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
        onReplayImportSuccess: () => {
            if (lan.state.phase !== 'idle') {
                void lan.cancelSearch();
            }
            lan.clearLaunch();
            navigateSearchRoute(EMPTY_SEARCH_ROUTE, 'replace');
            setPersistentWinner(null);
            setIsReviewing(true);
            lastGuestLaunchRoomRef.current = null;
            lastHostStartRoomRef.current = null;
        },
    });

    useReplayAutoSave({
        replay: game.replay.currentReplay,
        historyLength: historyControls.historyLength,
        historySource: historyControls.historySource,
        persistReplayToProjectFolder,
    });

    useEffect(() => {
        if (
            !surfacePreviewStartMode ||
            didSurfacePreviewStartRef.current ||
            historyControls.historyLength > 0
        ) {
            return;
        }

        didSurfacePreviewStartRef.current = true;
        handlers.startGame(surfacePreviewStartMode === 'pve' ? 'PVE' : 'LOCAL_PVP', {
            useBuffs: false,
        });
    }, [handlers, historyControls.historyLength, surfacePreviewStartMode]);

    const handleRestart = () => {
        if (lan.state.phase !== 'idle') {
            void lan.cancelSearch();
        }
        navigateSearchRoute(EMPTY_SEARCH_ROUTE, 'replace');
        handlers.importHistory([]);
        setShowRestartConfirm(false);
        lastGuestLaunchRoomRef.current = null;
        lastHostStartRoomRef.current = null;
    };

    const handleSelectSurfaceTheme = (variant: SurfaceThemeVariant) => {
        clearSurfacePreviewArtworkQuery();
        setSurfacePreviewVariant(undefined);
        setSurfaceTheme(createSurfaceThemeSelections(variant));
    };

    const handleOpenVisualLab = (mode: AppVisualLabMode) => {
        markVisualLabOpened();
        navigateSearchRoute(
            {
                setupRoute: 'none',
                matchmakingRoute: 'none',
                visualLabMode: mode,
            },
            'push'
        );
    };

    const handleCloseVisualLabToStartPage = () => {
        navigateSearchRoute(EMPTY_SEARCH_ROUTE, 'replace');
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

    const startGameAndClearRoute = (
        mode: Parameters<typeof handlers.startGame>[0],
        config: Parameters<typeof handlers.startGame>[1]
    ) => {
        navigateSearchRoute(EMPTY_SEARCH_ROUTE, 'replace');
        handlers.startGame(mode, config);
    };

    return (
        <LocaleProvider locale={locale} setLocale={setLocale}>
            <GemDuelRoutes
                appVersion={appVersion}
                game={game}
                lan={lan}
                layout={layout}
                theme={theme}
                surfaceTheme={effectiveSurfaceTheme}
                ui={{
                    showDebug,
                    isReviewing,
                    showRulebook,
                    setupRoute,
                    matchmakingRoute,
                    visualLabMode,
                    isPeekingBoard,
                    persistentWinner,
                    showRestartConfirm,
                    soundEnabled,
                    lanShowOpponentPlayerZoneCards,
                    lanShowOpponentGems,
                }}
                setters={{
                    setShowDebug,
                    setIsReviewing,
                    setShowRulebook,
                    setStartSetupRoute,
                    setMatchmakingRoute,
                    setIsPeekingBoard,
                    setShowRestartConfirm,
                    setSoundEnabled,
                    setLanShowOpponentPlayerZoneCards,
                    setLanShowOpponentGems,
                }}
                callbacks={{
                    handleRestart,
                    handleDownloadReplay,
                    handleUploadReplay,
                    startGame: startGameAndClearRoute,
                    selectSurfaceTheme: handleSelectSurfaceTheme,
                    openVisualLab: handleOpenVisualLab,
                    closeVisualLabToStartPage: handleCloseVisualLabToStartPage,
                }}
            />
        </LocaleProvider>
    );
}
