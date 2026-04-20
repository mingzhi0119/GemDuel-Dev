import { useEffect, useState } from 'react';
import { GemDuelRoutes } from './app/routes/GemDuelRoutes';
import { useReplayIO } from './app/io/useReplayIO';
import { useRuntimeAppConfig } from './app/runtime/useRuntimeAppConfig';
import { useGameLogic } from './hooks/useGameLogic';
import { useResponsiveLayout } from './hooks/useResponsiveLayout';
import { useSettings } from './hooks/useSettings';
import type { PlayerKey } from './types';

export default function GemDuelBoard() {
    const [showDebug, setShowDebug] = useState(false);
    const [isReviewing, setIsReviewing] = useState(false);
    const [showRulebook, setShowRulebook] = useState(false);
    const [onlineSetup, setOnlineSetup] = useState(false);
    const [isPeekingBoard, setIsPeekingBoard] = useState(false);
    const [persistentWinner, setPersistentWinner] = useState<PlayerKey | null>(null);
    const [showRestartConfirm, setShowRestartConfirm] = useState(false);

    const { appVersion } = useRuntimeAppConfig();
    const { theme, setTheme } = useSettings();
    const layout = useResponsiveLayout();
    const game = useGameLogic(onlineSetup, undefined, isReviewing);
    const { state, handlers, historyControls } = game;

    useEffect(() => {
        if (state.winner && !persistentWinner) {
            setPersistentWinner(state.winner);
        }
    }, [state.winner, persistentWinner]);

    useEffect(() => {
        if (historyControls.historyLength === 0) {
            setPersistentWinner(null);
            setIsReviewing(false);
        }
    }, [historyControls.historyLength]);

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        document.body.dataset.theme = theme;
    }, [theme]);

    const { handleDownloadReplay, handleUploadReplay } = useReplayIO({
        appVersion,
        history: historyControls.history,
        importHistory: handlers.importHistory,
    });

    const handleRestart = () => {
        setOnlineSetup(false);
        handlers.importHistory([]);
        setShowRestartConfirm(false);
    };

    return (
        <GemDuelRoutes
            appVersion={appVersion}
            game={game}
            layout={layout}
            theme={theme}
            ui={{
                showDebug,
                isReviewing,
                showRulebook,
                onlineSetup,
                isPeekingBoard,
                persistentWinner,
                showRestartConfirm,
            }}
            setters={{
                setShowDebug,
                setIsReviewing,
                setShowRulebook,
                setOnlineSetup,
                setIsPeekingBoard,
                setShowRestartConfirm,
            }}
            callbacks={{
                handleRestart,
                handleDownloadReplay,
                handleUploadReplay,
                toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
            }}
        />
    );
}
