import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayerKey, Buff, BuffEffects } from '@gemduel/shared/types';
import { BUFFS } from '@gemduel/shared/constants';
import { AnimatedScore } from './topBar/AnimatedScore';
import { AnimatedCrownMetric } from './topBar/AnimatedCrownMetric';
import { UI_ICON_ARTWORK } from './uiIconArtwork';
import { useT } from '../i18n/LocaleProvider';

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
}

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
}) => {
    const t = useT();
    const topBarIconClass = 'h-[90%] w-auto max-h-[90%] min-h-0 object-contain';
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
    const topBarTextShadow = 'var(--gd-topbar-text-shadow)';

    const getWinningClass = (isWinning: boolean) => {
        if (!isWinning) return '';
        return theme === 'dark'
            ? 'drop-shadow-[0_0_12px_rgba(250,204,21,0.36)]'
            : 'drop-shadow-[0_0_10px_rgba(234,88,12,0.22)]';
    };

    const renderPoints = (pid: PlayerKey, score: number, pointGoal: number, isWinning: boolean) => (
        <div
            className={`flex h-full min-h-0 items-center gap-1 lg:gap-2 ${getWinningClass(isWinning)}`}
            data-topbar-points-group={pid}
            data-topbar-score-pressure={isWinning ? 'near-victory' : 'normal'}
            style={{
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
                <AnimatedScore
                    value={score}
                    theme={theme}
                    className="text-xl lg:text-[64px] font-black leading-none drop-shadow-lg"
                />
            </span>
            <span
                className="mt-1.5 text-[15px] font-bold lg:mt-4 lg:text-2xl"
                style={{ color: 'var(--gd-topbar-goal-text)', textShadow: topBarTextShadow }}
            >
                /{pointGoal}
            </span>
        </div>
    );

    const renderCrowns = (pid: PlayerKey, crowns: number, crownGoal: number) => {
        const isNearGoal = crowns >= crownGoal - 3;

        return (
            <div
                className="flex h-full min-h-0 items-center gap-1 lg:gap-2"
                data-topbar-crown-group={pid}
                data-topbar-crown-pressure={isNearGoal ? 'near-victory' : 'normal'}
                style={{ color: 'var(--gd-topbar-gold-text)', textShadow: topBarTextShadow }}
            >
                <AnimatedCrownMetric
                    value={crowns}
                    player={pid}
                    theme={theme}
                    isNearGoal={isNearGoal}
                    iconClassName={topBarIconClass}
                    className="text-xl lg:text-[64px] font-black leading-none drop-shadow-lg"
                />
                <span
                    className="mt-1.5 text-[15px] font-bold lg:mt-4 lg:text-2xl"
                    style={{ color: 'var(--gd-topbar-goal-text)', textShadow: topBarTextShadow }}
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
                className={`flex h-full min-h-0 items-center gap-3 lg:gap-8 transition-transform duration-500 ${
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
        const activeClass = isP1 ? 'text-emerald-500' : 'text-blue-500';
        const inactiveClass = '';

        return (
            <div
                data-topbar-turn-side={pid}
                className={`flex items-baseline gap-3 lg:gap-6 ${isP1 ? '' : 'flex-row-reverse'}`}
            >
                <span
                    className={`text-[16px] font-black uppercase tracking-widest lg:text-[42px] ${
                        isP1 ? 'text-emerald-500' : 'text-blue-500'
                    }`}
                >
                    {isP1 ? 'P1' : 'P2'}
                </span>
                <span
                    data-topbar-turn-count={pid}
                    data-value={playerTurnCounts[pid]}
                    className={`text-[12px] font-black leading-none transition-colors lg:text-[38px] ${
                        activePlayer === pid ? activeClass : inactiveClass
                    }`}
                    style={
                        activePlayer === pid
                            ? { textShadow: topBarTextShadow }
                            : {
                                  color: 'var(--gd-topbar-label-primary)',
                                  textShadow: topBarTextShadow,
                              }
                    }
                >
                    {playerTurnCounts[pid]}
                </span>
                <span
                    className="text-[9px] font-black uppercase tracking-tighter lg:text-2xl"
                    style={{ color: 'var(--gd-topbar-label-muted)', textShadow: topBarTextShadow }}
                >
                    {t('topBar.turn')}
                </span>
            </div>
        );
    };

    return (
        <div
            data-presentation-anchor="topbar"
            data-topbar-surface-variant={surfaceVariant}
            className="relative z-[60] h-24 w-full shrink-0 border-b transition-colors duration-500 lg:h-[120px]"
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
                        className="flex min-w-[190px] items-center justify-center gap-4 lg:min-w-[430px] lg:gap-10"
                    >
                        {renderTurnSide('p1')}
                        <div
                            className={`h-5 w-px lg:h-8 ${
                                theme === 'dark' ? 'bg-slate-600/70' : 'bg-stone-300/80'
                            }`}
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
    );
};
