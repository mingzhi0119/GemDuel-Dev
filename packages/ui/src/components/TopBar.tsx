import React from 'react';
import { Crown, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayerKey, Buff, BuffEffects } from '@gemduel/shared/types';
import { BUFFS } from '@gemduel/shared/constants';
import { AnimatedScore } from './topBar/AnimatedScore';
import { TopBarBuff } from './topBar/TopBarBuff';
import { useLocale, useT } from '../i18n/LocaleProvider';

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
    const { locale } = useLocale();
    const t = useT();
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

    const getWinningClass = (isWinning: boolean) => {
        if (!isWinning) return theme === 'dark' ? 'text-white' : 'text-slate-900';
        return theme === 'dark' ? 'animate-pulse text-yellow-400' : 'animate-pulse text-orange-600';
    };

    const renderPoints = (pid: PlayerKey, score: number, pointGoal: number, isWinning: boolean) => (
        <div
            className={`flex items-center gap-1 lg:gap-2 ${getWinningClass(isWinning)}`}
            data-topbar-points-group={pid}
        >
            <Trophy className="h-4 w-4 lg:h-12 lg:w-12" />
            <span data-topbar-score={pid} data-value={score}>
                <AnimatedScore
                    value={score}
                    theme={theme}
                    className="text-xl lg:text-[64px] font-black leading-none drop-shadow-lg"
                />
            </span>
            <span
                className={`mt-1.5 text-[15px] font-bold lg:mt-4 lg:text-2xl ${
                    theme === 'dark' ? 'text-slate-300' : 'text-stone-600'
                }`}
            >
                /{pointGoal}
            </span>
        </div>
    );

    const renderCrowns = (pid: PlayerKey, crowns: number, crownGoal: number) => (
        <div
            className={`flex items-center gap-1 lg:gap-2 ${
                crowns >= crownGoal - 3 ? 'animate-pulse text-yellow-400' : 'text-yellow-500'
            }`}
            data-topbar-crown-group={pid}
        >
            <Crown className="h-4 w-4 lg:h-12 lg:w-12" fill="currentColor" />
            <span
                data-topbar-crowns={pid}
                data-value={crowns}
                className="text-xl lg:text-[64px] font-black leading-none drop-shadow-lg"
            >
                {crowns}
            </span>
            <span
                className={`mt-1.5 text-[15px] font-bold lg:mt-4 lg:text-2xl ${
                    theme === 'dark' ? 'text-slate-300' : 'text-stone-600'
                }`}
            >
                /{crownGoal}
            </span>
        </div>
    );

    const renderScoreGroup = (pid: PlayerKey) => {
        const isP1 = pid === 'p1';
        const score = isP1 ? p1Score : p2Score;
        const crowns = isP1 ? p1Crowns : p2Crowns;
        const goals = isP1 ? p1Goals : p2Goals;
        const isWinning = isP1 ? isP1Winning : isP2Winning;

        return (
            <div
                data-topbar-score-group={pid}
                className={`flex items-center gap-3 lg:gap-8 transition-transform duration-500 ${
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
        const inactiveClass = theme === 'dark' ? 'text-slate-300' : 'text-stone-800';

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
                >
                    {playerTurnCounts[pid]}
                </span>
                <span
                    className={`text-[9px] font-black uppercase tracking-tighter lg:text-2xl ${
                        theme === 'dark' ? 'text-slate-300/80' : 'text-stone-600'
                    }`}
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
            className={`relative z-[60] h-24 w-full shrink-0 border-b backdrop-blur-xl transition-colors duration-500 lg:h-[120px]
            ${
                theme === 'dark'
                    ? 'bg-slate-950/95 border-slate-700 shadow-[0_8px_24px_rgba(0,0,0,0.3)]'
                    : 'bg-[rgba(251,252,252,0.72)] border-[rgba(15,23,42,0.08)] shadow-[0_8px_24px_rgba(15,23,42,0.06)]'
            }
        `}
            style={surfaceStyle}
        >
            <div className="relative h-full w-full">
                <div
                    data-topbar-buff-slot="p1"
                    className="absolute left-[37.5%] top-1/2 hidden w-[min(21vw,520px)] min-w-0 -translate-x-1/2 -translate-y-1/2 items-center justify-center md:flex"
                >
                    <TopBarBuff
                        buff={playerBuffs.p1}
                        playerKey="p1"
                        theme={theme}
                        locale={locale}
                    />
                </div>

                <div
                    data-topbar-score-anchor="p1"
                    className="absolute left-1/4 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
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
                    className="absolute left-3/4 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                >
                    {renderScoreGroup('p2')}
                </div>

                <div
                    data-topbar-buff-slot="p2"
                    className="absolute left-[62.5%] top-1/2 hidden w-[min(21vw,520px)] min-w-0 -translate-x-1/2 -translate-y-1/2 items-center justify-center md:flex"
                >
                    <TopBarBuff
                        buff={playerBuffs.p2}
                        playerKey="p2"
                        theme={theme}
                        locale={locale}
                    />
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
                            <span className="animate-pulse text-[10px] font-black uppercase tracking-widest text-white">
                                {t('topBar.yourTurn')}
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
