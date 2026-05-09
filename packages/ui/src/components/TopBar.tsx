import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayerKey, Buff, BuffEffects } from '@gemduel/shared/types';
import { BUFFS } from '@gemduel/shared/constants';
import { AnimatedScore } from './topBar/AnimatedScore';
import { AnimatedCrownMetric } from './topBar/AnimatedCrownMetric';
import { UI_ICON_ARTWORK } from './uiIconArtwork';
import { useT } from '../i18n/LocaleProvider';
import {
    READABILITY_HUD_GLASS_CLASS,
    READABILITY_HUD_TEXT_STYLE,
    READABILITY_HUD_TREATMENT,
} from './readabilityHudStyles';

interface TopBarProps {
    p1Score: number;
    p1Crowns: number;
    p2Score: number;
    p2Crowns: number;
    playerTurnCounts: Record<PlayerKey, number>;
    activePlayer: PlayerKey;
    theme: 'light' | 'dark';
    playerBuffs?: Record<PlayerKey, Buff>;
    localPlayer?: PlayerKey;
    isOnline?: boolean;
    surfaceStyle?: React.CSSProperties;
    surfaceVariant?: string;
    readabilityTreatment?: boolean;
    desktopTypography?: boolean;
    renderTurnPointer?: boolean;
}

const TOPBAR_TURN_STYLES = `
@keyframes gemduel-topbar-pointer-rotate-y {
    0% {
        transform: translateX(-50%) perspective(260px) rotateY(0deg);
        filter: drop-shadow(0 0 9px rgba(250, 204, 21, 0.78)) drop-shadow(0 0 3px rgba(255, 255, 255, 0.45)) brightness(0.95);
    }
    50% {
        transform: translateX(-50%) perspective(260px) rotateY(180deg);
        filter: drop-shadow(0 0 15px rgba(250, 204, 21, 0.98)) drop-shadow(0 0 6px rgba(255, 255, 255, 0.62)) brightness(1.18);
    }
    100% {
        transform: translateX(-50%) perspective(260px) rotateY(360deg);
        filter: drop-shadow(0 0 9px rgba(250, 204, 21, 0.78)) drop-shadow(0 0 3px rgba(255, 255, 255, 0.45)) brightness(0.95);
    }
}

@keyframes gemduel-topbar-active-player-breathe {
    0%, 100% {
        transform: scale(1);
        filter: drop-shadow(0 0 5px rgba(250, 204, 21, 0.34));
    }
    50% {
        transform: scale(1.12);
        filter: drop-shadow(0 0 15px rgba(250, 204, 21, 0.86));
    }
}
`;

export const TopBar: React.FC<TopBarProps> = ({
    p1Score,
    p1Crowns,
    p2Score,
    p2Crowns,
    playerTurnCounts = { p1: 0, p2: 0 },
    activePlayer,
    theme,
    playerBuffs = {} as Record<PlayerKey, Buff>,
    localPlayer,
    isOnline,
    surfaceStyle,
    surfaceVariant,
    readabilityTreatment = false,
    desktopTypography = false,
    renderTurnPointer = true,
}) => {
    const t = useT();
    const topBarIconClass = 'h-[90%] w-auto max-h-[90%] min-h-0 object-contain';
    const readabilityChipClass = readabilityTreatment
        ? `${READABILITY_HUD_GLASS_CLASS} rounded-full ${
              desktopTypography ? 'px-6 py-1.5' : 'px-4 py-1 lg:px-6 lg:py-1.5'
          }`
        : '';
    const getVictoryGoals = (pid: PlayerKey) => {
        const rawBuff = playerBuffs[pid];
        const buff = (Object.values(BUFFS).find((b) => b.id === rawBuff?.id) as Buff) || rawBuff;
        const winCondition = (buff?.effects as BuffEffects)?.winCondition || {};

        return {
            points: winCondition.points || 20,
            crowns: winCondition.crowns || 10,
        };
    };

    const p1Goals = getVictoryGoals('p1');
    const p2Goals = getVictoryGoals('p2');

    const isP1Winning = p1Score >= p1Goals.points * 0.75 || p1Crowns >= p1Goals.crowns * 0.7;
    const isP2Winning = p2Score >= p2Goals.points * 0.75 || p2Crowns >= p2Goals.crowns * 0.7;
    const isMyTurn = isOnline && localPlayer === activePlayer;
    const topBarTextShadow = readabilityTreatment
        ? READABILITY_HUD_TEXT_STYLE.textShadow
        : 'var(--gd-topbar-text-shadow)';
    const readabilityTextStyle = readabilityTreatment ? READABILITY_HUD_TEXT_STYLE : {};
    const topBarGoalClass = readabilityTreatment
        ? desktopTypography
            ? 'mt-3 text-[40px] font-black leading-none'
            : 'mt-1 text-[20px] font-black leading-none lg:mt-3 lg:text-[34px]'
        : desktopTypography
          ? 'mt-4 text-[34px] font-bold leading-none'
          : 'mt-1.5 text-[15px] font-bold lg:mt-4 lg:text-2xl';
    const scoreMetricClass = desktopTypography
        ? 'text-[82px] font-black leading-none drop-shadow-lg'
        : 'text-xl lg:text-[64px] font-black leading-none drop-shadow-lg';
    const scoreGroupGapClass = desktopTypography ? 'gap-8' : 'gap-3 lg:gap-8';
    const metricGapClass = desktopTypography ? 'gap-2' : 'gap-1 lg:gap-2';
    const turnSideGapClass = desktopTypography ? 'gap-6' : 'gap-3 lg:gap-6';
    const turnPlayerLabelClass = desktopTypography
        ? 'text-[56px] font-black uppercase tracking-widest'
        : 'text-[16px] font-black uppercase tracking-widest lg:text-[42px]';
    const turnCountClass = desktopTypography
        ? 'text-[48px] font-black leading-none transition-colors'
        : 'text-[12px] font-black leading-none transition-colors lg:text-[38px]';
    const turnWordClass = desktopTypography
        ? 'text-[30px] font-black uppercase tracking-tighter'
        : 'text-[9px] font-black uppercase tracking-tighter lg:text-2xl';
    const activePointerClass = desktopTypography
        ? 'top-[calc(100%+30px)] h-[120px] w-[40px]'
        : 'top-[calc(100%+7px)] h-[30px] w-[10px] lg:top-[calc(100%+30px)] lg:h-[120px] lg:w-[40px]';
    const topBarHeightClass = desktopTypography ? 'h-[120px]' : 'h-24 lg:h-[120px]';
    const turnCoreClass = desktopTypography
        ? `flex min-w-[540px] items-center justify-center gap-12 ${readabilityChipClass}`
        : `flex min-w-[190px] items-center justify-center gap-4 lg:min-w-[430px] lg:gap-10 ${readabilityChipClass}`;
    const dividerClass = desktopTypography ? 'h-8 w-px' : 'h-5 w-px lg:h-8';

    const getWinningClass = (isWinning: boolean) => {
        if (!isWinning) return '';
        return theme === 'dark'
            ? 'drop-shadow-[0_0_12px_rgba(250,204,21,0.36)]'
            : 'drop-shadow-[0_0_10px_rgba(234,88,12,0.22)]';
    };

    const renderPoints = (pid: PlayerKey, score: number, pointGoal: number, isWinning: boolean) => (
        <div
            className={`flex h-full min-h-0 items-center ${metricGapClass} ${getWinningClass(isWinning)}`}
            data-topbar-points-group={pid}
            data-topbar-score-pressure={isWinning ? 'near-victory' : 'normal'}
            style={{
                ...readabilityTextStyle,
                color: isWinning ? 'var(--gd-topbar-gold-text)' : 'var(--gd-topbar-label-primary)',
                textShadow: topBarTextShadow,
            }}
        >
            <img
                src={UI_ICON_ARTWORK.topbarPoints}
                alt=""
                aria-hidden="true"
                data-topbar-points-artwork={pid}
                className={`${topBarIconClass} drop-shadow-lg`}
                draggable={false}
            />
            <span data-topbar-score={pid} data-value={score}>
                <AnimatedScore value={score} theme={theme} className={scoreMetricClass} />
            </span>
            <span
                className={topBarGoalClass}
                style={{
                    ...readabilityTextStyle,
                    color: 'var(--gd-topbar-goal-text)',
                    textShadow: topBarTextShadow,
                }}
            >
                /{pointGoal}
            </span>
        </div>
    );

    const renderCrowns = (pid: PlayerKey, crowns: number, crownGoal: number) => {
        const isNearGoal = crowns >= crownGoal - 3;

        return (
            <div
                className={`flex h-full min-h-0 items-center ${metricGapClass}`}
                data-topbar-crown-group={pid}
                data-topbar-crown-pressure={isNearGoal ? 'near-victory' : 'normal'}
                style={{
                    ...readabilityTextStyle,
                    color: 'var(--gd-topbar-gold-text)',
                    textShadow: topBarTextShadow,
                }}
            >
                <AnimatedCrownMetric
                    value={crowns}
                    player={pid}
                    theme={theme}
                    isNearGoal={isNearGoal}
                    iconClassName={topBarIconClass}
                    className={scoreMetricClass}
                />
                <span
                    className={topBarGoalClass}
                    style={{
                        ...readabilityTextStyle,
                        color: 'var(--gd-topbar-gold-text)',
                        textShadow: topBarTextShadow,
                    }}
                >
                    /{crownGoal}
                </span>
            </div>
        );
    };

    const renderScoreGroup = (pid: PlayerKey) => {
        const isP1 = pid === 'p1';
        const score = isP1 ? p1Score : p2Score;
        const crowns = isP1 ? p1Crowns : p2Crowns;
        const goals = isP1 ? p1Goals : p2Goals;
        const isWinning = isP1 ? isP1Winning : isP2Winning;

        return (
            <div
                data-topbar-score-group={pid}
                data-readability-hud-chip={readabilityTreatment ? 'score-group' : undefined}
                className={`flex h-full min-h-0 items-center ${scoreGroupGapClass} transition-transform duration-500 ${readabilityChipClass} ${
                    activePlayer === pid ? 'scale-105 opacity-100' : 'opacity-100'
                }`}
            >
                {renderCrowns(pid, crowns, goals.crowns)}
                {renderPoints(pid, score, goals.points, isWinning)}
            </div>
        );
    };

    const renderTurnSide = (pid: PlayerKey) => {
        const isP1 = pid === 'p1';
        const playerColor = isP1 ? 'var(--gd-topbar-p1-text)' : 'var(--gd-topbar-p2-text)';
        const isActive = activePlayer === pid;

        return (
            <div
                data-topbar-turn-side={pid}
                data-topbar-turn-active={isActive ? 'true' : 'false'}
                className={`flex items-center ${turnSideGapClass} ${isP1 ? '' : 'flex-row-reverse'}`}
                style={readabilityTextStyle}
            >
                <span className="relative flex flex-col items-center overflow-visible leading-none">
                    <span
                        data-topbar-player-label={pid}
                        data-topbar-active-player-label={isActive ? pid : undefined}
                        className={turnPlayerLabelClass}
                        style={{
                            ...readabilityTextStyle,
                            display: 'inline-block',
                            color: playerColor,
                            textShadow: topBarTextShadow,
                            transformOrigin: '50% 58%',
                            animation: isActive
                                ? 'gemduel-topbar-active-player-breathe 1.72s ease-in-out infinite'
                                : undefined,
                            willChange: isActive ? 'transform, filter' : undefined,
                        }}
                    >
                        {isP1 ? 'P1' : 'P2'}
                    </span>
                    {renderTurnPointer ? (
                        <span
                            aria-hidden="true"
                            data-topbar-turn-pointer={pid}
                            data-topbar-active-turn-pointer={isActive ? pid : undefined}
                            className={`pointer-events-none absolute left-1/2 z-[75] transition-opacity duration-300 ${activePointerClass} ${
                                isActive ? 'opacity-100' : 'opacity-0'
                            }`}
                            style={{
                                background: isActive
                                    ? 'conic-gradient(from 45deg, #8a4b05 0deg, #facc15 72deg, #fff7ad 120deg, #d97706 178deg, #78350f 225deg, #fbbf24 292deg, #8a4b05 360deg)'
                                    : 'transparent',
                                clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                                transform: isActive ? undefined : 'translateX(-50%)',
                                transformOrigin: '50% 50%',
                                transformStyle: 'preserve-3d',
                                backfaceVisibility: 'visible',
                                animation: isActive
                                    ? 'gemduel-topbar-pointer-rotate-y 1.9s linear infinite'
                                    : undefined,
                                willChange: isActive ? 'transform, filter' : undefined,
                            }}
                        />
                    ) : null}
                </span>
                <span
                    data-topbar-turn-count={pid}
                    data-value={playerTurnCounts[pid]}
                    className={turnCountClass}
                    style={{
                        ...readabilityTextStyle,
                        color: isActive ? playerColor : 'var(--gd-topbar-label-primary)',
                        textShadow: topBarTextShadow,
                    }}
                >
                    {playerTurnCounts[pid]}
                </span>
                <span
                    className={turnWordClass}
                    style={{
                        ...readabilityTextStyle,
                        color: 'var(--gd-topbar-label-muted)',
                        textShadow: topBarTextShadow,
                    }}
                >
                    {t('topBar.turn')}
                </span>
            </div>
        );
    };

    return (
        <>
            <style>{TOPBAR_TURN_STYLES}</style>
            <div
                data-presentation-anchor="topbar"
                data-topbar-surface-variant={surfaceVariant}
                data-readability-hud={readabilityTreatment ? READABILITY_HUD_TREATMENT : undefined}
                className={`relative z-[60] w-full shrink-0 border-b transition-colors duration-500 ${topBarHeightClass}`}
                style={surfaceStyle}
            >
                <div className="relative h-full w-full">
                    <div
                        data-topbar-score-anchor="p1"
                        className="absolute bottom-0 left-1/4 top-0 flex -translate-x-1/2 items-center justify-center"
                    >
                        {renderScoreGroup('p1')}
                    </div>

                    <div
                        data-topbar-center-core="true"
                        className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                    >
                        <div
                            data-topbar-turn-core="true"
                            data-readability-hud-chip={
                                readabilityTreatment ? 'turn-core' : undefined
                            }
                            className={turnCoreClass}
                        >
                            {renderTurnSide('p1')}
                            <div
                                className={dividerClass}
                                style={{ backgroundColor: 'var(--gd-topbar-divider)' }}
                            />
                            {renderTurnSide('p2')}
                        </div>
                    </div>

                    <div
                        data-topbar-score-anchor="p2"
                        className="absolute bottom-0 left-3/4 top-0 flex -translate-x-1/2 items-center justify-center"
                    >
                        {renderScoreGroup('p2')}
                    </div>

                    <AnimatePresence>
                        {isOnline && isMyTurn && (
                            <motion.div
                                initial={{ y: -50, opacity: 0, x: '-50%' }}
                                animate={{ y: 0, opacity: 1, x: '-50%' }}
                                exit={{ y: -50, opacity: 0, x: '-50%' }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                className="absolute top-full left-1/2 z-50 -mt-3 flex items-center gap-2 rounded-b-xl border-x border-b border-emerald-600 bg-emerald-500 px-6 py-1.5 shadow-lg"
                            >
                                <span className="text-[10px] font-black uppercase tracking-widest text-white">
                                    {t('topBar.yourTurn')}
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </>
    );
};
