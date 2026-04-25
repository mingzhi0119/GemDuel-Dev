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
}) => {
    const { locale } = useLocale();
    const t = useT();
    const getVictoryGoals = (pid: PlayerKey) => {
        const rawBuff = playerBuffs[pid];
        // Reconstruct to get effects
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

    // Helper for winning text color
    const getWinningClass = (isWinning: boolean) => {
        if (!isWinning) return theme === 'dark' ? 'text-white' : 'text-slate-900';
        return theme === 'dark' ? 'animate-pulse text-yellow-400' : 'animate-pulse text-orange-600';
    };

    return (
        <div
            className={`absolute top-0 left-0 w-full h-16 lg:h-20 backdrop-blur-xl border-b z-[60] transition-colors duration-500
            ${
                theme === 'dark'
                    ? 'bg-slate-950/95 border-slate-700 shadow-[0_8px_24px_rgba(0,0,0,0.3)]'
                    : 'bg-[rgba(251,252,252,0.72)] border-[rgba(15,23,42,0.08)] shadow-[0_8px_24px_rgba(15,23,42,0.06)]'
            }
        `}
        >
            <div className="relative flex h-full w-full items-center justify-between px-2 lg:px-8">
                {/* 1/4 and 3/4 Positioned Buffs (Absolute) */}
                <div className="absolute left-1/4 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
                    <TopBarBuff
                        buff={playerBuffs['p1']}
                        playerKey="p1"
                        theme={theme}
                        locale={locale}
                    />
                </div>
                <div className="absolute left-3/4 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
                    <TopBarBuff
                        buff={playerBuffs['p2']}
                        playerKey="p2"
                        theme={theme}
                        locale={locale}
                    />
                </div>

                {/* Turn Indicator (Online Only) */}
                <AnimatePresence>
                    {isOnline && isMyTurn && (
                        <motion.div
                            initial={{ y: -50, opacity: 0, x: '-50%' }}
                            animate={{ y: 0, opacity: 1, x: '-50%' }}
                            exit={{ y: -50, opacity: 0, x: '-50%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            className="absolute top-full left-1/2 -mt-3 px-6 py-1.5 rounded-b-xl shadow-lg border-x border-b bg-emerald-500 border-emerald-600 z-50 flex items-center gap-2"
                        >
                            <span className="text-[10px] font-black uppercase tracking-widest text-white animate-pulse">
                                {t('topBar.yourTurn')}
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Player 1 Overview (Left) */}
                <div
                    className={`flex items-center gap-2 lg:gap-8 transition-all duration-500 ${activePlayer === 'p1' ? 'opacity-100 scale-105' : 'opacity-100'}`}
                >
                    <span className="text-[18px] lg:text-[27px] font-black text-emerald-500 uppercase tracking-widest drop-shadow-md hidden sm:inline">
                        P1
                    </span>
                    <div className="flex flex-col items-start gap-0.5">
                        <div className="flex items-center gap-2 lg:gap-6">
                            <div
                                className={`flex items-center gap-1 lg:gap-2 ${getWinningClass(isP1Winning)}`}
                            >
                                <Trophy className="w-4 h-4 lg:w-6 lg:h-6" />
                                <span data-topbar-score="p1" data-value={p1Score}>
                                    <AnimatedScore
                                        value={p1Score}
                                        theme={theme}
                                        className="text-xl lg:text-4xl font-black drop-shadow-lg"
                                    />
                                </span>
                                <span
                                    className={`text-[15px] font-bold mt-1.5 lg:mt-2 ${theme === 'dark' ? 'text-slate-300' : 'text-stone-600'}`}
                                >
                                    /{p1Goals.points}
                                </span>
                            </div>
                            <div
                                className={`flex items-center gap-1 lg:gap-2 ${p1Crowns >= p1Goals.crowns - 3 ? 'animate-pulse text-yellow-400' : 'text-yellow-500'}`}
                            >
                                <Crown className="w-4 h-4 lg:w-6 lg:h-6" fill="currentColor" />
                                <span
                                    data-topbar-crowns="p1"
                                    data-value={p1Crowns}
                                    className="text-xl lg:text-4xl font-black drop-shadow-lg"
                                >
                                    {p1Crowns}
                                </span>
                                <span
                                    className={`text-[15px] font-bold mt-1.5 lg:mt-2 ${theme === 'dark' ? 'text-slate-300' : 'text-stone-600'}`}
                                >
                                    /{p1Goals.crowns}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Center Info */}
                <div className="flex flex-col items-center justify-center">
                    <div
                        className={`flex items-center gap-4 px-6 lg:px-10 py-2 lg:py-3 rounded-2xl transition-all duration-500
                        ${
                            theme === 'dark'
                                ? 'bg-slate-800/70 border border-slate-600 shadow-[0_8px_30px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.07)]'
                                : 'bg-white/88 border border-stone-300/90 shadow-[0_6px_18px_rgba(15,23,42,0.05)]'
                        }
                    `}
                    >
                        <div className="flex items-center gap-2">
                            <span
                                data-topbar-turn-count="p1"
                                data-value={playerTurnCounts.p1}
                                className={`text-[10px] lg:text-base font-black transition-colors ${activePlayer === 'p1' ? 'text-emerald-500' : theme === 'dark' ? 'text-slate-300' : 'text-stone-800'}`}
                            >
                                {playerTurnCounts.p1}
                            </span>
                            <span
                                className={`text-[8px] lg:text-[10px] font-black uppercase tracking-tighter ${theme === 'dark' ? 'text-slate-300/80' : 'text-stone-600'}`}
                            >
                                {t('topBar.turn')}
                            </span>
                        </div>
                        <div
                            className={`h-4 w-px ${theme === 'dark' ? 'bg-slate-600/70' : 'bg-stone-300/80'}`}
                        />
                        <div className="flex items-center gap-2">
                            <span
                                data-topbar-turn-count="p2"
                                data-value={playerTurnCounts.p2}
                                className={`text-[10px] lg:text-base font-black transition-colors ${activePlayer === 'p2' ? 'text-blue-500' : theme === 'dark' ? 'text-slate-300' : 'text-stone-800'}`}
                            >
                                {playerTurnCounts.p2}
                            </span>
                            <span
                                className={`text-[8px] lg:text-[10px] font-black uppercase tracking-tighter ${theme === 'dark' ? 'text-slate-300/80' : 'text-stone-600'}`}
                            >
                                {t('topBar.turn')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Player 2 Overview (Right) */}
                <div
                    className={`flex items-center gap-2 lg:gap-8 transition-all duration-500 flex-row-reverse ${activePlayer === 'p2' ? 'opacity-100 scale-105' : 'opacity-100'}`}
                >
                    <span className="text-[18px] lg:text-[27px] font-black text-blue-500 uppercase tracking-widest drop-shadow-md hidden sm:inline">
                        P2
                    </span>
                    <div className="flex flex-col items-end gap-0.5">
                        <div className="flex items-center gap-2 lg:gap-6 flex-row-reverse">
                            <div
                                className={`flex items-center gap-1 lg:gap-2 ${getWinningClass(isP2Winning)}`}
                            >
                                <Trophy className="w-4 h-4 lg:w-6 lg:h-6" />
                                <span data-topbar-score="p2" data-value={p2Score}>
                                    <AnimatedScore
                                        value={p2Score}
                                        theme={theme}
                                        className="text-xl lg:text-4xl font-black drop-shadow-lg"
                                    />
                                </span>
                                <span
                                    className={`text-[15px] font-bold mt-1.5 lg:mt-2 ${theme === 'dark' ? 'text-slate-300' : 'text-stone-600'}`}
                                >
                                    /{p2Goals.points}
                                </span>
                            </div>
                            <div
                                className={`flex items-center gap-1 lg:gap-2 ${p2Crowns >= p2Goals.crowns - 3 ? 'animate-pulse text-yellow-400' : 'text-yellow-500'}`}
                            >
                                <Crown className="w-4 h-4 lg:w-6 lg:h-6" fill="currentColor" />
                                <span
                                    data-topbar-crowns="p2"
                                    data-value={p2Crowns}
                                    className="text-xl lg:text-4xl font-black drop-shadow-lg"
                                >
                                    {p2Crowns}
                                </span>
                                <span
                                    className={`text-[15px] font-bold mt-1.5 lg:mt-2 ${theme === 'dark' ? 'text-slate-300' : 'text-stone-600'}`}
                                >
                                    /{p2Goals.crowns}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
