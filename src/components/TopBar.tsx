import React from 'react';
import { Crown, Trophy, History } from 'lucide-react';
import { PlayerKey, Buff } from '../types';

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
    const getVictoryGoals = (pid: PlayerKey) => {
        const buff = playerBuffs[pid]?.effects?.winCondition || {};
        return {
            points: buff.points || 20,
            crowns: buff.crowns || 10,
        };
    };

    const p1Goals = getVictoryGoals('p1');
    const p2Goals = getVictoryGoals('p2');

    const isP1Winning = p1Score >= p1Goals.points * 0.75 || p1Crowns >= p1Goals.crowns * 0.7;
    const isP2Winning = p2Score >= p2Goals.points * 0.75 || p2Crowns >= p2Goals.crowns * 0.7;

    const isMyTurn = isOnline && localPlayer === activePlayer;

    return (
        <div
            className={`fixed top-0 left-0 w-full h-16 lg:h-20 backdrop-blur-md border-b z-[60] flex items-center justify-between px-2 lg:px-8 transition-colors duration-500
            ${theme === 'dark' ? 'bg-slate-950/90 border-slate-800' : 'bg-white/90 border-slate-200'}
        `}
        >
            {/* Turn Indicator (Online Only) */}
            {isOnline && (
                <div
                    className={`absolute top-full left-1/2 -translate-x-1/2 -mt-3 px-4 py-1 rounded-b-xl shadow-lg border-x border-b text-[10px] font-black uppercase tracking-widest transition-all duration-500 z-50
                    ${
                        isMyTurn
                            ? 'bg-emerald-500 text-white border-emerald-600 translate-y-0 opacity-100 animate-pulse'
                            : theme === 'dark'
                              ? 'bg-slate-800 text-slate-500 border-slate-700 translate-y-[-50%] opacity-0'
                              : 'bg-slate-200 text-slate-400 border-slate-300 translate-y-[-50%] opacity-0'
                    }
                `}
                >
                    Your Turn
                </div>
            )}

            {/* Player 1 Overview (Left) */}
            <div
                className={`flex items-center gap-2 lg:gap-8 transition-all duration-500 ${activePlayer === 'p1' ? 'opacity-100 scale-105' : 'opacity-100'}`}
            >
                <span className="text-xs lg:text-lg font-black text-emerald-500 uppercase tracking-widest drop-shadow-md hidden sm:inline">
                    P1
                </span>
                <div className="flex items-center gap-2 lg:gap-6">
                    <div
                        className={`flex items-center gap-1 lg:gap-2 ${isP1Winning ? 'animate-pulse text-yellow-400' : theme === 'dark' ? 'text-white' : 'text-slate-800'}`}
                    >
                        <Trophy className="w-4 h-4 lg:w-6 lg:h-6" />
                        <span className="text-xl lg:text-4xl font-black drop-shadow-lg">
                            {p1Score}
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold mt-1 lg:mt-2">
                            /{p1Goals.points}
                        </span>
                    </div>
                    <div
                        className={`flex items-center gap-1 lg:gap-2 ${p1Crowns >= p1Goals.crowns - 3 ? 'animate-pulse text-yellow-400' : 'text-yellow-500'}`}
                    >
                        <Crown className="w-4 h-4 lg:w-6 lg:h-6" fill="currentColor" />
                        <span className="text-xl lg:text-4xl font-black drop-shadow-lg">
                            {p1Crowns}
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold mt-1 lg:mt-2">
                            /{p1Goals.crowns}
                        </span>
                    </div>
                </div>
            </div>

            {/* Center Info */}
            <div className="flex flex-col items-center justify-center">
                <div
                    className={`flex items-center gap-3 px-3 lg:px-6 py-1 lg:py-2 rounded-2xl border shadow-inner transition-all duration-500
                    ${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-200/50 border-slate-300'}
                `}
                >
                    <div className="flex items-center gap-1.5">
                        <span
                            className={`text-[10px] lg:text-sm font-black transition-colors ${activePlayer === 'p1' ? 'text-emerald-500' : 'text-slate-500'}`}
                        >
                            {playerTurnCounts.p1}
                        </span>
                        <span className="text-[8px] lg:text-[10px] font-bold uppercase tracking-tighter opacity-40">
                            turn
                        </span>
                    </div>
                    <div className="h-4 w-px bg-slate-500/30" />
                    <div className="flex items-center gap-1.5">
                        <span
                            className={`text-[10px] lg:text-sm font-black transition-colors ${activePlayer === 'p2' ? 'text-blue-500' : 'text-slate-500'}`}
                        >
                            {playerTurnCounts.p2}
                        </span>
                        <span className="text-[8px] lg:text-[10px] font-bold uppercase tracking-tighter opacity-40">
                            turn
                        </span>
                    </div>
                </div>
            </div>

            {/* Player 2 Overview (Right) */}
            <div
                className={`flex items-center gap-2 lg:gap-8 transition-all duration-500 flex-row-reverse ${activePlayer === 'p2' ? 'opacity-100 scale-105' : 'opacity-100'}`}
            >
                <span className="text-xs lg:text-lg font-black text-blue-500 uppercase tracking-widest drop-shadow-md hidden sm:inline">
                    P2
                </span>
                <div className="flex items-center gap-2 lg:gap-6 flex-row-reverse">
                    <div
                        className={`flex items-center gap-1 lg:gap-2 ${isP2Winning ? 'animate-pulse text-yellow-400' : theme === 'dark' ? 'text-white' : 'text-slate-800'}`}
                    >
                        <Trophy className="w-4 h-4 lg:w-6 lg:h-6" />
                        <span className="text-xl lg:text-4xl font-black drop-shadow-lg">
                            {p2Score}
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold mt-1 lg:mt-2">
                            /{p2Goals.points}
                        </span>
                    </div>
                    <div
                        className={`flex items-center gap-1 lg:gap-2 ${p2Crowns >= p2Goals.crowns - 3 ? 'animate-pulse text-yellow-400' : 'text-yellow-500'}`}
                    >
                        <Crown className="w-4 h-4 lg:w-6 lg:h-6" fill="currentColor" />
                        <span className="text-xl lg:text-4xl font-black drop-shadow-lg">
                            {p2Crowns}
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold mt-1 lg:mt-2">
                            /{p2Goals.crowns}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
